import React, { useState } from 'react';
import { Language } from '../types';
import { translations } from '../lib/i18n';
import { apiAdapter } from '../services/apiAdapter';
import { NOOR_ASSISTANT_KNOWLEDGE_BASE, findMatchingFaqAnswer } from '../data/assistantKnowledge';
import { Bot, Send, X, Sparkles, Loader2, HelpCircle } from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const t = translations[lang];

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text:
        lang === 'ar'
          ? 'مرحباً بك في المساعد الذكي لمنصة "نور الأماني". كيف يمكنني مساعدتك اليوم في الاستفسار عن محرك العدالة، قطاعات المنصة، أو طريقة تقديم القنوات الإغاثية؟'
          : 'Welcome to Noor Al-Amani AI Assistant. How can I assist you with platform sectors, verification, or FAIR engine rules today?',
    },
  ]);

  if (!isOpen) return null;

  const handleSendPrompt = async (textToSend?: string) => {
    const finalPrompt = textToSend || prompt;
    if (!finalPrompt.trim() || loading) return;

    // Add user message
    const userMsg = { role: 'user' as const, text: finalPrompt };
    setMessages((prev) => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      // Step 1: Check knowledge base first for instant exact response
      const matchedAnswer = findMatchingFaqAnswer(finalPrompt);
      if (matchedAnswer) {
        setMessages((prev) => [...prev, { role: 'assistant', text: matchedAnswer }]);
        setLoading(false);
        return;
      }

      // Step 2: Query API fallback
      const result = await apiAdapter.queryAiAssistant({
        prompt: finalPrompt,
        language: lang,
      });

      const reply = result.response || (lang === 'ar' ? 'تعذر الحصول على إجابة من المساعد حالياً.' : 'Failed to retrieve response.');
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      console.error('AI Assistant Error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: lang === 'ar' ? 'حدث خطأ أثناء الاتصال بالخادم الذكي.' : 'An error occurred while connecting to AI Assistant.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = lang === 'ar'
    ? NOOR_ASSISTANT_KNOWLEDGE_BASE.map((k) => k.question)
    : [
        'How does the Fair Opportunity Engine work?',
        'What are the rules for the Jasmine Sector?',
        'How do I upgrade channel verification to Platinum?',
        'Explain the publisher lifecycle stages',
      ];

  return (
    <div className="fixed inset-0 z-[100000] bg-slate-950/80 backdrop-blur-sm flex justify-end" style={{ zIndex: 100000 }}>
      <div className="w-full max-w-md bg-slate-900 border-r md:border-l border-slate-800 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{t.aiModalTitle}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <p className="text-[10px] text-slate-400 font-mono">
                Powered by Gemini 3.6 Flash
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Suggestions Chips */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800/80 overflow-x-auto flex items-center gap-1.5 text-[11px]">
          {quickPrompts.map((q) => (
            <button
              key={q}
              onClick={() => handleSendPrompt(q)}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg whitespace-nowrap transition border border-slate-700/60 shrink-0"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Messages */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-br-none shadow-md'
                    : 'bg-slate-950 text-slate-200 border border-slate-800 rounded-bl-none shadow'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-950 text-slate-400 p-3 rounded-2xl border border-slate-800 flex items-center gap-2 text-xs">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>{t.aiThinking}</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950">
          <div className="relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
              placeholder={t.aiPromptPlaceholder}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-4 pl-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={() => handleSendPrompt()}
              disabled={loading || !prompt.trim()}
              className="absolute left-2 top-1.5 p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

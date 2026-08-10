import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Language } from '../types';
import { translations } from '../lib/i18n';
import { apiAdapter } from '../services/apiAdapter';
import {
  NOOR_ALAMANI_ASSISTANT_GUIDE,
  NOOR_ASSISTANT_KNOWLEDGE_BASE,
  findMatchingFaqAnswer,
} from '../data/assistantKnowledge';
import {
  Bot,
  Send,
  X,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  BookOpen,
  HelpCircle,
  Search,
  MessageSquare,
  ShieldCheck,
  Check,
} from 'lucide-react';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

interface UnifiedQA {
  id: string;
  question: string;
  answer: string;
  category: 'sovereign' | 'faq';
  categoryLabel: string;
  keywords?: string[];
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAccordionOpen, setIsAccordionOpen] = useState<boolean>(true);
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('qa-01');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'sovereign' | 'faq'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: isAr
        ? 'مرحباً بك في المساعد الذكي لمنصة "نور الأماني". أنا هنا لإرشادك وتأمين تجربتك ضمن بيئة رقمية نقية ومحمية (Zero UI Bloat). يمكنك استعراض دليلي المعرفي التفاعلي بالأكورديون أو طرح أي سؤال مباشر.'
        : 'Welcome to Noor Al-Amani AI Assistant. I am here to guide your sovereign digital experience in a pure, protected environment. You can explore my interactive Q&A accordion guide or ask any direct question.',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Unified Knowledge Base from assistantKnowledge.ts
  const knowledgeItems = useMemo<UnifiedQA[]>(() => {
    const guideItems: UnifiedQA[] = NOOR_ALAMANI_ASSISTANT_GUIDE.map((g) => ({
      id: g.id,
      question: g.question,
      answer: g.answer,
      category: 'sovereign',
      categoryLabel: isAr ? 'المنعة الذاتية والسيادة' : 'Immunity & Sovereignty',
    }));

    const faqItems: UnifiedQA[] = NOOR_ASSISTANT_KNOWLEDGE_BASE.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      category: 'faq',
      categoryLabel: isAr ? 'الأسئلة الشائعة والحوكمة' : 'FAQ & Governance',
      keywords: f.keywords,
    }));

    return [...guideItems, ...faqItems];
  }, [isAr]);

  // Filtered QA items based on active category and search query
  const filteredKnowledge = useMemo(() => {
    return knowledgeItems.filter((item) => {
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase().trim();
      const matchInQuestion = item.question.toLowerCase().includes(q);
      const matchInAnswer = item.answer.toLowerCase().includes(q);
      const matchInKeywords = item.keywords?.some((kw) => kw.toLowerCase().includes(q));

      return matchInQuestion || matchInAnswer || matchInKeywords;
    });
  }, [knowledgeItems, activeCategory, searchQuery]);

  // Auto-scroll chat on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, isOpen]);

  // Focus input & setup Escape key handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  const handleSendPrompt = useCallback(async (textToSend?: string) => {
    const finalPrompt = textToSend || prompt;
    if (!finalPrompt.trim() || loading) return;

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
        language: isAr ? 'ar' : 'en',
      });

      const reply =
        result.response ||
        (isAr
          ? 'تعذر الحصول على إجابة من المساعد حالياً.'
          : 'Failed to retrieve response from assistant.');
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: isAr
            ? 'حدث خطأ أثناء الاتصال بالخادم الذكي.'
            : 'An error occurred while connecting to AI Assistant.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [prompt, loading, isAr]);

  const toggleAccordion = useCallback((e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsAccordionOpen((prev) => !prev);
  }, []);

  const handleToggleFaqItem = useCallback((id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  }, []);

  const handleCopyAnswer = useCallback((id: string, text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-end z-[100000] animate-fade-in"
      style={{ zIndex: 100000 }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="ai-drawer-title"
      aria-describedby="ai-drawer-desc"
    >
      {/* Backdrop click to close */}
      <div
        className="absolute inset-0 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        id="AIAssistantDrawer-container"
        className="relative w-full max-w-md sm:max-w-lg bg-slate-900 border-r md:border-l border-slate-800 h-[100dvh] flex flex-col shadow-2xl z-10 overflow-hidden"
      >
        {/* Header */}
        <div className="p-3.5 sm:p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 id="ai-drawer-title" className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{t.aiModalTitle}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              </h3>
              <p id="ai-drawer-desc" className="text-[10px] text-emerald-400 font-mono">
                {isAr ? 'الدرع المعرفي السيادي • دليل الأكورديون التفاعلي' : 'Sovereign Guide • Interactive Accordion'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label={isAr ? 'إغلاق المساعد' : 'Close Assistant'}
            className="min-w-[44px] min-h-[44px] flex items-center justify-center text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/80 active:scale-95 transition touch-manipulation cursor-pointer select-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Accordion Knowledge Base Section */}
        <div className="bg-slate-950/90 border-b border-slate-800/90 shrink-0">
          {/* Header Bar Toggle */}
          <button
            type="button"
            onClick={toggleAccordion}
            aria-expanded={isAccordionOpen}
            aria-controls="assistant-guide-accordion-content"
            className="w-full px-4 py-3 min-h-[48px] flex items-center justify-between gap-2 text-xs font-semibold text-slate-200 hover:text-amber-300 active:text-amber-300 bg-slate-950/90 hover:bg-slate-900/90 transition-colors duration-150 select-none cursor-pointer touch-manipulation active:bg-slate-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          >
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">
                {isAr ? 'دليل الاستفسارات السيادية وقاعدة المعرفة' : 'Sovereign Q&A Knowledge Base'}
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                {filteredKnowledge.length}
              </span>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-slate-400">
              <span className="text-[10px] hidden sm:inline text-slate-500 font-normal">
                {isAccordionOpen ? (isAr ? 'طَي الأكورديون' : 'Collapse') : (isAr ? 'عرض الأسئلة' : 'Expand')}
              </span>
              {isAccordionOpen ? (
                <ChevronUp className="w-4 h-4 text-amber-400 shrink-0 transition-transform duration-200" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200" />
              )}
            </div>
          </button>

          {/* Accordion Expandable Content Panel */}
          <div
            id="assistant-guide-accordion-content"
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
              isAccordionOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
            }`}
          >
            <div className="overflow-hidden">
              <div className="p-3 pt-2 border-t border-slate-800/80 bg-slate-900/60 space-y-2.5">
                {/* Search Box & Category Selector */}
                <div className="space-y-2">
                  <div className="relative flex items-center">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={isAr ? 'ابحث في الأسئلة والمعرفة...' : 'Search Q&A knowledge...'}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/70 min-h-[38px] touch-manipulation"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute left-2 text-slate-500 hover:text-slate-300 p-1 rounded cursor-pointer touch-manipulation"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Category Filter Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-0.5 scrollbar-none text-[11px] select-none">
                    <button
                      type="button"
                      onClick={() => setActiveCategory('all')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer touch-manipulation min-h-[32px] shrink-0 ${
                        activeCategory === 'all'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {isAr ? 'الكل' : 'All'} ({knowledgeItems.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCategory('sovereign')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer touch-manipulation min-h-[32px] shrink-0 ${
                        activeCategory === 'sovereign'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {isAr ? 'المنعة والسيادة' : 'Immunity'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveCategory('faq')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer touch-manipulation min-h-[32px] shrink-0 ${
                        activeCategory === 'faq'
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                          : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {isAr ? 'الأسئلة الشائعة' : 'FAQ Base'}
                    </button>
                  </div>
                </div>

                {/* Accordion Q&A List with explicit faq-list class for selector targeting */}
                <div className="faq-list max-h-[220px] sm:max-h-[260px] overflow-y-auto space-y-2 pr-1 overscroll-contain [scrollbar-width:thin] [scrollbar-color:#334155_transparent]">
                  {filteredKnowledge.length === 0 ? (
                    <div className="p-4 text-center text-slate-400 text-xs bg-slate-950/60 rounded-xl border border-slate-800">
                      {isAr ? 'لم يتم العثور على سؤال مطابق للبحث.' : 'No matching questions found.'}
                    </div>
                  ) : (
                    filteredKnowledge.map((item) => {
                      const isExpanded = expandedFaqId === item.id;
                      return (
                        <div
                          key={item.id}
                          className="rounded-xl border border-slate-800/90 bg-slate-950/80 overflow-hidden transition-all duration-200 hover:border-emerald-500/40 shadow-sm"
                        >
                          {/* Accordion Item Header Trigger */}
                          <button
                            type="button"
                            onClick={() => handleToggleFaqItem(item.id)}
                            aria-expanded={isExpanded}
                            className="w-full text-start flex items-center justify-between gap-2.5 p-3 min-h-[44px] text-slate-200 hover:text-emerald-300 active:text-emerald-300 text-xs font-medium cursor-pointer touch-manipulation select-none active:bg-slate-900/90 focus:outline-none"
                          >
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              {item.category === 'sovereign' ? (
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                              ) : (
                                <HelpCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              )}
                              <span className="line-clamp-2 leading-snug">{item.question}</span>
                            </div>
                            <div className="shrink-0 flex items-center gap-1.5">
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5 text-amber-400 shrink-0 transition-transform duration-200" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform duration-200" />
                              )}
                            </div>
                          </button>

                          {/* Accordion Item Smooth Body Animation with max-height & opacity */}
                          <div
                            className={`transition-[max-height,opacity] duration-300 ease-in-out overflow-hidden ${
                              isExpanded
                                ? 'max-h-[500px] opacity-100 border-t border-slate-800/60'
                                : 'max-h-0 opacity-0'
                            }`}
                          >
                            <div className="p-3 text-[11px] text-slate-300 leading-relaxed bg-slate-950/90 space-y-2.5">
                              <p className="whitespace-pre-line leading-relaxed">{item.answer}</p>

                              {/* Action Toolbar inside Accordion Item */}
                              <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/50">
                                <span className="text-[9px] text-slate-500 font-mono">
                                  {item.categoryLabel}
                                </span>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleCopyAnswer(item.id, item.answer);
                                    }}
                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-lg text-[10px] font-medium transition cursor-pointer touch-manipulation min-h-[32px]"
                                    title={isAr ? 'نسخ الإجابة' : 'Copy Answer'}
                                  >
                                    {copiedId === item.id ? (
                                      <>
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span className="text-emerald-400">{isAr ? 'تم النسخ' : 'Copied'}</span>
                                      </>
                                    ) : (
                                      <span>{isAr ? 'نسخ' : 'Copy'}</span>
                                    )}
                                  </button>

                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSendPrompt(item.question);
                                      setIsAccordionOpen(false);
                                    }}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-950 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 rounded-lg text-[10px] font-bold transition active:scale-95 cursor-pointer touch-manipulation min-h-[32px]"
                                  >
                                    <MessageSquare className="w-3 h-3" />
                                    <span>{isAr ? 'طرح بالدردشة' : 'Ask in Chat'}</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Chat Messages Area */}
        <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 text-xs focus:outline-none overscroll-contain">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[82%] rounded-2xl p-3.5 leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium rounded-br-none shadow-md'
                    : 'bg-slate-950 text-slate-200 border border-slate-800/90 rounded-bl-none shadow whitespace-pre-line'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-slate-950 text-slate-400 p-3 rounded-2xl border border-slate-800 flex items-center gap-2 text-xs shadow">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                <span>{t.aiThinking}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer with Touch Target Sizing */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 shrink-0">
          <div className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
              placeholder={t.aiPromptPlaceholder}
              aria-label={t.aiPromptPlaceholder}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pr-4 pl-12 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/80 min-h-[46px] touch-manipulation"
            />
            <button
              type="button"
              onClick={() => handleSendPrompt()}
              disabled={loading || !prompt.trim()}
              aria-label={isAr ? 'إرسال الرسالة' : 'Send message'}
              className="absolute left-1.5 min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 active:scale-95 disabled:opacity-40 text-slate-950 font-bold transition cursor-pointer touch-manipulation"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


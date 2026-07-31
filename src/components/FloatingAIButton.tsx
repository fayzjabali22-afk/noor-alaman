import React from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/i18n';

/*
  =============================================================================
  [الأمر السيادي رقم CMD-2026-0726-AI-FAB-15]
  (Floating AI Assistant Trigger Component - Restricted to Home Screen)
  - Presentational / Dumb UI Component (Props-Only Data Flow).
  - Restricted strictly to the Home Screen Viewport (currentTab === 'home').
  - Positioned as a Floating Action Button (FAB) with pulse indicator.
  =============================================================================
*/

interface FloatingAIButtonProps {
  onClick: () => void;
  lang: Language;
}

export const FloatingAIButton: React.FC<FloatingAIButtonProps> = ({
  onClick,
  lang,
}) => {
  const t = translations[lang];

  return (
    <div className="fixed bottom-6 ltr:right-6 rtl:left-6 z-40 flex items-center gap-2 group">
      {/* Tooltip Label */}
      <span className="hidden sm:inline-block px-3 py-1.5 rounded-xl bg-slate-900/95 text-emerald-300 text-xs font-bold border border-emerald-800/80 shadow-2xl backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        {t.aiAssistant}
      </span>

      {/* Sovereign Floating Action Button */}
      <button
        onClick={onClick}
        id="floating-ai-assistant-button"
        className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 text-white shadow-2xl shadow-emerald-950/80 border border-emerald-400/50 hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-emerald-500/40 group cursor-pointer"
        aria-label={t.aiAssistant}
        title={t.aiAssistant}
      >
        <Bot className="w-7 h-7 text-emerald-100 transition-transform group-hover:rotate-12 duration-300" />
        <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute top-2.5 right-2.5 animate-pulse" />

        {/* Pulse Indicator */}
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950"></span>
        </span>
      </button>
    </div>
  );
};

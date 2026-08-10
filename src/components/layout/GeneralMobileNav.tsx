import React from 'react';
import { Home, Radio, Sparkles, BookOpen, Compass } from 'lucide-react';
import { Language } from '../../types';

export interface GeneralMobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenPortalsSheet: () => void;
  lang: Language;
}

export const GeneralMobileNav: React.FC<GeneralMobileNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenPortalsSheet,
  lang,
}) => {
  const isAr = lang === 'ar';

  return (
    <nav
      aria-label={isAr ? 'شريط التنقل العام للمنصة' : 'General Platform Mobile Navigation'}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-2xl px-2 py-1 pb-safe flex items-center justify-around shadow-2xl text-[10px] font-bold text-slate-400 select-none"
    >
      <button
        type="button"
        onClick={() => setCurrentTab('home')}
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 ${
          currentTab === 'home'
            ? 'text-emerald-400 font-extrabold bg-emerald-500/10 border border-emerald-500/30'
            : 'hover:text-slate-200'
        }`}
      >
        <Home className={`w-4 h-4 ${currentTab === 'home' ? 'text-emerald-400 scale-110' : ''}`} />
        <span>{isAr ? 'الرئيسية' : 'Home'}</span>
      </button>

      <button
        type="button"
        onClick={() => setCurrentTab('core')}
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 ${
          currentTab === 'core'
            ? 'text-emerald-400 font-extrabold bg-emerald-500/10 border border-emerald-500/30'
            : 'hover:text-slate-200'
        }`}
      >
        <Radio className={`w-4 h-4 ${currentTab === 'core' ? 'text-emerald-400 scale-110' : ''}`} />
        <span>{isAr ? 'المنصة' : 'Core'}</span>
      </button>

      <button
        type="button"
        onClick={() => setCurrentTab('jasmine')}
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 ${
          currentTab === 'jasmine'
            ? 'text-amber-400 font-extrabold bg-amber-500/10 border border-amber-500/30'
            : 'hover:text-slate-200'
        }`}
      >
        <Sparkles className={`w-4 h-4 ${currentTab === 'jasmine' ? 'text-amber-400 scale-110' : ''}`} />
        <span>{isAr ? 'الياسمين' : 'Jasmine'}</span>
      </button>

      <button
        type="button"
        onClick={() => setCurrentTab('dalal')}
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 ${
          currentTab === 'dalal'
            ? 'text-teal-400 font-extrabold bg-teal-500/10 border border-teal-500/30'
            : 'hover:text-slate-200'
        }`}
      >
        <BookOpen className={`w-4 h-4 ${currentTab === 'dalal' ? 'text-teal-400 scale-110' : ''}`} />
        <span>{isAr ? 'دلال' : 'Dalal'}</span>
      </button>

      <button
        type="button"
        onClick={onOpenPortalsSheet}
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 border border-indigo-500/20 bg-indigo-950/30 ${
          ['raeda', 'publisher', 'supporter', 'analytics', 'admin', 'errors'].includes(currentTab)
            ? 'text-indigo-400 font-extrabold border-indigo-500/50'
            : 'text-indigo-400 hover:text-indigo-300'
        }`}
      >
        <Compass className="w-4 h-4 text-indigo-400" />
        <span>{isAr ? 'المزيد' : 'More'}</span>
      </button>
    </nav>
  );
};

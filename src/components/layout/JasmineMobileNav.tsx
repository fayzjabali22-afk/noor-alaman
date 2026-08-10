import React from 'react';
import { Sparkles, Award, ShieldCheck, Compass, HelpCircle } from 'lucide-react';
import { Language } from '../../types';

export interface JasmineMobileNavProps {
  onOpenPortalsSheet: () => void;
  lang: Language;
}

export const JasmineMobileNav: React.FC<JasmineMobileNavProps> = ({
  onOpenPortalsSheet,
  lang,
}) => {
  const isAr = lang === 'ar';

  return (
    <nav
      aria-label={isAr ? 'شريط تنقل قطاع الياسمين' : 'Jasmine Sector Mobile Navigation'}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-amber-500/30 backdrop-blur-2xl px-1.5 py-1 pb-safe flex items-center justify-between shadow-2xl text-[10px] font-bold text-slate-400 select-none"
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl text-amber-300 font-black bg-amber-500/10 border border-amber-500/30 min-h-[44px]">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span>{isAr ? 'التزكيات' : 'Endorsements'}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl text-slate-400 min-h-[44px]">
        <Award className="w-4 h-4 text-slate-400" />
        <span>{isAr ? 'المشاهير' : 'Public Figures'}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl text-slate-400 min-h-[44px]">
        <ShieldCheck className="w-4 h-4 text-slate-400" />
        <span>{isAr ? 'النواميس' : 'Sovereignty'}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl text-slate-400 min-h-[44px]">
        <HelpCircle className="w-4 h-4 text-slate-400" />
        <span>{isAr ? 'التوجيه' : 'Guidance'}</span>
      </div>

      {/* Portals Switcher Button */}
      <button
        type="button"
        onClick={onOpenPortalsSheet}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl text-indigo-400 hover:text-indigo-300 transition-all duration-200 min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 border border-indigo-500/20 bg-indigo-950/30"
      >
        <Compass className="w-4 h-4 text-indigo-400" />
        <span className="truncate max-w-[60px] font-bold">
          {isAr ? 'القطاعات' : 'Sectors'}
        </span>
      </button>
    </nav>
  );
};

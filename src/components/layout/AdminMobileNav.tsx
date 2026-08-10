import React from 'react';
import { ShieldAlert, BarChart3, AlertTriangle, Compass, Sliders } from 'lucide-react';
import { Language } from '../../types';

export interface AdminMobileNavProps {
  onOpenPortalsSheet: () => void;
  lang: Language;
}

export const AdminMobileNav: React.FC<AdminMobileNavProps> = ({
  onOpenPortalsSheet,
  lang,
}) => {
  const isAr = lang === 'ar';

  return (
    <nav
      aria-label={isAr ? 'شريط تنقل لوحة الإدارة والحوكمة' : 'Admin & Governance Mobile Navigation'}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-rose-500/30 backdrop-blur-2xl px-1.5 py-1 pb-safe flex items-center justify-between shadow-2xl text-[10px] font-bold text-slate-400 select-none"
    >
      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl text-rose-300 font-black bg-rose-500/10 border border-rose-500/30 min-h-[44px]">
        <ShieldAlert className="w-4 h-4 text-rose-400" />
        <span>{isAr ? 'الحوكمة' : 'Governance'}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl text-slate-400 min-h-[44px]">
        <AlertTriangle className="w-4 h-4 text-slate-400" />
        <span>{isAr ? 'البلاغات' : 'Reports'}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl text-slate-400 min-h-[44px]">
        <Sliders className="w-4 h-4 text-slate-400" />
        <span>{isAr ? 'المحرك' : 'FairEngine'}</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl text-slate-400 min-h-[44px]">
        <BarChart3 className="w-4 h-4 text-slate-400" />
        <span>{isAr ? 'التحليلات' : 'Analytics'}</span>
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

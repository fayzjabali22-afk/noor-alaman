import React from 'react';
import { LucideIcon, Sparkles, Inbox } from 'lucide-react';
import { Language } from '../../types';

export interface AccordionEmptyStateProps {
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon?: LucideIcon;
  actionLabelAr?: string;
  actionLabelEn?: string;
  onAction?: () => void;
  badgeTextAr?: string;
  badgeTextEn?: string;
  lang: Language;
}

export const AccordionEmptyState: React.FC<AccordionEmptyStateProps> = ({
  titleAr,
  titleEn,
  descriptionAr,
  descriptionEn,
  icon: Icon = Inbox,
  actionLabelAr,
  actionLabelEn,
  onAction,
  badgeTextAr,
  badgeTextEn,
  lang,
}) => {
  const isAr = lang === 'ar';

  return (
    <div className="w-full p-6 sm:p-8 text-center bg-slate-950/80 rounded-2xl border border-slate-800/90 space-y-4 shadow-inner relative overflow-hidden group">
      {/* Background Subtle Gradient Glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/10 transition-all duration-500" />

      {/* Icon Badge */}
      <div className="relative inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 text-amber-400 shadow-xl group-hover:scale-105 group-hover:border-amber-500/40 transition-transform duration-300">
        <Icon className="w-7 h-7 text-amber-400" />
      </div>

      {/* Optional Badge */}
      {(badgeTextAr || badgeTextEn) && (
        <div className="flex justify-center">
          <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-extrabold border border-amber-500/20">
            {isAr ? badgeTextAr : badgeTextEn}
          </span>
        </div>
      )}

      {/* Title & Description */}
      <div className="space-y-1.5 max-w-lg mx-auto">
        <h4 className="text-sm sm:text-base font-extrabold text-white">
          {isAr ? titleAr : titleEn}
        </h4>
        <p className="text-xs text-slate-400 leading-relaxed font-medium">
          {isAr ? descriptionAr : descriptionEn}
        </p>
      </div>

      {/* Optional Action Button */}
      {actionLabelAr && onAction && (
        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-850 text-amber-400 hover:text-amber-300 text-xs font-extrabold px-5 py-2.5 rounded-xl border border-amber-500/30 hover:border-amber-500/60 transition cursor-pointer min-h-[44px] touch-manipulation active:scale-95 shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>{isAr ? actionLabelAr : actionLabelEn}</span>
          </button>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export interface WizardHeaderProps {
  currentStep: number;
  onBack?: () => void;
  title: string;
  isAr?: boolean;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({
  currentStep,
  onBack,
  title,
  isAr = true,
}) => {
  return (
    <div className="sticky top-0 z-30 flex items-center justify-between w-full py-2.5 px-3 sm:px-4 bg-slate-900/95 backdrop-blur-md border-b border-slate-800/80 mb-4 rounded-xl shadow-md transition-all">
      <div className="flex items-center gap-2">
        {onBack && (
          <button
            onClick={onBack}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-100 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all rounded-lg border border-slate-700 shadow-sm cursor-pointer min-h-[38px] touch-manipulation"
            aria-label={isAr ? 'العودة للشاشة السابقة' : 'Return to Previous Screen'}
          >
            {isAr ? <ArrowRight className="w-3.5 h-3.5 text-amber-400" /> : <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isAr ? 'رجوع' : 'Back'}</span>
          </button>
        )}
        <h2 className="text-xs sm:text-sm font-bold text-amber-400 truncate max-w-[200px] sm:max-w-xs">{title}</h2>
      </div>

      <div className="text-[11px] font-mono font-bold text-slate-300 bg-slate-800/90 px-2.5 py-1 rounded-full border border-slate-700/60 flex items-center gap-1">
        <span>{isAr ? 'الخطوة' : 'Step'}</span>
        <span className="text-amber-400 font-extrabold">{currentStep}</span>
        <span>{isAr ? 'من 3' : 'of 3'}</span>
      </div>
    </div>
  );
};

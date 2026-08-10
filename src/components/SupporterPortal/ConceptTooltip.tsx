import React, { useState } from 'react';
import { HelpCircle, UserCheck, ShieldCheck, CheckCircle2, X, Sparkles, Info } from 'lucide-react';
import { Language } from '../../types';

export interface ConceptTooltipProps {
  lang?: Language;
  isAr?: boolean;
  currentStatus?: 'SPONSOR' | 'GUEST_SUPPORTER';
  onToggleStatus?: () => void;
  className?: string;
}

export const ConceptTooltip: React.FC<ConceptTooltipProps> = ({
  lang = 'ar',
  isAr = lang === 'ar',
  currentStatus = 'SPONSOR',
  onToggleStatus,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Interactive Tooltip Trigger Button with Question Mark */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label={isAr ? 'دليل مفهوم الكفيل والداعم' : 'Sponsor vs Supporter Guide'}
        className={`inline-flex items-center justify-center p-1.5 sm:p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 border border-amber-500/30 transition cursor-pointer min-h-[36px] min-w-[36px] touch-manipulation active:scale-95 shrink-0 ${className}`}
        title={isAr ? 'اضغط لمعرفة الفرق بين حساب كفيل نشط وتسجيل الدخول كداعم' : 'Click to learn differences between Active Sponsor and Supporter Sign-in'}
      >
        <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 animate-pulse" />
      </button>

      {/* Pop-up Interactive Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute top-4 left-4 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="space-y-1.5 pr-2 sm:pr-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'دليل الفروق والمفاهيم الإنسانية' : 'Sovereign Concepts Guide'}</span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-white">
                {isAr
                  ? 'ما الفرق بين "تسجيل الدخول كداعم" و "حساب كفيل نشط"؟'
                  : 'Difference Between "Supporter Sign-in" and "Active Sponsor"?'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr
                  ? 'دليل إرشادي يوضح بوضوح الفروق الجوهرية والصلاحيات المترتبة على نوع ارتباطك بالمنصة.'
                  : 'A clear guide explaining differences and privileges for each status.'}
              </p>
            </div>

            {/* Detailed Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Box 1: Supporter Access */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      {isAr ? 'تسجيل الدخول كداعم' : 'Supporter Sign-in'}
                    </h4>
                    <span className="text-[10px] text-cyan-300 font-medium">
                      {isAr ? 'وصول عام للمتابعة' : 'General Follower'}
                    </span>
                  </div>
                </div>
                <ul className="space-y-2 text-[11px] text-slate-300">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'دخول بحساب إلكتروني اختياري لجمهور المنصة.' : 'Optional account access for general audience.'}</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'حفظ واستعراض سجل التوجيهات الميدانية الشخصية.' : 'Save & view personal field redirection log.'}</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'بدون التزامات إشرافية أو تبنٍ مباشر للقنوات.' : 'No supervisory duties or channel adoption.'}</span>
                  </li>
                </ul>
              </div>

              {/* Box 2: Active Sponsor */}
              <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-950/40 to-slate-950 border border-amber-500/50 space-y-3">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-amber-300">
                      {isAr ? 'حساب كفيل نشط' : 'Active Sovereign Sponsor'}
                    </h4>
                    <span className="text-[10px] text-amber-400 font-medium">
                      {isAr ? 'رعاية وتوجيه ميداني' : 'Supervisory Sponsoring'}
                    </span>
                  </div>
                </div>
                <ul className="space-y-2 text-[11px] text-slate-300">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'تتطلب تبني قناتين ميدانيتين على الأقل.' : 'Requires adopting at least 2 field channels.'}</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'تتيح التوجيه الإنساني المباشر (One-Way Guidance).' : 'Grants direct One-Way Guidance privileges.'}</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'فتح أرشيف الخزانة وتراخيص التوثيق المائية.' : 'Unlocks digital vault & watermarked certs.'}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Action footer */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
              <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                <Info className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'الحالة الحالية: ' : 'Current Status: '}</span>
                <span className="font-extrabold text-amber-300">
                  {currentStatus === 'SPONSOR'
                    ? (isAr ? 'حساب كفيل نشط' : 'Active Sponsor')
                    : (isAr ? 'تسجيل دخول كداعم' : 'Supporter Access')}
                </span>
              </div>

              {onToggleStatus && (
                <button
                  type="button"
                  onClick={() => {
                    onToggleStatus();
                    setIsOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition cursor-pointer min-h-[44px] touch-manipulation active:scale-95"
                >
                  {isAr ? 'تبديل الصفة' : 'Switch Status'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

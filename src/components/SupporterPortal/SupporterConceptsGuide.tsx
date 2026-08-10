import React from 'react';
import { HelpCircle, UserCheck, ShieldCheck, Radio, CheckCircle2, X, Zap, Lock, Info, Sparkles } from 'lucide-react';

interface SupporterConceptsGuideProps {
  isAr: boolean;
  isOpen: boolean;
  onClose: () => void;
  currentStatus: 'SPONSOR' | 'GUEST_SUPPORTER';
  onToggleStatus?: () => void;
}

export const SupporterConceptsGuideModal: React.FC<SupporterConceptsGuideProps> = ({
  isAr,
  isOpen,
  onClose,
  currentStatus,
  onToggleStatus,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-amber-500/30 rounded-3xl p-5 sm:p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 left-4 sm:top-6 sm:left-6 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          title={isAr ? 'إغلاق' : 'Close'}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Title */}
        <div className="space-y-2 pr-2 sm:pr-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'دليل الفروق والمفاهيم السيادية' : 'Sovereign Concepts Guide'}</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            {isAr
              ? 'الفرق بين "تسجيل الدخول كداعم" و"حساب كفيل نشط"'
              : 'Difference Between "Supporter Sign-in" and "Active Sponsor"'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
            {isAr
              ? 'تلتزم منصة نور الأماني بالشفافية المطلقة وتحديد طبيعة ارتباط المستخدم بالمنصة لضمان الفهم التام للحقوق، المسئوليات، والصلاحيات الإنسانية.'
              : 'Noor Al-Amani Platform ensures absolute transparency regarding user association types, rights, and humanitarian privileges.'}
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* Card 1: Supporter Sign-in */}
          <div
            className={`p-5 rounded-2xl border transition relative space-y-4 ${
              currentStatus === 'GUEST_SUPPORTER'
                ? 'bg-slate-950 border-cyan-500/50 shadow-lg shadow-cyan-500/5'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            {currentStatus === 'GUEST_SUPPORTER' && (
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-extrabold">
                {isAr ? 'حالتك الحالية' : 'Current Status'}
              </span>
            )}

            <div className="flex items-center gap-3">
              <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {isAr ? 'تسجيل الدخول كداعم' : 'Supporter Sign-in'}
                </h4>
                <p className="text-[11px] text-cyan-300 font-semibold">
                  {isAr ? 'وصول عام ومتابعة مفهرسة' : 'General Access & Tracked Follow'}
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'دخول إلكتروني اختياري بحساب موثق يمثل المتابع الحر للمنصة.'
                    : 'Optional digital sign-in representing a free platform follower.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'يتيح حفظ واستعراض سجل التوجيهات الشخصية للزيارات الميدانية.'
                    : 'Allows saving and viewing personal redirection logs to publisher channels.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'خالٍ تماماً من أي التزامات تعاقدية، إشرافية، أو إدارية تجاه القنوات.'
                    : 'Completely free from any contractual, supervisory, or administrative duties.'}
                </span>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-medium flex items-center justify-between">
              <span>{isAr ? 'مستوى التوثيق:' : 'Verification Level:'}</span>
              <span className="font-bold text-slate-200">{isAr ? 'داعم فردي / متابع عام' : 'Individual Supporter'}</span>
            </div>
          </div>

          {/* Card 2: Active Sovereign Sponsor */}
          <div
            className={`p-5 rounded-2xl border transition relative space-y-4 ${
              currentStatus === 'SPONSOR'
                ? 'bg-gradient-to-b from-amber-950/40 to-slate-950 border-amber-500/60 shadow-xl shadow-amber-500/10'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            {currentStatus === 'SPONSOR' && (
              <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-extrabold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>{isAr ? 'الحالة المفتوحة الحالية' : 'Active Status'}</span>
              </span>
            )}

            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-amber-300">
                  {isAr ? 'حساب كفيل نشط' : 'Active Sovereign Sponsor'}
                </h4>
                <p className="text-[11px] text-amber-400/90 font-semibold">
                  {isAr ? 'رعاية إنسانية تعاقدية وإشرافية' : 'Contractual & Supervisory Sponsorship'}
                </p>
              </div>
            </div>

            <ul className="space-y-2.5 text-xs text-slate-300 font-medium">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'صفة إنسانية سيادية متقدمة تتفعل عند تبني قناتين ميدانيتين على الأقل.'
                    : 'Advanced status activated upon adopting at least 2 field channels.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'تمنح صلاحية التوجيه المباشر في اتجاه واحد (One-Way Guidance) لصناع المحتوى.'
                    : 'Grants direct One-Way Guidance privileges to adopted publishers.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'تتيح إصدار شهادات التوثيق المختومة رقمياً بالختم المائي ورادار التدقيق.'
                    : 'Unlocks watermarked digital vault certificates & audit radar inspection.'}
                </span>
              </li>
            </ul>

            <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-medium flex items-center justify-between">
              <span>{isAr ? 'مستوى التوثيق:' : 'Verification Level:'}</span>
              <span className="font-bold text-amber-400">{isAr ? 'كفيل سيادي / راعٍ إنساني' : 'Sovereign Sponsor'}</span>
            </div>
          </div>
        </div>

        {/* Footer Info & Toggle Action */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <Info className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="leading-relaxed">
              {isAr
                ? 'يمكنك التبديل بين الحالتين لاستكشاف تجربة العرض والتفاعل في كلا المستوى القيادي والمتابعة العادية.'
                : 'You can switch between both modes to explore experience in both status levels.'}
            </p>
          </div>

          {onToggleStatus && (
            <button
              type="button"
              onClick={() => {
                onToggleStatus();
                onClose();
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer min-h-[44px] touch-manipulation whitespace-nowrap active:scale-95 shadow-lg shadow-amber-500/20"
            >
              {currentStatus === 'SPONSOR'
                ? isAr ? 'التبديل لحالة داعم عام' : 'Switch to Supporter Sign-in'
                : isAr ? 'التبديل لحساب كفيل نشط' : 'Switch to Active Sponsor'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export const SupporterConceptsInlineCard: React.FC<{
  isAr: boolean;
  currentStatus: 'SPONSOR' | 'GUEST_SUPPORTER';
  onOpenGuideModal: () => void;
}> = ({ isAr, currentStatus, onOpenGuideModal }) => {
  return (
    <div className="w-full bg-slate-900/90 border border-slate-800/90 rounded-2xl md:rounded-3xl p-4 md:p-5 shadow-xl relative overflow-hidden backdrop-blur-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 shrink-0">
            <HelpCircle className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm md:text-base font-extrabold text-white">
                {isAr ? 'مفهوم الارتباط: داعم عام أم كفيل نشط؟' : 'Association Type: Supporter vs Active Sponsor'}
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-extrabold border border-amber-500/30">
                {currentStatus === 'SPONSOR'
                  ? isAr ? 'صفة كفيل نشط' : 'Active Sponsor'
                  : isAr ? 'صفة داعم عام' : 'Supporter Access'}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              {isAr
                ? 'تعرّف على الفروق الجوهرية بين الدخول العام كداعم وبين الامتيازات التعاقدية والإشرافية للكفيل النشط.'
                : 'Learn about key differences between general supporter access and contractual active sponsorship.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenGuideModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-850 text-amber-400 hover:text-amber-300 border border-amber-500/30 rounded-xl text-xs font-bold transition cursor-pointer min-h-[44px] touch-manipulation active:scale-95 shrink-0 self-end sm:self-auto shadow-md"
        >
          <Info className="w-4 h-4 text-amber-400" />
          <span>{isAr ? 'عرض دليل المفاهيم' : 'View Concepts Guide'}</span>
        </button>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { HelpCircle, UserCheck, ShieldCheck, CheckCircle2, XCircle, Sparkles, Zap, FileCheck, Radar, ArrowLeftRight, ChevronDown } from 'lucide-react';
import { Language } from '../../types';

export interface ConceptsDefinitionSectionProps {
  lang?: Language;
  isAr?: boolean;
  currentStatus: 'SPONSOR' | 'GUEST_SUPPORTER';
  onToggleStatus?: () => void;
  onExploreChannels?: () => void;
}

export const ConceptsDefinitionSection: React.FC<ConceptsDefinitionSectionProps> = ({
  lang = 'ar',
  isAr = lang === 'ar',
  currentStatus,
  onToggleStatus,
  onExploreChannels,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const privileges = [
    {
      featureAr: 'استعراض القنوات والمحتوى الميداني المفهرس',
      featureEn: 'Browse Indexed Field Channels & Content',
      supporter: true,
      sponsor: true,
    },
    {
      featureAr: 'تسجيل وتحويل الزيارات للمنصات الرسمية',
      featureEn: 'Track Outbound Redirection to Official Platforms',
      supporter: true,
      sponsor: true,
    },
    {
      featureAr: 'حفظ وتصدير سجل التفاعلات الشخصي',
      featureEn: 'Save & Export Personal Interaction Log',
      supporter: true,
      sponsor: true,
    },
    {
      featureAr: 'تبني قنوات ميدانية معتمدة (قطاع دلال ورائدة)',
      featureEn: 'Adopt Official Field Channels (Dalal & Raeda)',
      supporter: false,
      sponsor: true,
    },
    {
      featureAr: 'إرسال توجيهات إنسانية أحادية الاتجاه (One-Way Guidance)',
      featureEn: 'Send One-Way Humanitarian Guidance to Publishers',
      supporter: false,
      sponsor: true,
    },
    {
      featureAr: 'إصدار وتنزيل شهادات التوثيق المائية من الخزانة',
      featureEn: 'Issue & Download Watermarked Vault Certificates',
      supporter: false,
      sponsor: true,
    },
    {
      featureAr: 'فحص واستكشاف رادار التدقيق الميداني والصحة الرقمية',
      featureEn: 'Inspect Field Audit Radar & Digital Integrity Health',
      supporter: false,
      sponsor: true,
    },
  ];

  return (
    <section id="supporter-concepts-definition" className="w-full bg-slate-900/90 border border-slate-800/80 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all duration-300">
      {/* Background Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

      {/* Accordion Header */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer select-none group w-full min-h-[56px] ${
          isOpen ? 'border-b border-slate-800/60 pb-4' : ''
        }`}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen((prev) => !prev);
          }
        }}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 shadow-inner group-hover:border-amber-500/60 transition shrink-0">
            <HelpCircle className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base md:text-xl font-black text-white group-hover:text-amber-300 transition">
                {isAr ? 'دليل صفة الحساب: داعم عام مقابل كفيل نشط' : 'Account Status Guide: Supporter vs Active Sponsor'}
              </h3>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                {isAr ? 'تعريف المفاهيم' : 'Concepts Guide'}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {isAr
                ? 'تحدد منصة نور الأماني معايير الشفافية والصلاحيات الميدانية بكل دقة لرفع وعي المستخدم بنوعية ارتباطه الإنساني'
                : 'Noor Al-Amani Platform clearly defines transparency standards and field privileges for each account type'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto" onClick={(e) => e.stopPropagation()}>
          {onToggleStatus && (
            <button
              type="button"
              onClick={onToggleStatus}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-850 text-amber-400 border border-amber-500/30 font-extrabold text-xs transition cursor-pointer min-h-[44px] touch-manipulation active:scale-95 shadow-lg"
            >
              <ArrowLeftRight className="w-4 h-4 text-amber-400" />
              <span>
                {currentStatus === 'SPONSOR'
                  ? (isAr ? 'تجربة صفة داعم عام' : 'Switch to Supporter')
                  : (isAr ? 'تفعيل حساب كفيل نشط' : 'Activate Active Sponsor')}
              </span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? (isAr ? 'طي القائمة' : 'Collapse') : (isAr ? 'توسيع القائمة' : 'Expand')}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation active:scale-95 shrink-0"
          >
            <ChevronDown className={`w-5 h-5 text-amber-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Accordion Expanded Body */}
      {isOpen && (
        <div className="space-y-6 pt-2 animate-fade-in">
          {/* Cards Comparison Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Card 1: Supporter Status */}
            <div
              className={`p-5 sm:p-6 rounded-2xl border transition relative space-y-4 ${
                currentStatus === 'GUEST_SUPPORTER'
                  ? 'bg-slate-950 border-cyan-500/50 shadow-xl shadow-cyan-500/5 ring-1 ring-cyan-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px] font-extrabold inline-block mb-1">
                      {isAr ? 'مستوى الوصول العام' : 'General Access Level'}
                    </span>
                    <h4 className="text-lg font-bold text-white">
                      {isAr ? 'تسجيل الدخول كداعم' : 'Supporter Sign-in'}
                    </h4>
                  </div>
                </div>

                {currentStatus === 'GUEST_SUPPORTER' && (
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-extrabold shrink-0">
                    {isAr ? 'الصفة النشطة الحالية' : 'Active Status'}
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr
                  ? 'نموذج المتابعة الحرة والمستقلة، يتيح للداعم التفاعل مع القنوات المفهرسة والانتقال إليها مع التوثيق الآمن لحركة المرور دون أي قيود أو واجبات إدارية.'
                  : 'Free and independent follow mode allowing supporters to interact with indexed channels with secure redirection tracking.'}
              </p>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>{isAr ? 'المميزات والصلاحيات الأساسية:' : 'Core Features & Privileges:'}</span>
                </h5>
                <ul className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'حفظ وتتبع سجل التوجيهات الشخصية للزيارات الخارجية.' : 'Track personal redirection history for outbound visits.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'استعراض إحصائيات الأثر الإنساني غير المالي.' : 'View cumulative non-monetary impact stats.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'خالٍ من أي التزامات بتبني القنوات أو إرسال توجيهات.' : 'Free from channel adoption or guidance obligations.'}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Active Sovereign Sponsor Status */}
            <div
              className={`p-5 sm:p-6 rounded-2xl border transition relative space-y-4 ${
                currentStatus === 'SPONSOR'
                  ? 'bg-gradient-to-b from-amber-950/40 via-slate-950 to-slate-950 border-amber-500/60 shadow-2xl shadow-amber-500/10 ring-1 ring-amber-500/30'
                  : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold inline-block mb-1">
                      {isAr ? 'مستوى الرعاية التعاقدية' : 'Sponsorship Level'}
                    </span>
                    <h4 className="text-lg font-bold text-amber-300">
                      {isAr ? 'حساب كفيل نشط' : 'Active Sovereign Sponsor'}
                    </h4>
                  </div>
                </div>

                {currentStatus === 'SPONSOR' && (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-extrabold shrink-0 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'الصفة النشطة الحالية' : 'Active Status'}</span>
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {isAr
                  ? 'صفة إنسانية تعاقدية متقدمة تُمكّن الكفيل من تبني قنوات ميدانية مسجلة، تقديم التوجيه الإشرافي أحادي الاتجاه، وتأكيد شهادات التوثيق الرقمية المختومة.'
                  : 'Advanced sponsorship status enabling field channel adoption, one-way guidance, and watermarked certificate issuing.'}
              </p>

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'صلاحيات ومزايا الكفيل السيادي:' : 'Sovereign Sponsor Privileges:'}</span>
                </h5>
                <ul className="space-y-2 text-xs text-slate-300 font-medium">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'تبني 2 قناة ميدانية أو أكثر من قطاعي دلال ورائدة.' : 'Adopt 2 or more field channels from Dalal & Raeda.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'إرسال توجيهات إنسانية أحادية الاتجاه (One-Way Guidance).' : 'Send direct One-Way Guidance messages.'}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{isAr ? 'فتح أرشيف الخزانة وتنزيل شهادات التوثيق المائية.' : 'Unlock digital vault & download watermarked certs.'}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Comparison Privilege Matrix Table */}
          <div className="space-y-3 pt-2">
            <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'جدول مقارنة الصلاحيات والامتيازات' : 'Privilege Comparison Matrix'}</span>
            </h4>

            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
              <table className="w-full text-right dir-rtl border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/80 text-slate-300 font-bold">
                    <th className="p-3 sm:p-4 text-right">{isAr ? 'الصلاحية / الوظيفة' : 'Privilege / Function'}</th>
                    <th className="p-3 sm:p-4 text-center w-28 sm:w-36 text-cyan-300">{isAr ? 'داعم عام' : 'Supporter'}</th>
                    <th className="p-3 sm:p-4 text-center w-28 sm:w-36 text-amber-300">{isAr ? 'كفيل نشط' : 'Sponsor'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium text-slate-300">
                  {privileges.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40 transition">
                      <td className="p-3 sm:p-4 text-slate-200">
                        {isAr ? item.featureAr : item.featureEn}
                      </td>
                      <td className="p-3 sm:p-4 text-center">
                        {item.supporter ? (
                          <CheckCircle2 className="w-5 h-5 text-cyan-400 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-600 mx-auto" />
                        )}
                      </td>
                      <td className="p-3 sm:p-4 text-center">
                        {item.sponsor ? (
                          <CheckCircle2 className="w-5 h-5 text-amber-400 mx-auto" />
                        ) : (
                          <XCircle className="w-5 h-5 text-slate-600 mx-auto" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Prompt */}
          {onExploreChannels && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 text-xs text-slate-300">
                <Radar className="w-5 h-5 text-amber-400 shrink-0" />
                <p className="leading-relaxed font-medium">
                  {isAr
                    ? 'جاهز لبدء التبني وتفعيل حساب الكفيل النشط؟ تصفح القنوات الميدانية المعتمدة الآن.'
                    : 'Ready to adopt field channels and activate your sponsor status? Browse verified channels.'}
                </p>
              </div>

              <button
                type="button"
                onClick={onExploreChannels}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition cursor-pointer min-h-[44px] touch-manipulation whitespace-nowrap active:scale-95 shadow-lg shadow-amber-500/20"
              >
                {isAr ? 'استكشاف القنوات وتبني قناة' : 'Explore & Adopt Channel'}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

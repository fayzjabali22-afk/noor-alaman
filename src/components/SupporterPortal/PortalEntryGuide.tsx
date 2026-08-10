import React, { useState } from 'react';
import {
  Crown,
  Sparkles,
  ShieldCheck,
  HeartHandshake,
  ArrowLeft,
  ArrowRight,
  HelpCircle,
  X,
  FileCheck,
  CheckCircle2,
  Radio,
  ExternalLink,
  MessageSquare,
  BarChart3,
  Users,
  Eye,
  Info,
} from 'lucide-react';

/*
  =============================================================================
  [الأمر السيادي رقم 11.0 - دليل التفرقة التوعوي بين حساب الكفيل وبوابة الداعم]
  (Sovereign Portal Entry Educational Guide Directive)
  يوضح المكون الفرق المعماري الجوهري بين:
  1. 'لوحة التحكم (كفيل)': إدارة التوجيه الإنساني، الكفالة الميدانية غير المالية، وشواهد الخزانة.
  2. 'بوابة التفاعل (داعم)': التصفح المباشر، الزيارات الخارجية، والإبلاغ عن النزاهة.
  =============================================================================
*/

interface PortalEntryGuideProps {
  isAr: boolean;
  isOpen?: boolean;
  onClose?: () => void;
  onSelectSponsorMode?: () => void;
  onSelectSupporterMode?: () => void;
  currentMode?: 'SPONSOR' | 'GUEST_SUPPORTER' | 'SUPPORTER';
}

export const PortalEntryGuide: React.FC<PortalEntryGuideProps> = ({
  isAr,
  isOpen = false,
  onClose,
  onSelectSponsorMode,
  onSelectSupporterMode,
  currentMode = 'SPONSOR',
}) => {
  const [activeTab, setActiveTab] = useState<'COMPARISON' | 'SPONSOR' | 'SUPPORTER'>('COMPARISON');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div
        className="relative w-full max-w-3xl bg-slate-900 border-2 border-amber-500/40 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden my-auto text-right"
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Top Gold Sovereign Accent Header */}
        <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 p-4 sm:p-6 border-b border-amber-500/30 relative">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
                <HelpCircle className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-xl font-black text-white">
                    {isAr ? 'الدليل التوعوي لبوابات الدعم والكفالة' : 'Educational Guide to Portal Access Roles'}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {isAr ? 'معيار الحوكمة السيادية' : 'Governance Standard'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  {isAr
                    ? 'تعرّف على الفرق الجوهري بين خيارات الدخول لتحديد البوابة المناسبة لدورك الإنساني.'
                    : 'Understand the fundamental distinction between entry portals to select your exact role.'}
                </p>
              </div>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Quick Tab Switcher inside Modal */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-amber-500/20">
            <button
              type="button"
              onClick={() => setActiveTab('COMPARISON')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
                activeTab === 'COMPARISON'
                  ? 'bg-amber-500 text-slate-950 font-black shadow'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>{isAr ? 'المقارنة الشاملة' : 'Full Comparison'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SPONSOR')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
                activeTab === 'SPONSOR'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? '1. لوحة التحكم (كفيل)' : '1. Sponsor Dashboard'}</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('SUPPORTER')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
                activeTab === 'SUPPORTER'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:text-white'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 text-blue-400" />
              <span>{isAr ? '2. بوابة التفاعل (داعم)' : '2. Supporter Portal'}</span>
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto scrollbar-thin">
          {/* TAB 1: COMPARISON GRID */}
          {activeTab === 'COMPARISON' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ROLE 1: KAFIL / SUPPORTER ACCOUNT (SPONSOR DASHBOARD) */}
                <div className="bg-gradient-to-b from-amber-950/30 to-slate-900 border-2 border-amber-500/40 rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                        <Crown className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-black text-amber-300">
                          {isAr ? 'فتح ودخول حساب داعم (كفيل)' : 'Supporter Account Cockpit'}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {isAr ? 'يتطلب تبني قناتين إغاثيتين على الأقل' : 'Requires sponsoring at least 2 channels'}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      {isAr ? 'حساب داعم رسمي' : 'Official Supporter'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isAr
                      ? 'قمرة القيادة الخاصة بالداعمين والكفلاء. تمنحك صلاحية تبني القنوات الميدانية الموثوقة، إرسال التوجيه أحادي الاتجاه، وتفعيل شواهد الخزانة والختم المائي.'
                      : 'Exclusive cockpit for supporters and sponsors. Allows channel adoption, direct guidance notes, and watermarked vault certificates.'}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-amber-500/20 text-xs">
                    <div className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{isAr ? 'تبنّي ورعاية قناتين إغاثيتين أو أكثر' : 'Sponsor 2 or more humanitarian channels'}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{isAr ? 'إرسال التوجيه المباشر أحادي الاتجاه' : 'Send direct one-way guidance'}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{isAr ? 'شواهد الخزانة والختم المائي الرقمي' : 'Digital vault watermarked certificates'}</span>
                    </div>
                  </div>

                  {onSelectSponsorMode && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSponsorMode();
                        if (onClose) onClose();
                      }}
                      className="w-full mt-3 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg min-h-[44px]"
                    >
                      <Crown className="w-4 h-4" />
                      <span>{isAr ? 'الدخول لقمرة الداعم (حساب كفيل)' : 'Enter Supporter Cockpit'}</span>
                    </button>
                  )}
                </div>

                {/* ROLE 2: CASUAL PUBLIC VISITOR (MAIN PLATFORM SCREEN) */}
                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-slate-700/80 rounded-2xl p-4 sm:p-5 space-y-3 relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400">
                        <HeartHandshake className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm sm:text-base font-black text-blue-300">
                          {isAr ? 'التفاعل العام (المنصة الأساسية)' : 'General Platform Engagement'}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {isAr ? 'الواجهة الرئيسية للجمهور والمتابعين' : 'Main Interface for General Visitors'}
                        </p>
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {isAr ? 'تصفح عام' : 'Public Access'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isAr
                      ? 'مخصص للتصفح العام، زيارة الروابط الخارجية للقنوات الموثوقة، وتقديم بلاغات النزاهة الميدانية مباشرة من الواجهة الرئيسية دون الحاجة لفتح حساب كفيل.'
                      : 'Designed for general browsing, external channel link visits, and field integrity reporting directly on the main home screen.'}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                    <div className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{isAr ? 'استكشاف القنوات وزيارة روابطها الخارجية' : 'Explore channels & visit external links'}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{isAr ? 'تقديم بلاغات النزاهة لحماية البيئة الإنسانية' : 'Submit field integrity reports'}</span>
                    </div>
                    <div className="flex items-start gap-2 text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                      <span>{isAr ? 'مكانها الأصلي: الواجهة الرئيسية للمنصة' : 'Located on the main platform home screen'}</span>
                    </div>
                  </div>

                  {onSelectSupporterMode && (
                    <button
                      type="button"
                      onClick={() => {
                        onSelectSupporterMode();
                        if (onClose) onClose();
                      }}
                      className="w-full mt-3 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-slate-700 min-h-[44px]"
                    >
                      <HeartHandshake className="w-4 h-4 text-blue-400" />
                      <span>{isAr ? 'فتح حساب داعم جديد' : 'Register New Supporter'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Sovereign Philosophy Notice Card */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong className="text-white block mb-0.5">
                    {isAr ? 'مبدأ عدم جمع الأموال والملاءة السيادية:' : 'Non-Financial Sovereign Mandate:'}
                  </strong>
                  {isAr
                    ? 'كلا الخيارين يلتزمان بدستور منصة نور الأماني: لا يتم استضافة أي فيديوهات ولا جمع أي تبرعات مالية على المنصة؛ وإنما تُعنى المنصة بالتوثيق، الفهرسة، والتوجيه غير المالي.'
                    : 'Both options strictly comply with the platform directive: No video hosting or financial fundraising is conducted on this platform; operations are strictly non-monetary indexing and verification.'}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DETAILED SPONSOR INFO */}
          {activeTab === 'SPONSOR' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-black text-sm">
                  <Crown className="w-5 h-5" />
                  <span>{isAr ? 'تفاصيل خيار: لوحة التحكم (كفيل)' : 'Details for Sponsor Dashboard (Kafil)'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isAr
                    ? 'هذا الخيار مصمم خصيصاً للشخصيات السيادية، والمشاهير، وقطاع الياسمين المخصص لكفالة القنوات الميدانية. يُمنح الكفيل شارة توثيق سيادية، إمكانية توجيه القنوات المكفولة بنصائح صامتة، واستخراج شواهد الخزانة الرقمية المائية.'
                    : 'Exclusively tailored for public figures, celebrities, and Jasmine Sector sponsors. Grants sovereign verification badges, silent guidance tools, and watermarked certificates.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <span className="font-bold text-amber-400 block">{isAr ? 'التوجيه أحادي الاتجاه' : 'One-Way Guidance'}</span>
                  <p className="text-slate-400">{isAr ? 'إرسال ملحوظات وتوجيهات توعية للقنوات دون فتح باب للمحادثات المفتوحة.' : 'Send advisory guidance to sponsored channels without enabling public chat.'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <span className="font-bold text-amber-400 block">{isAr ? 'وضع الشبح (الكفالة الصامتة)' : 'Ghost Mode (Silent Sponsor)'}</span>
                  <p className="text-slate-400">{isAr ? 'إمكانية تقديم الكفالة المعنوية سرا أو إشهار الهوية حسب الرغبة.' : 'Conceal or broadcast your sponsor identity according to your preference.'}</p>
                </div>
              </div>

              {onSelectSponsorMode && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectSponsorMode();
                    if (onClose) onClose();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[44px]"
                >
                  <Crown className="w-4 h-4" />
                  <span>{isAr ? 'اختيار لوحة التحكم (كفيل) الآن' : 'Select Sponsor Dashboard Now'}</span>
                </button>
              )}
            </div>
          )}

          {/* TAB 3: DETAILED SUPPORTER INFO */}
          {activeTab === 'SUPPORTER' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-blue-950/30 border border-blue-500/40 space-y-3">
                <div className="flex items-center gap-2 text-blue-300 font-black text-sm">
                  <HeartHandshake className="w-5 h-5" />
                  <span>{isAr ? 'تفاصيل خيار: بوابة التفاعل (داعم)' : 'Details for Supporter Portal (Da\'em)'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isAr
                    ? 'هذا الخيار مخصص لكل زائر أو متابع يرغب في مساندة المبادرة الإنسانية عبر الاستكشاف الواعي، فتح القنوات الخارجية الموثقة، والمشاركة في حماية المنصة عبر تقديم البلاغات الميدانية.'
                    : 'Tailored for every visitor or follower looking to support the humanitarian initiative by exploring verified channels, visiting external links, and submitting field integrity reports.'}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <span className="font-bold text-blue-400 block">{isAr ? 'استكشاف القنوات' : 'Channel Exploration'}</span>
                  <p className="text-slate-400">{isAr ? 'تصفح كافة القنوات المفهرسة والمصنفة بمعايير محرك العدالة.' : 'Browse indexed channels sorted by FairEngine balance.'}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1">
                  <span className="font-bold text-blue-400 block">{isAr ? 'البلاغات والنزاهة' : 'Integrity Reporting'}</span>
                  <p className="text-slate-400">{isAr ? 'الإبلاغ عن أي مخافات في القنوات لحماية بيئة المنصة النقية.' : 'Report violations to safeguard the platform\'s pure environment.'}</p>
                </div>
              </div>

              {onSelectSupporterMode && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectSupporterMode();
                    if (onClose) onClose();
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-md min-h-[44px]"
                >
                  <HeartHandshake className="w-4 h-4" />
                  <span>{isAr ? 'اختيار بوابة التفاعل (داعم) الآن' : 'Select Supporter Portal Now'}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500 font-mono">
            [الأمر السيادي رقم 11.0 - توثيق أدوار الدعم]
          </p>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer min-h-[44px]"
            >
              {isAr ? 'إغلاق الدليل' : 'Close Guide'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

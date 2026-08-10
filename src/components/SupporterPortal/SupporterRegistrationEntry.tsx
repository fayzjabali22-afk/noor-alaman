import React, { useState, useEffect } from 'react';
import {
  Crown,
  Lock,
  Mail,
  User,
  ShieldCheck,
  CheckCircle2,
  Save,
  LogIn,
  LogOut,
  HelpCircle,
  Award,
  Globe,
  Tag,
  UserCheck,
  Share2,
} from 'lucide-react';
import { SupporterProfileData } from './supporterMockData';

/*
  =============================================================================
  [الأمر السيادي - مكون بوابة فتح ودخول حساب الداعم]
  SupporterRegistrationEntry Component
  
  يمثل هذا المكون بوابة المصادقة والحراسة المطلقة (Strict Auth Guard) المخصصة
  حصراً لمن يرغبون في فتح أو دخول حساب داعم/كفيل نشط على منصة نور الأماني.
  يتضمن المصنّفات الأربعة لإصدار الفهرسة الدقيقة في قطاع الياسمين (القرار NA-SOV-2026-0808-008).
  =============================================================================
*/

interface SupporterRegistrationEntryProps {
  isAr: boolean;
  isLoggedIn: boolean;
  supporterProfile: SupporterProfileData;
  onLoginSuccess: () => void;
  onLogout: () => void;
  onUpdateProfile?: (updated: Partial<SupporterProfileData>) => void;
  onOpenConceptGuide?: () => void;
}

const LOCAL_STORAGE_DRAFT_KEY = 'noor_alamani_supporter_registration_draft_v1';

export const SupporterRegistrationEntry: React.FC<SupporterRegistrationEntryProps> = ({
  isAr,
  isLoggedIn,
  supporterProfile,
  onLoginSuccess,
  onLogout,
  onUpdateProfile,
  onOpenConceptGuide,
}) => {
  // Mode: 'LOGIN' or 'REGISTER'
  const [authMode, setAuthMode] = useState<'LOGIN' | 'REGISTER'>('REGISTER');

  // Form Fields for Registration with 4 Classifiers
  const [formData, setFormData] = useState({
    fullName: supporterProfile.name || '',
    email: supporterProfile.email || '',
    titleRole: supporterProfile.titleRole || '',
    country: supporterProfile.country || (isAr ? 'فلسطين' : 'Palestine'),
    supporterCategory: supporterProfile.supporterCategory || (isAr ? 'شخصية عامة' : 'Public Figure'),
    contentCategory: supporterProfile.contentCategory || (isAr ? 'إنساني وإغاثي' : 'Humanitarian & Relief'),
    platform: supporterProfile.platform || 'YouTube',
    isGhostMode: false,
    agreedToTwoChannelsSponsorship: true,
    agreedToNonMonetaryCharter: true,
    mainRegion: supporterProfile.mainRegion || '',
    publicChannelName: supporterProfile.publicChannelName || '',
  });

  // Login Form Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginCode, setLoginCode] = useState('');

  // UI status
  const [saveDraftStatus, setSaveDraftStatus] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Restore draft on mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(LOCAL_STORAGE_DRAFT_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setFormData((prev) => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
    }
  }, []);

  // Handle Save Draft to localStorage
  const handleSaveDraftLater = () => {
    try {
      localStorage.setItem(LOCAL_STORAGE_DRAFT_KEY, JSON.stringify(formData));
      setSaveDraftStatus(
        isAr
          ? 'تم حفظ البيانات مؤقتاً بنجاح. يمكنك المتابعة في أي وقت لاحقاً.'
          : 'Draft saved successfully. You can resume anytime.'
      );
      setTimeout(() => setSaveDraftStatus(null), 4000);
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      setValidationError(isAr ? 'تعذر حفظ المسودة محلياً' : 'Could not save draft locally');
    }
  };

  // Handle Submit Registration
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!formData.fullName.trim()) {
      setValidationError(isAr ? 'يرجى كتابة الاسم الكامل أو الصفة الإنسانية.' : 'Please enter your full name or title.');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setValidationError(isAr ? 'يرجى كتابة بريد إلكتروني صحيح.' : 'Please enter a valid email address.');
      return;
    }
    if (!formData.agreedToTwoChannelsSponsorship) {
      setValidationError(
        isAr
          ? 'تتطلب صفة الكفيل الالتزام بتبنّي قناتين ميدانيتين على الأقل.'
          : 'Sponsor status requires commitment to adopt at least two field channels.'
      );
      return;
    }
    if (!formData.agreedToNonMonetaryCharter) {
      setValidationError(
        isAr
          ? 'يرجى الإقرار بميثاق المنصة: عدم جمع أموال أو تبرعات مالية على المنصة.'
          : 'Please acknowledge the non-monetary charter.'
      );
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      if (onUpdateProfile) {
        onUpdateProfile({
          name: formData.fullName,
          email: formData.email,
          titleRole: formData.titleRole || formData.supporterCategory || (isAr ? 'كفيل إنساني معتمد' : 'Verified Humanitarian Sponsor'),
          country: formData.country,
          supporterCategory: formData.supporterCategory,
          contentCategory: formData.contentCategory,
          platform: formData.platform,
          mainRegion: formData.mainRegion || formData.country || (isAr ? 'الشرق الأوسط' : 'Middle East'),
          publicChannelName: formData.publicChannelName || (isAr ? 'منبر الكفالة الموحد' : 'Unified Sponsorship Voice'),
        });
      }
      localStorage.removeItem(LOCAL_STORAGE_DRAFT_KEY);
      setIsSubmitting(false);
      onLoginSuccess();
    }, 600);
  };

  // Handle Submit Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!loginEmail.trim()) {
      setValidationError(isAr ? 'يرجى كتابة البريد الإلكتروني المسجل.' : 'Please enter registered email.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onLoginSuccess();
    }, 500);
  };

  /*
    =============================================================================
    SCENARIO A: USER IS ALREADY AUTHENTICATED / LOGGED IN
    Displays the Active Sovereign Account Cockpit status badge with logout/switch
    =============================================================================
  */
  if (isLoggedIn) {
    return (
      <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/30 border-2 border-amber-500/50 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-xl relative overflow-hidden text-right" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-white">
                  {isAr ? 'قمرة الداعم الإنساني (حساب كفيل نشط)' : 'Active Supporter Cockpit'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-amber-400" />
                  <span>{isAr ? 'مصادق بالكامل' : 'Fully Verified'}</span>
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                {isAr
                  ? `مرحباً بك: ${supporterProfile.name} | ${supporterProfile.titleRole}`
                  : `Welcome: ${supporterProfile.name} | ${supporterProfile.titleRole}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            {onOpenConceptGuide && (
              <button
                type="button"
                onClick={onOpenConceptGuide}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition border border-amber-500/30 flex items-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <HelpCircle className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'دليل الصلاحيات' : 'Role Guide'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-2.5 rounded-xl bg-rose-950/50 hover:bg-rose-900/60 text-rose-300 border border-rose-500/40 text-xs font-bold transition flex items-center gap-2 cursor-pointer min-h-[44px]"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-[11px] text-slate-400 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isAr
                ? `عدد القنوات المكفولة: ${supporterProfile.sponsoredPublisherIds.length} قنوات إغاثية | الدولة: ${supporterProfile.country || 'فلسطين'} | التصنيف: ${supporterProfile.supporterCategory || 'شخصية عامة'}`
                : `Sponsored Channels: ${supporterProfile.sponsoredPublisherIds.length} | Country: ${supporterProfile.country || 'Palestine'}`}
            </span>
          </div>
          <span className="font-mono text-slate-500">
            [الأمر السيادي: قمرة الحساب المحمي بالكامل - NA-SOV-2026-0808-008]
          </span>
        </div>
      </div>
    );
  }

  /*
    =============================================================================
    SCENARIO B: UNAUTHENTICATED USER (STRICT AUTH GATEWAY)
    Displays the Registration / Login Gateway exclusively for Supporter Accounts.
    =============================================================================
  */
  return (
    <div className="bg-slate-900 border-2 border-amber-500/40 rounded-2xl md:rounded-3xl shadow-2xl overflow-hidden text-right transition-all" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Top Banner Header */}
      <div className="bg-gradient-to-r from-amber-950 via-slate-900 to-amber-950 p-5 md:p-6 border-b border-amber-500/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 shrink-0">
              <Crown className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg md:text-xl font-black text-white">
                  {isAr ? 'بوابة فتح ودخول حساب الداعم (كفيل)' : 'Supporter Account Gateway'}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {isAr ? 'حساب كفيل مقفل' : 'Private Sponsor Account'}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {isAr
                  ? 'هذه القمرة مخصصة حصرياً لمن يحملون حساب داعم/كفيل. يرجى تسجيل الدخول أو فتح حساب جديد لتفعيل صلاحيات الكفالة المعنوية وتوجيه القنوات.'
                  : 'Tailored strictly for Supporter Account holders. Please sign in or register to unlock sponsorship and guidance features.'}
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => {
                setAuthMode('REGISTER');
                setValidationError(null);
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
                authMode === 'REGISTER'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>{isAr ? 'فتح حساب داعم جديد' : 'Register New Account'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthMode('LOGIN');
                setValidationError(null);
              }}
              className={`px-3.5 py-2 rounded-lg text-xs font-black transition cursor-pointer min-h-[38px] flex items-center gap-1.5 ${
                authMode === 'LOGIN'
                  ? 'bg-amber-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{isAr ? 'تسجيل الدخول لحساب قائم' : 'Sign In Existing'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-5 md:p-7 space-y-6">
        {/* Validation or Draft Status Messages */}
        {validationError && (
          <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-center gap-2 animate-shake">
            <Lock className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {saveDraftStatus && (
          <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{saveDraftStatus}</span>
          </div>
        )}

        {/* MODE 1: REGISTER NEW SUPPORTER ACCOUNT */}
        {authMode === 'REGISTER' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-6">
            {/* SECTION 1: BASIC ACCOUNT CREDENTIALS */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-amber-300 border-b border-slate-800 pb-2">
                {isAr ? '1. البيانات الأساسية للداعم:' : '1. Basic Supporter Info:'}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Field 1: Name / Title */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'الاسم الكامل أو الصفة الإنسانية (مطلوب)' : 'Full Name or Humanitarian Title *'}</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder={isAr ? 'مثال: د. سلمان الكواري - كفيل إنساني' : 'e.g., Dr. Salman Al-Kuwari'}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition min-h-[44px]"
                  />
                </div>

                {/* Field 2: Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'البريد الإلكتروني المعتمد (مطلوب)' : 'Verified Email Address *'}</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="supporter@sovereign.org"
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition min-h-[44px]"
                  />
                </div>

                {/* Field 3: Title / Role */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'اللقب الوظيفي / المسمى المعتمد' : 'Title / Designation'}</span>
                  </label>
                  <input
                    type="text"
                    value={formData.titleRole}
                    onChange={(e) => setFormData({ ...formData, titleRole: e.target.value })}
                    placeholder={isAr ? 'مثال: سفير إنساني / كفيل مؤسسي' : 'Humanitarian Ambassador'}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition min-h-[44px]"
                  />
                </div>

                {/* Field 4: Public Channel Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'اسم المنبر / القناة العامة للإشهار' : 'Public Sponsorship Channel Name'}</span>
                  </label>
                  <input
                    type="text"
                    value={formData.publicChannelName}
                    onChange={(e) => setFormData({ ...formData, publicChannelName: e.target.value })}
                    placeholder={isAr ? 'مثال: منبر الكفالة الإنسانية الموحد' : 'Unified Sponsorship Voice'}
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition min-h-[44px]"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: FOUR ESSENTIAL CLASSIFIERS (NA-SOV-2026-0808-008) */}
            <div className="p-4 rounded-2xl bg-slate-950/80 border border-amber-500/30 space-y-3.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? '2. المصنّفات الأربعة لفهرسة وتصنيف الداعم (Jasmine Classifiers):' : '2. Four Indexing Classifiers:'}</span>
                </h4>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-300 border border-amber-500/20">
                  {isAr ? 'إجباري للفرز' : 'Indexed'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {isAr
                  ? 'هذه المصنّفات الأربعة تضمن ظهور حسابك في محرك البحث المتقدم بقطاع الياسمين لتمكين المتابعين والجمهور من الوصول إليك بدقة.'
                  : 'These four mandatory classifiers index your account inside the Jasmine Sector search engine.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Classifier 1: Country / Territory */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isAr ? 'أ. الدولة / الإقليم:' : 'A. Country:'}</span>
                  </label>
                  <select
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer min-h-[42px]"
                  >
                    <option value="فلسطين">{isAr ? '🇵🇸 فلسطين' : 'Palestine'}</option>
                    <option value="الأردن">{isAr ? '🇯🇴 الأردن' : 'Jordan'}</option>
                    <option value="مصر">{isAr ? '🇪🇬 مصر' : 'Egypt'}</option>
                    <option value="الإمارات">{isAr ? '🇦🇪 الإمارات' : 'UAE'}</option>
                    <option value="قطر">{isAr ? '🇶🇦 قطر' : 'Qatar'}</option>
                    <option value="السعودية">{isAr ? '🇸🇦 السعودية' : 'Saudi Arabia'}</option>
                    <option value="الكويت">{isAr ? '🇰🇼 الكويت' : 'Kuwait'}</option>
                    <option value="العراق">{isAr ? '🇮🇶 العراق' : 'Iraq'}</option>
                    <option value="دولية">{isAr ? '🌐 دولة أخرى / إقليم دولي' : 'International'}</option>
                  </select>
                </div>

                {/* Classifier 2: Supporter Category */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>{isAr ? 'ب. صفة الداعم:' : 'B. Category:'}</span>
                  </label>
                  <select
                    value={formData.supporterCategory}
                    onChange={(e) => setFormData({ ...formData, supporterCategory: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer min-h-[42px]"
                  >
                    <option value="شخصية عامة">{isAr ? '🌟 شخصية عامة / مشهور' : 'Public Figure'}</option>
                    <option value="سفير إنساني">{isAr ? '🎗️ سفير إنساني' : 'Humanitarian Ambassador'}</option>
                    <option value="كفيل مؤسسي">{isAr ? '🏛️ كفيل مؤسسي / شركة' : 'Institutional Sponsor'}</option>
                    <option value="إعلامي وصحفي">{isAr ? '📰 إعلامي / صحفي' : 'Media Professional'}</option>
                    <option value="داعم فردي">{isAr ? '🤝 صانع محتوى / داعم فردي' : 'Individual Supporter'}</option>
                  </select>
                </div>

                {/* Classifier 3: Content Domain / Field */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-cyan-300 flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{isAr ? 'ج. نوع المحتوى / المجال:' : 'C. Domain:'}</span>
                  </label>
                  <select
                    value={formData.contentCategory}
                    onChange={(e) => setFormData({ ...formData, contentCategory: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer min-h-[42px]"
                  >
                    <option value="إنساني وإغاثي">{isAr ? '❤️ إنساني وإغاثي' : 'Humanitarian & Relief'}</option>
                    <option value="إعلام وصحافة">{isAr ? '📰 إعلام وصحافة ميدانية' : 'Media & Journalism'}</option>
                    <option value="معرفي وتعليمي">{isAr ? '🎓 معرفي وتعليمي' : 'Educational & Knowledge'}</option>
                    <option value="فني وثقافي">{isAr ? '🎨 فني وثقافي' : 'Arts & Culture'}</option>
                    <option value="تقني وميداني">{isAr ? '💻 تقني وميداني' : 'Tech & Field'}</option>
                  </select>
                </div>

                {/* Classifier 4: Primary Platform */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-amber-300 flex items-center gap-1">
                    <Share2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'د. المنصة الرئيسية:' : 'D. Primary Platform:'}</span>
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400 cursor-pointer min-h-[42px]"
                  >
                    <option value="YouTube">{isAr ? '▶️ YouTube (يوتيوب)' : 'YouTube'}</option>
                    <option value="TikTok">{isAr ? '🎵 TikTok (تيك توك)' : 'TikTok'}</option>
                    <option value="X">{isAr ? '𝕏 X / Twitter (إكس)' : 'X / Twitter'}</option>
                    <option value="Telegram">{isAr ? '✈️ Telegram (تلغرام)' : 'Telegram'}</option>
                    <option value="Instagram">{isAr ? '📸 Instagram (إنستغرام)' : 'Instagram'}</option>
                    <option value="Facebook">{isAr ? '📘 Facebook (فيسبوك)' : 'Facebook'}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 3: MANDATES & AGREEMENTS CHECKBOXES */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="text-xs font-black text-amber-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>{isAr ? '3. الشروط السيادية لفتح حساب الداعم (الكفيل)' : '3. Sovereign Account Requirements'}</span>
              </h4>

              {/* Checkbox 1: 2 channels commitment */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.agreedToTwoChannelsSponsorship}
                  onChange={(e) => setFormData({ ...formData, agreedToTwoChannelsSponsorship: e.target.checked })}
                  className="mt-0.5 accent-amber-500 w-4 h-4 rounded cursor-pointer"
                />
                <span className="text-xs text-slate-300 group-hover:text-white transition leading-relaxed">
                  <strong className="text-amber-400">{isAr ? 'شرط تبنّي القنوات:' : 'Sponsorship Requirement:'} </strong>
                  {isAr
                    ? 'أقر بالتزامي بتبنّي قناتين ميدانيتين إغاثيتين على الأقل إعلامياً ومعنوياً لضمان استحقاق قمرة الكفيل.'
                    : 'I commit to sponsoring at least two field humanitarian channels to qualify for sponsor status.'}
                </span>
              </label>

              {/* Checkbox 2: Non-monetary charter */}
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.agreedToNonMonetaryCharter}
                  onChange={(e) => setFormData({ ...formData, agreedToNonMonetaryCharter: e.target.checked })}
                  className="mt-0.5 accent-amber-500 w-4 h-4 rounded cursor-pointer"
                />
                <span className="text-xs text-slate-300 group-hover:text-white transition leading-relaxed">
                  <strong className="text-amber-400">{isAr ? 'ميثاق عدم جمع التبرعات المالية:' : 'Non-Monetary Charter:'} </strong>
                  {isAr
                    ? 'أقر بأن جميع أنشطة الكفالة على المنصة غير مالية ومخصصة للتوجيه والإسناد المعنوي فقط.'
                    : 'I acknowledge that all platform sponsorship activity is non-monetary and guidance-focused.'}
                </span>
              </label>

              {/* Checkbox 3: Ghost Mode option */}
              <label className="flex items-start gap-3 cursor-pointer group pt-1">
                <input
                  type="checkbox"
                  checked={formData.isGhostMode}
                  onChange={(e) => setFormData({ ...formData, isGhostMode: e.target.checked })}
                  className="mt-0.5 accent-amber-500 w-4 h-4 rounded cursor-pointer"
                />
                <span className="text-xs text-slate-300 group-hover:text-white transition leading-relaxed">
                  <strong className="text-amber-400">{isAr ? 'تفعيل وضع الشبح الصامت (Ghost Mode):' : 'Enable Ghost Mode:'} </strong>
                  {isAr
                    ? 'إخفاء اسمي وهويتي عن الجمهور العام وإبقاء توجيهاتي سرية صامتة.'
                    : 'Keep my name and identity concealed from public view.'}
                </span>
              </label>
            </div>

            {/* Action Buttons: Save Draft vs Submit */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleSaveDraftLater}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <Save className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'حفظ ومتابعة لاحقاً' : 'Save & Continue Later'}</span>
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg min-h-[44px]"
              >
                <Crown className="w-4 h-4" />
                <span>
                  {isSubmitting
                    ? isAr
                      ? 'جاري تفعيل حساب الداعم...'
                      : 'Activating Supporter Account...'
                    : isAr
                    ? 'إكمال فتح الحساب وتفعيل القمرة'
                    : 'Complete Registration & Activate Cockpit'}
                </span>
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: LOGIN TO EXISTING SUPPORTER ACCOUNT */}
        {authMode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-lg mx-auto py-2">
            <div className="text-center space-y-1 mb-4">
              <h4 className="text-sm font-black text-amber-300">
                {isAr ? 'تسجيل الدخول إلى قمرة الداعم والكفيل' : 'Sign In to Supporter Cockpit'}
              </h4>
              <p className="text-xs text-slate-400">
                {isAr ? 'أدخل البريد الإلكتروني المعتمد للدخول المباشر' : 'Enter your registered email for direct access'}
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'البريد الإلكتروني المسجل' : 'Registered Email Address'}</span>
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="supporter@sovereign.org"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition min-h-[44px]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'رمز التوثيق السيادي (اختياري)' : 'Sovereign Passcode (Optional)'}</span>
              </label>
              <input
                type="password"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition min-h-[44px]"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg min-h-[44px] mt-4"
            >
              <LogIn className="w-4 h-4" />
              <span>
                {isSubmitting
                  ? isAr
                    ? 'جاري التحقق...'
                    : 'Verifying Credentials...'
                  : isAr
                  ? 'دخول قمرة الداعم الأن'
                  : 'Enter Supporter Cockpit Now'}
              </span>
            </button>
          </form>
        )}
      </div>

      {/* Sovereign Footer Note */}
      <div className="p-3.5 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
        <span>[معيار الحراسة المطلقة - NA-AUTH-GUARD-001]</span>
        <span>{isAr ? 'منصة نور الأماني - قطاع الداعمين' : 'Noor Al-Amani Platform'}</span>
      </div>
    </div>
  );
};

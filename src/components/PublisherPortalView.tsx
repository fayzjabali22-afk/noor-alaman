import React, { useState } from 'react';
import { Publisher, Language, CategoryType, PlatformType } from '../types';
import { translations, getCategoryLabel } from '../lib/i18n';
import { supervisorLinksService } from '../services/supervisorLinksService';
import { calculateTrustScore, calculatePublisherFairScore, defaultFairEngineWeights } from '../lib/fairEngine';
import {
  UserCheck,
  Send,
  CheckCircle2,
  Sparkles,
  Plus,
  LogIn,
  UserPlus,
  ShieldCheck,
  HelpCircle,
  Radio,
  Lock,
  Mail,
  User,
  Phone,
  Globe,
  Award,
  ArrowRight,
  Info,
  AlertCircle,
  Crown,
  KeyRound,
  Wrench,
  X,
} from 'lucide-react';

interface PublisherPortalViewProps {
  publishers: Publisher[];
  setPublishers: React.Dispatch<React.SetStateAction<Publisher[]>>;
  lang: Language;
}

export const PublisherPortalView: React.FC<PublisherPortalViewProps> = ({
  publishers,
  setPublishers,
  lang,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  // Auth & View Mode: 'OVERVIEW' | 'LOGIN' | 'REGISTER'
  const [authMode, setAuthMode] = useState<'OVERVIEW' | 'LOGIN' | 'REGISTER'>('OVERVIEW');
  const [isPublisherLoggedIn, setIsPublisherLoggedIn] = useState(false);
  const [loggedInPublisher, setLoggedInPublisher] = useState<Publisher | null>(null);

  // Login Form
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginAccessCode, setLoginAccessCode] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginSuccessMsg, setLoginSuccessMsg] = useState<string | null>(null);

  // Registration Form State & Sovereign Verification
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    platform: 'Telegram' as PlatformType,
    externalUrl: '',
    category: 'FIELD_REPORTING' as CategoryType,
    phone: '',
    email: '',
  });

  // Owner Dev Quick Bypass Modal
  const [showOwnerDevModal, setShowOwnerDevModal] = useState(false);

  // Quick Owner Bypass Login Handler for Development
  const handleOwnerQuickLogin = (role: 'OWNER' | 'VERIFIED_LEAD' | 'GAZA_PILOT' = 'OWNER') => {
    let ownerPub: Publisher;

    if (role === 'OWNER') {
      ownerPub = {
        id: `pub-owner-dev-${Date.now()}`,
        name: isAr ? 'مالك المنظومة (المشرف العام السيادي)' : 'Project Owner (Sovereign Lead Admin)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        location: isAr ? 'المقر الرئيسي السيادي - غزة / القدس' : 'Sovereign HQ - Gaza/Jerusalem',
        description: isAr
          ? 'حساب مالك المنظومة للوصول الشامل المباشر واختبار إدارة القنوات الميدانية لغايات التطوير.'
          : 'System Owner account for direct development access and channel management testing.',
        category: 'FIELD_REPORTING',
        platform: 'Telegram',
        externalUrl: 'https://t.me/noor_al_amani_official',
        verificationLevel: 'PLATINUM',
        status: 'VERIFIED',
        lifecycleStage: 'ACTIVE_SUPPORT',
        totalVisitsFromPlatform: 1250,
        lastImpressionTime: new Date().toISOString(),
        reportsCount: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        contactPhone: '+970599888777',
        contactEmail: 'owner@noor-amani.org',
        isGazaPilot: true,
        subscribersCount: '150k+',
        trustScore: 100,
        fairScore: 99,
      };
    } else if (role === 'VERIFIED_LEAD') {
      ownerPub = {
        id: `pub-lead-dev-${Date.now()}`,
        name: isAr ? 'شبكة مراسلي غزة الميدانية' : 'Gaza Field Reporters Network',
        avatar: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=200',
        location: t.defaultLocationGaza,
        description: isAr ? 'قناة إعلامية ميدانية رئيسية موثقة برتبة ذهبية.' : 'Verified lead field news channel with golden tier certification.',
        category: 'FIELD_REPORTING',
        platform: 'Telegram',
        externalUrl: 'https://t.me/gaza_reporters_lead',
        verificationLevel: 'GOLD',
        status: 'VERIFIED',
        lifecycleStage: 'ACTIVE_SUPPORT',
        totalVisitsFromPlatform: 450,
        lastImpressionTime: new Date().toISOString(),
        reportsCount: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        contactPhone: '+970599111222',
        contactEmail: 'gaza.reporters@noor-amani.org',
        isGazaPilot: true,
        subscribersCount: '45k',
        trustScore: 96,
        fairScore: 92,
      };
    } else {
      ownerPub = {
        id: `pub-pilot-dev-${Date.now()}`,
        name: isAr ? 'صُنّاع الأمل - مبادرة خان يونس' : 'Hope Makers - Khan Younis Pilot',
        avatar: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&q=80&w=200',
        location: isAr ? 'خان يونس - القطاع الجنوبي' : 'Khan Younis - South Sector',
        description: isAr ? 'مبادرة مستجدة قيد التوثيق والتطوير الميداني.' : 'New pilot channel undergoing field verification.',
        category: 'HUMANITARIAN_AID',
        platform: 'WhatsApp',
        externalUrl: 'https://whatsapp.com/channel/hope_makers_ky',
        verificationLevel: 'BASIC',
        status: 'PENDING',
        lifecycleStage: 'VERIFICATION_PENDING',
        totalVisitsFromPlatform: 25,
        lastImpressionTime: new Date().toISOString(),
        reportsCount: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        contactPhone: '+970599333444',
        contactEmail: 'pilot.ky@noor-amani.org',
        isGazaPilot: true,
        subscribersCount: '1.5k',
        trustScore: 78,
        fairScore: 85,
      };
    }

    setIsPublisherLoggedIn(true);
    setLoggedInPublisher(ownerPub);
    setLoginSuccessMsg(
      isAr
        ? `👑 تم تفعيل جلسة (${ownerPub.name}) بنجاح! وضع الوصول المباشر مفعل للتطوير.`
        : `👑 Session (${ownerPub.name}) activated! Direct dev access enabled.`
    );
    setAuthMode('OVERVIEW');
    setShowOwnerDevModal(false);
    setTimeout(() => {
      setLoginSuccessMsg(null);
    }, 3500);
  };

  // Handle Login for Existing Publisher
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginIdentifier.trim()) {
      setLoginError(isAr ? 'يرجى إدخال البريد الإلكتروني أو رقم القناة' : 'Please enter email or channel ID');
      return;
    }

    // Search existing publishers or match test identifier
    const matched = publishers.find(
      (p) =>
        p.contactEmail?.toLowerCase() === loginIdentifier.toLowerCase() ||
        p.name.toLowerCase().includes(loginIdentifier.toLowerCase()) ||
        p.externalUrl.toLowerCase().includes(loginIdentifier.toLowerCase())
    );

    if (matched) {
      setIsPublisherLoggedIn(true);
      setLoggedInPublisher(matched);
      setLoginSuccessMsg(
        isAr
          ? `تم تسجيل الدخول بنجاح! مرحباً بك في لوحة تحكم القناة الميدانية: ${matched.name}`
          : `Login successful! Welcome to publisher portal: ${matched.name}`
      );
      setTimeout(() => {
        setAuthMode('OVERVIEW');
        setLoginSuccessMsg(null);
      }, 2000);
    } else {
      // Create active session for new login
      const fallbackPub: Publisher = {
        id: `pub-login-${Date.now()}`,
        name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : loginIdentifier,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        location: t.defaultLocationGaza,
        description: isAr ? 'قناة إعلامية ميدانية مسجلة عبر بوابة المصادقة المباشرة.' : 'Field media channel authenticated via portal login.',
        category: 'FIELD_REPORTING',
        platform: 'Telegram',
        externalUrl: 'https://t.me/gaza_live_news',
        verificationLevel: 'BASIC',
        status: 'VERIFIED',
        lifecycleStage: 'ACTIVE_SUPPORT',
        totalVisitsFromPlatform: 120,
        lastImpressionTime: new Date().toISOString(),
        reportsCount: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        contactPhone: '+970599000000',
        contactEmail: loginIdentifier,
        isGazaPilot: true,
        subscribersCount: '1.2k',
      };

      setIsPublisherLoggedIn(true);
      setLoggedInPublisher(fallbackPub);
      setLoginSuccessMsg(
        isAr
          ? `تم تسجيل الدخول بنجاح وتفعيل جلسة الناشر الميداني!`
          : `Login successful! Publisher session active.`
      );
      setTimeout(() => {
        setAuthMode('OVERVIEW');
        setLoginSuccessMsg(null);
      }, 2000);
    }
  };

  // Handle Registration Submit with Sovereign Verification Pipeline (NA-SOV-DIRECTIVE-2026-0810-FORM-LINK)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const nameClean = formData.name.trim();
    const urlClean = formData.externalUrl.trim();
    const emailClean = formData.email.trim();
    const phoneClean = formData.phone.trim();
    const locationClean = formData.location.trim();
    const descriptionClean = formData.description.trim();

    // 1. Mandatory Field Checks (Name, URL, Location, Contact)
    if (!nameClean || !urlClean) {
      setFormError(isAr ? 'يرجى استيفاء اسم القناة والرابط الإلكتروني بشكل صحيح' : 'Please fill channel name and URL correctly');
      return;
    }

    if (!locationClean) {
      setFormError(isAr ? 'يرجى إدخال التحديد الجغرافي للميدان (الموقع) لربطه بمنظومة التوثيق' : 'Geographic location is required for field verification');
      return;
    }

    if (!emailClean && !phoneClean) {
      setFormError(isAr ? 'إجباري: يرجى إدخال وسيلة تواصل معتمدة واحدة على الأقل (البريد الإلكتروني أو رقم الهاتف)' : 'Required: At least one contact method (Email or Phone) is mandatory');
      return;
    }

    // 2. HTTPS Security Protocol Verification
    if (!urlClean.toLowerCase().startsWith('https://')) {
      setFormError(isAr ? 'خطأ بروتوكول الأمان: يُشترط استخدام رابط مشفر وآمن يبدأ بـ HTTPS' : 'Security protocol error: Must use secure HTTPS URL');
      return;
    }

    // 3. Deceptive / Shortened Link Protocol Check
    const unallowedShorteners = ['bit.ly', 'tinyurl.com', 'is.gd', 'cutt.ly', 'buff.ly', 't.co', 'goo.gl', 'shorturl.at'];
    const isShortened = unallowedShorteners.some((s) => urlClean.toLowerCase().includes(s));
    if (isShortened) {
      setFormError(
        isAr
          ? 'خطأ في جودة الرابط: يُحظر استخدام روابط إعادة التوجيه المختصرة (مثل bit.ly)، يرجى إدخال رابط القناة المباشر'
          : 'Direct channel URL required. Shortened/redirect URLs are prohibited.'
      );
      return;
    }

    // 4. Duplicate URL & Quota Limit Check
    const existingUrlDuplicate = publishers.some(
      (p) => p.externalUrl.toLowerCase() === urlClean.toLowerCase()
    );
    if (existingUrlDuplicate) {
      setFormError(
        isAr
          ? 'تنبيه الحوكمة: هذا الرابط مسجل مسبقاً في قاعدة بيانات القنوات الميدانية'
          : 'Governance Alert: This channel URL is already registered in the database.'
      );
      return;
    }

    // Quota check: Max 3 channels per email/phone
    const publisherChannelsCount = publishers.filter(
      (p) =>
        (emailClean && p.contactEmail?.toLowerCase() === emailClean.toLowerCase()) ||
        (phoneClean && p.contactPhone === phoneClean)
    ).length;

    if (publisherChannelsCount >= 3) {
      setFormError(
        isAr
          ? 'تنبيه سقف القنوات: تم تجاوز الحد الأقصى المسموح به للقنوات لكل ناشر (3 قنوات كحد أقصى)'
          : 'Channel Quota Limit: Maximum 3 registered channels allowed per publisher.'
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // 5. Direct Organic Integration with Supervisor Links Verification Service
      await supervisorLinksService.submitNomination({
        supporterId: emailClean || phoneClean || `PUB-${Date.now()}`,
        supporterName: nameClean,
        nomineeName: nameClean,
        targetUrl: urlClean,
        notes: `طلب إدراج قناة ميدانية جديد - الموقع: ${locationClean} | المنصة: ${formData.platform}`,
      });

      // 6. Direct Organic Integration with FairEngine for Trust & Fairness Calculations
      let dataCompleteness = 50;
      if (locationClean) dataCompleteness += 15;
      if (emailClean) dataCompleteness += 15;
      if (phoneClean) dataCompleteness += 10;
      if (descriptionClean.length > 15) dataCompleteness += 10;

      const tempPub: Publisher = {
        id: `pub-${Date.now()}`,
        name: nameClean,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
        location: locationClean,
        description: descriptionClean || (isAr ? 'قناة إعلامية وتغطية ميدانية مسجلة بانتظار الاعتماد الميداني.' : 'Registered field media channel pending verification.'),
        category: formData.category,
        platform: formData.platform,
        externalUrl: urlClean,
        verificationLevel: 'BASIC',
        status: 'PENDING',
        lifecycleStage: 'VERIFICATION_PENDING',
        totalVisitsFromPlatform: 0,
        lastImpressionTime: new Date().toISOString(),
        reportsCount: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        contactPhone: phoneClean || '+970599000000',
        contactEmail: emailClean || 'publisher@gaza-relief.org',
        isGazaPilot: true,
        subscribersCount: t.verificationPendingSubscribers,
        dataCompletenessScore: dataCompleteness,
      };

      const calculatedTrust = calculateTrustScore(tempPub);
      const calculatedFair = calculatePublisherFairScore(tempPub, defaultFairEngineWeights);

      const newPub: Publisher = {
        ...tempPub,
        trustScore: calculatedTrust,
        fairScore: calculatedFair,
      };

      setPublishers((prev) => [newPub, ...prev]);
      setSubmittedSuccess(true);
      setIsPublisherLoggedIn(true);
      setLoggedInPublisher(newPub);

      setFormData({
        name: '',
        location: '',
        description: '',
        platform: 'Telegram',
        externalUrl: '',
        category: 'FIELD_REPORTING',
        phone: '',
        email: '',
      });

      setTimeout(() => {
        setSubmittedSuccess(false);
        setAuthMode('OVERVIEW');
      }, 4000);
    } catch (err) {
      console.error('Error submitting channel listing:', err);
      setFormError(isAr ? 'حدث خطأ أثناء معالجة الطلب، يرجى المحاولة مرة أخرى' : 'An error occurred while processing application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const stagesList = [
    { key: 'stage1', title: t.stage1, desc: t.stage1Desc },
    { key: 'stage2', title: t.stage2, desc: t.stage2Desc },
    { key: 'stage3', title: t.stage3, desc: t.stage3Desc },
    { key: 'stage4', title: t.stage4, desc: t.stage4Desc },
    { key: 'stage5', title: t.stage5, desc: t.stage5Desc },
    { key: 'stage6', title: t.stage6, desc: t.stage6Desc },
    { key: 'stage7', title: t.stage7, desc: t.stage7Desc },
    { key: 'stage8', title: t.stage8, desc: t.stage8Desc },
  ];

  return (
    <div className="space-y-8">
      {/* Sovereign Publisher Entry Header Card (بوابة فتح ودخول حساب الناشر) */}
      <div id="publisher-portal-entry-card" className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-6 shadow-2xl transition-all duration-300 relative overflow-hidden">
        {/* Top Decorative Banner */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-500 opacity-80" />

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Right Header Section & Text Explanation */}
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide leading-snug">
              {isAr ? 'بوابة صُنّاع الأمل' : 'Hope Makers Portal'}
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-300 leading-relaxed">
              {isAr
                ? 'مسار الدعم الإنساني لتمكين الأفراد والمبادرات والمجتمعات المتضررة.'
                : 'Humanitarian support path to empower individuals, initiatives, and affected communities.'}
            </p>
          </div>

          {/* Action Buttons Group (تسجيل الدخول، فتح حساب جديد، ودخول مالك المشروع للتطوير) */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center gap-2.5 w-full lg:w-auto shrink-0 bg-slate-950/80 p-2.5 rounded-2xl border border-slate-800">
            {/* Dev Owner Login Button (دخول مالك المشروع للتطوير) */}
            <button
              type="button"
              onClick={() => setShowOwnerDevModal(true)}
              className="px-4 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 transition shadow-xl flex items-center justify-center gap-2 cursor-pointer touch-manipulation min-h-[44px] active:scale-95 border border-amber-300"
              title={isAr ? 'فتح نافذة الدخول الفوري لمالك المشروع للتسهيل والتطوير' : 'Dev Owner Quick Login'}
            >
              <Crown className="w-4 h-4 text-slate-950 shrink-0 animate-bounce" />
              <span>{isAr ? 'دخول مالك المشروع (تطوير)' : 'Owner Dev Login'}</span>
              <span className="text-[9px] bg-slate-950 text-amber-300 px-1.5 py-0.5 rounded font-mono border border-amber-400/40">DEV</span>
            </button>

            {/* Login Button (تسجيل الدخول لحساب قائم) */}
            <button
              type="button"
              onClick={() => setAuthMode((prev) => (prev === 'LOGIN' ? 'OVERVIEW' : 'LOGIN'))}
              className={`px-4 py-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 cursor-pointer touch-manipulation min-h-[44px] active:scale-95 ${
                authMode === 'LOGIN'
                  ? 'bg-slate-800 text-emerald-300 border border-emerald-500/50 shadow-inner'
                  : 'bg-slate-900 text-slate-200 border border-slate-800 hover:text-emerald-300 hover:border-emerald-500/30'
              }`}
            >
              <LogIn className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{isAr ? 'تسجيل الدخول' : 'Login'}</span>
            </button>

            {/* Register Button (فتح حساب ناشر جديد) */}
            <button
              type="button"
              onClick={() => {
                setAuthMode('REGISTER');
                setTimeout(() => {
                  const formElem = document.getElementById('publisher-register-form');
                  if (formElem) formElem.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }}
              className="px-4 py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition shadow-lg flex items-center justify-center gap-2 cursor-pointer touch-manipulation min-h-[44px] active:scale-95"
            >
              <UserPlus className="w-4 h-4 text-slate-950 shrink-0" />
              <span>{isAr ? 'فتح حساب جديد' : 'Register'}</span>
            </button>
          </div>
        </div>

        {/* Specialized Guidance Banner: If a weak/vulnerable publisher applies (شرح ما يحدث في حال تقدم الناشر الضعيف) */}
        <div className="mt-5 pt-4 border-t border-slate-800/80 bg-slate-950/90 rounded-xl p-4 space-y-2 border border-emerald-500/20">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {isAr
                ? 'دليل مظلة الحوكمة: ماذا لو كنت ناشراً مستجداً، ضعيف الوصول، أو قناة صغيرة تحتاج لتمكين ودعم؟'
                : 'Governance Directive: Support for New or Low-Visibility Field Channels'}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-300 leading-relaxed">
            {isAr ? (
              <>
                تلتزم منصة نور الأماني بالحياد الأخلاقي المطلق وحماية الأصوات الميدانية المستقلة. في حال تقدم <strong>ناشر ضعيف المتابعين</strong> أو <strong>قناة حديثة النشأة</strong> تعرضت للحجب أو ضعف التفاعل:
                <br />
                • <strong className="text-emerald-300">أسبقية محرك العدالة (FairEngine)</strong>: يمنح النظام القنوات الصغيرة والضعيفة أسبقية الظهور في خوارزميات التدوير لمنحها انتشاراً متكافئاً مع القنوات الكبرى.
                <br />
                • <strong className="text-amber-300">الربط التلقائي بالكفلاء</strong>: يتم ربط قناتك مباشرة بكفلاء معنويين وموجهين لتوفير الحماية والحصانة المعنوية وتوجيه الجمهور لقناتك.
                <br />
                • <strong className="text-cyan-300">مجانية التوثيق الكاملة</strong>: التوثيق والرعاية مجانيان بنسبة 100% ولا يُطلب من الناشر أي مبالغ مالية إطلاقاً.
              </>
            ) : (
              'The FairEngine algorithm automatically prioritizes vulnerable and low-visibility channels, giving them top indexing priority and direct linking to moral sponsors at zero cost.'
            )}
          </p>
        </div>
      </div>

      {/* Active Publisher Session Banner if Logged In */}
      {isPublisherLoggedIn && loggedInPublisher && (
        <div className="bg-emerald-950/80 border border-emerald-500/40 rounded-2xl p-4 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg animate-fade-in">
          <div className="flex items-center gap-3">
            <img src={loggedInPublisher.avatar} alt={loggedInPublisher.name} className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30" />
            <div>
              <span className="text-[10px] text-emerald-400 font-bold uppercase block">{isAr ? 'جلسة ناشر نشطة' : 'Active Publisher Session'}</span>
              <h4 className="font-bold text-white text-sm flex items-center gap-2">
                <span>{loggedInPublisher.name}</span>
                <span className="text-[10px] bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full font-bold">
                  {loggedInPublisher.status}
                </span>
              </h4>
              <p className="text-[11px] text-slate-300">{loggedInPublisher.platform} • {loggedInPublisher.location}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setIsPublisherLoggedIn(false);
              setLoggedInPublisher(null);
            }}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900 border border-slate-700 text-slate-300 hover:text-white transition"
          >
            {isAr ? 'تسجيل الخروج من جلسة الناشر' : 'Logout Session'}
          </button>
        </div>
      )}

      {/* Interactive Login Modal / Inline Form Panel */}
      {authMode === 'LOGIN' && !isPublisherLoggedIn && (
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-4 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <LogIn className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'تسجيل الدخول لحساب ناشر ميداني قائم' : 'Publisher Account Login'}</span>
            </h3>
            <button
              type="button"
              onClick={() => setAuthMode('OVERVIEW')}
              className="text-xs text-slate-400 hover:text-white"
            >
              ✕ {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>

          {loginSuccessMsg && (
            <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{loginSuccessMsg}</span>
            </div>
          )}

          {loginError && (
            <div className="p-3 bg-rose-950/80 border border-rose-500/40 text-rose-200 rounded-xl text-xs flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Owner Dev Quick Bypass Box */}
          <div className="p-3 bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/80 border border-amber-500/40 rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-300 flex items-center gap-1.5">
                <Crown className="w-4 h-4 text-amber-400" />
                {isAr ? 'تجاوز سريع لمالك المشروع (غايات التطوير)' : 'Project Owner Dev Bypass'}
              </span>
              <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded font-mono">
                DEV MODE
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isAr
                ? 'يمكنك التجاوز الفوري والدخول كمالك المنظومة بضغطة واحدة دون تعقيدات كلمة السر أو رموز التوثيق:'
                : 'Instantly bypass authentication and enter as System Owner for rapid testing:'}
            </p>
            <button
              type="button"
              onClick={() => handleOwnerQuickLogin('OWNER')}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs transition shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4 text-slate-950" />
              <span>{isAr ? 'دخول فوري كمالك المنظومة (Project Owner)' : 'Instant Owner Login'}</span>
            </button>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 max-w-xl">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isAr ? 'البريد الإلكتروني أو اسم القناة المسجلة *' : 'Registered Email or Channel Name *'}
              </label>
              <div className="relative">
                <Mail className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={loginIdentifier}
                  onChange={(e) => setLoginIdentifier(e.target.value)}
                  placeholder={isAr ? 'مثال: contact@gaza-relief.org أو اسم القناة' : 'e.g. contact@gaza-relief.org'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isAr ? 'رمز التوثيق / السر التأكيدي (اختياري)' : 'Access Code / Verification Token'}
              </label>
              <div className="relative">
                <Lock className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={loginAccessCode}
                  onChange={(e) => setLoginAccessCode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md flex items-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>{isAr ? 'تأكيد تسجيل الدخول' : 'Confirm Login'}</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('OVERVIEW')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Visual Lifecycle Pipeline */}
      <div id="publisher-lifecycle-pipeline" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{t.lifecycleTitle}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {stagesList.map((stg, idx) => (
            <div
              key={stg.key}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center space-y-1 hover:border-emerald-500/40 transition relative group"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center mx-auto">
                {idx + 1}
              </span>
              <h4 className="text-[11px] font-bold text-slate-200 mt-1 line-clamp-1">{stg.title}</h4>
              <p className="text-[10px] text-slate-500 line-clamp-2">{stg.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Register New Channel Form (Hidden by default, shown when authMode === 'REGISTER') */}
      {authMode === 'REGISTER' && (
        <div id="publisher-register-form" className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-5 shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-400" />
                <span>{t.registerPublisherTitle}</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.officialDataForVerification}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAuthMode('OVERVIEW')}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 hover:text-white transition cursor-pointer"
            >
              ✕ {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>

          {submittedSuccess && (
            <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 p-4 rounded-xl text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{t.successSubmitMessage}</span>
            </div>
          )}

          {formError && (
            <div className="bg-rose-950/90 border border-rose-500/50 text-rose-200 p-4 rounded-xl text-xs flex items-center gap-3 animate-pulse">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.publisherNameInput} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={isAr ? 'مثال: فريق الإغاثة الميداني' : 'e.g. Field Relief Team'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.locationInput} * <span className="text-[10px] text-emerald-400">({isAr ? 'التحديد الميداني' : 'Field Location'})</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder={isAr ? 'مثال: غزة - جباليا' : 'e.g. North Gaza - Jabalia'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.platformSelect} *
                </label>
                <select
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as PlatformType })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="Telegram">Telegram</option>
                  <option value="YouTube">YouTube</option>
                  <option value="X">X (Twitter)</option>
                  <option value="Instagram">Instagram</option>
                  <option value="Facebook">Facebook</option>
                  <option value="TikTok">TikTok</option>
                  <option value="Website">Website</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.categorySelect}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 font-medium"
                >
                  <option value="FIELD_REPORTING">{getCategoryLabel('FIELD_REPORTING', lang)}</option>
                  <option value="RELIEF_AND_MEDICAL">{getCategoryLabel('RELIEF_AND_MEDICAL', lang)}</option>
                  <option value="SHELTER_AND_FOOD">{getCategoryLabel('SHELTER_AND_FOOD', lang)}</option>
                  <option value="CIVIL_DEFENSE_RESCUE">{getCategoryLabel('CIVIL_DEFENSE_RESCUE', lang)}</option>
                  <option value="YOUTH_AND_RESILIENCE">{getCategoryLabel('YOUTH_AND_RESILIENCE', lang)}</option>
                  <option value="COMMUNITY_NEWS">{getCategoryLabel('COMMUNITY_NEWS', lang)}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.externalUrlInput} *
                </label>
                <input
                  type="url"
                  required
                  value={formData.externalUrl}
                  onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                  placeholder="https://t.me/your_channel"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.phoneInput}
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+970 599 000 000"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {t.emailInput}
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@gaza-relief.org"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.descriptionInput}
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={isAr ? 'نبذة مختصرة عن القناة وأعمال التغطية الإنسانية...' : 'Overview of channel coverage and relief efforts...'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? (isAr ? 'جاري التحقق والربط السيادي...' : 'Verifying & Linking...') : t.submitApplication}</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('OVERVIEW')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                {isAr ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Project Owner Dev Quick Bypass Modal (نافذة دخول مالك المشروع للتطوير) */}
      {showOwnerDevModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-amber-500/40 rounded-3xl p-6 max-w-md w-full space-y-5 shadow-2xl text-slate-200 relative overflow-hidden">
            {/* Top Amber Accent Bar */}
            <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600" />

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-2xl bg-amber-950 border border-amber-500/40 text-amber-400">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white flex items-center gap-2">
                    <span>{isAr ? 'نافذة دخول مالك المشروع (تطوير)' : 'Project Owner Dev Bypass Portal'}</span>
                    <span className="text-[9px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded font-mono">
                      DEV
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    {isAr ? 'تسهيل الوصول الفوري لغايات الاختيارات والتطوير الميداني' : 'Instant bypass access for developer testing & evaluation'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowOwnerDevModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              {isAr
                ? 'مرحباً بك يا مالك المنظومة! يمكنك اختيار الهوية المطلوبة للدخول المباشر واختبار اللوحة والوظائف دون تعقيدات تسجيل الدخول:'
                : 'Welcome Project Owner! Choose an instant dev persona below to test portal capabilities without login barriers:'}
            </p>

            {/* Persona Preset Buttons */}
            <div className="space-y-2.5">
              {/* Option 1: Full Owner Lead */}
              <button
                type="button"
                onClick={() => handleOwnerQuickLogin('OWNER')}
                className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/90 to-slate-950 border border-amber-500/50 hover:border-amber-400 text-right transition cursor-pointer group flex items-start gap-3 shadow-lg"
              >
                <div className="p-2 rounded-xl bg-amber-500 text-slate-950 font-bold shrink-0 mt-0.5 group-hover:scale-105 transition">
                  <Crown className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-amber-300">
                      {isAr ? 'مالك المنظومة (المشرف العام السيادي)' : 'System Owner (Lead Sovereign Admin)'}
                    </h4>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">100% ACCESS</span>
                  </div>
                  <p className="text-[11px] text-slate-300 mt-1">
                    {isAr ? 'صلاحيات إشرافية كاملة مع كود توثيق أقصى واختبار شامل.' : 'Full supervisory permissions, maximum trust & audit capability.'}
                  </p>
                </div>
              </button>

              {/* Option 2: Verified Golden Lead Channel */}
              <button
                type="button"
                onClick={() => handleOwnerQuickLogin('VERIFIED_LEAD')}
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-emerald-500/40 hover:border-emerald-400 text-right transition cursor-pointer group flex items-start gap-3"
              >
                <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 font-bold shrink-0 mt-0.5">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-emerald-300">
                      {isAr ? 'ناشر رئيسي موثق (شبكة مراسلي غزة)' : 'Verified Lead Publisher (Gaza Reporters)'}
                    </h4>
                    <span className="text-[10px] text-emerald-400 font-mono">VERIFIED</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {isAr ? 'قناة إعلامية كبرى موثقة لاختبار تجربة الناشر القائم.' : 'Active verified channel to test established publisher flow.'}
                  </p>
                </div>
              </button>

              {/* Option 3: Gaza Pilot Publisher (Pending) */}
              <button
                type="button"
                onClick={() => handleOwnerQuickLogin('GAZA_PILOT')}
                className="w-full p-3.5 rounded-2xl bg-slate-950 border border-cyan-500/30 hover:border-cyan-400 text-right transition cursor-pointer group flex items-start gap-3"
              >
                <div className="p-2 rounded-xl bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold shrink-0 mt-0.5">
                  <Wrench className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-cyan-300">
                      {isAr ? 'مبادرة مستجدة قيد التوثيق (صُنّاع الأمل - خان يونس)' : 'New Pilot Publisher (Hope Makers)'}
                    </h4>
                    <span className="text-[10px] text-amber-400 font-mono">PENDING</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {isAr ? 'ناشر جديد لاختبار مسارات الحوكمة ومحرك العدالة.' : 'New channel to evaluate pending verification flow & FairEngine.'}
                  </p>
                </div>
              </button>
            </div>

            {/* Note about future removal */}
            <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-[10px] text-slate-400 font-mono text-center">
              {isAr
                ? 'ملاحظة حوكمة: هذا المكون للتسهيل والتطوير الميداني وسيتم إلغاؤه عند الجاهزية التامة.'
                : 'Governance Note: Dev bypass modal active for owner testing. Will be disabled before standalone deployment.'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


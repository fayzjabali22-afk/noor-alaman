import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Check,
  ArrowLeft,
  ArrowRight,
  Video,
  Globe,
  Award,
  Link as LinkIcon,
  Lock,
  ExternalLink,
  Info,
  CheckCircle2,
  FileText,
  Copy,
  Compass,
  Plus,
  Trash2,
  HelpCircle,
  X,
  Crown,
  Share2,
  Lightbulb,
  Users,
  ShieldAlert,
  Bot,
  Calendar,
  Clock,
  MessageSquare,
  Settings,
  CheckCircle,
  Send,
  Volume2,
} from 'lucide-react';
import {
  parseAndValidateJasmineVideo,
  sanitizeExternalUrl,
  AdoptedChannelSupport,
  AdoptionDurationPolicy,
  ReciprocalSynergySettings,
  JasmineStep2Data,
  JasmineOnboardingData,
  AVAILABLE_PUBLISHER_CHANNELS,
  PublisherChannelOption,
  OneWayGuidanceNote,
  INITIAL_GUIDANCE_NOTES,
} from '../services/jasmineService';

export type { JasmineOnboardingData };

export type OnboardingStepId = 1 | 2 | 3;

export interface DynamicExplainerProps {
  channelName: string;
  supportTypes?: AdoptedChannelSupport['supportTypes'];
  durationPolicy?: AdoptionDurationPolicy;
}

export const DynamicExplainer: React.FC<DynamicExplainerProps> = ({
  channelName,
  supportTypes,
  durationPolicy,
}) => {
  if (!supportTypes && !durationPolicy) return null;

  return (
    <div className="mt-3 p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-200/90 leading-relaxed">
      <div className="font-semibold mb-1 text-emerald-400 flex items-center gap-1.5">
        <span>💡</span> رؤية التمكين لـ ({channelName}):
      </div>

      {/* الشرح الديناميكي لأنواع الدعم */}
      {supportTypes && (
        <ul className="list-disc list-inside space-y-1 opacity-90 text-[11px]">
          {supportTypes.isGodfather && (
            <li>
              <b>العرّاب:</b> تقديم دعم مادي/معدات لوجستية مباشرة خارج المنظومة.
            </li>
          )}
          {supportTypes.isOrientation && (
            <li>
              <b>التوجيه:</b> دعوة جمهورك ومتابعيك لتشغيل ومتابعة هذه القناة.
            </li>
          )}
          {supportTypes.isMentorship && (
            <li>
              <b>الإرشاد:</b> تقديم نصائح تقنية وتوجيهات لتطوير أداء البث والمحتوى.
            </li>
          )}
          {supportTypes.isCoCreation && (
            <li>
              <b>الإنتاج المشترك:</b> استضافة صانع المحتوى أو مشاركته في بث/فيديو.
            </li>
          )}
        </ul>
      )}

      {/* الشرح الديناميكي لسقف التبني */}
      {durationPolicy && (
        <div className="mt-2 pt-2 border-t border-emerald-500/10 text-emerald-300 text-[11px]">
          <b>سقف مدة التبني: </b>
          {durationPolicy.type === 'SUBSCRIBER_TARGET' && (
            <span>
              ينتهي التبني تلقائياً عند وصول القناة لـ{' '}
              {durationPolicy.subscriberTargetCount?.toLocaleString()} مشترك.
            </span>
          )}
          {durationPolicy.type === 'TIME_BOUND' && (
            <span>تبني زمني لمدة ({durationPolicy.durationMonths}) شهر.</span>
          )}
          {durationPolicy.type === 'MILESTONE_BASED' && (
            <span>
              ينتهي التبني بعد تحقيق المهمة: "{durationPolicy.milestoneDescription}".
            </span>
          )}
          {durationPolicy.type === 'PERMANENT' && (
            <span>كفالة ورعاية مستمرة دون حد زمني (ظروف استثنائية).</span>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Smart Header & Universal Back Navigation Component (NA-EXEC-2026-JASMINE-08-UIUX-P55)
// ============================================================================
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
        {currentStep > 1 && onBack && (
          <button
            onClick={onBack}
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-100 bg-slate-800 hover:bg-slate-700 active:scale-95 transition-all rounded-lg border border-slate-700 shadow-sm cursor-pointer"
            aria-label={isAr ? 'العودة للخطوة السابقة' : 'Return to Previous Step'}
          >
            {isAr ? <ArrowRight className="w-3.5 h-3.5 text-amber-400" /> : <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />}
            <span>{isAr ? 'عودة' : 'Back'}</span>
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

export interface JasmineOnboardingWizardProps {
  onComplete: (data: JasmineOnboardingData) => void;
  onClose?: () => void;
  onOpenGuidance?: () => void;
  lang?: 'ar' | 'en';
  isAccountVerified?: boolean;
}

export const JasmineOnboardingWizard: React.FC<JasmineOnboardingWizardProps> = ({
  onComplete,
  onClose,
  onOpenGuidance,
  lang = 'ar',
  isAccountVerified = true,
}) => {
  const isAr = lang === 'ar';

  // Active Tab State
  const [activeTab, setActiveTab] = useState<OnboardingStepId>(1);

  // Single Form State
  const [celebrityName, setCelebrityName] = useState('');
  const [titleRole, setTitleRole] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'YouTube' | 'TikTok' | 'Instagram' | 'Facebook' | 'X' | 'Vimeo'>('YouTube');
  const [videoUrl, setVideoUrl] = useState('');
  const [humanitarianPledgeAgreed, setHumanitarianPledgeAgreed] = useState(false);
  const [humanitarianStatement, setHumanitarianStatement] = useState('');
  const [endorsedCampaign, setEndorsedCampaign] = useState(
    isAr ? 'مبادرة دعم التغطيات الإنسانية في غزة والمناطق المنكوبة' : 'Gaza & Affected Areas Humanitarian Support Initiative'
  );

  // Per-Channel Support Adoption Slots State (NA-EXEC-2026-JASMINE-03-P55)
  // Default to 2 mandatory slots
  const [adoptedChannels, setAdoptedChannels] = useState<AdoptedChannelSupport[]>([
    {
      channelId: AVAILABLE_PUBLISHER_CHANNELS[0].id,
      channelName: AVAILABLE_PUBLISHER_CHANNELS[0].name,
      supportTypes: {
        isGodfather: true,
        isOrientation: true,
        isMentorship: false,
        isCoCreation: false,
      },
    },
    {
      channelId: AVAILABLE_PUBLISHER_CHANNELS[1].id,
      channelName: AVAILABLE_PUBLISHER_CHANNELS[1].name,
      supportTypes: {
        isGodfather: false,
        isOrientation: true,
        isMentorship: true,
        isCoCreation: false,
      },
    },
  ]);

  // Step 2 Adoption Duration Policies Per Channel (NA-EXEC-2026-JASMINE-05-STEP2-P55)
  const [channelDurationPolicies, setChannelDurationPolicies] = useState<Record<string, AdoptionDurationPolicy>>({
    [AVAILABLE_PUBLISHER_CHANNELS[0].id]: {
      type: 'SUBSCRIBER_TARGET',
      subscriberTargetCount: 10000,
    },
    [AVAILABLE_PUBLISHER_CHANNELS[1].id]: {
      type: 'TIME_BOUND',
      durationMonths: 1.5,
    },
  });

  // Step 2 One-Way Direct Communication Preferences
  const [communicationPref, setCommunicationPref] = useState<{
    allowOneWayNotes: boolean;
    allowExternalContactRequest: boolean;
  }>({
    allowOneWayNotes: true,
    allowExternalContactRequest: false,
  });

  // Step 2 Reciprocal Synergy & Cross-Promotion (NA-EXEC-2026-JASMINE-07-RECIPROCAL-P55)
  const [reciprocalSynergy, setReciprocalSynergy] = useState<ReciprocalSynergySettings>({
    enableCrossPromotion: true,
    enableHumanitarianVideoLink: true,
  });

  // Step 2 Smart Defaults 1-Click Fast Track Toggle (NA-EXEC-2026-JASMINE-06-SMART-DEFAULTS-P55)
  const [showManualSettings, setShowManualSettings] = useState(false);

  // Step 2 Ethical Link Copy Feedback
  const [linkCopiedFeedback, setLinkCopiedFeedback] = useState(false);

  // Step 3 One-Way Direct Guidance Notes State
  const [guidanceNotes, setGuidanceNotes] = useState<OneWayGuidanceNote[]>(INITIAL_GUIDANCE_NOTES);
  const [noteTargetChannelId, setNoteTargetChannelId] = useState<string>('');
  const [noteCategory, setNoteCategory] = useState<'TECHNICAL_FEEDBACK' | 'PROMOTION_SCHEDULE' | 'GENERAL_RECOMMENDATION' | 'EXTERNAL_LINK_REQUEST'>('PROMOTION_SCHEDULE');
  const [noteContent, setNoteContent] = useState<string>('');
  const [noteSuccessMsg, setNoteSuccessMsg] = useState<string | null>(null);
  const [noteFormError, setNoteFormError] = useState<string | null>(null);

  const [stepError, setStepError] = useState<string | null>(null);
  const [showAssistantModal, setShowAssistantModal] = useState(false);

  // One-Way Guidance Note Handler
  const handleSendGuidanceNote = (e: React.FormEvent) => {
    e.preventDefault();
    setNoteFormError(null);

    if (!noteContent.trim()) {
      setNoteFormError(isAr ? 'يرجى كتابة نص التوجيه أو الملاحظة قبل الإرسال.' : 'Please enter guidance note content before sending.');
      return;
    }

    const selectedChannelObj = adoptedChannels.find((c) => c.channelId === noteTargetChannelId) || adoptedChannels[0];

    const newNote: OneWayGuidanceNote = {
      id: `note-${Date.now()}`,
      celebrityId: 'jas-active',
      celebrityName: celebrityName || (isAr ? 'شخصية عامة' : 'Public Figure'),
      targetChannelId: selectedChannelObj?.channelId || 'pub-01',
      targetChannelName: selectedChannelObj?.channelName || (isAr ? 'القناة المتبناة' : 'Adopted Channel'),
      category: noteCategory,
      content: noteContent.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'DELIVERED',
    };

    setGuidanceNotes((prev) => [newNote, ...prev]);
    setNoteSuccessMsg(
      isAr
        ? 'تم إرسال الملاحظة الموجهة بنجاح عبر نظام الإشعارات أحادي الاتجاه.'
        : 'Guidance note sent successfully via one-way notification system.'
    );
    setNoteContent('');
    setTimeout(() => setNoteSuccessMsg(null), 3500);
  };

  // Smart Defaults Preset Handler (1-Click Approval)
  const handleApplySmartDefaultsAndApprove = () => {
    const defaultPolicies: Record<string, AdoptionDurationPolicy> = {};
    adoptedChannels.forEach((c) => {
      defaultPolicies[c.channelId] = {
        type: 'SUBSCRIBER_TARGET',
        subscriberTargetCount: 10000,
        durationMonths: 3,
      };
    });
    setChannelDurationPolicies(defaultPolicies);
    setCommunicationPref({
      allowOneWayNotes: true,
      allowExternalContactRequest: false,
    });
    setReciprocalSynergy({
      enableCrossPromotion: true,
      enableHumanitarianVideoLink: true,
    });
    setHumanitarianPledgeAgreed(true);
    if (!humanitarianStatement.trim()) {
      setHumanitarianStatement(
        isAr
          ? 'أعلن دعمي الكامل والتزامي بدعم واستضافة القنوات المتبناة لتعزيز الصوت الإنساني والحرية الإعلامية بكلفة صفرية.'
          : 'I endorse and adopt these humanitarian field channels under zero-cost solidarity.'
      );
    }
    setStepError(null);
    setActiveTab(3);
  };

  // Live video validation using Jasmine Service whitelist
  const videoValidation = parseAndValidateJasmineVideo(videoUrl);

  // Check channel adoption validity
  const areAdoptedChannelsValid =
    adoptedChannels.length >= 2 &&
    adoptedChannels.every(
      (c) =>
        c.channelId &&
        c.channelName &&
        (c.supportTypes.isGodfather ||
          c.supportTypes.isOrientation ||
          c.supportTypes.isMentorship ||
          c.supportTypes.isCoCreation)
    );

  // Helper to update policy per channel
  const handleUpdateDurationPolicy = (channelId: string, policy: AdoptionDurationPolicy) => {
    setChannelDurationPolicies((prev) => ({
      ...prev,
      [channelId]: policy,
    }));
  };

  // Check step readiness
  const isStep1Complete = Boolean(
    celebrityName.trim() && videoUrl.trim() && videoValidation.isValid && areAdoptedChannelsValid
  );
  const isStep2Complete = Boolean(
    humanitarianPledgeAgreed &&
    humanitarianStatement.trim() &&
    adoptedChannels.every((c) => Boolean(channelDurationPolicies[c.channelId]))
  );
  const isStep3Complete = Boolean(isStep1Complete && isStep2Complete);

  // Account readiness
  const isReadyToOpenAccount = isAccountVerified && isStep1Complete && isStep2Complete;

  const stepsInfo = [
    {
      id: 1,
      title: isAr ? 'الخطوة الأولى' : 'Step 1',
      subtitle: isAr ? 'الهوية وتبني القنوات' : 'Identity & Channel Adoption',
      desc: isAr
        ? 'تحديد بيانات المشهور، ورابط الفيديو الداعم، وتخصيص مسارات الدعم لمؤسستين/قناتين إنسانيتين على الأقل (العرّاب، التوجيه، الإرشاد، التمكين الميداني).'
        : 'Specify public figure identity, video link, and allocate support types for at least 2 humanitarian publisher channels.',
      isComplete: isStep1Complete,
    },
    {
      id: 2,
      title: isAr ? 'الخطوة الثانية' : 'Step 2',
      subtitle: isAr ? 'الميثاق، المعاينة ورابط الدعم الأخلاقي' : 'Pledge, Preview & Ethical Link',
      desc: isAr
        ? 'تأكيد الميثاق والبيان الإنساني، مع المعاينة الفورية لمشغل الفيديو المدمج وتوليد رابط الإحالة الأخلاقي الخاص بالمؤثر (Bio Link).'
        : 'Confirm pledge and statement, preview the zero-cost embed video, and generate your ethical Bio Referral Link.',
      isComplete: isStep2Complete,
    },
    {
      id: 3,
      title: isAr ? 'الخطوة الثالثة' : 'Step 3',
      subtitle: isAr ? 'التوجيه أحادي الاتجاه' : 'One-Way Direct Guidance',
      desc: isAr
        ? 'إرسال الملاحظات والجدولة والتوجيهات المباشرة للقنوات المتبناة بكلفة صفرية وبأمان تام دون فتح رسائل خاصة عشوائية (No DM Spam).'
        : 'Send direct one-way guidance notes, schedules, and recommendations to adopted channels with zero spam.',
      isComplete: isStep3Complete,
    },
  ];

  // Channel Adoption Slot Handlers
  const handleUpdateChannelSelection = (index: number, channelId: string) => {
    const selectedObj = AVAILABLE_PUBLISHER_CHANNELS.find((ch) => ch.id === channelId);
    if (!selectedObj) return;

    setAdoptedChannels((prev) => {
      const next = [...prev];
      next[index] = {
        ...next[index],
        channelId: selectedObj.id,
        channelName: selectedObj.name,
      };
      return next;
    });
  };

  const handleToggleSupportType = (
    index: number,
    typeKey: 'isGodfather' | 'isOrientation' | 'isMentorship' | 'isCoCreation'
  ) => {
    setAdoptedChannels((prev) => {
      const next = [...prev];
      const currentTypes = { ...next[index].supportTypes };
      currentTypes[typeKey] = !currentTypes[typeKey];
      next[index] = {
        ...next[index],
        supportTypes: currentTypes,
      };
      return next;
    });
  };

  const handleAddChannelSlot = () => {
    // Find first unused channel or fallback to available
    const usedIds = new Set(adoptedChannels.map((c) => c.channelId));
    const available = AVAILABLE_PUBLISHER_CHANNELS.find((ch) => !usedIds.has(ch.id)) || AVAILABLE_PUBLISHER_CHANNELS[0];

    setAdoptedChannels((prev) => [
      ...prev,
      {
        channelId: available.id,
        channelName: available.name,
        supportTypes: {
          isGodfather: false,
          isOrientation: true,
          isMentorship: false,
          isCoCreation: false,
        },
      },
    ]);
  };

  const handleRemoveChannelSlot = (index: number) => {
    if (adoptedChannels.length <= 2) {
      setStepError(
        isAr
          ? 'دستور قطاع الياسمين يفرض كفالة وتبني قناتين إنسانيتين على الأقل (Mandatory Slot 1 & 2).'
          : 'Jasmine Sector rules mandate adopting at least 2 humanitarian channels.'
      );
      return;
    }
    setAdoptedChannels((prev) => prev.filter((_, i) => i !== index));
  };

  // Final Submission Handler
  const handleFinalSubmit = () => {
    setStepError(null);

    if (!isAccountVerified) {
      setStepError(
        isAr
          ? 'تنبيه حوكمي: يجب أن يكون حسابك موثقاً رسماً (VERIFIED) لتسجيل رابط الياسمين.'
          : 'Governance Alert: Account must be VERIFIED to submit Jasmine links.'
      );
      return;
    }

    if (!celebrityName.trim()) {
      setActiveTab(1);
      setStepError(isAr ? 'يرجى كتابة اسم الشخصية العامة في الخطوة الأولى.' : 'Please enter public figure name in Step 1.');
      return;
    }

    if (!videoUrl.trim() || !videoValidation.isValid) {
      setActiveTab(1);
      setStepError(
        videoValidation.error ||
          (isAr
            ? 'يرجى إدخال رابط فيديو صالح ومعتمد بالقائمة البيضاء في الخطوة الأولى.'
            : 'Please enter a valid whitelisted video URL in Step 1.')
      );
      return;
    }

    if (!areAdoptedChannelsValid) {
      setActiveTab(1);
      setStepError(
        isAr
          ? 'يرجى اختيار قناتين متبناتين على الأقل وتحديد مسار دعم واحد على الأقل لكل قناة في الخطوة الأولى.'
          : 'Please select at least 2 adopted channels and assign at least one support type for each.'
      );
      return;
    }

    if (!humanitarianPledgeAgreed) {
      setActiveTab(2);
      setStepError(
        isAr
          ? 'يرجى الموافقة على الميثاق الإنساني في الخطوة الثانية للتأكيد على طبيعة الدعم غير التجارية.'
          : 'Please agree to the Humanitarian Pledge in Step 2.'
      );
      return;
    }

    if (!humanitarianStatement.trim()) {
      setActiveTab(2);
      setStepError(isAr ? 'يرجى صياغة بيان الدعم الإنساني في الخطوة الثانية.' : 'Please write your endorsement statement in Step 2.');
      return;
    }

    // Final Completion Call
    onComplete({
      celebrityName: celebrityName.trim(),
      titleRole: titleRole.trim() || (isAr ? 'شخصية داعمة' : 'Public Advocate'),
      platform: videoValidation.platform || selectedPlatform,
      videoUrl: videoUrl.trim(),
      humanitarianPledgeAgreed,
      humanitarianStatement: humanitarianStatement.trim(),
      endorsedCampaign: endorsedCampaign.trim(),
      step1: {
        adoptedChannels,
      },
      step2: {
        channelDurationPolicies,
        communicationPref,
        reciprocalSynergy,
        humanitarianPledgeAgreed,
      },
      step3: {
        supportVideoUrl: videoUrl.trim(),
      },
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-5 md:p-7 shadow-2xl text-slate-100 font-sans relative overflow-hidden noor-full-bleed-container noor-smooth-scroll-viewport gpu-accelerated">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Sticky Smart Header with Universal Back Navigation (Result of entering Step 2 or 3) */}
      {activeTab > 1 && (
        <WizardHeader
          currentStep={activeTab}
          onBack={() => {
            setActiveTab((prev) => (prev - 1) as OnboardingStepId);
            setStepError(null);
          }}
          title={stepsInfo[activeTab - 1].subtitle}
          isAr={isAr}
        />
      )}

      {/* Header Overview */}
      <div className="flex items-start justify-between border-b border-slate-800/80 pb-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {isAr
                ? 'قطاع الياسمين — منفذ الاعتماد وتخصيص دعم القنوات (NA-EXEC-2026-JASMINE-03-P55)'
                : 'Jasmine Sector — Per-Channel Adoption Portal'}
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
            <span>{isAr ? 'رحلة اعتماد توثيق المشاهير وتبني القنوات' : 'Celebrity Endorsement & Channel Adoption'}</span>
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {isAr
              ? 'تخصيص مسارات الدعم والتوجيه المباشر لقنوات غزة والمناطق المنكوبة بكلفة صفرية، وفق النموذج المعماري الموحد.'
              : 'Allocate support pathways directly for Gaza and affected area publisher channels with zero platform cost.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {stepsInfo.map((step) => {
          const isSelected = activeTab === step.id;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => {
                setActiveTab(step.id as OnboardingStepId);
                setStepError(null);
              }}
              className={`p-4 rounded-xl border text-right transition-all duration-200 flex flex-col justify-between relative overflow-hidden ${
                isSelected
                  ? 'bg-slate-800/90 border-amber-500 shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/50'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-2">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950'
                      : step.isComplete
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isAr ? `الخطوة ${step.id}` : `Step ${step.id}`}
                </span>
                {step.isComplete && (
                  <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isAr ? 'جاهزة' : 'Ready'}</span>
                  </span>
                )}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">{step.subtitle}</h4>
                <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">{step.title}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Error Alert Box */}
      {stepError && (
        <div className="mb-5 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
          <Info className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{stepError}</span>
        </div>
      )}

      {/* Main Step Content Box */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 md:p-6 min-h-[340px] flex flex-col justify-between backdrop-blur">
        <div>
          {/* Active Step Subheader */}
          <div className="border-b border-slate-800/80 pb-3 mb-5 flex items-center justify-between">
            <h3 className="text-base font-bold text-amber-400 flex items-center gap-2">
              <Zap className="w-4 h-4 fill-current text-amber-400" />
              <span>
                {stepsInfo[activeTab - 1].title}: {stepsInfo[activeTab - 1].subtitle}
              </span>
            </h3>
            <div className="flex items-center gap-2">
              {activeTab >= 2 && (
                <button
                  type="button"
                  onClick={() => setShowAssistantModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition cursor-pointer shadow-sm"
                  title={isAr ? 'مساعد نور الأماني الذكي' : 'AI Assistant Help'}
                >
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'استشارة المساعد الذكي' : 'AI Guide'}</span>
                </button>
              )}
              <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400">
                {isAr ? 'الافتراض الموحد والتخصيص الحر' : 'Unified State Machine'}
              </span>
            </div>
          </div>

          {/* STEP 1: Identity, Video URL, & Per-Channel Support Adoption */}
          {activeTab === 1 && (
            <div className="space-y-6">
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                {stepsInfo[0].desc}
              </p>

              {/* Influencer Identity Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isAr ? 'اسم المشهور / صانع المحتوى *' : 'Public Figure / Creator Name *'}
                  </label>
                  <input
                    type="text"
                    value={celebrityName}
                    onChange={(e) => {
                      setCelebrityName(e.target.value);
                      setStepError(null);
                    }}
                    placeholder={isAr ? 'مثال: أ. أحمد الشقيري' : 'e.g. Ahmad Al Shugairi'}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isAr ? 'المسمى أو الصفة الداعمة' : 'Role / Title'}
                  </label>
                  <input
                    type="text"
                    value={titleRole}
                    onChange={(e) => setTitleRole(e.target.value)}
                    placeholder={isAr ? 'مثال: إعلامي وداعم إنساني' : 'e.g. Media Personality & Humanitarian Advocate'}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Video URL Input */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  {isAr ? 'رابط الفيديو الداعم (YouTube, TikTok, Instagram, Facebook, X, Vimeo) *' : 'Support Video Link *'}
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => {
                      setVideoUrl(e.target.value);
                      setStepError(null);
                    }}
                    placeholder="https://www.youtube.com/watch?v=... / https://vt.tiktok.com/..."
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 pl-10 font-mono"
                  />
                  <Video className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                </div>

                {videoUrl && (
                  <div className="mt-2 text-[11px] flex items-center gap-2">
                    {videoValidation.isValid ? (
                      <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>
                          {isAr ? 'رابط آمن ومعتمد:' : 'Valid & Whitelisted Link:'} {videoValidation.platform}
                        </span>
                      </span>
                    ) : (
                      <span className="text-rose-400 flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" />
                        <span>{videoValidation.error}</span>
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* PER-CHANNEL SUPPORT ASSIGNMENT SECTION (NA-EXEC-2026-JASMINE-03-P55) */}
              <div className="pt-4 border-t border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                      <Crown className="w-4 h-4 text-amber-400" />
                      <span>{isAr ? 'تخصيص مسارات الدعم لكل قناة متبناة (قناتين على الأقل)' : 'Per-Channel Support Assignment'}</span>
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      {isAr
                        ? 'حدد القنوات المستهدفة من قطاع الناشرين ثم اختر أدوار الدعم المطلوبة (العرّاب، التوجيه، الإرشاد، التمكين الميداني).'
                        : 'Select publisher channels and assign specific support roles for each.'}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddChannelSlot}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'إضافة قناة ثالثة' : 'Add Channel'}</span>
                  </button>
                </div>

                {/* Slots List */}
                <div className="space-y-4">
                  {adoptedChannels.map((slot, index) => {
                    const isMandatory = index < 2;

                    return (
                      <div
                        key={index}
                        className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 space-y-3 relative transition"
                      >
                        {/* Slot Header */}
                        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                isMandatory
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                              }`}
                            >
                              {isMandatory
                                ? isAr
                                  ? `القناة المتبناة ${index + 1} (إجباري)`
                                  : `Mandatory Slot ${index + 1}`
                                : isAr
                                ? `قناة إضافية ${index + 1}`
                                : `Extra Slot ${index + 1}`}
                            </span>
                            <span className="text-xs font-semibold text-slate-200">{slot.channelName}</span>
                          </div>

                          {!isMandatory && (
                            <button
                              type="button"
                              onClick={() => handleRemoveChannelSlot(index)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded transition"
                              title={isAr ? 'إزالة القناة' : 'Remove Channel'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>

                        {/* Select Publisher Channel Dropdown */}
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1">
                            {isAr ? 'اختر القناة من قطاع الناشرين الميدانيين:' : 'Select Publisher Channel:'}
                          </label>
                          <select
                            value={slot.channelId}
                            onChange={(e) => handleUpdateChannelSelection(index, e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                          >
                            {AVAILABLE_PUBLISHER_CHANNELS.map((ch) => (
                              <option key={ch.id} value={ch.id}>
                                {ch.name} — ({ch.location} | {ch.category})
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Support Type Toggles */}
                        <div>
                          <label className="block text-[11px] text-slate-400 mb-1.5 font-medium">
                            {isAr ? 'حدد مسارات الدعم المطلوبة لهذه القناة:' : 'Select Support Types:'}
                          </label>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {/* Godfather Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleSupportType(index, 'isGodfather')}
                              className={`p-2.5 rounded-lg border text-right transition flex flex-col justify-between ${
                                slot.supportTypes.isGodfather
                                  ? 'bg-amber-500/15 border-amber-500/60 text-amber-200'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <Crown className="w-3.5 h-3.5 text-amber-400" />
                                {slot.supportTypes.isGodfather && <Check className="w-3 h-3 text-amber-400" />}
                              </div>
                              <span className="text-[11px] font-bold block">{isAr ? 'العرّاب' : 'Godfather'}</span>
                              <span className="text-[9px] text-slate-400 opacity-80 mt-0.5 line-clamp-1">
                                {isAr ? 'كفالة ومعدات' : 'Sponsorship'}
                              </span>
                            </button>

                            {/* Orientation Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleSupportType(index, 'isOrientation')}
                              className={`p-2.5 rounded-lg border text-right transition flex flex-col justify-between ${
                                slot.supportTypes.isOrientation
                                  ? 'bg-blue-500/15 border-blue-500/60 text-blue-200'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <Share2 className="w-3.5 h-3.5 text-blue-400" />
                                {slot.supportTypes.isOrientation && <Check className="w-3 h-3 text-blue-400" />}
                              </div>
                              <span className="text-[11px] font-bold block">{isAr ? 'التوجيه' : 'Orientation'}</span>
                              <span className="text-[9px] text-slate-400 opacity-80 mt-0.5 line-clamp-1">
                                {isAr ? 'تحويل المتابعين' : 'Audience Boost'}
                              </span>
                            </button>

                            {/* Mentorship Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleSupportType(index, 'isMentorship')}
                              className={`p-2.5 rounded-lg border text-right transition flex flex-col justify-between ${
                                slot.supportTypes.isMentorship
                                  ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-200'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />
                                {slot.supportTypes.isMentorship && <Check className="w-3 h-3 text-emerald-400" />}
                              </div>
                              <span className="text-[11px] font-bold block">{isAr ? 'الإرشاد' : 'Mentorship'}</span>
                              <span className="text-[9px] text-slate-400 opacity-80 mt-0.5 line-clamp-1">
                                {isAr ? 'تقييم فني' : 'Technical Guidance'}
                              </span>
                            </button>

                            {/* CoCreation Toggle */}
                            <button
                              type="button"
                              onClick={() => handleToggleSupportType(index, 'isCoCreation')}
                              className={`p-2.5 rounded-lg border text-right transition flex flex-col justify-between ${
                                slot.supportTypes.isCoCreation
                                  ? 'bg-purple-500/15 border-purple-500/60 text-purple-200'
                                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <div className="flex items-center justify-between w-full mb-1">
                                <Users className="w-3.5 h-3.5 text-purple-400" />
                                {slot.supportTypes.isCoCreation && <Check className="w-3 h-3 text-purple-400" />}
                              </div>
                              <span className="text-[11px] font-bold block">{isAr ? 'التمكين الميداني' : 'Co-Creation'}</span>
                              <span className="text-[9px] text-slate-400 opacity-80 mt-0.5 line-clamp-1">
                                {isAr ? 'إنتاج مشترك' : 'Joint Production'}
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Dynamic Explainer for support types */}
                        <DynamicExplainer
                          channelName={slot.channelName}
                          supportTypes={slot.supportTypes}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* DYNAMIC ON-SCREEN EXPLAINER COMPONENT */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs space-y-2.5 backdrop-blur shadow-inner">
                  <div className="flex items-center justify-between text-amber-300 font-bold border-b border-slate-800 pb-2">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>{isAr ? 'مُفسّر الأدوار المعتمدة (Dynamic Explainer)' : 'Dynamic Support Explainer'}</span>
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      {isAr ? 'سياسة الكلفة الصفرية' : 'Zero-Cost Policy'}
                    </span>
                  </div>

                  <div className="space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                    <p>
                      {isAr
                        ? `لقد قمت بتخصيص مسارات الدعم لـ (${adoptedChannels.length}) قنوات إنسانية. منصة نور الأماني تلتزم بالكلفة الصفرية الشاملة؛ حيث لا تتداول أي أموال أو عمولات وساطة.`
                        : `You have customized support pathways for (${adoptedChannels.length}) channels. Noor Al-Amani platform charges zero fees.`}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                      {adoptedChannels.map((ch, idx) => (
                        <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
                          <span className="font-bold text-amber-300 block mb-1">
                            • {ch.channelName}:
                          </span>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-400 text-[10px]">
                            {ch.supportTypes.isGodfather && (
                              <li className="text-amber-200">
                                {isAr ? 'العرّاب: التكفل التضامني بالمعدات والكفالة التشغيلية' : 'Godfather: Sponsorship'}
                              </li>
                            )}
                            {ch.supportTypes.isOrientation && (
                              <li className="text-blue-200">
                                {isAr ? 'التوجيه: توجيه الجمهور عبر منصاتك الرسمية لزيارة القناة' : 'Orientation: Redirect Followers'}
                              </li>
                            )}
                            {ch.supportTypes.isMentorship && (
                              <li className="text-emerald-200">
                                {isAr ? 'الإرشاد: تقديم التوجيهات والملاحظات الفنية المحترفة' : 'Mentorship: Technical Feedback'}
                              </li>
                            )}
                            {ch.supportTypes.isCoCreation && (
                              <li className="text-purple-200">
                                {isAr ? 'التمكين الميداني: المشاركة والإنتاج الميداني التوثيقي المشترك' : 'Co-Creation: Joint Field Production'}
                              </li>
                            )}
                            {!Object.values(ch.supportTypes).some(Boolean) && (
                              <li className="text-rose-400">
                                {isAr ? 'لم يتم تحديد مسار دعم بعد (يرجى التحديد)' : 'No support type selected yet'}
                              </li>
                            )}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Adoption Duration, Communication Preferences & Pledge */}
          {activeTab === 2 && (
            <div className="space-y-6">
              <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800 space-y-1">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span>
                    {isAr
                      ? 'الخطوة الثانية: تأكيد مسار التبني والتواصل (تلقائي وسريع)'
                      : 'Step 2: Fast-Track Adoption & Communication Approval'}
                  </span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {isAr
                    ? 'اعتماد كافة الإعدادات والمدد ونظام التواصل ودِرع الخصوصية بضغطة واحدة، أو تخصيصها يدويًا للمحترفين.'
                    : 'Approve all default duration criteria and privacy rules with 1-click, or customize manually.'}
                </p>
              </div>

              {/* SMART DEFAULTS PRESET CARD (1-CLICK FAST TRACK APPROVAL) */}
              <div className="bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 p-5 rounded-2xl border-2 border-amber-500/40 space-y-4 shadow-xl">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/50 text-[11px] font-bold">
                        {isAr ? '✨ الإعداد الذكي الافتراضي (التمكين المتوازن)' : '✨ Smart Preset (Balanced Adoption)'}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-bold">
                        {isAr ? 'اعتماد بـ 5 ثوانٍ' : '5-Sec Approval'}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-amber-200">
                      {isAr ? 'اعتماد فوري بضغطة واحدة (1-Click Smart Approval)' : '1-Click Instant Smart Approval'}
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {isAr
                        ? 'تسهيلاً لوقتك، تم ضبط كافة معايير التبني ونظام التواصل ودِرع الخصوصية تلقائياً نيابة عنك بأعلى معايير الأمان والفاعلية:'
                        : 'To respect your time, all adoption parameters and privacy shield rules are auto-configured with maximum safety:'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-slate-950/90 p-3.5 rounded-xl border border-slate-800">
                  <div className="flex items-start gap-2.5">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200 block">{isAr ? 'مدة وسقف التبني:' : 'Adoption Goal:'}</span>
                      <span className="text-slate-400 text-[11px]">
                        {isAr ? '3 أشهر أو الوصول لـ 10,000 مشترك (أيهما أقرب)' : '3 months or 10k sub target'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Lock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200 block">{isAr ? 'دِرع الخصوصية (Privacy Shield):' : 'Privacy Shield:'}</span>
                      <span className="text-slate-400 text-[11px]">
                        {isAr ? 'مُفعّل (ملاحظات أحادية الاتجاه دون شات خاص)' : 'Active (One-way notes only)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-200 block">{isAr ? 'الميثاق الأخلاقي:' : 'Ethical Pledge:'}</span>
                      <span className="text-slate-400 text-[11px]">
                        {isAr ? 'التزام بكلفة صفرية وبث مدمج' : '100% Zero-Cost co-broadcast'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={handleApplySmartDefaultsAndApprove}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>{isAr ? '✓ موافقة واعتماد فوري بضغطة واحدة (1-Click Approval)' : '✓ 1-Click Instant Approval'}</span>
                    </button>

                    {onOpenGuidance && (
                      <button
                        type="button"
                        onClick={onOpenGuidance}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-purple-950/90 hover:bg-purple-900 text-purple-200 font-bold text-xs border border-purple-500/50 shadow-lg transition active:scale-95 cursor-pointer"
                        title={isAr ? 'نظام الملاحظات والإرشادات الموجهة من طرف واحد' : 'One-Way Direct Guidance System'}
                      >
                        <MessageSquare className="w-4 h-4 text-purple-400 shrink-0" />
                        <span>{isAr ? 'التوجيه أحادي الاتجاه' : 'Direct Guidance'}</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowManualSettings(!showManualSettings)}
                    className="text-xs text-slate-400 hover:text-amber-300 underline flex items-center gap-1.5 transition py-1 cursor-pointer"
                  >
                    <Settings className="w-3.5 h-3.5" />
                    <span>
                      {showManualSettings
                        ? (isAr ? 'إخفاء التخصيص اليدوي' : 'Hide Manual Customization')
                        : (isAr ? '⚙️ تعديل الإعدادات والمدد يدويًا (للمحترفين - اختياري)' : '⚙️ Customize settings manually (Optional)')}
                    </span>
                  </button>
                </div>
              </div>

              {/* MANUAL CUSTOMIZATION EXPANDABLE SECTION */}
              {showManualSettings && (
                <div className="space-y-6 pt-2 border-t border-slate-800/80">
                  {/* SUB-SECTION 1: ADOPTION DURATION POLICIES PER CHANNEL */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-amber-400" />
                          <span>{isAr ? '1. حدد شرط وسقف مدة التبني لكل قناة متبناة' : '1. Select Adoption Duration Criteria per Channel'}</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isAr
                            ? 'اختر معيار انتهاء كفالة التبني لكل قناة لمساعدتها على تأهيل نفسها وتحقيق شرط الاستقلالية.'
                            : 'Choose the duration criterion to help each channel achieve independence.'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {adoptedChannels.map((channelSlot, idx) => {
                        const currentPolicy = channelDurationPolicies[channelSlot.channelId] || {
                          type: 'SUBSCRIBER_TARGET',
                          subscriberTargetCount: 10000,
                        };

                        return (
                          <div key={channelSlot.channelId + idx} className="bg-slate-900 p-3.5 rounded-xl border border-slate-800/90 space-y-3">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                              <span className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] flex items-center justify-center font-mono">
                                  {idx + 1}
                                </span>
                                <span>{channelSlot.channelName}</span>
                              </span>
                              <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 font-medium">
                                {currentPolicy.type === 'SUBSCRIBER_TARGET' && (isAr ? 'سقف جماهيري (المشتركين)' : 'Subscriber Goal')}
                                {currentPolicy.type === 'TIME_BOUND' && (isAr ? 'مدة زمنية محددة' : 'Time-Bound')}
                                {currentPolicy.type === 'MILESTONE_BASED' && (isAr ? 'تبني إنجازي / ميداني' : 'Milestone')}
                                {currentPolicy.type === 'PERMANENT' && (isAr ? 'تبني أَبَدي مستمر' : 'Permanent')}
                              </span>
                            </div>

                            {/* Policy Type Selection Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                              {/* Type 1: Subscriber Goal */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateDurationPolicy(channelSlot.channelId, {
                                    type: 'SUBSCRIBER_TARGET',
                                    subscriberTargetCount: currentPolicy.subscriberTargetCount || 10000,
                                  })
                                }
                                className={`p-3 rounded-xl border text-right transition flex flex-col justify-between ${
                                  currentPolicy.type === 'SUBSCRIBER_TARGET'
                                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 shadow-md'
                                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <Users className="w-4 h-4 text-amber-400 mb-1" />
                                <span className="font-bold block text-[11px]">{isAr ? 'سقف المشتركين' : 'Subscriber Goal'}</span>
                                <span className="text-[10px] opacity-75 mt-0.5">{isAr ? 'وصول لـ 10,000 / 15,000 مشترك' : 'Target sub count'}</span>
                              </button>

                              {/* Type 2: Time Bound */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateDurationPolicy(channelSlot.channelId, {
                                    type: 'TIME_BOUND',
                                    durationMonths: currentPolicy.durationMonths || 1.5,
                                  })
                                }
                                className={`p-3 rounded-xl border text-right transition flex flex-col justify-between ${
                                  currentPolicy.type === 'TIME_BOUND'
                                    ? 'bg-blue-500/20 border-blue-500 text-blue-200 shadow-md'
                                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <Calendar className="w-4 h-4 text-blue-400 mb-1" />
                                <span className="font-bold block text-[11px]">{isAr ? 'مدة زمنية' : 'Time-Bound'}</span>
                                <span className="text-[10px] opacity-75 mt-0.5">{isAr ? 'شهر / شهر ونصف / سنة' : '1 to 12 months'}</span>
                              </button>

                              {/* Type 3: Milestone Based */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateDurationPolicy(channelSlot.channelId, {
                                    type: 'MILESTONE_BASED',
                                    milestoneDescription: currentPolicy.milestoneDescription || (isAr ? 'توفير جهاز بث كامل أو 5 بثوث مشتركة' : 'Provide streaming gear or 5 co-streams'),
                                  })
                                }
                                className={`p-3 rounded-xl border text-right transition flex flex-col justify-between ${
                                  currentPolicy.type === 'MILESTONE_BASED'
                                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-md'
                                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <Award className="w-4 h-4 text-emerald-400 mb-1" />
                                <span className="font-bold block text-[11px]">{isAr ? 'تبني إنجازي' : 'Milestone-Based'}</span>
                                <span className="text-[10px] opacity-75 mt-0.5">{isAr ? 'كفالة معدات / 5 بثوث' : 'Gear or 5 broadcasts'}</span>
                              </button>

                              {/* Type 4: Permanent / Lifetime */}
                              <button
                                type="button"
                                onClick={() =>
                                  handleUpdateDurationPolicy(channelSlot.channelId, {
                                    type: 'PERMANENT',
                                  })
                                }
                                className={`p-3 rounded-xl border text-right transition flex flex-col justify-between ${
                                  currentPolicy.type === 'PERMANENT'
                                    ? 'bg-purple-500/20 border-purple-500 text-purple-200 shadow-md'
                                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                                }`}
                              >
                                <ShieldCheck className="w-4 h-4 text-purple-400 mb-1" />
                                <span className="font-bold block text-[11px]">{isAr ? 'تبني أَبَدي' : 'Permanent'}</span>
                                <span className="text-[10px] opacity-75 mt-0.5">{isAr ? 'رعاية مستمرة لقنوات غزة' : 'Lifetime Gaza sponsorship'}</span>
                              </button>
                            </div>

                            {/* Extra Controls per Selected Policy Type */}
                            {currentPolicy.type === 'SUBSCRIBER_TARGET' && (
                              <div className="pt-2 flex flex-wrap items-center gap-2">
                                <label className="text-[11px] text-slate-300 font-medium">
                                  {isAr ? 'الحد الجماهيري المستهدف لإكمال التبني:' : 'Target Subscribers Goal:'}
                                </label>
                                <select
                                  value={currentPolicy.subscriberTargetCount || 10000}
                                  onChange={(e) =>
                                    handleUpdateDurationPolicy(channelSlot.channelId, {
                                      ...currentPolicy,
                                      subscriberTargetCount: Number(e.target.value),
                                    })
                                  }
                                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500"
                                >
                                  <option value={5000}>{isAr ? '5,000 مشترك' : '5,000 Subscribers'}</option>
                                  <option value={10000}>{isAr ? '10,000 مشترك (سقف تمكين المونيتيز المعياري)' : '10,000 Subscribers (Monetization Goal)'}</option>
                                  <option value={15000}>{isAr ? '15,000 مشترك (التمكين المتقدم)' : '15,000 Subscribers (Advanced)'}</option>
                                  <option value={25000}>{isAr ? '25,000 مشترك' : '25,000 Subscribers'}</option>
                                </select>
                              </div>
                            )}

                            {currentPolicy.type === 'TIME_BOUND' && (
                              <div className="pt-2 flex flex-wrap items-center gap-2">
                                <label className="text-[11px] text-slate-300 font-medium">
                                  {isAr ? 'المدة الزمنية المحددة للتبني:' : 'Time-bound Duration:'}
                                </label>
                                <select
                                  value={currentPolicy.durationMonths || 1.5}
                                  onChange={(e) =>
                                    handleUpdateDurationPolicy(channelSlot.channelId, {
                                      ...currentPolicy,
                                      durationMonths: Number(e.target.value),
                                    })
                                  }
                                  className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-blue-300 font-bold focus:outline-none focus:border-blue-500"
                                >
                                  <option value={1}>{isAr ? 'شهر واحد (1 Month)' : '1 Month'}</option>
                                  <option value={1.5}>{isAr ? 'شهر ونصف (1.5 Months - المعياري)' : '1.5 Months (Standard)'}</option>
                                  <option value={3}>{isAr ? '3 أشهر (3 Months)' : '3 Months'}</option>
                                  <option value={6}>{isAr ? '6 أشهر (6 Months)' : '6 Months'}</option>
                                  <option value={12}>{isAr ? 'سنة كاملة (1 Year)' : '1 Year'}</option>
                                </select>
                              </div>
                            )}

                            {currentPolicy.type === 'MILESTONE_BASED' && (
                              <div className="pt-2">
                                <label className="block text-[11px] text-slate-300 mb-1 font-medium">
                                  {isAr ? 'وصف المهمة / الإنجاز المطلوب لإكمال التبني:' : 'Milestone Task Description:'}
                                </label>
                                <input
                                  type="text"
                                  value={currentPolicy.milestoneDescription || ''}
                                  onChange={(e) =>
                                    handleUpdateDurationPolicy(channelSlot.channelId, {
                                      ...currentPolicy,
                                      milestoneDescription: e.target.value,
                                    })
                                  }
                                  placeholder={isAr ? 'مثال: توفير معدات بث كاملة أو إتمام 5 بثوث مشتركة' : 'e.g. Provide streaming gear or complete 5 co-streams'}
                                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500"
                                />
                              </div>
                            )}

                            {currentPolicy.type === 'PERMANENT' && (
                              <div className="pt-1 text-[11px] text-purple-300 bg-purple-500/10 p-2 rounded-lg border border-purple-500/20 font-medium">
                                {isAr
                                  ? '💡 التبني المستمر: رعاية ودعم مفتوح دون سقف زمني لحماية التغطية الميدانية في أوقات الأزمات.'
                                  : '💡 Lifetime sponsorship without time expiration.'}
                              </div>
                            )}

                            {/* Dynamic Explainer for duration policy */}
                            <DynamicExplainer
                              channelName={channelSlot.channelName}
                              durationPolicy={currentPolicy}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* SUB-SECTION 2: HYBRID ONE-WAY COMMUNICATION & PRIVACY SHIELD SETTINGS */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-amber-400" />
                          <span>{isAr ? '2. آلية التواصل المعتمدة ودرع الخصوصية (Celebrity Privacy Shield)' : '2. Communication & Celebrity Privacy Shield'}</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isAr
                            ? 'ضمان حماية وقتك من الرسائل الخاصة العشوائية، مع إمكانية توجيه الملاحظات الرسمية للقنوات المتبناة.'
                            : 'Zero spam guarantee with direct official notification routing.'}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        {isAr ? 'تواصل آمن 100%' : '100% Safe'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {/* Toggle 1: One-Way Notes (Mandatory) */}
                      <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                        <div className="flex items-center gap-2.5">
                          <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">
                              {isAr ? 'إرسال ملاحظات وتوجيهات أحادية الاتجاه (نظام الإشعارات المباشرة)' : 'Send One-Way Direct Guidance Notes (System Notifications)'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {isAr
                                ? 'رسائلك وتوجيهاتك تصل مباشرة للناشر كإشعار لوحة تحكم رسمية، دون فتح شات خاص DMs'
                                : 'Your notes reach the publisher directly as official panel notifications without opening DMs'}
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={communicationPref.allowOneWayNotes}
                          onChange={(e) =>
                            setCommunicationPref((prev) => ({
                              ...prev,
                              allowOneWayNotes: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-950 w-4 h-4"
                        />
                      </label>

                      {/* Toggle 2: External Contact Request (Optional) */}
                      <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                        <div className="flex items-center gap-2.5">
                          <LinkIcon className="w-4 h-4 text-purple-400 shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">
                              {isAr ? 'السماح للناشر بطلب تواصل خارجي مباشر (اختياري)' : 'Allow Publisher External Contact Request (Optional)'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {isAr
                                ? 'إتاحة خيار إظهار رابط تواصل خارجي (تليجرام / واتساب / بريد) للناشر المتبنى بمحض إرادتك'
                                : 'Allow the adopted publisher to request an external Telegram/WhatsApp/Email contact link'}
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={communicationPref.allowExternalContactRequest}
                          onChange={(e) =>
                            setCommunicationPref((prev) => ({
                              ...prev,
                              allowExternalContactRequest: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-700 text-purple-500 focus:ring-purple-500 bg-slate-950 w-4 h-4"
                        />
                      </label>
                    </div>

                    {/* Privacy Shield Explainer Box */}
                    <div className="p-3 bg-slate-900/90 rounded-xl border border-amber-500/20 text-[11px] text-amber-200/90 space-y-1">
                      <span className="font-bold flex items-center gap-1.5 text-amber-300">
                        <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isAr ? 'شرح درع الخصوصية (Celebrity Privacy Shield):' : 'Celebrity Privacy Shield Explanation:'}</span>
                      </span>
                      <p className="leading-relaxed text-slate-300 text-[10px]">
                        {isAr
                          ? 'رسائلك وتوصياتك تصل للناشر الميداني كإشعارات توجيهية رسمية، ولن يستطيع الناشر مراسلتك على بريدك أو حساباتك الشخصية إلا إذا قمت بطلب رابط تواصل خارجي بملء إرادتك.'
                          : 'Your notes arrive as panel notifications. Publishers cannot spam your private inbox or social media accounts unless explicitly requested by you.'}
                      </p>
                    </div>
                  </div>

                  {/* SUB-SECTION 3: RECIPROCAL SYNERGY & CROSS PROMOTION (NA-EXEC-2026-JASMINE-07-RECIPROCAL-P55) */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-2">
                          <Share2 className="w-4 h-4 text-emerald-400" />
                          <span>
                            {isAr
                              ? '3. دائرة المنفعة المتبادلة والترويج التضامني (Reciprocal Synergy)'
                              : '3. Reciprocal Synergy & Cross-Promotion Cycle'}
                          </span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isAr
                            ? 'إلزام خوارزميات النظام للناشر المتبنى بإدراج رابط قناتك ورابط موقفك الإنساني في وصف فيديوهاته لربط النمو بالوفاء.'
                            : 'Mandate adopted publishers to embed your official channel and endorsement links in their video descriptions.'}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        {isAr ? 'نمو متبادل 100%' : 'Reciprocal Synergy'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {/* Toggle 1: Cross-Promotion Link */}
                      <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                        <div className="flex items-center gap-2.5">
                          <Globe className="w-4 h-4 text-emerald-400 shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">
                              {isAr
                                ? 'تفعيل نشر رابط قناتك الرسمية لدى الناشر المكفول (موصى به - مفعّل تلقائياً)'
                                : 'Enable Cross-Promotion Channel Link on Publisher Content (Recommended)'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {isAr
                                ? 'يلزم النظام الناشر بوضع رابط قناتك الرسمية في صندوق وصف فيديوهاته لتحويل جمهوره الجديد لقناتك'
                                : 'Mandates publisher to place your official channel link in video descriptions to convert audience.'}
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={reciprocalSynergy.enableCrossPromotion}
                          onChange={(e) =>
                            setReciprocalSynergy((prev) => ({
                              ...prev,
                              enableCrossPromotion: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 bg-slate-950 w-4 h-4"
                        />
                      </label>

                      {/* Toggle 2: Humanitarian Video Link */}
                      <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-slate-700 transition">
                        <div className="flex items-center gap-2.5">
                          <Video className="w-4 h-4 text-amber-400 shrink-0" />
                          <div>
                            <span className="text-xs font-bold text-slate-200 block">
                              {isAr
                                ? 'تفعيل نشر رابط موقفك الإنساني (فيديو الدعم) لدى الناشر (موصى به)'
                                : 'Enable Humanitarian Endorsement Video Link on Publisher Content'}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {isAr
                                ? 'يتضمن صندوق وصف فيديوهات الناشر رابط فيديو كلمتك الإنسانية لإشهار موقفك الأخلاقي أمام متابعيه'
                                : 'Include link to your endorsement video statement in publisher video description.'}
                            </span>
                          </div>
                        </div>
                        <input
                          type="checkbox"
                          checked={reciprocalSynergy.enableHumanitarianVideoLink}
                          onChange={(e) =>
                            setReciprocalSynergy((prev) => ({
                              ...prev,
                              enableHumanitarianVideoLink: e.target.checked,
                            }))
                          }
                          className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-950 w-4 h-4"
                        />
                      </label>
                    </div>

                    {/* Synergy Explainer Box */}
                    <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-200/90 space-y-1">
                      <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isAr ? 'رؤية دائرة التكافل والتأثير المزدوج:' : 'Dual Impact & Synergy Vision:'}</span>
                      </span>
                      <p className="leading-relaxed text-emerald-200/80 text-[10px]">
                        {isAr
                          ? 'مع صعود ونمو القنوات المتبناة وتضاعف مشاهداتها، سيتدفق المتابعون تلقائياً نحو قناتك الرسمية، لتتحول كفالتك الإنسانية إلى نمو حقيقي وقيم مستدامة لقناتك ورصيدك المعنوي.'
                          : 'As the adopted channel grows, their viewers flow back to your official channel, creating a sustainable cycle of growth and moral goodwill.'}
                      </p>
                    </div>
                  </div>

                  {/* SUB-SECTION 4: ENDORSED CAMPAIGN, STATEMENT & ETHICS PLEDGE */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                    <div>
                      <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span>{isAr ? '4. الميثاق الأخلاقي والتعهد الإنساني' : '4. Ethical Pledge & Humanitarian Statement'}</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {isAr
                          ? 'تأكيد التزامك بروح التكافل الإنساني وبأحكام دستور قطاع الياسمين الخالي من الغايات التجارية.'
                          : 'Confirm your ethical commitment under zero-cost non-commercial rules.'}
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {isAr ? 'المبادرة الإنسانية المدعومة' : 'Endorsed Campaign'}
                      </label>
                      <input
                        type="text"
                        value={endorsedCampaign}
                        onChange={(e) => setEndorsedCampaign(e.target.value)}
                        placeholder={isAr ? 'اسم الحملة أو المبادرة' : 'Campaign Name'}
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        {isAr ? 'بيان الدعم الإنساني العلني *' : 'Humanitarian Endorsement Statement *'}
                      </label>
                      <textarea
                        value={humanitarianStatement}
                        onChange={(e) => {
                          setHumanitarianStatement(e.target.value);
                          setStepError(null);
                        }}
                        rows={3}
                        placeholder={
                          isAr
                            ? 'مثال: أعلن دعمي الكامل للمبادرين الإنسانيين والقنوات الميدانية المتبناة في غزة لتعزيز صمود التغطية التوثيقية...'
                            : 'Write your endorsement statement for the humanitarian campaign...'
                        }
                        className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-amber-500 resize-none"
                      />
                    </div>

                    {/* Ethics Pledge Checkbox */}
                    <label className="flex items-start gap-2.5 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={humanitarianPledgeAgreed}
                        onChange={(e) => {
                          setHumanitarianPledgeAgreed(e.target.checked);
                          setStepError(null);
                        }}
                        className="mt-0.5 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900 w-4 h-4 shrink-0"
                      />
                      <span className="text-xs text-amber-200 font-medium leading-relaxed">
                        {isAr
                          ? 'أتعهد بالالتزام بدستور قطاع الياسمين (مبادرة إنسانية غير تجارية، بدون أي إعلانات أو مقابل مالي، مع الاعتماد التام على البث المدمج بكلفة صفرية والالتزام الأخلاقي الكامل بمساعدة القنوات المتبناة).'
                          : 'I pledge commitment to Jasmine Sector ethics (non-commercial, non-promotional, zero-bandwidth cost, and ethical adoption of channels).'}
                      </span>
                    </label>
                  </div>

                  {/* SUB-SECTION 5: EMBED VIDEO PREVIEW & ETHICAL BIO REFERRAL LINK GENERATION */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                      <div>
                        <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                          <Video className="w-4 h-4 text-amber-400" />
                          <span>{isAr ? '5. معاينة البث المدمج وتوليد رابط الدعم الأخلاقي (Bio Link)' : '5. Embed Player Preview & Ethical Bio Link'}</span>
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          {isAr
                            ? 'المعاينة الفورية لكلمتك الإنسانية المدمجة وتوليد رابط الإحالة التوثيقي الخاص بموقفك الأخلاقي.'
                            : 'Instant embed video statement preview and Bio Referral Link generation.'}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                        {isAr ? 'توليد تلقائي' : 'Auto Generated'}
                      </span>
                    </div>

                    {/* Preview Card */}
                    <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <span className="font-bold text-amber-400">
                          {celebrityName || (isAr ? 'اسم الشخصية العامة' : 'Public Figure')}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-400">
                          {videoValidation.platform || selectedPlatform}
                        </span>
                      </div>

                      <div className="aspect-video bg-black rounded-lg overflow-hidden border border-slate-800 relative">
                        {videoValidation.isValid && videoValidation.embedUrl ? (
                          <iframe
                            src={videoValidation.embedUrl}
                            title="Preview"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-2 p-4 text-center">
                            <Video className="w-8 h-8 opacity-40" />
                            <span>
                              {isAr
                                ? 'أدخل رابط فيديو صالح في الخطوة الأولى لمعاينة البث المدمج بكلفة صفرية'
                                : 'Enter valid video URL in Step 1 to preview embed player'}
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-slate-300 italic bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                        "{humanitarianStatement || (isAr ? 'بيان الدعم الإنساني يظهر هنا...' : 'Endorsement statement appears here...')}"
                      </p>

                      {/* Summary of Adopted Channels */}
                      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1">
                        <span className="text-amber-400 font-bold block mb-1">
                          {isAr ? 'القنوات المتبناة في هذا التوثيق:' : 'Adopted Channels in this Endorsement:'}
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {adoptedChannels.map((c, i) => (
                            <span key={i} className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-700 text-slate-200 text-[11px]">
                              {c.channelName}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bio Referral Link Box */}
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] text-emerald-400 font-semibold block">
                          {isAr ? 'رابط الدعم والإحالة الأخلاقي المباشر (Bio Referral Link)' : 'Direct Ethical Bio Referral Link'}
                        </span>
                        <span className="text-xs font-mono text-slate-200">
                          https://noor-al-amani.org/ref/jas-{celebrityName ? encodeURIComponent(celebrityName.slice(0, 8)) : 'preview'}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `https://noor-al-amani.org/ref/jas-${celebrityName ? encodeURIComponent(celebrityName.slice(0, 8)) : 'preview'}`
                          );
                          setLinkCopiedFeedback(true);
                          setTimeout(() => setLinkCopiedFeedback(false), 2500);
                        }}
                        className="px-3.5 py-2 rounded-lg bg-emerald-500 text-slate-950 text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-400 transition cursor-pointer shrink-0"
                      >
                        {linkCopiedFeedback ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{linkCopiedFeedback ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy Link')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: One-Way Direct Guidance System */}
          {activeTab === 3 && (
            <div className="space-y-6">
              <div className="bg-purple-950/40 border border-purple-500/30 p-4 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-purple-400 shrink-0" />
                    <h3 className="text-sm font-bold text-purple-200">
                      {isAr
                        ? 'الخطوة الثالثة: نظام التوجيه أحادي الاتجاه والإرشادات المباشرة'
                        : 'Step 3: One-Way Direct Guidance System'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold">
                    {isAr ? 'درع الخصوصية مفعّل' : 'Privacy Shield Active'}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {isAr
                    ? 'يمكنك هنا توجيه ملاحظات وإرشادات حصرية أو جداول نشر مباشرة للقنوات المتبناة. تصل رسائلك كإشعارات رسمية في لوحة تحكم الناشر الميداني دون فتح محادثات خاصة (No DMs).'
                    : 'Send direct guidance notes and schedules to adopted publisher channels. Notes land as official dashboard notifications with zero DM spam.'}
                </p>
              </div>

              {/* Guidance Note Sending Form */}
              <form onSubmit={handleSendGuidanceNote} className="bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-amber-300 flex items-center gap-2">
                    <Send className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'صياغة وإرسال توجيه جديد للقنوات المتبناة' : 'Draft & Send New Guidance Note'}</span>
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    {isAr ? 'إشعار مباشر أحادي الاتجاه' : 'Direct One-Way Note'}
                  </span>
                </div>

                {noteSuccessMsg && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{noteSuccessMsg}</span>
                  </div>
                )}

                {noteFormError && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                    <Info className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{noteFormError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Target Channel */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {isAr ? 'القناة المتبناة المستهدفة *' : 'Target Adopted Channel *'}
                    </label>
                    <select
                      value={noteTargetChannelId || adoptedChannels[0]?.channelId || ''}
                      onChange={(e) => setNoteTargetChannelId(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-amber-300 font-bold focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      {adoptedChannels.map((c) => (
                        <option key={c.channelId} value={c.channelId}>
                          {c.channelName}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Guidance Category */}
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      {isAr ? 'تصنيف التوجيه / الملاحظة *' : 'Guidance Category *'}
                    </label>
                    <select
                      value={noteCategory}
                      onChange={(e) => setNoteCategory(e.target.value as any)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="PROMOTION_SCHEDULE">{isAr ? '📅 جدول النشر والتوجيه الجماهيري' : '📅 Promotion Schedule'}</option>
                      <option value="TECHNICAL_FEEDBACK">{isAr ? '🎙️ ملاحظة وتعديل فني' : '🎙️ Technical Feedback'}</option>
                      <option value="GENERAL_RECOMMENDATION">{isAr ? '💡 توصية وإرشاد عام' : '💡 General Recommendation'}</option>
                      <option value="EXTERNAL_LINK_REQUEST">{isAr ? '🔗 طلب تواصل خارجي (اختياري)' : '🔗 External Link Request'}</option>
                    </select>
                  </div>
                </div>

                {/* Quick Preset Buttons */}
                <div className="space-y-1.5">
                  <label className="block text-[11px] font-medium text-slate-400">
                    {isAr ? 'نماذج إرشادات سريعة (اضغط للتعبئة الفورية):' : 'Quick Presets (Click to fill):'}
                  </label>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    <button
                      type="button"
                      onClick={() =>
                        setNoteContent(
                          isAr
                            ? 'سأقوم بنشر رابط قناتكم الميداني اليوم في تمام الساعة 8 مساءً لتوجيه متابعيني نحو تغطيتكم.'
                            : 'I will post your channel link today at 8 PM to direct my audience to your field coverage.'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition cursor-pointer"
                    >
                      {isAr ? '⚡ موعد النشر الجماهيري' : '⚡ Schedule Broadcast'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNoteContent(
                          isAr
                            ? 'يرجى تحسين وضوح تسجيل الصوت وتخفيف الضوضاء في التقرير الميداني القادم.'
                            : 'Please improve audio clarity in your upcoming field report.'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition cursor-pointer"
                    >
                      {isAr ? '🎙️ تحسين الصوت' : '🎙️ Audio Quality Note'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setNoteContent(
                          isAr
                            ? 'تم وضع رابط قناتكم الرسمية ورابط التغطية في وصف فيديوهاتي الرسمية طبقاً لسياسة الترويت المتقاطع.'
                            : 'Your channel link is placed in my video descriptions for cross-promotion.'
                        )
                      }
                      className="px-2.5 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 transition cursor-pointer"
                    >
                      {isAr ? '🔄 تأكيد الرابط المتقاطع' : '🔄 Cross Promotion Check'}
                    </button>
                  </div>
                </div>

                {/* Content Input */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    {isAr ? 'نص الملاحظة والتوجيه المباشر *' : 'Guidance Note Content *'}
                  </label>
                  <textarea
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    rows={3}
                    placeholder={
                      isAr
                        ? 'اكتب نص الملاحظة أو الإرشاد الموجه للناشر الميداني...'
                        : 'Type your guidance note for the field publisher...'
                    }
                    className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-purple-500 resize-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isAr ? 'تصل كإشعار رسمي دون إظهار بريدك الشخصي' : 'Protected by Celebrity Privacy Shield'}</span>
                  </span>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-lg shadow-purple-950/40 flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isAr ? 'إرسال التوجيه المباشر' : 'Send One-Way Guidance'}</span>
                  </button>
                </div>
              </form>

              {/* Sent Guidance Notes History Log */}
              <div className="bg-slate-900/90 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span>{isAr ? 'سجل الملاحظات والتوجيهات الموجهة الصادرة' : 'Sent One-Way Guidance Log'}</span>
                  </h4>
                  <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
                    {guidanceNotes.length} {isAr ? 'ملاحظة' : 'notes'}
                  </span>
                </div>

                <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                  {guidanceNotes.map((note) => (
                    <div key={note.id} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-amber-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>موجّه إلى: {note.targetChannelName}</span>
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-slate-400">{note.createdAt}</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{isAr ? 'تم التسليم' : 'Delivered'}</span>
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
                        "{note.content}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation & Final Activation */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {activeTab > 1 && (
              <button
                type="button"
                onClick={() => {
                  setStepError(null);
                  setActiveTab((prev) => (prev - 1) as OnboardingStepId);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
              >
                {isAr ? 'الخطوة السابقة' : 'Previous Step'}
              </button>
            )}

            {activeTab < 3 && (
              <button
                type="button"
                onClick={() => {
                  setStepError(null);
                  setActiveTab((prev) => (prev + 1) as OnboardingStepId);
                }}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs transition flex items-center gap-1"
              >
                <span>{isAr ? 'الخطوة التالية' : 'Next Step'}</span>
                {isAr ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* Unified Final Account Activation Button */}
          <button
            type="button"
            onClick={handleFinalSubmit}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg ${
              isReadyToOpenAccount
                ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 shadow-emerald-950/40 cursor-pointer'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 cursor-pointer border border-slate-700'
            }`}
          >
            <Zap className="w-4 h-4 fill-current text-amber-400" />
            <span>{isAr ? 'فتح الحساب والاعتماد الرسمي' : 'Open Account & Official Accreditation'}</span>
          </button>
        </div>
      </div>

      {/* ASSISTANT KNOWLEDGE BRIDGE MODAL */}
      {showAssistantModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-amber-300">
                  {isAr ? 'بنك معرفة مساعد نور الأماني الذكي — قطاع الياسمين' : 'AI Assistant Knowledge Bridge'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAssistantModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block">
                  {isAr ? '1. ما هي سياسة الكلفة الصفرية (Zero-Cost Policy)؟' : '1. What is the Zero-Cost Policy?'}
                </span>
                <p className="text-slate-400 text-[11px]">
                  {isAr
                    ? 'منظومة نور الأماني لا تستلم ولا تتداول أي أموال، ولا تحتفظ بأي رسوم أو عمولات. الدعم يتم بين الشخصية العامة والقنوات المتبناة مباشرة أو عبر التوجيه المعنوي والإرشاد بكلفة صفرية.'
                    : 'Noor Al-Amani platform charges zero fees and holds no money. Support is given directly or via audience redirection.'}
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block">
                  {isAr ? '2. كيف أختار مسارات الدعم المناسبة لكل قناة؟' : '2. How do I assign support types?'}
                </span>
                <p className="text-slate-400 text-[11px]">
                  {isAr
                    ? 'يمكنك تحديد دور "العرّاب" للتكفل التشغيلي والمعدات، أو "التوجيه" لتحويل متابعيك لمشاهدة القناة المتبناة، أو "الإرشاد" للتوجيه الفني، أو "التمكين الميداني" للإنتاج المشترك.'
                    : 'You can select Godfather (sponsorship), Orientation (audience redirection), Mentorship, or Co-Creation for each channel.'}
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block">
                  {isAr ? '3. ما هي أنواع وسقوف مدد التبني المقترحة (الخطوة الثانية)؟' : '3. What are the adoption duration options (Step 2)?'}
                </span>
                <p className="text-slate-400 text-[11px]">
                  {isAr
                    ? 'تتيح المنظومة 4 أنواع من معايير التبني: 1) السقف الجماهيري (وصول القناة لـ 10,000/15,000 مشترك لتأهيل المونيتيز)، 2) المدة الزمنية المحددة (شهر إلى سنة)، 3) التبني الإنجازي (توفير معدات أو 5 بثوث)، 4) التبني الأبدي المستمر لقنوات غزة.'
                    : 'System provides 4 duration criteria: Subscriber Target Goal (10k/15k subs), Time-Bound (1-12 months), Milestone-Based (gear/broadcasts), or Permanent Lifetime for Gaza field channels.'}
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block">
                  {isAr ? '4. كيف يعمل درع خصوصية المشهور (Celebrity Privacy Shield)؟' : '4. How does the Celebrity Privacy Shield work?'}
                </span>
                <p className="text-slate-400 text-[11px]">
                  {isAr
                    ? 'يعتمد النظام التواصل أحادي الاتجاه؛ تصل رسائلك وتوجيهاتك مباشرة للناشر المتبنى كإشعار رسمي في لوحته دون إتاحة الفرصة لإغراق حسابك الخاص بالرسائل (No DM Spam)، مع إمكانية السماح بطلب تواصل خارجي بملء إرادتك.'
                    : 'System uses one-way direct notes routed as panel notifications. Publishers cannot spam your private inbox unless explicitly authorized.'}
                </p>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                <span className="font-bold text-amber-400 block">
                  {isAr ? '5. ما هو الميثاق الأخلاقي والتعهد الإنساني؟' : '5. What is the Ethical Pledge?'}
                </span>
                <p className="text-slate-400 text-[11px]">
                  {isAr
                    ? 'تعهد معنوي يرسخ الكلفة الصفرية والتكافل الإنساني؛ المنظومة لا تتداول الأموال، وتعهدك هو سند إنساني كفيل بإحياء القنوات المستضعفة والالتزام بالدعم دون أي استغلال تجاري.'
                    : 'A non-commercial pledge cementing zero-cost solidarity and ethical support for vulnerable field teams.'}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setShowAssistantModal(false)}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs hover:bg-amber-400 transition"
              >
                {isAr ? 'فهمت التوجيهات' : 'Got it'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JasmineOnboardingWizard;

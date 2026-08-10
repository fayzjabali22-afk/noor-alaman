import React, { useState, useCallback, useMemo } from 'react';
import {
  parseAndValidateJasmineVideo,
  AdoptedChannelSupport,
  AdoptionDurationPolicy,
  ReciprocalSynergySettings,
  JasmineOnboardingData,
  AVAILABLE_PUBLISHER_CHANNELS,
  OneWayGuidanceNote,
  INITIAL_GUIDANCE_NOTES,
} from '../services/jasmineService';
import { SocialLink } from '../components/SmartLinkChipsInput';

export type OnboardingStepId = 1 | 2 | 3;

export interface UseJasmineWizardOptions {
  onComplete: (data: JasmineOnboardingData) => void;
  lang?: 'ar' | 'en';
  isAccountVerified?: boolean;
}

export function useJasmineWizard({
  onComplete,
  lang = 'ar',
  isAccountVerified = true,
}: UseJasmineWizardOptions) {
  const isAr = lang === 'ar';

  // Active Tab State
  const [activeTab, setActiveTab] = useState<OnboardingStepId>(1);

  // Single Form State
  const [celebrityName, setCelebrityName] = useState('');
  const [titleRole, setTitleRole] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [aliasName, setAliasName] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<'YouTube' | 'TikTok' | 'Instagram' | 'Facebook' | 'X' | 'Vimeo'>('YouTube');
  const [videoUrl, setVideoUrl] = useState('');
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [humanitarianPledgeAgreed, setHumanitarianPledgeAgreed] = useState(false);
  const [humanitarianStatement, setHumanitarianStatement] = useState('');
  const [endorsedCampaign, setEndorsedCampaign] = useState(
    isAr ? 'مبادرة دعم التغطيات الإنسانية في غزة والمناطق المنكوبة' : 'Gaza & Affected Areas Humanitarian Support Initiative'
  );

  // Per-Channel Support Adoption Slots State
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

  // Step 2 Adoption Duration Policies Per Channel
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

  // Step 2 Reciprocal Synergy & Cross-Promotion
  const [reciprocalSynergy, setReciprocalSynergy] = useState<ReciprocalSynergySettings>({
    enableCrossPromotion: true,
    enableHumanitarianVideoLink: true,
  });

  // Step 2 Smart Defaults 1-Click Fast Track Toggle
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

  // Live video validation using Jasmine Service whitelist
  const videoValidation = useMemo(() => parseAndValidateJasmineVideo(videoUrl), [videoUrl]);

  // Check channel adoption validity
  const areAdoptedChannelsValid = useMemo(() => {
    return (
      adoptedChannels.length >= 2 &&
      adoptedChannels.every(
        (c) =>
          c.channelId &&
          c.channelName &&
          (c.supportTypes.isGodfather ||
            c.supportTypes.isOrientation ||
            c.supportTypes.isMentorship ||
            c.supportTypes.isCoCreation)
      )
    );
  }, [adoptedChannels]);

  // Check step readiness
  const isStep1Complete = useMemo(() => {
    return Boolean(
      celebrityName.trim() && videoUrl.trim() && videoValidation.isValid && areAdoptedChannelsValid
    );
  }, [celebrityName, videoUrl, videoValidation.isValid, areAdoptedChannelsValid]);

  const isStep2Complete = useMemo(() => {
    return Boolean(
      humanitarianPledgeAgreed &&
      humanitarianStatement.trim() &&
      adoptedChannels.every((c) => Boolean(channelDurationPolicies[c.channelId]))
    );
  }, [humanitarianPledgeAgreed, humanitarianStatement, adoptedChannels, channelDurationPolicies]);

  const isStep3Complete = useMemo(() => {
    return Boolean(isStep1Complete && isStep2Complete);
  }, [isStep1Complete, isStep2Complete]);

  const isReadyToOpenAccount = Boolean(isAccountVerified && isStep1Complete && isStep2Complete);

  // One-Way Guidance Note Handler
  const handleSendGuidanceNote = useCallback((e: React.FormEvent) => {
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
  }, [noteContent, adoptedChannels, noteTargetChannelId, celebrityName, isAr, noteCategory]);

  // Smart Defaults Preset Handler (1-Click Approval)
  const handleApplySmartDefaultsAndApprove = useCallback(() => {
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
  }, [adoptedChannels, humanitarianStatement, isAr]);

  // Helper to update policy per channel
  const handleUpdateDurationPolicy = useCallback((channelId: string, policy: AdoptionDurationPolicy) => {
    setChannelDurationPolicies((prev) => ({
      ...prev,
      [channelId]: policy,
    }));
  }, []);

  // Channel Adoption Slot Handlers
  const handleUpdateChannelSelection = useCallback((index: number, channelId: string) => {
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
  }, []);

  const handleToggleSupportType = useCallback((
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
  }, []);

  const handleAddChannelSlot = useCallback(() => {
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
  }, [adoptedChannels]);

  const handleRemoveChannelSlot = useCallback((index: number) => {
    if (adoptedChannels.length <= 2) {
      setStepError(
        isAr
          ? 'دستور قطاع الياسمين يفرض كفالة وتبني قناتين إنسانيتين على الأقل (Mandatory Slot 1 & 2).'
          : 'Jasmine Sector rules mandate adopting at least 2 humanitarian channels.'
      );
      return;
    }
    setAdoptedChannels((prev) => prev.filter((_, i) => i !== index));
  }, [adoptedChannels.length, isAr]);

  // Final Submission Handler
  const handleFinalSubmit = useCallback(() => {
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
      isAnonymous,
      aliasName: aliasName.trim() || (isAnonymous ? (isAr ? 'داعم سيادي مجهول' : 'Anonymous Supporter') : undefined),
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
  }, [
    isAccountVerified,
    isAr,
    celebrityName,
    videoUrl,
    videoValidation,
    areAdoptedChannelsValid,
    humanitarianPledgeAgreed,
    humanitarianStatement,
    onComplete,
    titleRole,
    selectedPlatform,
    endorsedCampaign,
    isAnonymous,
    aliasName,
    adoptedChannels,
    channelDurationPolicies,
    communicationPref,
    reciprocalSynergy,
  ]);

  const stepsInfo = useMemo(() => [
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
  ], [isAr, isStep1Complete, isStep2Complete, isStep3Complete]);

  return {
    isAr,
    activeTab,
    setActiveTab,
    celebrityName,
    setCelebrityName,
    titleRole,
    setTitleRole,
    isAnonymous,
    setIsAnonymous,
    aliasName,
    setAliasName,
    selectedPlatform,
    setSelectedPlatform,
    videoUrl,
    setVideoUrl,
    socialLinks,
    setSocialLinks,
    humanitarianPledgeAgreed,
    setHumanitarianPledgeAgreed,
    humanitarianStatement,
    setHumanitarianStatement,
    endorsedCampaign,
    setEndorsedCampaign,
    adoptedChannels,
    channelDurationPolicies,
    communicationPref,
    setCommunicationPref,
    reciprocalSynergy,
    setReciprocalSynergy,
    showManualSettings,
    setShowManualSettings,
    linkCopiedFeedback,
    setLinkCopiedFeedback,
    guidanceNotes,
    noteTargetChannelId,
    setNoteTargetChannelId,
    noteCategory,
    setNoteCategory,
    noteContent,
    setNoteContent,
    noteSuccessMsg,
    noteFormError,
    stepError,
    setStepError,
    showAssistantModal,
    setShowAssistantModal,
    videoValidation,
    areAdoptedChannelsValid,
    isStep1Complete,
    isStep2Complete,
    isStep3Complete,
    isReadyToOpenAccount,
    stepsInfo,
    handleSendGuidanceNote,
    handleApplySmartDefaultsAndApprove,
    handleUpdateDurationPolicy,
    handleUpdateChannelSelection,
    handleToggleSupportType,
    handleAddChannelSlot,
    handleRemoveChannelSlot,
    handleFinalSubmit,
  };
}

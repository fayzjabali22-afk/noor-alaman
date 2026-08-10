import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Info,
  Bot,
  HelpCircle,
  X,
} from 'lucide-react';
import { JasmineOnboardingData } from '../services/jasmineService';
import { useJasmineWizard, OnboardingStepId } from '../hooks/useJasmineWizard';
import { DynamicExplainer, DynamicExplainerProps } from './shared/DynamicExplainer';
import { WizardHeader, WizardHeaderProps } from './shared/WizardHeader';
import { JasmineStep1Identity } from './JasminePortal/JasmineStep1Identity';
import { JasmineStep2Pledge } from './JasminePortal/JasmineStep2Pledge';
import { JasmineStep3Guidance } from './JasminePortal/JasmineStep3Guidance';

export type { JasmineOnboardingData, OnboardingStepId, DynamicExplainerProps, WizardHeaderProps };
export { DynamicExplainer, WizardHeader };

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
  const wizard = useJasmineWizard({
    onComplete,
    lang,
    isAccountVerified,
  });

  const {
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
  } = wizard;

  return (
    <div className="w-full max-w-4xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-3 sm:p-5 md:p-7 shadow-2xl text-slate-100 font-sans relative overflow-hidden noor-full-bleed-container noor-smooth-scroll-viewport gpu-accelerated">
      {/* Top Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-24 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

      {/* Sticky Smart Header with Universal Back Navigation */}
      <WizardHeader
        currentStep={activeTab}
        onBack={() => {
          if (activeTab > 1) {
            setActiveTab((prev) => (prev - 1) as OnboardingStepId);
            setStepError(null);
          } else if (onClose) {
            onClose();
          }
        }}
        title={stepsInfo[activeTab - 1].subtitle}
        isAr={isAr}
      />

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
              className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition cursor-pointer"
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
              className={`p-4 rounded-xl border text-right transition-all duration-200 flex flex-col justify-between relative overflow-hidden cursor-pointer ${
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
                <h3 className="text-sm font-semibold text-white">{step.subtitle}</h3>
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

          {/* STEP 1 */}
          {activeTab === 1 && (
            <JasmineStep1Identity
              isAr={isAr}
              desc={stepsInfo[0].desc}
              celebrityName={celebrityName}
              setCelebrityName={setCelebrityName}
              titleRole={titleRole}
              setTitleRole={setTitleRole}
              isAnonymous={isAnonymous}
              setIsAnonymous={setIsAnonymous}
              aliasName={aliasName}
              setAliasName={setAliasName}
              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}
              videoValidation={videoValidation}
              socialLinks={socialLinks}
              setSocialLinks={setSocialLinks}
              adoptedChannels={adoptedChannels}
              handleUpdateChannelSelection={handleUpdateChannelSelection}
              handleToggleSupportType={handleToggleSupportType}
              handleAddChannelSlot={handleAddChannelSlot}
              handleRemoveChannelSlot={handleRemoveChannelSlot}
              setStepError={setStepError}
            />
          )}

          {/* STEP 2 */}
          {activeTab === 2 && (
            <JasmineStep2Pledge
              isAr={isAr}
              desc={stepsInfo[1].desc}
              celebrityName={celebrityName}
              showManualSettings={showManualSettings}
              setShowManualSettings={setShowManualSettings}
              handleApplySmartDefaultsAndApprove={handleApplySmartDefaultsAndApprove}
              adoptedChannels={adoptedChannels}
              channelDurationPolicies={channelDurationPolicies}
              handleUpdateDurationPolicy={handleUpdateDurationPolicy}
              communicationPref={communicationPref}
              setCommunicationPref={setCommunicationPref}
              reciprocalSynergy={reciprocalSynergy}
              setReciprocalSynergy={setReciprocalSynergy}
              humanitarianPledgeAgreed={humanitarianPledgeAgreed}
              setHumanitarianPledgeAgreed={setHumanitarianPledgeAgreed}
              humanitarianStatement={humanitarianStatement}
              setHumanitarianStatement={setHumanitarianStatement}
              endorsedCampaign={endorsedCampaign}
              setEndorsedCampaign={setEndorsedCampaign}
              videoUrl={videoUrl}
              videoValidation={videoValidation}
              linkCopiedFeedback={linkCopiedFeedback}
              setLinkCopiedFeedback={setLinkCopiedFeedback}
              setStepError={setStepError}
            />
          )}

          {/* STEP 3 */}
          {activeTab === 3 && (
            <JasmineStep3Guidance
              isAr={isAr}
              desc={stepsInfo[2].desc}
              celebrityName={celebrityName}
              adoptedChannels={adoptedChannels}
              noteTargetChannelId={noteTargetChannelId}
              setNoteTargetChannelId={setNoteTargetChannelId}
              noteCategory={noteCategory}
              setNoteCategory={setNoteCategory}
              noteContent={noteContent}
              setNoteContent={setNoteContent}
              noteFormError={noteFormError}
              noteSuccessMsg={noteSuccessMsg}
              handleSendGuidanceNote={handleSendGuidanceNote}
              guidanceNotes={guidanceNotes}
              handleFinalSubmit={handleFinalSubmit}
              isReadyToOpenAccount={isReadyToOpenAccount}
              isStep1Complete={isStep1Complete}
              isStep2Complete={isStep2Complete}
            />
          )}
        </div>

        {/* Step Navigation Controls (Prev / Next Buttons for Step 1 & Step 2) */}
        {activeTab < 3 && (
          <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
            {activeTab > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setActiveTab((prev) => (prev - 1) as OnboardingStepId);
                  setStepError(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition border border-slate-700 cursor-pointer min-h-[40px]"
              >
                {isAr ? 'الخطوة السابقة' : 'Previous Step'}
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={() => {
                setStepError(null);
                if (activeTab === 1 && !isStep1Complete) {
                  setStepError(
                    isAr
                      ? 'يرجى إكمال بيانات الهوية، ورابط الفيديو المعتمد، وتحديد مسارات القنوات المتبناة في الخطوة الأولى.'
                      : 'Please complete Identity, Whitelisted Video URL, and Adopted Channels in Step 1.'
                  );
                  return;
                }
                setActiveTab((prev) => (prev + 1) as OnboardingStepId);
              }}
              className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-extrabold transition cursor-pointer shadow-lg active:scale-95 min-h-[40px]"
            >
              {isAr ? 'الانتقال للخطوة التالية' : 'Proceed to Next Step'}
            </button>
          </div>
        )}
      </div>

      {/* AI Assistant Modal */}
      {showAssistantModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-amber-300">
                  {isAr ? 'مساعد نور الأماني الاستشاري' : 'Noor Al-Amani AI Advisor'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAssistantModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                {isAr
                  ? 'مرحباً بك! أنا المساعد الذكي المخصص لقطاع الياسمين. يمكنني تقديم اقتراحات لحياكة بيان الدعم الإنساني أو توجيهات البث بأفضل معايير التمكين الميداني.'
                  : 'Welcome! I am the Jasmine AI Advisor. I can help optimize your endorsement statement or channel guidance.'}
              </p>
              <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-200">
                <h4 className="font-bold mb-1 flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{isAr ? 'نصيحة إستراتيجية:' : 'Strategic Tip:'}</span>
                </h4>
                <p className="text-[11px]">
                  {isAr
                    ? 'التبني المتوازن يركز على الجمع بين كفالة التوجيه (دعوة الجمهور) والإرشاد التقني، مما يضمن تعظيم وصول صوت القناة بنسبة 300%.'
                    : 'Balanced channel adoption combines audience orientation and technical mentorship.'}
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowAssistantModal(false)}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition cursor-pointer"
              >
                {isAr ? 'فهمت، العودة للمعالج' : 'Got it, return to wizard'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

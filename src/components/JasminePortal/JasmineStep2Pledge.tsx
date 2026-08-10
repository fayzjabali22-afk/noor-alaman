import React from 'react';
import {
  Zap,
  Settings,
  CheckCircle2,
  Copy,
  ExternalLink,
  ShieldCheck,
  Video,
  Globe,
  Award,
} from 'lucide-react';
import {
  AdoptedChannelSupport,
  AdoptionDurationPolicy,
  ReciprocalSynergySettings,
  parseAndValidateJasmineVideo,
} from '../../services/jasmineService';
import { DynamicExplainer } from '../shared/DynamicExplainer';

type JasmineVideoValidation = ReturnType<typeof parseAndValidateJasmineVideo>;

export interface JasmineStep2PledgeProps {
  isAr: boolean;
  desc: string;
  celebrityName: string;
  showManualSettings: boolean;
  setShowManualSettings: React.Dispatch<React.SetStateAction<boolean>>;
  handleApplySmartDefaultsAndApprove: () => void;
  adoptedChannels: AdoptedChannelSupport[];
  channelDurationPolicies: Record<string, AdoptionDurationPolicy>;
  handleUpdateDurationPolicy: (channelId: string, policy: AdoptionDurationPolicy) => void;
  communicationPref: {
    allowOneWayNotes: boolean;
    allowExternalContactRequest: boolean;
  };
  setCommunicationPref: React.Dispatch<
    React.SetStateAction<{
      allowOneWayNotes: boolean;
      allowExternalContactRequest: boolean;
    }>
  >;
  reciprocalSynergy: ReciprocalSynergySettings;
  setReciprocalSynergy: React.Dispatch<React.SetStateAction<ReciprocalSynergySettings>>;
  humanitarianPledgeAgreed: boolean;
  setHumanitarianPledgeAgreed: (val: boolean) => void;
  humanitarianStatement: string;
  setHumanitarianStatement: (val: string) => void;
  endorsedCampaign: string;
  setEndorsedCampaign: (val: string) => void;
  videoUrl: string;
  videoValidation: JasmineVideoValidation;
  linkCopiedFeedback: boolean;
  setLinkCopiedFeedback: (val: boolean) => void;
  setStepError: (err: string | null) => void;
}

export const JasmineStep2Pledge: React.FC<JasmineStep2PledgeProps> = ({
  isAr,
  desc,
  celebrityName,
  showManualSettings,
  setShowManualSettings,
  handleApplySmartDefaultsAndApprove,
  adoptedChannels,
  channelDurationPolicies,
  handleUpdateDurationPolicy,
  communicationPref,
  setCommunicationPref,
  reciprocalSynergy,
  setReciprocalSynergy,
  humanitarianPledgeAgreed,
  setHumanitarianPledgeAgreed,
  humanitarianStatement,
  setHumanitarianStatement,
  endorsedCampaign,
  setEndorsedCampaign,
  videoUrl,
  videoValidation,
  linkCopiedFeedback,
  setLinkCopiedFeedback,
  setStepError,
}) => {
  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
        {desc}
      </p>

      {/* Fast Track 1-Click Approval Card vs Manual Settings Toggle */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-amber-400 fill-current" />
            <div>
              <h4 className="text-xs md:text-sm font-bold text-amber-300">
                {isAr
                  ? 'مسار الاعتماد المباشر بضغط بنقرة واحدة (1-Click Approval Preset)'
                  : 'Fast-Track 1-Click Approval Preset'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {isAr
                  ? 'تطبيق كافة الإعدادات المعتمدة سيادياً ورعايتها فوراً دون التعمق في التفاصيل الإدارية.'
                  : 'Apply sovereign preset defaults and approve sponsorship instantly.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleApplySmartDefaultsAndApprove}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md active:scale-95 transition cursor-pointer min-h-[40px]"
            >
              {isAr ? 'اعتماد سريع والتحويل للخطوة 3' : '1-Click Approve & Go to Step 3'}
            </button>
            <button
              type="button"
              onClick={() => setShowManualSettings((prev) => !prev)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition cursor-pointer flex items-center gap-1.5 min-h-[40px]"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>{showManualSettings ? (isAr ? 'إخفاء التفاصيل' : 'Hide Details') : (isAr ? 'تخصيص يدوي' : 'Manual Config')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Manual Duration & Policy Settings (Collapsible or visible) */}
      {showManualSettings && (
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-4">
          <h4 className="text-xs font-bold text-amber-300 border-b border-slate-800 pb-2">
            {isAr ? 'تحديد سقف التبني والسياسات لكل قناة متبناة:' : 'Specify Adoption Target & Policies Per Channel:'}
          </h4>

          <div className="space-y-3">
            {adoptedChannels.map((ch) => {
              const currentPolicy = channelDurationPolicies[ch.channelId] || {
                type: 'SUBSCRIBER_TARGET',
                subscriberTargetCount: 10000,
              };

              return (
                <div key={`policy-${ch.channelId}`} className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span>{ch.channelName}</span>
                    </span>
                    <select
                      value={currentPolicy.type}
                      onChange={(e) => {
                        const newType = e.target.value as AdoptionDurationPolicy['type'];
                        if (newType === 'SUBSCRIBER_TARGET') {
                          handleUpdateDurationPolicy(ch.channelId, { type: 'SUBSCRIBER_TARGET', subscriberTargetCount: 10000 });
                        } else if (newType === 'TIME_BOUND') {
                          handleUpdateDurationPolicy(ch.channelId, { type: 'TIME_BOUND', durationMonths: 3 });
                        } else if (newType === 'MILESTONE_BASED') {
                          handleUpdateDurationPolicy(ch.channelId, { type: 'MILESTONE_BASED', milestoneDescription: 'تجاوز 100 ألف مشاهدة' });
                        } else {
                          handleUpdateDurationPolicy(ch.channelId, { type: 'PERMANENT' });
                        }
                      }}
                      className="bg-slate-900 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-amber-300 focus:outline-none cursor-pointer min-h-[36px]"
                    >
                      <option value="SUBSCRIBER_TARGET">{isAr ? 'هدف مشتركين (Subscriber Target)' : 'Subscriber Target'}</option>
                      <option value="TIME_BOUND">{isAr ? 'مدي زمني (Time Bound)' : 'Time Bound'}</option>
                      <option value="MILESTONE_BASED">{isAr ? 'مهمة محددة (Milestone Based)' : 'Milestone Based'}</option>
                      <option value="PERMANENT">{isAr ? 'دعم مستمر (Permanent)' : 'Permanent'}</option>
                    </select>
                  </div>

                  {/* Policy Value Inputs */}
                  {currentPolicy.type === 'SUBSCRIBER_TARGET' && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{isAr ? 'هدف المشتركين:' : 'Subscriber Target:'}</span>
                      <input
                        type="number"
                        value={currentPolicy.subscriberTargetCount || 10000}
                        onChange={(e) =>
                          handleUpdateDurationPolicy(ch.channelId, {
                            ...currentPolicy,
                            subscriberTargetCount: Number(e.target.value) || 1000,
                          })
                        }
                        className="w-32 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                  )}

                  {currentPolicy.type === 'TIME_BOUND' && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{isAr ? 'المدة بالأشهر:' : 'Duration (Months):'}</span>
                      <input
                        type="number"
                        step="0.5"
                        value={currentPolicy.durationMonths || 3}
                        onChange={(e) =>
                          handleUpdateDurationPolicy(ch.channelId, {
                            ...currentPolicy,
                            durationMonths: Number(e.target.value) || 1,
                          })
                        }
                        className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                  )}

                  {currentPolicy.type === 'MILESTONE_BASED' && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-400">{isAr ? 'وصف المهمة:' : 'Milestone Description:'}</span>
                      <input
                        type="text"
                        value={currentPolicy.milestoneDescription || ''}
                        onChange={(e) =>
                          handleUpdateDurationPolicy(ch.channelId, {
                            ...currentPolicy,
                            milestoneDescription: e.target.value,
                          })
                        }
                        placeholder={isAr ? 'تجاوز 100 ألف مشاهدة' : 'Reach 100k views'}
                        className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white"
                      />
                    </div>
                  )}

                  <DynamicExplainer channelName={ch.channelName} durationPolicy={currentPolicy} />
                </div>
              );
            })}
          </div>

          {/* Reciprocal Synergy & One-Way Communication Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-amber-300 block">
                {isAr ? 'التداول والترويج المتبادل (Reciprocal Synergy)' : 'Reciprocal Synergy'}
              </span>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reciprocalSynergy.enableCrossPromotion}
                  onChange={(e) =>
                    setReciprocalSynergy({
                      ...reciprocalSynergy,
                      enableCrossPromotion: e.target.checked,
                    })
                  }
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900"
                />
                <span>{isAr ? 'السماح بربط الروابط الترويجية المتبادلة' : 'Allow Cross-Promotion Links'}</span>
              </label>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-amber-300 block">
                {isAr ? 'التواصل أحادي الاتجاه (One-Way Direct Notes)' : 'One-Way Communication'}
              </span>
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={communicationPref.allowOneWayNotes}
                  onChange={(e) =>
                    setCommunicationPref({
                      ...communicationPref,
                      allowOneWayNotes: e.target.checked,
                    })
                  }
                  className="rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900"
                />
                <span>{isAr ? 'تفعيل استقبال التوجيهات المباشرة دون سبام' : 'Allow One-Way Direct Guidance'}</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Humanitarian Pledge Agreement & Statement */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
        <h4 className="text-xs md:text-sm font-bold text-amber-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>{isAr ? 'ميثاق التبني والدعم الإنساني غير التجاري *' : 'Humanitarian Non-Commercial Pledge *'}</span>
        </h4>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            {isAr ? 'بيان الدعم والموقف الإنساني الصريح *' : 'Public Support Statement *'}
          </label>
          <textarea
            rows={3}
            value={humanitarianStatement}
            onChange={(e) => {
              setHumanitarianStatement(e.target.value);
              setStepError(null);
            }}
            placeholder={
              isAr
                ? 'أعلن دعمي الكامل واستضافتي لمحتوى القنوات الإنسانية المتبناة لتعزيز الحرية الإعلامية بكلفة صفرية...'
                : 'I declare my endorsement and support for the adopted humanitarian publisher channels...'
            }
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            {isAr ? 'المبادرة الإنسانية المستهدفة' : 'Endorsed Campaign Target'}
          </label>
          <input
            type="text"
            value={endorsedCampaign}
            onChange={(e) => setEndorsedCampaign(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 min-h-[44px]"
          />
        </div>

        {/* Mandatory Checkbox */}
        <label className="flex items-start gap-3 p-3 rounded-lg bg-slate-950 border border-slate-800/80 cursor-pointer">
          <input
            type="checkbox"
            checked={humanitarianPledgeAgreed}
            onChange={(e) => {
              setHumanitarianPledgeAgreed(e.target.checked);
              setStepError(null);
            }}
            className="mt-1 rounded border-slate-700 text-amber-500 focus:ring-amber-500 bg-slate-900 shrink-0"
          />
          <span className="text-xs text-slate-300 leading-relaxed">
            {isAr
              ? 'أؤكد بموجب هذا الميثاق أن هذا التبني إنساني تكافلي محض، خالٍ من أي شروط تجارية أو عمولات مالية أو تحيزات سياقية، وتخضع التوجيهات لقوانين المنصة.'
              : 'I confirm under this pledge that channel adoption is purely non-monetary and humanitarian, free from commercial bias.'}
          </span>
        </label>
      </div>

      {/* Embed Video Preview & Ethical Bio Link Generator */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
        <h4 className="text-xs md:text-sm font-bold text-amber-400 flex items-center gap-2">
          <Globe className="w-4 h-4 text-amber-400" />
          <span>{isAr ? 'توليد رابط الإحالة الأخلاقي الخاص بالمؤثر (Bio Link Generator)' : 'Ethical Referral Bio Link Generator'}</span>
        </h4>

        {videoValidation.isValid && videoUrl && (
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
            <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'معاينة الفيديو المدمج بخصائص الحماية بكلفة صفرية' : 'Zero-Cost Embed Player Preview'}</span>
            </span>
            <div className="aspect-video w-full max-w-md mx-auto rounded-lg overflow-hidden bg-black border border-slate-800">
              <iframe
                src={`https://www.youtube.com/embed/${videoValidation.videoId || ''}`}
                title="Support Video Preview"
                className="w-full h-full"
                allowFullScreen
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={`https://noor-al-amani.org/jasmine/celebrity/${encodeURIComponent(celebrityName || 'ref')}`}
            className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-amber-200 font-mono"
          />
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(`https://noor-al-amani.org/jasmine/celebrity/${encodeURIComponent(celebrityName || 'ref')}`);
              setLinkCopiedFeedback(true);
              setTimeout(() => setLinkCopiedFeedback(false), 2500);
            }}
            className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0 min-h-[40px]"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{linkCopiedFeedback ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الرابط' : 'Copy Bio Link')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

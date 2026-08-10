import React from 'react';
import {
  ShieldAlert,
  Video,
  Plus,
  Trash2,
  HelpCircle,
  Award,
  Globe,
  Crown,
} from 'lucide-react';
import {
  AVAILABLE_PUBLISHER_CHANNELS,
  AdoptedChannelSupport,
  parseAndValidateJasmineVideo,
} from '../../services/jasmineService';
import { DynamicExplainer } from '../shared/DynamicExplainer';
import { SmartLinkChipsInput, SocialLink } from '../SmartLinkChipsInput';

type JasmineVideoValidation = ReturnType<typeof parseAndValidateJasmineVideo>;

export interface JasmineStep1IdentityProps {
  isAr: boolean;
  desc: string;
  celebrityName: string;
  setCelebrityName: (val: string) => void;
  titleRole: string;
  setTitleRole: (val: string) => void;
  isAnonymous: boolean;
  setIsAnonymous: (val: boolean) => void;
  aliasName: string;
  setAliasName: (val: string) => void;
  videoUrl: string;
  setVideoUrl: (val: string) => void;
  videoValidation: JasmineVideoValidation;
  socialLinks: SocialLink[];
  setSocialLinks: (val: SocialLink[]) => void;
  adoptedChannels: AdoptedChannelSupport[];
  handleUpdateChannelSelection: (index: number, channelId: string) => void;
  handleToggleSupportType: (
    index: number,
    typeKey: 'isGodfather' | 'isOrientation' | 'isMentorship' | 'isCoCreation'
  ) => void;
  handleAddChannelSlot: () => void;
  handleRemoveChannelSlot: (index: number) => void;
  setStepError: (err: string | null) => void;
}

export const JasmineStep1Identity: React.FC<JasmineStep1IdentityProps> = ({
  isAr,
  desc,
  celebrityName,
  setCelebrityName,
  titleRole,
  setTitleRole,
  isAnonymous,
  setIsAnonymous,
  aliasName,
  setAliasName,
  videoUrl,
  setVideoUrl,
  videoValidation,
  socialLinks,
  setSocialLinks,
  adoptedChannels,
  handleUpdateChannelSelection,
  handleToggleSupportType,
  handleAddChannelSlot,
  handleRemoveChannelSlot,
  setStepError,
}) => {
  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
        {desc}
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
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 min-h-[44px]"
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
            className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 min-h-[44px]"
          />
        </div>
      </div>

      {/* Phantom Supporter Mode Toggle Switch */}
      <div className="p-4 bg-slate-900/90 border border-amber-500/30 rounded-xl space-y-3 shadow-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs md:text-sm font-bold text-amber-300">
                {isAr ? 'تفعيل نمط الداعم الخفي / الراعي المستعار (Phantom Supporter Mode)' : 'Phantom Supporter Mode (Anonymous)'}
              </h4>
              <p className="text-[11px] text-slate-400">
                {isAr
                  ? 'تقديم الكفالة والتوجيه الإنساني بخصوصية سيادية تامة دون إشهار الاسم الصريح في القوائم العامة.'
                  : 'Provide humanitarian support with complete sovereign privacy without public name exposure.'}
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
          </label>
        </div>

        {isAnonymous && (
          <div className="pt-2 border-t border-slate-800/80">
            <label className="block text-xs font-medium text-amber-200 mb-1">
              {isAr ? 'اللقب المستعار للراعي الخفي (اختياري)' : 'Anonymous Alias Name (Optional)'}
            </label>
            <input
              type="text"
              value={aliasName}
              onChange={(e) => setAliasName(e.target.value)}
              placeholder={isAr ? 'مثال: فاعل خير - الأردن' : 'e.g. Sovereign Supporter - Jordan'}
              className="w-full bg-slate-950 border border-amber-500/40 rounded-xl px-3.5 py-2 text-xs text-amber-100 placeholder-slate-500 focus:outline-none focus:border-amber-400 min-h-[44px]"
            />
          </div>
        )}
      </div>

      {/* Whitelisted Video URL Input */}
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAr ? 'رابط المادة المرئية الداعمة (مطلوب) *' : 'Whitelisted Video Support URL *'}</span>
        </label>
        <input
          type="url"
          value={videoUrl}
          onChange={(e) => {
            setVideoUrl(e.target.value);
            setStepError(null);
          }}
          placeholder="https://www.youtube.com/watch?v=..."
          className={`w-full bg-slate-900 border rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none min-h-[44px] ${
            videoUrl.trim()
              ? videoValidation.isValid
                ? 'border-emerald-500/80 focus:border-emerald-400'
                : 'border-rose-500/80 focus:border-rose-400'
              : 'border-slate-700/80 focus:border-amber-500'
          }`}
        />
        {videoUrl.trim() && (
          <p
            className={`text-[11px] mt-1.5 flex items-center gap-1 ${
              videoValidation.isValid ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            <span>{videoValidation.isValid ? '✓' : '⚠'}</span>
            <span>
              {videoValidation.isValid
                ? isAr
                  ? `رابط صالح ومطابق للقائمة البيضاء (${videoValidation.platform})`
                  : `Valid whitelisted URL (${videoValidation.platform})`
                : videoValidation.error}
            </span>
          </p>
        )}
      </div>

      {/* Social Links Chips Input */}
      <div>
        <SmartLinkChipsInput
          links={socialLinks}
          onChange={setSocialLinks}
          isAr={isAr}
        />
      </div>

      {/* Mandatory Per-Channel Adoption Slots Grid */}
      <div className="pt-4 border-t border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-xs md:text-sm font-bold text-amber-400 flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-400" />
              <span>
                {isAr
                  ? 'تخصيص مسارات الدعم للقنوات المتبناة (قناتين على الأقل)'
                  : 'Allocate Support Pathways per Adopted Channel (Min 2)'}
              </span>
            </h4>
            <p className="text-[11px] text-slate-400">
              {isAr
                ? 'حدد نوع الدعم المخصص لكل قناة (العرّاب، التوجيه، الإرشاد، التمكين الميداني)'
                : 'Select specific support types for each channel (Godfather, Orientation, Mentorship, Co-Creation)'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleAddChannelSlot}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold hover:bg-amber-500/20 transition cursor-pointer shrink-0 min-h-[36px]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isAr ? 'إضافة قناة متبناة' : 'Add Channel Slot'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {adoptedChannels.map((slot, idx) => (
            <div
              key={`slot-${idx}`}
              className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-3 relative"
            >
              <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                <div className="flex items-center gap-2 flex-1">
                  <span className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <select
                    value={slot.channelId}
                    onChange={(e) => handleUpdateChannelSelection(idx, e.target.value)}
                    className="bg-slate-950 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400 flex-1 max-w-sm cursor-pointer min-h-[38px]"
                  >
                    {AVAILABLE_PUBLISHER_CHANNELS.map((ch) => (
                      <option key={ch.id} value={ch.id}>
                        {ch.name} ({ch.platform} - {ch.subscribersCount})
                      </option>
                    ))}
                  </select>
                </div>

                {adoptedChannels.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveChannelSlot(idx)}
                    className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition cursor-pointer"
                    title={isAr ? 'حذف القناة' : 'Remove Channel'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Support Types Toggles for this channel */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleToggleSupportType(idx, 'isGodfather')}
                  className={`p-2.5 rounded-lg border text-right transition cursor-pointer flex items-center gap-2 ${
                    slot.supportTypes.isGodfather
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span className="text-[11px]">{isAr ? 'العرّاب (لوجستي)' : 'Godfather'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleSupportType(idx, 'isOrientation')}
                  className={`p-2.5 rounded-lg border text-right transition cursor-pointer flex items-center gap-2 ${
                    slot.supportTypes.isOrientation
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span className="text-[11px]">{isAr ? 'توجيه الجمهور' : 'Orientation'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleSupportType(idx, 'isMentorship')}
                  className={`p-2.5 rounded-lg border text-right transition cursor-pointer flex items-center gap-2 ${
                    slot.supportTypes.isMentorship
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <HelpCircle className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span className="text-[11px]">{isAr ? 'إرشاد وتقني' : 'Mentorship'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleSupportType(idx, 'isCoCreation')}
                  className={`p-2.5 rounded-lg border text-right transition cursor-pointer flex items-center gap-2 ${
                    slot.supportTypes.isCoCreation
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 font-bold'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Video className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                  <span className="text-[11px]">{isAr ? 'إنتاج مشترك' : 'Co-Creation'}</span>
                </button>
              </div>

              {/* Dynamic Explainer for this channel */}
              <DynamicExplainer
                channelName={slot.channelName}
                supportTypes={slot.supportTypes}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

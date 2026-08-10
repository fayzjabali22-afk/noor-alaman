import React from 'react';
import {
  MessageSquare,
  Send,
  Calendar,
  Clock,
  Zap,
  Crown,
  CheckCircle2,
  Info,
} from 'lucide-react';
import {
  AdoptedChannelSupport,
  OneWayGuidanceNote,
} from '../../services/jasmineService';

export interface JasmineStep3GuidanceProps {
  isAr: boolean;
  desc: string;
  celebrityName: string;
  adoptedChannels: AdoptedChannelSupport[];
  noteTargetChannelId: string;
  setNoteTargetChannelId: (val: string) => void;
  noteCategory: 'TECHNICAL_FEEDBACK' | 'PROMOTION_SCHEDULE' | 'GENERAL_RECOMMENDATION' | 'EXTERNAL_LINK_REQUEST';
  setNoteCategory: (val: 'TECHNICAL_FEEDBACK' | 'PROMOTION_SCHEDULE' | 'GENERAL_RECOMMENDATION' | 'EXTERNAL_LINK_REQUEST') => void;
  noteContent: string;
  setNoteContent: (val: string) => void;
  noteFormError: string | null;
  noteSuccessMsg: string | null;
  handleSendGuidanceNote: (e: React.FormEvent) => void;
  guidanceNotes: OneWayGuidanceNote[];
  handleFinalSubmit: () => void;
  isReadyToOpenAccount: boolean;
  isStep1Complete: boolean;
  isStep2Complete: boolean;
}

export const JasmineStep3Guidance: React.FC<JasmineStep3GuidanceProps> = ({
  isAr,
  desc,
  celebrityName,
  adoptedChannels,
  noteTargetChannelId,
  setNoteTargetChannelId,
  noteCategory,
  setNoteCategory,
  noteContent,
  setNoteContent,
  noteFormError,
  noteSuccessMsg,
  handleSendGuidanceNote,
  guidanceNotes,
  handleFinalSubmit,
  isReadyToOpenAccount,
  isStep1Complete,
  isStep2Complete,
}) => {
  return (
    <div className="space-y-6">
      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800">
        {desc}
      </p>

      {/* One-Way Direct Guidance Note Composer Form */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-xs md:text-sm font-bold text-amber-400 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'إرسال توجيه مباشر أحادي الاتجاه للقنوات المتبناة' : 'Send One-Way Direct Guidance Note'}</span>
          </h4>
          <span className="text-[11px] text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
            No DM Spam Protection
          </span>
        </div>

        {noteFormError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{noteFormError}</span>
          </div>
        )}

        {noteSuccessMsg && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{noteSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleSendGuidanceNote} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isAr ? 'اختر القناة المتبناة المستهدفة:' : 'Target Adopted Channel:'}
              </label>
              <select
                value={noteTargetChannelId || (adoptedChannels[0]?.channelId || '')}
                onChange={(e) => setNoteTargetChannelId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer min-h-[44px]"
              >
                {adoptedChannels.map((ch) => (
                  <option key={`target-${ch.channelId}`} value={ch.channelId}>
                    {ch.channelName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {isAr ? 'تصنيف التوجيه:' : 'Note Category:'}
              </label>
              <select
                value={noteCategory}
                onChange={(e) =>
                  setNoteCategory(
                    e.target.value as 'TECHNICAL_FEEDBACK' | 'PROMOTION_SCHEDULE' | 'GENERAL_RECOMMENDATION' | 'EXTERNAL_LINK_REQUEST'
                  )
                }
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer min-h-[44px]"
              >
                <option value="PROMOTION_SCHEDULE">{isAr ? 'جدولة البث والترويج' : 'Promotion Schedule'}</option>
                <option value="TECHNICAL_FEEDBACK">{isAr ? 'ملاحظة تقنية وإخراجية' : 'Technical Feedback'}</option>
                <option value="GENERAL_RECOMMENDATION">{isAr ? 'توصية إنسانية عامة' : 'General Recommendation'}</option>
                <option value="EXTERNAL_LINK_REQUEST">{isAr ? 'طلب مادة أو رابط خارجي' : 'External Link Request'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {isAr ? 'نص التوجيه الموجه للقناة المتبناة:' : 'Direct Guidance Content:'}
            </label>
            <textarea
              rows={3}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder={
                isAr
                  ? 'أقترح إعادة بث التغطية الميدانية في تمام الساعة 8 مساءً لضمان وصول أعلى للجمهور العربي...'
                  : 'I suggest scheduling the live stream at 8 PM for maximum engagement...'
              }
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-md min-h-[42px]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isAr ? 'إرسال التوجيه أحادي الاتجاه' : 'Dispatch One-Way Note'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* History Feed of Sent Guidance Notes */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
        <h4 className="text-xs font-bold text-amber-400 flex items-center gap-2 border-b border-slate-800 pb-2">
          <Calendar className="w-4 h-4 text-amber-400" />
          <span>{isAr ? 'سجل التوجيهات والملاحظات المرسلة سابقاً:' : 'Sent Guidance Notes History:'}</span>
        </h4>

        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 noor-smooth-scroll">
          {guidanceNotes.map((note) => (
            <div
              key={note.id}
              className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1.5 text-xs text-slate-200"
            >
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold text-amber-300">
                  {note.targetChannelName}
                </span>
                <span className="flex items-center gap-1 font-mono text-[10px]">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {note.createdAt}
                </span>
              </div>
              <p className="text-slate-300 leading-relaxed">{note.content}</p>
              <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] text-emerald-400">
                <span className="bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  {isAr ? 'تم التسليم للقمرية' : 'Delivered to Channel'}
                </span>
                <span className="text-slate-500 font-mono">{note.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Action Button Box - Confirmation of Field Sponsorship */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3">
        <div className="text-xs text-slate-400">
          {isStep1Complete && isStep2Complete ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>{isAr ? 'جميع الشروط مكتملا وجاهزة للاعتماد الميداني النهائي' : 'All requirements met for official activation'}</span>
            </span>
          ) : (
            <span>{isAr ? 'يرجى التأكد من استكمال كافة خطوات المعالج' : 'Complete required wizard steps first'}</span>
          )}
        </div>

        <button
          type="button"
          onClick={handleFinalSubmit}
          className={`w-full sm:w-auto px-6 py-3.5 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer min-h-[48px] ${
            isReadyToOpenAccount || (isStep1Complete && isStep2Complete)
              ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 shadow-amber-500/20 active:scale-95'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
          }`}
        >
          <Zap className="w-4 h-4 fill-current text-amber-400" />
          <span>{isAr ? 'اعتماد الكفالة الميدانية وتفعيل القمرة' : 'Confirm Field Sponsorship & Activate Cockpit'}</span>
          <Crown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

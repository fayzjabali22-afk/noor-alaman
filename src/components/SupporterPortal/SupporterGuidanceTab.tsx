import React, { useState, useEffect } from 'react';
import { Publisher, SupporterAction } from '../../types';
import { MessageSquare, CheckCircle2, Radio, Zap, Send } from 'lucide-react';

interface SupporterGuidanceTabProps {
  isAr: boolean;
  sponsoredPublishers: Publisher[];
  initialTargetChannelId?: string;
  onRecordAction?: (action: SupporterAction) => void;
  onShowNotice?: (notice: {
    title: string;
    message: string;
    sealHash: string;
    type?: 'download' | 'report' | 'archive';
  }) => void;
}

export const SupporterGuidanceTab: React.FC<SupporterGuidanceTabProps> = ({
  isAr,
  sponsoredPublishers,
  initialTargetChannelId,
  onRecordAction,
  onShowNotice,
}) => {
  const [targetChannelId, setTargetChannelId] = useState<string>(
    initialTargetChannelId || (sponsoredPublishers[0]?.id || '')
  );
  const [trafficBoostVideoUrl, setTrafficBoostVideoUrl] = useState<string>('');
  const [guidanceText, setGuidanceText] = useState<string>('');
  const [isGuidanceSentSuccess, setIsGuidanceSentSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (initialTargetChannelId) {
      setTargetChannelId(initialTargetChannelId);
    } else if (!targetChannelId && sponsoredPublishers.length > 0) {
      setTargetChannelId(sponsoredPublishers[0].id);
    }
  }, [initialTargetChannelId, sponsoredPublishers]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guidanceText.trim()) return;

    const selectedPub = sponsoredPublishers.find((p) => p.id === targetChannelId) || sponsoredPublishers[0];

    if (onRecordAction && selectedPub) {
      onRecordAction({
        id: `act-guide-${Date.now()}`,
        publisherId: selectedPub.id,
        publisherName: selectedPub.name,
        platform: selectedPub.platform as any,
        timestamp: new Date().toISOString(),
      });
    }

    if (onShowNotice) {
      onShowNotice({
        title: isAr ? 'تم إرسال التوجيه والدفعة المرورية' : 'Guidance & Boost Dispatched',
        message: isAr
          ? `تم إرسال التوجيه المباشر بنجاح للقناة (${selectedPub?.name || targetChannelId}).`
          : `Direct guidance dispatched to (${selectedPub?.name || targetChannelId}).`,
        sealHash: `GUIDE-${Date.now().toString(36).toUpperCase()}`,
        type: 'report',
      });
    }

    setIsGuidanceSentSuccess(true);
    setGuidanceText('');
    setTrafficBoostVideoUrl('');

    setTimeout(() => {
      setIsGuidanceSentSuccess(false);
    }, 4000);
  };

  return (
    <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20">
          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
          <span>{isAr ? 'منصة إطلاق التوجيهات المباشرة والدفعة المرورية' : 'Direct Guidance & Traffic Boost Launchpad'}</span>
        </div>
        <h3 className="text-lg md:text-2xl font-black text-white">
          {isAr ? 'صياغة التوجيه أحادي الاتجاه وتفعيل الدفعة المرورية للقناة المكفولة' : 'Dispatch One-Way Guidance & Traffic Boost'}
        </h3>
        <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
          {isAr
            ? 'توجيه محمي أحادي الاتجاه يصدر حصراً من الكفيل المعتمد نحو القناة التي يكفلها بدون غرف دردشة متبادلة، مع إمكانية إرفاق رابط فيديو محدد لتسليط الضوء عليه وتوجيه حركة الجمهور نحوه فوراً.'
            : 'A protected one-way direct channel guidance panel allowing sponsors to offer support and attach video URLs for instant traffic boost.'}
        </p>
      </div>

      {isGuidanceSentSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>
            {isAr
              ? 'تم إرسال التوجيه المباشر والدفعة المرورية بنجاح إلى القناة المكفولة، وتم تسجيل الإجراء في السجل المرجعي!'
              : 'Direct guidance and traffic boost link dispatched successfully!'}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Target Sponsored Channel Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Radio className="w-4 h-4 text-purple-400" />
            <span>{isAr ? 'اختر القناة المكفولة المستهدفة بالتوجيه:' : 'Select Target Sponsored Channel:'}</span>
          </label>
          <select
            value={targetChannelId}
            onChange={(e) => setTargetChannelId(e.target.value)}
            className="w-full bg-slate-950 text-slate-100 text-base md:text-xs rounded-xl px-4 py-3 border border-slate-800 focus:border-purple-500 outline-none cursor-pointer font-bold min-h-[44px] touch-manipulation"
          >
            {sponsoredPublishers.length === 0 ? (
              <option value="">{isAr ? 'لا توجد قنوات مكفولة حالياً' : 'No active sponsored channels'}</option>
            ) : (
              sponsoredPublishers.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.platform} - {p.location})
                </option>
              ))
            )}
          </select>
        </div>

        {/* Traffic Boost Video URL Input */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'رابط الفيديو المستهدف للدفعة المرورية (اختياري):' : 'Target Video URL for Traffic Boost (Optional):'}</span>
          </label>
          <input
            type="url"
            value={trafficBoostVideoUrl}
            onChange={(e) => setTrafficBoostVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full bg-slate-950 text-slate-100 text-base md:text-xs rounded-xl px-4 py-3 border border-slate-800 focus:border-amber-500 outline-none transition font-mono min-h-[44px] touch-manipulation"
          />
          <p className="text-[11px] text-slate-400 mt-1">
            {isAr
              ? 'إرفاق رابط فيديو محدد يسمح بتوجيه الزوار والجمهور المتابع بصفتك كفيلاً نحو هذا المحتوى مباشرة.'
              : 'Attaching a specific video link directs audience visits toward this content.'}
          </p>
        </div>

        {/* Guidance Text */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <MessageSquare className="w-4 h-4 text-purple-400" />
            <span>{isAr ? 'نص التوجيه الإنساني والتطويري أحادي الاتجاه:' : 'One-Way Guidance Statement:'}</span>
          </label>
          <textarea
            rows={4}
            value={guidanceText}
            onChange={(e) => setGuidanceText(e.target.value)}
            placeholder={
              isAr
                ? 'اكتب نصائحك، أو توجيهك الفني أو المعنوي لصناع محتوى هذه القناة...'
                : 'Write technical or moral guidance for this channel creator...'
            }
            className="w-full bg-slate-950 text-slate-100 text-base md:text-xs rounded-xl p-4 border border-slate-800 focus:border-purple-500 outline-none transition leading-relaxed touch-manipulation"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs md:text-sm px-6 py-3.5 rounded-xl shadow-xl transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto min-h-[44px] touch-manipulation"
        >
          <Send className="w-4 h-4" />
          <span>{isAr ? 'إرسال التوجيه وتفعيل الدفعة المرورية' : 'Dispatch Guidance & Activate Traffic Boost'}</span>
        </button>
      </form>
    </div>
  );
};

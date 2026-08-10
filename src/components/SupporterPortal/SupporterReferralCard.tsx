import React, { useState, useCallback } from 'react';
import { Users, Share2, UserPlus, Sparkles, Check } from 'lucide-react';

interface SupporterReferralCardProps {
  isAr: boolean;
  onNominateClick: () => void;
}

export const SupporterReferralCard: React.FC<SupporterReferralCardProps> = React.memo(({
  isAr,
  onNominateClick,
}) => {
  const [copied, setCopied] = useState(false);

  const platformUrl = typeof window !== 'undefined' ? window.origin : 'https://noor-alamani.app';

  const handleShare = useCallback(async () => {
    const shareData = {
      title: isAr ? 'منصة نور الأماني - مرجعية الكفالة الميدانية' : 'Noor Al-Amani Platform',
      text: isAr 
        ? 'انضم إلينا كداعم ميداني في منصة نور الأماني، وساهم في كفالة الحقيقة ودعم القنوات الميدانية المعتمدة.'
        : 'Join us as a field supporter in Noor Al-Amani platform and empower trusted field channels.',
      url: platformUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error in Noor Al-Amani Module:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(platformUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error("Error in Noor Al-Amani Module:", err);
      }
    }
  }, [isAr, platformUrl]);

  return (
    <div className="w-full bg-slate-900/90 border border-amber-500/30 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
      {/* Background glow effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
        {/* Header & Humanitarian Role Description */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
            <Users className="w-6 h-6 text-amber-400" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base md:text-lg font-black text-white flex items-center gap-2">
              <span>{isAr ? 'توسيع شبكة الكفلاء ودعم الأحرار' : 'Expand Supporter Network'}</span>
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            </h3>
            {/* الدور الإنساني بسطر صغير */}
            <p className="text-xs text-amber-300/90 font-medium leading-relaxed max-w-xl">
              {isAr
                ? 'شارك أمانة الدعم الإنساني مع أحرار العالم لتوسيع مظلة كفالة الحقيقة ونصرة القنوات الميدانية المعتمدة.'
                : 'Share the humanitarian trust with free minds worldwide to expand field channel empowerment.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* زر ترشيح داعم */}
          <button
            type="button"
            onClick={onNominateClick}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-500/40 text-xs font-bold px-4 py-3 rounded-xl transition shadow-md active:scale-95 cursor-pointer min-h-[44px] touch-manipulation"
          >
            <UserPlus className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{isAr ? 'رشح داعماً جديداً' : 'Nominate Supporter'}</span>
          </button>

          {/* زر مشاركة الرابط عالمياً */}
          <button
            type="button"
            onClick={handleShare}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-5 py-3 rounded-xl transition shadow-lg active:scale-95 cursor-pointer min-h-[44px] touch-manipulation"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-slate-950 shrink-0" />
                <span>{isAr ? 'تم نسخ الرابط!' : 'Link Copied!'}</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-slate-950 shrink-0" />
                <span>{isAr ? 'مشاركة المنصة عالمياً' : 'Share Globally'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});

SupporterReferralCard.displayName = 'SupporterReferralCard';

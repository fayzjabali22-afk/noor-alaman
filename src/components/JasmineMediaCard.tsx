import React, { useState } from 'react';
import { JasmineCelebrity, Language } from '../types';
import { parseAndValidateJasmineVideo, JasmineVideoArchiveItem } from '../services/jasmineService';
import {
  Award,
  Copy,
  Check,
  ShieldCheck,
  X,
  ArrowUpRight,
  ShieldAlert,
  Youtube,
} from 'lucide-react';

export interface JasmineMediaCardProps {
  /** Full item when rendered from JasmineSectorView */
  item?: JasmineCelebrity;
  lang?: Language;
  onCopyLink?: (id: string, link: string) => void;
  copiedId?: string | null;
  archiveHistory?: JasmineVideoArchiveItem[];

  /** Direct simple props when used as a standalone Dumb UI component */
  title?: string;
  embedUrl?: string;
  platformName?: string;
  creatorName?: string;
  fallbackUrl?: string;
  isGhostMode?: boolean;

  // Legacy optional handlers kept for interface compatibility
  onOpenUpdateModal?: (item: JasmineCelebrity) => void;
  onUpdateLink?: (id: string, newUrl: string) => void;
  onOpenGuidanceModal?: (item?: JasmineCelebrity) => void;
}

/**
 * JasmineMediaCard (مكون كارت لوحة الشرف ودرع الخروج السيادي لقطاع الياسمين)
 * Pure Presentational / Dumb UI Component rendering celebrity honor cards
 * and opening a zero-bandwidth Outbound Guard Modal with direct redirection to official YouTube channels.
 * Compliant with NA-DUMB-UI-CONSTRAINT-001 & NA-SOVEREIGN-ORDER-060.
 */
export const JasmineMediaCard: React.FC<JasmineMediaCardProps> = React.memo(({
  item,
  lang = 'ar',
  onCopyLink,
  copiedId,
  title,
  embedUrl,
  platformName,
  creatorName,
  fallbackUrl,
}) => {
  const isAr = lang === 'ar';
  const [isGuardModalOpen, setIsGuardModalOpen] = useState<boolean>(false);

  // Derive display values
  const effectiveCreatorName = item?.celebrityName || creatorName || (isAr ? 'داعم إنساني' : 'Humanitarian Supporter');
  const effectiveTitleRole = item?.titleRole || (isAr ? 'صانع محتوى / شخصية عامة' : 'Public Figure');
  const effectiveAvatar = item?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const effectiveStatement = item?.humanitarianStatement || title || (isAr ? 'رسالة دعم لمبادرة إنسانية بقطاع الياسمين' : 'Endorsement message in Jasmine Sector');
  const effectiveVideoUrl = item?.videoUrl || fallbackUrl || embedUrl || 'https://www.youtube.com';
  const effectiveBioLink = item?.sharedReferenceBioLink || effectiveVideoUrl;
  const effectiveEndorsedCampaign = item?.endorsedCampaign || (isAr ? 'قناة ميدانية معتمدة' : 'Verified Field Channel');

  const parsedVideo = parseAndValidateJasmineVideo(effectiveVideoUrl);
  const activePlatform = platformName || parsedVideo.platform || 'YouTube';

  // Video Thumbnail representation
  const thumbnailImage =
    item?.videoThumbnail ||
    (parsedVideo.platform === 'YouTube' && parsedVideo.videoId
      ? `https://img.youtube.com/vi/${parsedVideo.videoId}/hqdefault.jpg`
      : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600');

  return (
    <>
      {/* 1. APP LAUNCHER SUPPORTER HONOR CARD (بطاقة شرف تكريمية) */}
      <div
        onClick={() => setIsGuardModalOpen(true)}
        className="flex flex-col items-center justify-between text-center cursor-pointer select-none group p-3.5 sm:p-4 rounded-3xl bg-gradient-to-b from-emerald-950/40 via-slate-900/80 to-amber-950/30 border border-emerald-500/30 hover:border-amber-400/60 transition duration-300 active:scale-95 shadow-xl hover:shadow-emerald-500/10 backdrop-blur-sm h-full relative overflow-hidden"
      >
        {/* Sovereign Top Emerald-Gold Accent Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500 opacity-80 group-hover:opacity-100 transition duration-300"></div>

        {/* Top Header Status Badges (شارات الحالة للتكريم البصري) */}
        <div className="w-full flex items-center justify-between gap-1 mb-2.5 pt-0.5">
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full shadow-xs">
            <ShieldCheck className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{isAr ? 'موثق' : 'Verified'}</span>
          </span>

          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full shadow-xs">
            <Award className="w-3 h-3 text-amber-400 shrink-0" />
            <span>{isAr ? 'بطاقة شرف' : 'Honor Card'}</span>
          </span>
        </div>

        {/* Supporter Avatar Icon with Emerald/Gold Ring */}
        <div className="relative my-1">
          <div className="absolute -inset-1.5 bg-gradient-to-r from-emerald-500/40 via-amber-400/50 to-emerald-500/40 rounded-full blur-xs opacity-70 group-hover:opacity-100 transition duration-300"></div>
          <img
            src={effectiveAvatar}
            alt={effectiveCreatorName}
            className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-amber-400/90 shadow-lg group-hover:scale-105 group-hover:border-emerald-300 transition duration-300 shrink-0"
          />
          {(item?.verifiedBadge ?? true) && (
            <div
              className="absolute -bottom-1 -right-1 bg-slate-950 text-amber-400 p-1 rounded-full border border-amber-400 shadow-md"
              title={isAr ? 'حساب شخصية موثق' : 'Verified Supporter'}
            >
              <Award className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            </div>
          )}
        </div>

        {/* Name Label */}
        <span
          className="text-xs sm:text-sm font-black text-slate-100 group-hover:text-amber-300 text-center w-full truncate px-0.5 transition mt-1"
          title={effectiveCreatorName}
        >
          {effectiveCreatorName}
        </span>

        {/* Role Subtitle */}
        <span
          className="text-[10px] sm:text-xs text-amber-300/90 font-bold text-center w-full truncate px-0.5 mt-0.5"
          title={effectiveTitleRole}
        >
          {effectiveTitleRole}
        </span>

        {/* Endorsed Campaign Pill */}
        <div className="mt-2.5 text-[10px] font-bold text-emerald-300/90 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-1 rounded-xl w-full truncate flex items-center justify-center gap-1 shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
          <span className="truncate">{effectiveEndorsedCampaign}</span>
        </div>
      </div>

      {/* 2. OUTBOUND GUARD MODAL SHEET (نافذة درع الخروج والتوثيق السيادي للمنصة الرسمية) */}
      {isGuardModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div
            className="bg-slate-900 border border-amber-500/50 rounded-3xl p-5 sm:p-6 max-w-lg w-full space-y-4 shadow-2xl relative my-6 text-right dir-rtl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3.5">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={effectiveAvatar}
                    alt={effectiveCreatorName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-amber-400 shadow-md"
                  />
                  {(item?.verifiedBadge ?? true) && (
                    <div className="absolute -bottom-1 -right-1 bg-slate-950 text-amber-400 p-0.5 rounded-full border border-amber-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="text-base font-black text-white flex items-center gap-1.5">
                    <span>{effectiveCreatorName}</span>
                  </h3>
                  <p className="text-xs font-bold text-amber-300">{effectiveTitleRole}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsGuardModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title={isAr ? 'إغلاق النافذة' : 'Close Modal'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="space-y-4">
              {/* Channel / Campaign Banner Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-video bg-slate-950 shadow-inner group">
                <img
                  src={thumbnailImage}
                  alt={effectiveCreatorName}
                  className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-transparent flex flex-col justify-end p-3.5 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-red-600/90 text-white text-[10px] font-extrabold flex items-center gap-1 shadow">
                      <Youtube className="w-3 h-3 text-white fill-white" />
                      <span>{activePlatform}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-extrabold">
                      {isAr ? 'قناة مكفولة موثقة' : 'Adopted Channel'}
                    </span>
                  </div>
                  <h4 className="text-xs font-extrabold text-white truncate">
                    {effectiveEndorsedCampaign}
                  </h4>
                </div>
              </div>

              {/* Humanitarian Statement Quote */}
              <blockquote className="text-xs text-slate-200 leading-relaxed bg-slate-950/80 p-3.5 rounded-2xl border border-slate-800 italic shadow-inner">
                <span className="text-amber-400 font-bold not-italic block mb-1 text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isAr ? 'البيان الإنساني المعتمد:' : 'Humanitarian Statement:'}</span>
                </span>
                "{effectiveStatement}"
              </blockquote>

              {/* Sovereign Outbound Guard Notice */}
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-3 flex items-start gap-2.5 text-xs text-amber-200">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="leading-relaxed text-[11px] font-medium">
                  {isAr
                    ? 'درع الخروج والتوثيق السيادي: سيتم تحويلك فوراً بأمان وبكلفة صفرية لمتابعة القناة الرسمية والمحتوى الأصلي على YouTube.'
                    : 'Sovereign Outbound Guard: You will be redirected safely with zero overhead to view the official channel on YouTube.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* Primary YouTube Redirect Button */}
                <a
                  href={effectiveVideoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-red-600/20 transition cursor-pointer active:scale-95 border border-red-400/30 min-h-[44px]"
                >
                  <Youtube className="w-5 h-5 text-white fill-white" />
                  <span>{isAr ? 'الانتقال إلى القناة الرسمية على YouTube' : 'Go to Official YouTube Channel'}</span>
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </a>

                {/* Secondary Reference Link Copy Button */}
                <div className="flex items-center justify-between gap-2 text-xs pt-1">
                  <span className="font-mono text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-[10px] truncate flex-1">
                    {effectiveBioLink}
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      if (onCopyLink && item) {
                        onCopyLink(item.id, effectiveBioLink);
                      } else if (navigator.clipboard) {
                        navigator.clipboard.writeText(effectiveBioLink);
                      }
                    }}
                    className="bg-slate-950 hover:bg-slate-850 text-amber-300 px-3 py-2 rounded-xl font-bold border border-amber-500/30 transition flex items-center gap-1.5 shrink-0 cursor-pointer text-[11px] min-h-[40px]"
                  >
                    {copiedId === item?.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isAr ? 'تم النسخ' : 'Copied'}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isAr ? 'نسخ المرجع' : 'Copy Ref'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Supporter Portal Notice Footer */}
              <div className="text-center pt-2 border-t border-slate-800/80">
                <span className="text-[10px] text-slate-400 font-medium">
                  {isAr
                    ? '💡 هل ترغب في كفالة قناة ميدانية أو توثيق حسابك؟ تُدار كافة المعاملات عبر بوابة الداعم.'
                    : '💡 Managed exclusively via Supporter Portal.'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
});

JasmineMediaCard.displayName = 'JasmineMediaCard';

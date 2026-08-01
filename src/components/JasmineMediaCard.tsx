import React, { useState } from 'react';
import { JasmineCelebrity, Language } from '../types';
import { parseAndValidateJasmineVideo, JasmineVideoArchiveItem } from '../services/jasmineService';
import {
  Video,
  Award,
  Copy,
  Check,
  ExternalLink,
  Zap,
  Play,
  RotateCcw,
  Sparkles,
  History,
  ShieldCheck,
  Send,
  MessageSquare,
} from 'lucide-react';

export interface JasmineMediaCardProps {
  /** Full item when rendered from JasmineSectorView */
  item?: JasmineCelebrity;
  lang?: Language;
  onCopyLink?: (id: string, link: string) => void;
  copiedId?: string | null;
  onOpenUpdateModal?: (item: JasmineCelebrity) => void;
  onOpenGuidanceModal?: (item?: JasmineCelebrity) => void;
  archiveHistory?: JasmineVideoArchiveItem[];

  /** Direct simple props when used as a standalone Dumb UI component */
  title?: string;
  embedUrl?: string;
  platformName?: string;
  creatorName?: string;
  fallbackUrl?: string;
}

/**
 * JasmineMediaCard (مكون كارت الوسائط المدمج لقطاع الياسمين بكلفة صفرية)
 * Pure Presentational / Dumb UI Component rendering embedded responsive iFrame videos
 * directly from YouTube / TikTok / Instagram / Facebook / X / Vimeo without server video streaming or cloud costs.
 * Compliant with NA-DUMB-UI-CONSTRAINT-001 & Protocol 88.
 */
export const JasmineMediaCard: React.FC<JasmineMediaCardProps> = ({
  item,
  lang = 'ar',
  onCopyLink,
  copiedId,
  onOpenUpdateModal,
  onOpenGuidanceModal,
  archiveHistory = [],
  title,
  embedUrl,
  platformName,
  creatorName,
  fallbackUrl,
}) => {
  const isAr = lang === 'ar';
  const [isPlayingEmbedded, setIsPlayingEmbedded] = useState<boolean>(false);
  const [showArchiveModal, setShowArchiveModal] = useState<boolean>(false);

  // Derive display values from either full item or direct standalone props
  const effectiveCreatorName = item?.celebrityName || creatorName || (isAr ? 'داعم إنساني' : 'Humanitarian Supporter');
  const effectiveTitleRole = item?.titleRole || (isAr ? 'صانع محتوى / شخصية عامة' : 'Public Figure');
  const effectiveAvatar = item?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const effectiveStatement = item?.humanitarianStatement || title || (isAr ? 'رسالة دعم لمبادرة إنسانية بقطاع الياسمين' : 'Endorsement message in Jasmine Sector');
  const effectiveVideoUrl = item?.videoUrl || fallbackUrl || embedUrl || '';
  const effectiveBioLink = item?.sharedReferenceBioLink || effectiveVideoUrl;

  // Parse raw video URL to generate zero-bandwidth embedded player URL
  const parsedVideo = parseAndValidateJasmineVideo(effectiveVideoUrl);
  const activeEmbedUrl = embedUrl || parsedVideo.embedUrl;
  const activePlatform = platformName || parsedVideo.platform || 'Media';
  const activeFallbackUrl = fallbackUrl || parsedVideo.fallbackUrl || effectiveVideoUrl;

  const getPlatformColor = (platform?: string) => {
    switch (platform) {
      case 'YouTube':
        return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'TikTok':
        return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20';
      case 'Instagram':
        return 'text-pink-400 bg-pink-500/10 border-pink-500/20';
      default:
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-xl transition flex flex-col justify-between">
      <div className="space-y-4">
        {/* Header: Public Figure Info & Verification Badge */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={effectiveAvatar}
              alt={effectiveCreatorName}
              className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/50 shadow-md shrink-0"
            />
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <span>{effectiveCreatorName}</span>
                {(item?.verifiedBadge ?? true) && (
                  <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" title={isAr ? 'حساب شخصية موثق' : 'Verified Figure'} />
                )}
              </h3>
              <p className="text-xs text-amber-300/80 font-medium">{effectiveTitleRole}</p>
            </div>
          </div>

          {/* Platform Badge */}
          {activePlatform && (
            <span
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border flex items-center gap-1 ${getPlatformColor(
                activePlatform
              )}`}
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>{activePlatform}</span>
            </span>
          )}
        </div>

        {/* Embedded Responsive iFrame Player / Thumbnail Preview (Zero-Bandwidth) */}
        <div className="relative rounded-xl overflow-hidden border border-slate-800 aspect-video bg-slate-950 group">
          {isPlayingEmbedded || !item ? (
            /* Zero-Cost iFrame Player with Fallback Button */
            <div className="w-full h-full relative group/player">
              <iframe
                src={activeEmbedUrl || 'about:blank'}
                title={effectiveCreatorName}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <div className="absolute top-2 right-2 left-2 flex items-center justify-between pointer-events-none z-10">
                <a
                  href={activeFallbackUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="pointer-events-auto bg-slate-950/90 text-amber-300 hover:text-white px-2.5 py-1 rounded-lg text-[11px] border border-amber-500/30 shadow-md flex items-center gap-1 backdrop-blur"
                  title={isAr ? 'فتح في المنصة المصدر (الرابط البديل)' : 'Open Fallback Link'}
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{isAr ? 'المنصة المصدر' : 'Source'}</span>
                </a>

                {item && (
                  <button
                    onClick={() => setIsPlayingEmbedded(false)}
                    className="pointer-events-auto bg-slate-950/90 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg text-[11px] border border-slate-700 shadow-md flex items-center gap-1 backdrop-blur"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{isAr ? 'إغلاق البث' : 'Close Player'}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Thumbnail Preview with Embedded Trigger & External Link */
            <>
              <img
                src={item.videoThumbnail}
                alt={effectiveCreatorName}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col items-center justify-center gap-3 p-4">
                {/* Play Embedded Trigger Button */}
                {parsedVideo.isValid ? (
                  <button
                    onClick={() => setIsPlayingEmbedded(true)}
                    className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition group/btn"
                    title={isAr ? 'تشغيل الممر المدمج (كلفة صفرية)' : 'Play Embedded Player (Zero Cost)'}
                  >
                    <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                  </button>
                ) : (
                  <a
                    href={effectiveVideoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-12 h-12 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition"
                  >
                    <Video className="w-6 h-6 fill-slate-950" />
                  </a>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-white bg-slate-900/90 px-3 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 shadow">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'مشغّل مدمج بكلفة صفرية' : 'Zero-Cost Embedded Stream'}</span>
                  </span>
                </div>
              </div>

              {/* Endorsed Campaign Title Tag */}
              <div className="absolute bottom-2 right-2 left-2 bg-slate-950/90 backdrop-blur px-3 py-1.5 rounded-lg text-[11px] text-amber-300 font-medium border border-amber-500/20 flex items-center justify-between">
                <span className="truncate">{item.endorsedCampaign}</span>
                <a
                  href={effectiveVideoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-slate-400 hover:text-white flex items-center gap-1 shrink-0 mr-1"
                  title={isAr ? 'فتح في المنصة الأصلية' : 'Open in Original Platform'}
                >
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </>
          )}
        </div>

        {/* Humanitarian Statement */}
        <blockquote className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 italic">
          "{effectiveStatement}"
        </blockquote>
      </div>

      {/* Footer: Bio Link, Copy Action, and Archive History Trigger */}
      <div className="pt-3 border-t border-slate-800 space-y-3">
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="font-mono text-slate-400 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px] truncate flex-1">
            {effectiveBioLink}
          </div>

          <button
            onClick={() => {
              if (onCopyLink && item) {
                onCopyLink(item.id, effectiveBioLink);
              } else {
                navigator.clipboard.writeText(effectiveBioLink);
              }
            }}
            className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl font-bold border border-amber-500/30 transition flex items-center gap-1.5 shrink-0"
          >
            {copiedId === item?.id ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'تم النسخ' : 'Copied'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'نسخ الرابط المرجعي' : 'Copy Bio Link'}</span>
              </>
            )}
          </button>
        </div>

        {/* Action Toolbar for Verified Creator Update & Historical Archive & One-Way Guidance */}
        <div className="flex items-center justify-between pt-1 text-[11px] text-slate-400">
          <span className="text-slate-500 font-mono">{item?.date || new Date().toISOString().split('T')[0]}</span>

          <div className="flex items-center gap-2">
            {onOpenGuidanceModal && (
              <button
                onClick={() => onOpenGuidanceModal(item)}
                className="text-purple-300 hover:text-purple-200 font-semibold flex items-center gap-1 transition bg-purple-500/10 hover:bg-purple-500/20 px-2.5 py-1 rounded-lg border border-purple-500/30"
                title={isAr ? 'نظام التواصل الهجين أحادي الاتجاه' : 'One-Way Guidance System'}
              >
                <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                <span>{isAr ? 'توجيه أحادي' : 'One-Way Guidance'}</span>
              </button>
            )}

            {archiveHistory.length > 0 && (
              <button
                onClick={() => setShowArchiveModal(!showArchiveModal)}
                className="text-slate-400 hover:text-amber-300 flex items-center gap-1 transition"
              >
                <History className="w-3.5 h-3.5" />
                <span>
                  {isAr ? 'سجل الروابط' : 'History'} ({archiveHistory.length})
                </span>
              </button>
            )}

            {onOpenUpdateModal && (
              <button
                onClick={() => onOpenUpdateModal(item)}
                className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 transition bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20"
              >
                <RotateCcw className="w-3 h-3" />
                <span>{isAr ? 'تحديث' : 'Update'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Historical Video Archive Drawer */}
        {showArchiveModal && archiveHistory.length > 0 && (
          <div className="mt-2 p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
            <h4 className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
              <History className="w-3.5 h-3.5" />
              <span>{isAr ? 'أرشيف الروابط التاريخية الموثقة' : 'Archived Video Links'}</span>
            </h4>
            <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
              {archiveHistory.map((arch) => (
                <div
                  key={arch.id}
                  className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-800/80 text-[11px]"
                >
                  <span className="truncate text-slate-300 font-mono max-w-[180px]">{arch.rawUrl}</span>
                  <span className="text-slate-500 text-[10px]">{arch.submissionDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

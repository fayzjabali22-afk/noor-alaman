import React, { useState, useMemo } from 'react';
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
  RefreshCw,
  AlertCircle,
  Link as LinkIcon,
  X,
  Eye,
  Globe,
} from 'lucide-react';

/**
 * ثابِت التعبير النمطي السيادي لتدقيق الروابط المرجعية
 */
export const SOVEREIGN_MEDIA_URL_REGEX =
  /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;

/**
 * فحص صلاحية صيغة الرابط قبل تفويض الحدث
 */
export const isValidSovereignUrl = (url: string): boolean => {
  if (!url || !url.trim()) return false;
  return SOVEREIGN_MEDIA_URL_REGEX.test(url.trim());
};

export interface JasmineMediaCardProps {
  /** Full item when rendered from JasmineSectorView */
  item?: JasmineCelebrity;
  lang?: Language;
  onCopyLink?: (id: string, link: string) => void;
  copiedId?: string | null;
  onOpenUpdateModal?: (item: JasmineCelebrity) => void;
  onUpdateLink?: (id: string, newUrl: string) => void;
  onOpenGuidanceModal?: (item?: JasmineCelebrity) => void;
  archiveHistory?: JasmineVideoArchiveItem[];

  /** Direct simple props when used as a standalone Dumb UI component */
  title?: string;
  embedUrl?: string;
  platformName?: string;
  creatorName?: string;
  fallbackUrl?: string;
  isGhostMode?: boolean;
}

/**
 * JasmineMediaCard (مكون كارت الوسائط المدمج لقطاع الياسمين بكلفة صفرية)
 * Pure Presentational / Dumb UI Component rendering embedded responsive iFrame videos
 * directly from YouTube / TikTok / Instagram / Facebook / X / Vimeo without server video streaming or cloud costs.
 * Compliant with NA-DUMB-UI-CONSTRAINT-001 & Protocol 88.
 */
export const JasmineMediaCard: React.FC<JasmineMediaCardProps> = React.memo(({
  item,
  lang = 'ar',
  onCopyLink,
  copiedId,
  onOpenUpdateModal,
  onUpdateLink,
  onOpenGuidanceModal,
  archiveHistory = [],
  title,
  embedUrl,
  platformName,
  creatorName,
  fallbackUrl,
}) => {
  const isAr = lang === 'ar';
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isPlayingEmbedded, setIsPlayingEmbedded] = useState<boolean>(false);
  const [showArchiveModal, setShowArchiveModal] = useState<boolean>(false);
  const [isInlineEditing, setIsInlineEditing] = useState<boolean>(false);
  const [inputUrl, setInputUrl] = useState<string>('');

  // Derived URL validation state for instant visual feedback
  const isUrlValid = useMemo(() => {
    return isValidSovereignUrl(inputUrl);
  }, [inputUrl]);

  const isInputTouchedAndInvalid = inputUrl.trim().length > 0 && !isUrlValid;

  const handleConfirmReplacement = () => {
    if (!isUrlValid || (!onUpdateLink && !onOpenUpdateModal)) return;

    if (onUpdateLink && item) {
      onUpdateLink(item.id, inputUrl.trim());
    } else if (onOpenUpdateModal && item) {
      onOpenUpdateModal({ ...item, videoUrl: inputUrl.trim() });
    }

    setInputUrl('');
    setIsInlineEditing(false);
  };

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
    <>
      {/* 1. APP LAUNCHER SUPPORTER ICON (مكون الأيقونة المنظم المصمم بأسلوب مجلد التطبيقات) */}
      <div
        onClick={() => setIsDetailModalOpen(true)}
        className="flex flex-col items-center justify-center text-center cursor-pointer select-none group p-2 sm:p-2.5 rounded-2xl hover:bg-slate-800/40 transition duration-200"
      >
        {/* Supporter Avatar Icon */}
        <div className="relative">
          <div className="absolute -inset-1 bg-gradient-to-tr from-amber-500/50 via-emerald-400/40 to-amber-300/50 rounded-full blur-xs opacity-0 group-hover:opacity-100 transition duration-300"></div>
          <img
            src={effectiveAvatar}
            alt={effectiveCreatorName}
            className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-amber-400/80 shadow-md group-hover:scale-105 group-hover:border-amber-300 transition duration-200 shrink-0"
          />
          {(item?.verifiedBadge ?? true) && (
            <div
              className="absolute -bottom-0.5 -right-0.5 bg-slate-950 text-amber-400 p-0.5 rounded-full border border-amber-400 shadow-sm"
              title={isAr ? 'حساب شخصية موثق' : 'Verified Supporter'}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            </div>
          )}
        </div>

        {/* Truncated Name Label */}
        <span
          className="text-xs font-medium text-slate-200 group-hover:text-amber-300 mt-2 text-center w-full truncate px-0.5 transition"
          title={effectiveCreatorName}
        >
          {effectiveCreatorName}
        </span>
      </div>

      {/* 2. SOVEREIGN DETAIL MODAL SHEET (نافذة العرض والتفاعل التفصيلية المكتملة) */}
      {isDetailModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div
            className="bg-slate-900 border border-amber-500/40 rounded-3xl p-5 sm:p-7 max-w-xl w-full space-y-5 shadow-2xl relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
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
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setIsPlayingEmbedded(false);
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                title={isAr ? 'إغلاق النافذة' : 'Close Modal'}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-5">
              {/* Embedded Player / Video Section */}
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 aspect-video bg-slate-950 shadow-inner">
                {isPlayingEmbedded || !item ? (
                  <div className="w-full h-full relative">
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
                  <>
                    <img
                      src={item.videoThumbnail}
                      alt={effectiveCreatorName}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-transparent flex flex-col items-center justify-center gap-3 p-4">
                      {parsedVideo.isValid ? (
                        <button
                          onClick={() => setIsPlayingEmbedded(true)}
                          className="w-12 h-12 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition cursor-pointer"
                          title={isAr ? 'تشغيل الممر المدمج (كلفة صفرية)' : 'Play Embedded Stream'}
                        >
                          <Play className="w-6 h-6 fill-slate-950 ml-0.5" />
                        </button>
                      ) : (
                        <a
                          href={effectiveVideoUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-2xl hover:scale-110 transition"
                        >
                          <Video className="w-6 h-6 fill-slate-950" />
                        </a>
                      )}

                      <span className="text-[11px] font-bold text-white bg-slate-900/90 px-3.5 py-1 rounded-full border border-amber-500/30 flex items-center gap-1.5 shadow">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isAr ? 'مشغّل مدمج بكلفة صفرية' : 'Zero-Cost Stream'}</span>
                      </span>
                    </div>

                    <div className="absolute bottom-2 right-2 left-2 bg-slate-950/90 backdrop-blur px-3 py-1.5 rounded-xl text-[11px] text-amber-300 font-bold border border-amber-500/20 flex items-center justify-between">
                      <span className="truncate">{item.endorsedCampaign}</span>
                      <a
                        href={effectiveVideoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-400 hover:text-white flex items-center gap-1 shrink-0 mr-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </>
                )}
              </div>

              {/* Humanitarian Statement Quote */}
              <blockquote className="text-xs sm:text-sm text-slate-200 leading-relaxed bg-slate-950/90 p-4 rounded-2xl border border-slate-800 italic shadow-inner">
                <span className="text-amber-400 font-bold not-italic block mb-1 text-[10px] uppercase tracking-wider">
                  {isAr ? 'البيان الإنساني المعتمد:' : 'Humanitarian Statement:'}
                </span>
                "{effectiveStatement}"
              </blockquote>

              {/* Bio Link & Copy Action */}
              <div className="flex items-center justify-between gap-2 text-xs">
                <div className="font-mono text-slate-400 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-[11px] truncate flex-1">
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
                  className="bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 px-3.5 py-2 rounded-xl font-bold border border-amber-500/30 transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {copiedId === item?.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{isAr ? 'تم النسخ' : 'Copied'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-amber-400" />
                      <span>{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sovereign Toolbar Actions */}
              <div className="flex items-center justify-between gap-2 pt-1 text-[11px]">
                <span className="text-slate-500 font-mono text-[10px]">{item?.date || new Date().toISOString().split('T')[0]}</span>

                <div className="flex items-center gap-2">
                  {onOpenGuidanceModal && item && (
                    <button
                      onClick={() => {
                        setIsDetailModalOpen(false);
                        onOpenGuidanceModal(item);
                      }}
                      className="text-purple-300 hover:text-purple-200 font-bold flex items-center gap-1 transition bg-purple-950/60 px-3 py-1.5 rounded-xl border border-purple-500/30 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5 text-purple-400" />
                      <span>{isAr ? 'توجيه' : 'Guidance'}</span>
                    </button>
                  )}

                  {archiveHistory.length > 0 && (
                    <button
                      onClick={() => setShowArchiveModal(!showArchiveModal)}
                      className="text-slate-400 hover:text-amber-300 flex items-center gap-1 transition bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>
                        {isAr ? 'الأرشيف' : 'Archive'} ({archiveHistory.length})
                      </span>
                    </button>
                  )}

                  {(onOpenUpdateModal || onUpdateLink) && (
                    <button
                      onClick={() => {
                        if (onOpenUpdateModal && item) {
                          setIsDetailModalOpen(false);
                          onOpenUpdateModal(item);
                        } else {
                          setIsInlineEditing(!isInlineEditing);
                          if (!inputUrl && effectiveVideoUrl) {
                            setInputUrl(effectiveVideoUrl);
                          }
                        }
                      }}
                      className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1 transition bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20 cursor-pointer"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>{isAr ? 'تحديث' : 'Update'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Inline Editing in Modal */}
              {isInlineEditing && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={inputUrl}
                      onChange={(e) => setInputUrl(e.target.value)}
                      placeholder={isAr ? 'أدخل رابط التوثيق الجديد' : 'Enter new verification link'}
                      className={`w-full px-3 py-1.5 pl-9 text-xs rounded-lg bg-slate-900 text-slate-100 font-mono border ${
                        isInputTouchedAndInvalid
                          ? 'border-rose-500'
                          : isUrlValid
                          ? 'border-emerald-500'
                          : 'border-slate-700'
                      }`}
                    />
                    <LinkIcon className="absolute left-2.5 w-3.5 h-3.5 text-slate-500" />
                  </div>

                  {isInputTouchedAndInvalid && (
                    <div className="flex items-center gap-1.5 text-[11px] text-rose-400">
                      <AlertCircle className="w-3 h-3 flex-shrink-0" />
                      <span>{isAr ? 'صيغة الرابط غير صالحة' : 'Invalid URL format'}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setIsInlineEditing(false);
                        setInputUrl('');
                      }}
                      className="px-2.5 py-1 text-xs text-slate-400"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>

                    <button
                      type="button"
                      disabled={!isUrlValid}
                      onClick={handleConfirmReplacement}
                      className={`px-3 py-1 text-xs font-medium rounded-lg ${
                        isUrlValid ? 'bg-emerald-600 text-white cursor-pointer' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 inline ml-1" />
                      <span>{isAr ? 'تأكيد' : 'Confirm'}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Archived Links in Modal */}
              {showArchiveModal && archiveHistory.length > 0 && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                  <h4 className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <History className="w-3.5 h-3.5" />
                    <span>{isAr ? 'أرشيف الروابط التاريخية الموثقة' : 'Archived Video Links'}</span>
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto">
                    {archiveHistory.map((arch) => (
                      <div key={arch.id} className="flex items-center justify-between bg-slate-900 p-2 rounded-lg text-[11px]">
                        <span className="truncate text-slate-300 font-mono text-[10px] max-w-[200px]">
                          {arch.rawUrl}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              if (onCopyLink && item) onCopyLink(item.id, arch.rawUrl);
                              else navigator.clipboard.writeText(arch.rawUrl);
                            }}
                            className="text-amber-400 p-1 hover:bg-slate-800 rounded"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <a href={arch.rawUrl} target="_blank" rel="noreferrer" className="text-slate-400 p-1 hover:bg-slate-800 rounded">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
});

JasmineMediaCard.displayName = 'JasmineMediaCard';


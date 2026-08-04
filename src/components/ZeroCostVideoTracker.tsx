import React, { useState, useRef, useCallback } from 'react';
import { Play, Loader2, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

export interface ZeroCostVideoTrackerProps {
  videoUrl: string;
  title?: string;
  celebrityName?: string;
  thumbnailUrl?: string;
  referralId?: string;
  telemetryEndpoint?: string;
  onTrackerClick?: (url: string) => void;
  onTrackClick?: (referralId: string) => void;
  platformName?: string;
  isAr?: boolean;
  className?: string;
}

/**
 * ZeroCostVideoTracker Component
 * Compliant with Protocol 88 (Zero-Waste) & NA-DUMB-UI-CONSTRAINT-001
 * Uses Zero-Cost Telemetry Bridge (navigator.sendBeacon) for instant redirection & click tracking without heavy iFrame overhead.
 * Structures the One-Way Guidance button inside Capsule 3 as a prominent, dedicated full-width CTA.
 * [الأمر السيادي رقم 55.55]
 */
export const ZeroCostVideoTracker: React.FC<ZeroCostVideoTrackerProps> = ({
  videoUrl,
  title,
  celebrityName,
  thumbnailUrl,
  referralId,
  telemetryEndpoint = '/api/telemetry/track-click',
  onTrackerClick,
  onTrackClick,
  platformName = 'Media',
  isAr = true,
  className = '',
}) => {
  // 1. القفل التزامني اللحظي لمنع تكرار الإشارات على مستوى الذاكرة
  const clickLockRef = useRef<boolean>(false);

  // 2. الحالة البصرية لمؤشر التحميل والتعطيل المؤقت
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const displayTitle =
    title ||
    (celebrityName
      ? isAr
        ? `رسالة توجيه إنساني ودعم — ${celebrityName}`
        : `Humanitarian Endorsement Message — ${celebrityName}`
      : isAr
      ? 'مشاهدة التوجيه المباشر (Protocol 88)'
      : 'Watch Direct Guidance (Protocol 88)');

  // 3. معالج التوجيه الأحادي الموثق
  const handleSingleRedirect = useCallback(() => {
    // فحص حارس التكرار: إذا كان القفل مفعلاً، يتم تجاهل النقرة فوراً
    if (clickLockRef.current) return;

    // تفعيل القفل اللحظي والحالة البصرية
    clickLockRef.current = true;
    setIsProcessing(true);

    // أ) إرسال إشارة التتبع الصامتة بفرك صفر تكلفة عبر sendBeacon
    try {
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const payload = JSON.stringify({
          url: videoUrl,
          refId: referralId || 'DIRECT_GUIDANCE',
          timestamp: Date.now(),
          protocol: 'PROTOCOL_88',
        });
        const blob = new Blob([payload], { type: 'application/json' });
        navigator.sendBeacon(telemetryEndpoint, blob);
      } else {
        // مسار احتياطي صامت مع keepalive لضمان وصول الإشارة
        fetch(telemetryEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: videoUrl, refId: referralId || 'DIRECT_GUIDANCE', timestamp: Date.now() }),
          keepalive: true,
        }).catch((err) => {
          console.warn('Telemetry beacon warning in Noor Al-Amani:', err);
        });
      }
    } catch (error) {
      console.error('Error in ZeroCostVideoTracker Module:', error);
    }

    // ب) تفويض الحدث الخارجي للمكون الأب إن وجد
    if (onTrackerClick) {
      onTrackerClick(videoUrl);
    }
    if (onTrackClick && referralId) {
      onTrackClick(referralId);
    }

    // ج) التوجيه الفوري للرابط الأصلي في نافذة جديدة بسلامة سيبرانية
    if (typeof window !== 'undefined' && videoUrl) {
      window.open(videoUrl, '_blank', 'noopener,noreferrer');
    }

    // د) تحرير القفل والحالة البصرية بعد انقضاء المهلة السيادية (1500ms)
    setTimeout(() => {
      clickLockRef.current = false;
      setIsProcessing(false);
    }, 1500);
  }, [videoUrl, telemetryEndpoint, referralId, onTrackerClick, onTrackClick]);

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-slate-950 border border-slate-800/80 p-4 space-y-3.5 shadow-xl ${className}`}>
      
      {/* 1️⃣ الكبسولة الأولى: غلاف المقطع والعرض البصري */}
      {thumbnailUrl && (
        <div className="relative h-48 w-full overflow-hidden rounded-xl border border-slate-800/50 group">
          <img
            src={thumbnailUrl}
            alt={displayTitle}
            className={`w-full h-full object-cover transition-all duration-300 ${
              isProcessing ? 'brightness-40 blur-[1px]' : 'group-hover:scale-105'
            }`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
          
          {/* شارة توثيق البروتوكول العائمة */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700/50 text-[10px] font-mono text-emerald-400">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Protocol 88</span>
          </div>

          {platformName && (
            <div className="absolute top-2.5 left-2.5 bg-slate-950/90 border border-amber-500/30 text-amber-300 backdrop-blur-md px-2 py-0.5 rounded-md text-[10px] font-bold flex items-center gap-1 shadow-md">
              <Zap className="w-3 h-3 text-amber-400 fill-current" />
              <span>{platformName}</span>
            </div>
          )}
        </div>
      )}

      {/* 2️⃣ الكبسولة الثانية: البيانات الوصفية والعنوان */}
      <div className="flex flex-col gap-1 px-1">
        <h4 className="text-sm font-bold text-slate-100 line-clamp-2 leading-relaxed">
          {displayTitle}
        </h4>
        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
          • {isAr ? 'التوجيه المباشر صفر التكلفة (Zero-Cost Direct Bridge)' : 'Zero-Cost Direct Bridge'}
        </span>
      </div>

      {/* 3️⃣ الكبسولة الثالثة: زر التوجيه الأحادي الرئيسي (الواضح والبارز أمام المستخدم) */}
      <div className="pt-1">
        <button
          type="button"
          disabled={isProcessing}
          onClick={handleSingleRedirect}
          className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-200 select-none shadow-lg ${
            isProcessing
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 cursor-wait shadow-amber-950/30'
              : 'bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white border border-emerald-500/40 shadow-emerald-950/60 cursor-pointer hover:shadow-emerald-600/20 hover:shadow-xl'
          }`}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-amber-400 flex-shrink-0" />
              <span className="font-mono text-xs tracking-wide">
                {isAr ? 'جاري التوجيه الأحادي الصامت...' : 'Processing Silent Guidance...'}
              </span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current flex-shrink-0 text-white" />
              <span className="text-sm">
                {isAr ? 'مشاهدة المقطع المباشر (توجيه أحادي)' : 'Watch Direct Video (One-Way Guidance)'}
              </span>
              <ExternalLink className="w-3.5 h-3.5 opacity-80 flex-shrink-0" />
            </>
          )}
        </button>
      </div>

    </div>
  );
};


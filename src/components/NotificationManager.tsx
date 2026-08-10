import React, { useState, useEffect } from 'react';
import { Share, PlusSquare, Smartphone, CheckCircle, ShieldAlert, X } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { Language } from '../types';

interface NotificationManagerProps {
  lang: Language;
}

export const NotificationManager: React.FC<NotificationManagerProps> = ({ lang }) => {
  const isAr = lang === 'ar';
  const { permission, requestPermission } = useNotifications();

  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ua = navigator.userAgent || '';
    const isIosDevice =
      /iPad|iPhone|iPod/.test(ua) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

    const standaloneMode =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && (navigator as Navigator & { standalone?: boolean }).standalone === true);

    setIsIOS(isIosDevice);
    setIsStandalone(standaloneMode);
  }, []);

  const handleEnableClick = async () => {
    if (isIOS && !isStandalone) {
      setShowIosGuide(true);
      return;
    }
    await requestPermission();
  };

  if (permission === 'granted') {
    return null; // Zero UI bloat: Hide manager when permission already granted
  }

  return (
    <>
      {/* Non-intrusive Inline Status Pill or Trigger Button */}
      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          onClick={handleEnableClick}
          className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition shadow-md flex items-center gap-1.5 cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>{isAr ? 'تفعيل الإشعارات المباشرة (PWA)' : 'Enable Push Notifications'}</span>
        </button>
      </div>

      {/* iOS Add to Home Screen (A2HS) Guidance Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-3xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-950 border border-emerald-500/30">
                  <Smartphone className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">
                    {isAr ? 'تفعيل الإشعارات على iOS / Safari' : 'Enable Notifications on iOS'}
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    {isAr ? 'متطلبات نظام Apple لتشغيل إشعارات الخلفية' : 'Apple iOS requirement for background push'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowIosGuide(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {isAr
                ? 'تشترط شركة Apple تثبيت التطبيق على الشاشة الرئيسية أولاً لتفعيل استقبال الإشعارات على iPhone:'
                : 'Apple iOS requires adding this app to your Home Screen to enable background notifications:'}
            </p>

            <div className="space-y-2.5 bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs">
              <div className="flex items-center gap-2.5 text-slate-200">
                <div className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 border border-emerald-500/30">
                  1
                </div>
                <span>
                  {isAr ? 'إضغط على زر المشاركة' : 'Tap the Share button'}{' '}
                  <Share className="w-3.5 h-3.5 inline-block text-emerald-400 mx-1" />{' '}
                  {isAr ? 'في أسفل المتصفح' : 'at the bottom of Safari'}
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-200">
                <div className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 border border-emerald-500/30">
                  2
                </div>
                <span>
                  {isAr ? 'اختر "الإضافة إلى الشاشة الرئيسية"' : 'Select "Add to Home Screen"'}{' '}
                  <PlusSquare className="w-3.5 h-3.5 inline-block text-emerald-400 mx-1" />
                </span>
              </div>

              <div className="flex items-center gap-2.5 text-slate-200">
                <div className="w-6 h-6 rounded-lg bg-emerald-950 text-emerald-400 font-bold text-[11px] flex items-center justify-center shrink-0 border border-emerald-500/30">
                  3
                </div>
                <span>
                  {isAr ? 'افتح التطبيق المثبت من الشاشة الرئيسية واضغط "تفعيل"' : 'Open the installed App and tap "Enable"'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIosGuide(false)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs transition cursor-pointer shadow-lg"
            >
              {isAr ? 'فهمت ذلك، إغلاق' : 'Got it, Close'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

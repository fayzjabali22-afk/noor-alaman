import React from 'react';
import { Download, X, Smartphone, Monitor } from 'lucide-react';
import { Language } from '../types';

interface PwaInstallBannerProps {
  isOpen: boolean;
  onClose: () => void;
  onInstall?: () => void;
  lang: Language;
}

export const PwaInstallBanner: React.FC<PwaInstallBannerProps> = ({
  isOpen,
  onClose,
  onInstall,
  lang,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-teal-500/30 rounded-2xl max-w-md w-full p-4 sm:p-6 space-y-4 shadow-2xl relative my-auto mobile-modal-viewport">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-teal-400" />
            <h3 className="text-base font-bold text-white">
              {lang === 'ar' ? 'تثبيت منصة نور الأماني (PWA) ⚡' : 'Install Noor Al-Amani App (PWA)'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
          {lang === 'ar'
            ? 'يمكنك تثبيت منصة نور الأماني كـ Progressive Web App (PWA) مباشرة على هاتفك أو حاسوبك للوصول السريع بدون الحاجة لمتاجر التطبيقات.'
            : 'Install Noor Al-Amani Platform as a Progressive Web App (PWA) directly on Android, iOS, Windows, or macOS.'}
        </p>

        <div className="space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>
              {lang === 'ar'
                ? 'على Android / iOS: اضغط خيارات المتصفح (⋮) واختر "إضافة إلى الشاشة الرئيسية".'
                : 'On Mobile: Tap browser menu and select "Add to Home Screen".'}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
            <Monitor className="w-4 h-4 text-sky-400" />
            <span>
              {lang === 'ar'
                ? 'على الحاسوب: اضغط أيقونة التثبيت ⊕ في شريط العنوان أعلى المتصفح.'
                : 'On Desktop: Click the install icon ⊕ in your browser URL bar.'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          {onInstall && (
            <button
              onClick={onInstall}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-lg border border-emerald-400/20 active:scale-95"
            >
              {lang === 'ar' ? 'تم التثبيت الفعلي (إخفاء دائم)' : 'Confirm Installed'}
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-2.5 rounded-xl text-xs transition border border-slate-700 active:scale-95"
          >
            {lang === 'ar' ? 'إغلاق مؤقت' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};

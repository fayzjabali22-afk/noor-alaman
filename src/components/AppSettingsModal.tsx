import React from 'react';
import {
  X,
  Settings,
  BookOpen,
  Eye,
  Check,
  Globe,
  UserCheck,
  ShieldCheck,
  Sparkles,
  Sliders,
  Moon,
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations } from '../lib/i18n';

/*
  =============================================================================
  [الأمر السيادي رقم 57 - نافذة إعدادات التطبيق ومفتاح وضع القراءة المريح]
  (App Settings & Eye-Care Reading Mode Configuration Modal)
  - مفتاح تبديل "وضع القراءة المريح للعين" لتقليل تشتت الألوان ورفع التباين لقراءة السجلات الطويلة
  - نمط الواجهات العرضية الملتزم بالـ Dumb UI Pattern (مكون يستقبل الـ Props ويمرر الـ Callbacks)
  =============================================================================
*/

interface AppSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isReadingMode: boolean;
  onToggleReadingMode: (active: boolean) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
}

export const AppSettingsModal: React.FC<AppSettingsModalProps> = ({
  isOpen,
  onClose,
  isReadingMode,
  onToggleReadingMode,
  lang,
  setLang,
  role,
  setRole,
}) => {
  if (!isOpen) return null;

  const t = translations[lang];
  const isAr = lang === 'ar';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isAr ? 'إعدادات وتفضيلات التطبيق' : 'App Settings & Preferences'}
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                {isAr ? 'ضبط وضع العرض، القراءة، واللغة والدور الحوكمي' : 'Adjust display, reading mode, language & role'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {/* 1. Reading Mode Toggle (وضع القراءة المريح للعين) */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition ${
                  isReadingMode
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-white">
                      {isAr ? 'وضع القراءة المريح للعين' : 'Comfortable Eye Reading Mode'}
                    </h3>
                    {isReadingMode && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30">
                        {isAr ? 'مُفعّل 📖' : 'Active 📖'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mt-0.5">
                    {isAr
                      ? 'تقليل تشتت الألوان والوهج البصري لتوفير تجربة مريحة وقراءة مرتفعة التباين لسجلات الحوكمة والمقالات الطويلة.'
                      : 'Minimizes color distractions and reduces eye strain for reading governance logs and long articles.'}
                  </p>
                </div>
              </div>

              {/* Toggle Switch */}
              <button
                onClick={() => onToggleReadingMode(!isReadingMode)}
                className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isReadingMode ? 'bg-amber-500' : 'bg-slate-800'
                }`}
              >
                <span className="sr-only">Toggle Reading Mode</span>
                <span
                  className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out flex items-center justify-center ${
                    isReadingMode ? (isAr ? '-translate-x-6' : 'translate-x-6') : 'translate-x-0'
                  }`}
                >
                  {isReadingMode ? (
                    <Check className="w-3.5 h-3.5 text-amber-900 font-bold" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-slate-600" />
                  )}
                </span>
              </button>
            </div>

            {/* Reading Mode Preview */}
            <div className={`mt-3 p-3 rounded-xl border text-xs transition-colors duration-300 ${
              isReadingMode
                ? 'bg-amber-950/20 border-amber-500/30 text-amber-100 font-serif leading-relaxed'
                : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-400" />
                  {isAr ? 'معاينة وضع القراءة:' : 'Reading Mode Preview:'}
                </span>
                <span className="text-[10px] opacity-75">{isAr ? 'تباين هادئ، زيرو وهج' : 'Calm Contrast, Zero Glare'}</span>
              </div>
              <p>
                {isAr
                  ? '«تضمن الحوكمة الرقمية التزام جميع السجلات بمبادئ الشفافية والعدالة بدون أي ألوان مشتتة للانتباه.»'
                  : '"Digital governance ensures all audit logs strictly adhere to transparency and fairness without color distractions."'}
              </p>
            </div>
          </div>

          {/* 2. Language Preferences */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {isAr ? 'لغة العرض والتأطير' : 'Display Language'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'اختر لغة الواجهة والاتجاهات' : 'Select interface language'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[
                { code: 'ar', label: 'العربية' },
                { code: 'en', label: 'English' },
                { code: 'fa', label: 'فارسی' },
                { code: 'ur', label: 'اردو' },
              ].map((item) => (
                <button
                  key={item.code}
                  onClick={() => setLang(item.code as Language)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                    lang === item.code
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-850'
                  }`}
                >
                  {lang === item.code && <Check className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Governance Role Preferences */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800/90 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">
                  {isAr ? 'دور المستخدم الحوكمي' : 'Governance Role'}
                </h3>
                <p className="text-xs text-slate-400">
                  {isAr ? 'تحديد صلاحيات واختصاصات العرض' : 'Select user role & permissions'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              {[
                { r: 'SUPPORTER', labelAr: 'داعم إنساني', labelEn: 'Supporter' },
                { r: 'PUBLISHER', labelAr: 'ناشر إخباري', labelEn: 'Publisher' },
                { r: 'AUDITOR', labelAr: 'موثّق وحوكمة', labelEn: 'Auditor' },
                { r: 'ADMIN', labelAr: 'مدير النظام', labelEn: 'Admin' },
              ].map((item) => (
                <button
                  key={item.r}
                  onClick={() => setRole(item.r as UserRole)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-between border ${
                    role === item.r
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  <span>{isAr ? item.labelAr : item.labelEn}</span>
                  {role === item.r && <ShieldCheck className="w-4 h-4 text-indigo-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400 transition shadow-lg shadow-emerald-950/50 flex items-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>{isAr ? 'حفظ وإغلاق التفضيلات' : 'Save & Close'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

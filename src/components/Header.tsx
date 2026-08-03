import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  Globe,
  Radio,
  BookOpen,
  Award,
  BarChart3,
  Bot,
  Settings,
  Home,
  ChevronDown,
  ChevronUp,
  Scale,
  FileText,
  ShieldAlert,
  Compass,
  Eye,
  Check,
} from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations } from '../lib/i18n';

/*
  =============================================================================
  [الأمر السيادي رقم 10.2 - الهيدر ثلاثي الطبقات المكتمل مع مفتاح وضع القراءة]
  (3-Tier Architectural Header Restructuring Directive)
  1. الطبقة الأولى: الهيدر السيادي والتنفيذي (Top Identity & Control Bar)
  2. الطبقة الثانية: المسارات الإنسانية والملاحة المباشرة (Primary Navigation Accordion Layer)
  3. الطبقة الثالثة: الحوكمة والضبط والتحليلات (Governance & Tools Accordion Layer)
  =============================================================================
*/

interface HeaderProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
  setLang: (lang: Language) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isReadingMode: boolean;
  onToggleReadingMode: (active: boolean) => void;
  onOpenSettings: () => void;
  onOpenAiAssistant?: () => void;
  onOpenFocusMode: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
  role,
  setRole,
  isReadingMode,
  onToggleReadingMode,
  onOpenSettings,
  onOpenAiAssistant,
  onOpenFocusMode,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  // Accordion toggle states for Tier 2 and Tier 3 on smaller viewports
  const [isTier2Open, setIsTier2Open] = useState(false);
  const [isTier3Open, setIsTier3Open] = useState(false);
  const [isMobileMoreMenuOpen, setIsMobileMoreMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/90 shadow-2xl">
        {/* 
          =======================================================================
          1️⃣ TIER 1: TOP IDENTITY & SOVEREIGN CONTROL LAYER (الطبقة العليا السيادية)
          =======================================================================
        */}
        <div className="bg-slate-950 px-3 sm:px-4 py-2 sm:py-2.5 border-b border-slate-800/80">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 sm:gap-3">
            {/* Right: Brand & Sovereign Identity */}
            <div className="flex items-center justify-between w-full md:w-auto gap-2 sm:gap-4">
              <div
                onClick={() => setCurrentTab('home')}
                className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
              >
                <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 border border-emerald-400/40 group-hover:scale-105 transition-transform duration-300 shrink-0">
                  <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  <span className="absolute -bottom-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-amber-400 rounded-full border-2 border-slate-950"></span>
                </div>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <h1 className="text-sm sm:text-lg font-black text-white tracking-wide truncate">
                      {t.platformName}
                    </h1>
                    <span className="hidden xs:inline-block text-[9px] sm:text-[10px] font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-800/80 shadow-inner shrink-0">
                      REF
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate max-w-[200px] sm:max-w-none">
                    {isAr ? 'منصة مرجعية حوكمية لا تستضيف الفيديوهات' : 'Governed Non-Hosting Reference Platform'}
                  </p>
                </div>
              </div>

              {/* Mobile Control Triggers */}
              <div className="flex items-center gap-1.5 md:hidden shrink-0">
                <button
                  onClick={() => onToggleReadingMode(!isReadingMode)}
                  className={`p-2 rounded-xl text-xs font-bold border transition flex items-center gap-1 ${
                    isReadingMode
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-900 text-slate-400 border-slate-800'
                  }`}
                  title={isAr ? 'وضع القراءة' : 'Reading Mode'}
                >
                  <BookOpen className="w-4 h-4 text-amber-400" />
                </button>

                <button
                  onClick={onOpenSettings}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  title={isAr ? 'الإعدادات' : 'Settings'}
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Left: Sovereign Control Console (قمرة القيادة والتفضيلات - Desktop) */}
            <div className="hidden md:flex flex-wrap items-center justify-end gap-2.5 w-full md:w-auto">
              <button
                onClick={() => onToggleReadingMode(!isReadingMode)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shadow-sm ${
                  isReadingMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-amber-950/20'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-850'
                }`}
                title={isAr ? 'تفعيل/إلغاء وضع القراءة المريح للعين' : 'Toggle Comfortable Reading Mode'}
              >
                <BookOpen className={`w-3.5 h-3.5 ${isReadingMode ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                <span>{isAr ? 'وضع القراءة' : 'Reading Mode'}</span>
                {isReadingMode && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                )}
              </button>

              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
                <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="bg-transparent text-xs text-slate-300 font-medium focus:outline-none cursor-pointer"
                >
                  <option value="ar" className="bg-slate-900 text-white">العربية (AR)</option>
                  <option value="en" className="bg-slate-900 text-white">English (EN)</option>
                  <option value="fa" className="bg-slate-900 text-white">فارسی (FA)</option>
                  <option value="ur" className="bg-slate-900 text-white">اردو (UR)</option>
                </select>
              </div>

              <button
                onClick={onOpenSettings}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-bold"
              >
                <Settings className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'الإعدادات' : 'Settings'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 
          =======================================================================
          2️⃣ TIER 2 & 3 DESKTOP/HORIZONTAL PILL BAR (شريط الملاحة السريع)
          =======================================================================
        */}
        <div className="bg-slate-900/90 border-b border-slate-800/80 px-3 sm:px-4 py-1.5">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-none py-0.5">
            <nav className="flex items-center gap-1.5 text-xs font-medium shrink-0">
              <button
                onClick={() => setCurrentTab('home')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                  currentTab === 'home'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
              </button>

              <button
                onClick={() => setCurrentTab('core')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                  currentTab === 'core'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Radio className="w-3.5 h-3.5 text-emerald-400" />
                <span>{t.corePlatform}</span>
              </button>

              <button
                onClick={() => setCurrentTab('jasmine')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                  currentTab === 'jasmine'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.jasmineSector}</span>
              </button>

              <button
                onClick={() => setCurrentTab('dalal')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                  currentTab === 'dalal'
                    ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 text-teal-400" />
                <span>{t.dalalSector}</span>
              </button>

              <button
                onClick={() => setCurrentTab('raeda')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                  currentTab === 'raeda'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.raedaSector}</span>
              </button>

              <button
                onClick={() => setCurrentTab('publisher')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                  currentTab === 'publisher'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-purple-400" />
                <span>{isAr ? 'بوابة الناشر' : 'Publisher'}</span>
              </button>

              <button
                onClick={() => setCurrentTab('supporter')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                  currentTab === 'supporter'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>{isAr ? 'بوابة الداعم' : 'Supporter'}</span>
              </button>

              <button
                onClick={() => setCurrentTab('analytics')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                  currentTab === 'analytics'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.analyticsSystem}</span>
              </button>

              <button
                onClick={() => setCurrentTab('admin')}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                  currentTab === 'admin'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                <span>{isAr ? 'الحوكمة والإدارة' : 'Admin'}</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* 
        =======================================================================
        📱 NATIVE PWA MOBILE BOTTOM NAVIGATION BAR (شريط الملاحة السفلية الذكي للهواتف)
        =======================================================================
      */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-slate-800/90 backdrop-blur-2xl px-2 py-1.5 pb-safe flex items-center justify-around shadow-2xl text-[10px] font-bold text-slate-400">
        <button
          onClick={() => setCurrentTab('home')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            currentTab === 'home' ? 'text-emerald-400 font-extrabold' : 'hover:text-slate-200'
          }`}
        >
          <Home className={`w-5 h-5 ${currentTab === 'home' ? 'text-emerald-400 scale-110' : ''}`} />
          <span>{isAr ? 'الرئيسية' : 'Home'}</span>
        </button>

        <button
          onClick={() => setCurrentTab('core')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            currentTab === 'core' ? 'text-emerald-400 font-extrabold' : 'hover:text-slate-200'
          }`}
        >
          <Radio className={`w-5 h-5 ${currentTab === 'core' ? 'text-emerald-400 scale-110' : ''}`} />
          <span>{isAr ? 'المنصة' : 'Core'}</span>
        </button>

        <button
          onClick={() => setCurrentTab('jasmine')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            currentTab === 'jasmine' ? 'text-amber-400 font-extrabold' : 'hover:text-slate-200'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${currentTab === 'jasmine' ? 'text-amber-400 scale-110' : ''}`} />
          <span>{isAr ? 'الياسمين' : 'Jasmine'}</span>
        </button>

        <button
          onClick={() => setCurrentTab('dalal')}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            currentTab === 'dalal' ? 'text-teal-400 font-extrabold' : 'hover:text-slate-200'
          }`}
        >
          <BookOpen className={`w-5 h-5 ${currentTab === 'dalal' ? 'text-teal-400 scale-110' : ''}`} />
          <span>{isAr ? 'دلال' : 'Dalal'}</span>
        </button>

        <button
          onClick={() => setIsMobileMoreMenuOpen(true)}
          className={`flex flex-col items-center gap-1 py-1 px-2 rounded-xl transition ${
            ['raeda', 'publisher', 'supporter', 'analytics', 'admin', 'errors'].includes(currentTab)
              ? 'text-indigo-400 font-extrabold'
              : 'hover:text-slate-200'
          }`}
        >
          <Compass className="w-5 h-5 text-indigo-400" />
          <span>{isAr ? 'المزيد' : 'More'}</span>
        </button>
      </nav>

      {/* Mobile More Options Bottom Sheet Modal */}
      {isMobileMoreMenuOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-end p-0"
          onClick={() => setIsMobileMoreMenuOpen(false)}
        >
          <div
            className="bg-slate-900 border-t border-slate-800 rounded-t-3xl p-5 space-y-4 max-h-[85dvh] overflow-y-auto pb-safe shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">
                  {isAr ? 'قطاعات وبوابات المنصة' : 'Platform Sectors & Portals'}
                </h3>
              </div>
              <button
                onClick={() => setIsMobileMoreMenuOpen(false)}
                className="text-slate-400 hover:text-white p-1 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
              <button
                onClick={() => {
                  setCurrentTab('raeda');
                  setIsMobileMoreMenuOpen(false);
                }}
                className={`p-3 rounded-xl border text-right flex items-center gap-2.5 transition ${
                  currentTab === 'raeda'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <Award className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{t.raedaSector}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('publisher');
                  setIsMobileMoreMenuOpen(false);
                }}
                className={`p-3 rounded-xl border text-right flex items-center gap-2.5 transition ${
                  currentTab === 'publisher'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{isAr ? 'بوابة الناشر' : 'Publisher Portal'}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('supporter');
                  setIsMobileMoreMenuOpen(false);
                }}
                className={`p-3 rounded-xl border text-right flex items-center gap-2.5 transition ${
                  currentTab === 'supporter'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span>{isAr ? 'بوابة الداعم' : 'Supporter Portal'}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('analytics');
                  setIsMobileMoreMenuOpen(false);
                }}
                className={`p-3 rounded-xl border text-right flex items-center gap-2.5 transition ${
                  currentTab === 'analytics'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{t.analyticsSystem}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('admin');
                  setIsMobileMoreMenuOpen(false);
                }}
                className={`p-3 rounded-xl border text-right flex items-center gap-2.5 transition ${
                  currentTab === 'admin'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{isAr ? 'لوحة الإدارة والحوكمة' : 'Admin & Governance'}</span>
              </button>

              <button
                onClick={() => {
                  setCurrentTab('errors');
                  setIsMobileMoreMenuOpen(false);
                }}
                className={`p-3 rounded-xl border text-right flex items-center gap-2.5 transition ${
                  currentTab === 'errors'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <Bot className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'قاموس الأخطاء والحوكمة' : 'Error Dictionary'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};


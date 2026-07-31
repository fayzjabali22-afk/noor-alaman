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
  const [isTier2Open, setIsTier2Open] = useState(true);
  const [isTier3Open, setIsTier3Open] = useState(true);

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/90 shadow-2xl">
      {/* 
        =======================================================================
        1️⃣ TIER 1: TOP IDENTITY & SOVEREIGN CONTROL LAYER (الطبقة العليا السيادية)
        =======================================================================
      */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Right: Brand & Sovereign Identity */}
          <div className="flex items-center justify-between w-full md:w-auto gap-4">
            <div
              onClick={() => setCurrentTab('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 via-teal-600 to-emerald-800 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50 border border-emerald-400/40 group-hover:scale-105 transition-transform duration-300">
                <ShieldCheck className="w-6 h-6 text-white" />
                <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-950"></span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-black text-white tracking-wide">
                    {t.platformName}
                  </h1>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-950/90 text-emerald-400 border border-emerald-800/80 shadow-inner">
                    REF PLATFORM
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full text-[10px] font-semibold border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    {t.gazaPilotBadge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">
                  {isAr ? 'منصة مرجعية حوكمية لا تستضيف الفيديوهات' : 'Governed Non-Hosting Reference Platform'}
                </p>
              </div>
            </div>

            {/* Mobile Control Triggers */}
            <div className="flex items-center gap-2 md:hidden">
              <button
                onClick={() => onToggleReadingMode(!isReadingMode)}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition flex items-center gap-1 ${
                  isReadingMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
                title={isAr ? 'وضع القراءة المريح للعين' : 'Reading Mode'}
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[10px]">{isReadingMode ? (isAr ? 'قراءة 📖' : 'Reading') : (isAr ? 'عادي' : 'Normal')}</span>
              </button>

              <button
                onClick={onOpenSettings}
                className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                title={isAr ? 'الإعدادات' : 'Settings'}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Left: Sovereign Control Console (قمرة القيادة والتفضيلات) */}
          <div className="hidden md:flex flex-wrap items-center justify-end gap-2.5 w-full md:w-auto">
            {/* Direct Reading Mode Toggle Button */}
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

            {/* Language Selector */}
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

            {/* App Settings Modal Button */}
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
        2️⃣ TIER 2: PRIMARY HUMANITARIAN TRACKS BAR (الطبقة الثانية: الملاحة والمسارات المباشرة)
        =======================================================================
      */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 py-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Header Toggle Label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
              <Compass className="w-4 h-4 text-emerald-400" />
            </div>
            <button
              onClick={() => setIsTier2Open(!isTier2Open)}
              className="sm:hidden text-slate-400 hover:text-white p-1"
            >
              {isTier2Open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Items (Tier 2 Accordion Content) */}
          {isTier2Open && (
            <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 sm:py-0 text-xs font-medium">
              <button
                onClick={() => setCurrentTab('home')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                  currentTab === 'raeda'
                    ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-bold shadow-sm'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Award className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.raedaSector}</span>
              </button>
            </nav>
          )}
        </div>
      </div>

      {/* 
        =======================================================================
        3️⃣ TIER 3: GOVERNANCE, ANALYTICS & INTEGRITY BAR (الطبقة الثالثة: الحوكمة والتحليلات والضبط)
        =======================================================================
      */}
      <div className="bg-slate-950/80 px-4 py-1.5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Header Toggle Label */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <Scale className="w-3.5 h-3.5 text-teal-400" />
              <span>{isAr ? 'منظومة الحوكمة والتحليلات والنزاهة:' : 'Governance & Analytics:'}</span>
            </div>
            <button
              onClick={() => setIsTier3Open(!isTier3Open)}
              className="sm:hidden text-slate-400 hover:text-white p-1"
            >
              {isTier3Open ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {/* Governance Items (Tier 3 Accordion Content) */}
          {isTier3Open && (
            <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 sm:py-0 text-xs font-medium">
              <button
                onClick={() => setCurrentTab('analytics')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
                  currentTab === 'analytics'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.analyticsSystem}</span>
              </button>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};


import React, { useState, useEffect } from 'react';
import {
  Compass,
  Award,
  FileText,
  ShieldCheck,
  BarChart3,
  ShieldAlert,
  Bot,
  Home,
  Radio,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { Language } from '../../types';
import { translations } from '../../lib/i18n';
import { SupporterMobileNav } from './SupporterMobileNav';
import { PublisherMobileNav } from './PublisherMobileNav';
import { JasmineMobileNav } from './JasmineMobileNav';
import { AdminMobileNav } from './AdminMobileNav';
import { GeneralMobileNav } from './GeneralMobileNav';

export interface ContextualMobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  lang: Language;
}

export const ContextualMobileNav: React.FC<ContextualMobileNavProps> = ({
  currentTab,
  setCurrentTab,
  lang,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const [isPortalsSheetOpen, setIsPortalsSheetOpen] = useState(false);
  const [supporterActiveTab, setSupporterActiveTab] = useState('overview');

  // Sync with Supporter Portal active tab via event bus (Protocol 43)
  useEffect(() => {
    const handleActiveTab = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setSupporterActiveTab(customEvent.detail);
      }
    };

    window.addEventListener('noor_supporter_active_tab', handleActiveTab);
    return () => {
      window.removeEventListener('noor_supporter_active_tab', handleActiveTab);
    };
  }, []);

  const handleSelectSupporterTab = (tab: string) => {
    setSupporterActiveTab(tab);
    window.dispatchEvent(new CustomEvent('noor_supporter_tab_change', { detail: tab }));
  };

  const handleOpenPortalsSheet = () => {
    setIsPortalsSheetOpen(true);
  };

  const handleNavigatePortal = (tab: string) => {
    setCurrentTab(tab);
    setIsPortalsSheetOpen(false);
  };

  return (
    <>
      {/* 
        =======================================================================
        📱 CONTEXT-AWARE MOBILE NAVIGATION BARS (شريط الملاحة السياقي المعزول للهواتف)
        =======================================================================
      */}
      {currentTab === 'supporter' && (
        <SupporterMobileNav
          activeTab={supporterActiveTab}
          onSelectTab={handleSelectSupporterTab}
          onOpenPortalsSheet={handleOpenPortalsSheet}
          lang={lang}
        />
      )}

      {currentTab === 'publisher' && (
        <PublisherMobileNav
          onOpenPortalsSheet={handleOpenPortalsSheet}
          lang={lang}
        />
      )}

      {currentTab === 'jasmine' && (
        <JasmineMobileNav
          onOpenPortalsSheet={handleOpenPortalsSheet}
          lang={lang}
        />
      )}

      {currentTab === 'admin' && (
        <AdminMobileNav
          onOpenPortalsSheet={handleOpenPortalsSheet}
          lang={lang}
        />
      )}

      {!['supporter', 'publisher', 'jasmine', 'admin'].includes(currentTab) && (
        <GeneralMobileNav
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          onOpenPortalsSheet={handleOpenPortalsSheet}
          lang={lang}
        />
      )}

      {/* 
        =======================================================================
        📂 SECTORS & PORTALS OFF-CANVAS SHEET (القائمة المنزلقة للقطاعات والبوابات)
        =======================================================================
      */}
      {isPortalsSheetOpen && (
        <div
          className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-end p-0 animate-fade-in"
          onClick={() => setIsPortalsSheetOpen(false)}
        >
          <div
            className="bg-slate-900 border-t border-indigo-500/30 rounded-t-3xl p-5 space-y-4 max-h-[85dvh] overflow-y-auto pb-safe shadow-2xl animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-extrabold text-white">
                  {isAr ? 'قائمة القطاعات والبوابات السياقية' : 'Contextual Portals & Sectors'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPortalsSheetOpen(false)}
                className="text-slate-400 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center font-bold text-lg cursor-pointer touch-manipulation active:scale-95"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => handleNavigatePortal('home')}
                className={`p-3.5 rounded-xl border text-right flex items-center gap-2.5 transition min-h-[44px] touch-manipulation active:scale-95 ${
                  currentTab === 'home'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <Home className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isAr ? 'الرئيسية' : 'Home'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigatePortal('core')}
                className={`p-3.5 rounded-xl border text-right flex items-center gap-2.5 transition min-h-[44px] touch-manipulation active:scale-95 ${
                  currentTab === 'core'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <Radio className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{isAr ? 'المنصة' : 'Core Platform'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigatePortal('jasmine')}
                className={`p-3.5 rounded-xl border text-right flex items-center gap-2.5 transition min-h-[44px] touch-manipulation active:scale-95 ${
                  currentTab === 'jasmine'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'قطاع الياسمين' : 'Jasmine Sector'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigatePortal('dalal')}
                className={`p-3.5 rounded-xl border text-right flex items-center gap-2.5 transition min-h-[44px] touch-manipulation active:scale-95 ${
                  currentTab === 'dalal'
                    ? 'bg-teal-500/20 border-teal-500 text-teal-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <BookOpen className="w-4 h-4 text-teal-400 shrink-0" />
                <span>{isAr ? 'قطاع دلال' : 'Dalal Sector'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigatePortal('raeda')}
                className={`p-3.5 rounded-xl border text-right flex items-center gap-2.5 transition min-h-[44px] touch-manipulation active:scale-95 ${
                  currentTab === 'raeda'
                    ? 'bg-indigo-500/20 border-indigo-500 text-indigo-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <Award className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{t.raedaSector}</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigatePortal('publisher')}
                className={`p-3.5 rounded-xl border text-right flex items-center gap-2.5 transition min-h-[44px] touch-manipulation active:scale-95 ${
                  currentTab === 'publisher'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                <span>{isAr ? 'بوابة نداء متابع ودعم المحتوى' : 'Follower Call & Content Support Portal'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigatePortal('supporter')}
                className={`p-3.5 rounded-xl border text-right flex items-center gap-2.5 transition min-h-[44px] touch-manipulation active:scale-95 ${
                  currentTab === 'supporter'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'بوابة التبني' : 'Supporter Portal'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigatePortal('analytics')}
                className={`p-3.5 rounded-xl border text-right flex items-center gap-2.5 transition min-h-[44px] touch-manipulation active:scale-95 ${
                  currentTab === 'analytics'
                    ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <BarChart3 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{t.analyticsSystem}</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigatePortal('admin')}
                className={`p-3.5 rounded-xl border text-right flex items-center gap-2.5 transition min-h-[44px] touch-manipulation active:scale-95 ${
                  currentTab === 'admin'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{isAr ? 'لوحة الإدارة والحوكمة' : 'Admin & Governance'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleNavigatePortal('errors')}
                className={`p-3.5 rounded-xl border text-right flex items-center gap-2.5 transition min-h-[44px] touch-manipulation active:scale-95 ${
                  currentTab === 'errors'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}
              >
                <Bot className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{isAr ? 'قاموس الأخطاء' : 'Error Dictionary'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

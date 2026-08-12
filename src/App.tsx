import React, { useState, useEffect, useMemo } from 'react';
import {
  Publisher,
  JasmineCelebrity,
  DalalTransitionChannel,
  RaedaSuccessArchive,
  VerificationQueueItem,
  ReportItem,
  AuditLog,
  SupporterAction,
  FairEngineWeights,
  Language,
  UserRole,
} from './types';
import {
  initialPublishers,
  initialJasmineCelebrities,
  initialDalalChannels,
  initialRaedaArchive,
  initialVerificationQueue,
  initialReports,
  initialAuditLogs,
} from './data/initialData';
import { defaultFairEngineWeights } from './lib/fairEngine';
import { isRTL } from './lib/i18n';
import { apiAdapter } from './services/apiAdapter';
import { sectorInterconnector } from './services/sectorInterconnector';
import { cronSterilizationService } from './services/cronSterilizationService';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
const HomeScreenView = React.lazy(() => import('./components/HomeScreenView').then(module => ({ default: module.HomeScreenView })));
const CorePlatformView = React.lazy(() => import('./components/CorePlatformView').then(module => ({ default: module.CorePlatformView })));
const JasmineSectorView = React.lazy(() => import('./components/JasmineSectorView').then(module => ({ default: module.JasmineSectorView })));
const DalalSectorView = React.lazy(() => import('./components/DalalSectorView').then(module => ({ default: module.DalalSectorView })));
const RaedaSectorView = React.lazy(() => import('./components/RaedaSectorView').then(module => ({ default: module.RaedaSectorView })));
const PublisherPortalView = React.lazy(() => import('./components/PublisherPortalView').then(module => ({ default: module.PublisherPortalView })));
const SupporterPortalView = React.lazy(() => import('./components/SupporterPortalView').then(module => ({ default: module.SupporterPortalView })));
const AdminPortalView = React.lazy(() => import('./components/AdminPortalView').then(module => ({ default: module.AdminPortalView })));
const AnalyticsView = React.lazy(() => import('./components/AnalyticsView').then(module => ({ default: module.AnalyticsView })));
const HybridImpactView = React.lazy(() => import('./components/HybridImpactView').then(module => ({ default: module.HybridImpactView })));
const ErrorDictionaryExplorer = React.lazy(() => import('./components/ErrorDictionaryExplorer').then(module => ({ default: module.ErrorDictionaryExplorer })));
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { FloatingAIButton } from './components/FloatingAIButton';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { FairEngineConfigModal } from './components/FairEngineConfigModal';
import { FocusedModeView } from './components/FocusedModeView';
import { BlogArticleModal } from './components/BlogArticleModal';
import { SectorErrorBoundary } from './components/common/SectorErrorBoundary';
import { AppSettingsModal } from './components/AppSettingsModal';
import { ContextualMobileNav } from './components/layout/ContextualMobileNav';

export default function App() {
  // State collections with Arterial Persistence (Preventing State Loss)
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('noor_lang');
      return (saved === 'en' || saved === 'ar') ? saved : 'ar';
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      return 'ar';
    }
  });

  const [role, setRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('noor_role');
      return (saved as UserRole) || 'SUPPORTER';
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      return 'SUPPORTER';
    }
  });

  const [isReadingMode, setIsReadingMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('noor_reading_mode') === 'true';
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      return false;
    }
  });

  const [isGhostMode, setIsGhostMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('noor_supporter_ghost_mode') === 'true';
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      return false;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [currentTab, setCurrentTab] = useState<string>(() => {
    try {
      return localStorage.getItem('noor_current_tab') || 'admin';
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      return 'admin';
    }
  });

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    try {
      localStorage.setItem('noor_current_tab', tab);
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
    }
  };

  const [publishers, setPublishers] = useState<Publisher[]>(() => {
    try {
      const saved = localStorage.getItem('noor_publishers');
      return saved ? JSON.parse(saved) : initialPublishers;
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      return initialPublishers;
    }
  });

  const [celebrities, setCelebrities] = useState<JasmineCelebrity[]>(initialJasmineCelebrities);
  const [dalalChannels] = useState<DalalTransitionChannel[]>(initialDalalChannels);
  const [raedaArchive] = useState<RaedaSuccessArchive[]>(initialRaedaArchive);

  const [verificationQueue, setVerificationQueue] = useState<VerificationQueueItem[]>(() => {
    try {
      const saved = localStorage.getItem('noor_verification_queue');
      return saved ? JSON.parse(saved) : initialVerificationQueue;
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      return initialVerificationQueue;
    }
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    try {
      const saved = localStorage.getItem('noor_reports');
      return saved ? JSON.parse(saved) : initialReports;
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      return initialReports;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('noor_audit_logs');
      return saved ? JSON.parse(saved) : initialAuditLogs;
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      return initialAuditLogs;
    }
  });

  const [supporterActions, setSupporterActions] = useState<SupporterAction[]>(() => {
    try {
      const saved = localStorage.getItem('noor_supporter_actions');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      return [];
    }
  });

  const [fairEngineWeights, setFairEngineWeights] = useState<FairEngineWeights>(() => {
    try {
      const saved = localStorage.getItem('noor_fair_weights');
      return saved ? JSON.parse(saved) : defaultFairEngineWeights;
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      return defaultFairEngineWeights;
    }
  });

  // Arterial Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('noor_lang', lang);
      localStorage.setItem('noor_role', role);
      localStorage.setItem('noor_current_tab', currentTab);
      localStorage.setItem('noor_publishers', JSON.stringify(publishers));
      localStorage.setItem('noor_verification_queue', JSON.stringify(verificationQueue));
      localStorage.setItem('noor_reports', JSON.stringify(reports));
      localStorage.setItem('noor_audit_logs', JSON.stringify(auditLogs));
      localStorage.setItem('noor_supporter_actions', JSON.stringify(supporterActions));
      localStorage.setItem('noor_fair_weights', JSON.stringify(fairEngineWeights));
    } catch (e) {
      console.error("Error in Noor Al-Amani Module:", e);
    }
  }, [lang, role, currentTab, publishers, verificationQueue, reports, auditLogs, supporterActions, fairEngineWeights]);

  // Reading Mode Sync to localStorage & HTML document class
  useEffect(() => {
    try {
      localStorage.setItem('noor_reading_mode', String(isReadingMode));
    } catch (e) {
      console.error("Error in Noor Al-Amani Module:", e);
    }
    if (isReadingMode) {
      document.documentElement.classList.add('reading-mode-active');
    } else {
      document.documentElement.classList.remove('reading-mode-active');
    }
  }, [isReadingMode]);

  // Modals & Drawers
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isPwaPromptOpen, setIsPwaPromptOpen] = useState(false);
  const [isFairEngineModalOpen, setIsFairEngineModalOpen] = useState(false);
  const [isFocusModeOpen, setIsFocusModeOpen] = useState(false);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  const [pwaInstalled, setPwaInstalled] = useState<boolean>(() => {
    try {
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone;
      if (isStandalone) return true;
      return localStorage.getItem('noor_pwa_installed') === 'true';
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      return false;
    }
  });

  // Sovereign Rule (CMD-2026-0726-PWA-HOME-17): Auto-trigger PWA Install Prompt when on Home Screen if not installed
  useEffect(() => {
    if (pwaInstalled) {
      setIsPwaPromptOpen(false);
      return;
    }
    if (currentTab === 'home') {
      setIsPwaPromptOpen(true);
    } else {
      setIsPwaPromptOpen(false);
    }
  }, [currentTab, pwaInstalled]);

  // Listen to PWA lifecycle events
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      if (currentTab === 'home' && !pwaInstalled) {
        setIsPwaPromptOpen(true);
      }
    };

    const handleAppInstalled = () => {
      setPwaInstalled(true);
      setIsPwaPromptOpen(false);
      try {
        localStorage.setItem('noor_pwa_installed', 'true');
      } catch (e) {
        console.error("Error in Noor Al-Amani Module:", e);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [currentTab, pwaInstalled]);

  const handleConfirmPwaInstall = () => {
    setPwaInstalled(true);
    setIsPwaPromptOpen(false);
    try {
      localStorage.setItem('noor_pwa_installed', 'true');
    } catch (e) {
      console.error("Error in Noor Al-Amani Module:", e);
    }
  };

  // Sync RTL / LTR document attributes
  useEffect(() => {
    document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  // Register Cross-Sector Interconnection Listener
  useEffect(() => {
    const cleanup = sectorInterconnector.registerAuditSyncListener((newAuditLog) => {
      setAuditLogs((prev) => [newAuditLog, ...prev]);
    });

    // Start background Cron Sterilization Sweeper (CMD-2026-0730-CRON-JOB-STERILIZATION-108)
    cronSterilizationService.startBackgroundSterilization();

    return () => {
      cleanup();
      cronSterilizationService.stopBackgroundSterilization();
    };
  }, []);

  // Record supporter action
  const handleRecordAction = (action: SupporterAction) => {
    setSupporterActions((prev) => [action, ...prev]);

    // Log to audit
    const newAudit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: lang === 'ar' ? 'داعم إنساني' : 'Supporter',
      role: 'SYSTEM',
      action: 'توجيه خارجي مباشر',
      details: `انتقال مباشر إلى قناة ${action.publisherName} على منصة ${action.platform}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  // Record report
  const handleAddReport = (newReport: ReportItem) => {
    setReports((prev) => [newReport, ...prev]);

    // Async submit report via decoupled API adapter
    apiAdapter.submitReport({
      publisherId: newReport.publisherId,
      reason: newReport.reason,
      details: newReport.evidenceDetails,
    }).catch((err) => {
      console.error("Error in Noor Al-Amani Module:", err);
    });

    const newAudit: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: lang === 'ar' ? 'داعم إنساني' : 'Supporter',
      role: 'SYSTEM',
      action: 'تقديم بلاغ حوكمي (علم أحمر)',
      details: `تقديم بلاغ للتحقق من القناة: ${newReport.publisherName}`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const totalVisitsCount = publishers.reduce((acc, curr) => acc + curr.totalVisitsFromPlatform, 0);

  // Compute highest FAIR priority spotlight publisher in App.tsx (Loose Coupling Compliance)
  const spotlightPublisher = useMemo(() => {
    if (!publishers || publishers.length === 0) return null;
    return [...publishers].sort((a, b) => (b.fairScore || 0) - (a.fairScore || 0))[0];
  }, [publishers]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Platform Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        lang={lang}
        setLang={setLang}
        role={role}
        setRole={setRole}
        isReadingMode={isReadingMode}
        onToggleReadingMode={setIsReadingMode}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenAiAssistant={() => setIsAiDrawerOpen(true)}
        onOpenFocusMode={() => setIsFocusModeOpen(true)}
      />

      {/* Main App Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-1 sm:px-4 py-2 md:py-8 pb-28 md:pb-8">
        {currentTab === 'home' && (
          <SectorErrorBoundary moduleName="HomeScreenView" fallbackTitleAr="تعثر مؤقت في عرض الشاشة الرئيسية">
            <React.Suspense fallback={<div className="flex h-[40vh] items-center justify-center text-slate-400 font-medium animate-pulse border border-slate-800/50 rounded-2xl bg-slate-900/20 mt-4">جاري تحميل مكونات القطاع السيادي...</div>}>
              <HomeScreenView
              lang={lang}
              onNavigateTab={handleTabChange}
              totalPublishersCount={publishers.length}
              totalVisitsCount={totalVisitsCount}
              dalalCount={dalalChannels.length}
              raedaCount={raedaArchive.length}
              spotlightPublisher={spotlightPublisher}
              publishers={publishers}
              onOpenBlogModal={() => setIsBlogModalOpen(true)}
            />
            </React.Suspense>
          </SectorErrorBoundary>
        )}

        {currentTab === 'core' && (
          <SectorErrorBoundary moduleName="CorePlatformView" fallbackTitleAr="تعثر مؤقت في مفاعل التكافؤ النمو">
            <React.Suspense fallback={<div className="flex h-[40vh] items-center justify-center text-slate-400 font-medium animate-pulse border border-slate-800/50 rounded-2xl bg-slate-900/20 mt-4">جاري تحميل مكونات القطاع السيادي...</div>}>
              <CorePlatformView
              publishers={publishers}
              setPublishers={setPublishers}
              weights={fairEngineWeights}
              lang={lang}
              onRecordAction={handleRecordAction}
              onOpenFairEngineConfig={() => setIsFairEngineModalOpen(true)}
              onOpenFocusMode={() => setIsFocusModeOpen(true)}
            />
            </React.Suspense>
          </SectorErrorBoundary>
        )}

        {currentTab === 'jasmine' && (
          <SectorErrorBoundary moduleName="JasmineSectorView" fallbackTitleAr="تعثر مؤقت في قطاع الياسمين">
            <React.Suspense fallback={<div className="flex h-[40vh] items-center justify-center text-slate-400 font-medium animate-pulse border border-slate-800/50 rounded-2xl bg-slate-900/20 mt-4">جاري تحميل مكونات القطاع السيادي...</div>}>
              <JasmineSectorView
              celebrities={celebrities}
              setCelebrities={setCelebrities}
              lang={lang}
              isGhostMode={isGhostMode}
              onNavigateToSupporterPortal={() => setCurrentTab('supporter')}
            />
            </React.Suspense>
          </SectorErrorBoundary>
        )}

        {currentTab === 'dalal' && (
          <SectorErrorBoundary moduleName="DalalSectorView" fallbackTitleAr="تعثر مؤقت في قطاع دلال">
            <React.Suspense fallback={<div className="flex h-[40vh] items-center justify-center text-slate-400 font-medium animate-pulse border border-slate-800/50 rounded-2xl bg-slate-900/20 mt-4">جاري التحميل...</div>}>
              <DalalSectorView channels={dalalChannels} lang={lang} />
            </React.Suspense>
          </SectorErrorBoundary>
        )}

        {currentTab === 'raeda' && (
          <SectorErrorBoundary moduleName="RaedaSectorView" fallbackTitleAr="تعثر مؤقت في قطاع رائدة">
            <React.Suspense fallback={<div className="flex h-[40vh] items-center justify-center text-slate-400 font-medium animate-pulse border border-slate-800/50 rounded-2xl bg-slate-900/20 mt-4">جاري التحميل...</div>}>
              <RaedaSectorView archiveList={raedaArchive} lang={lang} />
            </React.Suspense>
          </SectorErrorBoundary>
        )}

        {currentTab === 'publisher' && (
          <SectorErrorBoundary moduleName="PublisherPortalView" fallbackTitleAr="تعثر مؤقت في بوابة الناشرين">
            <React.Suspense fallback={<div className="flex h-[40vh] items-center justify-center text-slate-400 font-medium animate-pulse border border-slate-800/50 rounded-2xl bg-slate-900/20 mt-4">جاري التحميل...</div>}>
              <PublisherPortalView
              publishers={publishers}
              setPublishers={setPublishers}
              lang={lang}
            />
            </React.Suspense>
          </SectorErrorBoundary>
        )}

        {currentTab === 'supporter' && (
          <SectorErrorBoundary moduleName="SupporterPortalView" fallbackTitleAr="تعثر مؤقت في جناح الكفالة والداعمين">
            <React.Suspense fallback={<div className="flex h-[40vh] items-center justify-center text-slate-400 font-medium animate-pulse border border-slate-800/50 rounded-2xl bg-slate-900/20 mt-4">جاري التحميل...</div>}>
              <SupporterPortalView
              supporterActions={supporterActions}
              publishers={publishers}
              setPublishers={setPublishers}
              weights={fairEngineWeights}
              lang={lang}
              onRecordAction={handleRecordAction}
              onAddReport={handleAddReport}
            />
            </React.Suspense>
          </SectorErrorBoundary>
        )}

        {currentTab === 'impact' && (
          <SectorErrorBoundary moduleName="HybridImpactView" fallbackTitleAr="تعثر مؤقت في شاشة الأثر">
            <React.Suspense fallback={<div className="flex h-[40vh] items-center justify-center text-slate-400 font-medium animate-pulse border border-slate-800/50 rounded-2xl bg-slate-900/20 mt-4">جاري التحميل...</div>}>
              <HybridImpactView publishers={publishers} supporterActions={supporterActions} lang={lang} setCurrentTab={handleTabChange} />
            </React.Suspense>
          </SectorErrorBoundary>
        )}

        {currentTab === 'analytics' && (
          <SectorErrorBoundary moduleName="AnalyticsView" fallbackTitleAr="تعثر مؤقت في شاشة التحليلات">
            <React.Suspense fallback={<div className="flex h-[40vh] items-center justify-center text-slate-400 font-medium animate-pulse border border-slate-800/50 rounded-2xl bg-slate-900/20 mt-4">جاري التحميل...</div>}>
              <AnalyticsView publishers={publishers} lang={lang} />
            </React.Suspense>
          </SectorErrorBoundary>
        )}

        {currentTab === 'errors' && (
          <SectorErrorBoundary moduleName="ErrorDictionaryExplorer" fallbackTitleAr="تعثر مؤقت في معجم الأخطاء">
            <React.Suspense fallback={<div className="flex h-[40vh] items-center justify-center text-slate-400 font-medium animate-pulse border border-slate-800/50 rounded-2xl bg-slate-900/20 mt-4">جاري التحميل...</div>}>
              <ErrorDictionaryExplorer lang={lang} onOpenAssistant={(code) => { console.log("AI trigger", code); setIsAiDrawerOpen(true); }} />
            </React.Suspense>
          </SectorErrorBoundary>
        )}

        {currentTab === 'admin' && (
          <SectorErrorBoundary moduleName="AdminPortalView" fallbackTitleAr="تعثر مؤقت في غرفة العمليات والتحكم">
            <React.Suspense fallback={<div className="flex h-[40vh] items-center justify-center text-slate-400 font-medium animate-pulse border border-slate-800/50 rounded-2xl bg-slate-900/20 mt-4">جاري التحميل...</div>}>
              <AdminPortalView
              weights={fairEngineWeights}
              setWeights={setFairEngineWeights}
              verificationQueue={verificationQueue}
              setVerificationQueue={setVerificationQueue}
              reports={reports}
              setReports={setReports}
              auditLogs={auditLogs}
              setAuditLogs={setAuditLogs}
              publishers={publishers}
              setPublishers={setPublishers}
              lang={lang}
              isReadingMode={isReadingMode}
              onToggleReadingMode={setIsReadingMode}
            />
            </React.Suspense>
          </SectorErrorBoundary>
        )}
      </main>

      {/* Platform Footer */}
      <Footer lang={lang} onNavigate={handleTabChange} />

      {/* Drawers & Modals */}
      <FloatingAIButton
        onClick={() => setIsAiDrawerOpen(true)}
        lang={lang}
      />

      <AIAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        lang={lang}
      />

      <PwaInstallBanner
        isOpen={isPwaPromptOpen}
        onClose={() => setIsPwaPromptOpen(false)}
        onInstall={handleConfirmPwaInstall}
        lang={lang}
      />

      <FairEngineConfigModal
        isOpen={isFairEngineModalOpen}
        onClose={() => setIsFairEngineModalOpen(false)}
        weights={fairEngineWeights}
        setWeights={setFairEngineWeights}
        lang={lang}
      />

      {isFocusModeOpen && (
        <FocusedModeView
          publishers={publishers}
          weights={fairEngineWeights}
          lang={lang}
          onRecordAction={handleRecordAction}
          onClose={() => setIsFocusModeOpen(false)}
        />
      )}

      <BlogArticleModal
        isOpen={isBlogModalOpen}
        onClose={() => setIsBlogModalOpen(false)}
        lang={lang}
        isReadingMode={isReadingMode}
        onToggleReadingMode={setIsReadingMode}
      />

      <AppSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isReadingMode={isReadingMode}
        onToggleReadingMode={setIsReadingMode}
        lang={lang}
        setLang={setLang}
        role={role}
        setRole={setRole}
      />

      {/* Contextual Mobile Bottom Navigation Bar [NA-SOVEREIGN-ORDER-057] */}
      <ContextualMobileNav
        currentTab={currentTab}
        setCurrentTab={handleTabChange}
        lang={lang}
      />
    </div>
  );
}

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
import { HomeScreenView } from './components/HomeScreenView';
import { CorePlatformView } from './components/CorePlatformView';
import { JasmineSectorView } from './components/JasmineSectorView';
import { DalalSectorView } from './components/DalalSectorView';
import { RaedaSectorView } from './components/RaedaSectorView';
import { PublisherPortalView } from './components/PublisherPortalView';
import { SupporterPortalView } from './components/SupporterPortalView';
import { AdminPortalView } from './components/AdminPortalView';
import { AnalyticsView } from './components/AnalyticsView';
import { ErrorDictionaryExplorer } from './components/ErrorDictionaryExplorer';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { FloatingAIButton } from './components/FloatingAIButton';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { FairEngineConfigModal } from './components/FairEngineConfigModal';
import { FocusedModeView } from './components/FocusedModeView';
import { BlogArticleModal } from './components/BlogArticleModal';
import { GlobalErrorBoundary } from './components/GlobalErrorBoundary';
import { AppSettingsModal } from './components/AppSettingsModal';

export default function App() {
  // State collections with Arterial Persistence (Preventing State Loss)
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('noor_lang');
      return (saved === 'en' || saved === 'ar') ? saved : 'ar';
    } catch (error) {
      console.warn('LocalStorage read warning for noor_lang:', error);
      return 'ar';
    }
  });

  const [role, setRole] = useState<UserRole>(() => {
    try {
      const saved = localStorage.getItem('noor_role');
      return (saved as UserRole) || 'SUPPORTER';
    } catch (error) {
      console.warn('LocalStorage read warning for noor_role:', error);
      return 'SUPPORTER';
    }
  });

  const [isReadingMode, setIsReadingMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('noor_reading_mode') === 'true';
    } catch (error) {
      console.warn('LocalStorage read warning for noor_reading_mode:', error);
      return false;
    }
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [currentTab, setCurrentTab] = useState<string>(() => {
    try {
      return localStorage.getItem('noor_current_tab') || 'admin';
    } catch (error) {
      console.warn('LocalStorage read warning for noor_current_tab:', error);
      return 'admin';
    }
  });

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    try {
      localStorage.setItem('noor_current_tab', tab);
    } catch (err) {
      console.error('LocalStorage write error for noor_current_tab:', err);
    }
  };

  const [publishers, setPublishers] = useState<Publisher[]>(() => {
    try {
      const saved = localStorage.getItem('noor_publishers');
      return saved ? JSON.parse(saved) : initialPublishers;
    } catch (error) {
      console.warn('LocalStorage read warning for noor_publishers:', error);
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
      console.warn('LocalStorage read warning for noor_verification_queue:', error);
      return initialVerificationQueue;
    }
  });

  const [reports, setReports] = useState<ReportItem[]>(() => {
    try {
      const saved = localStorage.getItem('noor_reports');
      return saved ? JSON.parse(saved) : initialReports;
    } catch (error) {
      console.warn('LocalStorage read warning for noor_reports:', error);
      return initialReports;
    }
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    try {
      const saved = localStorage.getItem('noor_audit_logs');
      return saved ? JSON.parse(saved) : initialAuditLogs;
    } catch (error) {
      console.warn('LocalStorage read warning for noor_audit_logs:', error);
      return initialAuditLogs;
    }
  });

  const [supporterActions, setSupporterActions] = useState<SupporterAction[]>(() => {
    try {
      const saved = localStorage.getItem('noor_supporter_actions');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn('LocalStorage read warning for noor_supporter_actions:', error);
      return [];
    }
  });

  const [fairEngineWeights, setFairEngineWeights] = useState<FairEngineWeights>(() => {
    try {
      const saved = localStorage.getItem('noor_fair_weights');
      return saved ? JSON.parse(saved) : defaultFairEngineWeights;
    } catch (error) {
      console.warn('LocalStorage read warning for noor_fair_weights:', error);
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
      console.warn('Arterial persistence write skipped:', e);
    }
  }, [lang, role, currentTab, publishers, verificationQueue, reports, auditLogs, supporterActions, fairEngineWeights]);

  // Reading Mode Sync to localStorage & HTML document class
  useEffect(() => {
    try {
      localStorage.setItem('noor_reading_mode', String(isReadingMode));
    } catch (e) {
      console.warn('Reading mode persistence skipped:', e);
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
      console.warn('LocalStorage read warning for noor_pwa_installed:', error);
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
        console.warn('Could not save pwa installed state:', e);
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
      console.warn('Error persisting PWA installed flag:', e);
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
      console.warn('Report submit API warning in App.tsx:', err);
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-4 py-4 md:py-8 pb-24 md:pb-8">
        {currentTab === 'home' && (
          <GlobalErrorBoundary moduleName="HomeScreenView" fallbackTitleAr="تعثر مؤقت في عرض الشاشة الرئيسية">
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
          </GlobalErrorBoundary>
        )}

        {currentTab === 'core' && (
          <GlobalErrorBoundary moduleName="CorePlatformView" fallbackTitleAr="تعثر مؤقت في مفاعل التكافؤ النمو">
            <CorePlatformView
              publishers={publishers}
              setPublishers={setPublishers}
              weights={fairEngineWeights}
              lang={lang}
              onRecordAction={handleRecordAction}
              onOpenFairEngineConfig={() => setIsFairEngineModalOpen(true)}
              onOpenFocusMode={() => setIsFocusModeOpen(true)}
            />
          </GlobalErrorBoundary>
        )}

        {currentTab === 'jasmine' && (
          <GlobalErrorBoundary moduleName="JasmineSectorView" fallbackTitleAr="تعثر مؤقت في قطاع الياسمين">
            <JasmineSectorView
              celebrities={celebrities}
              setCelebrities={setCelebrities}
              lang={lang}
            />
          </GlobalErrorBoundary>
        )}

        {currentTab === 'dalal' && (
          <GlobalErrorBoundary moduleName="DalalSectorView" fallbackTitleAr="تعثر مؤقت في قطاع دلال">
            <DalalSectorView channels={dalalChannels} lang={lang} />
          </GlobalErrorBoundary>
        )}

        {currentTab === 'raeda' && (
          <GlobalErrorBoundary moduleName="RaedaSectorView" fallbackTitleAr="تعثر مؤقت في قطاع رائدة">
            <RaedaSectorView archiveList={raedaArchive} lang={lang} />
          </GlobalErrorBoundary>
        )}

        {currentTab === 'publisher' && (
          <GlobalErrorBoundary moduleName="PublisherPortalView" fallbackTitleAr="تعثر مؤقت في بوابة الناشرين">
            <PublisherPortalView
              publishers={publishers}
              setPublishers={setPublishers}
              lang={lang}
            />
          </GlobalErrorBoundary>
        )}

        {currentTab === 'supporter' && (
          <GlobalErrorBoundary moduleName="SupporterPortalView" fallbackTitleAr="تعثر مؤقت في جناح الكفالة والداعمين">
            <SupporterPortalView
              supporterActions={supporterActions}
              publishers={publishers}
              setPublishers={setPublishers}
              weights={fairEngineWeights}
              lang={lang}
              onRecordAction={handleRecordAction}
              onAddReport={handleAddReport}
            />
          </GlobalErrorBoundary>
        )}

        {currentTab === 'analytics' && (
          <GlobalErrorBoundary moduleName="AnalyticsView" fallbackTitleAr="تعثر مؤقت في شاشة التحليلات">
            <AnalyticsView publishers={publishers} lang={lang} />
          </GlobalErrorBoundary>
        )}

        {currentTab === 'errors' && (
          <GlobalErrorBoundary moduleName="ErrorDictionaryExplorer" fallbackTitleAr="تعثر مؤقت في معجم الأخطاء">
            <ErrorDictionaryExplorer lang={lang} />
          </GlobalErrorBoundary>
        )}

        {currentTab === 'admin' && (
          <GlobalErrorBoundary moduleName="AdminPortalView" fallbackTitleAr="تعثر مؤقت في غرفة العمليات والتحكم">
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
          </GlobalErrorBoundary>
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
    </div>
  );
}

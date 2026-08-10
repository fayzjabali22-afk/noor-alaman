import React from 'react';
import {
  Publisher,
  FairEngineWeights,
  VerificationQueueItem,
  ReportItem,
  AuditLog,
  Language,
} from '../types';
import { translations } from '../lib/i18n';
import { useAdminOperations } from '../hooks/useAdminOperations';
import { AdminGatekeeper } from './admin/AdminGatekeeper';
import { AdminHeaderControlRoom } from './admin/AdminHeaderControlRoom';
import { FairEngineWeightsTab } from './admin/FairEngineWeightsTab';
import { AuditLogsTab } from './admin/AuditLogsTab';
import { VerificationQueueTab } from './admin/VerificationQueueTab';
import { ReportsTab } from './admin/ReportsTab';
import { SystemSweeperTab } from './admin/SystemSweeperTab';
import { FutureExtensionsTab } from './admin/FutureExtensionsTab';
import { ErrorDictionaryExplorer } from './ErrorDictionaryExplorer';
import { Wifi, ShieldCheck } from 'lucide-react';

interface AdminPortalViewProps {
  weights: FairEngineWeights;
  setWeights: React.Dispatch<React.SetStateAction<FairEngineWeights>>;
  verificationQueue: VerificationQueueItem[];
  setVerificationQueue: React.Dispatch<React.SetStateAction<VerificationQueueItem[]>>;
  reports: ReportItem[];
  setReports: React.Dispatch<React.SetStateAction<ReportItem[]>>;
  auditLogs: AuditLog[];
  setAuditLogs: React.Dispatch<React.SetStateAction<AuditLog[]>>;
  publishers: Publisher[];
  setPublishers: React.Dispatch<React.SetStateAction<Publisher[]>>;
  lang: Language;
  isReadingMode?: boolean;
  onToggleReadingMode?: (active: boolean) => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  weights,
  setWeights,
  verificationQueue,
  setVerificationQueue,
  reports,
  setReports,
  auditLogs,
  setAuditLogs,
  publishers,
  setPublishers,
  lang,
  isReadingMode = false,
  onToggleReadingMode,
}) => {
  const t = translations[lang];

  const {
    isLoggedIn,
    adminEmail,
    setAdminEmail,
    adminPasscode,
    setAdminPasscode,
    activeSubTab,
    setActiveSubTab,
    isEncryptionActive,
    auditSearchQuery,
    setAuditSearchQuery,
    selectedAuditCategory,
    setSelectedAuditCategory,
    auditTimeRange,
    setAuditTimeRange,
    showSectorChart,
    setShowSectorChart,
    sweeperRunning,
    lastSweeperReport,
    handleAdminLogin,
    handleAdminLogout,
    handleToggleEncryption,
    handleWeightChange,
    handleResetWeights,
    handleApproveVerification,
    handleRejectVerification,
    handleRequestInfoVerification,
    handleResolveReport,
    handleRunSweeper,
    handleReactivatePublisher,
    getLogCategory,
  } = useAdminOperations({
    weights,
    setWeights,
    verificationQueue,
    setVerificationQueue,
    reports,
    setReports,
    auditLogs,
    setAuditLogs,
    publishers,
    setPublishers,
  });

  if (!isLoggedIn) {
    return (
      <AdminGatekeeper
        adminEmail={adminEmail}
        setAdminEmail={setAdminEmail}
        adminPasscode={adminPasscode}
        setAdminPasscode={setAdminPasscode}
        onLogin={handleAdminLogin}
      />
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <AdminHeaderControlRoom
        auditLogs={auditLogs}
        verificationQueue={verificationQueue}
        reports={reports}
        isEncryptionActive={isEncryptionActive}
        activeSubTab={activeSubTab}
        setActiveSubTab={setActiveSubTab}
        onToggleEncryption={handleToggleEncryption}
        onLogout={handleAdminLogout}
      />

      {activeSubTab === 'WEIGHTS' && (
        <FairEngineWeightsTab
          weights={weights}
          onWeightChange={handleWeightChange}
          onResetWeights={handleResetWeights}
        />
      )}

      {activeSubTab === 'AUDIT' && (
        <AuditLogsTab
          auditLogs={auditLogs}
          publishers={publishers}
          auditSearchQuery={auditSearchQuery}
          setAuditSearchQuery={setAuditSearchQuery}
          selectedAuditCategory={selectedAuditCategory}
          setSelectedAuditCategory={setSelectedAuditCategory}
          auditTimeRange={auditTimeRange}
          setAuditTimeRange={setAuditTimeRange}
          showSectorChart={showSectorChart}
          setShowSectorChart={setShowSectorChart}
          getLogCategory={getLogCategory}
          isReadingMode={isReadingMode}
          onToggleReadingMode={onToggleReadingMode}
        />
      )}

      {activeSubTab === 'ENCRYPTION' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Wifi className="w-5 h-5 text-emerald-400" />
                <span>إدارة تشفير الاتصالات والربط السيادي (Sovereign Encryption Node)</span>
              </h3>
              <p className="text-xs text-slate-300">
                التحكم المباشر في تشفير القنوات ومقابض الربط لمنع الاعتراض وحماية بيانات المستخدمين والناشرين.
              </p>
            </div>

            <button
              type="button"
              onClick={handleToggleEncryption}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg cursor-pointer ${
                isEncryptionActive
                  ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400'
                  : 'bg-rose-600 text-white hover:bg-rose-500'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{isEncryptionActive ? 'التشفير نشط (انقر للتعطيل)' : 'تفعيل التشفير المتقدم'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-400">بروتوكول القناة</div>
              <div className="text-sm font-black text-emerald-400 font-mono">TLS 1.3 / AES-256-GCM</div>
              <p className="text-[11px] text-slate-500">تشفير تام بين الطرفين (E2EE) لكل تبادلات البيانات.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-400">حالة التوقيع الرقمي</div>
              <div className="text-sm font-black text-sky-400 font-mono">VERIFIED (SOVEREIGN CERT)</div>
              <p className="text-[11px] text-slate-500">ملاحظة مصادقة المفاتيح السيادية.</p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-slate-400">درع الحماية الكوانتية</div>
              <div className="text-sm font-black text-indigo-400 font-mono">QUANTUM SHIELD v1.0</div>
              <p className="text-[11px] text-slate-500">بروتوكول حماية ضد أساليب فك التشفير المستقبلي.</p>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'VERIFICATION' && (
        <VerificationQueueTab
          verificationQueue={verificationQueue}
          publishers={publishers}
          lang={lang === 'ar' ? 'ar' : 'en'}
          onApproveVerification={handleApproveVerification}
          onRejectVerification={handleRejectVerification}
          onRequestInfoVerification={handleRequestInfoVerification}
        />
      )}

      {activeSubTab === 'REPORTS' && (
        <ReportsTab reports={reports} t={t} onResolveReport={handleResolveReport} />
      )}

      {activeSubTab === 'SWEEPER' && (
        <SystemSweeperTab
          publishers={publishers}
          sweeperRunning={sweeperRunning}
          lastSweeperReport={lastSweeperReport}
          onRunSweeper={handleRunSweeper}
          onReactivatePublisher={handleReactivatePublisher}
        />
      )}

      {activeSubTab === 'ERRORS' && <ErrorDictionaryExplorer lang={lang} />}

      {activeSubTab === 'FUTURE_EXTENSIONS' && <FutureExtensionsTab />}
    </div>
  );
};

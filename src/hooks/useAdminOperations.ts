import { useState, useCallback } from 'react';
import {
  Publisher,
  FairEngineWeights,
  VerificationQueueItem,
  ReportItem,
  AuditLog,
  AuditActionCategory,
} from '../types';
import { defaultFairEngineWeights } from '../lib/fairEngine';
import { runDormantChannelSweeper } from '../lib/dormantSweeper';
import { apiAdapter } from '../services/apiAdapter';

interface UseAdminOperationsProps {
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
}

export function useAdminOperations({
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
}: UseAdminOperationsProps) {
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('noor_admin_logged_in') === 'true';
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
      return false;
    }
  });

  const [adminEmail, setAdminEmail] = useState('admin@nooralamani.gov');
  const [adminPasscode, setAdminPasscode] = useState('••••••••••••');
  const [isEncryptionActive, setIsEncryptionActive] = useState<boolean>(true);

  // Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<
    'WEIGHTS' | 'AUDIT' | 'ENCRYPTION' | 'VERIFICATION' | 'REPORTS' | 'SWEEPER' | 'ERRORS' | 'FUTURE_EXTENSIONS'
  >('WEIGHTS');

  // Audit filters
  const [auditSearchQuery, setAuditSearchQuery] = useState('');
  const [selectedAuditCategory, setSelectedAuditCategory] = useState<'ALL' | AuditActionCategory | 'SENSITIVE'>('ALL');
  const [auditTimeRange, setAuditTimeRange] = useState<'ALL' | 'TODAY' | 'WEEK' | 'MONTH'>('ALL');
  const [showSectorChart, setShowSectorChart] = useState<boolean>(true);

  // Verification Queue Decision Modal State
  const [activeVerificationItem, setActiveVerificationItem] = useState<VerificationQueueItem | null>(null);
  const [verificationModalType, setVerificationModalType] = useState<
    'APPROVE_STANDARD' | 'APPROVE_EXCEPTION' | 'REJECT' | 'NEEDS_INFO' | null
  >(null);
  const [verificationNoteInput, setVerificationNoteInput] = useState<string>('');

  // Sweeper State
  const [sweeperRunning, setSweeperRunning] = useState(false);
  const [lastSweeperReport, setLastSweeperReport] = useState<{
    status: string;
    purgedCacheEntries: number;
    activeAntiFraudKeysRemaining: number;
    executionTimeMs: number;
    timestamp: string;
    ssotReference: string;
    descriptionAr: string;
  } | null>(null);

  // Log Category Helper
  const getLogCategory = useCallback((log: AuditLog): AuditActionCategory => {
    if (log.category) return log.category;
    const text = (log.action + ' ' + log.details + ' ' + log.actor).toLowerCase();
    if (
      text.includes('تشفير') ||
      text.includes('أمن') ||
      text.includes('دخول') ||
      text.includes('وصول') ||
      text.includes('حماية') ||
      text.includes('كلمة') ||
      text.includes('مفتاح') ||
      text.includes('security')
    ) {
      return 'SECURITY';
    }
    if (
      text.includes('نظام') ||
      text.includes('خادم') ||
      text.includes('تطهير') ||
      text.includes('ذاكرة') ||
      text.includes('أداء') ||
      text.includes('مزامنة') ||
      text.includes('مكنسة') ||
      text.includes('sweeper') ||
      text.includes('technical')
    ) {
      return 'TECHNICAL';
    }
    return 'PROCEDURAL';
  }, []);

  // ARCHITECTURAL SECURITY NOTE [NA-PROTOCOL-18-EXEC-007]:
  // Client-side authentication status via localStorage is a front-end preview state.
  // Production auth gatekeeper must be enforced via Next.js Middleware and Secure HTTP-Only Cookies.
  const handleAdminLogin = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    try {
      localStorage.setItem('noor_admin_logged_in', 'true');
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
    }

    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'مدير النظام (System Admin)',
      role: 'ADMIN',
      action: 'تسجيل دخول إلى غرفة عمليات التحكم في النظام والإشراف عليه',
      details: 'تم الدخول المباشر إلى غرفة العمليات (نمط التطوير المباشر Dev Mode Bypass active).',
      category: 'SECURITY',
    };
    setAuditLogs((prev) => [log, ...prev]);
    try {
      apiAdapter.syncAuditLog(log);
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
    }
  }, [setAuditLogs]);

  const handleAdminLogout = useCallback(() => {
    setIsLoggedIn(false);
    try {
      localStorage.setItem('noor_admin_logged_in', 'false');
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
    }
  }, []);

  // Encryption Toggle
  const handleToggleEncryption = useCallback(() => {
    setIsEncryptionActive((prev) => {
      const nextState = !prev;
      const log: AuditLog = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'مدير العمليات السيادية',
        role: 'ADMIN',
        action: `تعديل بروتوكول تشفير الاتصالات إلى [${nextState ? 'مشفّر سيادياً TLS 1.3 / Quantum Shield' : 'تشفير قياسي'}]`,
        details: `تم تغيير حالة تشفير الربط والشبكة عبر غرفة التحكم والسيطرة المباشرة.`,
        category: 'SECURITY',
      };
      setAuditLogs((logs) => [log, ...logs]);
      return nextState;
    });
  }, [setAuditLogs]);

  // Sweeper Execution
  const handleRunSweeper = useCallback(async () => {
    setSweeperRunning(true);
    try {
      const report = await apiAdapter.triggerCronSweeper();
      setLastSweeperReport(report);

      const dormantSummary = runDormantChannelSweeper(publishers);
      setPublishers(dormantSummary.updatedPublishers);

      const log: AuditLog = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'المكنسة البرمجية (Sovereign Sweeper)',
        role: 'ADMIN',
        action: 'تطهير السجلات العالقة وفحص خمول القنوات (45 يوماً)',
        details: `حذف ${report.purgedCacheEntries} سجلاً عالقاً. فحص القنوات: تخفيض ${dormantSummary.demotedCount} قناة خاملة، وإعادة تنشيط ${dormantSummary.reactivatedCount} قناة.`,
        category: 'TECHNICAL',
      };

      const newAuditLogs = [log, ...dormantSummary.auditLogs];
      setAuditLogs((prev) => [...newAuditLogs, ...prev]);
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
    } finally {
      setSweeperRunning(false);
    }
  }, [publishers, setAuditLogs, setPublishers]);

  // Reactivate Publisher
  const handleReactivatePublisher = useCallback((publisherId: string) => {
    setPublishers((prev) =>
      prev.map((p) => {
        if (p.id === publisherId) {
          return {
            ...p,
            status: 'VERIFIED',
            dormantReason: undefined,
            lastPublishDate: new Date().toISOString(),
          };
        }
        return p;
      })
    );

    const pub = publishers.find((p) => p.id === publisherId);
    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'مدير النظام (Admin)',
      role: 'ADMIN',
      action: `إعادة تنشيط يدوية للقناة الخاملة (${pub?.name || publisherId})`,
      details: `تم إلغاء تصنيف الخمول يدوياً وتجديد تاريخ النشاط.`,
      category: 'SECURITY',
      targetId: publisherId,
      targetType: 'PUBLISHER',
    };
    setAuditLogs((prev) => [log, ...prev]);
  }, [publishers, setAuditLogs, setPublishers]);

  // Weight Sliders
  const handleWeightChange = useCallback((key: keyof FairEngineWeights, value: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: value,
    }));

    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'مدير النظام (Admin)',
      role: 'ADMIN',
      action: `تعديل وزن خوارزمية محرك العدالة (${key})`,
      details: `تم تحديث الوزن المحدد لخوارزمية توزيع الفرص الخوارزمية إلى القيمة (${value}).`,
      category: 'PROCEDURAL',
      targetId: key,
      targetType: 'FAIR_ENGINE',
    };
    setAuditLogs((prev) => [log, ...prev]);
    try {
      apiAdapter.syncAuditLog(log);
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
    }
  }, [setAuditLogs, setWeights]);

  const handleResetWeights = useCallback(() => {
    setWeights(defaultFairEngineWeights);
    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'مدير النظام (Admin)',
      role: 'ADMIN',
      action: 'استعادة الأوزان القياسية لمحرك العدالة',
      details: 'تمت إعادة ضبط كافة أوزان الخوارزمية للقيم الافتراضية.',
      category: 'PROCEDURAL',
      targetId: 'DEFAULT_WEIGHTS',
      targetType: 'FAIR_ENGINE',
    };
    setAuditLogs((prev) => [log, ...prev]);
    try {
      apiAdapter.syncAuditLog(log);
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
    }
  }, [setAuditLogs, setWeights]);

  // Verification Queue Decision Handlers
  const handleApproveVerification = useCallback((item: VerificationQueueItem, customNote?: string) => {
    const isIncomplete =
      item.dataCompletenessScore < 70 || !item.phoneVerified || !item.emailVerified || !item.channelUrlValid;

    const updatedQueue = verificationQueue.map((v) => {
      if (v.id === item.id) {
        return {
          ...v,
          reviewStatus: 'APPROVED' as const,
          reviewerNotes: customNote || (isIncomplete ? 'اعتماد استثنائي تجاوز نسبة اكتمال البيانات' : 'تم التدقيق والاعتماد القياسي'),
        };
      }
      return v;
    });
    setVerificationQueue(updatedQueue);
    try {
      apiAdapter.syncVerificationQueue(updatedQueue);
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
    }

    setPublishers((prev) =>
      prev.map((p) => {
        if (p.id === item.publisherId) {
          return {
            ...p,
            status: 'VERIFIED',
            verificationLevel: 'GOLD',
            lifecycleStage: 'ACTIVE_SUPPORT',
          };
        }
        return p;
      })
    );

    const logAction = isIncomplete
      ? '⚠️ اعتماد توثيق ناشر [استثناء إداري حوكمي - اكتمال منخفض]'
      : 'اعتماد توثيق ناشر وترقية شارة التوثيق';

    const logDetails = isIncomplete
      ? `تمت الموافقة الاستثنائية على طلب الناشر (${item.publisherName}) بنسبة اكتمال بيانات (${item.dataCompletenessScore}%). ملاحظات المراجع: ${customNote || 'تجاوز استثنائي بقرار سيادي مبرر'}.`
      : `تمت الموافقة الرسمية والاعتماد القياسي لطلب الناشر (${item.publisherName}) وترقيته للقوائم النشطة بقطاع دلال/رائدة.`;

    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'لجنة التحقق والحوكمة (Reviewer Committee)',
      role: 'REVIEWER',
      action: logAction,
      details: logDetails,
      category: isIncomplete ? 'SECURITY' : 'PROCEDURAL',
      targetId: item.publisherId || item.id,
      targetType: 'VERIFICATION_QUEUE',
    };

    setAuditLogs((prev) => [log, ...prev]);
    try {
      apiAdapter.syncAuditLog(log);
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
    }
  }, [verificationQueue, setVerificationQueue, setPublishers, setAuditLogs]);

  const handleRejectVerification = useCallback((item: VerificationQueueItem, reason: string) => {
    const updatedQueue = verificationQueue.map((v) => {
      if (v.id === item.id) {
        return {
          ...v,
          reviewStatus: 'REJECTED' as const,
          reviewerNotes: reason || 'رفض الطلب لعدم استيفاء الشروط السيادية',
        };
      }
      return v;
    });
    setVerificationQueue(updatedQueue);
    try {
      apiAdapter.syncVerificationQueue(updatedQueue);
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
    }

    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'لجنة التحقق والحوكمة (Reviewer Committee)',
      role: 'REVIEWER',
      action: '🚨 رفض طلب توثيق ناشر وتوثيق سبب الاستبعاد',
      details: `تم رفض طلب التوثيق للناشر (${item.publisherName}). سبب الرفض الحوكمي: ${reason || 'عدم كفاية الأدلة المرفقة'}.`,
      category: 'PROCEDURAL',
      targetId: item.publisherId || item.id,
      targetType: 'VERIFICATION_QUEUE',
    };

    setAuditLogs((prev) => [log, ...prev]);
    try {
      apiAdapter.syncAuditLog(log);
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
    }
  }, [verificationQueue, setVerificationQueue, setAuditLogs]);

  const handleRequestInfoVerification = useCallback((item: VerificationQueueItem, infoNeeded: string) => {
    const updatedQueue = verificationQueue.map((v) => {
      if (v.id === item.id) {
        return {
          ...v,
          reviewStatus: 'NEEDS_INFO' as const,
          reviewerNotes: infoNeeded || 'طلب معلومات وإثباتات إضافية',
        };
      }
      return v;
    });
    setVerificationQueue(updatedQueue);
    try {
      apiAdapter.syncVerificationQueue(updatedQueue);
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
    }

    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'لجنة التحقق والحوكمة (Reviewer Committee)',
      role: 'REVIEWER',
      action: 'طلب استكمال بيانات وتحفظ حوكمي مؤقت',
      details: `تم تعليق طلب التوثيق للناشر (${item.publisherName}) بانتظار توفير المعلومات التالية: ${infoNeeded || 'تحديث البيانات'}.`,
      category: 'PROCEDURAL',
      targetId: item.publisherId || item.id,
      targetType: 'VERIFICATION_QUEUE',
    };

    setAuditLogs((prev) => [log, ...prev]);
    try {
      apiAdapter.syncAuditLog(log);
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
    }
  }, [verificationQueue, setVerificationQueue, setAuditLogs]);

  // Report Resolution
  const handleResolveReport = useCallback((reportId: string) => {
    const timestamp = new Date().toISOString();
    setReports((prev) =>
      prev.map((r) => {
        if (r.id === reportId) {
          const newHistoryItem = {
            id: `rh-${Date.now()}`,
            reportId: r.id,
            previousStatus: r.status,
            newStatus: 'RESOLVED' as const,
            adminDecision: 'معالجة البلاغ وتأكيد النتيجة الحوكمية وإتاحة الاستمرار العادل للناشر',
            changedBy: 'مدير النظام (Admin)',
            createdAt: timestamp,
          };
          return {
            ...r,
            status: 'RESOLVED' as const,
            history: [...(r.history || []), newHistoryItem],
          };
        }
        return r;
      })
    );

    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp,
      actor: 'إدارة الحوكمة والبلاغات',
      role: 'ADMIN',
      action: 'معالجة بلاغ وتحديث سجل التسلسل التاريخي',
      details: `تمت معالجة البلاغ رقم (${reportId}) وتسجيل قرار الإدارة بالكامل في سجل التاريخ.`,
      category: 'PROCEDURAL',
    };
    setAuditLogs((prev) => [log, ...prev]);
  }, [setReports, setAuditLogs]);

  return {
    isLoggedIn,
    adminEmail,
    setAdminEmail,
    adminPasscode,
    setAdminPasscode,
    isEncryptionActive,
    activeSubTab,
    setActiveSubTab,
    auditSearchQuery,
    setAuditSearchQuery,
    selectedAuditCategory,
    setSelectedAuditCategory,
    auditTimeRange,
    setAuditTimeRange,
    showSectorChart,
    setShowSectorChart,
    activeVerificationItem,
    setActiveVerificationItem,
    verificationModalType,
    setVerificationModalType,
    verificationNoteInput,
    setVerificationNoteInput,
    sweeperRunning,
    lastSweeperReport,
    getLogCategory,
    handleAdminLogin,
    handleAdminLogout,
    handleToggleEncryption,
    handleRunSweeper,
    handleReactivatePublisher,
    handleWeightChange,
    handleResetWeights,
    handleApproveVerification,
    handleRejectVerification,
    handleRequestInfoVerification,
    handleResolveReport,
  };
}

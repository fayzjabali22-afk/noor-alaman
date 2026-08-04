import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  Publisher,
  FairEngineWeights,
  VerificationQueueItem,
  ReportItem,
  AuditLog,
  AuditActionCategory,
  Language,
} from '../types';
import { translations } from '../lib/i18n';
import { defaultFairEngineWeights } from '../lib/fairEngine';
import { runDormantChannelSweeper } from '../lib/dormantSweeper';
import { apiAdapter } from '../services/apiAdapter';
import { ErrorDictionaryExplorer } from './ErrorDictionaryExplorer';
import {
  SlidersHorizontal,
  History as HistoryIcon,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  FileText,
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Check,
  UserCheck,
  Trash2,
  Zap,
  RefreshCw,
  Sparkles,
  BookOpen,
  Lock,
  Unlock,
  KeyRound,
  LogIn,
  LogOut,
  Server,
  Activity,
  Layers,
  Cpu,
  Wifi,
  Globe,
  Radio,
  Terminal,
  Search,
  X,
  Calendar,
  User,
  Filter,
  Clock,
  ChevronDown,
  BarChart2,
  PieChart as PieChartIcon,
  TrendingUp,
} from 'lucide-react';

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

  // Developer Login State (Bypass auth for dev stage as requested)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('noor_admin_logged_in') === 'true';
    } catch (err) {
      console.warn('LocalStorage read warning in AdminPortalView:', err);
      return false;
    }
  });

  const [adminEmail, setAdminEmail] = useState('admin@nooralamani.gov');
  const [adminPasscode, setAdminPasscode] = useState('••••••••••••');

  // Encryption protocol toggle state
  const [isEncryptionActive, setIsEncryptionActive] = useState<boolean>(true);

  // Search, Category, and Time Range filters for audit logs
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

  // Helper to resolve action category (with keyword fallback)
  const getLogCategory = (log: AuditLog): AuditActionCategory => {
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
  };

  const [activeSubTab, setActiveSubTab] = useState<
    'WEIGHTS' | 'AUDIT' | 'ENCRYPTION' | 'VERIFICATION' | 'REPORTS' | 'SWEEPER' | 'ERRORS' | 'FUTURE_EXTENSIONS'
  >('WEIGHTS');

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

  // Handle Login Action (Dev mode bypass)
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    try {
      localStorage.setItem('noor_admin_logged_in', 'true');
    } catch (err) {
      console.error(err);
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
  };

  const handleAdminLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.setItem('noor_admin_logged_in', 'false');
    } catch (err) {
      console.error(err);
    }
  };

  // Toggle Encryption Protocol
  const handleToggleEncryption = () => {
    const nextState = !isEncryptionActive;
    setIsEncryptionActive(nextState);

    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: 'مدير العمليات السيادية',
      role: 'ADMIN',
      action: `تعديل بروتوكول تشفير الاتصالات إلى [${nextState ? 'مشفّر سيادياً TLS 1.3 / Quantum Shield' : 'تشفير قياسي'}]`,
      details: `تم تغيير حالة تشفير الربط والشبكة عبر غرفة التحكم والسيطرة المباشرة.`,
      category: 'SECURITY',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  const handleRunSweeper = async () => {
    setSweeperRunning(true);
    try {
      const report = await apiAdapter.triggerCronSweeper();
      setLastSweeperReport(report);

      // Run local 45-day Dormant Channel Sweeper
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
      console.error('Sweeper execution failed:', err);
    } finally {
      setSweeperRunning(false);
    }
  };

  const handleReactivatePublisher = (publisherId: string) => {
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
  };

  // Handle Weight Sliders
  const handleWeightChange = (key: keyof FairEngineWeights, value: number) => {
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
    apiAdapter.syncAuditLog(log);
  };

  const handleResetWeights = () => {
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
    apiAdapter.syncAuditLog(log);
  };

  // Verification Queue Decision Handlers
  const handleApproveVerification = (item: VerificationQueueItem, customNote?: string) => {
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
    apiAdapter.syncVerificationQueue(updatedQueue);

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
    apiAdapter.syncAuditLog(log);
  };

  const handleRejectVerification = (item: VerificationQueueItem, reason: string) => {
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
    apiAdapter.syncVerificationQueue(updatedQueue);

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
    apiAdapter.syncAuditLog(log);
  };

  const handleRequestInfoVerification = (item: VerificationQueueItem, infoNeeded: string) => {
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
    apiAdapter.syncVerificationQueue(updatedQueue);

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
    apiAdapter.syncAuditLog(log);
  };

  // Report Resolution
  const handleResolveReport = (reportId: string) => {
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
  };

  // =========================================================================
  // 1️⃣ GATEKEEPER LOGIN SCREEN (شاشة تسجيل دخول مدير النظام - بوابة مرحلة الدخول للتطوير)
  // =========================================================================
  if (!isLoggedIn) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 py-6 px-4">
        <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Top Decorative Lights */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

          {/* Header Badge & Title */}
          <div className="text-center space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-black border border-rose-500/30 shadow-inner">
              <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>قطاع المشرف - بوابة الوصول إلى غرفة العمليات (Gatekeeper Access)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              شاشة تسجيل دخول مدير النظام
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              بوابة الوصول الإداري السيادي - غرفة عمليات التحكم في النظام والإشراف المباشر منصة نور الأماني
            </p>
          </div>

          {/* Explicit Development Mode Notice Bar (شريط تنبيه صريح يتيح الدخول الفوري) */}
          <div className="bg-amber-950/50 border-2 border-amber-500/60 rounded-2xl p-4 sm:p-5 text-xs space-y-2 relative z-10 shadow-lg shadow-amber-950/30">
            <div className="flex items-center gap-2 font-black text-amber-300 text-sm">
              <Zap className="w-5 h-5 text-amber-400 animate-bounce" />
              <span>شريط تنبيه مرحلة الدخول للتطوير (Dev Mode Instant Access):</span>
            </div>
            <p className="text-slate-200 leading-relaxed font-medium">
              لتسهيل عمليات البرمجة، التطوير، والتجربة الميدانية السريعة، تم تفعيل <strong>مقبض الدخول الفوري والمباشر بنقرة زر واحدة</strong> بدون اشتراط التحقق الإلكتروني أو كلمة المرور حالياً. يمكنك النقر أدناه للدخول المباشر إلى غرفة العمليات السحابية.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4 relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <KeyRound className="w-3.5 h-3.5 text-rose-400" />
                  <span>معرّف حساب المشرف السيادي</span>
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 transition font-mono"
                  placeholder="admin@nooralamani.gov"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-rose-400" />
                  <span>رمز حماية غرفة العمليات</span>
                </label>
                <input
                  type="password"
                  value={adminPasscode}
                  onChange={(e) => setAdminPasscode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 transition font-mono"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-600 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-rose-950/60 text-sm transition transform active:scale-98 border border-rose-400/30 cursor-pointer"
            >
              <LogIn className="w-5 h-5 text-white" />
              <span>الدخول الفوري والمباشر إلى غرفة العمليات (نقرة زر واحدة للتطوير)</span>
            </button>
          </form>

          {/* Future Readiness Section: Biometrics & Legal System Private Keys */}
          <div className="pt-5 border-t border-slate-800/80 space-y-3 relative z-10">
            <div className="flex items-center gap-2 text-xs font-black text-slate-300">
              <Cpu className="w-4 h-4 text-purple-400" />
              <span>جاهز للمستقبل الداخلي (Internal Future Extensions Readiness):</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Slot 1: Biometric Authentication */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-purple-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>شهادات المصادقة البيومترية</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                    SLOT READY
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  مقبض مدمج لمطابقة البصمة الحيوية وبصمة الوجه المعتمدة قانونياً لمديري النظام.
                </p>
              </div>

              {/* Slot 2: Legal System Private Keys */}
              <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-indigo-500/30 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                    <span>المفاتيح الخاصة بالنظام القانوني</span>
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                    RSA-4096 ACTIVE
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  توقيع قرارات الحوكمة ومحاضر الاعتماد بالختم الرقمي القانوني السيادي.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2️⃣ OPERATIONS CONTROL ROOM SCREEN (شاشة مدير النظام - غرفة العمليات والتحكم)
  // =========================================================================
  return (
    <div className="space-y-8">
      {/* Top Banner & Command Room Header */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/60 border border-rose-500/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-black border border-rose-500/20">
              <ShieldAlert className="w-4 h-4" />
              <span>قطاع المشرف - غرفة عمليات التحكم والسيطرة المباشرة</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-wide flex items-center gap-2">
              <span>غرفة عمليات التحكم في النظام والإشراف عليه</span>
            </h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-2xl leading-relaxed">
              المركز المرجعي السيادي للتحكم المباشر في خوارزميات العدالة، تشفير الربط، سجلات التدقيق والحوكمة، معالجة المراجعات والبلاغات.
            </p>
          </div>

          {/* Quick Exit Action */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAdminLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/30 text-xs font-bold transition shadow-md"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>إغلاق غرفة العمليات (خروج)</span>
            </button>
          </div>
        </div>

        {/* Essential Operation Action Controls (الأزرار الأساسية المطلوبة) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          {/* 1. Encryption Button & Status */}
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <Wifi className="w-4 h-4 text-emerald-400" />
                <span>بروتوكول تشفير الاتصالات</span>
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isEncryptionActive
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                }`}
              >
                {isEncryptionActive ? 'مشفّر سيادياً' : 'تشفير قياسي'}
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              {isEncryptionActive
                ? 'ربط مشفّر بالكامل بتشفير TLS 1.3 ومحمّي ببروتوكولات Quantum Shield.'
                : 'تشفير شبكة افتراضي. اضغط لتفعيل الحماية المتقدمة.'}
            </p>

            <button
              onClick={handleToggleEncryption}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                isEncryptionActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isEncryptionActive ? 'تشفير الاتصالات والربط (نشط)' : 'تفعيل تشفير الاتصالات المتقدم'}</span>
            </button>
          </div>

          {/* 2. Audit Log Button */}
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>سجل التدقيق والحوكمة</span>
              </span>
              <span className="text-indigo-400 font-mono text-[11px] font-bold">
                {auditLogs.length} سجلات
              </span>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              تتبع جميع التعديلات والأوامر الصادرة داخل المنصة بتبعية زمانية سيادية.
            </p>

            <button
              onClick={() => setActiveSubTab('AUDIT')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                activeSubTab === 'AUDIT'
                  ? 'bg-indigo-500 text-slate-950 font-black'
                  : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-500/30'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>فتح سجل التدقيق الآن</span>
            </button>
          </div>

          {/* 3. Smart FAIR Engine Button */}
          <div className="bg-slate-950/90 p-4 rounded-2xl border border-slate-800 space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-amber-400" />
                <span>محرك العدالة الذكي (FAIR Engine)</span>
              </span>
              <span className="text-amber-400 font-mono text-[11px] font-bold">v1.0 ACTIVE</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-tight">
              ضبط المعاملات الحسابية لتوزيع نسب الظهور والدعم التكافلي بحوكمة وعدالة.
            </p>

            <button
              onClick={() => setActiveSubTab('WEIGHTS')}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition ${
                activeSubTab === 'WEIGHTS'
                  ? 'bg-amber-500 text-slate-950 font-black'
                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>زر محرك العدالة الذكي (FAIR Engine)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Operations Control Room Command Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto text-xs font-medium scrollbar-none">
        <button
          onClick={() => setActiveSubTab('WEIGHTS')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
            activeSubTab === 'WEIGHTS'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>زر محرك العدالة الذكي (FAIR Engine)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('AUDIT')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
            activeSubTab === 'AUDIT'
              ? 'bg-indigo-500 text-slate-950 font-black shadow-lg shadow-indigo-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>سجل التدقيق الحوكمي ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ENCRYPTION')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
            activeSubTab === 'ENCRYPTION'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span>تشفير الاتصالات والربط</span>
        </button>

        <button
          onClick={() => setActiveSubTab('VERIFICATION')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
            activeSubTab === 'VERIFICATION'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>طابور التحقق ({verificationQueue.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('REPORTS')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
            activeSubTab === 'REPORTS'
              ? 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>البلاغات ({reports.filter((r) => r.status === 'INVESTIGATING' || r.status === 'OPEN').length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('SWEEPER')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
            activeSubTab === 'SWEEPER'
              ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
              : 'bg-slate-900 text-amber-300 hover:bg-slate-800 border border-amber-500/20'
          }`}
        >
          <Trash2 className="w-4 h-4 text-amber-400" />
          <span>المكنسة البرمجية (Sweeper)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('ERRORS')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
            activeSubTab === 'ERRORS'
              ? 'bg-sky-500 text-slate-950 font-black shadow-lg shadow-sky-500/20'
              : 'bg-slate-900 text-sky-300 hover:bg-slate-800 border border-sky-500/20'
          }`}
        >
          <BookOpen className="w-4 h-4 text-sky-400" />
          <span>قاموس الأخطاء SSOT والامتثال</span>
        </button>

        <button
          onClick={() => setActiveSubTab('FUTURE_EXTENSIONS')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap ${
            activeSubTab === 'FUTURE_EXTENSIONS'
              ? 'bg-purple-500 text-white font-black shadow-lg shadow-purple-500/20'
              : 'bg-slate-900 text-purple-300 hover:bg-slate-800 border border-purple-500/20'
          }`}
        >
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>تجهيز للتطوير القادم</span>
        </button>
      </div>

      {/* Tab 1: Smart FAIR Engine Weights Control */}
      {activeSubTab === 'WEIGHTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-amber-400" />
                <span>معاملات وأوزان محرك العدالة الذكي (FAIR Engine Configuration)</span>
              </h3>
              <p className="text-xs text-slate-300">
                تحديد الثقل الحسابي للأنشطة المختلفة لتوزيع فرص الظهور والدعم بين الناشرين دون محاباة.
              </p>
            </div>

            <button
              onClick={handleResetWeights}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>استعادة الأوزان الافتراضية</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Visits Weight */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">وزن أولوية الزيارات المنخفضة (Visits Weight)</span>
                <span className="text-emerald-400 font-mono">{weights.visitsWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.visitsWeight}
                onChange={(e) => handleWeightChange('visitsWeight', Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">منح أولوية إضافية للناشرين الأقل تلقياً للزيارات لتكافؤ الفرص.</p>
            </div>

            {/* Verification Weight */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-indigo-300">وزن درجة التوثيق (Verification Weight)</span>
                <span className="text-indigo-400 font-mono">{weights.verificationWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.verificationWeight}
                onChange={(e) => handleWeightChange('verificationWeight', Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">مكافأة الحسابات الموثقة بشهادات التحقق السيادية.</p>
            </div>

            {/* Trust Score Weight */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-amber-300">وزن معامل الثقة المرجعية (Trust Score Weight)</span>
                <span className="text-amber-400 font-mono">{weights.trustScoreWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.trustScoreWeight}
                onChange={(e) => handleWeightChange('trustScoreWeight', Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">وزن الاستقرار الجغرافي ونقاء السجل الإنساني.</p>
            </div>

            {/* Report Penalty Weight */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-rose-300">خصم البلاغات والانتهاكات (Report Penalty Weight)</span>
                <span className="text-rose-400 font-mono">{weights.reportPenaltyWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.reportPenaltyWeight}
                onChange={(e) => handleWeightChange('reportPenaltyWeight', Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">مقدار الخصم الحسابي لدرجة العدالة عند وجود بلاغات غير معالجة.</p>
            </div>

            {/* Recency Weight */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-sky-300">وزن زمن الظهور الأخير (Recency Weight)</span>
                <span className="text-sky-400 font-mono">{weights.recencyWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.recencyWeight}
                onChange={(e) => handleWeightChange('recencyWeight', Number(e.target.value))}
                className="w-full accent-sky-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">إعطاء فرصة لمن لم يظهر حسابه للجمهور منذ فترة أطول.</p>
            </div>

            {/* Lifecycle Stage Weight */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-purple-300">وزن مرحلة دورة الحياة (Lifecycle Stage Weight)</span>
                <span className="text-purple-400 font-mono">{weights.lifecycleStageWeight}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={weights.lifecycleStageWeight}
                onChange={(e) => handleWeightChange('lifecycleStageWeight', Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <p className="text-[11px] text-slate-400">مراعاة ترتيب القنوات القائمة في المراحل التكافلية المختلفة.</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Audit Logs */}
      {activeSubTab === 'AUDIT' && (() => {
        // Sensitivity helper detectors
        const isSecurityLog = (log: AuditLog): boolean => {
          const cat = getLogCategory(log);
          if (cat === 'SECURITY') return true;
          const text = (log.action + ' ' + log.details).toLowerCase();
          return (
            text.includes('أمني') ||
            text.includes('تشفير') ||
            text.includes('مفتاح') ||
            text.includes('اختراق') ||
            text.includes('مشبوه') ||
            text.includes('حظر') ||
            text.includes('جدار')
          );
        };

        const isSensitiveProcedural = (log: AuditLog): boolean => {
          if (isSecurityLog(log)) return false;
          const text = (log.action + ' ' + log.details).toLowerCase();
          return (
            text.includes('حساس') ||
            text.includes('تعديل أوزان') ||
            text.includes('تعديل الوزن') ||
            text.includes('تجميد') ||
            text.includes('إلغاء اعتماد') ||
            text.includes('صلاحيات') ||
            text.includes('مخاطر') ||
            text.includes('استثناء') ||
            text.includes('طوارئ') ||
            text.includes('ترقية درجة') ||
            text.includes('انتقال')
          );
        };

        const categoryCounts = {
          ALL: auditLogs.length,
          SECURITY: auditLogs.filter((l) => getLogCategory(l) === 'SECURITY').length,
          PROCEDURAL: auditLogs.filter((l) => getLogCategory(l) === 'PROCEDURAL').length,
          TECHNICAL: auditLogs.filter((l) => getLogCategory(l) === 'TECHNICAL').length,
          SENSITIVE: auditLogs.filter((l) => isSecurityLog(l) || isSensitiveProcedural(l)).length,
        };

        // Time range logs filter for Recharts analytics
        const timeRangeFilteredLogs = auditLogs.filter((log) => {
          if (auditTimeRange !== 'ALL') {
            const logTime = new Date(log.timestamp).getTime();
            const now = Date.now();
            const diffDays = (now - logTime) / (1000 * 60 * 60 * 24);
            if (auditTimeRange === 'TODAY' && diffDays > 1.5) return false;
            if (auditTimeRange === 'WEEK' && diffDays > 7.5) return false;
            if (auditTimeRange === 'MONTH' && diffDays > 30.5) return false;
          }
          return true;
        });

        // Helper to categorize log into platform sector
        const getSectorKey = (log: AuditLog): 'JASMINE' | 'DALAL' | 'RAEDA' => {
          const text = (log.action + ' ' + log.details + ' ' + log.actor).toLowerCase();
          if (text.includes('ياسمين') || text.includes('إسناد') || text.includes('سفير') || text.includes('شخصية') || text.includes('jasmine')) {
            return 'JASMINE';
          }
          if (text.includes('دلال') || text.includes('انتقال') || text.includes('تمكين') || text.includes('صمود') || text.includes('dalal')) {
            return 'DALAL';
          }
          if (text.includes('رائدة') || text.includes('رائده') || text.includes('تخرج') || text.includes('استدامة') || text.includes('شفاء') || text.includes('raeda')) {
            return 'RAEDA';
          }
          if (log.id.endsWith('1') || log.id.endsWith('4')) return 'JASMINE';
          if (log.id.endsWith('2') || log.id.endsWith('6')) return 'DALAL';
          return 'RAEDA';
        };

        // Compute sector distributions for selected time period
        let jasmineCount = 0;
        let dalalCount = 0;
        let raedaCount = 0;

        timeRangeFilteredLogs.forEach((log) => {
          const sec = getSectorKey(log);
          if (sec === 'JASMINE') jasmineCount += 1;
          else if (sec === 'DALAL') dalalCount += 1;
          else if (sec === 'RAEDA') raedaCount += 1;
        });

        // Add publishers in each sector stage
        publishers.forEach((p) => {
          if (p.lifecycleStage === 'DALAL_TRANSITION' || (p as any).stage === 'JASMINE') jasmineCount += 1;
          else if (p.lifecycleStage === 'STABILIZATION' || (p as any).stage === 'DALAL') dalalCount += 1;
          else if (p.lifecycleStage === 'RAEDA_SUCCESS' || (p as any).stage === 'RAEDA') raedaCount += 1;
        });

        const totalSectorRecords = jasmineCount + dalalCount + raedaCount;

        const sectorPieData = [
          { name: '🌸 قطاع الياسمين', value: jasmineCount, color: '#ec4899', percentage: totalSectorRecords ? Math.round((jasmineCount / totalSectorRecords) * 100) : 0 },
          { name: '🌱 قطاع دلال', value: dalalCount, color: '#10b981', percentage: totalSectorRecords ? Math.round((dalalCount / totalSectorRecords) * 100) : 0 },
          { name: '🚀 قطاع رائدة', value: raedaCount, color: '#3b82f6', percentage: totalSectorRecords ? Math.round((raedaCount / totalSectorRecords) * 100) : 0 },
        ];

        // Prepare date-based time series for BarChart
        const dateMap: Record<string, { date: string; 'قطاع الياسمين': number; 'قطاع دلال': number; 'قطاع رائدة': number }> = {};

        timeRangeFilteredLogs.forEach((log) => {
          const dateObj = new Date(log.timestamp);
          const formattedDate = dateObj.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
          if (!dateMap[formattedDate]) {
            dateMap[formattedDate] = {
              date: formattedDate,
              'قطاع الياسمين': 0,
              'قطاع دلال': 0,
              'قطاع رائدة': 0,
            };
          }
          const sec = getSectorKey(log);
          if (sec === 'JASMINE') dateMap[formattedDate]['قطاع الياسمين'] += 1;
          else if (sec === 'DALAL') dateMap[formattedDate]['قطاع دلال'] += 1;
          else if (sec === 'RAEDA') dateMap[formattedDate]['قطاع رائدة'] += 1;
        });

        const timeSeriesBarData = Object.values(dateMap);

        const filteredLogs = auditLogs.filter((log) => {
          const cat = getLogCategory(log);
          const isSec = isSecurityLog(log);
          const isSens = isSensitiveProcedural(log);

          if (selectedAuditCategory === 'SENSITIVE') {
            if (!isSec && !isSens) return false;
          } else if (selectedAuditCategory !== 'ALL' && cat !== selectedAuditCategory) {
            return false;
          }

          if (auditTimeRange !== 'ALL') {
            const logTime = new Date(log.timestamp).getTime();
            const now = Date.now();
            const diffDays = (now - logTime) / (1000 * 60 * 60 * 24);
            if (auditTimeRange === 'TODAY' && diffDays > 1.5) return false;
            if (auditTimeRange === 'WEEK' && diffDays > 7.5) return false;
            if (auditTimeRange === 'MONTH' && diffDays > 30.5) return false;
          }

          if (!auditSearchQuery.trim()) return true;
          const q = auditSearchQuery.toLowerCase().trim();

          const isoDate = log.timestamp ? log.timestamp.toLowerCase() : '';
          const arabicDate = log.timestamp ? new Date(log.timestamp).toLocaleString('ar-EG').toLowerCase() : '';
          const standardDate = log.timestamp ? new Date(log.timestamp).toLocaleDateString().toLowerCase() : '';

          return (
            log.actor.toLowerCase().includes(q) ||
            log.role.toLowerCase().includes(q) ||
            log.action.toLowerCase().includes(q) ||
            log.details.toLowerCase().includes(q) ||
            log.id.toLowerCase().includes(q) ||
            isoDate.includes(q) ||
            arabicDate.includes(q) ||
            standardDate.includes(q)
          );
        });

        return (
          <div className={`border rounded-2xl p-6 space-y-5 shadow-xl transition-colors duration-300 ${
            isReadingMode
              ? 'bg-slate-950/90 border-amber-900/40 reading-content-card'
              : 'bg-slate-900 border-slate-800'
          }`}>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <FileText className={`w-5 h-5 ${isReadingMode ? 'text-amber-400' : 'text-indigo-400'}`} />
                    <span>سجل التدقيق الأمني والحوكمي المباشر (SSOT Governance Ledger)</span>
                  </h3>
                  {isReadingMode && (
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                      وضع القراءة المريح 📖
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400">
                  شاشة شاملة لتتبع وقراءة كافة سجلات النشاط والتغييرات المباشرة بتبعية رقمية، مع ميزة التصنيف والبحث النصي الذكي بالسجلات.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                {/* Reading Mode Quick Switch Button */}
                {onToggleReadingMode && (
                  <button
                    onClick={() => onToggleReadingMode(!isReadingMode)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shrink-0 ${
                      isReadingMode
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:text-white hover:bg-slate-800'
                    }`}
                    title="مفتاح وضع القراءة لتقليل تشتت الألوان وتوفير تجربة مريحة للعين"
                  >
                    <BookOpen className={`w-4 h-4 ${isReadingMode ? 'text-amber-400 animate-pulse' : 'text-slate-400'}`} />
                    <span className="hidden sm:inline">{isReadingMode ? 'وضع القراءة مُفعّل' : 'تفعيل وضع القراءة'}</span>
                  </button>
                )}

                {/* Time Range Filter Dropdown */}
                <div className="relative w-full sm:w-auto shrink-0">
                  <select
                    value={auditTimeRange}
                    onChange={(e) => setAuditTimeRange(e.target.value as 'ALL' | 'TODAY' | 'WEEK' | 'MONTH')}
                    className="w-full sm:w-auto bg-slate-950 border border-slate-800 text-amber-300 font-bold rounded-xl pr-8 pl-8 py-2 text-xs focus:outline-none focus:border-indigo-500 transition cursor-pointer appearance-none shadow-sm hover:border-slate-700"
                    title="تصفية سجلات الحوكمة بناءً على النطاق الزمني"
                  >
                    <option value="ALL" className="bg-slate-900 text-white font-medium">🗓️ كافة الأوقات (الكل)</option>
                    <option value="TODAY" className="bg-slate-900 text-white font-medium">⚡ اليوم (آخر 24 ساعة)</option>
                    <option value="WEEK" className="bg-slate-900 text-white font-medium">📅 آخر 7 أيام</option>
                    <option value="MONTH" className="bg-slate-900 text-white font-medium">📆 آخر 30 يوماً</option>
                  </select>
                  <Clock className="w-3.5 h-3.5 absolute right-2.5 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none" />
                  <ChevronDown className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>

                {/* Enhanced Search Input Bar with Clear Button */}
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={auditSearchQuery}
                    onChange={(e) => setAuditSearchQuery(e.target.value)}
                    placeholder="ابحث بهوية الفاعل، التاريخ..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-9 pl-8 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition font-medium"
                  />
                  {auditSearchQuery && (
                    <button
                      onClick={() => setAuditSearchQuery('')}
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800 transition"
                      title="مسح محتوى البحث"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Search Suggestions / Shortcuts for Actor Identity & Dates */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
              <span className="font-bold text-slate-300 flex items-center gap-1 shrink-0">
                <Filter className="w-3 h-3 text-indigo-400" />
                <span>اختصارات البحث السريع:</span>
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                <button
                  onClick={() => setAuditSearchQuery('خالد العلي')}
                  className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 transition flex items-center gap-1"
                >
                  <User className="w-2.5 h-2.5 text-indigo-400" />
                  <span>م. خالد العلي</span>
                </button>
                <button
                  onClick={() => setAuditSearchQuery('التحقق الآلي')}
                  className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 transition flex items-center gap-1"
                >
                  <User className="w-2.5 h-2.5 text-emerald-400" />
                  <span>التحقق الآلي</span>
                </button>
                <button
                  onClick={() => setAuditSearchQuery('2026-07-28')}
                  className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 transition flex items-center gap-1 font-mono"
                >
                  <Calendar className="w-2.5 h-2.5 text-amber-400" />
                  <span>2026-07-28</span>
                </button>
                <button
                  onClick={() => setAuditSearchQuery('2026-07-25')}
                  className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 transition flex items-center gap-1 font-mono"
                >
                  <Calendar className="w-2.5 h-2.5 text-amber-400" />
                  <span>2026-07-25</span>
                </button>
                {(auditSearchQuery || auditTimeRange !== 'ALL' || selectedAuditCategory !== 'ALL') && (
                  <button
                    onClick={() => {
                      setAuditSearchQuery('');
                      setAuditTimeRange('ALL');
                      setSelectedAuditCategory('ALL');
                    }}
                    className="px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition flex items-center gap-1 font-bold"
                    title="تفريغ كافة الخيارات والعودة لعرض كافة سجلات الحوكمة"
                  >
                    <span>إعادة ضبط كافة الفلاتر ↺</span>
                  </button>
                )}
              </div>
            </div>

            {/* Recharts Sector Patterns Analysis Panel */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4 shadow-inner">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                <div className="space-y-0.5">
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-amber-400" />
                    <span>توزيع سجلات وأنشطة القطاعات السيادية (Recharts Sector Analytics)</span>
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-mono">
                      {auditTimeRange === 'ALL' ? 'كافة الأوقات' : auditTimeRange === 'TODAY' ? 'آخر 24 ساعة' : auditTimeRange === 'WEEK' ? 'آخر 7 أيام' : 'آخر 30 يوماً'}
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    رسم بياني مباشر برصد توزيع السجلات التكافلية لقطاعات (الياسمين 🌸، دلال 🌱، رائدة 🚀) خلال الفترة الزمنية المحددة لرصد الأنماط والاتجاهات.
                  </p>
                </div>

                <button
                  onClick={() => setShowSectorChart(!showSectorChart)}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 transition font-bold shrink-0"
                >
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>{showSectorChart ? 'إخفاء الرسم البياني' : 'إظهار الرسم البياني'}</span>
                </button>
              </div>

              {showSectorChart && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
                  {/* Chart 1: Sector Distribution BarChart over Time */}
                  <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800/90 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800/60 pb-2">
                      <span className="flex items-center gap-1.5">
                        <BarChart2 className="w-3.5 h-3.5 text-indigo-400" />
                        <span>نشاط القطاعات حسب التسلسل الزمني</span>
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">سجلات الحوكمة</span>
                    </div>

                    <div className="h-52 w-full pt-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={timeSeriesBarData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                          <XAxis dataKey="date" stroke="#94a3b8" fontSize={10} tickLine={false} />
                          <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} allowDecimals={false} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              borderColor: '#334155',
                              borderRadius: '0.75rem',
                              color: '#f8fafc',
                              fontSize: '11px',
                              direction: 'rtl',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                            }}
                          />
                          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '6px' }} />
                          <Bar dataKey="قطاع الياسمين" fill="#ec4899" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="قطاع دلال" fill="#10b981" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="قطاع رائدة" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Chart 2: Sector Share Pie Chart */}
                  <div className="bg-slate-900/90 p-4 rounded-xl border border-slate-800/90 space-y-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800/60 pb-2">
                      <span className="flex items-center gap-1.5">
                        <PieChartIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>نسبة توزيع السجلات بين القطاعات الثلاثة</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">إجمالي: {totalSectorRecords} سجل</span>
                    </div>

                    <div className="h-40 w-full flex items-center justify-center">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={sectorPieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={40}
                            outerRadius={65}
                            paddingAngle={4}
                            dataKey="value"
                            nameKey="name"
                          >
                            {sectorPieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip
                            contentStyle={{
                              backgroundColor: '#0f172a',
                              borderColor: '#334155',
                              borderRadius: '0.75rem',
                              color: '#f8fafc',
                              fontSize: '11px',
                              direction: 'rtl',
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Custom Sector Badges */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      {sectorPieData.map((s) => (
                        <div key={s.name} className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 text-center space-y-0.5">
                          <div className="text-[10px] font-bold text-slate-300 truncate" title={s.name}>
                            {s.name}
                          </div>
                          <div className="text-xs font-black font-mono" style={{ color: s.color }}>
                            {s.value} ({s.percentage}%)
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Classification Filter Toolbar (تصنيف سجلات الحوكمة حسب نوع الفعل) */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                  <span>تصنيف أفعال السجل الحوكمي (Action Category Filter):</span>
                </span>
                <span className="text-[11px] text-slate-400 font-normal">
                  عرض {filteredLogs.length} من أصل {auditLogs.length} سجلاً
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  onClick={() => setSelectedAuditCategory('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    selectedAuditCategory === 'ALL'
                      ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-slate-400" />
                  <span>كافة الأفعال</span>
                  <span className="px-1.5 py-0.2 text-[10px] bg-slate-800 text-slate-300 rounded-full font-mono">
                    {categoryCounts.ALL}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedAuditCategory('SECURITY')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    selectedAuditCategory === 'SECURITY'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>أمني (Security)</span>
                  <span className="px-1.5 py-0.2 text-[10px] bg-emerald-950 text-emerald-300 rounded-full font-mono border border-emerald-500/30">
                    {categoryCounts.SECURITY}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedAuditCategory('PROCEDURAL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    selectedAuditCategory === 'PROCEDURAL'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>إجرائي (Procedural)</span>
                  <span className="px-1.5 py-0.2 text-[10px] bg-amber-950 text-amber-300 rounded-full font-mono border border-amber-500/30">
                    {categoryCounts.PROCEDURAL}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedAuditCategory('TECHNICAL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    selectedAuditCategory === 'TECHNICAL'
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span>تقني (Technical)</span>
                  <span className="px-1.5 py-0.2 text-[10px] bg-cyan-950 text-cyan-300 rounded-full font-mono border border-cyan-500/30">
                    {categoryCounts.TECHNICAL}
                  </span>
                </button>

                <button
                  onClick={() => setSelectedAuditCategory('SENSITIVE')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                    selectedAuditCategory === 'SENSITIVE'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                  title="تصفية وإظهار السجلات الأمنية والإجراءات الإدارية الحساسة فقط"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
                  <span>🚨 أنشطة أمنية وحساسة</span>
                  <span className="px-1.5 py-0.2 text-[10px] bg-rose-950 text-rose-300 rounded-full font-mono border border-rose-500/30">
                    {categoryCounts.SENSITIVE}
                  </span>
                </button>
              </div>
            </div>

            {/* Audit Logs List View */}
            <div className="divide-y divide-slate-800 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin space-y-2">
              {filteredLogs.map((log) => {
                const cat = getLogCategory(log);
                const isSec = isSecurityLog(log);
                const isSensProc = isSensitiveProcedural(log);

                let containerStyle = 'hover:bg-slate-950/40 border-slate-800/80';
                let badgeStyle = 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
                let iconComponent = <FileText className="w-3 h-3 text-indigo-400" />;
                let catLabel = 'إجرائي';

                if (cat === 'SECURITY') {
                  badgeStyle = 'bg-rose-500/10 text-rose-300 border-rose-500/30';
                  iconComponent = <ShieldCheck className="w-3 h-3 text-rose-400" />;
                  catLabel = 'أمني';
                } else if (cat === 'TECHNICAL') {
                  badgeStyle = 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
                  iconComponent = <Cpu className="w-3 h-3 text-cyan-400" />;
                  catLabel = 'تقني';
                }

                if (isSec) {
                  containerStyle = 'bg-rose-950/20 border-r-4 border-r-rose-500 border-rose-500/40 shadow-lg shadow-rose-950/20 hover:bg-rose-950/30';
                } else if (isSensProc) {
                  containerStyle = 'bg-amber-950/20 border-r-4 border-r-amber-500 border-amber-500/40 shadow-md hover:bg-amber-950/30';
                }

                return (
                  <div key={log.id} className={`pt-3 pb-3 text-xs space-y-2 p-3 rounded-xl border transition ${containerStyle}`}>
                    <div className="flex items-center justify-between text-slate-400 font-mono text-[11px] flex-wrap gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-indigo-300 font-bold">{log.actor} ({log.role})</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeStyle}`}>
                          {iconComponent}
                          <span>{catLabel}</span>
                        </span>

                        {/* Visual Alert Badge for Security */}
                        {isSec && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-sm animate-pulse">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                            <span>🚨 تنبيه أمني - عالي الحساسية</span>
                          </span>
                        )}

                        {/* Visual Alert Badge for Sensitive Procedural */}
                        {isSensProc && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span>⚠️ إجراء إداري حساس</span>
                          </span>
                        )}
                      </div>
                      <span className="text-slate-500">{new Date(log.timestamp).toLocaleString('ar-EG')}</span>
                    </div>

                    <h4 className="font-bold text-white text-sm flex items-center gap-2">
                      <span>{log.action}</span>
                    </h4>

                    <p className="text-slate-300 bg-slate-950 p-3 rounded-xl border border-slate-800/80 leading-relaxed font-medium">
                      {log.details}
                    </p>
                  </div>
                );
              })}

              {filteredLogs.length === 0 && (
                <div className="py-12 text-center text-slate-400 text-xs bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                    <Search className="w-5 h-5" />
                  </div>
                  <p className="font-bold">لا توجد سجلات تدقيق مطابقة للتصنيف والبحث الحالي.</p>
                  <p className="text-slate-500 text-[11px]">يمكنك تصفير الفلترة أو تغيير كلمة البحث للاطلاع على باقي الأفعال.</p>
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Tab 3: Encryption Protocol Management */}
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
              onClick={handleToggleEncryption}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg ${
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

      {/* Tab 4: Verification Queue */}
      {activeSubTab === 'VERIFICATION' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-emerald-400" />
                <span>طابور المراجعة والتحقق للحوكمة المرجعية ({verificationQueue.length})</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                مراجعة وتدقيق أهليات الناشرين وفق معايير الحوكمة المرجعية والتحقق الهجين.
              </p>
            </div>
          </div>

          {verificationQueue.length === 0 ? (
            <div className="text-center py-12 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
              <p className="font-bold text-white text-sm">لا توجد طلبات توثيق معلقة حالياً في طابور المراجعة.</p>
              <p className="text-slate-500 text-[11px]">كافة طلبات التوثيق تمت معالجتها وتسجيل نتائجها في سجل التدقيق المباشر.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {verificationQueue.map((item) => {
                const isIncomplete =
                  item.dataCompletenessScore < 70 ||
                  !item.phoneVerified ||
                  !item.emailVerified ||
                  !item.channelUrlValid;

                return (
                  <div
                    key={item.id}
                    className={`bg-slate-950 p-5 rounded-2xl border transition space-y-4 ${
                      isIncomplete
                        ? 'border-amber-500/40 bg-amber-950/10'
                        : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Item Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-black text-white text-base">{item.publisherName}</h4>
                          {/* Status Badge */}
                          {item.reviewStatus === 'APPROVED' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                              معتمد ✓
                            </span>
                          )}
                          {item.reviewStatus === 'REJECTED' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              مرفوض ✗
                            </span>
                          )}
                          {item.reviewStatus === 'NEEDS_INFO' && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              معلق - بانتظار معلومات ⏳
                            </span>
                          )}
                          {(!item.reviewStatus || item.reviewStatus === 'PENDING') && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                              قيد المراجعة 🔍
                            </span>
                          )}

                          {/* Data Completeness Score Threshold Badge */}
                          {item.dataCompletenessScore < 70 ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                              <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 animate-pulse" />
                              <span>تحذير: جودة البيانات {item.dataCompletenessScore}% (&lt; 70%)</span>
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                              <span>مكتمل الجودة ({item.dataCompletenessScore}%)</span>
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 font-mono">
                          معرف الناشر: {item.publisherId} • تاريخ التقديم:{' '}
                          {new Date(item.submittedAt).toLocaleDateString('ar-EG')}
                        </p>
                      </div>

                      {/* Completeness Score Gauge with Visual Indicator */}
                      <div
                        className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border transition ${
                          item.dataCompletenessScore >= 70
                            ? 'bg-slate-900 border-emerald-500/30'
                            : 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-950/20'
                        }`}
                      >
                        {item.dataCompletenessScore >= 70 ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
                        )}
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <span>درجة اكتمال البيانات</span>
                            {item.dataCompletenessScore < 70 && (
                              <span className="text-[9px] text-amber-400 font-black font-mono">(دون 70%)</span>
                            )}
                          </div>
                          <div
                            className={`text-sm font-black font-mono ${
                              item.dataCompletenessScore >= 80
                                ? 'text-emerald-400'
                                : item.dataCompletenessScore >= 70
                                ? 'text-emerald-300'
                                : item.dataCompletenessScore >= 50
                                ? 'text-amber-400'
                                : 'text-rose-400'
                            }`}
                          >
                            {item.dataCompletenessScore}%
                          </div>
                        </div>
                        <div className="w-12 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`h-full rounded-full ${
                              item.dataCompletenessScore >= 70
                                ? 'bg-emerald-500'
                                : item.dataCompletenessScore >= 50
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${item.dataCompletenessScore}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Indicators Grid & Safety Check */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                      <div
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          item.dataCompletenessScore >= 70
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                            : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                        }`}
                      >
                        <span className="font-bold">نصاب الجودة (&ge;70%):</span>
                        <span className="font-bold flex items-center gap-1">
                          {item.dataCompletenessScore >= 70 ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>مستوفى ({item.dataCompletenessScore}%)</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                              <span>دون النصاب ({item.dataCompletenessScore}%)</span>
                            </>
                          )}
                        </span>
                      </div>

                      <div
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          item.phoneVerified
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        <span className="font-bold">تأكيد رقم الهاتف:</span>
                        <span>{item.phoneVerified ? 'مفعل ✓' : 'غير مؤكد ✗'}</span>
                      </div>

                      <div
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          item.emailVerified
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        <span className="font-bold">البريد الإلكتروني:</span>
                        <span>{item.emailVerified ? 'مؤكد ✓' : 'غير مؤكد ✗'}</span>
                      </div>

                      <div
                        className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          item.channelUrlValid
                            ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                            : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                        }`}
                      >
                        <span className="font-bold">صحة رابط القناة:</span>
                        <span>{item.channelUrlValid ? 'سليم وحقيقي ✓' : 'غير صالح ✗'}</span>
                      </div>
                    </div>

                    {/* Low Completeness Safety Gate Alert */}
                    {isIncomplete && (
                      <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                        <span>
                          <strong>بوابة الأمان الحوكمية:</strong> درجة اكتمال البيانات أقل من النصاب التلقائي (70%). اعتماد هذا الطلب يتطلب تدوين مبرر استثناء حوكمي وسيتم تصنيفه تلقائياً كإجراء حساس بالمرصد.
                        </span>
                      </div>
                    )}

                    {/* Reviewer Notes History if exists */}
                    {item.reviewerNotes && (
                      <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1">
                        <span className="font-bold text-indigo-300 text-[11px]">ملاحظات المراجع المسجلة:</span>
                        <p className="text-slate-300 font-medium">{item.reviewerNotes}</p>
                      </div>
                    )}

                    {/* Action Controls */}
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-900">
                      <button
                        onClick={() => {
                          setActiveVerificationItem(item);
                          setVerificationModalType('REJECT');
                          setVerificationNoteInput('');
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition flex items-center gap-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>رفض الطلب</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveVerificationItem(item);
                          setVerificationModalType('NEEDS_INFO');
                          setVerificationNoteInput(item.reviewerNotes || '');
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>طلب استكمال بيانات (NEEDS_INFO)</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveVerificationItem(item);
                          if (isIncomplete) {
                            setVerificationModalType('APPROVE_EXCEPTION');
                            setVerificationNoteInput('');
                          } else {
                            setVerificationModalType('APPROVE_STANDARD');
                            setVerificationNoteInput('تم التدقيق الميداني والاعتماد القياسي لبيانات الناشر وترقية شارة التوثيق.');
                          }
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-md flex items-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>
                          {isIncomplete ? 'اعتماد استثنائي (تجاوز)' : 'اعتماد التوثيق وترقية الشارة'}
                        </span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Verification Action Modal */}
          {verificationModalType && activeVerificationItem && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h4 className="font-bold text-white text-base flex items-center gap-2">
                    {verificationModalType === 'APPROVE_STANDARD' && (
                      <>
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <span>تأكيد اعتماد التوثيق القياسي - ({activeVerificationItem.publisherName})</span>
                      </>
                    )}
                    {verificationModalType === 'APPROVE_EXCEPTION' && (
                      <>
                        <ShieldAlert className="w-5 h-5 text-amber-400" />
                        <span>اعتماد استثنائي - الناشر ({activeVerificationItem.publisherName})</span>
                      </>
                    )}
                    {verificationModalType === 'REJECT' && (
                      <>
                        <XCircle className="w-5 h-5 text-rose-400" />
                        <span>رفض طلب التوثيق - ({activeVerificationItem.publisherName})</span>
                      </>
                    )}
                    {verificationModalType === 'NEEDS_INFO' && (
                      <>
                        <AlertTriangle className="w-5 h-5 text-amber-400" />
                        <span>طلب بيانات إضافية - ({activeVerificationItem.publisherName})</span>
                      </>
                    )}
                  </h4>
                  <button
                    onClick={() => {
                      setVerificationModalType(null);
                      setActiveVerificationItem(null);
                    }}
                    className="text-slate-400 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 block">
                    {verificationModalType === 'APPROVE_STANDARD' && 'تأكيد الإجراء القياسي: سيتم منح شارة التوثيق وترقية القناة. يمكنك تدوين ملاحظات إدارية برمجية:'}
                    {verificationModalType === 'APPROVE_EXCEPTION' && 'يرجى تدوين مبرر الاستثناء الإداري لتجاوز اكتمال البيانات (إجباري):'}
                    {verificationModalType === 'REJECT' && 'يرجى تدوين السبب الحوكمي الدقيق لرفض الطلب (إجباري):'}
                    {verificationModalType === 'NEEDS_INFO' && 'تحديد النواقص والمستندات المطلوبة من الناشر (إجباري):'}
                  </label>

                  <textarea
                    rows={4}
                    value={verificationNoteInput}
                    onChange={(e) => setVerificationNoteInput(e.target.value)}
                    placeholder="اكتب الملاحظات التفصيلية هنا ليتم تسجيلها بسجل التدقيق والحوكمة المباشر..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  />
                  {verificationModalType !== 'APPROVE_STANDARD' && !verificationNoteInput.trim() && (
                    <p className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>تنبيه حوكمي: يلزم كتابة المبرر أو الملاحظات قبل تفعيل زر تأكيد الإجراء بسجل التدقيق.</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                  <button
                    onClick={() => {
                      setVerificationModalType(null);
                      setActiveVerificationItem(null);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    إلغاء
                  </button>

                  <button
                    disabled={verificationModalType !== 'APPROVE_STANDARD' && !verificationNoteInput.trim()}
                    onClick={() => {
                      if (verificationModalType !== 'APPROVE_STANDARD' && !verificationNoteInput.trim()) return;
                      if (verificationModalType === 'APPROVE_STANDARD' || verificationModalType === 'APPROVE_EXCEPTION') {
                        handleApproveVerification(activeVerificationItem, verificationNoteInput.trim() || undefined);
                      } else if (verificationModalType === 'REJECT') {
                        handleRejectVerification(activeVerificationItem, verificationNoteInput);
                      } else if (verificationModalType === 'NEEDS_INFO') {
                        handleRequestInfoVerification(activeVerificationItem, verificationNoteInput);
                      }
                      setVerificationModalType(null);
                      setActiveVerificationItem(null);
                    }}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                      verificationModalType !== 'APPROVE_STANDARD' && !verificationNoteInput.trim()
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                        : verificationModalType === 'REJECT'
                        ? 'bg-rose-600 hover:bg-rose-500 text-white'
                        : verificationModalType === 'NEEDS_INFO'
                        ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                    }`}
                  >
                    تأكيد الإجراء وتسجيل الحدث بسجل الحوكمة
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Reports Queue */}
      {activeSubTab === 'REPORTS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-400" />
            <span>{t.reportQueueTitle}</span>
          </h3>

          <div className="space-y-3">
            {reports.map((report) => (
              <div key={report.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-rose-400">بلاغ رقم #{report.id}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    report.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {report.status}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{report.evidenceDetails || (report as any).details}</p>

                {report.status !== 'RESOLVED' && (
                  <button
                    onClick={() => handleResolveReport(report.id)}
                    className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>حسم البلاغ واتخاذ القرار الحوكمي</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 6: Sovereign Sweeper */}
      {activeSubTab === 'SWEEPER' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>بروتوكول 88 - درع حماية الموارد</span>
              </div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Trash2 className="w-5 h-5 text-amber-400" />
                <span>المكنسة البرمجية وتطهير السجلات (Sovereign Code Sweeper)</span>
              </h3>
            </div>

            <button
              onClick={handleRunSweeper}
              disabled={sweeperRunning}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg ${
                sweeperRunning
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20 active:scale-95'
              }`}
            >
              {sweeperRunning ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  <span>جارِ التطهير...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-slate-950" />
                  <span>تشغيل المكنسة البرمجية فورياً</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">آخر دورة تنظيف</div>
              <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{lastSweeperReport ? lastSweeperReport.status : 'مستقرة (آلياً كل 10 د)'}</span>
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">السجلات المطهّرة</div>
              <div className="text-2xl font-black text-amber-400">
                {lastSweeperReport ? lastSweeperReport.purgedCacheEntries : 0}
              </div>
            </div>

            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
              <div className="text-xs text-slate-400">زمن التنفيذ الذري</div>
              <div className="text-2xl font-black text-sky-400 font-mono">
                {lastSweeperReport ? `${lastSweeperReport.executionTimeMs}ms` : '0ms'}
              </div>
            </div>
          </div>

          {/* Dormant Channel Inactivity Sweeper Section */}
          <div className="bg-slate-950/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HistoryIcon className="w-4 h-4 text-amber-400" />
                  <span>محرك مسح خمول القنوات والتخفيض العادل (Dormant Channel Sweeper - 45 Days)</span>
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  الأمر السيادي التنفيذي (CMD-2026-0730-SOVEREIGN-DORMANT-SWEEPER-091) لحماية مساحة العرض للناشرين النشطين.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold">
                عتبة الخمول: 45 يوماً
              </span>
            </div>

            {/* Dormant Channels Status Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">إجمالي القنوات المسجلة:</span>
                <span className="font-bold text-white font-mono">{publishers.length}</span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">القنوات النشطة:</span>
                <span className="font-bold text-emerald-400 font-mono">
                  {publishers.filter((p) => p.status !== 'DORMANT_CHANNEL').length}
                </span>
              </div>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex justify-between items-center">
                <span className="text-slate-400">القنوات الخاملة (DORMANT):</span>
                <span className="font-bold text-amber-400 font-mono">
                  {publishers.filter((p) => p.status === 'DORMANT_CHANNEL').length}
                </span>
              </div>
            </div>

            {/* Dormant Channels List */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-300 block">
                سجل القنوات الخاملة حالياً بالمنظومة:
              </span>

              {publishers.filter((p) => p.status === 'DORMANT_CHANNEL').length === 0 ? (
                <div className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
                  ✅ لا توجد قنوات خاملة حالياً. جميع القنوات المسجلة تنشر محتوى بانتظام ضمن مهلة الـ 45 يوماً.
                </div>
              ) : (
                <div className="space-y-2">
                  {publishers
                    .filter((p) => p.status === 'DORMANT_CHANNEL')
                    .map((pub) => (
                      <div
                        key={pub.id}
                        className="p-3 bg-slate-900 rounded-xl border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{pub.name}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-slate-950 text-slate-300 border border-slate-800">
                              {pub.platform}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 font-bold border border-amber-800">
                              DORMANT_CHANNEL
                            </span>
                          </div>
                          <p className="text-[11px] text-amber-200/80">
                            <strong>سبب التخفيض:</strong> {pub.dormantReason || 'تجاوز فترة النشر المسموحة (45 يوماً)'}
                          </p>
                          {pub.lastPublishDate && (
                            <p className="text-[10px] text-slate-400 font-mono">
                              آخر منشور رُصد: {pub.lastPublishDate}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleReactivatePublisher(pub.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition whitespace-nowrap self-end sm:self-center"
                        >
                          إعادة تنشيط يدوية
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 7: SSOT Error Dictionary */}
      {activeSubTab === 'ERRORS' && (
        <ErrorDictionaryExplorer lang={lang} />
      )}

      {/* Tab 8: Future Extensions Prepared Readiness */}
      {activeSubTab === 'FUTURE_EXTENSIONS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold border border-purple-500/20">
              <Cpu className="w-3.5 h-3.5" />
              <span>تجهيز وإعداد التوسعات القادمة (Modular Expansion Nodes)</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              بنية التطوير القادم والتوسيع البرمجي
            </h3>
            <p className="text-xs text-slate-300">
              تم تجهيز حزمة الوصلات البرمجية وهياكل النماذج لاستيعاب مراحل التطوير القادمة بدون إعادة هيكلة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-5 rounded-2xl border border-purple-500/30 space-y-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">رادار الرصد الفوري والتلمتري</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                وحدة قياس سرعة الاستجابة، استهلاك الذاكرة، ومعدلات الأخطاء المباشرة لكل شاشة بفرعية حقيقية.
              </p>
              <span className="inline-block text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-bold">
                جاهز للتفعيل (Node Ready)
              </span>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-sky-500/30 space-y-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 w-fit">
                <Server className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">محرك مزامنة قاعدة البيانات السيادية</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                تجهيز المكونات للربط المباشر مع Cloud SQL PostgreSQL و Prisma ORM عند الاعتماد النهائي.
              </p>
              <span className="inline-block text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 font-bold">
                مجهز للمرحلة القادمة
              </span>
            </div>

            <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 space-y-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">بوابة التوثيق البيومتري والشهادات</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                ربط تسجيل الدخول بشهادات الأمان الرقمية للمشرفين والتحقق الثنائي عبر الأجهزة المعتمدة.
              </p>
              <span className="inline-block text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
                مخطط المرحلة النهائية
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

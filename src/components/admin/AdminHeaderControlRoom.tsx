import React from 'react';
import {
  ShieldAlert,
  LogOut,
  Wifi,
  ShieldCheck,
  FileText,
  SlidersHorizontal,
  UserCheck,
  AlertTriangle,
  Trash2,
  BookOpen,
  Cpu,
} from 'lucide-react';
import { AuditLog, VerificationQueueItem, ReportItem } from '../../types';

interface AdminHeaderControlRoomProps {
  auditLogs: AuditLog[];
  verificationQueue: VerificationQueueItem[];
  reports: ReportItem[];
  isEncryptionActive: boolean;
  activeSubTab: string;
  setActiveSubTab: (
    tab: 'WEIGHTS' | 'AUDIT' | 'ENCRYPTION' | 'VERIFICATION' | 'REPORTS' | 'SWEEPER' | 'ERRORS' | 'FUTURE_EXTENSIONS'
  ) => void;
  onToggleEncryption: () => void;
  onLogout: () => void;
}

export const AdminHeaderControlRoom: React.FC<AdminHeaderControlRoomProps> = React.memo(({
  auditLogs,
  verificationQueue,
  reports,
  isEncryptionActive,
  activeSubTab,
  setActiveSubTab,
  onToggleEncryption,
  onLogout,
}) => {
  const pendingReportsCount = reports.filter(
    (r) => r.status === 'INVESTIGATING' || r.status === 'OPEN'
  ).length;

  return (
    <div className="space-y-6">
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
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-rose-300 border border-rose-500/30 text-xs font-bold transition shadow-md cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              <span>إغلاق غرفة العمليات (خروج)</span>
            </button>
          </div>
        </div>

        {/* Essential Operation Action Controls */}
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
              onClick={onToggleEncryption}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
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
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
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
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer ${
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
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
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
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
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
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
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
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
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
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
            activeSubTab === 'REPORTS'
              ? 'bg-rose-500 text-white font-black shadow-lg shadow-rose-500/20'
              : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>البلاغات ({pendingReportsCount})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('SWEEPER')}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
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
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
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
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition whitespace-nowrap cursor-pointer ${
            activeSubTab === 'FUTURE_EXTENSIONS'
              ? 'bg-purple-500 text-white font-black shadow-lg shadow-purple-500/20'
              : 'bg-slate-900 text-purple-300 hover:bg-slate-800 border border-purple-500/20'
          }`}
        >
          <Cpu className="w-4 h-4 text-purple-400" />
          <span>امتدادات سريعة للأجندة المستقبلية</span>
        </button>
      </div>
    </div>
  );
});

AdminHeaderControlRoom.displayName = 'AdminHeaderControlRoom';

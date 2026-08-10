import React from 'react';
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
  FileText,
  BookOpen,
  Clock,
  ChevronDown,
  Search,
  X,
  Filter,
  User,
  Calendar,
  BarChart2,
  TrendingUp,
  PieChart as PieChartIcon,
  SlidersHorizontal,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Lock,
} from 'lucide-react';
import { AuditLog, AuditActionCategory, Publisher } from '../../types';

interface AuditLogsTabProps {
  auditLogs: AuditLog[];
  publishers: Publisher[];
  auditSearchQuery: string;
  setAuditSearchQuery: (val: string) => void;
  selectedAuditCategory: 'ALL' | AuditActionCategory | 'SENSITIVE';
  setSelectedAuditCategory: (cat: 'ALL' | AuditActionCategory | 'SENSITIVE') => void;
  auditTimeRange: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH';
  setAuditTimeRange: (range: 'ALL' | 'TODAY' | 'WEEK' | 'MONTH') => void;
  showSectorChart: boolean;
  setShowSectorChart: (show: boolean) => void;
  getLogCategory: (log: AuditLog) => AuditActionCategory;
  isReadingMode?: boolean;
  onToggleReadingMode?: (active: boolean) => void;
}

export const AuditLogsTab: React.FC<AuditLogsTabProps> = React.memo(({
  auditLogs,
  publishers,
  auditSearchQuery,
  setAuditSearchQuery,
  selectedAuditCategory,
  setSelectedAuditCategory,
  auditTimeRange,
  setAuditTimeRange,
  showSectorChart,
  setShowSectorChart,
  getLogCategory,
  isReadingMode = false,
  onToggleReadingMode,
}) => {
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

  let jasmineCount = 0;
  let dalalCount = 0;
  let raedaCount = 0;

  timeRangeFilteredLogs.forEach((log) => {
    const sec = getSectorKey(log);
    if (sec === 'JASMINE') jasmineCount += 1;
    else if (sec === 'DALAL') dalalCount += 1;
    else if (sec === 'RAEDA') raedaCount += 1;
  });

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
    <div
      className={`border rounded-2xl p-6 space-y-5 shadow-xl transition-colors duration-300 ${
        isReadingMode
          ? 'bg-slate-950/90 border-amber-900/40 reading-content-card'
          : 'bg-slate-900 border-slate-800'
      }`}
    >
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
          {onToggleReadingMode && (
            <button
              type="button"
              onClick={() => onToggleReadingMode(!isReadingMode)}
              className={`px-3 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shrink-0 cursor-pointer ${
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

          {/* Search Input Bar */}
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
                type="button"
                onClick={() => setAuditSearchQuery('')}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800 transition cursor-pointer"
                title="مسح محتوى البحث"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Search Shortcuts */}
      <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
        <span className="font-bold text-slate-300 flex items-center gap-1 shrink-0">
          <Filter className="w-3 h-3 text-indigo-400" />
          <span>اختصارات البحث السريع:</span>
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            type="button"
            onClick={() => setAuditSearchQuery('خالد العلي')}
            className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 transition flex items-center gap-1 cursor-pointer"
          >
            <User className="w-2.5 h-2.5 text-indigo-400" />
            <span>م. خالد العلي</span>
          </button>
          <button
            type="button"
            onClick={() => setAuditSearchQuery('التحقق الآلي')}
            className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 transition flex items-center gap-1 cursor-pointer"
          >
            <User className="w-2.5 h-2.5 text-emerald-400" />
            <span>التحقق الآلي</span>
          </button>
          <button
            type="button"
            onClick={() => setAuditSearchQuery('2026-07-28')}
            className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-indigo-500/50 transition flex items-center gap-1 font-mono cursor-pointer"
          >
            <Calendar className="w-2.5 h-2.5 text-amber-400" />
            <span>2026-07-28</span>
          </button>
          {(auditSearchQuery || auditTimeRange !== 'ALL' || selectedAuditCategory !== 'ALL') && (
            <button
              type="button"
              onClick={() => {
                setAuditSearchQuery('');
                setAuditTimeRange('ALL');
                setSelectedAuditCategory('ALL');
              }}
              className="px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-300 border border-rose-500/30 hover:bg-rose-500/20 transition flex items-center gap-1 font-bold cursor-pointer"
              title="تفريغ كافة الخيارات والعودة لعرض كافة سجلات الحوكمة"
            >
              <span>إعادة ضبط كافة الفلاتر ↺</span>
            </button>
          )}
        </div>
      </div>

      {/* Recharts Analytics Panel */}
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
              رسم بياني مباشر برصد توزيع السجلات التكافلية لقطاعات (الياسمين 🌸، دلال 🌱، رائدة 🚀) خلال الفترة الزمنية المحددة.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowSectorChart(!showSectorChart)}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 transition font-bold shrink-0 cursor-pointer"
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{showSectorChart ? 'إخفاء الرسم البياني' : 'إظهار الرسم البياني'}</span>
          </button>
        </div>

        {showSectorChart && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 pt-1">
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

      {/* Category Filter Toolbar */}
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
            type="button"
            onClick={() => setSelectedAuditCategory('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
              selectedAuditCategory === 'ALL'
                ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/50 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>كافة الأفعال والسجلات ({categoryCounts.ALL})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedAuditCategory('SECURITY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
              selectedAuditCategory === 'SECURITY'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>سجلات الأمن والتشفير ({categoryCounts.SECURITY})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedAuditCategory('PROCEDURAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
              selectedAuditCategory === 'PROCEDURAL'
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-sky-400" />
            <span>إجراءات الحوكمة ({categoryCounts.PROCEDURAL})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedAuditCategory('TECHNICAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
              selectedAuditCategory === 'TECHNICAL'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>صيانة النظام والمكنسة ({categoryCounts.TECHNICAL})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedAuditCategory('SENSITIVE')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
              selectedAuditCategory === 'SENSITIVE'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-sm'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>الأفعال والتعديلات الحساسة ({categoryCounts.SENSITIVE})</span>
          </button>
        </div>
      </div>

      {/* Audit Log Entries List */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-12 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs space-y-2">
          <FileText className="w-8 h-8 text-slate-600 mx-auto" />
          <p>لا توجد سجلات تدقيق تطابق معايير التصفية والبحث الحالية.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1 text-xs">
          {filteredLogs.map((log) => {
            const cat = getLogCategory(log);
            const isSec = isSecurityLog(log);
            const isSens = isSensitiveProcedural(log);

            return (
              <div
                key={log.id}
                className={`p-4 rounded-xl border transition space-y-2 shadow-sm ${
                  isSec
                    ? 'bg-slate-950 border-emerald-500/30 hover:border-emerald-500/50'
                    : isSens
                    ? 'bg-slate-950 border-rose-500/30 hover:border-rose-500/50'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-black uppercase ${
                        cat === 'SECURITY'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : cat === 'TECHNICAL'
                          ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      }`}
                    >
                      {cat}
                    </span>

                    {isSens && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                        <Lock className="w-2.5 h-2.5 text-rose-400" />
                        <span>SENSITIVE</span>
                      </span>
                    )}

                    <span className="font-bold text-white text-xs">{log.actor}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
                      {log.role}
                    </span>
                  </div>

                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{new Date(log.timestamp).toLocaleString('ar-EG')}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-bold text-slate-200 text-xs">{log.action}</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-mono">{log.details}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

AuditLogsTab.displayName = 'AuditLogsTab';

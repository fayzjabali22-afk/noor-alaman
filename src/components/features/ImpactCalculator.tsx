import React, { useMemo } from 'react';
import { Language } from '../../types';
import {
  Clock,
  TrendingUp,
  ShieldCheck,
  Award,
  Zap,
  BarChart3,
  Users,
  Sparkles,
  ArrowUpRight,
  Download,
} from 'lucide-react';

export interface ImpactCalculatorProps {
  totalEngagementHours: number;
  totalOutboundVisits: number;
  sponsoredChannelsCount: number;
  integrityHealthPercent: number;
  autonomyGrowthPercent: number;
  lang: Language;
  onExportReport?: () => void;
}

export const ImpactCalculator: React.FC<ImpactCalculatorProps> = React.memo(({
  totalEngagementHours,
  totalOutboundVisits,
  sponsoredChannelsCount,
  integrityHealthPercent,
  autonomyGrowthPercent,
  lang,
  onExportReport,
}) => {
  const isAr = lang === 'ar';

  // Derived calculations (Pure Memoization - Protocol 88)
  const averageHoursPerChannel = useMemo(() => {
    if (sponsoredChannelsCount === 0) return 0;
    return Math.round(totalEngagementHours / sponsoredChannelsCount);
  }, [totalEngagementHours, sponsoredChannelsCount]);

  const estimatedReachMultiplier = useMemo(() => {
    return (totalOutboundVisits * 1.8).toLocaleString('ar-EG');
  }, [totalOutboundVisits]);

  return (
    <div
      id="impact-calculator-container"
      className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl"
    >
      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 shadow-inner">
            <BarChart3 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg md:text-xl font-black text-white">
                {isAr ? 'حاسبة ومؤشر الأثر التراكمي للجناح السيادي' : 'Sovereign Cumulative Impact Metrics'}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {isAr ? 'بيانات حية' : 'Live Data'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'تحليل إحصائي مباشر لساعات التفاعل والتوجيه الميداني غير المالي نحو القنوات المستحقة'
                : 'Direct real-time analytics for engagement hours and non-monetary traffic surge.'}
            </p>
          </div>
        </div>

        {onExportReport && (
          <button
            type="button"
            onClick={onExportReport}
            id="export-impact-report-btn"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 transition cursor-pointer self-start sm:self-auto shrink-0 shadow-md"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'تصدير تقرير الأثر' : 'Export Impact Report'}</span>
          </button>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {/* Metric 1: Total Engagement Hours */}
        <div
          id="stat-card-hours"
          className="bg-slate-950/80 border border-amber-500/30 p-5 rounded-2xl shadow-lg space-y-2 relative overflow-hidden group hover:border-amber-500/50 transition"
        >
          <div className="flex items-center justify-between text-amber-400">
            <Clock className="w-5 h-5" />
            <span className="text-[10px] font-bold bg-amber-500/10 px-2 py-0.5 rounded text-amber-300 border border-amber-500/20">
              {isAr ? 'ساعات التفاعل' : 'Engagement Hours'}
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-white flex items-baseline gap-1">
            <span>{totalEngagementHours.toLocaleString('ar-EG')}</span>
            <span className="text-xs font-bold text-amber-400">{isAr ? 'ساعة' : 'Hrs'}</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {isAr ? 'إجمالي ساعات المشاهدة والدعم المباشر' : 'Total direct engagement & viewing hours'}
          </p>
        </div>

        {/* Metric 2: Outbound Direct Visits */}
        <div
          id="stat-card-visits"
          className="bg-slate-950/80 border border-emerald-500/30 p-5 rounded-2xl shadow-lg space-y-2 relative overflow-hidden group hover:border-emerald-500/50 transition"
        >
          <div className="flex items-center justify-between text-emerald-400">
            <TrendingUp className="w-5 h-5" />
            <span className="text-[10px] font-bold bg-emerald-500/10 px-2 py-0.5 rounded text-emerald-300 border border-emerald-500/20">
              {isAr ? 'التحويل المباشر' : 'Direct Visits'}
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-white flex items-baseline gap-1">
            <span>{totalOutboundVisits.toLocaleString('ar-EG')}</span>
            <span className="text-xs font-bold text-emerald-400">{isAr ? 'زيارة' : 'Visits'}</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {isAr ? 'زيارات وتفاعل الجمهور نحو القنوات الأصيلة' : 'Audience traffic directed to origin channels'}
          </p>
        </div>

        {/* Metric 3: Integrity Health */}
        <div
          id="stat-card-integrity"
          className="bg-slate-950/80 border border-cyan-500/30 p-5 rounded-2xl shadow-lg space-y-2 relative overflow-hidden group hover:border-cyan-500/50 transition"
        >
          <div className="flex items-center justify-between text-cyan-400">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-bold bg-cyan-500/10 px-2 py-0.5 rounded text-cyan-300 border border-cyan-500/20">
              {isAr ? 'رادار النقاء' : 'Integrity Health'}
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-400 flex items-baseline gap-1">
            <span>{integrityHealthPercent}%</span>
            <span className="text-xs font-bold text-cyan-300">{isAr ? 'نقي' : 'Clean'}</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {isAr ? 'معدل سلامة القنوات المكفولة من التلوث' : 'Clean integrity rating with zero violation'}
          </p>
        </div>

        {/* Metric 4: Autonomy Transition Rate */}
        <div
          id="stat-card-autonomy"
          className="bg-slate-950/80 border border-purple-500/30 p-5 rounded-2xl shadow-lg space-y-2 relative overflow-hidden group hover:border-purple-500/50 transition"
        >
          <div className="flex items-center justify-between text-purple-400">
            <Award className="w-5 h-5" />
            <span className="text-[10px] font-bold bg-purple-500/10 px-2 py-0.5 rounded text-purple-300 border border-purple-500/20">
              {isAr ? 'مؤشر التكافؤ' : 'Autonomy Index'}
            </span>
          </div>
          <div className="text-2xl md:text-3xl font-black text-purple-200 flex items-baseline gap-1">
            <span>{autonomyGrowthPercent}%</span>
            <span className="text-xs font-bold text-purple-400">{isAr ? 'نمو' : 'Growth'}</span>
          </div>
          <p className="text-xs text-slate-400 font-medium">
            {isAr ? 'معدل انتقال القنوات نحو قطاع دلال والرائدة' : 'Transition rate to self-sustaining sectors'}
          </p>
        </div>
      </div>

      {/* Analytical Breakdown Footer Strip */}
      <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400 shrink-0">
            <Zap className="w-4 h-4" />
          </div>
          <p className="text-slate-300 font-medium">
            <strong className="text-amber-400 font-bold">{isAr ? 'متوسط أثر القناة:' : 'Avg Impact/Channel:'} </strong>
            {isAr
              ? `تتلقى كل قناة مكفولة ما متوسطه ~${averageHoursPerChannel} ساعة دعم مباشر، مما يحقق وصولاً تقديرياً يبلغ ${estimatedReachMultiplier} متصفح.`
              : `Each sponsored channel receives ~${averageHoursPerChannel} direct engagement hrs, reaching ~${estimatedReachMultiplier} estimated viewers.`}
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400 shrink-0">
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <span>
            {isAr
              ? `إجمالي القنوات المشمولة بالكفالة: ${sponsoredChannelsCount}`
              : `Total Sponsored Channels: ${sponsoredChannelsCount}`}
          </span>
        </div>
      </div>
    </div>
  );
});

ImpactCalculator.displayName = 'ImpactCalculator';

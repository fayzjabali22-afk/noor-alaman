import React, { useMemo, useState } from 'react';
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
  ChevronDown,
  ChevronUp,
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
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
      className="w-full bg-slate-900/90 border border-slate-800/80 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all duration-300"
    >
      {/* Background Subtle Accent Gradients */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

      {/* Accordion Header Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 ${isOpen ? 'border-b border-slate-800/60 pb-4' : ''}`}>
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-3 cursor-pointer group select-none flex-1 min-h-[56px]"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen((prev) => !prev);
            }
          }}
          aria-expanded={isOpen}
        >
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 shadow-inner group-hover:border-amber-500/60 transition shrink-0">
            <BarChart3 className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base md:text-xl font-black text-white group-hover:text-amber-300 transition">
                {isAr ? 'حاسبة ومؤشر الأثر التراكمي للجناح السيادي' : 'Sovereign Cumulative Impact Metrics'}
              </h3>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {isAr ? 'منسدلة تفاعلية' : 'Accordion Panel'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'تحليل إحصائي مباشر لساعات التفاعل والتوجيه الميداني غير المالي نحو القنوات المستحقة'
                : 'Direct real-time analytics for engagement hours and non-monetary traffic surge.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          {onExportReport && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onExportReport();
              }}
              id="export-impact-report-btn"
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 transition cursor-pointer min-h-[44px] touch-manipulation active:scale-95 shadow-md"
            >
              <Download className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'تصدير تقرير الأثر' : 'Export Impact Report'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? (isAr ? 'طي القائمة' : 'Collapse') : (isAr ? 'توسيع القائمة' : 'Expand')}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation active:scale-95 shrink-0"
          >
            <ChevronDown className={`w-5 h-5 text-amber-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Accordion Collapsible Content Body */}
      <div
        className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
        }`}
      >
        <div className="overflow-hidden space-y-6 pt-1">
          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full relative z-10">
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
      </div>
    </div>
  );
});

ImpactCalculator.displayName = 'ImpactCalculator';

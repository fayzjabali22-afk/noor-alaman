import React from 'react';
import { Publisher, Language } from '../types';
import { translations, getCategoryLabel } from '../lib/i18n';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { BarChart3, TrendingUp, Users, ExternalLink, Award, BookOpen } from 'lucide-react';
import { PublisherWeeklyGrowthChart } from './PublisherWeeklyGrowthChart';

import { GeographicalHeatmap } from './features/GeographicalHeatmap';

interface AnalyticsViewProps {
  publishers: Publisher[];
  lang: Language;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ publishers, lang }) => {
  const t = translations[lang];

  // Aggregations
  const totalOutboundVisits = publishers.reduce((acc, p) => acc + p.totalVisitsFromPlatform, 0);
  const dalalCount = publishers.filter((p) => p.lifecycleStage === 'DALAL_TRANSITION' || p.lifecycleStage === 'GROWTH').length;
  const raedaCount = publishers.filter((p) => p.lifecycleStage === 'RAEDA_SUCCESS' || p.lifecycleStage === 'GRADUATED').length;

  // Category data
  const categoryVisitsMap: Record<string, number> = {};
  publishers.forEach((p) => {
    const label = getCategoryLabel(p.category, lang);
    categoryVisitsMap[label] = (categoryVisitsMap[label] || 0) + p.totalVisitsFromPlatform;
  });

  const categoryData = Object.keys(categoryVisitsMap).map((cat) => ({
    name: cat,
    visits: categoryVisitsMap[cat],
  }));

  // Platform Distribution Data
  const platformMap: Record<string, number> = {};
  publishers.forEach((p) => {
    platformMap[p.platform] = (platformMap[p.platform] || 0) + 1;
  });

  const platformData = Object.keys(platformMap).map((plat) => ({
    name: plat,
    value: platformMap[plat],
  }));

  const COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold border border-cyan-500/20">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t.analyticsSystem}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            {lang === 'ar' ? 'مؤشرات الأداء والأثر الإنساني الرقمي' : 'Humanitarian Impact & Redirection Analytics'}
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-3xl leading-relaxed">
            {t.analyticsTitle}
          </p>
        </div>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.totalPublishersCard}</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{publishers.length}</div>
          <p className="text-[11px] text-emerald-400 font-medium">
            {lang === 'ar' ? 'قنوات ومبادرات معتمدة' : 'Verified channels & initiatives'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.totalOutboundVisitsCard}</span>
            <ExternalLink className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-extrabold text-cyan-400">
            {totalOutboundVisits.toLocaleString()}
          </div>
          <p className="text-[11px] text-slate-400">
            {lang === 'ar' ? 'زيارات منفذة للقنوات الأصلية' : 'Outbound redirections executed'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.dalalTransitionCard}</span>
            <BookOpen className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl font-extrabold text-teal-300">{dalalCount}</div>
          <p className="text-[11px] text-teal-400/80 font-medium">
            {lang === 'ar' ? 'مرحلة التمكين والاستقرار' : 'Empowerment transition stage'}
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>{t.raedaGraduatedCard}</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-indigo-300">{raedaCount}</div>
          <p className="text-[11px] text-indigo-400/80 font-medium">
            {lang === 'ar' ? 'قصص نجاح واكتفاء' : 'Raeda success stories'}
          </p>
        </div>
      </div>

      {/* 6-Week Publisher Visitor Growth Chart */}
      <PublisherWeeklyGrowthChart publishers={publishers} lang={lang} />

      {/* Visual Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Chart 1: Outbound Visits by Category */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>{t.visitsByCategory}</span>
          </h3>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} interval={0} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
                <Bar dataKey="visits" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Platform Channels Share */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>{lang === 'ar' ? 'توزيع الناشرين حسب المنصات' : 'Publishers by Platform'}</span>
          </h3>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={platformData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {platformData.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* D3 Geographical Heatmap */}
      <GeographicalHeatmap lang={lang} />
    </div>
  );
};

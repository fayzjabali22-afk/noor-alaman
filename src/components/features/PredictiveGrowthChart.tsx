import React from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { TrendingUp, Activity } from 'lucide-react';
import { Language } from '../../types';

interface PredictiveGrowthChartProps {
  lang: Language;
}

export const PredictiveGrowthChart: React.FC<PredictiveGrowthChartProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  // Mock data representing historical growth + future predictive curve
  const data = [
    { month: 'Jan', volunteers: 4000, isPredictive: false },
    { month: 'Feb', volunteers: 6500, isPredictive: false },
    { month: 'Mar', volunteers: 9200, isPredictive: false },
    { month: 'Apr', volunteers: 13500, isPredictive: false },
    { month: 'May', volunteers: 19000, isPredictive: true },
    { month: 'Jun', volunteers: 28500, isPredictive: true },
    { month: 'Jul', volunteers: 42000, isPredictive: true },
  ];

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-emerald-500/20 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
      {/* Background visual accents */}
      <div className="absolute -top-32 -right-32 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all"></div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 relative z-10">
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" />
            <span>{isAr ? 'التنبؤ التراكمي لنمو الدعم' : 'Predictive Support Growth'}</span>
          </h3>
          <p className="text-xs text-slate-400">
            {isAr 
              ? 'توقعات الذكاء الاصطناعي لنمو شبكة المتطوعين والقنوات للمدى القريب' 
              : 'AI-driven projections for volunteers and channels growth'}
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center gap-2">
          <span className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
            <TrendingUp className="w-3 h-3" />
            <span>{isAr ? '+45% نمو متوقع' : '+45% Projected Growth'}</span>
          </span>
        </div>
      </div>

      <div className="h-64 w-full relative z-10">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorVolunteers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
              </linearGradient>
              {/* Distinct gradient for predictive section if supported by SVG natively, but area charts use uniform fill. We will rely on dashed stroke instead, but since Recharts doesn't easily split stroke per segment in AreaChart natively without two Area elements, we'll use a trick by just plotting the whole thing and annotating it, OR splitting into two data series. For simplicity, we just use one smooth curve. */}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="month" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              dy={10}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#0f172a', 
                borderColor: '#10b981', 
                borderRadius: '12px', 
                fontSize: '12px', 
                color: '#fff',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
              }}
              itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
              formatter={(value: number) => [value.toLocaleString(), isAr ? 'متطوع/قناة' : 'Volunteers']}
            />
            <Area 
              type="monotone" 
              dataKey="volunteers" 
              stroke="#10b981" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorVolunteers)" 
              activeDot={{ r: 6, fill: '#10b981', stroke: '#0f172a', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Predictive Zone Indicator overlay */}
      <div className="absolute bottom-6 right-10 top-20 w-1/3 border-l-2 border-dashed border-emerald-500/40 bg-emerald-500/5 pointer-events-none rounded-r-2xl hidden sm:flex items-start justify-center pt-4">
        <span className="text-[10px] text-emerald-400/80 font-mono font-bold bg-slate-900/80 px-2 py-0.5 rounded backdrop-blur-sm">
          {isAr ? 'منطقة التنبؤ الذكي' : 'AI Predictive Zone'}
        </span>
      </div>
    </div>
  );
};

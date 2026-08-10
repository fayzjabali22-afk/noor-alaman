import React from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ReportItem } from '../../types';

interface ReportsTabProps {
  reports: ReportItem[];
  t: any;
  onResolveReport: (id: string) => void;
}

export const ReportsTab: React.FC<ReportsTabProps> = React.memo(({
  reports,
  t,
  onResolveReport,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-rose-400" />
        <span>{t?.reportQueueTitle || 'طابور معالجة البلاغات وشكاوى المحتوى'}</span>
      </h3>

      <div className="space-y-3">
        {reports.map((report) => (
          <div key={report.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-rose-400">بلاغ رقم #{report.id}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  report.status === 'RESOLVED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                }`}
              >
                {report.status}
              </span>
            </div>
            <p className="text-xs text-slate-300">{report.evidenceDetails || (report as any).details}</p>

            {report.status !== 'RESOLVED' && (
              <button
                type="button"
                onClick={() => onResolveReport(report.id)}
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>حسم البلاغ واتخاذ القرار الحوكمي</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

ReportsTab.displayName = 'ReportsTab';

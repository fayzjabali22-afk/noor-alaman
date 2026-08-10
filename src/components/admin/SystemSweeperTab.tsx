import React from 'react';
import { Trash2, ShieldCheck, CheckCircle2, History as HistoryIcon } from 'lucide-react';
import { Publisher } from '../../types';

interface SystemSweeperTabProps {
  publishers: Publisher[];
  sweeperRunning: boolean;
  lastSweeperReport: any;
  onRunSweeper: () => void;
  onReactivatePublisher: (id: string) => void;
}

export const SystemSweeperTab: React.FC<SystemSweeperTabProps> = React.memo(({
  publishers,
  sweeperRunning,
  lastSweeperReport,
  onRunSweeper,
  onReactivatePublisher,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Trash2 className="w-5 h-5 text-amber-400" />
            <span>المكنسة البرمجية للحفظ والتطهير الذاتي (System Sweeper Engine)</span>
          </h3>
          <p className="text-xs text-slate-300">
            تطهير السجلات المؤقتة، إزالة الروابط المكسورة، وتطبيق آليات العدالة لمنع استغلال الذاكرة والخمول.
          </p>
        </div>

        <button
          type="button"
          onClick={onRunSweeper}
          disabled={sweeperRunning}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition shadow-lg cursor-pointer ${
            sweeperRunning
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-amber-500 text-slate-950 hover:bg-amber-400'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{sweeperRunning ? 'جارٍ تشغيل المكنسة...' : 'تشغيل المكنسة البرمجية الآن'}</span>
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
                      type="button"
                      onClick={() => onReactivatePublisher(pub.id)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition whitespace-nowrap self-end sm:self-center cursor-pointer"
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
  );
});

SystemSweeperTab.displayName = 'SystemSweeperTab';

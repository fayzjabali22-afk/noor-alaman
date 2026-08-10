import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { FairEngineWeights } from '../../types';

interface FairEngineWeightsTabProps {
  weights: FairEngineWeights;
  onWeightChange: (key: keyof FairEngineWeights, value: number) => void;
  onResetWeights: () => void;
}

export const FairEngineWeightsTab: React.FC<FairEngineWeightsTabProps> = React.memo(({
  weights,
  onWeightChange,
  onResetWeights,
}) => {
  return (
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
          type="button"
          onClick={onResetWeights}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition border border-slate-700 cursor-pointer"
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
            onChange={(e) => onWeightChange('visitsWeight', Number(e.target.value))}
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
            onChange={(e) => onWeightChange('verificationWeight', Number(e.target.value))}
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
            onChange={(e) => onWeightChange('trustScoreWeight', Number(e.target.value))}
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
            onChange={(e) => onWeightChange('reportPenaltyWeight', Number(e.target.value))}
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
            onChange={(e) => onWeightChange('recencyWeight', Number(e.target.value))}
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
            onChange={(e) => onWeightChange('lifecycleStageWeight', Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
          <p className="text-[11px] text-slate-400">مراعاة ترتيب القنوات القائمة في المراحل التكافلية المختلفة.</p>
        </div>
      </div>
    </div>
  );
});

FairEngineWeightsTab.displayName = 'FairEngineWeightsTab';

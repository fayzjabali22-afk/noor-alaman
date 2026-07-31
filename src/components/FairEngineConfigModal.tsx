import React from 'react';
import { FairEngineWeights, Language } from '../types';
import { translations } from '../lib/i18n';
import { defaultFairEngineWeights } from '../lib/fairEngine';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';

interface FairEngineConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  weights: FairEngineWeights;
  setWeights: React.Dispatch<React.SetStateAction<FairEngineWeights>>;
  lang: Language;
}

export const FairEngineConfigModal: React.FC<FairEngineConfigModalProps> = ({
  isOpen,
  onClose,
  weights,
  setWeights,
  lang,
}) => {
  const t = translations[lang];

  if (!isOpen) return null;

  const handleChange = (key: keyof FairEngineWeights, val: number) => {
    setWeights((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">{t.fairEngineTitle}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-800">
          {t.fairEngineDesc}
        </p>

        <div className="space-y-4">
          <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex justify-between font-bold text-white">
              <span>{t.visitsWeightLabel}</span>
              <span className="text-emerald-400 font-mono">{weights.visitsWeight}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights.visitsWeight}
              onChange={(e) => handleChange('visitsWeight', Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex justify-between font-bold text-white">
              <span>{t.verificationWeightLabel}</span>
              <span className="text-amber-400 font-mono">{weights.verificationWeight}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights.verificationWeight}
              onChange={(e) => handleChange('verificationWeight', Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex justify-between font-bold text-white">
              <span>{t.reportPenaltyWeightLabel}</span>
              <span className="text-red-400 font-mono">{weights.reportPenaltyWeight}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights.reportPenaltyWeight}
              onChange={(e) => handleChange('reportPenaltyWeight', Number(e.target.value))}
              className="w-full accent-red-500 cursor-pointer"
            />
          </div>

          <div className="space-y-1 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
            <div className="flex justify-between font-bold text-white">
              <span>{t.recencyWeightLabel}</span>
              <span className="text-sky-400 font-mono">{weights.recencyWeight}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={weights.recencyWeight}
              onChange={(e) => handleChange('recencyWeight', Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setWeights(defaultFairEngineWeights)}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetDefaultWeights}</span>
          </button>

          <button
            onClick={onClose}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-5 py-2 rounded-xl text-xs transition shadow-lg"
          >
            {t.recalculateScores}
          </button>
        </div>
      </div>
    </div>
  );
};

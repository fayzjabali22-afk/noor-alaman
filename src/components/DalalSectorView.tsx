import React from 'react';
import { DalalTransitionChannel, Language } from '../types';
import { translations, getCategoryLabel } from '../lib/i18n';
import { TrustBadge } from './TrustBadge';
import { BookOpen, ExternalLink, ArrowRight, Target } from 'lucide-react';

interface DalalSectorViewProps {
  channels: DalalTransitionChannel[];
  lang: Language;
}

export const DalalSectorView: React.FC<DalalSectorViewProps> = ({ channels, lang }) => {
  const t = translations[lang];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950/80 via-slate-900 to-teal-950/50 border border-teal-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 text-xs font-semibold border border-teal-500/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.dalalTitle}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            {lang === 'ar' ? 'مرحلة التمكين والاستقرار الذاتي' : 'Empowerment & Sustained Support Phase'}
          </h2>
          <p className="text-slate-300 text-xs md:text-sm max-w-3xl leading-relaxed">
            {t.dalalDesc}
          </p>
        </div>
      </div>

      {/* Dalal Channels List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {channels.map((channel) => {
          const progressPercent = Math.min(
            100,
            Math.round((channel.currentVisitsAchieved / channel.growthTargetVisits) * 100)
          );

          return (
            <div
              key={channel.id}
              className="bg-slate-900 border border-slate-800 hover:border-teal-500/40 rounded-2xl p-5 space-y-4 shadow-lg transition"
            >
              <div className="flex items-center gap-3">
                <img
                  src={channel.avatar}
                  alt={channel.publisherName}
                  className="w-12 h-12 rounded-xl object-cover border border-teal-500/40 shadow-sm"
                />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                    <span>{channel.publisherName}</span>
                    <TrustBadge score={progressPercent >= 80 ? 88 : 75} lang={lang} size="sm" />
                  </h3>
                  <span className="text-[11px] bg-teal-950 text-teal-300 px-2 py-0.5 rounded border border-teal-800">
                    {getCategoryLabel(channel.category, lang)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3 rounded-xl border border-slate-800">
                {channel.supportNeedsDescription}
              </p>

              {/* Progress Bar towards Stabilization */}
              <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5 text-teal-400" />
                    <span>{lang === 'ar' ? 'نسبة الجاهزية للاكتفاء:' : 'Target Readiness:'}</span>
                  </span>
                  <span className="font-bold text-teal-300">{progressPercent}%</span>
                </div>

                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-[10px] text-slate-500 pt-1">
                  <span>{channel.currentVisitsAchieved.toLocaleString()} {lang === 'ar' ? 'زيارة' : 'visits'}</span>
                  <span>{lang === 'ar' ? 'الهدف:' : 'Target:'} {channel.growthTargetVisits.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Button */}
              <a
                href={channel.externalUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-bold py-2.5 rounded-xl border border-slate-700 transition"
              >
                <span>{lang === 'ar' ? 'مساندة القناة للانتقال' : 'Support Channel Stabilization'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
};

import React from 'react';
import { RaedaSuccessArchive, Language } from '../types';
import { translations } from '../lib/i18n';
import { TrustBadge } from './TrustBadge';
import { Award, CheckCircle2, ExternalLink, Sparkles } from 'lucide-react';

interface RaedaSectorViewProps {
  archiveList: RaedaSuccessArchive[];
  lang: Language;
}

export const RaedaSectorView: React.FC<RaedaSectorViewProps> = ({ archiveList, lang }) => {
  const t = translations[lang];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950/80 via-slate-900 to-indigo-950/50 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-semibold border border-indigo-500/20">
            <Award className="w-3.5 h-3.5" />
            <span>{t.raedaTitle}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            {lang === 'ar' ? 'أرشيف قصص النجاح المكتفية' : 'Raeda Success Stories Archive'}
          </h2>
          <p className="text-slate-300 text-xs md:text-sm max-w-3xl leading-relaxed">
            {t.raedaDesc}
          </p>
        </div>
      </div>

      {/* Archive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {archiveList.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 space-y-4 shadow-lg transition"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={item.avatar}
                  alt={item.publisherName}
                  className="w-12 h-12 rounded-xl object-cover border border-indigo-500/40 shadow-sm"
                />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                    <span>{item.publisherName}</span>
                    <TrustBadge score={96} lang={lang} size="sm" />
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    {lang === 'ar' ? 'تاريخ الاكتفاء والتخرج:' : 'Graduation:'} {item.graduationDate}
                  </p>
                </div>
              </div>

              <span className="bg-indigo-950 text-indigo-300 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-indigo-800">
                {lang === 'ar' ? 'قصة نجاح' : 'Graduated'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800">
              {item.successStorySummary}
            </p>

            <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <div>
                <span className="text-slate-500 block text-[10px]">
                  {lang === 'ar' ? 'إجمالي الزيارات المحققة:' : 'Total Visits Achieved:'}
                </span>
                <span className="font-bold text-white text-xs">
                  {item.totalOutboundVisitsAchieved.toLocaleString()}
                </span>
              </div>

              <div className="text-left">
                <span className="text-slate-500 block text-[10px]">
                  {lang === 'ar' ? 'مصدر الاستقرار:' : 'Sustainability Source:'}
                </span>
                <span className="font-medium text-emerald-300 text-[11px]">
                  {item.sustainabilitySource}
                </span>
              </div>
            </div>

            <a
              href={item.externalUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-bold py-2.5 rounded-xl border border-slate-700 transition"
            >
              <span>{lang === 'ar' ? 'زيارة القناة المكتفية' : 'Visit Graduated Channel'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, HeartHandshake, MapPin, ExternalLink, Quote, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Language, RescuedStory } from '../types';

interface RescuedLivelihoodsSectionProps {
  lang: Language;
  stories: RescuedStory[];
  onOpenStoryUrl?: (url: string) => void;
}

export const RescuedLivelihoodsSection: React.FC<RescuedLivelihoodsSectionProps> = ({
  lang,
  stories,
  onOpenStoryUrl,
}) => {
  const isAr = lang === 'ar';

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: 0.2 }}
      className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Glow */}
      <div className="absolute top-0 left-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/15 text-teal-300 text-xs font-bold border border-teal-500/30">
            <HeartHandshake className="w-4 h-4 text-teal-400" />
            <span>{isAr ? 'قصص حقيقية من الميدان' : 'Real Field Impact Stories'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
            {isAr ? 'قسم "أنقذت رزقي" (Rescued My Livelihood)' : 'Rescued My Livelihood Archive'}
          </h2>
          <p className="text-xs text-slate-400 font-medium max-w-2xl">
            {isAr
              ? 'يروي الناشرين كيف تحولت دقائق المشاهدة والاشتراكات الصادقة إلى مصادر دخل كريمة كفتهم عن استجداء المساعدات وحفظت كرامتهم.'
              : 'Real stories from content creators illustrating how redirected views turned into dignifying livelihoods.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950 px-3.5 py-2 rounded-xl border border-slate-800 shrink-0">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>{isAr ? 'قصص موثقة بالشهادات' : 'Verified Testimonials'}</span>
        </div>
      </div>

      {/* Stories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-slate-950 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 space-y-4 shadow-xl transition-all duration-300 hover:-translate-y-1 group relative flex flex-col justify-between"
          >
            <div className="space-y-3">
              {/* Creator Info Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={story.publisherAvatar}
                    alt={story.publisherName}
                    className="w-12 h-12 rounded-xl object-cover border border-teal-500/30 shadow-md group-hover:scale-105 transition shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{story.publisherName}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    </h3>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{story.location}</span>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold bg-teal-500/10 text-teal-300 border border-teal-500/20 px-2.5 py-1 rounded-lg">
                  {story.platform}
                </span>
              </div>

              {/* Title & Quote */}
              <div className="space-y-2 pt-1">
                <h4 className="text-sm font-bold text-teal-300 flex items-center gap-1.5 leading-snug">
                  <Quote className="w-4 h-4 text-teal-400 shrink-0 rotate-180" />
                  <span>{story.storyTitle}</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed font-medium bg-slate-900/60 p-3.5 rounded-xl border border-slate-800/80">
                  {story.storyContent}
                </p>
              </div>
            </div>

            {/* Impact Metric & External Link */}
            <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-2 text-xs">
              <span className="font-mono text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                {story.impactMetric}
              </span>

              {onOpenStoryUrl && (
                <button
                  type="button"
                  onClick={() => onOpenStoryUrl(story.platformUrl)}
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 rounded-xl transition min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                  title={isAr ? 'زيارة القناة المذكورة' : 'Visit Creator Channel'}
                >
                  <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </motion.section>
  );
};

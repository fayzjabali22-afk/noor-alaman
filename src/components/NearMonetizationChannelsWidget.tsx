import React from 'react';
import { motion } from 'motion/react';
import { Flame, Sparkles, ExternalLink, MapPin, CheckCircle2, TrendingUp, ArrowRight, ArrowLeft } from 'lucide-react';
import { Publisher, Language } from '../types';

interface NearMonetizationChannelsWidgetProps {
  publishers: Publisher[];
  lang: Language;
  onOpenPublisherLink: (pub: Publisher) => void;
}

export const NearMonetizationChannelsWidget: React.FC<NearMonetizationChannelsWidgetProps> = ({
  publishers,
  lang,
  onOpenPublisherLink,
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  // Filter channels near monetization (or sort by progress)
  const nearChannels = publishers.filter((p) => p.isNearMonetization || (p.monetizationProgressPercent && p.monetizationProgressPercent >= 75));

  if (nearChannels.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 sm:p-8 space-y-5 relative overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'فرصة الأثر الحاسم' : 'Decisive Impact Opportunity'}</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-white tracking-tight pt-1">
            {isAr ? 'الأقرب لتحقيق شروط الربح المباشر (Closest to Monetization)' : 'Channels Near Monetization Threshold'}
          </h3>
          <p className="text-xs text-slate-400 font-medium max-w-2xl">
            {isAr
              ? 'تضم هذه القائمة الناشرين الذين شارفوا على استيفاء شروط الربح المباشر من منصاتهم (مثل 1,000 مشترك أو 4,000 ساعة مشاهدة). دعمك البسيط الآن يفتح لهم باب دخل دائم.'
              : 'Creators who are nearly eligible for direct ad revenue on YouTube, TikTok, or Rumble.'}
          </p>
        </div>

        <span className="text-xs text-amber-400 font-mono font-bold bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/20">
          {nearChannels.length} {isAr ? 'قنوات تحتاج لمساتك الأخيرة' : 'Channels Need Final Boost'}
        </span>
      </div>

      {/* Grid of Near Monetization Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {nearChannels.map((pub) => {
          const progress = pub.monetizationProgressPercent || 85;

          return (
            <div
              key={pub.id}
              className="bg-slate-950 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-5 space-y-4 shadow-xl transition-all duration-300 group hover:-translate-y-1 relative"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={pub.avatar}
                    alt={pub.name}
                    className="w-11 h-11 rounded-xl object-cover border border-amber-500/30 shadow-md group-hover:scale-105 transition shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{pub.name}</span>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    </h4>
                    <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                      <span>{pub.location}</span>
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold bg-slate-900 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                  {pub.platform}
                </span>
              </div>

              {/* Progress bar */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-amber-300 flex items-center gap-1">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'نسبة الجاهزية للربح:' : 'Monetization Progress:'}</span>
                  </span>
                  <span className="font-mono text-emerald-400 font-black">{progress}%</span>
                </div>

                <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-300 font-medium bg-slate-900/80 p-2.5 rounded-xl border border-slate-800/80">
                  {pub.monetizationNeedsNote || (isAr ? 'ينقصه أعداد قليلة من المتابعين لتفعيل عوائد المنصة الرسمية' : 'Needs a few more subscribers to trigger native ad payouts')}
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => onOpenPublisherLink(pub)}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-400 hover:to-emerald-500 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer min-h-[42px]"
              >
                <span>{isAr ? 'ساهم باللمسة الأخيرة (انتقال للقناة)' : 'Provide Final Support Boost'}</span>
                <ExternalLink className="w-4 h-4 text-slate-950" />
              </button>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
};

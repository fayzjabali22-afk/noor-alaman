import React, { useMemo } from 'react';
import { Publisher, SupporterAction, Language } from '../types';
import { 
  Heart, 
  Sparkles, 
  LineChart, 
  ChevronRight, 
  ExternalLink,
  Users,
  Award,
  ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface HybridImpactViewProps {
  publishers: Publisher[];
  supporterActions: SupporterAction[];
  lang: Language;
  setCurrentTab: (tab: string) => void;
}

export const HybridImpactView: React.FC<HybridImpactViewProps> = ({
  publishers,
  supporterActions,
  lang,
  setCurrentTab
}) => {
  const isAr = lang === 'ar';
  
  // 1. Identify User's Specific Footprint
  const interactedPublisherIds = useMemo(() => {
    const ids = new Set<string>();
    supporterActions.forEach(a => ids.add(a.publisherId));
    return ids;
  }, [supporterActions]);

  const userPublishers = useMemo(() => {
    return publishers.filter(p => interactedPublisherIds.has(p.id));
  }, [publishers, interactedPublisherIds]);

  // If user hasn't supported anyone yet, show soft zero-coercion state
  if (userPublishers.length === 0) {
    return (
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-fade-in pb-32">
        <div className="text-center space-y-4 py-20">
          <div className="w-16 h-16 mx-auto bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-slate-500 shadow-inner">
            <Heart className="w-8 h-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-wide">
            {isAr ? 'أثرك الفردي لم يبدأ بعد' : 'Your Personal Impact Awaits'}
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            {isAr 
              ? 'تصفح الدليل بحرية ودون قيود. بمجرد تفاعلك مع أي صانع محتوى أو مبادرة، ستُبنى هنا مساحتك الخاصة التي تروي قصة أثرك الإنساني وكيف أسهمت في استقرارهم.'
              : 'Browse the directory freely without barriers. Once you interact with any creator or initiative, your personal space will be built here, telling the story of your human impact and how you contributed to their stability.'}
          </p>
          <div className="pt-6">
            <button
              onClick={() => setCurrentTab('home')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all shadow-sm border border-slate-700/50"
            >
              <span>{isAr ? 'استكشف المنصة بحرية' : 'Explore Platform Freely'}</span>
              <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Derive Sector Pulse based on user's interactions
  const dominantCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    userPublishers.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] || 'GENERAL';
  }, [userPublishers]);

  const sectorPublishers = publishers.filter(p => p.category === dominantCategory);
  const sectorTotalVisits = sectorPublishers.reduce((sum, p) => sum + p.totalVisitsFromPlatform, 0);
  const sectorVerifiedCount = sectorPublishers.filter(p => p.verificationLevel === 'PLATINUM' || p.verificationLevel === 'GOLD').length;
  const sectorProgress = Math.min(100, Math.round((sectorVerifiedCount / Math.max(1, sectorPublishers.length)) * 100));

  const getCategoryName = (cat: string) => {
    if (cat === 'JASMINE') return isAr ? 'قطاع ياسمين (الأسرة المنتجة)' : 'Jasmine Sector (Productive Families)';
    if (cat === 'DALAL') return isAr ? 'قطاع دلال (تمكين الصم والبكم)' : 'Dalal Sector (Deaf Empowerment)';
    if (cat === 'RAEDA') return isAr ? 'قطاع رائدة (ريادة الأعمال النسوية)' : 'Raeda Sector (Women Entrepreneurship)';
    return isAr ? 'القطاع العام' : 'General Sector';
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-12 animate-fade-in pb-32">
      
      {/* HEADER */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-bold font-mono tracking-wider mb-2">
          <Award className="w-3.5 h-3.5" />
          <span>{isAr ? 'ملف الأثر الهجين (Hybrid Impact)' : 'Hybrid Impact Profile'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {isAr ? 'بصمتك الإنسانية' : 'Your Human Footprint'}
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          {isAr 
            ? 'نحن لا نؤمن بلغة الأرقام المجردة. هنا، نربطك بصناع المحتوى الذين منحتهم انتباهك، لتلمس استقرارهم خطوة بخطوة، وتشعر بنبض القطاع الذي ساهمت في نهضته.' 
            : 'We do not believe in abstract numbers. Here, we connect you with the creators you gave your attention to, so you can feel their stability step by step, and the pulse of the sector you helped rise.'}
        </p>
      </div>

      {/* SECTION 1: DIRECT INDIVIDUAL FOCUS (Soft Interactive Paths) */}
      <section className="space-y-6">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <Heart className="w-5 h-5 text-emerald-400" />
          <span>{isAr ? 'ثمار دعمك المباشر' : 'Fruits of Your Direct Support'}</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {userPublishers.slice(0, 4).map((pub, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={pub.id}
              onClick={() => {
                // Soft redirect to original channel to see the story
                if(pub.externalUrl) window.open(pub.externalUrl, '_blank', 'noopener,noreferrer');
              }}
              className="group cursor-pointer bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-emerald-500/30 rounded-2xl p-5 transition-all shadow-sm"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition-colors">
                    {pub.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span className="truncate">{getCategoryName(pub.category)}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                    <span className="text-emerald-500/80 font-medium">
                      {isAr ? 'زرتها مؤخراً' : 'Visited recently'}
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-slate-950 flex items-center justify-center border border-slate-800 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-colors">
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-400" />
                </div>
              </div>
              
              <div className="bg-slate-950/50 rounded-xl p-3 border border-slate-800/50">
                <p className="text-sm text-slate-300 leading-relaxed flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>
                    {isAr 
                      ? 'بفضل تفاعل أمثالك، تقترب هذه القناة يومياً نحو استقلالها المادي التام. اضغط لزيارتها ورؤية قصتها.'
                      : 'Thanks to interaction like yours, this channel inches closer to complete financial independence every day. Click to visit their story.'}
                  </span>
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 2: CONNECTED SECTOR PULSE (Sparklines & Zero Bloat) */}
      <section className="space-y-6 pt-6 border-t border-slate-800/60">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-400" />
              <span>{isAr ? 'النبض الجماعي للقطاع' : 'Collective Sector Pulse'}</span>
            </h2>
            <p className="text-xs text-slate-400">
              {isAr 
                ? `بناءً على اهتمامك، إليك حالة استقرار ${getCategoryName(dominantCategory)}`
                : `Based on your interest, here is the stability status of ${getCategoryName(dominantCategory)}`}
            </p>
          </div>
          <div className="text-right">
             <div className="text-2xl font-black text-white">{sectorProgress}%</div>
             <div className="text-[10px] text-teal-400 font-mono tracking-wide">
               {isAr ? 'مؤشر الاستقرار القطاعي' : 'SECTOR STABILITY INDEX'}
             </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 border border-teal-500/10 shadow-lg relative overflow-hidden">
          {/* Abstract Sparkline using pure SVG for Zero UI Bloat */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0,100 L0,80 Q25,60 50,70 T100,30 L100,100 Z" fill="url(#tealGrad)" />
              <path d="M0,80 Q25,60 50,70 T100,30" fill="none" stroke="#14b8a6" strokeWidth="2" />
              <defs>
                <linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity="0" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="text-slate-400 text-xs">{isAr ? 'القنوات النشطة' : 'Active Channels'}</div>
              <div className="text-xl font-bold text-white">{sectorPublishers.length}</div>
            </div>
            <div className="space-y-1">
              <div className="text-slate-400 text-xs">{isAr ? 'القنوات الموثقة' : 'Verified Channels'}</div>
              <div className="text-xl font-bold text-white">{sectorVerifiedCount}</div>
            </div>
            <div className="space-y-1">
              <div className="text-slate-400 text-xs">{isAr ? 'إجمالي الزيارات الداعمة' : 'Total Supporting Visits'}</div>
              <div className="text-xl font-bold text-teal-400">
                {(sectorTotalVisits / 1000).toFixed(1)}k+
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-slate-400 text-xs">{isAr ? 'معدل النمو' : 'Growth Rate'}</div>
              <div className="text-xl font-bold text-emerald-400 flex items-center gap-1">
                <span>+12.4%</span>
                <LineChart className="w-4 h-4 opacity-70" />
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-slate-800/50">
            <p className="text-sm text-slate-300 leading-relaxed text-center sm:text-start">
              {isAr 
                ? 'مساهمتك الفردية الهادئة تصنع مع مساهمات الآخرين تياراً مستمراً ينتشل هذا القطاع من الركود إلى الاستقلال الحقيقي.'
                : 'Your quiet individual contribution, together with others, creates a continuous current that lifts this sector from stagnation to true independence.'}
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

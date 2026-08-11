import React, { memo } from 'react';
import { motion } from 'motion/react';
import { Language, Publisher } from '../types';
import { translations } from '../lib/i18n';
import { initialRescuedStories } from '../data/initialData';
import { SupportStopwatchWidget } from './SupportStopwatchWidget';
import { NearMonetizationChannelsWidget } from './NearMonetizationChannelsWidget';
import { RescuedLivelihoodsSection } from './RescuedLivelihoodsSection';
import { PredictiveGrowthChart } from './features/PredictiveGrowthChart';
import {
  ShieldCheck,
  Heart,
  UserPlus,
  Sparkles,
  Award,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Users,
  Compass,
  CheckCircle2,
  Lock,
  Eye,
  Radio,
  Flame,
  Feather,
  Clock,
} from 'lucide-react';

interface HomeScreenViewProps {
  lang: Language;
  onNavigateTab: (tab: string) => void;
  totalPublishersCount: number;
  totalVisitsCount: number;
  dalalCount: number;
  raedaCount: number;
  spotlightPublisher?: Publisher | null;
  publishers?: Publisher[];
  isLoading?: boolean;
  onOpenBlogModal?: () => void;
  onOpenPublisherLink?: (pub: Publisher) => void;
}

export const HomeScreenViewComponent: React.FC<HomeScreenViewProps> = ({
  lang,
  onNavigateTab,
  totalPublishersCount,
  totalVisitsCount,
  dalalCount,
  raedaCount,
  spotlightPublisher = null,
  publishers = [],
  isLoading = false,
  onOpenBlogModal,
  onOpenPublisherLink,
}) => {
  const [internalLoading, setInternalLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate a brief initialization phase to ensure smooth rendering of complex widgets
    const timer = setTimeout(() => {
      setInternalLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const t = translations[lang];
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  if (isLoading || internalLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="relative flex items-center justify-center">
          {/* Outer Ring */}
          <div className="absolute w-16 h-16 border-4 border-slate-800 rounded-full"></div>
          {/* Spinning Ring */}
          <div className="absolute w-16 h-16 border-4 border-transparent border-t-emerald-500 rounded-full animate-spin"></div>
          {/* Inner Icon/Dot */}
          <div className="w-6 h-6 bg-emerald-500/20 rounded-full animate-pulse flex items-center justify-center">
            <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-white font-bold text-lg tracking-wide">
            {isAr ? 'جاري تهيئة المنصة...' : 'Initializing Platform...'}
          </h3>
          <p className="text-slate-400 text-xs">
            {isAr ? 'نور الأماني - محرك الفرص العادلة' : 'Noor Al-Amani - Fair Opportunity Engine'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 py-2">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800/80 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-colors duration-500"
      >
        {/* Glow Accent */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/15 transition-all duration-700"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-teal-500/15 transition-all duration-700"></div>

        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>{t.platformSubtitle}</span>
          </div>

          {/* Heading */}
          <h1 id="main-hero-title" className="text-xl md:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
            {t.heroTitle}
          </h1>

          {/* Core Human Statement */}
          <p className="text-slate-200 text-sm md:text-base leading-relaxed max-w-3xl mx-auto font-medium bg-slate-950/50 p-5 rounded-2xl border border-emerald-500/20 shadow-inner whitespace-pre-line">
            {t.heroDescription}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigateTab('supporter')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-xl shadow-emerald-950/40 transition hover:scale-[1.02] active:scale-95"
            >
              <Heart className="w-4 h-4 text-rose-300 fill-rose-300/30" />
              <span>{isAr ? 'ابدأ الدعم والتصفح' : 'Start Support & Explore'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigateTab('publisher')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm px-7 py-3.5 rounded-2xl border border-slate-700 transition hover:scale-[1.02] active:scale-95 shadow-md"
            >
              <UserPlus className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'انضم كناشر إنساني' : 'Join as Publisher'}</span>
            </button>
          </div>

          {/* Non-Hosting Disclaimer */}
          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400 bg-slate-950/60 py-2 px-4 rounded-xl max-w-xl mx-auto border border-slate-800/60">
            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>
              {isAr
                ? 'التزام حوكمي: لا تستضيف المنصة أي فيديوهات، وتنقل المستخدم للقناة الأصلية مباشرة.'
                : 'Governance Policy: Platform never hosts video streams and redirects directly to original channels.'}
            </span>
          </div>
        </div>
      </motion.section>



      {/* Platform Impact Stats */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <div className="bg-slate-900 border border-slate-800 hover:border-emerald-500/30 rounded-2xl p-5 text-center space-y-1 transition-all duration-300 hover:-translate-y-0.5 shadow-md">
          <Users className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
          <div className="text-2xl md:text-3xl font-extrabold text-white">{totalPublishersCount}</div>
          <div className="text-xs text-slate-400 font-medium">
            {isAr ? 'قنوات إنسانية معتمدة' : 'Verified Channels'}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 hover:border-teal-500/30 rounded-2xl p-5 text-center space-y-1 transition-all duration-300 hover:-translate-y-0.5 shadow-md">
          <ExternalLink className="w-6 h-6 text-teal-400 mx-auto mb-2" />
          <div className="text-2xl md:text-3xl font-extrabold text-white">{totalVisitsCount.toLocaleString()}</div>
          <div className="text-xs text-slate-400 font-medium">
            {isAr ? 'توجيه خارجي مباشر' : 'Outbound Redirections'}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/30 rounded-2xl p-5 text-center space-y-1 transition-all duration-300 hover:-translate-y-0.5 shadow-md">
          <BookOpen className="w-6 h-6 text-amber-400 mx-auto mb-2" />
          <div className="text-2xl md:text-3xl font-extrabold text-white">{dalalCount}</div>
          <div className="text-xs text-slate-400 font-medium">
            {isAr ? 'قنوات مرحلة التمكين (دلال)' : 'Dalal Transition Stage'}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 hover:border-indigo-500/30 rounded-2xl p-5 text-center space-y-1 transition-all duration-300 hover:-translate-y-0.5 shadow-md">
          <Award className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
          <div className="text-2xl md:text-3xl font-extrabold text-white">{raedaCount}</div>
          <div className="text-xs text-slate-400 font-medium">
            {isAr ? 'قصص تخرج مكتفية (رائدة)' : 'Raeda Success Archive'}
          </div>
        </div>
      </motion.section>

      {/* Primary Platform Sectors Quick Access */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Compass className="w-5 h-5 text-emerald-400" />
            <span>{isAr ? 'قطاعات المنصة الرئيسية' : 'Platform Specialized Sectors'}</span>
          </h2>
          <span className="text-xs text-slate-400 font-medium">
            {isAr ? 'مسارات حوكمية متكاملة' : 'Governed Integrated Framework'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Jasmine Sector */}
          <div
            onClick={() => onNavigateTab('jasmine')}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-6 space-y-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition duration-300">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition flex items-center justify-between">
                <span>{t.jasmineSector}</span>
                <ArrowIcon className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition duration-300" />
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {t.jasmineDesc}
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-amber-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'رابط مرجعي موحد بدون إعلانات' : 'Unified Reference Bio Link'}</span>
            </div>
          </div>

          {/* Dalal Sector */}
          <div
            onClick={() => onNavigateTab('dalal')}
            className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-6 space-y-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center text-teal-400 group-hover:scale-110 transition duration-300">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition flex items-center justify-between">
                <span>{t.dalalSector}</span>
                <ArrowIcon className="w-4 h-4 text-teal-400 opacity-0 group-hover:opacity-100 transition duration-300" />
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {t.dalalDesc}
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-teal-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'مرحلة الانتقال والتمكين الذاتي' : 'Growth & Self-Sustainability'}</span>
            </div>
          </div>

          {/* Raeda Sector */}
          <div
            onClick={() => onNavigateTab('raeda')}
            className="bg-slate-900 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 space-y-4 cursor-pointer transition-all duration-300 hover:-translate-y-1 group shadow-lg"
          >
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition duration-300">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition flex items-center justify-between">
                <span>{t.raedaSector}</span>
                <ArrowIcon className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition duration-300" />
              </h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {t.raedaDesc}
              </p>
            </div>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-indigo-400 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isAr ? 'تأثيث أرشيف النجاح وإفساح الطابور' : 'Success Stories & Space Creation'}</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Dedicated Container for Blogs & Theoretical Papers */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'قسم المدونات والأوراق الفكرية' : 'Blogs & Theoretical Papers'}</span>
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-800 text-slate-300 text-xs font-semibold px-2.5 py-0.5 rounded-lg border border-slate-700">
                <Feather className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isAr ? 'بقلم: فايز الجبالي' : 'By: Fayez Al-Jebali'}</span>
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight pt-1">
              {isAr ? 'المدونات والمقالات الفكرية المرجعية' : 'Featured Reference Blogs & Articles'}
            </h2>
          </div>

          <button
            id="btn-open-blog-main-header"
            onClick={onOpenBlogModal}
            className="flex items-center gap-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs px-4 py-2.5 rounded-xl transition hover:scale-105 active:scale-95"
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'تصفح جميع المدونات والورقة الفكرية' : 'Browse All Blogs'}</span>
          </button>
        </div>

        {/* 4 Interactive Cards for Blogs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1 */}
          <div
            onClick={onOpenBlogModal}
            className="bg-slate-950 border border-emerald-500/30 hover:border-emerald-500/70 rounded-2xl p-5 space-y-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 group relative shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-md border border-emerald-500/20">
                {isAr ? 'المقال المرجعي الرئيسي' : 'Featured Master Article'}
              </span>
              <ArrowIcon className="w-4 h-4 text-emerald-400 opacity-0 group-hover:opacity-100 transition duration-300" />
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition leading-snug">
              {isAr ? '1. كيف يمكن للتقنية أن تستعيد دورها الإنساني؟' : '1. How Can Technology Regain Its Human Role?'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {isAr ? 'البعد الحضاري لنظرية اقتصاد الانتباه التبادلي - المفهوم، المبادئ، والميثاق الحضاري.' : 'The Civilizational Dimension of Reciprocal Attention Economy Theory.'}
            </p>

            <div className="pt-1 flex items-center justify-between text-xs font-bold text-emerald-400 border-t border-slate-900">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isAr ? 'اقرأ المقال كاملاً مع الفهرس' : 'Read Article & Index'}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">{isAr ? 'بقلم: فايز الجبالي' : 'By Fayez Al-Jebali'}</span>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={onOpenBlogModal}
            className="bg-slate-950 border border-slate-800 hover:border-teal-500/60 rounded-2xl p-5 space-y-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 group relative shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-teal-400 bg-teal-500/10 px-2.5 py-0.5 rounded-md border border-teal-500/20">
                {isAr ? 'البعد الأول والرئيسي' : 'Human at the Center'}
              </span>
              <ArrowIcon className="w-4 h-4 text-teal-400 opacity-0 group-hover:opacity-100 transition duration-300" />
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition leading-snug">
              {isAr ? '2. إعادة الإنسان إلى مركز التقنية وتحويل الاتصال إلى علاقة' : '2. Human at Tech Center & Relations'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {isAr ? 'الإنسان غاية التقنية الأساسية لتعزيز الكرامة والفرص وليس لزيادة معدلات الاستهلاك.' : 'Technology as a means for human dignity, not consumption.'}
            </p>

            <div className="pt-1 flex items-center justify-between text-xs font-bold text-teal-400 border-t border-slate-900">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isAr ? 'انتقل إلى القسم بداخل المدونة' : 'Jump to Section'}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">{isAr ? 'فايز الجبالي' : 'Fayez Al-Jebali'}</span>
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={onOpenBlogModal}
            className="bg-slate-950 border border-slate-800 hover:border-amber-500/60 rounded-2xl p-5 space-y-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 group relative shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                {isAr ? 'الانتباه والمسؤولية' : 'Attention & Responsibility'}
              </span>
              <ArrowIcon className="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition duration-300" />
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition leading-snug">
              {isAr ? '3. تحويل الانتباه إلى مسؤولية وثقافة مشاركة يومية' : '3. Attention into Daily Action'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {isAr ? 'اعتبار الانتباه مسؤولية أخلاقية لربط التعاون الإنساني بالاستخدام اليومي للتقنية.' : 'Turning attention into ethical responsibility and social bridge.'}
            </p>

            <div className="pt-1 flex items-center justify-between text-xs font-bold text-amber-400 border-t border-slate-900">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isAr ? 'تصفح القسم في المدونة' : 'Read Section'}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">{isAr ? 'مدونة الفكر' : 'Blog Paper'}</span>
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={onOpenBlogModal}
            className="bg-slate-950 border border-slate-800 hover:border-sky-500/60 rounded-2xl p-5 space-y-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 group relative shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-sky-400 bg-sky-500/10 px-2.5 py-0.5 rounded-md border border-sky-500/20">
                {isAr ? 'الميثاق الحضاري' : 'Civilizational Covenant'}
              </span>
              <ArrowIcon className="w-4 h-4 text-sky-400 opacity-0 group-hover:opacity-100 transition duration-300" />
            </div>

            <h3 className="text-base font-bold text-white group-hover:text-sky-300 transition leading-snug">
              {isAr ? '4. الميثاق الحضاري لنظرية اقتصاد الانتباه التبادلي' : '4. Civilizational Covenant & Impact'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-medium">
              {isAr ? 'وثيقة تحدد الغاية الحضارية: معيار نجاح التقنية بمدى ما تضيفه من كرامة واستدامة إنسانية.' : 'A document defining technology success by added human dignity and ecology.'}
            </p>

            <div className="pt-1 flex items-center justify-between text-xs font-bold text-sky-400 border-t border-slate-900">
              <span className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{isAr ? 'اقرأ الميثاق الحضاري كاملاً' : 'Read Full Covenant'}</span>
              </span>
              <span className="text-[11px] text-slate-400 font-normal">{isAr ? 'فايز الجبالي' : 'Fayez Al-Jebali'}</span>
            </div>
          </div>
        </div>
      </motion.section>

      {/* 1. Support Stopwatch / Time Donation Widget */}
      <SupportStopwatchWidget
        lang={lang}
        onOpenChannel={() => onNavigateTab('supporter')}
        supportedChannelsCount={totalVisitsCount}
      />

      {/* 2. Near Monetization Channels (الأقرب لتحقيق شروط الربح) */}
      <NearMonetizationChannelsWidget
        publishers={publishers}
        lang={lang}
        onOpenPublisherLink={(pub) => {
          if (onOpenPublisherLink) {
            onOpenPublisherLink(pub);
          } else {
            onNavigateTab('supporter');
          }
        }}
      />

      {/* 3. Rescued Livelihoods Stories (أنقذت رزقي) */}
      <RescuedLivelihoodsSection
        lang={lang}
        stories={initialRescuedStories}
        onOpenStoryUrl={(url) => window.open(url, '_blank', 'noopener,noreferrer')}
      />

      {/* 4. Predictive Growth Chart */}
      <PredictiveGrowthChart lang={lang} />

      {/* Governance Values Section */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-4"
      >
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>{isAr ? 'المبادئ المعمارية الحوكمية لمنصة نور الأماني' : 'Governance & Architectural Principles'}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-1">
            <div className="font-bold text-emerald-400">
              {isAr ? '1. حيادية وعدالة الظهور' : '1. Neutrality & Fair Exposure'}
            </div>
            <p className="text-slate-400 leading-relaxed">
              {isAr
                ? 'محرك العدالة FAIR يمنع احتكار القنوات الكبيرة، ويعطي أولوية للقنوات الناشئة والأقل حظاً في الزيارات.'
                : 'FAIR engine prevents exposure monopolies, giving priority to newly registered and under-visited creators.'}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-1">
            <div className="font-bold text-teal-400">
              {isAr ? '2. احترام الملكية والأصل' : '2. Direct Platform Linking'}
            </div>
            <p className="text-slate-400 leading-relaxed">
              {isAr
                ? 'لا يتم تغيير محتوى الناشر أو اقتطاعه أو التربح منه. التفاعل والتصفح يتمان بالكامل داخل المنصة الأصلية.'
                : 'Content is never re-hosted or monetized. All viewings and interactions occur directly on native platforms.'}
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition space-y-1">
            <div className="font-bold text-amber-400">
              {isAr ? '3. خلو من التنافسية وألعاب التفاعل' : '3. Zero Gamification Policy'}
            </div>
            <p className="text-slate-400 leading-relaxed">
              {isAr
                ? 'يُمنع منعاً باتاً أزرار الإعجاب، التعليقات العامة، أو عدادات المقارنة التنافسية صوناً لكرامة الناشرين المتضررين.'
                : 'Strict ban on public likes, comments, and competitive counters to protect human dignity.'}
            </p>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export const HomeScreenView = memo(HomeScreenViewComponent);



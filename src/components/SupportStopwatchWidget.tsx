import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Clock, Play, Pause, RotateCcw, Heart, Award, Sparkles, Zap, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { Language } from '../types';

interface SupportStopwatchWidgetProps {
  lang: Language;
  onOpenChannel?: (publisherId?: string) => void;
  supportedChannelsCount?: number;
}

export const SupportStopwatchWidget: React.FC<SupportStopwatchWidgetProps> = ({
  lang,
  onOpenChannel,
  supportedChannelsCount = 0,
}) => {
  const isAr = lang === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [selectedMinutes, setSelectedMinutes] = useState<number>(10);
  const [secondsLeft, setSecondsLeft] = useState<number>(10 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [totalDonatedMinutes, setTotalDonatedMinutes] = useState<number>(0);

  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && secondsLeft === 0) {
      setIsRunning(false);
      setCompletedSessions((prev) => prev + 1);
      setTotalDonatedMinutes((prev) => prev + selectedMinutes);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft, selectedMinutes]);

  const handleSelectMinutes = (mins: number) => {
    setSelectedMinutes(mins);
    setSecondsLeft(mins * 60);
    setIsRunning(false);
  };

  const handleToggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(selectedMinutes * 60);
  };

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Badge Logic
  const calculatedViews = totalDonatedMinutes * 12 + completedSessions * 30 + supportedChannelsCount * 15;
  let badgeTitle = isAr ? 'داعم مبتدئ' : 'Novice Supporter';
  let badgeIcon = '🌱';
  if (calculatedViews >= 10000) {
    badgeTitle = isAr ? 'نور الأمل العالمي 🌟' : 'Global Light of Hope 🌟';
    badgeIcon = '✨';
  } else if (calculatedViews >= 1000) {
    badgeTitle = isAr ? 'سفير الإنسانية 🏅' : 'Ambassador of Humanity 🏅';
    badgeIcon = '🎗️';
  } else if (calculatedViews >= 100) {
    badgeTitle = isAr ? 'وسام إنسان 🎖️' : 'Humanity Badge 🎖️';
    badgeIcon = '🎖️';
  }

  const progressToNextBadge = Math.min(100, (calculatedViews / (calculatedViews >= 1000 ? 10000 : calculatedViews >= 100 ? 1000 : 100)) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-slate-900 via-slate-920 to-slate-950 border border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden text-right"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Background Accent Lines */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
        {/* Title & Philosophy Header */}
        <div className="space-y-3 flex-1 text-center lg:text-right">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'مفهوم التبرع بالوقت بدل المال' : 'Donate Time Instead of Money'}</span>
          </div>

          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug">
            {isAr ? 'مؤقت الدعم التكافلي (Donate Your Time)' : 'Humanitarian Support Stopwatch'}
          </h2>

          <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium max-w-xl">
            {isAr
              ? 'تعهّد بـ 10 دقائق من وقت فراغك اليوم لمشاهدة، والتفاعل، والاشتراك في قنوات أسر وصناع محتوى في مناطق الأزمات. أنت تجبر الشركات الكبرى على دفع عوائدها لهم كرزق كريم دون أن تدفع مالاً من جيبك.'
              : 'Commit 10 minutes of your time to watch, like, and subscribe to creators in crisis zones, turning platform ad revenues into dignifying livelihoods.'}
          </p>

          {/* Preset Minute Chips */}
          <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-2">
            {[5, 10, 15, 20, 30].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => handleSelectMinutes(mins)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer min-h-[36px] ${
                  selectedMinutes === mins && !isRunning
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {mins} {isAr ? 'دقائق' : 'Mins'}
              </button>
            ))}
          </div>
        </div>

        {/* Live Timer Counter Card */}
        <div className="bg-slate-950/90 border border-emerald-500/40 rounded-2xl p-6 w-full max-w-sm flex flex-col items-center justify-center space-y-4 shadow-inner">
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
              {isRunning
                ? (isAr ? 'جلسة التبرع بالوقت نشطة ⚡' : 'Time Donation Active ⚡')
                : (isAr ? 'المؤقت جاهز للانطلاق' : 'Timer Ready')}
            </span>
            <div className="text-4xl md:text-5xl font-mono font-black text-white tracking-widest text-emerald-300 drop-shadow-md">
              {formatTime(secondsLeft)}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 w-full">
            <button
              type="button"
              onClick={handleToggleTimer}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer min-h-[44px] shadow-lg ${
                isRunning
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white'
              }`}
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunning ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'ابدأ جلسة الدعم' : 'Start Session')}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="p-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 rounded-xl transition min-h-[44px] min-w-[44px] flex items-center justify-center"
              title={isAr ? 'إعادة ضبط' : 'Reset'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Impact Stats & Badge Progress */}
          <div className="w-full pt-3 border-t border-slate-900 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>{badgeTitle}</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-mono font-bold">
                {calculatedViews} {isAr ? 'مساهمة مشاهدة' : 'Views Impact'}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${progressToNextBadge}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
              <span>{isAr ? `دليل أوسمة العطاء التكافلي` : 'Humanitarian Badges'}</span>
              <span>{totalDonatedMinutes} {isAr ? 'دقيقة متبرع بها' : 'Mins Donated'}</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Publisher,
  Language,
  CategoryType,
  PlatformType,
  FairEngineWeights,
  SupporterAction,
  FocusModePreferences,
} from '../types';
import {
  translations,
  getCategoryLabel,
  isRTL,
} from '../lib/i18n';
import { FocusModeService } from '../services/focusModeService';
import {
  Maximize2,
  ChevronRight,
  ChevronLeft,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Zap,
  RotateCcw,
  Sliders,
  X,
  Youtube,
  Send,
  X as XIcon,
  Facebook,
  Instagram,
  Video,
  Globe,
  Sparkles,
  LayoutGrid,
  Square,
  ArrowRight,
  ArrowLeft,
  Heart,
  Clock,
} from 'lucide-react';

interface FocusedModeViewProps {
  publishers: Publisher[];
  weights: FairEngineWeights;
  lang: Language;
  onRecordAction: (action: SupporterAction) => void;
  onClose: () => void;
}

export const FocusedModeView: React.FC<FocusedModeViewProps> = ({
  publishers,
  weights,
  lang,
  onRecordAction,
  onClose,
}) => {
  const t = translations[lang];
  const rtl = isRTL(lang);

  // Load preferences via service
  const [prefs, setPrefs] = useState<FocusModePreferences>(() =>
    FocusModeService.loadPreferences()
  );

  // Active index for Single Card Mode
  const [currentIndex, setCurrentIndex] = useState(0);

  // Session impact count
  const [sessionSupportedCount, setSessionSupportedCount] = useState(0);

  // Focus Session Duration (in minutes) and Countdown Timer State
  const [focusDurationMins, setFocusDurationMins] = useState<number>(25);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState<number>(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Focus Session Countdown Effect
  useEffect(() => {
    if (!isTimerRunning) return;
    const interval = setInterval(() => {
      setTimeLeftSeconds((prev) => {
        if (prev <= 1) {
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Confirmation modal for outbound support redirect
  const [activeOutboundPublisher, setActiveOutboundPublisher] = useState<Publisher | null>(null);

  // Save prefs on change
  const handlePrefChange = (updated: Partial<FocusModePreferences>) => {
    const newPrefs = { ...prefs, ...updated };
    setPrefs(newPrefs);
    FocusModeService.savePreferences(newPrefs);
    setCurrentIndex(0); // Reset index when filters change
  };

  // Filtered & sorted list
  const focusedPublishers = useMemo(() => {
    return FocusModeService.filterAndSortPublishers(publishers, prefs, weights);
  }, [publishers, prefs, weights]);

  const currentPublisher = focusedPublishers[currentIndex] || null;

  // Platform Icon helper
  const getPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case 'YouTube':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'Telegram':
        return <Send className="w-4 h-4 text-sky-400" />;
      case 'X':
        return <XIcon className="w-4 h-4 text-slate-200" />;
      case 'Facebook':
        return <Facebook className="w-4 h-4 text-blue-500" />;
      case 'Instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'TikTok':
        return <Video className="w-4 h-4 text-teal-400" />;
      default:
        return <Globe className="w-4 h-4 text-emerald-400" />;
    }
  };

  // Navigation handlers
  const handleNext = useCallback(() => {
    if (focusedPublishers.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % focusedPublishers.length);
  }, [focusedPublishers.length]);

  const handlePrev = useCallback(() => {
    if (focusedPublishers.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + focusedPublishers.length) % focusedPublishers.length);
  }, [focusedPublishers.length]);

  const handleRandom = () => {
    if (focusedPublishers.length <= 1) return;
    let randomIndex = Math.floor(Math.random() * focusedPublishers.length);
    if (randomIndex === currentIndex) {
      randomIndex = (randomIndex + 1) % focusedPublishers.length;
    }
    setCurrentIndex(randomIndex);
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeOutboundPublisher) return; // Don't trigger if modal is open
      if (e.key === 'ArrowRight') {
        if (rtl) handlePrev();
        else handleNext();
      } else if (e.key === 'ArrowLeft') {
        if (rtl) handleNext();
        else handlePrev();
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, rtl, onClose, activeOutboundPublisher]);

  // Outbound support execution
  const executeOutboundSupport = (publisher: Publisher) => {
    onRecordAction({
      id: `act-${Date.now()}`,
      publisherId: publisher.id,
      publisherName: publisher.name,
      platform: publisher.platform,
      timestamp: new Date().toISOString(),
    });

    setSessionSupportedCount((prev) => prev + 1);

    // Open link in new window
    window.open(publisher.externalUrl, '_blank', 'noopener,noreferrer');
    setActiveOutboundPublisher(null);

    // Auto advance if enabled
    if (prefs.autoNextOnSupport && prefs.viewLayout === 'SINGLE_CARD') {
      handleNext();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-xl text-slate-100 flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Focus Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <Zap className="w-5 h-5 fill-slate-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">{t.focusedMode}</h2>
              <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                {focusedPublishers.length} {t.publisherCount}
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">{t.focusedModeSubtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Focus Session Minutes Controller & Countdown Timer */}
          <div className="flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-300 font-medium hidden sm:inline">دقائق التركيز:</span>
            <select
              value={focusDurationMins}
              onChange={(e) => {
                const mins = Number(e.target.value);
                setFocusDurationMins(mins);
                setTimeLeftSeconds(mins * 60);
                setIsTimerRunning(true);
              }}
              className="bg-slate-950 text-amber-300 font-mono font-bold text-xs border border-slate-700/80 rounded-lg px-2 py-0.5 focus:outline-none focus:border-amber-400 cursor-pointer"
            >
              <option value={5}>5 دقائق</option>
              <option value={10}>10 دقائق</option>
              <option value={15}>15 دقيقة</option>
              <option value={25}>25 دقيقة</option>
              <option value={30}>30 دقيقة</option>
              <option value={45}>45 دقيقة</option>
              <option value={60}>60 دقيقة</option>
            </select>
            <span className="font-mono font-bold text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-[11px]">
              {Math.floor(timeLeftSeconds / 60)}:{String(timeLeftSeconds % 60).padStart(2, '0')}
            </span>
          </div>

          {/* Session Impact Stats */}
          <div className="hidden md:flex items-center gap-2 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span className="text-slate-300">{t.sessionImpact}:</span>
            <span className="font-bold text-emerald-400">{sessionSupportedCount}</span>
          </div>

          {/* Close Focus Mode */}
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-700 transition text-xs font-medium"
          >
            <X className="w-4 h-4" />
            <span>{t.exitFocusedMode}</span>
          </button>
        </div>
      </div>

      {/* Preferences Toolbar */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2.5 text-xs overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Filter Toggles */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" />
              {t.focusPreferences}:
            </span>

            {/* Category Filter */}
            <select
              value={prefs.category}
              onChange={(e) => handlePrefChange({ category: e.target.value as CategoryType | 'ALL' })}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">{t.filterCategory}</option>
              <option value="FIELD_REPORTING">{t.catFieldReporting}</option>
              <option value="RELIEF_AND_MEDICAL">{t.catReliefMedical}</option>
              <option value="SHELTER_AND_FOOD">{t.catShelterFood}</option>
              <option value="CIVIL_DEFENSE_RESCUE">{t.catCivilRescue}</option>
              <option value="YOUTH_AND_RESILIENCE">{t.catYouthResilience}</option>
              <option value="COMMUNITY_NEWS">{t.catCommunityNews}</option>
            </select>

            {/* Platform Filter */}
            <select
              value={prefs.platform}
              onChange={(e) => handlePrefChange({ platform: e.target.value as PlatformType | 'ALL' })}
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">{t.filterPlatform}</option>
              <option value="YouTube">YouTube</option>
              <option value="Telegram">Telegram</option>
              <option value="X">X (Twitter)</option>
              <option value="TikTok">TikTok</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="Website">Website</option>
            </select>

            {/* Priority Sort */}
            <select
              value={prefs.prioritySort}
              onChange={(e) =>
                handlePrefChange({
                  prioritySort: e.target.value as 'HIGH_NEED' | 'FAIR_SCORE' | 'RECENT_UPDATE',
                })
              }
              className="bg-slate-800 text-emerald-300 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-medium focus:outline-none focus:border-emerald-500"
            >
              <option value="HIGH_NEED">{t.highNeedPriority}</option>
              <option value="FAIR_SCORE">{t.fairScorePriority}</option>
              <option value="RECENT_UPDATE">{t.recentPriority}</option>
            </select>

            {/* Min Verification */}
            <select
              value={prefs.minVerification}
              onChange={(e) =>
                handlePrefChange({
                  minVerification: e.target.value as 'ALL' | 'GOLD' | 'PLATINUM',
                })
              }
              className="bg-slate-800 text-slate-200 border border-slate-700 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-emerald-500"
            >
              <option value="ALL">{t.allTiers}</option>
              <option value="GOLD">{t.goldAndPlatinum}</option>
              <option value="PLATINUM">{t.platinumOnly}</option>
            </select>
          </div>

          {/* View Mode & Auto Advance Controls */}
          <div className="flex items-center gap-3">
            {/* Auto advance check */}
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white transition">
              <input
                type="checkbox"
                checked={prefs.autoNextOnSupport}
                onChange={(e) => handlePrefChange({ autoNextOnSupport: e.target.checked })}
                className="w-3.5 h-3.5 accent-emerald-500 rounded"
              />
              <span className="hidden sm:inline">{t.autoAdvanceOnSupport}</span>
            </label>

            {/* Layout Toggle */}
            <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
              <button
                onClick={() => handlePrefChange({ viewLayout: 'SINGLE_CARD' })}
                title={t.singleCardMode}
                className={`p-1 rounded ${
                  prefs.viewLayout === 'SINGLE_CARD'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Square className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handlePrefChange({ viewLayout: 'COMPACT_GRID' })}
                title={t.compactGridMode}
                className={`p-1 rounded ${
                  prefs.viewLayout === 'COMPACT_GRID'
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col justify-between">
        {focusedPublishers.length === 0 ? (
          <div className="my-auto max-w-md mx-auto text-center p-8 bg-slate-900/60 rounded-2xl border border-slate-800">
            <Zap className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">{t.noChannelsMatchFocus}</h3>
            <p className="text-xs text-slate-400 mb-4">{t.focusedModeSubtitle}</p>
            <button
              onClick={() =>
                handlePrefChange({
                  category: 'ALL',
                  platform: 'ALL',
                  minVerification: 'ALL',
                })
              }
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>{t.resetFocusFilters}</span>
            </button>
          </div>
        ) : prefs.viewLayout === 'SINGLE_CARD' && currentPublisher ? (
          /* Single Focused Card View */
          <div className="my-auto max-w-2xl mx-auto w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPublisher.id}
                initial={{ opacity: 0, scale: 0.96, y: 12 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800/90 hover:border-emerald-500/40 rounded-3xl p-6 md:p-8 shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 relative overflow-hidden group hover:-translate-y-0.5"
              >
                {/* Subtle Ambient Background */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 group-hover:bg-emerald-500/20 rounded-full blur-3xl pointer-events-none transition-all duration-500 group-hover:scale-125"></div>

                {/* Header Info */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        src={currentPublisher.avatar}
                        alt={currentPublisher.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700 shadow-md group-hover:border-emerald-500/50 transition-colors duration-300"
                      />
                      <div className="absolute -bottom-1 -right-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
                        {getPlatformIcon(currentPublisher.platform)}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors duration-300">
                          {currentPublisher.name}
                        </h3>
                        {currentPublisher.verificationLevel === 'PLATINUM' ? (
                          <span className="inline-flex items-center gap-1 bg-purple-500/20 text-purple-300 text-xs px-2.5 py-0.5 rounded-full border border-purple-500/30 font-semibold">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            {currentPublisher.verificationLevel}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full border border-amber-500/30 font-semibold">
                            <ShieldCheck className="w-3 h-3 text-amber-400" />
                            {currentPublisher.verificationLevel}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <span>{currentPublisher.location}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-medium">
                          {getCategoryLabel(currentPublisher.category, lang)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Counter Badge */}
                  <div className="bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 font-mono">
                    {currentIndex + 1} / {focusedPublishers.length}
                  </div>
                </div>

                {/* Description */}
                <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 group-hover:border-slate-700/80 mb-6 text-sm text-slate-200 leading-relaxed transition-colors duration-300">
                  {currentPublisher.description}
                </div>

                {/* Channel Stats Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 text-xs">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 group-hover:border-slate-700/60 transition-colors duration-300">
                    <span className="text-slate-400 block mb-1">{t.totalOutboundVisits}</span>
                    <span className="text-base font-bold text-emerald-400">
                      {currentPublisher.totalVisitsFromPlatform}
                    </span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 group-hover:border-slate-700/60 transition-colors duration-300">
                    <span className="text-slate-400 block mb-1">{t.fairOpportunityScore}</span>
                    <span className="text-base font-bold text-teal-300">
                      {currentPublisher.fairScore || 85}/100
                    </span>
                  </div>

                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800/80 col-span-2 sm:col-span-1 group-hover:border-slate-700/60 transition-colors duration-300">
                    <span className="text-slate-400 block mb-1">{t.platformSelect}</span>
                    <span className="text-base font-bold text-slate-200 flex items-center gap-1.5">
                      {getPlatformIcon(currentPublisher.platform)}
                      {currentPublisher.platform}
                    </span>
                  </div>
                </div>

                {/* Action Support Button */}
                <button
                  onClick={() => setActiveOutboundPublisher(currentPublisher)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-base py-4 px-6 rounded-2xl transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-3 group/btn"
                >
                  <span>{t.supportDirectly}</span>
                  <ExternalLink className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" />
                </button>
              </motion.div>
            </AnimatePresence>

            {/* Focused Navigation Buttons */}
            <div className="flex items-center justify-between gap-4 mt-6">
              <button
                onClick={handlePrev}
                className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-800 transition text-xs font-medium active:scale-95"
              >
                {rtl ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                <span>{t.prevChannel}</span>
              </button>

              <button
                onClick={handleRandom}
                className="bg-slate-900 hover:bg-slate-800 text-teal-400 hover:text-teal-300 px-4 py-2.5 rounded-xl border border-slate-800 transition text-xs font-medium flex items-center gap-1.5 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.randomChannel}</span>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl transition text-xs shadow-md active:scale-95"
              >
                <span>{t.nextChannel}</span>
                {rtl ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>

            <p className="text-center text-xs text-slate-500 mt-4">
              {t.keyboardNavigationTip}
            </p>
          </div>
        ) : (
          /* Clean Compact List View */
          <div className="max-w-4xl mx-auto w-full space-y-3 my-auto">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>{t.compactGridMode}</span>
              <span>{focusedPublishers.length} {t.publisherCount}</span>
            </div>

            <motion.div
              key={prefs.category + prefs.platform + prefs.minVerification + prefs.prioritySort}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-3 group/grid"
            >
              {focusedPublishers.map((publisher, idx) => (
                <motion.div
                  key={publisher.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.04, 0.3) }}
                  className="bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/40 p-4 rounded-2xl transition-all duration-300 flex items-center justify-between gap-4 group/card group-hover/grid:opacity-50 hover:!opacity-100 hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={publisher.avatar}
                      alt={publisher.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 group-hover/card:border-emerald-500/50 shrink-0 transition-colors duration-300"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-white group-hover/card:text-emerald-300 text-sm truncate transition-colors duration-300">{publisher.name}</h4>
                        <span className="shrink-0">{getPlatformIcon(publisher.platform)}</span>
                      </div>
                      <p className="text-xs text-slate-400 truncate mt-0.5">
                        {publisher.location} • {getCategoryLabel(publisher.category, lang)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveOutboundPublisher(publisher)}
                    className="shrink-0 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/20 px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <span>{t.openChannelLink}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Outbound Notice Confirmation Modal */}
      <AnimatePresence>
        {activeOutboundPublisher && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl relative"
            >
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 border border-emerald-500/20">
                <ExternalLink className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-white mb-2">{t.outboundNoticeTitle}</h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-6">
                {t.outboundNoticeDesc}
              </p>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6 flex items-center gap-3">
                <img
                  src={activeOutboundPublisher.avatar}
                  alt={activeOutboundPublisher.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <div className="font-bold text-white text-sm">
                    {activeOutboundPublisher.name}
                  </div>
                  <div className="text-xs text-emerald-400 flex items-center gap-1">
                    {getPlatformIcon(activeOutboundPublisher.platform)}
                    <span>{activeOutboundPublisher.platform}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setActiveOutboundPublisher(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:bg-slate-800 transition text-xs font-medium"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={() => executeOutboundSupport(activeOutboundPublisher)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <span>{t.confirmOutbound}</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

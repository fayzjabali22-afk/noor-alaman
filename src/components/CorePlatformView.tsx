import React, { useState, useMemo } from 'react';
import {
  Publisher,
  Language,
  CategoryType,
  PlatformType,
  FairEngineWeights,
  SupporterAction,
} from '../types';
import {
  translations,
  getCategoryLabel,
  getLifecycleLabel,
} from '../lib/i18n';
import { calculatePublisherFairScore } from '../lib/fairEngine';
import { TrustBadge } from './TrustBadge';
import {
  Search,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  TrendingUp,
  MapPin,
  Clock,
  Sparkles,
  Info,
  Youtube,
  Send,
  X as XIcon,
  Facebook,
  Instagram,
  Video,
  Globe,
} from 'lucide-react';

interface CorePlatformViewProps {
  publishers: Publisher[];
  setPublishers: React.Dispatch<React.SetStateAction<Publisher[]>>;
  weights: FairEngineWeights;
  lang: Language;
  onRecordAction: (action: SupporterAction) => void;
  onOpenFairEngineConfig: () => void;
  onOpenFocusMode?: () => void;
}

export const CorePlatformView: React.FC<CorePlatformViewProps> = ({
  publishers,
  setPublishers,
  weights,
  lang,
  onRecordAction,
  onOpenFairEngineConfig,
  onOpenFocusMode,
}) => {
  const t = translations[lang];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'FAIR' | 'VISITS_ASC' | 'VERIFICATION'>('FAIR');
  const [activeOutboundPublisher, setActiveOutboundPublisher] = useState<Publisher | null>(null);
  const [selectedFairHistoryPublisher, setSelectedFairHistoryPublisher] = useState<Publisher | null>(null);

  // Platform icon helper
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

  // Filter & Sort
  const processedPublishers = useMemo(() => {
    let list = publishers.map((p) => ({
      ...p,
      fairScore: calculatePublisherFairScore(p, weights),
    }));

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== 'ALL') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Platform filter
    if (selectedPlatform !== 'ALL') {
      list = list.filter((p) => p.platform === selectedPlatform);
    }

    // Sorting
    if (sortBy === 'FAIR') {
      list.sort((a, b) => (b.fairScore || 0) - (a.fairScore || 0));
    } else if (sortBy === 'VISITS_ASC') {
      list.sort((a, b) => a.totalVisitsFromPlatform - b.totalVisitsFromPlatform);
    } else if (sortBy === 'VERIFICATION') {
      const tierRank = { PLATINUM: 3, GOLD: 2, BASIC: 1 };
      list.sort((a, b) => tierRank[b.verificationLevel] - tierRank[a.verificationLevel]);
    }

    return list;
  }, [publishers, searchQuery, selectedCategory, selectedPlatform, sortBy, weights]);

  // Handle Outbound Redirection Click
  const handleConfirmOutbound = () => {
    if (!activeOutboundPublisher) return;

    const updatedPublisher = {
      ...activeOutboundPublisher,
      totalVisitsFromPlatform: activeOutboundPublisher.totalVisitsFromPlatform + 1,
      lastImpressionTime: new Date().toISOString(),
    };

    // Update state
    setPublishers((prev) =>
      prev.map((p) => (p.id === activeOutboundPublisher.id ? updatedPublisher : p))
    );

    // Record action for Supporter Hub & Audit
    onRecordAction({
      id: `act-${Date.now()}`,
      publisherId: activeOutboundPublisher.id,
      publisherName: activeOutboundPublisher.name,
      platform: activeOutboundPublisher.platform,
      timestamp: new Date().toISOString(),
    });

    // Open external official channel in new tab
    window.open(activeOutboundPublisher.externalUrl, '_blank', 'noopener,noreferrer');

    setActiveOutboundPublisher(null);
  };

  return (
    <div className="space-y-8">
      {/* Platform Concept Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-amber-400"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <Zap className="w-3.5 h-3.5" />
              <span>{t.fairEngineTitle}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              {t.publishersDirectoryTitle}
            </h2>
            <p className="text-slate-400 text-xs md:text-sm max-w-3xl leading-relaxed">
              {t.fairEngineDesc}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {onOpenFocusMode && (
              <button
                onClick={onOpenFocusMode}
                className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-md shadow-emerald-500/20 whitespace-nowrap"
              >
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{t.focusedMode}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="absolute right-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pr-10 pl-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            <span className="text-xs text-slate-400 hidden sm:inline">{t.sortByLabel}</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 text-xs text-emerald-300 rounded-xl border border-slate-800 px-3 py-2 focus:outline-none focus:border-emerald-500 font-medium"
            >
              <option value="FAIR">{t.fairEngineSorting}</option>
              <option value="VISITS_ASC">{t.visitCountSorting}</option>
              <option value="VERIFICATION">{t.verificationSorting}</option>
            </select>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
              selectedCategory === 'ALL'
                ? 'bg-emerald-500 text-slate-950 font-bold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {t.filterCategory}
          </button>

          {(
            [
              'FIELD_REPORTING',
              'RELIEF_AND_MEDICAL',
              'SHELTER_AND_FOOD',
              'CIVIL_DEFENSE_RESCUE',
              'YOUTH_AND_RESILIENCE',
              'COMMUNITY_NEWS',
            ] as CategoryType[]
          ).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {getCategoryLabel(cat, lang)}
            </button>
          ))}
        </div>

        {/* Platform Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-t border-slate-800/60 pt-3">
          <span className="text-slate-500 text-[11px] font-medium hidden sm:inline">
            {t.platformFilterLabel}
          </span>
          <button
            onClick={() => setSelectedPlatform('ALL')}
            className={`px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition ${
              selectedPlatform === 'ALL'
                ? 'bg-slate-700 text-white font-semibold'
                : 'bg-slate-950 text-slate-400 hover:text-white'
            }`}
          >
            {t.filterPlatform}
          </button>
          {(
            ['Telegram', 'YouTube', 'X', 'Instagram', 'Facebook', 'TikTok'] as PlatformType[]
          ).map((plat) => (
            <button
              key={plat}
              onClick={() => setSelectedPlatform(plat)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] whitespace-nowrap transition ${
                selectedPlatform === plat
                  ? 'bg-slate-700 text-white font-semibold'
                  : 'bg-slate-950 text-slate-400 hover:text-white'
              }`}
            >
              {getPlatformIcon(plat)}
              <span>{plat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Directory Count Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span>{t.publisherCount}</span>
          <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
            {processedPublishers.length}
          </span>
        </div>
        <div className="flex items-center gap-1 text-slate-500">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{t.liveDynamicRanking}</span>
        </div>
      </div>

      {/* Publishers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedPublishers.map((publisher) => {
          return (
            <div
              key={publisher.id}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg hover:shadow-2xl transition group relative overflow-hidden"
            >
              {/* Top Accent Line based on verification level */}
              <div
                className={`absolute top-0 right-0 left-0 h-1 ${
                  publisher.verificationLevel === 'PLATINUM'
                    ? 'bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400'
                    : publisher.verificationLevel === 'GOLD'
                    ? 'bg-gradient-to-r from-amber-400 to-emerald-500'
                    : 'bg-slate-700'
                }`}
              ></div>

              <div className="space-y-3">
                {/* Header row: Avatar + Name + Badges */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <div className="flex items-center gap-3">
                    <img
                      src={publisher.avatar}
                      alt={publisher.name}
                      className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md group-hover:scale-105 transition"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5 flex-wrap">
                        <span>{publisher.name}</span>
                        <TrustBadge
                          score={publisher.fairScore || 50}
                          lang={lang}
                          size="sm"
                          hasPendingReports={publisher.reportsCount > 0}
                          openReportsCount={publisher.reportsCount}
                        />
                        {publisher.verificationLevel === 'PLATINUM' && (
                          <ShieldCheck className="w-4 h-4 text-sky-400" title="Platinum Verified" />
                        )}
                        {publisher.verificationLevel === 'GOLD' && (
                          <CheckCircle2 className="w-4 h-4 text-amber-400" title="Gold Verified" />
                        )}
                      </h3>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-emerald-400" />
                        <span>{publisher.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Platform Tag */}
                  <span className="flex items-center gap-1 bg-slate-950 text-slate-300 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
                    {getPlatformIcon(publisher.platform)}
                    <span>{publisher.platform}</span>
                  </span>
                </div>

                {/* Badges: Category & Lifecycle Stage */}
                <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                  <span className="bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/50">
                    {getCategoryLabel(publisher.category, lang)}
                  </span>
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    {getLifecycleLabel(publisher.lifecycleStage, lang)}
                  </span>
                  {publisher.subscribersCount && (
                    <span className="text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800/80">
                      {publisher.subscribersCount}
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {publisher.description}
                </p>
              </div>

              {/* Bottom Metrics & Outbound Redirection Button */}
              <div className="space-y-3 pt-3 border-t border-slate-800/80">
                {/* Metrics Row */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/50">
                  <div>
                    <span className="text-slate-500 block text-[10px]">{t.totalOutboundVisits}</span>
                    <span className="font-bold text-white text-xs">
                      {publisher.totalVisitsFromPlatform.toLocaleString()}
                    </span>
                  </div>

                  <div className="text-left">
                    <span className="text-slate-500 block text-[10px]">{t.fairOpportunityScore}</span>
                    <button
                      onClick={() => setSelectedFairHistoryPublisher(publisher)}
                      className="flex items-center gap-1 group/score hover:opacity-80 transition"
                      title={t.viewFairScoreLog}
                    >
                      <span className="font-extrabold text-emerald-400 text-xs">
                        {publisher.fairScore}/100
                      </span>
                      <TrendingUp className="w-3 h-3 text-emerald-400 group-hover/score:scale-110 transition" />
                    </button>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => setActiveOutboundPublisher(publisher)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition group-hover:shadow-emerald-950/50"
                >
                  <span>{t.openChannelLink}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Outbound Notice Confirmation Modal */}
      {activeOutboundPublisher && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{t.outboundNoticeTitle}</h3>
                <p className="text-xs text-slate-400">
                  {t.directRedirectionPolicy}
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3.5 rounded-xl border border-slate-800">
              {t.outboundNoticeDesc}
            </p>

            <div className="flex items-center gap-3 bg-slate-950/80 p-3 rounded-xl border border-slate-800/80">
              <img
                src={activeOutboundPublisher.avatar}
                alt={activeOutboundPublisher.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <div className="text-xs">
                <h4 className="font-bold text-white">{activeOutboundPublisher.name}</h4>
                <p className="text-slate-400 font-mono text-[11px]">
                  {activeOutboundPublisher.platform} • {activeOutboundPublisher.externalUrl}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={handleConfirmOutbound}
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <span>{t.confirmOutbound}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveOutboundPublisher(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-4 py-2.5 rounded-xl transition"
              >
                {t.cancel}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Fair Score History Transparency Modal */}
      {selectedFairHistoryPublisher && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {t.fairnessTransparencyLogTitle}
                  </h3>
                  <p className="text-xs text-slate-400">{selectedFairHistoryPublisher.name}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFairHistoryPublisher(null)}
                className="text-slate-400 hover:text-white"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">
                  {t.currentFairScoreLabel}
                </span>
                <span className="font-extrabold text-emerald-400 text-sm font-mono">
                  {selectedFairHistoryPublisher.fairScore}/100
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed pt-1">
                {t.fairnessLogDescription}
              </p>
            </div>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {(selectedFairHistoryPublisher.fairScoreHistory && selectedFairHistoryPublisher.fairScoreHistory.length > 0) ? (
                selectedFairHistoryPublisher.fairScoreHistory.map((hist) => (
                  <div key={hist.id} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-800/60">
                        {hist.score} / 100
                      </span>
                      <span className="text-slate-500 text-[10px]">{new Date(hist.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-300 text-xs pt-1">{hist.reason}</p>
                  </div>
                ))
              ) : (
                <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between font-mono text-[11px]">
                    <span className="bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold border border-emerald-800/60">
                      {selectedFairHistoryPublisher.fairScore || 80} / 100
                    </span>
                    <span className="text-slate-500 text-[10px]">
                      {new Date(selectedFairHistoryPublisher.joinedDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-300 text-xs pt-1">
                    {t.initialFairnessReason}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedFairHistoryPublisher(null)}
              className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 rounded-xl transition"
            >
              {t.closeLog}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

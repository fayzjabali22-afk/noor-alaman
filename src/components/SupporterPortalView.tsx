import React, { useState, useMemo } from 'react';
import { apiAdapter } from '../services/apiAdapter';
import { SupporterTimeline } from './SupporterTimeline';
import {
  Publisher,
  SupporterAction,
  Language,
  CategoryType,
  PlatformType,
  FairEngineWeights,
} from '../types';
import { translations, getCategoryLabel, getLifecycleLabel } from '../lib/i18n';
import { calculatePublisherFairScore, calculateTrustScore } from '../lib/fairEngine';
import { ReportModal } from './ReportModal';
import { TrustBadge } from './TrustBadge';
import {
  Heart,
  ExternalLink,
  CheckCircle2,
  History,
  Search,
  MapPin,
  ShieldCheck,
  ShieldAlert,
  Youtube,
  Send,
  X as XIcon,
  Facebook,
  Instagram,
  Video,
  Globe,
  Info,
  Filter,
  Check,
  Award,
} from 'lucide-react';

interface SupporterPortalViewProps {
  supporterActions: SupporterAction[];
  publishers: Publisher[];
  setPublishers: React.Dispatch<React.SetStateAction<Publisher[]>>;
  weights: FairEngineWeights;
  lang: Language;
  onRecordAction: (action: SupporterAction) => void;
  onAddReport?: (report: any) => void;
}

export const SupporterPortalView: React.FC<SupporterPortalViewProps> = ({
  supporterActions,
  publishers,
  setPublishers,
  weights,
  lang,
  onRecordAction,
  onAddReport,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | 'ALL'>('ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'ALL'>('ALL');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'FAIR' | 'VISITS_ASC' | 'VERIFICATION'>('FAIR');
  const [showDormantChannels, setShowDormantChannels] = useState(false);
  const [activeOutboundPublisher, setActiveOutboundPublisher] = useState<Publisher | null>(null);
  const [reportingPublisher, setReportingPublisher] = useState<Publisher | null>(null);

  const dormantCount = useMemo(() => publishers.filter((p) => p.status === 'DORMANT_CHANNEL').length, [publishers]);

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
      calculatedTrust: calculateTrustScore(p),
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

    // Region filter
    if (selectedRegion !== 'ALL') {
      list = list.filter((p) => p.location.includes(selectedRegion));
    }

    // Platform filter
    if (selectedPlatform !== 'ALL') {
      list = list.filter((p) => p.platform === selectedPlatform);
    }

    // Stage filter
    if (selectedStage !== 'ALL') {
      list = list.filter((p) => p.lifecycleStage === selectedStage);
    }

    // Dormant channel filter (Hide dormant channels by default for fair distribution shield)
    if (!showDormantChannels && !searchQuery.trim()) {
      list = list.filter((p) => p.status !== 'DORMANT_CHANNEL');
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
  }, [
    publishers,
    searchQuery,
    selectedCategory,
    selectedRegion,
    selectedPlatform,
    selectedStage,
    sortBy,
    showDormantChannels,
    weights,
  ]);

  // Handle Outbound Redirection Click
  const handleConfirmOutbound = () => {
    if (!activeOutboundPublisher) return;

    const updatedPublisher = {
      ...activeOutboundPublisher,
      totalVisitsFromPlatform: activeOutboundPublisher.totalVisitsFromPlatform + 1,
      lastImpressionTime: new Date().toISOString(),
    };

    setPublishers((prev) =>
      prev.map((p) => (p.id === activeOutboundPublisher.id ? updatedPublisher : p))
    );

    onRecordAction({
      id: `act-${Date.now()}`,
      publisherId: activeOutboundPublisher.id,
      publisherName: activeOutboundPublisher.name,
      platform: activeOutboundPublisher.platform,
      timestamp: new Date().toISOString(),
    });

    // Notify anti-fraud backend endpoint in background via decoupled adapter
    apiAdapter.recordOutboundVisit({
      publisherId: activeOutboundPublisher.id,
      platform: activeOutboundPublisher.platform,
      targetUrl: activeOutboundPublisher.externalUrl,
    }).catch(() => {});

    window.open(activeOutboundPublisher.externalUrl, '_blank', 'noopener,noreferrer');
    setActiveOutboundPublisher(null);
  };

  const handleReportSubmit = (publisherId: string, publisherName: string, reason: string, evidence: string) => {
    // Increment report count on publisher locally
    setPublishers((prev) =>
      prev.map((p) => (p.id === publisherId ? { ...p, reportsCount: p.reportsCount + 1 } : p))
    );

    if (onAddReport) {
      onAddReport({
        id: `rep-${Date.now()}`,
        publisherId,
        publisherName,
        reporterType: 'SUPPORTER',
        reason,
        evidenceDetails: evidence,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
      });
    }

    // Send report to server API endpoint
    fetch('/api/reports/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        publisherId,
        publisherName,
        reporterType: 'SUPPORTER',
        reason,
        evidenceDetails: evidence,
      }),
    }).catch(() => {});
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950/40 to-slate-950 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-xl">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-semibold border border-rose-500/20">
            <Heart className="w-3.5 h-3.5 fill-rose-400/20" />
            <span>{t.supporterSystem}</span>
          </div>
          <h2 id="supporter-portal-heading" className="text-xl md:text-3xl font-bold text-white tracking-wide">
            {t.supporterPortalTitle}
          </h2>
          <p id="supporter-portal-desc" className="text-slate-300 text-xs md:text-sm max-w-3xl leading-relaxed">
            {t.supporterPortalDesc}
          </p>
        </div>
      </div>

      {/* 3-Step Navigation Guidance Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{t.threeStepGuideTitle}</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <div className="font-bold text-white">{t.step1Title}</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {t.step1Desc}
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 font-bold flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <div className="font-bold text-white">{t.step2Title}</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {t.step2Desc}
              </p>
            </div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <div className="font-bold text-white">{t.step3Title}</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {t.step3Desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Search Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
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

          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {dormantCount > 0 && (
              <button
                onClick={() => setShowDormantChannels((prev) => !prev)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border flex items-center gap-1.5 ${
                  showDormantChannels
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-amber-300'
                }`}
                title="تفعيل درع الخمول العادل: إظهار أو إخفاء القنوات المتوقفة عن النشر منذ أكثر من 45 يوماً"
              >
                <History className="w-3.5 h-3.5 text-amber-400" />
                <span>القنوات الخاملة (45+ يوم)</span>
                <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 rounded-full text-[10px] border border-amber-500/30 font-mono">
                  {dormantCount}
                </span>
              </button>
            )}

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

        {/* Region Chips */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t.filterByRegion}</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedRegion('ALL')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                selectedRegion === 'ALL'
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
              }`}
            >
              {t.allRegions}
            </button>
            {['غزة', 'شمال القطاع', 'خان يونس', 'دير البلح', 'رفح', 'القدس', 'الضفة الغربية'].map((reg) => (
              <button
                key={reg}
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                  selectedRegion === reg
                    ? 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* Category Chips */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <div className="text-[11px] text-slate-400 font-medium flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <span>{t.filterByCategory}</span>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition ${
                selectedCategory === 'ALL'
                  ? 'bg-teal-500 text-slate-950 font-bold'
                  : 'bg-slate-950 text-slate-300 hover:bg-slate-800'
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
                    ? 'bg-teal-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {getCategoryLabel(cat, lang)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span>{t.publisherCount}</span>
          <span className="bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-500/20">
            {processedPublishers.length}
          </span>
        </div>
      </div>

      {/* Publisher Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {processedPublishers.map((publisher) => (
          <div
            key={publisher.id}
            className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg hover:shadow-2xl transition group relative overflow-hidden"
          >
            {/* Top Verification Accent Line */}
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
              {/* Header: Avatar + Name + Platform & Red Flag Report Button */}
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

                <div className="flex items-center gap-1.5">
                  <span className="flex items-center gap-1 bg-slate-950 text-slate-300 text-[11px] font-medium px-2.5 py-1 rounded-lg border border-slate-800 shrink-0">
                    {getPlatformIcon(publisher.platform)}
                    <span>{publisher.platform}</span>
                  </span>

                  <button
                    onClick={() => setReportingPublisher(publisher)}
                    className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg bg-slate-950 border border-slate-800 transition"
                    title={isAr ? 'تقديم بلاغ عن القناة' : 'Report channel'}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Badges: Category & Stage & Fair Score & Trust Score & Dormant Badge */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                {publisher.status === 'DORMANT_CHANNEL' && (
                  <span className="bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-bold flex items-center gap-1">
                    <History className="w-3 h-3 text-amber-400" />
                    <span>خاملة (45+ يوم)</span>
                  </span>
                )}
                <span className="bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800/50">
                  {getCategoryLabel(publisher.category, lang)}
                </span>
                <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                  {getLifecycleLabel(publisher.lifecycleStage, lang)}
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono font-bold">
                  FAIR: {publisher.fairScore}%
                </span>
                <span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-mono font-bold">
                  TRUST: {publisher.calculatedTrust}%
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {publisher.description}
              </p>
            </div>

            {/* Outbound Link Button */}
            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <button
                onClick={() => setActiveOutboundPublisher(publisher)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-md transition group-hover:shadow-emerald-950/50"
              >
                <span>{t.openChannelLink}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Supporter Action Timeline (NA-ADR Compliant) */}
      <SupporterTimeline
        supporterActions={supporterActions}
        publishers={publishers}
        lang={lang}
        onRevisitChannel={(action) => {
          const pub = publishers.find((p) => p.id === action.publisherId);
          if (pub) {
            setActiveOutboundPublisher(pub);
          } else {
            window.open(action.publisherUrl || '#', '_blank', 'noopener,noreferrer');
          }
        }}
      />

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
                  {isAr ? 'سياسات التوجيه المباشر بمنصة نور الأماني' : 'Direct Redirection Policy'}
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

      {/* Red X Report Modal */}
      <ReportModal
        isOpen={!!reportingPublisher}
        onClose={() => setReportingPublisher(null)}
        publisher={reportingPublisher}
        lang={lang}
        onSubmitReport={handleReportSubmit}
      />
    </div>
  );
};

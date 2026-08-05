import React, { useState, useMemo, useCallback } from 'react';
import { apiAdapter } from '../services/apiAdapter';
import { SupporterTimeline } from './SupporterTimeline';
import { ImpactCalculator } from './features/ImpactCalculator';
import { IntegrityHealthRadar, IntegrityChannelItem } from './features/IntegrityHealthRadar';
import {
  SovereignVault,
  SovereignCertificate,
  SovereignVaultRecord,
} from './features/SovereignVault';
import {
  Publisher,
  SupporterAction,
  Language,
  CategoryType,
  PlatformType,
  FairEngineWeights,
  JasmineCelebrity,
} from '../types';
import { translations, getCategoryLabel, getLifecycleLabel } from '../lib/i18n';
import { useFairEngine } from '../hooks/useFairEngine';
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
  UserCheck,
  Sparkles,
  Eye,
  EyeOff,
  MessageSquare,
  Zap,
  BarChart3,
  Link as LinkIcon,
  AlertTriangle,
  Radio,
  TrendingUp,
  Bell,
  Play,
  Lock,
  ChevronRight,
  HelpCircle,
  Clock,
  ThumbsUp,
  FolderArchive,
} from 'lucide-react';

interface SupporterPortalViewProps {
  supporterActions: SupporterAction[];
  publishers: Publisher[];
  setPublishers: React.Dispatch<React.SetStateAction<Publisher[]>>;
  weights: FairEngineWeights;
  lang: Language;
  onRecordAction: (action: SupporterAction) => void;
  onAddReport?: (report: any) => void;
  isLoading?: boolean;
}

export const SupporterPortalView: React.FC<SupporterPortalViewProps> = ({
  supporterActions,
  publishers,
  setPublishers,
  weights,
  lang,
  onRecordAction,
  onAddReport,
  isLoading = false,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  // Supporter Account / Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [accountTab, setAccountTab] = useState<'overview' | 'guidance' | 'my_media' | 'explore' | 'vault'>('overview');
  const [isGhostMode, setIsGhostMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('noor_supporter_ghost_mode') === 'true';
    } catch (err) {
      console.warn('LocalStorage read warning in SupporterPortalView:', err);
      return false;
    }
  });

  // Supporter Personal Profile State
  const [supporterProfile, setSupporterProfile] = useState<{
    id: string;
    name: string;
    titleRole: string;
    avatar: string;
    verifiedTier: string;
    videoUrl: string;
    statement: string;
    referenceLink: string;
    sponsoredPublisherIds: string[];
  }>({
    id: 'sp-001',
    name: isAr ? 'د. سلمان الكواري' : 'Dr. Salman Al-Kuwari',
    titleRole: isAr ? 'سفير إنساني وكفيل مؤسسي معتمد' : 'Humanitarian Ambassador & Verified Sponsor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    verifiedTier: isAr ? 'كفيل معتمد - المستوى الماسي' : 'Platinum Verified Sponsor',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    statement: isAr
      ? 'نؤمن بالتأثير المستدام من خلال تمكين صناع المحتوى الميدانيين والإنسانيين في فلسطين والدول المتأثرة دون أي وسائط تجارية.'
      : 'Empowering field content creators in Gaza and Palestine through direct non-monetary adoption.',
    referenceLink: 'https://t.me/humanitarian_support_official',
    sponsoredPublisherIds: ['pub-1', 'pub-2', 'pub-4'],
  });

  // Direct Guidance & Traffic Boost Form State
  const [guidanceTargetChannelId, setGuidanceTargetChannelId] = useState<string>('pub-1');
  const [guidanceText, setGuidanceText] = useState('');
  const [trafficBoostVideoUrl, setTrafficBoostVideoUrl] = useState('');
  const [isGuidanceSentSuccess, setIsGuidanceSentSuccess] = useState(false);

  // Search & Filter States
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

  // Handle Ghost Mode Toggle
  const handleToggleGhostMode = () => {
    const nextVal = !isGhostMode;
    setIsGhostMode(nextVal);
    try {
      localStorage.setItem('noor_supporter_ghost_mode', String(nextVal));
    } catch (e) {
      console.error(e);
    }
  };

  // Sponsored Publishers List
  const sponsoredPublishers = useMemo(() => {
    return publishers.filter((p) => supporterProfile.sponsoredPublisherIds.includes(p.id));
  }, [publishers, supporterProfile.sponsoredPublisherIds]);

  // Purely presentational radar channels for IntegrityHealthRadar (NA-SOVEREIGN-EXEC-INTEGRITY-RADAR-013)
  const radarChannelItems = useMemo<IntegrityChannelItem[]>(() => {
    if (sponsoredPublishers.length === 0) {
      return [
        {
          id: 'pub-demo-01',
          name: 'قناة بصمات حرفية ومصنوعات خان يونس',
          status: 'clean',
          purityScore: 100,
          lastAuditDate: '2026-08-04',
          violationsCount: 0,
        },
        {
          id: 'pub-demo-02',
          name: 'قناة تمكين أسر الشمال الحرفية',
          status: 'shielded',
          purityScore: 98,
          lastAuditDate: '2026-08-03',
          violationsCount: 0,
        },
      ];
    }

    return sponsoredPublishers.map((p, idx) => ({
      id: p.id,
      name: p.name,
      status: idx % 3 === 0 ? 'clean' : idx % 3 === 1 ? 'shielded' : 'review',
      purityScore: p.trustScore || 98,
      lastAuditDate: p.lastPublishDate || p.joinedDate || '2026-08-04',
      violationsCount: 0,
    }));
  }, [sponsoredPublishers]);

  // Pure Presentational Data for Sovereign Vault Layer (NA-SOVEREIGN-PROTOCOL-VAULT-ENFORCEMENT-018)
  const supporterCertificates = useMemo<SovereignCertificate[]>(() => [
    {
      id: 'cert-01',
      certificateNo: 'NA-CERT-2026-9901',
      title: isAr ? 'شهادة التوثيق الشرفي والكفالة السيادية' : 'Honorary Sovereign Sponsorship Certificate',
      issueDate: '2026-08-01',
      issuer: isAr ? 'المنصة السيادية - قطاع الكفالة الإنسانية' : 'Sovereign Platform - Supporter Sector',
      status: 'verified',
      category: isAr ? 'كفالة ميدانية مباشرة' : 'Direct Field Sponsorship',
      hashSignature: '0x88f4a92b99c83',
    },
    {
      id: 'cert-02',
      certificateNo: 'NA-CERT-2026-8842',
      title: isAr ? 'وسام حماية الاستقلالية والتكافؤ الرقمي' : 'Digital Autonomy & Parity Shield Medal',
      issueDate: '2026-08-03',
      issuer: isAr ? 'محرك العدالة السيادي (FairEngine)' : 'Sovereign FairEngine',
      status: 'active',
      category: isAr ? 'تعزيز حركة مرورية' : 'Traffic Surge Boost',
      hashSignature: '0x77e1c43d12b01',
    },
  ], [isAr]);

  const supporterVaultRecords = useMemo<SovereignVaultRecord[]>(() => [
    {
      id: 'vrec-01',
      recordNo: 'REC-8801',
      type: isAr ? 'توجيه دفعة مرورية حية' : 'Live Traffic Surge Boost',
      targetChannel: isAr ? 'قناة بصمات حرفية ومصنوعات خان يونس' : 'Khan Younis Craftsmanship Channel',
      impactMetrics: isAr ? '3,850 زيارة أصيلة / 1,240 ساعة تفاعل' : '3,850 Visits / 1,240 Engagement Hours',
      timestamp: '2026-08-04 18:30',
      ghostShielded: isGhostMode,
      watermarkSeal: 'SEAL-0x9911A',
    },
    {
      id: 'vrec-02',
      recordNo: 'REC-8802',
      type: isAr ? 'توثيق سجل النقاء والتدقيق' : 'Purity Audit Log Archival',
      targetChannel: isAr ? 'قناة تمكين أسر الشمال الحرفية' : 'North Artisans Empowerment Channel',
      impactMetrics: isAr ? 'نسبة نقاء 100% / صفر مخالفات' : '100% Purity / 0 Flags',
      timestamp: '2026-08-03 14:15',
      ghostShielded: isGhostMode,
      watermarkSeal: 'SEAL-0x7722B',
    },
  ], [isAr, isGhostMode]);

  // Memoized Callback Handlers for Dumb UI Components (Protocol 88 / NA-DUMB-UI-CONSTRAINT-001)
  const handleExportImpactReport = useCallback(() => {
    alert(
      isAr
        ? 'تم استخراج وتصدير تقرير الأثر التراكمي للجناح السيادي بنجاح.'
        : 'Sovereign cumulative impact report exported successfully.'
    );
  }, [isAr]);

  const handleInspectChannel = useCallback((id: string) => {
    alert(
      isAr
        ? `[رادار النقاء]: نتيجة الفحص المعماري للقناة (${id}): نقي وموثق 100% بدون أي مخالفت أو تلوث إعلاني.`
        : `[Integrity Radar]: Audit result for channel (${id}): 100% clean with zero violations.`
    );
  }, [isAr]);

  const handlePreviewCertificate = useCallback((id: string) => {
    alert(
      isAr
        ? `[معاينة الخزانة]: المعاينة المائية للشهادة (${id}) معتمدة من المنصة السيادية بنسبة 100%.`
        : `[Vault Preview]: Watermarked preview for certificate (${id}) verified.`
    );
  }, [isAr]);

  const handleDownloadCertificate = useCallback((id: string) => {
    alert(
      isAr
        ? `[الخزانة السيادية]: جاري تحميل وتأكيد الختم المائي للشهادة الرقمية (${id}).`
        : `[Sovereign Vault]: Downloading watermarked digital certificate (${id}).`
    );
  }, [isAr]);

  const handleExportVaultArchive = useCallback(() => {
    alert(
      isAr
        ? 'تم تصدير سجل الأرشيف المائي وتوثيق الخزانة السيادية بنجاح.'
        : 'Sovereign Vault watermarked archive exported successfully.'
    );
  }, [isAr]);

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

  const { calculateScore, calculateTrust } = useFairEngine(publishers, weights);

  // Filter & Sort for Explore tab
  const processedPublishers = useMemo(() => {
    let list = publishers.map((p) => ({
      ...p,
      fairScore: calculateScore(p),
      calculatedTrust: calculateTrust(p),
    }));

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.location.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'ALL') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedRegion !== 'ALL') {
      list = list.filter((p) => p.location.includes(selectedRegion));
    }

    if (selectedPlatform !== 'ALL') {
      list = list.filter((p) => p.platform === selectedPlatform);
    }

    if (selectedStage !== 'ALL') {
      list = list.filter((p) => p.lifecycleStage === selectedStage);
    }

    if (!showDormantChannels && !searchQuery.trim()) {
      list = list.filter((p) => p.status !== 'DORMANT_CHANNEL');
    }

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
    calculateScore,
    calculateTrust,
  ]);

  // Toggle Adopt Channel
  const handleToggleSponsorship = (publisherId: string) => {
    setSupporterProfile((prev) => {
      const exists = prev.sponsoredPublisherIds.includes(publisherId);
      const nextIds = exists
        ? prev.sponsoredPublisherIds.filter((id) => id !== publisherId)
        : [...prev.sponsoredPublisherIds, publisherId];
      return { ...prev, sponsoredPublisherIds: nextIds };
    });
  };

  // Send Direct Guidance & Traffic Boost
  const handleSendGuidance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guidanceText.trim()) return;

    const targetPub = publishers.find((p) => p.id === guidanceTargetChannelId);

    onRecordAction({
      id: `guidance-${Date.now()}`,
      publisherId: guidanceTargetChannelId,
      publisherName: targetPub?.name || 'قناة مكفولة',
      platform: targetPub?.platform || 'YouTube',
      timestamp: new Date().toISOString(),
    });

    setIsGuidanceSentSuccess(true);
    setTimeout(() => {
      setIsGuidanceSentSuccess(false);
      setGuidanceText('');
      setTrafficBoostVideoUrl('');
    }, 4000);
  };

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

    apiAdapter.recordOutboundVisit({
      publisherId: activeOutboundPublisher.id,
      platform: activeOutboundPublisher.platform,
      targetUrl: activeOutboundPublisher.externalUrl,
    }).catch((err) => {
      console.warn('Outbound visit record warning:', err);
    });

    window.open(activeOutboundPublisher.externalUrl, '_blank', 'noopener,noreferrer');
    setActiveOutboundPublisher(null);
  };

  const handleReportSubmit = (publisherId: string, publisherName: string, reason: string, evidence: string) => {
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
    }).catch((err) => {
      console.warn('Report submit request warning:', err);
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse" aria-busy="true" aria-label={isAr ? 'جاري تحميل البيانات' : 'Loading data'}>
        {/* Silent Header Skeleton */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 shrink-0" />
              <div className="space-y-2">
                <div className="h-6 w-48 bg-slate-800 rounded-lg" />
                <div className="h-4 w-64 bg-slate-800/70 rounded-lg" />
                <div className="h-3 w-36 bg-slate-800/50 rounded-lg" />
              </div>
            </div>
            <div className="h-12 w-48 bg-slate-800 rounded-2xl shrink-0" />
          </div>
          <div className="flex items-center gap-2 pt-4 border-t border-slate-800/80 overflow-x-auto">
            <div className="h-10 w-36 bg-slate-800 rounded-xl shrink-0" />
            <div className="h-10 w-36 bg-slate-800/70 rounded-xl shrink-0" />
            <div className="h-10 w-36 bg-slate-800/70 rounded-xl shrink-0" />
            <div className="h-10 w-36 bg-slate-800/70 rounded-xl shrink-0" />
          </div>
        </div>

        {/* Silent Metrics Skeleton */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="h-6 w-56 bg-slate-800 rounded-lg" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="h-24 bg-slate-800/60 rounded-2xl p-4 space-y-2">
              <div className="h-3 w-16 bg-slate-700/50 rounded" />
              <div className="h-8 w-24 bg-slate-700/80 rounded" />
            </div>
            <div className="h-24 bg-slate-800/60 rounded-2xl p-4 space-y-2">
              <div className="h-3 w-16 bg-slate-700/50 rounded" />
              <div className="h-8 w-24 bg-slate-700/80 rounded" />
            </div>
            <div className="h-24 bg-slate-800/60 rounded-2xl p-4 space-y-2">
              <div className="h-3 w-16 bg-slate-700/50 rounded" />
              <div className="h-8 w-24 bg-slate-700/80 rounded" />
            </div>
            <div className="h-24 bg-slate-800/60 rounded-2xl p-4 space-y-2">
              <div className="h-3 w-16 bg-slate-700/50 rounded" />
              <div className="h-8 w-24 bg-slate-700/80 rounded" />
            </div>
          </div>
        </div>

        {/* Silent Vault / Radar Skeleton */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
          <div className="h-6 w-64 bg-slate-800 rounded-lg" />
          <div className="h-32 bg-slate-800/40 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* 1. SUPPORTER SIGN-IN / COMMAND ACCOUNT HEADER BAR */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-950 border border-amber-500/30 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Account Profile Details */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={supporterProfile.avatar}
                alt={supporterProfile.name}
                className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-amber-400 shadow-xl shrink-0"
              />
              <div className="absolute -bottom-1 -right-1 bg-slate-950 p-1 rounded-full border border-amber-400">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg md:text-2xl font-black text-white">
                  {supporterProfile.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-extrabold border border-amber-500/30">
                  {supporterProfile.verifiedTier}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {supporterProfile.titleRole}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Radio className="w-3.5 h-3.5" />
                  <span>{isAr ? `الكفالات الميدانية النشطة: ${supporterProfile.sponsoredPublisherIds.length}` : `Active Sponsorships: ${supporterProfile.sponsoredPublisherIds.length}`}</span>
                </span>
                <span>•</span>
                <span className="text-purple-300 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{isAr ? 'حالة التوجيه: مفعّل' : 'Guidance: Active'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Account Actions & Ghost Mode Switch */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
            {/* Ghost Mode Toggle */}
            <div className="flex items-center justify-between sm:justify-start gap-3 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex items-center gap-2">
                {isGhostMode ? (
                  <EyeOff className="w-4 h-4 text-purple-400 shrink-0" />
                ) : (
                  <Eye className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <span>{isAr ? 'وضعية الشبح (الكفالة الصامتة)' : 'Ghost Mode (Silent Sponsor)'}</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {isGhostMode
                      ? (isAr ? 'هويتك مخفية من لوحة الشرف العامة' : 'Hidden from public hall')
                      : (isAr ? 'اسمك وشعارك معلنان بصفتك كفيلاً' : 'Publicly visible sponsor')}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleGhostMode}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isGhostMode ? 'bg-purple-600' : 'bg-slate-700'
                }`}
                title={isAr ? 'تبديل إخفاء/إشهار الهوية' : 'Toggle Identity Concealment'}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    isGhostMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Login / Auth Switch Button */}
            <button
              onClick={() => setIsLoggedIn(!isLoggedIn)}
              className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-850 text-slate-200 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-700 transition cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-amber-400" />
              <span>{isLoggedIn ? (isAr ? 'حساب كفيل نشط' : 'Active Sponsor') : (isAr ? 'تسجيل الدخول كداعم' : 'Sign In Sponsor')}</span>
            </button>
          </div>
        </div>

        {/* Command Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-6 border-t border-slate-800/80 mt-6 text-xs font-bold">
          <button
            onClick={() => setAccountTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
              accountTab === 'overview'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{isAr ? '1. شاشة القيادة وأثر الكفالات' : '1. Leadership & Impact Dashboard'}</span>
          </button>

          <button
            onClick={() => setAccountTab('guidance')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
              accountTab === 'guidance'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>{isAr ? '2. إرسال التوجيهات والدفعة المرورية' : '2. Guidance & Traffic Boost'}</span>
          </button>

          <button
            onClick={() => setAccountTab('my_media')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
              accountTab === 'my_media'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <Video className="w-4 h-4" />
            <span>{isAr ? '3. بيانات الإشهار والفيديوهات المرفوعة' : '3. My Media Statements'}</span>
          </button>

          <button
            onClick={() => setAccountTab('explore')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
              accountTab === 'explore'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{isAr ? '4. دليل القنوات الميدانية المتاحة' : '4. Explore Field Channels'}</span>
          </button>

          <button
            onClick={() => setAccountTab('vault')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition whitespace-nowrap cursor-pointer ${
              accountTab === 'vault'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'bg-slate-950 text-slate-300 hover:bg-slate-900 border border-slate-800'
            }`}
          >
            <FolderArchive className="w-4 h-4 text-amber-400" />
            <span>{isAr ? '5. الخزانة السيادية والشهادات' : '5. Sovereign Vault & Certificates'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW & SPONSORED CHANNELS */}
      {accountTab === 'overview' && (
        <div className="space-y-6">
          {/* Cumulative Non-Monetary Impact Metrics Component */}
          <ImpactCalculator
            totalEngagementHours={1240}
            totalOutboundVisits={3850}
            sponsoredChannelsCount={supporterProfile.sponsoredPublisherIds.length}
            integrityHealthPercent={100}
            autonomyGrowthPercent={78}
            lang={lang}
            onExportReport={handleExportImpactReport}
          />

          {/* Integrity Health Radar & Audit Shield Component (NA-SOVEREIGN-EXEC-INTEGRITY-RADAR-013) */}
          <IntegrityHealthRadar
            channels={radarChannelItems}
            overallPurityPercent={100}
            lang={lang}
            onInspectChannel={handleInspectChannel}
          />

          {/* Sovereign Vault Layer (NA-SOVEREIGN-PROTOCOL-VAULT-ENFORCEMENT-018) */}
          <SovereignVault
            certificates={supporterCertificates}
            vaultRecords={supporterVaultRecords}
            isGhostMode={isGhostMode}
            lang={lang}
            onPreviewCertificate={handlePreviewCertificate}
            onDownloadCertificate={handleDownloadCertificate}
            onExportVaultArchive={handleExportVaultArchive}
          />

          {/* SPONSORED CHANNELS MANAGEMENT CARD CONTAINER */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-5 shadow-2xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base md:text-lg font-black text-white flex items-center gap-2">
                  <Radio className="w-5 h-5 text-amber-400" />
                  <span>{isAr ? 'القنوات الميدانية التي تكفلها حالياً (كبسولة الإدارة ورادار النقاء)' : 'My Sponsored Field Channels'}</span>
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">
                  {isAr
                    ? 'إدارة كفالاتك المباشرة، متابعة حالات الخمول (45 يوماً)، ورصد التنبيهات من رادار النقاء والأمان'
                    : 'Manage active non-monetary channel sponsorships and monitor integrity health indicators'}
                </p>
              </div>

              <button
                onClick={() => setAccountTab('explore')}
                className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-slate-950" />
                <span>{isAr ? 'تبني قناة جديدة' : 'Adopt New Channel'}</span>
              </button>
            </div>

            {/* Sponsored Channels List */}
            {sponsoredPublishers.length === 0 ? (
              <div className="p-8 text-center bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <Info className="w-8 h-8 text-slate-500 mx-auto" />
                <p className="text-xs text-slate-300 font-bold">
                  {isAr ? 'لم تقم بتبني أي قناة ميدانية بعد.' : 'You have not adopted any field channel yet.'}
                </p>
                <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                  {isAr
                    ? 'تصفح قائمة القنوات الميدانية المعتمدة وقم بتبني قناتين أو أكثر لتأكيد شارة التوثيق وتفعيل كافة مزايا جناح الكفيل السيادي.'
                    : 'Explore field channels and adopt 2 or more channels to unlock all sponsor suite privileges.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {sponsoredPublishers.map((pub) => (
                  <div
                    key={pub.id}
                    className="bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden group transition"
                  >
                    {/* Channel Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={pub.avatar}
                          alt={pub.name}
                          className="w-12 h-12 rounded-xl object-cover border border-amber-400/40"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                            <span>{pub.name}</span>
                            <ShieldCheck className="w-4 h-4 text-amber-400" />
                          </h4>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{pub.location}</span>
                          </p>
                        </div>
                      </div>

                      <span className="flex items-center gap-1 bg-slate-900 text-slate-300 text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-800">
                        {getPlatformIcon(pub.platform)}
                        <span>{pub.platform}</span>
                      </span>
                    </div>

                    {/* Channel Status & Integrity Radar Flags */}
                    <div className="space-y-2 pt-2 border-t border-slate-900">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">{isAr ? 'حالة النقاء:' : 'Integrity:'}</span>
                        {pub.reportsCount > 0 ? (
                          <span className="bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30 font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-rose-400" />
                            <span>{isAr ? 'تنبيه: بلاغ قيد التحقيق' : 'Flagged'}</span>
                          </span>
                        ) : (
                          <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>{isAr ? '100% نقي ومعتمد' : 'Clean'}</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">{isAr ? 'نشاط النشر:' : 'Activity:'}</span>
                        {pub.status === 'DORMANT_CHANNEL' ? (
                          <span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold flex items-center gap-1">
                            <History className="w-3 h-3 text-amber-400" />
                            <span>{isAr ? 'خاملة (تجاوزت 45 يوماً)' : 'Dormant 45+ days'}</span>
                          </span>
                        ) : (
                          <span className="text-emerald-300 font-bold">
                            {isAr ? 'نشطة ومستمرة' : 'Active'}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                      <button
                        onClick={() => {
                          setGuidanceTargetChannelId(pub.id);
                          setAccountTab('guidance');
                        }}
                        className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{isAr ? 'إرسال توجيه وددفعة' : 'Send Guidance'}</span>
                      </button>

                      <button
                        onClick={() => handleToggleSponsorship(pub.id)}
                        className="bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 text-xs font-medium px-3 py-2 rounded-xl border border-slate-800 transition cursor-pointer"
                        title={isAr ? 'إلغاء تبني هذه القناة' : 'Cancel Sponsorship'}
                      >
                        {isAr ? 'إلغاء الكفالة' : 'Cancel'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: DIRECT GUIDANCE & TRAFFIC BOOST LAUNCHPAD */}
      {accountTab === 'guidance' && (
        <div className="bg-slate-900 border border-purple-500/30 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20">
              <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
              <span>{isAr ? 'منصة إطلاق التوجيهات المباشرة والدفعة المرورية' : 'Direct Guidance & Traffic Boost Launchpad'}</span>
            </div>
            <h3 className="text-lg md:text-2xl font-black text-white">
              {isAr ? 'صياغة التوجيه أحادي الاتجاه وتفعيل الدفعة المرورية للقناة المكفولة' : 'Dispatch One-Way Guidance & Traffic Boost'}
            </h3>
            <p className="text-xs md:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {isAr
                ? 'توجيه محمي أحادي الاتجاه يصدر حصراً من الكفيل المعتمد نحو القناة التي يكفلها بدون غرف دردشة متبادلة، مع إمكانية إرفاق رابط فيديو محدد لتسليط الضوء عليه وتوجيه حركة الجمهور نحوه فوراً.'
                : 'A protected one-way direct channel guidance panel allowing sponsors to offer support and attach video URLs for instant traffic boost.'}
            </p>
          </div>

          {isGuidanceSentSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-3 animate-fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>
                {isAr
                  ? 'تم إرسال التوجيه المباشر والدفعة المرورية بنجاح إلى القناة المكفولة، وتم تسجيل الإجراء في السجل المرجعي!'
                  : 'Direct guidance and traffic boost link dispatched successfully!'}
              </span>
            </div>
          )}

          <form onSubmit={handleSendGuidance} className="space-y-5">
            {/* Target Sponsored Channel Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-purple-400" />
                <span>{isAr ? 'اختر القناة المكفولة المستهدفة بالتوجيه:' : 'Select Target Sponsored Channel:'}</span>
              </label>
              <select
                value={guidanceTargetChannelId}
                onChange={(e) => setGuidanceTargetChannelId(e.target.value)}
                className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl px-4 py-3 border border-slate-800 focus:border-purple-500 outline-none cursor-pointer font-bold"
              >
                {sponsoredPublishers.length === 0 ? (
                  <option value="">{isAr ? 'لا توجد قنوات مكفولة حالياً' : 'No active sponsored channels'}</option>
                ) : (
                  sponsoredPublishers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.platform} - {p.location})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Traffic Boost Video URL Input */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'رابط الفيديو المستهدف للدفعة المرورية (اختياري):' : 'Target Video URL for Traffic Boost (Optional):'}</span>
              </label>
              <input
                type="url"
                value={trafficBoostVideoUrl}
                onChange={(e) => setTrafficBoostVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl px-4 py-3 border border-slate-800 focus:border-amber-500 outline-none transition font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                {isAr
                  ? 'إرفاق رابط فيديو محدد يسمح بتوجيه الزوار والجمهور المتابع بصفتك كفيلاً نحو هذا المحتوى مباشرة.'
                  : 'Attaching a specific video link directs audience visits toward this content.'}
              </p>
            </div>

            {/* Guidance Text */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-purple-400" />
                <span>{isAr ? 'نص التوجيه الإنساني والتطويري أحادي الاتجاه:' : 'One-Way Guidance Statement:'}</span>
              </label>
              <textarea
                rows={4}
                value={guidanceText}
                onChange={(e) => setGuidanceText(e.target.value)}
                placeholder={
                  isAr
                    ? 'اكتب نصائحك، أو توجيهك الفني أو المعنوي لصناع محتوى هذه القناة...'
                    : 'Write technical or moral guidance for this channel creator...'
                }
                className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl p-4 border border-slate-800 focus:border-purple-500 outline-none transition leading-relaxed"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs md:text-sm px-6 py-3.5 rounded-xl shadow-xl transition flex items-center justify-center gap-2 cursor-pointer w-full sm:w-auto"
            >
              <Send className="w-4 h-4" />
              <span>{isAr ? 'إرسال التوجيه وتفعيل الدفعة المرورية' : 'Dispatch Guidance & Activate Traffic Boost'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: MY MEDIA & HUMANITARIAN STATEMENTS */}
      {accountTab === 'my_media' && (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl">
          <div className="space-y-2 border-b border-slate-800 pb-4">
            <h3 className="text-lg md:text-2xl font-black text-white flex items-center gap-2">
              <Video className="w-6 h-6 text-amber-400" />
              <span>{isAr ? 'إدارة بيانات الإشهار والفيديوهات المرفوعة للداعم' : 'My Public Media Statements & Links'}</span>
            </h3>
            <p className="text-xs text-slate-400 max-w-2xl">
              {isAr
                ? 'تعديل وتحديث بيان الإشهار الإنساني، رابط المرجعية التشاركية، والفيديو التعريف الذي يظهر للجمهور في شاشة قطاع الياسمين العامة (عند تفعيل الإشهار).'
                : 'Manage your public humanitarian statement, reference bio link, and video displayed in the Jasmine Sector wall.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Form Column */}
            <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'اسم الداعم / الشخصية العامة:' : 'Sponsor Name:'}
                </label>
                <input
                  type="text"
                  value={supporterProfile.name}
                  onChange={(e) => setSupporterProfile({ ...supporterProfile, name: e.target.value })}
                  className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'الصفة والتصنيف المعتمد:' : 'Role / Title:'}
                </label>
                <input
                  type="text"
                  value={supporterProfile.titleRole}
                  onChange={(e) => setSupporterProfile({ ...supporterProfile, titleRole: e.target.value })}
                  className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'رابط المرجعية التشاركية (Bio / Channel Link):' : 'Reference Bio Link:'}
                </label>
                <input
                  type="url"
                  value={supporterProfile.referenceLink}
                  onChange={(e) => setSupporterProfile({ ...supporterProfile, referenceLink: e.target.value })}
                  className="w-full bg-slate-900 text-white text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {isAr ? 'بيان الكفالة والإشهار الإنساني:' : 'Humanitarian Statement:'}
                </label>
                <textarea
                  rows={3}
                  value={supporterProfile.statement}
                  onChange={(e) => setSupporterProfile({ ...supporterProfile, statement: e.target.value })}
                  className="w-full bg-slate-900 text-white text-xs rounded-xl p-3 border border-slate-800 focus:border-amber-500 outline-none"
                />
              </div>
            </div>

            {/* Preview Column */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 flex flex-col justify-between space-y-4">
              <div>
                <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 inline-block mb-3">
                  {isAr ? 'معاينة بطاقة الداعم في لوحة الشرف العامة' : 'Public Card Preview'}
                </span>

                <div className="flex items-center gap-3">
                  <img
                    src={supporterProfile.avatar}
                    alt={supporterProfile.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-white">{supporterProfile.name}</h4>
                    <p className="text-xs text-amber-300">{supporterProfile.titleRole}</p>
                    <p className="text-[11px] text-slate-400 mt-1 italic line-clamp-2">"{supporterProfile.statement}"</p>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-300 space-y-1 border border-slate-800">
                <div className="font-bold text-white flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'حالة وضع الشبح حالياً:' : 'Current Ghost Mode:'}</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  {isGhostMode
                    ? (isAr ? 'مفعل (بطاقتك مخفية من العرض العام ومحفورة صامتاً للوثائق)' : 'Active (Concealed from public view)')
                    : (isAr ? 'معطل (بطاقتك معلنة وتظهر للجمهور في قطاع الياسمين)' : 'Inactive (Publicly displayed)')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: EXPLORE FIELD CHANNELS */}
      {accountTab === 'explore' && (
        <div className="space-y-6">
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
                  >
                    <History className="w-3.5 h-3.5 text-amber-400" />
                    <span>القنوات الخاملة (45+ يوم)</span>
                    <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 rounded-full text-[10px] border border-amber-500/30 font-mono">
                      {dormantCount}
                    </span>
                  </button>
                )}

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-950 text-xs text-emerald-300 rounded-xl border border-slate-800 px-3 py-2 focus:outline-none font-medium"
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
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
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
                    className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition cursor-pointer ${
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
          </div>

          {/* Publisher Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedPublishers.map((publisher) => {
              const isAdopted = supporterProfile.sponsoredPublisherIds.includes(publisher.id);

              return (
                <div
                  key={publisher.id}
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-lg hover:shadow-2xl transition group relative overflow-hidden"
                >
                  <div className="space-y-3">
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
                          </h3>
                          <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3 text-emerald-400" />
                            <span>{publisher.location}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setReportingPublisher(publisher)}
                        className="text-slate-500 hover:text-rose-400 p-1.5 rounded-lg bg-slate-950 border border-slate-800 transition"
                        title={isAr ? 'تقديم بلاغ عن القناة' : 'Report channel'}
                      >
                        <ShieldAlert className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {publisher.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => handleToggleSponsorship(publisher.id)}
                      className={`flex-1 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                        isAdopted
                          ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                      }`}
                    >
                      {isAdopted ? (
                        <>
                          <XIcon className="w-4 h-4" />
                          <span>{isAr ? 'إلغاء تبني القناة' : 'Cancel Adoption'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4" />
                          <span>{isAr ? 'تبني الكفالة غير المالية' : 'Adopt Channel'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveOutboundPublisher(publisher)}
                      className="bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold p-2.5 rounded-xl border border-slate-800 transition cursor-pointer"
                      title={isAr ? 'زيارة رابط القناة' : 'Visit link'}
                    >
                      <ExternalLink className="w-4 h-4 text-emerald-400" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: SOVEREIGN VAULT & CERTIFICATES LAYER */}
      {accountTab === 'vault' && (
        <div className="space-y-6">
          <SovereignVault
            certificates={supporterCertificates}
            vaultRecords={supporterVaultRecords}
            isGhostMode={isGhostMode}
            lang={lang}
            onPreviewCertificate={handlePreviewCertificate}
            onDownloadCertificate={handleDownloadCertificate}
            onExportVaultArchive={handleExportVaultArchive}
          />
        </div>
      )}

      {/* Embedded AI Assistant Guidance Knowledge Box */}
      <div className="bg-slate-900/80 border border-amber-500/20 rounded-2xl p-5 space-y-3 shadow-lg">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <h4 className="text-xs md:text-sm font-bold text-white">
            {isAr ? 'دليل إرشادات الكفيل والمساعد الذكي' : 'Sponsor Knowledge & Guidance Help Hub'}
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-amber-300">{isAr ? '1. حماية الخصوصية:' : '1. Privacy Protection:'}</span>
            <p className="text-[11px] text-slate-400">
              {isAr ? 'تفعيل وضع الشبح يحفي اسمك وصورتك من العرض العام مع استمرار الكفالة والتوثيق.' : 'Ghost mode conceals identity.'}
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-purple-300">{isAr ? '2. التوجيه المباشر:' : '2. Direct Guidance:'}</span>
            <p className="text-[11px] text-slate-400">
              {isAr ? 'إرسال التوجيهات يتم في اتجاه واحد حصراً لضمان وقتك وحمايتك من غرف المحادثات.' : 'One-way guidance dispatches.'}
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-emerald-300">{isAr ? '3. الدفعة المرورية:' : '3. Traffic Boost:'}</span>
            <p className="text-[11px] text-slate-400">
              {isAr ? 'يمكنك إرفاق رابط فيديو محدد للقناة لتوجيه الزيارات وتصعيد مشاهداته فوراً.' : 'Attach video URLs to boost traffic.'}
            </p>
          </div>
        </div>
      </div>

      {/* Supporter Action Timeline */}
      <SupporterTimeline
        supporterActions={supporterActions}
        publishers={publishers}
        lang={lang}
        onRevisitChannel={(action) => {
          const pub = publishers.find((p) => p.id === action.publisherId);
          if (pub) {
            setActiveOutboundPublisher(pub);
          } else {
            window.open((action as any).publisherUrl || (action as any).referenceUrl || '#', '_blank', 'noopener,noreferrer');
          }
        }}
      />

      {/* Outbound Notice Modal */}
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
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>{t.confirmOutbound}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setActiveOutboundPublisher(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-4 py-2.5 rounded-xl transition cursor-pointer"
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

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { apiAdapter } from '../services/apiAdapter';
import {
  Publisher,
  SupporterAction,
  Language,
  FairEngineWeights,
  PlatformType,
} from '../types';
import { useFairEngine } from './useFairEngine';
import { useSupporterFilters } from './useSupporterFilters';
import { AccountTabType } from '../components/SupporterPortal/SupporterTabs';
import { IntegrityChannelItem } from '../components/features/IntegrityHealthRadar';
import { SovereignCertificate } from '../components/features/SovereignVault';
import {
  getInitialSupporterProfile,
  getRadarChannelItems,
  getSupporterCertificates,
  getSupporterVaultRecords,
  SupporterProfileData,
} from '../components/SupporterPortal/supporterMockData';
import {
  downloadTextFile,
  generateImpactReportContent,
  generateCertificateContent,
  generateVaultArchiveContent,
} from '../services/vaultExportService';
import { INITIAL_GUIDANCE_NOTES, OneWayGuidanceNote } from '../services/jasmineService';
import {
  Youtube,
  Send,
  X as XIcon,
  Facebook,
  Instagram,
  Video,
  Globe,
} from 'lucide-react';

export interface UseSupporterPortalParams {
  supporterActions: SupporterAction[];
  publishers: Publisher[];
  setPublishers: React.Dispatch<React.SetStateAction<Publisher[]>>;
  weights: FairEngineWeights;
  lang: Language;
  onRecordAction: (action: SupporterAction) => void;
  onAddReport?: (report: any) => void;
}

export function useSupporterPortal({
  supporterActions,
  publishers,
  setPublishers,
  weights,
  lang,
  onRecordAction,
  onAddReport,
}: UseSupporterPortalParams) {
  const isAr = lang === 'ar';

  // Supporter Account / Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accountTab, setAccountTab] = useState<AccountTabType>('overview');
  const [isConceptGuideOpen, setIsConceptGuideOpen] = useState(false);

  // Listen for custom tab changes from contextual mobile navigation bar (Protocol 43)
  useEffect(() => {
    const handleTabChange = (e: Event) => {
      const customEvent = e as CustomEvent<AccountTabType>;
      if (customEvent.detail) {
        setAccountTab(customEvent.detail);
      }
    };
    window.addEventListener('noor_supporter_tab_change', handleTabChange);
    return () => {
      window.removeEventListener('noor_supporter_tab_change', handleTabChange);
    };
  }, []);

  // Broadcast current active tab to contextual mobile navigation bar
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('noor_supporter_active_tab', { detail: accountTab }));
  }, [accountTab]);

  // Safe Hydration for Next.js SSR
  const [isGhostMode, setIsGhostMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return localStorage.getItem('noor_supporter_ghost_mode') === 'true';
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
      return false;
    }
  });

  // Supporter Personal Profile State
  const [supporterProfile, setSupporterProfile] = useState<SupporterProfileData>(() => {
    let initial = getInitialSupporterProfile(isAr);
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('noor_supporter_profile');
        if (saved) {
          const parsed = JSON.parse(saved);
          initial = { ...initial, ...parsed };
        }
      } catch (err) {
        console.error("Error in Noor Al-Amani Module:", err);
      }
    }
    // Normalize IDs from pub-1 to pub-001 format
    const normalized = (initial.sponsoredPublisherIds || []).map((id) =>
      id.replace(/^pub-(\d)$/, 'pub-00$1')
    );
    return { ...initial, sponsoredPublisherIds: Array.from(new Set(normalized)) };
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('noor_supporter_profile', JSON.stringify(supporterProfile));
      } catch (err) {
        console.error("Error in Noor Al-Amani Module:", err);
      }
    }
  }, [supporterProfile]);

  // Target Channel ID selected for guidance when switching tabs
  const [guidanceTargetChannelId, setGuidanceTargetChannelId] = useState<string>('pub-001');

  // Jasmine Sector Sponsor Onboarding & Guidance States
  const [isJasmineWizardOpen, setIsJasmineWizardOpen] = useState(false);
  const [isJasmineGuidanceOpen, setIsJasmineGuidanceOpen] = useState(false);
  const [jasmineGuidanceNotes, setJasmineGuidanceNotes] = useState<OneWayGuidanceNote[]>(INITIAL_GUIDANCE_NOTES);

  // Active Outbound, Reporting, Integrity Audit Inspection, & Vault Inspection State
  const [activeOutboundPublisher, setActiveOutboundPublisher] = useState<Publisher | null>(null);
  const [reportingPublisher, setReportingPublisher] = useState<Publisher | null>(null);
  const [inspectedChannel, setInspectedChannel] = useState<IntegrityChannelItem | null>(null);
  const [inspectedCertificate, setInspectedCertificate] = useState<SovereignCertificate | null>(null);
  const [vaultNoticeModal, setVaultNoticeModal] = useState<{
    title: string;
    message: string;
    sealHash: string;
    type?: 'archive' | 'report' | 'download';
  } | null>(null);

  const { calculateScore, calculateTrust } = useFairEngine(publishers, weights);

  // Decoupled Filter & Search Hook
  const filterState = useSupporterFilters({
    publishers,
    calculateScore,
    calculateTrust,
  });

  // Handle Ghost Mode Toggle
  const handleToggleGhostMode = useCallback(() => {
    setIsGhostMode((prev) => {
      const nextVal = !prev;
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('noor_supporter_ghost_mode', String(nextVal));
        } catch (e) {
          console.error("Error in Noor Al-Amani Module:", e);
        }
      }
      return nextVal;
    });
  }, []);

  // Toggle Login state
  const handleToggleLogin = useCallback(() => {
    setIsLoggedIn((prev) => !prev);
  }, []);

  const setSponsorMode = useCallback(() => {
    setIsLoggedIn(true);
  }, []);

  const setSupporterMode = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  // Sponsored Publishers List
  const sponsoredPublishers = useMemo(() => {
    const set = new Set(supporterProfile.sponsoredPublisherIds);
    return publishers.filter(
      (p) => set.has(p.id) || set.has(p.id.replace(/^pub-00/, 'pub-'))
    );
  }, [publishers, supporterProfile.sponsoredPublisherIds]);

  // Purely presentational radar channels for IntegrityHealthRadar
  const radarChannelItems = useMemo(
    () => getRadarChannelItems(sponsoredPublishers),
    [sponsoredPublishers]
  );

  // Dynamically calculated overall purity score
  const overallPurityPercent = useMemo(() => {
    if (!radarChannelItems || radarChannelItems.length === 0) return 100;
    const total = radarChannelItems.reduce((acc, item) => acc + item.purityScore, 0);
    return Math.round(total / radarChannelItems.length);
  }, [radarChannelItems]);

  // Pure Presentational Data for Sovereign Vault Layer
  const supporterCertificates = useMemo(
    () => getSupporterCertificates(isAr),
    [isAr]
  );

  const supporterVaultRecords = useMemo(
    () => getSupporterVaultRecords(isAr, isGhostMode),
    [isAr, isGhostMode]
  );

  // Export & Action Handlers
  const handleExportImpactReport = useCallback(() => {
    const exporterIdentity = isGhostMode
      ? (isAr ? 'كفيل سيادي خفي (وضع الشبح الصامت)' : 'Anonymous Sovereign Supporter (Silent Ghost Mode)')
      : supporterProfile.name;

    const timestamp = new Date().toISOString();
    const checksumHash = `NA-SEAL-${Math.random().toString(36).substring(2, 10).toUpperCase()}-2026`;
    const sponsoredCount = supporterProfile.sponsoredPublisherIds.length;

    const reportContent = generateImpactReportContent(
      isAr,
      isGhostMode,
      exporterIdentity,
      checksumHash,
      sponsoredCount,
      timestamp
    );

    downloadTextFile(`noor-impact-report-${checksumHash}.txt`, reportContent);

    setVaultNoticeModal({
      title: isAr ? 'تم تصدير تقرير الأثر السيادي' : 'Sovereign Impact Report Exported',
      message: isAr
        ? `تم توليد وتوثيق الختم المائي الرقمي بنجاح.\nهوية المستخرج: ${exporterIdentity}`
        : `Digital watermark successfully generated and verified.\nExporter: ${exporterIdentity}`,
      sealHash: checksumHash,
      type: 'report',
    });
  }, [isAr, isGhostMode, supporterProfile.name, supporterProfile.sponsoredPublisherIds.length]);

  const handleInspectChannel = useCallback((id: string) => {
    const target = radarChannelItems.find((c) => c.id === id);
    if (target) {
      setInspectedChannel(target);
    } else {
      setInspectedChannel({
        id,
        name: isAr ? `قناة إغاثية مكفولة (${id})` : `Sponsored Channel (${id})`,
        status: 'clean',
        purityScore: 100,
        lastAuditDate: new Date().toISOString().split('T')[0],
        violationsCount: 0,
      });
    }
  }, [radarChannelItems, isAr]);

  const handlePreviewCertificate = useCallback((id: string) => {
    const cert = supporterCertificates.find((c) => c.id === id);
    if (cert) {
      setInspectedCertificate(cert);
    } else {
      setInspectedCertificate({
        id,
        certificateNo: `NA-CERT-2026-${id.toUpperCase().slice(0, 6)}`,
        title: isAr ? `شهادة التقدير الرقمية المائية (${id})` : `Digital Watermarked Certificate (${id})`,
        issueDate: new Date().toISOString().split('T')[0],
        issuer: isAr ? 'منصة نور الأماني الرقمية السيادية' : 'Noor Al-Amani Sovereign Digital Platform',
        status: 'verified',
        category: isAr ? 'كفالة إنسانية سيادية' : 'Sovereign Humanitarian Endorsement',
        hashSignature: `SHA256-${Math.random().toString(36).substring(2, 14).toUpperCase()}`,
        watermarkSeal: `NA-CERT-2026-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      });
    }
  }, [supporterCertificates, isAr]);

  const handleDownloadCertificate = useCallback((id: string) => {
    const cert = supporterCertificates.find((c) => c.id === id);
    const seal = cert?.watermarkSeal || `NA-CERT-2026-${id.toUpperCase().slice(0, 6)}`;
    const title = cert?.title || (isAr ? 'شهادة التقدير السيادية' : 'Sovereign Certificate of Honor');

    const fileText = generateCertificateContent(cert, seal, title);
    downloadTextFile(`certificate-${id}-${seal}.txt`, fileText);

    setVaultNoticeModal({
      title: isAr ? 'تم تحميل الشهادة الرقمية المائية' : 'Digital Certificate Downloaded',
      message: isAr
        ? `تم تنزيل وثيقة الشهادة (${title}) وتوثيق الرقم الهيدروغرافي المشفر بنجاح.`
        : `Certificate document (${title}) downloaded and verified with encrypted digital watermark seal.`,
      sealHash: seal,
      type: 'download',
    });
  }, [supporterCertificates, isAr]);

  const handleExportVaultArchive = useCallback(() => {
    const archiveHash = `NA-ARCHIVE-${Math.random().toString(36).substring(2, 10).toUpperCase()}-2026`;
    const fileText = generateVaultArchiveContent(
      supporterCertificates,
      supporterVaultRecords,
      isGhostMode,
      archiveHash
    );

    downloadTextFile(`sovereign-vault-archive-${archiveHash}.txt`, fileText);

    setVaultNoticeModal({
      title: isAr ? 'تم تصدير أرشيف الخزانة السيادية' : 'Sovereign Vault Archive Exported',
      message: isAr
        ? 'تم تصدير وحفظ سجل الأرشيف الرقمي المائي للخزانة بنجاح مع الختم المذهب.'
        : 'Watermarked digital archive of the Sovereign Vault successfully exported with golden seal.',
      sealHash: archiveHash,
      type: 'archive',
    });
  }, [supporterCertificates, supporterVaultRecords, isGhostMode, isAr]);

  const getPlatformIcon = useCallback((platform: PlatformType) => {
    switch (platform) {
      case 'YouTube':
        return <Youtube className="w-4 h-4 text-red-500 shrink-0" />;
      case 'Telegram':
        return <Send className="w-4 h-4 text-sky-400 shrink-0" />;
      case 'X':
        return <XIcon className="w-4 h-4 text-slate-200 shrink-0" />;
      case 'Facebook':
        return <Facebook className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'Instagram':
        return <Instagram className="w-4 h-4 text-pink-500 shrink-0" />;
      case 'TikTok':
        return <Video className="w-4 h-4 text-teal-400 shrink-0" />;
      default:
        return <Globe className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
  }, []);

  const handleToggleSponsorship = useCallback(async (publisherId: string) => {
    const targetPub = publishers.find((p) => p.id === publisherId);
    let isNowAdopted = false;

    setSupporterProfile((prev) => {
      const exists = prev.sponsoredPublisherIds.includes(publisherId);
      isNowAdopted = !exists;
      const nextIds = exists
        ? prev.sponsoredPublisherIds.filter((id) => id !== publisherId)
        : Array.from(new Set([...prev.sponsoredPublisherIds, publisherId]));

      const updated = { ...prev, sponsoredPublisherIds: nextIds };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('noor_supporter_profile', JSON.stringify(updated));
        } catch (err) {
          console.error("Error in Noor Al-Amani Module:", err);
        }
      }
      return updated;
    });

    if (targetPub && isNowAdopted) {
      const sealHash = `NA-SPONSOR-2026-${publisherId.toUpperCase().slice(0, 6)}`;
      setTimeout(() => {
        setVaultNoticeModal({
          title: isAr ? 'بطاقة التوثيق التأكيدية للكفالة السيادية' : 'Sovereign Sponsorship Confirmation Card',
          message: isAr
            ? `تم تأكيد كفالة القناة الميدانية (${targetPub.name}) بنجاح.\nانضمت القناة رسمياً لكبسولة كفالاتك غير المالية وتأكيد شارة النقاء الرقمي.`
            : `Channel (${targetPub.name}) successfully adopted under non-monetary sovereign sponsorship.`,
          sealHash,
          type: 'report',
        });
      }, 20);
    }
  }, [publishers, isAr]);

  const handleConfirmOutbound = useCallback(() => {
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
      console.error("Error in Noor Al-Amani Module:", err);
    });

    window.open(activeOutboundPublisher.externalUrl, '_blank', 'noopener,noreferrer');
    setActiveOutboundPublisher(null);
  }, [activeOutboundPublisher, onRecordAction, setPublishers]);

  const handleReportSubmit = useCallback(
    (publisherId: string, publisherName: string, reason: string, evidence: string) => {
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
        console.error("Error in Noor Al-Amani Module:", err);
      });
    },
    [onAddReport, setPublishers]
  );

  return {
    isAr,
    isLoggedIn,
    handleToggleLogin,
    setSponsorMode,
    setSupporterMode,
    accountTab,
    setAccountTab,
    isConceptGuideOpen,
    setIsConceptGuideOpen,
    isGhostMode,
    handleToggleGhostMode,
    supporterProfile,
    setSupporterProfile,
    guidanceTargetChannelId,
    setGuidanceTargetChannelId,
    isJasmineWizardOpen,
    setIsJasmineWizardOpen,
    isJasmineGuidanceOpen,
    setIsJasmineGuidanceOpen,
    jasmineGuidanceNotes,
    setJasmineGuidanceNotes,
    activeOutboundPublisher,
    setActiveOutboundPublisher,
    reportingPublisher,
    setReportingPublisher,
    inspectedChannel,
    setInspectedChannel,
    inspectedCertificate,
    setInspectedCertificate,
    vaultNoticeModal,
    setVaultNoticeModal,
    sponsoredPublishers,
    radarChannelItems,
    overallPurityPercent,
    supporterCertificates,
    supporterVaultRecords,
    filterState,
    handleExportImpactReport,
    handleInspectChannel,
    handlePreviewCertificate,
    handleDownloadCertificate,
    handleExportVaultArchive,
    getPlatformIcon,
    handleToggleSponsorship,
    handleConfirmOutbound,
    handleReportSubmit,
  };
}

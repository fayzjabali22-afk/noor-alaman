import React from 'react';
import { SupporterTimeline } from './SupporterTimeline';
import { SovereignVault } from './features/SovereignVault';
import {
  Publisher,
  SupporterAction,
  Language,
  FairEngineWeights,
} from '../types';
import { translations } from '../lib/i18n';
import { useSupporterPortal } from '../hooks/useSupporterPortal';
import { useSupporterActions } from '../hooks/useSupporterActions';
import { ReportModal } from './ReportModal';
import { TrustBadge } from './TrustBadge';
import { SupporterSkeleton } from './SupporterPortal/SupporterSkeleton';
import { SupporterHeader } from './SupporterPortal/SupporterHeader';
import { SupporterTabs } from './SupporterPortal/SupporterTabs';
import { SupporterConceptsGuideModal } from './SupporterPortal/SupporterConceptsGuide';
import { PortalEntryGuide } from './SupporterPortal/PortalEntryGuide';
import { SupporterRegistrationEntry } from './SupporterPortal/SupporterRegistrationEntry';
import {
  X as XIcon,
  Info,
  ShieldAlert,
  Sparkles,
  MapPin,
  CheckCircle2,
  ExternalLink,
  History,
  HelpCircle,
  Search,
  ShieldCheck,
  Award,
  Download,
  FileCheck,
  Terminal,
  Zap,
  Lock,
  Unlock,
  ArrowRight,
  ArrowLeft,
  Radio,
  Crown,
  MessageSquare,
  ChevronDown,
  Sliders,
} from 'lucide-react';
import { SupporterOverviewTab } from './SupporterPortal/SupporterOverviewTab';
import { SupporterGuidanceTab } from './SupporterPortal/SupporterGuidanceTab';
import { SupporterMediaTab } from './SupporterPortal/SupporterMediaTab';
import type { JasmineOnboardingData } from './JasmineOnboardingWizard';
import { JasmineOneWayGuidanceModal } from './JasmineOneWayGuidanceModal';
import { OneWayGuidanceNote } from '../services/jasmineService';

const JasmineOnboardingWizard = React.lazy(() =>
  import('./JasmineOnboardingWizard').then((module) => ({
    default: module.JasmineOnboardingWizard,
  }))
);

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
  const {
    recordActionWithCooldown
  } = useSupporterActions(onRecordAction);


  const {
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
  } = useSupporterPortal({
    supporterActions,
    publishers,
    setPublishers,
    weights,
    lang,
    onRecordAction,
    onAddReport,
  });

  const {
    searchQuery,
    setSearchQuery,
    selectedRegion,
    setSelectedRegion,
    sortBy,
    setSortBy,
    showDormantChannels,
    setShowDormantChannels,
    dormantCount,
    processedPublishers,
  } = filterState;

  const [isFilterAccordionOpen, setIsFilterAccordionOpen] = React.useState(true);
  const [activeSubTab, setActiveSubTab] = React.useState<'SEARCH_SORT' | 'REGION' | 'CATEGORIES' | 'STATUS'>('SEARCH_SORT');

  if (isLoading) {
    return <SupporterSkeleton isAr={isAr} />;
  }

  /*
    =============================================================================
    [أمر حراسة المصادقة المطلق - STRICT AUTH GUARD PATTERN]
    (الأمر السيادي: NA-SOV-2026-0808-005)
    حظر وستر جميع بيانات الداعم والكفيل والمعاينات الحساسة تماماً عند عدم المصادقة،
    وإظهار نموذج وبوابة المصادقة والتسجيل فقط للزوار حتى إتمام تسجيل الدخول.
    =============================================================================
  */
  if (!isLoggedIn) {
    return (
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8 space-y-6 animate-fade-in text-right pb-safe pt-safe" dir={isAr ? 'rtl' : 'ltr'}>
        {/* TEMPORARY DEVELOPMENT INSPECTION CHANNEL BANNER */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-slate-900 to-cyan-950/80 border-2 border-cyan-500/50 shadow-xl space-y-2 text-right">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 shrink-0">
                <Terminal className="w-5 h-5 animate-pulse text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-xs sm:text-sm font-black text-cyan-300">
                    {isAr ? 'قناة التطوير والمعاينة المباشرة (مؤقتة)' : 'Temporary Development Inspection Channel'}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
                    DEV_CHANNEL_OPEN
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                  {isAr
                    ? 'تم فتح هذه القناة المؤقتة لمعاينة وتطوير قمرة الداعم وجميع أجزاء الشاشة بحرية. اضغط الزر للتنقل الفوري وتفقد جميع الأبواب والأوردين، وسيتم حذف هذه القناة فور الانتهاء من التطوير.'
                    : 'Temporary channel opened to freely inspect and develop all Supporter Portal cockpits and tabs.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={setSponsorMode}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs transition flex items-center justify-center gap-2 cursor-pointer shadow-lg shrink-0 min-h-[44px]"
            >
              <Zap className="w-4 h-4 text-slate-950" />
              <span>{isAr ? 'دخول مباشر لقمرة الداعم للتطوير' : 'Bypass into Supporter Cockpit'}</span>
            </button>
          </div>
        </div>

        {/* DEDICATED AUTHENTICATION & REGISTRATION GATEWAY */}
        <SupporterRegistrationEntry
          isAr={isAr}
          isLoggedIn={false}
          supporterProfile={supporterProfile}
          onLoginSuccess={setSponsorMode}
          onLogout={setSupporterMode}
          onUpdateProfile={(updated) => setSupporterProfile((prev) => ({ ...prev, ...updated }))}
          onOpenConceptGuide={() => setIsConceptGuideOpen(true)}
        />

        {/* Portal Entry Guide Modal */}
        <PortalEntryGuide
          isAr={isAr}
          isOpen={isConceptGuideOpen}
          onClose={() => setIsConceptGuideOpen(false)}
          onSelectSponsorMode={() => {
            setSponsorMode();
            setIsConceptGuideOpen(false);
          }}
          onSelectSupporterMode={() => {
            setSupporterMode();
            setIsConceptGuideOpen(false);
          }}
          currentMode="GUEST_SUPPORTER"
        />

        {/* Sovereign Concepts Educational Modal */}
        <SupporterConceptsGuideModal
          isAr={isAr}
          isOpen={isConceptGuideOpen}
          onClose={() => setIsConceptGuideOpen(false)}
          currentStatus="GUEST_SUPPORTER"
          onToggleStatus={handleToggleLogin}
        />
      </div>
    );
  }

  return (
    <div id="supporter-portal-container" className="w-full max-w-7xl mx-auto px-0 sm:px-3 md:px-6 py-1.5 md:py-6 space-y-3 md:space-y-8 animate-fade-in pb-safe pt-safe overflow-x-hidden">
      {/* TEMPORARY DEVELOPMENT INSPECTION CHANNEL ACTIVE BANNER */}
      <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/40 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-right">
        <div className="flex items-center gap-2 text-cyan-300 font-mono">
          <Terminal className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            {isAr
              ? '[قناة التطوير نشطة]: أنت تبحر الآن داخل قمرة الداعم الكاملة للمعاينة والتطوير'
              : '[DEV CHANNEL ACTIVE]: Inspecting full Supporter Cockpit'}
          </span>
        </div>
        <button
          type="button"
          onClick={setSupporterMode}
          className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-[11px] font-bold transition flex items-center gap-1.5 cursor-pointer min-h-[36px]"
        >
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAr ? 'اختبار حارس بوابة التسجيل (Auth Guard)' : 'Test Auth Guard Gate'}</span>
        </button>
      </div>

      {/* 1. SUPPORTER HEADER BAR WITH GHOST MODE TOGGLE */}
      <div className="space-y-4">
        <SupporterHeader
          supporterProfile={supporterProfile}
          sponsoredPublishers={sponsoredPublishers}
          isGhostMode={isGhostMode}
          isLoggedIn={isLoggedIn}
          isAr={isAr}
          onToggleGhostMode={handleToggleGhostMode}
          onToggleLogin={handleToggleLogin}
          onLogout={setSupporterMode}
          onOpenConceptGuide={() => setIsConceptGuideOpen(true)}
        />

        {/* 2. NAVIGATION TABS */}
        <SupporterTabs
          accountTab={accountTab}
          onSelectTab={setAccountTab}
          isAr={isAr}
        />
      </div>

      {/* TAB 1: OVERVIEW & SPONSORED CHANNELS */}
      {accountTab === 'overview' && (
        <SupporterOverviewTab
          isAr={isAr}
          lang={lang}
          isLoggedIn={isLoggedIn}
          isGhostMode={isGhostMode}
          supporterProfile={supporterProfile}
          sponsoredPublishers={sponsoredPublishers}
          radarChannelItems={radarChannelItems}
          overallPurityPercent={overallPurityPercent}
          supporterCertificates={supporterCertificates}
          supporterVaultRecords={supporterVaultRecords}
          onOpenJasmineWizard={() => setIsJasmineWizardOpen(true)}
          onOpenJasmineGuidance={() => setIsJasmineGuidanceOpen(true)}
          onOpenConceptGuide={() => setIsConceptGuideOpen(true)}
          onToggleLogin={handleToggleLogin}
          onSetAccountTab={setAccountTab}
          onExportImpactReport={handleExportImpactReport}
          onInspectChannel={handleInspectChannel}
          onPreviewCertificate={handlePreviewCertificate}
          onDownloadCertificate={handleDownloadCertificate}
          onExportVaultArchive={handleExportVaultArchive}
          onSendGuidanceClick={(pubId) => {
            setGuidanceTargetChannelId(pubId);
            setAccountTab('guidance');
          }}
          onCancelSponsorshipClick={handleToggleSponsorship}
          getPlatformIcon={getPlatformIcon}
        />
      )}

      {/* TAB 2: DIRECT GUIDANCE & TRAFFIC BOOST LAUNCHPAD */}
      {accountTab === 'guidance' && (
        isLoggedIn ? (
          <SupporterGuidanceTab
            isAr={isAr}
            sponsoredPublishers={sponsoredPublishers}
            initialTargetChannelId={guidanceTargetChannelId}
            onRecordAction={recordActionWithCooldown}
            onShowNotice={setVaultNoticeModal}
          />
        ) : (
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 text-center space-y-3">
            <h4 className="text-sm font-black text-amber-300">
              {isAr ? 'قمرة التوجيه الإنساني أحادي الاتجاه متوقفة' : 'One-Way Guidance Cockpit Locked'}
            </h4>
            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              {isAr
                ? 'تتطلب كتابة وإرسال التوجيهات الإنسانية إلى القنوات وجود حساب كفيل نشط. يرجى استخدام بوابة فتح/دخول الحساب أعلاه للمتابعة.'
                : 'Dispatching guidance notes requires an active supporter account. Please sign in or register above.'}
            </p>
          </div>
        )
      )}

      {/* TAB 3: MY MEDIA & HUMANITARIAN STATEMENTS / ONBOARDING DATA SCHEMA */}
      {accountTab === 'my_media' && (
        isLoggedIn ? (
          <SupporterMediaTab
            isAr={isAr}
            supporterProfile={supporterProfile}
            setSupporterProfile={setSupporterProfile}
            onRecordAction={recordActionWithCooldown}
            setVaultNoticeModal={setVaultNoticeModal}
          />
        ) : (
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl p-6 text-center space-y-3">
            <h4 className="text-sm font-black text-amber-300">
              {isAr ? 'إدارة البيانات والمستندات الإنسانية مقفلة' : 'Humanitarian Media Management Locked'}
            </h4>
            <p className="text-xs text-slate-300 max-w-lg mx-auto">
              {isAr
                ? 'إدارة بيانات الكفيل وتحديث السجل الإنساني تتطلب المصادقة أولاً. يرجى فتح أو تسجيل الدخول إلى حسابك من النشرة أعلاه.'
                : 'Managing supporter profile data requires active authentication. Please sign in or register above.'}
            </p>
          </div>
        )
      )}

      {/* TAB 4: EXPLORE FIELD CHANNELS */}
      {accountTab === 'explore' && (
        <div className="space-y-6">
          {/* Enhanced Accordion Filter & Search Panel */}
          <div className="bg-slate-900 border border-slate-800 hover:border-amber-500/30 rounded-2xl shadow-xl transition-all duration-300 overflow-hidden">
            {/* Accordion Header Bar */}
            <div
              id="supporter-filter-accordion-header"
              role="button"
              tabIndex={0}
              aria-expanded={isFilterAccordionOpen}
              aria-controls="supporter-filter-accordion-panel"
              onClick={() => setIsFilterAccordionOpen((prev) => !prev)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  setIsFilterAccordionOpen((prev) => !prev);
                }
              }}
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-slate-900/90 hover:bg-slate-850/80 cursor-pointer select-none transition min-h-[52px]"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
                  <Sliders className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                    <span>{isAr ? 'لوحة الفلترة والفرز الأكورديون' : 'Accordion Filter & Search Panel'}</span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono px-2 py-0.5 rounded-full font-bold">
                      {processedPublishers.length} {isAr ? 'قناة' : 'Channels'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {isAr
                      ? 'تصفية القنوات حسب البحث المباشر، الأقاليم الميدانية، الفئات، والتصنيف السيادي'
                      : 'Filter field channels by live search, regions, domain categories, and sovereign rank'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  aria-expanded={isFilterAccordionOpen}
                  aria-controls="supporter-filter-accordion-panel"
                  onClick={() => setIsFilterAccordionOpen((prev) => !prev)}
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 hover:text-amber-300 hover:border-amber-500/40 transition flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation active:scale-95 shrink-0"
                  title={isFilterAccordionOpen ? (isAr ? 'طَي الفلاتر' : 'Collapse Filters') : (isAr ? 'توسيع الفلاتر' : 'Expand Filters')}
                >
                  <ChevronDown className={`w-5 h-5 text-amber-400 transition-transform duration-300 ${isFilterAccordionOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </div>

            {/* Accordion Body with Smooth CSS Grid Height & Opacity Transition */}
            <div
              id="supporter-filter-accordion-panel"
              role="region"
              aria-labelledby="supporter-filter-accordion-header"
              className={`grid transition-all duration-300 ease-in-out border-slate-800/80 bg-slate-950/60 ${
                isFilterAccordionOpen
                  ? 'grid-rows-[1fr] opacity-100 p-4 pt-3 border-t'
                  : 'grid-rows-[0fr] opacity-0 p-0 overflow-hidden border-t-0'
              }`}
            >
              <div className="overflow-hidden space-y-4">
                {/* Filter Sub-Tabs Header (activeSubTab) */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs border-b border-slate-800/80 scroll-smooth [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('SEARCH_SORT')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer min-h-[40px] flex items-center gap-1.5 active:scale-95 ${
                      activeSubTab === 'SEARCH_SORT'
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>{isAr ? '1. البحث والترتيب' : '1. Search & Sort'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSubTab('REGION')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer min-h-[40px] flex items-center gap-1.5 active:scale-95 ${
                      activeSubTab === 'REGION'
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{isAr ? '2. الأقاليم والمناطق' : '2. Regions'}</span>
                    {selectedRegion !== 'ALL' && (
                      <span className="w-2 h-2 rounded-full bg-slate-950 animate-pulse"></span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSubTab('CATEGORIES')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer min-h-[40px] flex items-center gap-1.5 active:scale-95 ${
                      activeSubTab === 'CATEGORIES'
                        ? 'bg-cyan-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <Radio className="w-3.5 h-3.5" />
                    <span>{isAr ? '3. التصنيف المحتوي' : '3. Content Types'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSubTab('STATUS')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition cursor-pointer min-h-[40px] flex items-center gap-1.5 active:scale-95 ${
                      activeSubTab === 'STATUS'
                        ? 'bg-purple-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>{isAr ? '4. القنوات الخاملة والمرشحة' : '4. Dormant & Candidate'}</span>
                    {dormantCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 rounded-full text-[10px] border border-amber-500/30 font-mono">
                        {dormantCount}
                      </span>
                    )}
                  </button>
                </div>

                {/* Conditional Sub-Tab Panels to prevent DOM bloat (ربط عرض الأكورديون بحالة activeSubTab لضمان عرض محتوى واحد فقط ومنع تضخم الـ DOM) */}
                {activeSubTab === 'SEARCH_SORT' && (
                  <div className="flex flex-col md:flex-row gap-3 items-center justify-between pt-1 animate-fade-in">
                    <div className="relative w-full md:w-96">
                      <Search className="absolute right-3.5 top-3.5 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={t.searchPlaceholder}
                        className="w-full bg-slate-950 border border-emerald-500/20 hover:border-emerald-500/40 focus:border-amber-500 rounded-xl pr-10 pl-4 py-2.5 text-base md:text-xs text-white placeholder-slate-500 focus:outline-none transition min-h-[44px] touch-manipulation shadow-inner"
                      />
                    </div>

                    <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                      <label className="text-xs text-slate-400 font-bold hidden sm:inline">{isAr ? 'نظام الترتيب:' : 'Sorting Mode:'}</label>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="bg-slate-950 text-base md:text-xs text-emerald-300 rounded-xl border border-emerald-500/20 hover:border-emerald-500/40 px-3 py-2.5 focus:outline-none font-medium min-h-[44px] touch-manipulation cursor-pointer shadow-inner"
                      >
                        <option value="FAIR">{t.fairEngineSorting}</option>
                        <option value="VISITS_ASC">{t.visitCountSorting}</option>
                        <option value="VERIFICATION">{t.verificationSorting}</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeSubTab === 'REGION' && (
                  <div className="space-y-2 pt-1 animate-fade-in">
                    <div className="text-[11px] text-slate-400 font-bold flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.filterByRegion}</span>
                    </div>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scroll-smooth snap-x snap-mandatory [-webkit-overflow-scrolling:touch] [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
                      <button
                        type="button"
                        onClick={() => setSelectedRegion('ALL')}
                        className={`snap-start px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer touch-manipulation min-h-[42px] active:scale-95 ${
                          selectedRegion === 'ALL'
                            ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                            : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                        }`}
                      >
                        {t.allRegions}
                      </button>
                      {['غزة', 'شمال القطاع', 'خان يونس', 'دير البلح', 'رفح', 'القدس', 'الضفة الغربية'].map((reg) => (
                        <button
                          key={reg}
                          type="button"
                          onClick={() => setSelectedRegion(reg)}
                          className={`snap-start px-3.5 py-2 rounded-xl whitespace-nowrap transition cursor-pointer touch-manipulation min-h-[42px] active:scale-95 ${
                            selectedRegion === reg
                              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
                              : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                          }`}
                        >
                          {reg}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {activeSubTab === 'CATEGORIES' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1 animate-fade-in text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/20 text-slate-300 space-y-1">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block">{isAr ? 'مجال التغطية والإغاثة' : 'Humanitarian Domain'}</span>
                      <p className="text-[11px] text-slate-400">{isAr ? 'يتم تصنيف القنوات تلقائياً بحسب محرك العدالة السيادي.' : 'Channels are automatically ranked by the Fair Engine.'}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-cyan-500/20 text-slate-300 space-y-1">
                      <span className="text-[10px] text-cyan-400 font-bold uppercase block">{isAr ? 'مستوى التوثيق' : 'Verification Status'}</span>
                      <p className="text-[11px] text-slate-400">{isAr ? 'توثيق فضي، ذهبي، وبلاتيني معتمد بحسب معايير الأمن.' : 'Silver, Gold, and Platinum verified badges.'}</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/20 text-slate-300 space-y-1">
                      <span className="text-[10px] text-amber-400 font-bold uppercase block">{isAr ? 'أسبقية الدعم' : 'Support Priority'}</span>
                      <p className="text-[11px] text-slate-400">{isAr ? 'القنوات ذات الزيارات المنخفضة تأخذ أولوية الظهور.' : 'Low-visibility channels get top priority.'}</p>
                    </div>
                  </div>
                )}

                {activeSubTab === 'STATUS' && (
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-1 animate-fade-in bg-slate-950 p-3.5 rounded-xl border border-slate-800">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">
                          {isAr ? 'عرض القنوات الميدانية الخاملة (45+ يوماً بدون تحديث)' : 'Display Dormant Channels (45+ days silent)'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {isAr ? 'القنوات الخاملة تتطلب كفالة وتوجيهاً عاجلاً لاستعادة زخم التغطية.' : 'Dormant channels require urgent sponsorship.'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowDormantChannels((prev) => !prev)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-bold transition border flex items-center gap-2 min-h-[44px] touch-manipulation active:scale-95 shrink-0 ${
                        showDormantChannels
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:text-amber-300'
                      }`}
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>{showDormantChannels ? (isAr ? 'إخفاء الخاملة' : 'Hide Dormant') : (isAr ? 'تفعيل الخاملة' : 'Show Dormant')}</span>
                      <span className="px-2 py-0.5 bg-slate-950/80 text-amber-300 rounded-full text-[10px] border border-amber-500/30 font-mono">
                        {dormantCount}
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Publisher Cards Grid (Dynamic Bento/Grid System: 1 Mobile, 2 Tablet, 3 Desktop) */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 animate-fade-in transition-all duration-300">
            {processedPublishers.map((publisher) => {
              const isAdopted = supporterProfile.sponsoredPublisherIds.includes(publisher.id);

              return (
                <div
                  key={publisher.id}
                  className="bg-slate-900/80 backdrop-blur-sm border border-slate-800/80 hover:border-emerald-500/50 rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl hover:shadow-2xl transition-all duration-300 group relative overflow-hidden"
                >
                  {/* Subtle Emerald & Gold Gradient Background Accent */}
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-emerald-500/10 via-amber-500/5 to-transparent rounded-full blur-2xl pointer-events-none group-hover:from-emerald-500/20 group-hover:via-amber-500/15 transition-all duration-500"></div>

                  <div className="space-y-3 relative z-10">
                    {/* Top Status Badges (ShieldCheck & Award) */}
                    <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-800/60 text-[11px] font-bold">
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 backdrop-blur-sm">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{isAr ? 'موثق بمحرك العدالة' : 'Verified Channel'}</span>
                      </div>

                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 backdrop-blur-sm">
                        <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{publisher.fairScore ? `${publisher.fairScore} ${isAr ? 'نقطة عدالة' : 'Fair Score'}` : (isAr ? 'وسام الدعم' : 'Award Tier')}</span>
                      </div>
                    </div>

                    <div className="flex items-start justify-between gap-3 pt-1">
                      <div className="flex items-center gap-3">
                        <img
                          src={publisher.avatar}
                          alt={publisher.name}
                          className="w-12 h-12 rounded-xl object-cover border border-emerald-500/30 shadow-md group-hover:scale-105 transition shrink-0"
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
                            <MapPin className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>{publisher.location}</span>
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => setReportingPublisher(publisher)}
                        className="text-slate-500 hover:text-rose-400 p-2 rounded-lg bg-slate-950 border border-slate-800 transition min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                        title={isAr ? 'تقديم بلاغ عن القناة' : 'Report channel'}
                      >
                        <ShieldAlert className="w-4 h-4" />
                      </button>
                    </div>

                    {isAdopted && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{isAr ? 'قناة متبناة ومكفولة حالياً' : 'Currently Sponsored Channel'}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-400">{isAr ? 'نوعية الكفالة والتبني:' : 'Sponsorship Type:'}</span>
                      {publisher.verificationLevel === 'PLATINUM' || (publisher.fairScore && publisher.fairScore >= 60) || publisher.isGazaPilot ? (
                        <span className="bg-amber-500/15 text-amber-300 px-2.5 py-0.5 rounded-lg border border-amber-500/30 font-bold flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{isAr ? 'عرّاب (كفالة شاملة)' : 'Godfather'}</span>
                        </span>
                      ) : (
                        <span className="bg-purple-500/15 text-purple-300 px-2.5 py-0.5 rounded-lg border border-purple-500/30 font-bold flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-purple-400 shrink-0" />
                          <span>{isAr ? 'توجيه وإسناد معنوي' : 'Guidance'}</span>
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                      {publisher.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-slate-800/80">
                    <button
                      onClick={() => handleToggleSponsorship(publisher.id)}
                      className={`adopt-channel-button flex-1 text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] ${
                        isAdopted
                          ? 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40'
                          : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md'
                      }`}
                    >
                      {isAdopted ? (
                        <>
                          <XIcon className="w-4 h-4 shrink-0" />
                          <span>{isAr ? 'إلغاء تبني القناة' : 'Cancel Adoption'}</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 shrink-0" />
                          <span>{isAr ? 'تبني الكفالة غير المالية' : 'Adopt Channel'}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => setActiveOutboundPublisher(publisher)}
                      className="bg-slate-950 hover:bg-slate-800 text-slate-300 text-xs font-bold p-2.5 rounded-xl border border-slate-800 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
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

      {/* TAB 5: SOVEREIGN VAULT & CERTIFICATES LAYER [Sovereign Protocol No. 19 / Record No. 109] */}
      {accountTab === 'vault' && (
        <div className="space-y-6" id="sovereign-vault-injection-container">
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
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <h4 className="text-xs md:text-sm font-bold text-white">
            {isAr ? 'دليل إرشادات الكفيل والمساعد الذكي' : 'Sponsor Knowledge & Guidance Help Hub'}
          </h4>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-300">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
            <span className="font-bold text-amber-300">{isAr ? '1. حماية الخصوصية:' : '1. Privacy Protection:'}</span>
            <p className="text-[11px] text-slate-400">
              {isAr ? 'تفعيل وضع الشبح يخفي اسمك وصورتك من العرض العام مع استمرار الكفالة والتوثيق.' : 'Ghost mode conceals identity.'}
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
                className="w-10 h-10 rounded-lg object-cover shrink-0"
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
                className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
              >
                <span>{t.confirmOutbound}</span>
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
              </button>
              <button
                onClick={() => setActiveOutboundPublisher(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-4 py-2.5 rounded-xl transition cursor-pointer min-h-[44px]"
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

      {/* Integrity Audit Inspection Modal (Zero UI Bloat - No Browser Alerts) */}
      {inspectedChannel && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-cyan-500/40 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    {isAr ? 'تقرير فحص النقاء والتدقيق السيادي' : 'Integrity Audit Inspection Log'}
                  </h3>
                  <p className="text-xs text-cyan-300/80 font-medium">
                    {inspectedChannel.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectedChannel(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800/80 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isAr ? 'الختم المائي الرقمي:' : 'Digital Audit Seal:'}</span>
                <span className="font-mono text-[11px] font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 tracking-wider">
                  NA-AUDIT-SEAL-{inspectedChannel.id.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 8) || 'SOVEREIGN'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isAr ? 'درجة النقاء الرقمي:' : 'Purity Score:'}</span>
                <span className="font-bold text-emerald-400 text-sm">{inspectedChannel.purityScore}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isAr ? 'تاريخ آخر فحص أوتوماتيكي:' : 'Last Automated Audit:'}</span>
                <span className="font-mono text-slate-200">{inspectedChannel.lastAuditDate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{isAr ? 'حالة الحوكمة والامتثال:' : 'Governance Status:'}</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  {isAr ? 'نقي وموثق 100%' : '100% Clean & Verified'}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300">
              <h4 className="font-bold text-slate-200 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>{isAr ? 'نتائج الفحص الجنائي الرقمي' : 'Digital Audit Results'}</span>
              </h4>
              <ul className="space-y-1.5 pl-6 list-disc text-slate-400 text-[11px] leading-relaxed">
                <li>{isAr ? 'خالٍ تماماً من التلوث الإعلاني المباشر وغير المباشر.' : 'Zero advertising pollution detected.'}</li>
                <li>{isAr ? 'لا توجد سكربتات تتبع خارجية أو برمجيات تجسس.' : 'No third-party tracking scripts or telemetry.'}</li>
                <li>{isAr ? 'امتثال كامل لقيد الواجهات الصامتة بروتوكول 88.' : 'Fully compliant with Silent UI constraint & Protocol 88.'}</li>
              </ul>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setInspectedChannel(null)}
                className="w-full bg-cyan-950 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-200 text-xs font-bold py-2.5 rounded-xl transition cursor-pointer min-h-[44px]"
              >
                {isAr ? 'إغلاق سجل الفحص' : 'Close Audit Log'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sovereign Certificate Digital Preview Modal (Watermarked & Encrypted) */}
      {inspectedCertificate && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border-2 border-amber-500/50 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative overflow-hidden">
            {/* Watermark Crest Background */}
            <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none text-amber-400">
              <Award className="w-64 h-64" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-amber-500/30 pb-4 relative z-10">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-amber-200">
                    {isAr ? 'معاينة الشهادة الرقمية المائية السيادية' : 'Sovereign Watermarked Certificate Preview'}
                  </h3>
                  <p className="text-[11px] text-amber-400/80 font-mono tracking-wider">
                    {inspectedCertificate.certificateNo}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectedCertificate(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                title={isAr ? 'إغلاق المعاينة' : 'Close Preview'}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Certificate Core Card */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-amber-950/30 p-5 rounded-xl border border-amber-500/30 space-y-4 relative z-10 text-xs shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {inspectedCertificate.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {isAr ? 'موثق 100%' : '100% Verified'}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white leading-snug">{inspectedCertificate.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isAr ? 'جهة الإصدار المعتمدة:' : 'Issuer Authority:'} <span className="text-slate-200 font-medium">{inspectedCertificate.issuer}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800/80 text-[11px]">
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">{isAr ? 'تاريخ الإصدار:' : 'Issue Date:'}</span>
                  <span className="font-mono font-bold text-slate-200">{inspectedCertificate.issueDate}</span>
                </div>
                <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">{isAr ? 'الختم المائي الرقمي:' : 'Watermark Seal:'}</span>
                  <span className="font-mono font-bold text-amber-400 truncate block">
                    {inspectedCertificate.watermarkSeal || `NA-CERT-2026-${inspectedCertificate.id.toUpperCase().slice(0, 6)}`}
                  </span>
                </div>
              </div>

              <div className="bg-slate-950/90 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[10px] text-slate-400 break-all space-y-1">
                <span className="text-amber-400/80 font-sans block text-[9px] font-bold">
                  {isAr ? 'التوقيع المشفر (Cryptographic Hash):' : 'Cryptographic Hash:'}
                </span>
                <span className="text-slate-300">{inspectedCertificate.hashSignature}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 pt-1 relative z-10">
              <button
                onClick={() => {
                  handleDownloadCertificate(inspectedCertificate.id);
                  setInspectedCertificate(null);
                }}
                className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                <span>{isAr ? 'تحميل الوثيقة المائية' : 'Download Document'}</span>
              </button>
              <button
                onClick={() => setInspectedCertificate(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-4 py-3 rounded-xl transition cursor-pointer min-h-[44px]"
              >
                {isAr ? 'إغلاق' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sovereign Vault Notice / Export Result Modal */}
      {vaultNoticeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-300">{vaultNoticeModal.title}</h3>
                  <p className="text-[10px] text-emerald-400/80 font-mono">Protocol 88 • Sovereign Vault</p>
                </div>
              </div>
              <button
                onClick={() => setVaultNoticeModal(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
                title={isAr ? 'إغلاق' : 'Close'}
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <p className="text-slate-200 leading-relaxed whitespace-pre-line">{vaultNoticeModal.message}</p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">{isAr ? 'رمز الختم المائي:' : 'Watermark Seal:'}</span>
                <span className="font-mono font-bold text-amber-400 bg-amber-950/50 px-2.5 py-1 rounded border border-amber-500/30">
                  {vaultNoticeModal.sealHash}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
              <button
                onClick={() => {
                  setVaultNoticeModal(null);
                  setAccountTab('overview');
                }}
                className="w-full sm:flex-1 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg transition cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 active:scale-95 border border-amber-300/50"
              >
                <Radio className="w-4 h-4 text-slate-950" />
                <span>{isAr ? 'عرض القنوات المتبناة في لوحة التحكم' : 'View My Adopted Channels Grid'}</span>
              </button>

              <button
                onClick={() => setVaultNoticeModal(null)}
                className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-4 py-3 rounded-xl transition cursor-pointer min-h-[44px]"
              >
                {isAr ? 'متابعة الاستكشاف' : 'Continue'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Portal Entry Guide Modal (Educational Comparison between Sponsor and Supporter Portal) */}
      <PortalEntryGuide
        isAr={isAr}
        isOpen={isConceptGuideOpen}
        onClose={() => setIsConceptGuideOpen(false)}
        onSelectSponsorMode={() => {
          setSponsorMode();
          setIsConceptGuideOpen(false);
        }}
        onSelectSupporterMode={() => {
          setSupporterMode();
          setIsConceptGuideOpen(false);
        }}
        currentMode={isLoggedIn ? 'SPONSOR' : 'GUEST_SUPPORTER'}
      />

      {/* JASMINE ONBOARDING WIZARD MODAL (3 CAPSULES) - DYNAMIC LAZY LOADED */}
      {isJasmineWizardOpen && (
        <React.Suspense
          fallback={
            <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4">
              <div className="text-amber-400 font-bold text-sm flex items-center gap-3 bg-slate-900 border border-amber-500/40 px-6 py-4 rounded-2xl shadow-2xl">
                <Sparkles className="w-5 h-5 animate-spin text-amber-400" />
                <span>{isAr ? 'جاري تحميل معالج كفيل الياسمين...' : 'Loading Jasmine Sponsor Wizard...'}</span>
              </div>
            </div>
          }
        >
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-0 sm:p-4 overflow-y-auto animate-fade-in">
            <div className="bg-slate-950 border border-amber-500/40 sm:rounded-3xl w-full max-w-4xl min-h-screen sm:min-h-0 p-3 sm:p-6 shadow-2xl relative my-auto">
              <div className="flex items-center justify-between mb-2">
                <button
                  type="button"
                  onClick={() => setIsJasmineWizardOpen(false)}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-amber-300 bg-slate-900 hover:bg-slate-800 rounded-xl border border-amber-500/30 transition cursor-pointer min-h-[40px] shadow-sm active:scale-95 touch-manipulation"
                >
                  {isAr ? <ArrowRight className="w-4 h-4 text-amber-400" /> : <ArrowLeft className="w-4 h-4 text-amber-400" />}
                  <span>{isAr ? 'رجوع' : 'Back'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsJasmineWizardOpen(false);
                  }}
                  className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-full border border-slate-800 hover:bg-slate-800 transition cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
                  title={isAr ? 'إغلاق' : 'Close'}
                >
                  <XIcon className="w-5 h-5 text-amber-400" />
                </button>
              </div>

              <JasmineOnboardingWizard
                lang={lang === 'en' ? 'en' : 'ar'}
                isAccountVerified={isLoggedIn}
                onClose={() => {
                  setIsJasmineWizardOpen(false);
                }}
                onOpenGuidance={() => {
                  setIsJasmineWizardOpen(false);
                  setIsJasmineGuidanceOpen(true);
                }}
                onComplete={(data: JasmineOnboardingData) => {
                  setIsJasmineWizardOpen(false);
                  const adoptedCount = data.step1?.adoptedChannels?.length || 0;
                  const firstChannel = data.step1?.adoptedChannels?.[0];
                  if (recordActionWithCooldown) {
                    recordActionWithCooldown({
                      id: `act-jas-${Date.now()}`,
                      publisherId: firstChannel?.channelId || 'pub-1',
                      publisherName: firstChannel?.channelName || (isAr ? 'قناة ميدانية مكفولة' : 'Sponsored Field Channel'),
                      platform: 'YouTube',
                      timestamp: new Date().toISOString(),
                    });
                  }
                  setVaultNoticeModal({
                    title: isAr ? 'تم انضمام كفيل قطاع الياسمين بنجاح' : 'Jasmine Sponsor Onboarding Completed',
                    message: isAr
                      ? `تم اعتماد طلب الانضمام وتوثيق الرسالة التعريفية للشخصية (${data.celebrityName || 'كفيل محمي'}).\nتم تبني عدد (${adoptedCount}) قناة ميدانية بنجاح.`
                      : `Sponsor onboarding request approved for (${data.celebrityName || 'Protected Sponsor'}).\nAdopted ${adoptedCount} field channels.`,
                    sealHash: `JASMINE-${Date.now().toString(36).toUpperCase()}`,
                    type: 'archive',
                  });
                }}
              />
            </div>
          </div>
        </React.Suspense>
      )}

      {/* JASMINE ONE-WAY GUIDANCE MODAL */}
      {isJasmineGuidanceOpen && (
        <JasmineOneWayGuidanceModal
          lang={lang === 'en' ? 'en' : 'ar'}
          celebrityName={supporterProfile.name}
          celebrityId="jas-supporter-01"
          guidanceNotes={jasmineGuidanceNotes}
          onClose={() => setIsJasmineGuidanceOpen(false)}
          onAddGuidanceNote={(newNote: OneWayGuidanceNote) => {
            setJasmineGuidanceNotes((prev) => [newNote, ...prev]);
            if (recordActionWithCooldown) {
              recordActionWithCooldown({
                id: `act-guide-${Date.now()}`,
                publisherId: newNote.targetChannelId,
                publisherName: newNote.targetChannelName,
                platform: 'YouTube',
                timestamp: new Date().toISOString(),
              });
            }
          }}
        />
      )}
    </div>
  );
};

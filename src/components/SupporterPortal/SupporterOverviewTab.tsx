import React, { useState } from 'react';
import { Publisher, Language, PlatformType } from '../../types';
import { ImpactCalculator } from '../features/ImpactCalculator';
import { IntegrityHealthRadar, IntegrityChannelItem } from '../features/IntegrityHealthRadar';
import { SovereignVault, SovereignCertificate, SovereignVaultRecord } from '../features/SovereignVault';
import { SponsoredChannelsGrid } from './SponsoredChannelsGrid';
import { SupporterConceptsInlineCard } from './SupporterConceptsGuide';
import { ConceptsDefinitionSection } from './ConceptsDefinitionSection';
import { SupporterReferralCard } from './SupporterReferralCard';
import { SupporterNominationModal } from './SupporterNominationModal';
import { SupporterProfileData } from './supporterMockData';
import { AccountTabType } from './SupporterTabs';
import { Crown, Sparkles, MessageSquare, Layers, Sliders, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';

export type ScopeMode = 'NARROW' | 'DETAILED';

interface SupporterOverviewTabProps {
  isAr: boolean;
  lang: Language;
  isLoggedIn: boolean;
  isGhostMode: boolean;
  supporterProfile: SupporterProfileData;
  sponsoredPublishers: Publisher[];
  radarChannelItems: IntegrityChannelItem[];
  overallPurityPercent: number;
  supporterCertificates: SovereignCertificate[];
  supporterVaultRecords: SovereignVaultRecord[];
  onOpenJasmineWizard: () => void;
  onOpenJasmineGuidance: () => void;
  onOpenConceptGuide: () => void;
  onToggleLogin: () => void;
  onSetAccountTab: (tab: AccountTabType) => void;
  onExportImpactReport: () => void;
  onInspectChannel: (id: string) => void;
  onPreviewCertificate: (id: string) => void;
  onDownloadCertificate: (id: string) => void;
  onExportVaultArchive: () => void;
  onSendGuidanceClick: (pubId: string) => void;
  onCancelSponsorshipClick: (pubId: string) => void;
  getPlatformIcon: (platform: PlatformType) => React.ReactNode;
}

export const SupporterOverviewTab: React.FC<SupporterOverviewTabProps> = ({
  isAr,
  lang,
  isLoggedIn,
  isGhostMode,
  supporterProfile,
  sponsoredPublishers,
  radarChannelItems,
  overallPurityPercent,
  supporterCertificates,
  supporterVaultRecords,
  onOpenJasmineWizard,
  onOpenJasmineGuidance,
  onOpenConceptGuide,
  onToggleLogin,
  onSetAccountTab,
  onExportImpactReport,
  onInspectChannel,
  onPreviewCertificate,
  onDownloadCertificate,
  onExportVaultArchive,
  onSendGuidanceClick,
  onCancelSponsorshipClick,
  getPlatformIcon,
}) => {
  // Default to NARROW scope for zero-bloat, ultra-fast celebrity & sponsor experience
  const [scopeMode, setScopeMode] = useState<ScopeMode>('NARROW');
  const [isWizardLoading, setIsWizardLoading] = useState(false);
  const [isNominationModalOpen, setIsNominationModalOpen] = useState(false);

  const handleTriggerWizard = () => {
    setIsWizardLoading(true);
    setTimeout(() => {
      setIsWizardLoading(false);
      onOpenJasmineWizard();
    }, 400);
  };

  return (
    <div className="space-y-6">
      {/* SCOPE SELECTOR CONTROL BANNER */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-white">
                {isAr ? 'نطاق الرؤية المعماري:' : 'Architectural View Scope:'}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${
                scopeMode === 'NARROW'
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                  : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
              }`}>
                {scopeMode === 'NARROW'
                  ? (isAr ? 'النطاق الضيق السريع (افتراضي للمشاهير)' : 'Narrow Scope (Celebrity Default)')
                  : (isAr ? 'النطاق التفصيلي الشامل (لمديري الأعمال)' : 'Detailed Scope (Full Analytics)')}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {scopeMode === 'NARROW'
                ? (isAr
                  ? 'التركيز المطلق على أزرار التوجيه المباشر والكبسولات الحرجة بدون حشو إحصائي.'
                  : 'Zero-bloat view focusing exclusively on direct action buttons and guidance.')
                : (isAr
                  ? 'عرض السجلات التاريخية، حاسبة الأثر الإنساني، ورادار النقاء والرخص الرقمية.'
                  : 'Comprehensive view with historic archives, impact calculator, and purity radar.')}
            </p>
          </div>
        </div>

        {/* Scope Mode Switcher Button */}
        <div className="flex items-center gap-1.5 shrink-0 bg-slate-950 p-1 rounded-xl border border-slate-800 min-h-[44px]">
          <button
            type="button"
            onClick={() => setScopeMode('NARROW')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] ${
              scopeMode === 'NARROW'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 shrink-0" />
            <span>{isAr ? 'النطاق الضيق' : 'Narrow Scope'}</span>
          </button>

          <button
            type="button"
            onClick={() => setScopeMode('DETAILED')}
            className={`flex-1 sm:flex-initial px-3.5 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] ${
              scopeMode === 'DETAILED'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md font-black'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 shrink-0" />
            <span>{isAr ? 'النطاق التفصيلي' : 'Detailed Scope'}</span>
          </button>
        </div>
      </div>

      {/* JASMINE SUPPORTER ONBOARDING & ACTION BAR (POPUP LAUNCHER ONLY) */}
      <div className="bg-slate-900/90 border border-amber-500/40 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400 shrink-0">
            <Crown className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
              <span>{isAr ? 'قطاع الياسمين • إدارة الكفالة والتبني الميداني' : 'Jasmine Sector • Sponsorship & Adoption Control'}</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] font-extrabold border border-amber-500/30">
                {isLoggedIn ? (isAr ? 'كفيل نشط' : 'Active Sponsor') : (isAr ? 'انضمام كفيل' : 'Sponsor Onboarding')}
              </span>
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {isAr
                ? 'إعادة كيفية الكفالة وكفالة جديدة | من هنا يمكنك إعادة هيكلة الكفالة أو إضافة قناة جديدة'
                : 'Restructure Sponsorship & New Adoption | From here you can restructure sponsorship or adopt a new channel.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 flex-wrap sm:flex-nowrap">
          <button
            type="button"
            disabled={isWizardLoading}
            onClick={handleTriggerWizard}
            className="flex-1 md:flex-initial bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 disabled:opacity-80 text-slate-950 text-xs sm:text-sm font-black px-4 py-2.5 rounded-xl shadow-lg hover:shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer min-h-[42px] border border-amber-300/50"
          >
            {isWizardLoading ? (
              <>
                <Loader2 className="w-4 h-4 shrink-0 animate-spin text-slate-950" />
                <span className="whitespace-nowrap">
                  {isAr ? 'جاري معالجة بيانات الكفالة...' : 'Processing Sponsorship Data...'}
                </span>
              </>
            ) : (
              <>
                <Crown className="w-4 h-4 shrink-0" />
                <span className="whitespace-nowrap">
                  {isAr ? 'تعديل الكفالة وتبني قناة جديدة' : 'Manage Sponsorship & Adopt New Channel'}
                </span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenJasmineGuidance}
            className="bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 text-xs sm:text-sm font-bold px-3.5 py-2.5 rounded-xl border border-amber-500/30 transition active:scale-95 flex items-center justify-center gap-2 cursor-pointer min-h-[42px]"
            title={isAr ? 'فتح نافذة التوجيه المباشر' : 'Open Direct Guidance'}
          >
            <MessageSquare className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="whitespace-nowrap">{isAr ? 'توجيه أحادي' : 'One-Way Guidance'}</span>
          </button>
        </div>
      </div>

      {/* REFERRAL & GLOBAL HUMANITARIAN SHARE CAPSULE [NA-SOV-ARCH-2026-0808-031] */}
      <SupporterReferralCard
        isAr={isAr}
        onNominateClick={() => setIsNominationModalOpen(true)}
      />

      {/* SUPPORTER NOMINATION MODAL [NA-SOV-ARCH-2026-0808-033] */}
      <SupporterNominationModal
        isOpen={isNominationModalOpen}
        onClose={() => setIsNominationModalOpen(false)}
        isAr={isAr}
        currentSupporterId={supporterProfile.id}
        currentSupporterName={supporterProfile.name}
      />

      {/* SPONSORED CHANNELS MANAGEMENT GRID (ALWAYS VISIBLE IN NARROW & DETAILED) */}
      <SponsoredChannelsGrid
        sponsoredPublishers={sponsoredPublishers}
        isAr={isAr}
        onExploreClick={() => onSetAccountTab('explore')}
        onSendGuidanceClick={(pubId) => onSendGuidanceClick(pubId)}
        onCancelSponsorshipClick={onCancelSponsorshipClick}
        getPlatformIcon={getPlatformIcon}
      />

      {/* NARROW SCOPE EXPANSION PROMPT */}
      {scopeMode === 'NARROW' && (
        <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 text-center space-y-2">
          <p className="text-xs text-slate-300 font-medium">
            {isAr
              ? 'أنت تعمل حالياً بالواجهة السريعة للمشاهير (Narrow Scope). لعرض تحليلات الأثر، رادار النقاء، وسجلات الخزانة السيادية:'
              : 'You are currently using the streamlined Narrow Scope view. To inspect full impact analytics and vault records:'}
          </p>
          <button
            type="button"
            onClick={() => setScopeMode('DETAILED')}
            className="inline-flex items-center gap-2 text-xs font-bold text-purple-300 hover:text-purple-200 bg-purple-500/10 hover:bg-purple-500/20 px-4 py-2 rounded-xl border border-purple-500/30 transition cursor-pointer min-h-[44px]"
          >
            <Layers className="w-4 h-4 text-purple-400" />
            <span>{isAr ? 'الانتقال للواجهة التفصيلية (Detailed Scope)' : 'Switch to Detailed Scope'}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* DETAILED SCOPE MODULES (CONDITIONALLY RENDERED FOR DETAILED MODE ONLY) */}
      {scopeMode === 'DETAILED' && (
        <div className="space-y-6 animate-fade-in border-t border-purple-500/20 pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-purple-300 text-xs font-bold">
              <Layers className="w-4 h-4 text-purple-400" />
              <span>{isAr ? 'الأقسام التفصيلية لمديري الأعمال والتحليل العميق:' : 'Detailed Modules for Managers & Analytics:'}</span>
            </div>
            <button
              type="button"
              onClick={() => setScopeMode('NARROW')}
              className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <span>{isAr ? 'إغلاق النطاق التفصيلي' : 'Collapse Detailed Scope'}</span>
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>

          {/* Educational Concept Banner */}
          <SupporterConceptsInlineCard
            isAr={isAr}
            currentStatus={isLoggedIn ? 'SPONSOR' : 'GUEST_SUPPORTER'}
            onOpenGuideModal={onOpenConceptGuide}
          />

          {/* Dedicated Concepts Definition Section */}
          <ConceptsDefinitionSection
            lang={lang}
            isAr={isAr}
            currentStatus={isLoggedIn ? 'SPONSOR' : 'GUEST_SUPPORTER'}
            onToggleStatus={onToggleLogin}
            onExploreChannels={() => onSetAccountTab('explore')}
          />

          {/* Cumulative Non-Monetary Impact Metrics Component */}
          <ImpactCalculator
            totalEngagementHours={1240}
            totalOutboundVisits={3850}
            sponsoredChannelsCount={supporterProfile.sponsoredPublisherIds.length}
            integrityHealthPercent={100}
            autonomyGrowthPercent={78}
            lang={lang}
            onExportReport={onExportImpactReport}
          />

          {/* Integrity Health Radar & Audit Shield Component */}
          <IntegrityHealthRadar
            channels={radarChannelItems}
            overallPurityPercent={overallPurityPercent}
            lang={lang}
            onInspectChannel={onInspectChannel}
          />

          {/* Sovereign Vault Layer */}
          <SovereignVault
            certificates={supporterCertificates}
            vaultRecords={supporterVaultRecords}
            isGhostMode={isGhostMode}
            lang={lang}
            onPreviewCertificate={onPreviewCertificate}
            onDownloadCertificate={onDownloadCertificate}
            onExportVaultArchive={onExportVaultArchive}
          />
        </div>
      )}
    </div>
  );
};


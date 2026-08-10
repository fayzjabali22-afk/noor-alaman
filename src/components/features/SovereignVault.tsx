import React, { useState } from 'react';
import { AccordionEmptyState } from '../layout/AccordionEmptyState';
import { Language } from '../../types';
import {
  Award,
  FileCheck,
  Lock,
  Download,
  Eye,
  CheckCircle2,
  Sparkles,
  FolderArchive,
  History,
  QrCode,
  Zap,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface SovereignCertificate {
  id: string;
  certificateNo: string;
  title: string;
  issueDate: string;
  issuer: string;
  status: 'verified' | 'archived' | 'active';
  category: string;
  hashSignature: string;
  type?: 'HONORARY' | 'JASMINE_ENDORSEMENT' | 'TRAFFIC_BOOST' | string;
  endorsedChannelId?: string;
  watermarkSeal?: string;
}

export interface SovereignVaultRecord {
  id: string;
  recordNo: string;
  type: string;
  targetChannel: string;
  impactMetrics: string;
  timestamp: string;
  ghostShielded: boolean;
  watermarkSeal: string;
}

export interface SovereignVaultProps {
  certificates: SovereignCertificate[];
  vaultRecords: SovereignVaultRecord[];
  isGhostMode: boolean;
  lang: Language;
  onPreviewCertificate?: (certId: string) => void;
  onDownloadCertificate?: (certId: string) => void;
  onExportVaultArchive?: () => void;
}

/**
 * SovereignVault Component
 * Sovereign Unified Protocol: [Protocol No. 19 / Record No. 109]
 * Governance Constraint: Pure Dumb Presentational UI (NA-DUMB-UI-CONSTRAINT-001 v1.0)
 * - Zero network calls, zero side effects
 * - 100% Props-driven data rendering for certificates & digital impact archives
 * - Completely free of financial complexity or monetary metrics
 */
export const SovereignVault: React.FC<SovereignVaultProps> = React.memo(({
  certificates,
  vaultRecords,
  isGhostMode,
  lang,
  onPreviewCertificate,
  onDownloadCertificate,
  onExportVaultArchive,
}) => {
  const isAr = lang === 'ar';
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      id="sovereign-vault-pure-container"
      className="w-full bg-slate-900/90 border border-slate-800/80 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl space-y-4 relative overflow-hidden backdrop-blur-xl transition-all duration-300"
    >
      {/* Background Subtle Ambient Aura */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28" />

      {/* Vault Header Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 ${isOpen ? 'border-b border-slate-800/60 pb-4' : ''}`}>
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-3.5 cursor-pointer group select-none flex-1 min-h-[56px]"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen((prev) => !prev);
            }
          }}
          aria-expanded={isOpen}
        >
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 shadow-inner group-hover:border-amber-500/60 transition shrink-0">
            <FolderArchive className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base md:text-xl font-black text-white group-hover:text-amber-300 transition">
                {isAr ? 'الخزانة السيادية والأرشيف الرقمي للأثر' : 'Sovereign Digital Vault & Watermarked Archive'}
              </h3>
              <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>NA-PROTOCOL-018</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'توثيق شرفي سيادي غير مالي للشهادات وتوجيهات الدفعة المرورية محمي حواكمياً بوضعية الشبح'
                : 'Honorary sovereign non-monetary certificates and traffic boost logs under Ghost Shield.'}
            </p>
          </div>
        </div>

        {/* Export & Ghost Shield Badge & Accordion Toggle */}
        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto flex-wrap sm:flex-nowrap">
          {isGhostMode && (
            <span className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-bold min-h-[44px]">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>{isAr ? 'درع الشبح مفعل' : 'Ghost Shield Active'}</span>
            </span>
          )}

          {onExportVaultArchive && (
            <button
              type="button"
              onClick={onExportVaultArchive}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-lg shadow-amber-500/20 min-h-[44px] touch-manipulation active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? 'تصدير أرشيف الخزانة' : 'Export Vault Records'}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? (isAr ? 'طي القائمة' : 'Collapse') : (isAr ? 'توسيع القائمة' : 'Expand')}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation active:scale-95 shrink-0"
          >
            <ChevronDown className={`w-5 h-5 text-amber-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Accordion Collapsible Body */}
      <div
        className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
        }`}
      >
        <div className="overflow-hidden space-y-6">

      {/* SECTION 1: HONORARY SOVEREIGN CERTIFICATES */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'الشهادات الشرفية والتوثيق السيادي المعتمد' : 'Honorary Sovereign Certificates'}</span>
          </span>
          <span className="text-slate-500 text-[11px]">
            {isAr ? `إجمالي الشهادات: ${certificates.length}` : `Total Certificates: ${certificates.length}`}
          </span>
        </div>

        {certificates.length === 0 ? (
          <AccordionEmptyState
            titleAr="لا توجد شهادات توثيق سيادية مسجلة بعد"
            titleEn="No Sovereign Certificates Issued Yet"
            descriptionAr="قم بتأكيد تبني قناتين ميدانيتين على الأقل وإرسال أول توجيه رسمي لإصدار شهادة التوثيق الشرفية وختمها بختم المائية الرقمية."
            descriptionEn="Adopt at least 2 field channels and send official guidance to earn your official watermarked sovereign certificate."
            icon={Award}
            badgeTextAr="الخزانة الرقمية"
            badgeTextEn="Digital Vault"
            lang={isAr ? 'ar' : 'en'}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                id={`sovereign-cert-${cert.id}`}
                className="bg-slate-950/80 border border-slate-800 hover:border-amber-500/40 p-4 rounded-2xl space-y-3 transition group relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-amber-300 transition">
                        {cert.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
                        <span>{cert.issuer}</span>
                        <span>•</span>
                        <span className="text-slate-500">{cert.certificateNo}</span>
                        {cert.type === 'JASMINE_ENDORSEMENT' && (
                          <>
                            <span>•</span>
                            <span className="px-1.5 py-0.2 text-[9px] rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                              {isAr ? 'تزكية ياسمين' : 'Jasmine Endorsement'}
                            </span>
                          </>
                        )}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{isAr ? 'مختومة 100%' : 'Sealed'}</span>
                  </span>
                </div>

                {/* Hash Signature & Interactive Callbacks */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                  <span className="text-slate-500 font-mono text-[10px] truncate max-w-[180px]" title={cert.hashSignature}>
                    {cert.hashSignature}
                  </span>

                  <div className="flex items-center gap-2">
                    {onPreviewCertificate && (
                      <button
                        type="button"
                        onClick={() => onPreviewCertificate(cert.id)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700 flex items-center gap-1 cursor-pointer text-[10px]"
                      >
                        <Eye className="w-3.5 h-3.5 text-amber-400" />
                        <span>{isAr ? 'معاينة' : 'View'}</span>
                      </button>
                    )}

                    {onDownloadCertificate && (
                      <button
                        type="button"
                        onClick={() => onDownloadCertificate(cert.id)}
                        className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition border border-slate-700 flex items-center gap-1 cursor-pointer text-[10px]"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{isAr ? 'تحميل' : 'Download'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SECTION 2: NON-MONETARY TRAFFIC SURGE AUDIT LOGS */}
      <div className="space-y-3 relative z-10 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
          <span className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <span>{isAr ? 'أرشيف التوجيه المروري غير المالي الموثق' : 'Non-Monetary Traffic Boost Audit Archive'}</span>
          </span>
          <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAr ? 'أثر سيادي مستدام' : 'Sovereign Impact'}</span>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {vaultRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-slate-950/70 border border-slate-800 hover:border-cyan-500/30 p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl text-cyan-400">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{rec.targetChannel}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-900 text-cyan-300 rounded-full border border-slate-800">
                      {rec.recordNo}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {rec.type} • {rec.impactMetrics}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-right sm:text-left justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-2 sm:pt-0">
                <div className="flex flex-col">
                  <span className="text-[10px] text-slate-500">{rec.timestamp}</span>
                  <span className="text-[10px] font-mono text-emerald-400">{rec.watermarkSeal}</span>
                </div>

                <div
                  className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400"
                  title={isAr ? 'ختم مائي غير قابل للتزوير' : 'Non-tamperable watermark seal'}
                >
                  <QrCode className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER GOVERNANCE STATEMENT */}
      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-300 relative z-10">
        <Lock className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-[11px]">
          {isAr
            ? 'تضمن الخزانة السيادية حفظ الشهادات والأرشيف غير المالي بأعلى مستويات الخصوصية والتشفير المائي. يخضع المكون حواكمياً لقيد الواجهات الصامتة (NA-DUMB-UI-CONSTRAINT-001 v1.0) والبروتوكول السيادي [NA-SOVEREIGN-PROTOCOL-VAULT-ENFORCEMENT-018].'
            : 'Sovereign Vault ensures non-monetary impact logs and certificates are watermarked and cryptographically preserved under NA-DUMB-UI-CONSTRAINT-001 v1.0 and Protocol 018.'}
        </p>
      </div>
        </div>
      </div>
    </div>
  );
});

SovereignVault.displayName = 'SovereignVault';

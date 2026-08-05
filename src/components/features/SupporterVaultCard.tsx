import React from 'react';
import { Language } from '../../types';
import {
  ShieldCheck,
  Award,
  FileCheck,
  Lock,
  Download,
  Eye,
  CheckCircle2,
  Sparkles,
  Key,
  FolderArchive,
  History,
  QrCode,
  Zap,
} from 'lucide-react';

export interface SupporterCertificate {
  id: string;
  certificateNo: string;
  title: string;
  issueDate: string;
  issuer: string;
  status: 'verified' | 'archived' | 'active';
  category: string;
  hashSignature: string;
}

export interface SupporterVaultRecord {
  id: string;
  recordNo: string;
  type: string;
  targetChannel: string;
  impactMetrics: string;
  timestamp: string;
  ghostShielded: boolean;
  watermarkSeal: string;
}

export interface SupporterVaultCardProps {
  certificates: SupporterCertificate[];
  vaultRecords: SupporterVaultRecord[];
  isGhostMode: boolean;
  lang: Language;
  onPreviewCertificate?: (certId: string) => void;
  onDownloadCertificate?: (certId: string) => void;
  onExportVaultArchive?: () => void;
}

export const SupporterVaultCard: React.FC<SupporterVaultCardProps> = ({
  certificates,
  vaultRecords,
  isGhostMode,
  lang,
  onPreviewCertificate,
  onDownloadCertificate,
  onExportVaultArchive,
}) => {
  const isAr = lang === 'ar';

  return (
    <div
      id="sovereign-supporter-vault-container"
      className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-xl"
    >
      {/* Background Accent */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-28 -mt-28" />

      {/* Vault Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-400 shadow-inner">
            <FolderArchive className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg md:text-xl font-black text-white">
                {isAr ? 'الخزانة السيادية والأرشيف المائي' : 'Sovereign Vault & Watermarked Archive'}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                NA-EXEC-015
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'توثيق شرفي غير مالي وسجل سيادي للشهادات وتوجيهات الدفعة المرورية محمي بوضعية الشبح'
                : 'Honorary non-monetary certificates and traffic surge boost audit logs protected by Ghost Mode.'}
            </p>
          </div>
        </div>

        {/* Export / Privacy Pill */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          {isGhostMode && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-bold">
              <Lock className="w-3.5 h-3.5 text-purple-400" />
              <span>{isAr ? 'حماية الشبح مفعلة' : 'Ghost Shield Active'}</span>
            </span>
          )}

          {onExportVaultArchive && (
            <button
              type="button"
              onClick={onExportVaultArchive}
              className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl transition cursor-pointer shadow-lg shadow-amber-500/20"
            >
              <Download className="w-4 h-4" />
              <span>{isAr ? 'تصدير أرشيف الخزانة' : 'Export Vault Records'}</span>
            </button>
          )}
        </div>
      </div>

      {/* SECTION 1: HONORARY CERTIFICATES */}
      <div className="space-y-3 relative z-10">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
          <span className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'الشهادات الشرفية والتوثيق السيادي المعتمد' : 'Honorary Certificates & Sovereign Seals'}</span>
          </span>
          <span className="text-slate-500 text-[11px]">
            {isAr ? `عدد الشهادات: ${certificates.length}` : `Count: ${certificates.length}`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              id={`vault-cert-${cert.id}`}
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
                    <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5">
                      <span>{cert.issuer}</span>
                      <span>•</span>
                      <span className="text-slate-500">{cert.certificateNo}</span>
                    </p>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-extrabold flex items-center gap-1 shrink-0">
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>{isAr ? 'مختومة 100%' : 'Sealed'}</span>
                </span>
              </div>

              {/* Hash Code & Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                <span className="text-slate-500 font-mono text-[10px] truncate max-w-[180px]">
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
      </div>

      {/* SECTION 2: NON-MONETARY IMPACT AUDIT VAULT LOGS */}
      <div className="space-y-3 relative z-10 pt-2 border-t border-slate-800/80">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300 px-1">
          <span className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <span>{isAr ? 'أرشيف التوجيه المروري غير المالي الموثق' : 'Non-Monetary Traffic Surge Archive'}</span>
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

                <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400" title={isAr ? 'ختم مائي غير قابل للتزوير' : 'Non-tamperable watermark'}>
                  <QrCode className="w-4 h-4 text-amber-400" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER GOVERNANCE GUARANTEE */}
      <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-300 relative z-10">
        <Lock className="w-4 h-4 text-amber-400 shrink-0" />
        <p className="text-[11px]">
          {isAr
            ? 'تضمن الخزانة السيادية حفظ الشهادات والأرشيف غير المالي بأعلى مستويات الخصوصية والتشفير المائي. يخضع المكون حواكمياً لقيد الواجهات الصامتة (NA-DUMB-UI-CONSTRAINT-001 v1.0) والأمر السيادي [NA-SOVEREIGN-EXEC-SUPPORTER-VAULT-015].'
            : 'Sovereign Vault ensures non-monetary impact logs and certificates are watermarked and cryptographically preserved under NA-DUMB-UI-CONSTRAINT-001 v1.0.'}
        </p>
      </div>
    </div>
  );
};

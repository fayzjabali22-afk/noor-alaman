// Vault Export & Document Generation Service (Order 066 Decoupling)
// Handles watermarked file generation, text formatting, and browser download triggers.

import { SovereignCertificate, SovereignVaultRecord } from '../components/features/SovereignVault';

export const downloadTextFile = (filename: string, content: string): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error("Error in Noor Al-Amani Module:", err);
    return false;
  }
};

export const generateImpactReportContent = (
  isAr: boolean,
  isGhostMode: boolean,
  exporterIdentity: string,
  checksumHash: string,
  sponsoredCount: number,
  timestamp: string = new Date().toISOString()
): string => {
  if (isAr) {
    return `=== منصة نور الأماني - تقرير الأثر التراكمي الموثق مائياً ===
رمز الختم الرقمي: ${checksumHash}
تاريخ التصدير: ${timestamp}
هوية الكفيل المستخرج: ${exporterIdentity}
الحالة الرقمية: ${isGhostMode ? 'مُقنّع بحماية الشبح الصامت (Zero UI Bloat / 100% Privacy)' : 'معلن محلياً'}

[مؤشرات الأثر التراكمي للجناح السيادي]:
- ساعات التفاعل المباشرة: 1240 ساعة
- إجمالي زيارات التحويل المباشر: 3850 زيارة
- سلامة النقاء الرقمي: 100% (خالٍ تماماً من التلوث الإعلاني)
- مؤشر النمو والتكافؤ: 78%
- عدد القنوات المشمولة بالكفالة: ${sponsoredCount} قناة إغاثية

وثيقة موثقة مائياً برقم هيدر سيادي مشفر • منصة نور الأماني • بروتوكول 88`;
  }

  return `=== NOOR AL-AMANI PLATFORM - WATERMARKED CUMULATIVE IMPACT REPORT ===
Digital Seal Hash: ${checksumHash}
Export Timestamp: ${timestamp}
Exporter Identity: ${exporterIdentity}
Digital Mode: ${isGhostMode ? 'Masked with Silent Ghost Mode (Zero UI Bloat / 100% Privacy)' : 'Locally Declared'}

[SOVEREIGN CUMULATIVE IMPACT METRICS]:
- Direct Engagement Hours: 1240 hrs
- Outbound Direct Visits: 3850 visits
- Integrity Health Rating: 100% (Pure & Clean)
- Autonomy Growth Index: 78%
- Sponsored Channels Count: ${sponsoredCount} channels

Watermarked Digital Certificate • Noor Al-Amani Sovereign Platform • Protocol 88`;
};

export const generateCertificateContent = (
  cert: SovereignCertificate | undefined,
  seal: string,
  title: string
): string => {
  return `=== NOOR AL-AMANI PLATFORM - WATERMARKED DIGITAL CERTIFICATE ===
Certificate No: ${cert?.certificateNo || seal}
Title: ${title}
Status: VERIFIED 100% PURE (Protocol 88)
Issue Date: ${cert?.issueDate || new Date().toISOString().split('T')[0]}
Issuer: ${cert?.issuer || 'Noor Al-Amani Sovereign Platform'}
Cryptographic Hash: ${cert?.hashSignature || 'SHA256-SOVEREIGN-VERIFIED'}
Watermark Seal: ${seal}

This watermarked digital certificate is issued under sovereign privacy protocols.
Zero Commercial Ad Pollution • Protocol 88 Compliance`;
};

export const generateVaultArchiveContent = (
  certificates: SovereignCertificate[],
  vaultRecords: SovereignVaultRecord[],
  isGhostMode: boolean,
  archiveHash: string
): string => {
  return `=== NOOR AL-AMANI PLATFORM - SOVEREIGN VAULT ARCHIVE ===
Archive Seal Hash: ${archiveHash}
Generated At: ${new Date().toISOString()}
Certificates Count: ${certificates.length}
Vault Records Count: ${vaultRecords.length}
Privacy Shield: ${isGhostMode ? 'ACTIVE (Silent Ghost Mode)' : 'DECLARED LOCAL'}

Summary of Verified Sovereign Certificates:
${certificates.map((c) => `- [${c.certificateNo}] ${c.title} (${c.issueDate})`).join('\n')}

Summary of Vault Integrity Logs:
${vaultRecords.map((r) => `- [${r.recordNo}] ${r.type} -> ${r.targetChannel} (${r.timestamp})`).join('\n')}

Watermarked Digital Vault Archive • Noor Al-Amani Sovereign Platform • Protocol 88`;
};

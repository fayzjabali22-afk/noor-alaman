import { SovereignCertificate, SovereignVaultRecord } from '../features/SovereignVault';
import { IntegrityChannelItem } from '../features/IntegrityHealthRadar';
import { Publisher } from '../../types';

export interface SupporterProfileData {
  id: string;
  name: string;
  email: string;
  titleRole: string;
  avatar: string;
  verifiedTier: string;
  videoUrl: string;
  statement: string;
  referenceLink: string;
  sponsoredPublisherIds: string[];
  // Order 062 & Order 008: Regional, Creator & Classifier Schema
  mainRegion: string;
  targetTerritory: string;
  country?: string;
  supporterCategory?: string;
  publicChannelName: string;
  platform: string;
  contentCategory: string;
  introVideoUrl: string;
}

export const getInitialSupporterProfile = (isAr: boolean): SupporterProfileData => ({
  id: 'sp-001',
  name: isAr ? 'د. سلمان الكواري' : 'Dr. Salman Al-Kuwari',
  email: 'salman.alkuwari@sovereign-humanitarian.org',
  titleRole: isAr ? 'سفير إنساني وكفيل مؤسسي معتمد' : 'Humanitarian Ambassador & Verified Sponsor',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
  verifiedTier: isAr ? 'كفيل معتمد - المستوى الماسي' : 'Platinum Verified Sponsor',
  videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  statement: isAr
    ? 'نؤمن بالتأثير المستدام من خلال تمكين صناع المحتوى الميدانيين والإنسانيين في فلسطين والدول المتأثرة دون أي وسائط تجارية.'
    : 'Empowering field content creators in Gaza and Palestine through direct non-monetary adoption.',
  referenceLink: 'https://t.me/humanitarian_support_official',
  sponsoredPublisherIds: ['pub-001', 'pub-002', 'pub-004'],
  // Order 062 & 008 fields
  mainRegion: isAr ? 'الشرق الأوسط' : 'Middle East',
  targetTerritory: isAr ? 'قطاع غزة والقدس الشريف' : 'Gaza Strip & Al-Quds',
  country: isAr ? 'قطر' : 'Qatar',
  supporterCategory: isAr ? 'سفير إنساني' : 'Humanitarian Ambassador',
  publicChannelName: isAr ? 'منبر الكفالة الإنسانية الموحد' : 'Unified Humanitarian Voice',
  platform: 'YouTube',
  contentCategory: isAr ? 'إنساني وإغاثي' : 'Humanitarian & Relief',
  introVideoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
});

export const getRadarChannelItems = (sponsoredPublishers: Publisher[]): IntegrityChannelItem[] => {
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
};

export const getSupporterCertificates = (isAr: boolean): SovereignCertificate[] => [
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
];

export const getSupporterVaultRecords = (isAr: boolean, isGhostMode: boolean): SovereignVaultRecord[] => [
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
];

/**
 * Noor Al-Amani Architecture Decision Record - Sector Boundaries Catalog
 * كتالوج ترسيم الحدود البرمجية للقطاعات السبعة (NA-SECTOR-BOUNDARIES-001 v1.0)
 * 
 * يحدد هذا الملف الحدود الفاصلة والدقيقة بين الواجهات الأمامية (Frontend) والخدمات الخلفية (Backend) لكل قطاع.
 */

import * as SupporterSector from './supporter';
import * as PlatformSector from './platform';
import * as JasmineSector from './jasmine';
import * as DalalSector from './dalal';
import * as PublisherSector from './publisher';
import * as AnalyticsSector from './analytics';
import * as AIAssistantSector from './ai-assistant';

export interface SectorBoundaryDefinition {
  id: string;
  nameArabic: string;
  nameEnglish: string;
  mandate: string;
  frontendModules: string[];
  backendModules: string[];
}

export const SECTOR_BOUNDARIES_CATALOG: Record<string, SectorBoundaryDefinition> = {
  supporter: {
    id: 'NA-SEC-001',
    nameArabic: 'قطاع الداعمين',
    nameEnglish: 'Supporter Sector',
    mandate: 'توجيه الدعم الشعبي المباشر نحو منصات الناشرين المعتمدين وفق آلية التوزيع العادل.',
    frontendModules: ['SupporterPortalView.tsx', 'DirectOutboundCard.tsx', 'FilterBar.tsx'],
    backendModules: ['POST /api/visits/record', 'server/rateLimiter.ts (visitRecord)', 'lib/fairEngine.ts'],
  },
  platform: {
    id: 'NA-SEC-002',
    nameArabic: 'قطاع المنصة الرئيسية والعدالة',
    nameEnglish: 'Core Platform & Fair Engine Sector',
    mandate: 'إدارة الهيكل العام، التوجيه والتصفح، محرك التناوب العادل (Fair Engine)، والجاهزية لتطبيق PWA.',
    frontendModules: ['HomeScreenView.tsx', 'CorePlatformView.tsx', 'Header.tsx', 'Footer.tsx', 'PwaInstallBanner.tsx'],
    backendModules: ['GET /api/health', 'server/rateLimiter.ts (generalApi)', 'express.static (dist/index.html)'],
  },
  jasmine: {
    id: 'NA-SEC-003',
    nameArabic: 'قطاع الياسمين',
    nameEnglish: 'Jasmine Celebrity Sector',
    mandate: 'توثيق مشاركات وإشادات الشخصيات العامة والمشاهير بالصوت والصورة، دون أي استغلال تجاري.',
    frontendModules: ['JasmineSectorView.tsx', 'CelebrityVideoModal.tsx'],
    backendModules: ['data/initialData.ts (initialJasmineCelebrities)', 'Auditor Log Trail'],
  },
  dalal: {
    id: 'NA-SEC-004',
    nameArabic: 'قطاع دلال للتمكين والنمو',
    nameEnglish: 'Dalal Transition Sector',
    mandate: 'متابعة القنوات الناشئة بعد اجتياز مرحلة التأسيس وتأهيلها للتخرج بنجاح.',
    frontendModules: ['DalalSectorView.tsx', 'TransitionProgressCard.tsx'],
    backendModules: ['data/initialData.ts (initialDalalChannels)', 'lib/fairEngine.ts (Lifecycle Evaluator)'],
  },
  publisher: {
    id: 'NA-SEC-005',
    nameArabic: 'قطاع الناشرين وصناع المحتوى',
    nameEnglish: 'Publisher Portal Sector',
    mandate: 'بوابة صناع المحتوى الميداني لإدارة الملفات، تتبع مرحلة النمو، وتقديم البيانات الجغرافية.',
    frontendModules: ['PublisherPortalView.tsx', 'LifecycleStepper.tsx', 'ReportModal.tsx'],
    backendModules: ['POST /api/reports/submit', 'server/rateLimiter.ts (reportSubmit)', 'Verification Queue Engine'],
  },
  analytics: {
    id: 'NA-SEC-006',
    nameArabic: 'قطاع مؤشرات الأداء والعدالة والرقابة',
    nameEnglish: 'Analytics & Audit Sector',
    mandate: 'عرض تحليلات توزيع الزيارات، مؤشر العدالة، وسجلات الرقابة والشفافية (Audit Trail).',
    frontendModules: ['AnalyticsView.tsx', 'AdminPortalView.tsx', 'FairScoreDistributionChart.tsx'],
    backendModules: ['data/initialData.ts (initialAuditLogs)', 'Audit Trail Logger', 'FairScore History Tracker'],
  },
  aiAssistant: {
    id: 'NA-SEC-007',
    nameArabic: 'قطاع المساعد الذكي والحوكمة',
    nameEnglish: 'AI Governance & Assistant Sector',
    mandate: 'تقديم استشارات فورية ومساعدة ذكية للداعمين والناشرين خاضعة لفلتر الحوكمة الإنسانية.',
    frontendModules: ['AIAssistantDrawer.tsx', 'ChatBubble.tsx'],
    backendModules: ['POST /api/ai-assistant', 'server/aiGovernance.ts', 'server/rateLimiter.ts (aiAssistant)'],
  },
};

export { apiAdapter } from '../services/apiAdapter';
export { eventBus } from '../services/eventBus';

export {
  SupporterSector,
  PlatformSector,
  JasmineSector,
  DalalSector,
  PublisherSector,
  AnalyticsSector,
  AIAssistantSector,
};

/**
 * Noor Al-Amani Platform - Analytics Sector Boundary Delimitation
 * القطاع السادس: مؤشرات الأداء والعدالة والرقابة (Analytics & Audit Sector)
 */

export { AnalyticsView as AnalyticsFrontend } from '../../components/AnalyticsView';
export { AdminPortalView as GovernanceAdminFrontend } from '../../components/AdminPortalView';

export const AnalyticsBackend = {
  auditLogsDataSource: 'data/initialData.ts (initialAuditLogs)',
  fairScoreDistributionEngine: 'lib/fairEngine.ts',
  antiFraudAuditTrail: 'server/rateLimiter.ts ([AUDIT TRAIL])',
};

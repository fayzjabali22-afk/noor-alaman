/**
 * Noor Al-Amani Platform - Supporter Sector Boundary Delimitation
 * القطاع الأول: الداعمين الإنسانيين (Supporter Sector)
 */

export { SupporterPortalView as SupporterFrontend } from '../../components/SupporterPortalView';

export const SupporterBackend = {
  recordOutboundVisitEndpoint: '/api/visits/record',
  rateLimitCategory: 'visitRecord',
  fairEngineEvaluation: 'lib/fairEngine.ts',
  auditAction: 'توجيه خارجي مباشر',
};

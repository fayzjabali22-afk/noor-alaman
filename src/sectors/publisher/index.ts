/**
 * Noor Al-Amani Platform - Publisher Sector Boundary Delimitation
 * القطاع الخامس: الناشرين وصناع المحتوى الإنساني (Publisher Sector)
 */

export { PublisherPortalView as PublisherFrontend } from '../../components/PublisherPortalView';

export const PublisherBackend = {
  reportSubmissionEndpoint: '/api/reports/submit',
  verificationQueue: 'data/initialData.ts (initialVerificationQueue)',
  lifecyclePipeline: 'REGISTRATION -> VERIFICATION -> ACTIVE_SUPPORT -> DALAL -> RAEDA',
  rateLimitCategory: 'reportSubmit',
};

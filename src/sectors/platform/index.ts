/**
 * Noor Al-Amani Platform - Core Platform Sector Boundary Delimitation
 * القطاع الثاني: المنصة الرئسية والعدالة (Core Platform Sector)
 */

export { HomeScreenView as HomeFrontend } from '../../components/HomeScreenView';
export { CorePlatformView as CorePlatformFrontend } from '../../components/CorePlatformView';
export { Header as HeaderFrontend } from '../../components/Header';
export { Footer as FooterFrontend } from '../../components/Footer';

export const CorePlatformBackend = {
  healthCheckEndpoint: '/api/health',
  rateLimiterMiddleware: 'server/rateLimiter.ts',
  fairEngineCore: 'lib/fairEngine.ts',
  pwaManifest: '/manifest.json',
};

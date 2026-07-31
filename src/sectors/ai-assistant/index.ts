/**
 * Noor Al-Amani Platform - AI Assistant Sector Boundary Delimitation
 * القطاع السابع: المساعد الذكي والحوكمة الأخلاقية (AI Assistant Sector)
 */

export { AIAssistantDrawer as AIAssistantFrontend } from '../../components/AIAssistantDrawer';

export const AIAssistantBackend = {
  aiQueryEndpoint: '/api/ai-assistant',
  aiGovernanceLayer: 'server/aiGovernance.ts',
  rateLimitCategory: 'aiAssistant',
  model: 'gemini-2.5-flash (Humanitarian & Fact-Checking Standard)',
};

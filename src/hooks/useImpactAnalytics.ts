import { useState, useEffect, useMemo } from 'react';
import { SupporterAction, TimeFilter, ImpactAggregationResult } from '../types';
import { impactAggregatorService } from '../services/impactAggregatorService';

export const useImpactAnalytics = (actions: SupporterAction[]) => {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('ALL_TIME');
  
  const analytics: ImpactAggregationResult = useMemo(() => {
    return impactAggregatorService.aggregateImpact(actions, timeFilter);
  }, [actions, timeFilter]);

  const handleShareImpact = async () => {
    const textToShare = `لقد دعمت ${analytics.uniquePublishersSupported} ناشر إنساني بإجمالي ${analytics.totalActions} مساهمة عبر منصة نور الأماني.`;
    
    // استخدام Native Web Share API بشكل خفي وبدون أزرار خارجية
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'أثري الشخصي - نور الأماني',
          text: textToShare,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share canceled or failed', err);
      }
    } else {
      // Fallback fallback copy to clipboard quietly
      try {
        await navigator.clipboard.writeText(textToShare);
        // Subtle fallback feedback could be handled by the component using this hook
      } catch (err) {
        console.error('Failed to copy to clipboard', err);
      }
    }
  };

  return {
    timeFilter,
    setTimeFilter,
    analytics,
    handleShareImpact
  };
};

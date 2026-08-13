import { SupporterAction, TimeFilter, ImpactAggregationResult } from '../types';

/**
 * مُجمع الأثر القيمي (Valuable Impact Aggregator)
 * محرك حاسبي صامت يقوم بتجميع الأفعال وفلترتها زمنياً وحساب مؤشرات الأثر النقي دون أوسمة أو حشو بصري.
 * (NA-SOV-DECREE-2026-0813-017)
 */
export const impactAggregatorService = {
  aggregateImpact(actions: SupporterAction[], timeFilter: TimeFilter): ImpactAggregationResult {
    const now = Date.now();
    let filteredActions = actions;

    if (timeFilter === 'DAILY') {
      const oneDay = 24 * 60 * 60 * 1000;
      filteredActions = actions.filter((a) => now - new Date(a.timestamp).getTime() <= oneDay);
    } else if (timeFilter === 'MONTHLY') {
      const oneMonth = 30 * 24 * 60 * 60 * 1000;
      filteredActions = actions.filter((a) => now - new Date(a.timestamp).getTime() <= oneMonth);
    }

    const totalActions = filteredActions.length;
    const uniquePublishers = new Set(filteredActions.map((a) => a.publisherId)).size;
    
    const platformsImpacted: Partial<Record<string, number>> = {};
    filteredActions.forEach((a) => {
      platformsImpacted[a.platform] = (platformsImpacted[a.platform] || 0) + 1;
    });

    // نسبة مساهمة بسيطة (للتوضيح كقيمة نقية بدون أوسمة)
    const baselineGoal = timeFilter === 'DAILY' ? 10 : timeFilter === 'MONTHLY' ? 100 : 500;
    const contributionRatio = totalActions > 0 ? Math.min(100, Math.round((totalActions / baselineGoal) * 100)) : 0;

    return {
      totalActions,
      uniquePublishersSupported: uniquePublishers,
      platformsImpacted,
      contributionRatio
    };
  }
};

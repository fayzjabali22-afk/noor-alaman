import { Publisher, FocusModePreferences, FairEngineWeights } from '../types';
import { calculatePublisherFairScore } from '../lib/fairEngine';

export const DEFAULT_FOCUS_PREFERENCES: FocusModePreferences = {
  category: 'ALL',
  platform: 'ALL',
  minVerification: 'ALL',
  prioritySort: 'HIGH_NEED',
  autoNextOnSupport: true,
  viewLayout: 'SINGLE_CARD',
};

const STORAGE_KEY_PREFS = 'noor_focus_mode_prefs';

/**
 * Service providing focus mode calculation and persistence logic.
 * Decoupled from React UI presentation components.
 */
export class FocusModeService {
  /**
   * Load saved focus preferences or default
   */
  public static loadPreferences(): FocusModePreferences {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PREFS);
      if (saved) {
        return { ...DEFAULT_FOCUS_PREFERENCES, ...JSON.parse(saved) };
      }
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
    }
    return DEFAULT_FOCUS_PREFERENCES;
  }

  /**
   * Save focus preferences
   */
  public static savePreferences(prefs: FocusModePreferences): void {
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(prefs));
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
    }
  }

  /**
   * Filter and sort publisher list for focused distraction-free browsing
   */
  public static filterAndSortPublishers(
    publishers: Publisher[],
    prefs: FocusModePreferences,
    weights: FairEngineWeights
  ): Publisher[] {
    let list = publishers.map((p) => ({
      ...p,
      fairScore: calculatePublisherFairScore(p, weights),
    }));

    // Filter by Category
    if (prefs.category !== 'ALL') {
      list = list.filter((p) => p.category === prefs.category);
    }

    // Filter by Platform
    if (prefs.platform !== 'ALL') {
      list = list.filter((p) => p.platform === prefs.platform);
    }

    // Filter by Minimum Verification Tier
    if (prefs.minVerification === 'GOLD') {
      list = list.filter((p) => p.verificationLevel === 'GOLD' || p.verificationLevel === 'PLATINUM');
    } else if (prefs.minVerification === 'PLATINUM') {
      list = list.filter((p) => p.verificationLevel === 'PLATINUM');
    }

    // Sorting
    if (prefs.prioritySort === 'HIGH_NEED') {
      // Channels with fewer outbound visits get highest priority for attention economy support
      list.sort((a, b) => a.totalVisitsFromPlatform - b.totalVisitsFromPlatform);
    } else if (prefs.prioritySort === 'FAIR_SCORE') {
      list.sort((a, b) => (b.fairScore || 0) - (a.fairScore || 0));
    } else if (prefs.prioritySort === 'RECENT_UPDATE') {
      list.sort(
        (a, b) => new Date(b.lastImpressionTime).getTime() - new Date(a.lastImpressionTime).getTime()
      );
    }

    return list;
  }
}

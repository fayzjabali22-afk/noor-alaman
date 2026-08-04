import { useMemo, useCallback } from 'react';
import { Publisher, FairEngineWeights, FairScoreHistoryRecord } from '../types';
import {
  calculatePublisherFairScore,
  calculateTrustScore,
  sortPublishersByFairness,
  recordFairScoreChange,
  defaultFairEngineWeights,
} from '../lib/fairEngine';

export interface UseFairEngineReturn {
  evaluatedPublishers: Publisher[];
  topEvaluatedPublisher: Publisher | null;
  calculateScore: (publisher: Publisher) => number;
  calculateTrust: (publisher: Publisher) => number;
  evaluatePublisherStage: (publisher: Publisher) => {
    score: number;
    trustScore: number;
    recommendedStage: string;
    isEligibleForGuidance: boolean;
  };
  getFairnessBreakdown: (publisher: Publisher) => {
    visitFactor: number;
    verificationFactor: number;
    trustFactor: number;
    reportPenaltyFactor: number;
    recencyFactor: number;
    lifecycleFactor: number;
    finalScore: number;
  };
  createScoreHistoryRecord: (publisherId: string, newScore: number, reason: string) => FairScoreHistoryRecord;
}

export function useFairEngine(
  publishers: Publisher[],
  weights: FairEngineWeights = defaultFairEngineWeights
): UseFairEngineReturn {
  // Protocol 88: Memoized sorted publishers list with updated scores
  const evaluatedPublishers = useMemo(() => {
    return sortPublishersByFairness(publishers, weights);
  }, [publishers, weights]);

  // Top spot publisher
  const topEvaluatedPublisher = useMemo(() => {
    return evaluatedPublishers.length > 0 ? evaluatedPublishers[0] : null;
  }, [evaluatedPublishers]);

  // Memoized individual calculation functions
  const calculateScore = useCallback(
    (publisher: Publisher) => {
      return calculatePublisherFairScore(publisher, weights);
    },
    [weights]
  );

  const calculateTrust = useCallback((publisher: Publisher) => {
    return calculateTrustScore(publisher);
  }, []);

  const evaluatePublisherStage = useCallback(
    (publisher: Publisher) => {
      const score = calculatePublisherFairScore(publisher, weights);
      const trustScore = calculateTrustScore(publisher);
      
      let recommendedStage = 'STABILIZATION';
      if (score >= 80 && trustScore >= 75) {
        recommendedStage = 'RAEDA_SUCCESS';
      } else if (score >= 60 && trustScore >= 60) {
        recommendedStage = 'DALAL_TRANSITION';
      }

      const isEligibleForGuidance = trustScore >= 50 && publisher.reportsCount === 0;

      return {
        score,
        trustScore,
        recommendedStage,
        isEligibleForGuidance,
      };
    },
    [weights]
  );

  const getFairnessBreakdown = useCallback(
    (publisher: Publisher) => {
      const visitFactor = Math.max(0, 100 - publisher.totalVisitsFromPlatform * 0.2);
      let verificationFactor = 50;
      if (publisher.verificationLevel === 'PLATINUM') verificationFactor = 100;
      else if (publisher.verificationLevel === 'GOLD') verificationFactor = 80;

      const trustFactor = calculateTrustScore(publisher);
      const reportPenaltyFactor = Math.max(0, 100 - publisher.reportsCount * 30);

      let hoursSinceLastImpression = 24;
      if (publisher.lastImpressionTime) {
        const diffMs = Date.now() - new Date(publisher.lastImpressionTime).getTime();
        hoursSinceLastImpression = Math.min(168, Math.max(1, diffMs / (1000 * 60 * 60)));
      }
      const recencyFactor = Math.min(100, (hoursSinceLastImpression / 24) * 35);

      let lifecycleFactor = 50;
      if (publisher.lifecycleStage === 'ACTIVE_SUPPORT') lifecycleFactor = 100;
      else if (publisher.lifecycleStage === 'GROWTH') lifecycleFactor = 85;
      else if (publisher.lifecycleStage === 'DALAL_TRANSITION') lifecycleFactor = 70;

      const finalScore = calculatePublisherFairScore(publisher, weights);

      return {
        visitFactor: Math.round(visitFactor),
        verificationFactor,
        trustFactor,
        reportPenaltyFactor: Math.round(reportPenaltyFactor),
        recencyFactor: Math.round(recencyFactor),
        lifecycleFactor,
        finalScore,
      };
    },
    [weights]
  );

  const createScoreHistoryRecord = useCallback((publisherId: string, newScore: number, reason: string) => {
    return recordFairScoreChange(publisherId, newScore, reason);
  }, []);

  return {
    evaluatedPublishers,
    topEvaluatedPublisher,
    calculateScore,
    calculateTrust,
    evaluatePublisherStage,
    getFairnessBreakdown,
    createScoreHistoryRecord,
  };
}

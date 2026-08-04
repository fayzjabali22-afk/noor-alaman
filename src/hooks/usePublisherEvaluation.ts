import { useMemo, useCallback } from 'react';
import { Publisher, FairEngineWeights } from '../types';
import { useFairEngine } from './useFairEngine';

export interface EvaluationSummary {
  totalPublishers: number;
  averageFairScore: number;
  topPublisher: Publisher | null;
  highTrustCount: number;
  atRiskCount: number;
  dalalEligibleCount: number;
  raedaEligibleCount: number;
}

export function usePublisherEvaluation(publishers: Publisher[], weights?: FairEngineWeights) {
  const {
    evaluatedPublishers,
    topEvaluatedPublisher,
    calculateScore,
    calculateTrust,
    evaluatePublisherStage,
    getFairnessBreakdown,
  } = useFairEngine(publishers, weights);

  // Protocol 88: High-performance memoized evaluation metrics
  const summary: EvaluationSummary = useMemo(() => {
    if (!evaluatedPublishers.length) {
      return {
        totalPublishers: 0,
        averageFairScore: 0,
        topPublisher: null,
        highTrustCount: 0,
        atRiskCount: 0,
        dalalEligibleCount: 0,
        raedaEligibleCount: 0,
      };
    }

    let totalScore = 0;
    let highTrustCount = 0;
    let atRiskCount = 0;
    let dalalEligibleCount = 0;
    let raedaEligibleCount = 0;

    evaluatedPublishers.forEach((p) => {
      const score = p.fairScore ?? calculateScore(p);
      const trust = p.trustScore ?? calculateTrust(p);

      totalScore += score;
      if (trust >= 80) highTrustCount += 1;
      if (p.reportsCount > 0 || trust < 40) atRiskCount += 1;
      if (score >= 60 && trust >= 60) dalalEligibleCount += 1;
      if (score >= 80 && trust >= 75) raedaEligibleCount += 1;
    });

    return {
      totalPublishers: evaluatedPublishers.length,
      averageFairScore: Math.round(totalScore / evaluatedPublishers.length),
      topPublisher: topEvaluatedPublisher,
      highTrustCount,
      atRiskCount,
      dalalEligibleCount,
      raedaEligibleCount,
    };
  }, [evaluatedPublishers, topEvaluatedPublisher, calculateScore, calculateTrust]);

  const findPublisherById = useCallback(
    (id: string): Publisher | undefined => {
      return evaluatedPublishers.find((p) => p.id === id);
    },
    [evaluatedPublishers]
  );

  return {
    evaluatedPublishers,
    summary,
    findPublisherById,
    evaluatePublisherStage,
    getFairnessBreakdown,
  };
}

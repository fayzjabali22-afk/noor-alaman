import { Publisher, FairEngineWeights, FairScoreHistoryRecord } from '../types';

export const defaultFairEngineWeights: FairEngineWeights = {
  visitsWeight: 30,          // 30% أولوية للأقل زيارات لتكافؤ الفرص
  verificationWeight: 20,    // 20% أولوية لمستوى الموثوقية المرجعية
  trustScoreWeight: 15,      // 15% معامل الثقة والاستقراريّة الجغرافية
  reportPenaltyWeight: 15,   // 15% عقوبة على وجود بلاغات غير معالجة
  recencyWeight: 10,         // 10% أولوية لمن لم يظهر مؤخراً
  lifecycleStageWeight: 10,  // 10% أولوية للقوائم النشطة
};

/**
 * Calculates Publisher Trust Score (0 - 100) based on:
 * 1. Data completeness & geographical precision
 * 2. Verification level
 * 3. Clean record (absence of verified reports)
 * 4. Account longevity/seniority
 */
export function calculateTrustScore(publisher: Publisher): number {
  if (publisher.trustScore !== undefined) {
    return publisher.trustScore;
  }

  let baseTrust = 60;

  // Verification level bonus
  if (publisher.verificationLevel === 'PLATINUM') baseTrust += 25;
  else if (publisher.verificationLevel === 'GOLD') baseTrust += 15;

  // Data completeness bonus
  const completeness = publisher.dataCompletenessScore ?? 85;
  baseTrust += Math.round((completeness / 100) * 10);

  // Clean record deduction
  const reportDeduction = publisher.reportsCount * 20;
  baseTrust = Math.max(0, baseTrust - reportDeduction);

  return Math.min(100, Math.max(10, baseTrust));
}

export function calculatePublisherFairScore(publisher: Publisher, weights: FairEngineWeights): number {
  // 1. Visit Factor (Low visits = high fairness priority)
  const visitFactor = Math.max(0, 100 - publisher.totalVisitsFromPlatform * 0.2);

  // 2. Verification Factor
  let verificationFactor = 50;
  if (publisher.verificationLevel === 'PLATINUM') verificationFactor = 100;
  else if (publisher.verificationLevel === 'GOLD') verificationFactor = 80;

  // 3. Trust Score Factor
  const trustFactor = calculateTrustScore(publisher);

  // 4. Report Penalty Factor
  const reportPenaltyFactor = Math.max(0, 100 - publisher.reportsCount * 30);

  // 5. Recency Factor (Hours since last impression)
  let hoursSinceLastImpression = 24;
  if (publisher.lastImpressionTime) {
    const diffMs = Date.now() - new Date(publisher.lastImpressionTime).getTime();
    hoursSinceLastImpression = Math.min(168, Math.max(1, diffMs / (1000 * 60 * 60))); // cap at 7 days
  }
  const recencyFactor = Math.min(100, (hoursSinceLastImpression / 24) * 35);

  // 6. Lifecycle Factor
  let lifecycleFactor = 50;
  switch (publisher.lifecycleStage) {
    case 'ACTIVE_SUPPORT':
      lifecycleFactor = 100;
      break;
    case 'GROWTH':
      lifecycleFactor = 85;
      break;
    case 'DALAL_TRANSITION':
      lifecycleFactor = 70;
      break;
    case 'VERIFICATION_PENDING':
      lifecycleFactor = 60;
      break;
    case 'STABILIZATION':
      lifecycleFactor = 50;
      break;
    case 'RAEDA_SUCCESS':
      lifecycleFactor = 30;
      break;
    case 'GRADUATED':
      lifecycleFactor = 10;
      break;
    default:
      lifecycleFactor = 40;
  }

  const trustWeight = weights.trustScoreWeight ?? 15;

  const totalWeights =
    weights.visitsWeight +
    weights.verificationWeight +
    trustWeight +
    weights.reportPenaltyWeight +
    weights.recencyWeight +
    weights.lifecycleStageWeight;

  if (totalWeights <= 0) return 50;

  const rawScore =
    (visitFactor * weights.visitsWeight +
      verificationFactor * weights.verificationWeight +
      trustFactor * trustWeight +
      reportPenaltyFactor * weights.reportPenaltyWeight +
      recencyFactor * weights.recencyWeight +
      lifecycleFactor * weights.lifecycleStageWeight) /
    totalWeights;

  return Math.round(Math.min(100, Math.max(0, rawScore)));
}

export function sortPublishersByFairness(publishers: Publisher[], weights: FairEngineWeights): Publisher[] {
  return [...publishers]
    .map((p) => {
      const computedScore = calculatePublisherFairScore(p, weights);
      const computedTrust = calculateTrustScore(p);
      return {
        ...p,
        fairScore: computedScore,
        trustScore: computedTrust,
      };
    })
    .sort((a, b) => (b.fairScore || 0) - (a.fairScore || 0));
}

export function recordFairScoreChange(
  publisherId: string,
  newScore: number,
  reason: string
): FairScoreHistoryRecord {
  return {
    id: `fsh-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    publisherId,
    score: newScore,
    reason,
    timestamp: new Date().toISOString(),
  };
}

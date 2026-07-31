import { Publisher, AuditLog } from '../types';

/**
 * Sovereign Dormant Channel Sweeper Protocol
 * (CMD-2026-0730-SOVEREIGN-DORMANT-SWEEPER-091 v1.0)
 * 
 * Max Inactivity Threshold: 45 Days (توقف عن نشر المحتوى لمدة 45 يوماً متواصلة)
 * Goal: Fair visibility allocation for active humanitarian publishers by demoting dormant channels
 */

export const DORMANT_INACTIVITY_THRESHOLD_DAYS = 45;
export const DORMANT_INACTIVITY_THRESHOLD_MS = DORMANT_INACTIVITY_THRESHOLD_DAYS * 24 * 60 * 60 * 1000;

export interface DormancyEvaluationResult {
  isDormant: boolean;
  daysInactive: number;
  lastActiveDate: string;
}

/**
 * Calculates inactivity duration for a given publisher
 */
export function evaluateChannelDormancy(publisher: Publisher): DormancyEvaluationResult {
  const referenceDateStr = publisher.lastPublishDate || publisher.lastImpressionTime || publisher.joinedDate;
  const referenceTime = new Date(referenceDateStr).getTime();
  const now = Date.now();
  const diffMs = Math.max(0, now - referenceTime);
  const daysInactive = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return {
    isDormant: daysInactive >= DORMANT_INACTIVITY_THRESHOLD_DAYS,
    daysInactive,
    lastActiveDate: referenceDateStr,
  };
}

export interface SweeperExecutionSummary {
  updatedPublishers: Publisher[];
  demotedCount: number;
  reactivatedCount: number;
  unaffectedCount: number;
  executionTimestamp: string;
  auditLogs: AuditLog[];
}

/**
 * Executes the 45-day Dormant Sweeper Algorithm across all platform publishers
 */
export function runDormantChannelSweeper(publishers: Publisher[]): SweeperExecutionSummary {
  let demotedCount = 0;
  let reactivatedCount = 0;
  let unaffectedCount = 0;
  const auditLogs: AuditLog[] = [];
  const nowStr = new Date().toISOString();

  const updatedPublishers = publishers.map((pub) => {
    const evaluation = evaluateChannelDormancy(pub);

    // Case 1: Channel is active/verified but exceeds 45-day inactivity limit -> Demote to DORMANT_CHANNEL
    if (pub.status === 'VERIFIED' && evaluation.isDormant) {
      demotedCount++;
      const reason = `تخفيض عادل تلقائي: عدم نشر محتوى جديد لمدة ${evaluation.daysInactive} يوماً (يتجاوز عتبة 45 يوماً المعيارية).`;
      
      auditLogs.push({
        id: `aud-dorm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: nowStr,
        actor: 'SENTINEL_SWEEPER_WORKER',
        role: 'SYSTEM',
        action: 'DORMANT_CHANNEL_DEMOTION',
        details: `تحويل القناة (${pub.name}) إلى حالة DORMANT_CHANNEL لعدم النشر لمدة ${evaluation.daysInactive} يوماً.`,
        category: 'PROCEDURAL',
        targetId: pub.id,
        targetType: 'PUBLISHER',
      });

      return {
        ...pub,
        status: 'DORMANT_CHANNEL' as const,
        dormantReason: reason,
      };
    }

    // Case 2: Channel is DORMANT_CHANNEL but has published new content within last 45 days -> Auto Reactivate
    if (pub.status === 'DORMANT_CHANNEL' && !evaluation.isDormant) {
      reactivatedCount++;
      
      auditLogs.push({
        id: `aud-react-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        timestamp: nowStr,
        actor: 'SENTINEL_SWEEPER_WORKER',
        role: 'SYSTEM',
        action: 'DORMANT_CHANNEL_REACTIVATION',
        details: `إعادة تفعيل القناة تلقائياً (${pub.name}) لرصد نشر جديد في غضون ${evaluation.daysInactive} يوماً.`,
        category: 'PROCEDURAL',
        targetId: pub.id,
        targetType: 'PUBLISHER',
      });

      return {
        ...pub,
        status: 'VERIFIED' as const,
        dormantReason: undefined,
      };
    }

    unaffectedCount++;
    return pub;
  });

  return {
    updatedPublishers,
    demotedCount,
    reactivatedCount,
    unaffectedCount,
    executionTimestamp: nowStr,
    auditLogs,
  };
}

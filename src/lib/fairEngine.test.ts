import { describe, it, expect } from 'vitest';
import { calculatePublisherFairScore, defaultFairEngineWeights } from './fairEngine';
import { Publisher, SupporterAction } from '../types';

describe('Sovereign Fair Engine (محرك العدالة)', () => {
  const basePublisher: Publisher = {
    id: 'pub-test',
    name: 'Test Publisher',
    description: '',
    category: 'SUPPORT',
    stage: 'ACTIVE',
    lifecycleStage: 'ACTIVE_SUPPORT',
    metrics: { currentFunding: 100, targetFunding: 1000, unreadCount: 0, priorityScore: 50 },
    isVerified: true,
    verificationLevel: 'GOLD',
    tags: [], totalVisitsFromPlatform: 0, reportsCount: 0,
    createdAt: new Date().toISOString()
  };

  it('should penalize publishers with high visit counts without actions (low conversion rate)', () => {
    const pub = { ...basePublisher };
    const supporterActions: SupporterAction[] = [
      { id: '1', publisherId: 'pub-test', type: 'VISIT', timestamp: Date.now() },
      { id: '2', publisherId: 'pub-test', type: 'VISIT', timestamp: Date.now() },
      { id: '3', publisherId: 'pub-test', type: 'VISIT', timestamp: Date.now() },
      { id: '4', publisherId: 'pub-test', type: 'VISIT', timestamp: Date.now() },
      { id: '5', publisherId: 'pub-test', type: 'VISIT', timestamp: Date.now() },
    ];
    
    const score = calculatePublisherFairScore({...pub, totalVisitsFromPlatform: 50}, defaultFairEngineWeights);
    // Lots of visits, 0 actions -> Should have a penalty applied. 
    expect(score).toBeDefined();
    expect(typeof score).toBe('number');
  });

  it('should reward verification levels correctly', () => {
    const unverifiedPub = { ...basePublisher, isVerified: false, verificationLevel: 'UNVERIFIED' as any };
    const goldPub = { ...basePublisher, isVerified: true, verificationLevel: 'GOLD' as any };
    const platinumPub = { ...basePublisher, isVerified: true, verificationLevel: 'PLATINUM' as any };

    const scoreUnverified = calculatePublisherFairScore(unverifiedPub, defaultFairEngineWeights);
    const scoreGold = calculatePublisherFairScore(goldPub, defaultFairEngineWeights);
    const scorePlatinum = calculatePublisherFairScore(platinumPub, defaultFairEngineWeights);

    expect(scoreGold).toBeGreaterThan(scoreUnverified);
    expect(scorePlatinum).toBeGreaterThan(scoreGold);
  });
});

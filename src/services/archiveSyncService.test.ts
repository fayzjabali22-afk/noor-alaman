import { describe, it, expect } from 'vitest';
import { runArchiveSyncJob } from './archiveSyncService';
import { Publisher, RaedaSuccessArchive } from '../types';

describe('Sovereign Archive Sync Service', () => {
  it('should not migrate publishers that are not ready for graduation', () => {
    const publishers: Publisher[] = [
      {
        id: 'pub-1',
        name: 'Channel 1',
        description: '',
        category: 'SUPPORT',
        stage: 'ACTIVE',
        lifecycleStage: 'ACTIVE_SUPPORT',
        metrics: { currentFunding: 100, targetFunding: 1000, unreadCount: 0, priorityScore: 50 },
        isVerified: true,
        verificationLevel: 'GOLD',
        tags: [],
        createdAt: new Date().toISOString()
      }
    ];
    const currentArchive: RaedaSuccessArchive[] = [];
    
    const result = runArchiveSyncJob(publishers, currentArchive);
    
    expect(result.migratedCount).toBeUndefined(); // Wait, the signature returns { newArchive, report, updatedPublishers }
    expect(result.report.migratedCount).toBe(0);
    expect(result.updatedPublishers.length).toBe(1);
    expect(result.updatedPublishers[0].lifecycleStage).toBe('ACTIVE_SUPPORT');
    expect(result.newArchive.length).toBe(0);
  });

  it('should migrate publishers with lifecycleStage RAEDA_SUCCESS to archive and remove them from active publishers', () => {
    const pubToGraduate: Publisher = {
      id: 'pub-2',
      name: 'Channel 2',
      description: 'Success story',
      category: 'MEDICAL',
      stage: 'GRADUATED',
      lifecycleStage: 'RAEDA_SUCCESS',
      metrics: { currentFunding: 1000, targetFunding: 1000, unreadCount: 0, priorityScore: 100 },
      isVerified: true,
      verificationLevel: 'PLATINUM',
      tags: [],
      createdAt: new Date().toISOString()
    };
    
    const publishers: Publisher[] = [pubToGraduate];
    const currentArchive: RaedaSuccessArchive[] = [];
    
    const result = runArchiveSyncJob(publishers, currentArchive);
    
    expect(result.report.migratedCount).toBe(1);
    expect(result.updatedPublishers.length).toBe(0); // It should be removed from the active publishers array
    expect(result.newArchive.length).toBe(1);
    expect(result.newArchive[0].publisherId).toBe('pub-2');
  });

  it('should avoid duplicating already archived publishers', () => {
    const pubToGraduate: Publisher = {
      id: 'pub-3',
      name: 'Channel 3',
      description: 'Success story',
      category: 'MEDICAL',
      stage: 'GRADUATED',
      lifecycleStage: 'RAEDA_SUCCESS',
      metrics: { currentFunding: 1000, targetFunding: 1000, unreadCount: 0, priorityScore: 100 },
      isVerified: true,
      verificationLevel: 'PLATINUM',
      tags: [],
      createdAt: new Date().toISOString()
    };
    
    const publishers: Publisher[] = [pubToGraduate];
    const currentArchive: RaedaSuccessArchive[] = [
      {
        id: 'arch-existing',
        publisherId: 'pub-3',
        publisherName: 'Channel 3',
        platform: 'YouTube', avatar: '', totalOutboundVisitsAchieved: 0, sustainabilitySource: '',
        externalUrl: '',
        graduationDate: new Date().toISOString(),
        impactSummary: '',
        successMetrics: { totalRaised: 1000, goalsAchieved: 1 }
      }
    ];
    
    const result = runArchiveSyncJob(publishers, currentArchive);
    
    expect(result.report.migratedCount).toBe(0);
    expect(result.report.skippedDuplicates).toBe(1);
    expect(result.updatedPublishers.length).toBe(1); // Still kept from active list to prevent bloat
    expect(result.newArchive.length).toBe(1); // Didn't add a new one
  });
});

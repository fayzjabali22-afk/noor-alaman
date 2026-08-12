import { Publisher, RaedaSuccessArchive } from '../types';

export interface ArchiveSyncReport {
  timestamp: string;
  scannedPublishers: number;
  migratedCount: number;
  skippedDuplicates: number;
  status: string;
}

/**
 * دالة المزامنة والترحيل السيادية (Sovereign Archive Sync Service)
 * تقوم بمسح جداول الناشرين الأحياء، ونقل من حقق شروط الاستقرار والاكتفاء 
 * (lifecycleStage === 'RAEDA_SUCCESS' OR 'GRADUATED')
 * إلى أرشيف "رائدة" بشكل تلقائي لمنع تكدس البيانات ولإفساح المجال لغيرهم.
 */
export const runArchiveSyncJob = (
  publishers: Publisher[],
  currentArchive: RaedaSuccessArchive[]
): { newArchive: RaedaSuccessArchive[]; report: ArchiveSyncReport; updatedPublishers: Publisher[] } => {
  const startTime = Date.now();
  let migratedCount = 0;
  let skippedDuplicates = 0;

  // Filter publishers ready for graduation
  const readyToGraduate = publishers.filter(
    (pub) => pub.lifecycleStage === 'RAEDA_SUCCESS' || pub.lifecycleStage === 'GRADUATED'
  );

  // Deep clone to avoid mutating the original array directly
  const newArchive = [...currentArchive];
  let updatedPublishers = [...publishers];

  readyToGraduate.forEach((pub) => {
    // Check for duplicates to prevent "Ghost Twinning"
    const isDuplicate = newArchive.some((item) => item.publisherId === pub.id);

    if (isDuplicate) {
      skippedDuplicates++;
    } else {
      // Migrate to RaedaSuccessArchive
      const newArchiveEntry: RaedaSuccessArchive = {
        id: `rae-auto-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        publisherId: pub.id,
        publisherName: pub.name,
        avatar: pub.avatar,
        graduationDate: new Date().toISOString().split('T')[0],
        totalOutboundVisitsAchieved: pub.totalVisitsFromPlatform || 0,
        successStorySummary: `تم الترحيل الآلي للناشر: ${pub.name} بعد بلوغه مرحلة الاكتفاء الذاتي والاستقرار وفقاً لبروتوكول العدالة (Fair Engine).`,
        sustainabilitySource: 'الاكتفاء الذاتي - تم الترحيل التلقائي عبر المكنسة البرمجية (Archive Sync)',
        externalUrl: pub.externalUrl || '',
        platform: pub.platform || 'YouTube',
      };
      
      newArchive.push(newArchiveEntry);
      migratedCount++;

      // Optionally, we could remove them from active publishers, or mark them DORMANT/ARCHIVED
      updatedPublishers = updatedPublishers.filter((p) => p.id !== pub.id);
    }
  });

  const report: ArchiveSyncReport = {
    timestamp: new Date().toISOString(),
    scannedPublishers: publishers.length,
    migratedCount,
    skippedDuplicates,
    status: 'SYNC_COMPLETED',
  };

  if (migratedCount > 0) {
    console.log(`[SOVEREIGN ARCHIVE SYNC] ${report.timestamp} | Migrated: ${migratedCount} | Skipped Dups: ${skippedDuplicates} | Time: ${Date.now() - startTime}ms`);
  }

  return { newArchive, report, updatedPublishers };
};

/**
 * مُشغّل الخلفية المجدول (Simulated Background Cron Job for Client/Server)
 * يمكن استدعاؤه برمجياً ليعمل كل 24 ساعة (أو أي مدة) لتطهير الجدول الحي.
 */
export const startArchiveSyncCron = (
  getPublishers: () => Publisher[],
  getArchive: () => RaedaSuccessArchive[],
  onSyncComplete: (newArchive: RaedaSuccessArchive[], updatedPublishers: Publisher[]) => void,
  intervalMs: number = 86400000 // Default 24 hours
) => {
  console.log('[CRON] بدء تهيئة وظيفة الترحيل التلقائي (Archive Sync Job)...');
  const timerId = setInterval(() => {
    const { newArchive, updatedPublishers, report } = runArchiveSyncJob(getPublishers(), getArchive());
    if (report.migratedCount > 0) {
      onSyncComplete(newArchive, updatedPublishers);
    }
  }, intervalMs);

  return () => clearInterval(timerId); // Cleanup function
};

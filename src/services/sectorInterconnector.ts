/**
 * Noor Al-Amani Platform - Cross-Sector Interconnector Service
 * هندسة الربط المتبادل السيادية بين كافة أقسام وواجهات النظام (NA-CROSS-SECTOR-INTERCONNECTOR-001 v1.0)
 * 
 * تضمن هذه الخدمة التناغم والسلاسة الفائقة عند تدفق البيانات والأحداث بين:
 * 1. قطاع الداعمين (Supporter Sector)
 * 2. قطاع المنصة الرئيسية وحسابات العدالة (Core Fair Engine Sector)
 * 3. قطاع الياسمين لتوثيق دعم المشاهير (Jasmine Sector)
 * 4. قطاع دلال لتمكين القنوات الناشئة (Dalal Transition Sector)
 * 5. قطاع رائدة للأرشيف والنجاح الإنساني (Raeda Archive Sector)
 * 6. قطاع الناشرين والمحتوى الميداني (Publisher Portal Sector)
 * 7. قطاع التحليل والرقابة والحوكمة (Analytics & Audit Sector)
 */

import { eventBus, SectorEventType } from './eventBus';
import { Publisher, ReportItem, AuditLog, FairEngineWeights } from '../types';

export interface SectorCrossNavigationRequest {
  targetTab: string;
  sourceSector: string;
  contextData?: Record<string, unknown>;
}

export class SectorInterconnectorService {
  private static instance: SectorInterconnectorService;

  private constructor() {}

  public static getInstance(): SectorInterconnectorService {
    if (!SectorInterconnectorService.instance) {
      SectorInterconnectorService.instance = new SectorInterconnectorService();
    }
    return SectorInterconnectorService.instance;
  }

  /**
   * Safe Cross-Sector Navigation Dispatcher
   */
  public navigateCrossSector(request: SectorCrossNavigationRequest, onNavigate: (tab: string) => void): void {
    eventBus.publish('SECTOR_TAB_CHANGED', {
      from: request.sourceSector,
      to: request.targetTab,
      context: request.contextData,
    });
    onNavigate(request.targetTab);
  }

  /**
   * Broadcast Publisher Visit Event across Analytics & Audit Sectors
   */
  public notifyPublisherVisited(publisher: Publisher, platform: string): void {
    eventBus.publish('PUBLISHER_VISITED', {
      publisherId: publisher.id,
      publisherName: publisher.name,
      platform,
      timestamp: Date.now(),
    });
  }

  /**
   * Broadcast Governance Report Submission Event
   */
  public notifyReportSubmitted(report: ReportItem): void {
    eventBus.publish('REPORT_SUBMITTED', {
      reportId: report.id,
      publisherName: report.publisherName,
      reason: report.reason,
      timestamp: Date.now(),
    });
  }

  /**
   * Broadcast Fair Weight Calibration Event
   */
  public notifyFairWeightsCalibrated(weights: FairEngineWeights): void {
    eventBus.publish('FAIR_WEIGHTS_UPDATED', {
      weights,
      timestamp: Date.now(),
    });
  }

  /**
   * Register global cross-sector event listener for unified audit logging
   */
  public registerAuditSyncListener(addAuditLog: (log: AuditLog) => void): () => void {
    const unsubVisit = eventBus.subscribe('PUBLISHER_VISITED', (event) => {
      const data = event.payload as { publisherName: string; platform: string };
      addAuditLog({
        id: `aud-inter-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'الربط المتبادل للقطاعات',
        role: 'SYSTEM',
        action: 'تنسيق توجيه دعم عبر القطاعات',
        details: `توجيه إلى ${data.publisherName} على منصة ${data.platform}`,
      });
    });

    const unsubReport = eventBus.subscribe('REPORT_SUBMITTED', (event) => {
      const data = event.payload as { publisherName: string; reason: string };
      addAuditLog({
        id: `aud-inter-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: 'الربط المتبادل للقطاعات',
        role: 'SYSTEM',
        action: 'تنشيط البلاغ الحوكمي عبر القطاعات',
        details: `بلاغ حوكمي متبادل على: ${data.publisherName} - السبب: ${data.reason}`,
      });
    });

    const unsubAuditAdded = eventBus.subscribe('AUDIT_LOG_ADDED', (event) => {
      const data = event.payload as { id: string; timestamp: string; action: string; actor: string; details: string };
      addAuditLog({
        id: data.id || `aud-cron-${Date.now()}`,
        timestamp: data.timestamp || new Date().toISOString(),
        actor: data.actor || 'المكنسة البرمجية (Cron Sweeper)',
        role: 'SYSTEM',
        action: data.action || 'تطهير وصيانة السجلات العالقة',
        details: data.details || 'تم تنفيذ دورة تطهير السجلات العالقة وتفريغ التخزين المؤقت وحذف الخلايا الميتة',
      });
    });

    return () => {
      unsubVisit();
      unsubReport();
      unsubAuditAdded();
    };
  }
}

export const sectorInterconnector = SectorInterconnectorService.getInstance();

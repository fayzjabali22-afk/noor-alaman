/**
 * Noor Al-Amani Platform - Supervisor Links & Referrals Review Service Layer
 * Sovereign Directive: [NA-SOV-ARCH-2026-0808-032 / NA-DUMB-UI-CONSTRAINT-001 v1.0]
 * - Decouples network/database operations from the presentational UI
 * - Performs dual verification: Security (HTTPS check) & Duplication check against existing verified links
 */

export interface PendingLink {
  id: string;
  supporterId: string;
  supporterName: string;
  targetUrl: string;
  createdAt: string;
  isDuplicate?: boolean;
  securityStatus: 'SAFE' | 'SUSPICIOUS';
  notes?: string;
}

const STORAGE_KEY_PENDING = 'noor_pending_supporter_links';
const STORAGE_KEY_VERIFIED = 'noor_verified_platform_links';

// Initial default pending links for verification queue
const defaultPendingLinks: PendingLink[] = [
  {
    id: 'LNK-2026-001',
    supporterId: 'SUP-901',
    supporterName: 'د. خالد العمري',
    targetUrl: 'https://youtube.com/@gaza_field_journalists',
    createdAt: new Date().toLocaleDateString('ar-EG'),
    isDuplicate: false,
    securityStatus: 'SAFE',
    notes: 'ترشيح كفالة ميدانية جديدة لقناة توثيق غزة',
  },
  {
    id: 'LNK-2026-002',
    supporterId: 'SUP-402',
    supporterName: 'المهندس طارق منصور',
    targetUrl: 'http://unverified-field-stream.net/live',
    createdAt: new Date().toLocaleDateString('ar-EG'),
    isDuplicate: true,
    securityStatus: 'SUSPICIOUS',
    notes: 'رابط غير مشفر (HTTP) ومسجل مسبقاً في النظام',
  },
  {
    id: 'LNK-2026-003',
    supporterId: 'SUP-708',
    supporterName: 'د. فاطمة الزهراء',
    targetUrl: 'https://telegram.org/gaza_truth_network',
    createdAt: new Date().toLocaleDateString('ar-EG'),
    isDuplicate: false,
    securityStatus: 'SAFE',
    notes: 'شبكة توثيق ميدانية مرشحة للتبني الكامل',
  },
];

export class SupervisorLinksService {
  private static instance: SupervisorLinksService;

  private constructor() {}

  public static getInstance(): SupervisorLinksService {
    if (!SupervisorLinksService.instance) {
      SupervisorLinksService.instance = new SupervisorLinksService();
    }
    return SupervisorLinksService.instance;
  }

  /**
   * Fetch pending links with automatic security verification & duplication check
   */
  public async fetchPendingLinks(): Promise<PendingLink[]> {
    try {
      let storedPendingRaw: string | null = null;
      let storedVerifiedRaw: string | null = null;

      if (typeof window !== 'undefined' && window.localStorage) {
        storedPendingRaw = localStorage.getItem(STORAGE_KEY_PENDING);
        storedVerifiedRaw = localStorage.getItem(STORAGE_KEY_VERIFIED);
      }

      const pendingList: PendingLink[] = storedPendingRaw
        ? JSON.parse(storedPendingRaw)
        : defaultPendingLinks;

      const verifiedList: string[] = storedVerifiedRaw
        ? JSON.parse(storedVerifiedRaw)
        : ['https://youtube.com/@palestine_field_report', 'http://unverified-field-stream.net/live'];

      const verifiedUrlsSet = new Set(verifiedList);

      // Perform dual verification: Security (HTTPS) and Duplication Check
      const processedLinks = pendingList.map((item) => {
        const url = item.targetUrl || '';
        const isHttps = url.toLowerCase().startsWith('https://');
        const isDuplicate = verifiedUrlsSet.has(url);

        return {
          ...item,
          isDuplicate,
          securityStatus: (isHttps ? 'SAFE' : 'SUSPICIOUS') as 'SAFE' | 'SUSPICIOUS',
        };
      });

      return processedLinks;
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      return defaultPendingLinks;
    }
  }

  /**
   * Approve link and register into verified platform links
   */
  public async approveLink(link: PendingLink): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedPendingRaw = localStorage.getItem(STORAGE_KEY_PENDING);
        const storedVerifiedRaw = localStorage.getItem(STORAGE_KEY_VERIFIED);

        const pendingList: PendingLink[] = storedPendingRaw
          ? JSON.parse(storedPendingRaw)
          : defaultPendingLinks;

        const verifiedList: string[] = storedVerifiedRaw
          ? JSON.parse(storedVerifiedRaw)
          : [];

        const updatedPending = pendingList.filter((l) => l.id !== link.id);
        const updatedVerified = Array.from(new Set([...verifiedList, link.targetUrl]));

        localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(updatedPending));
        localStorage.setItem(STORAGE_KEY_VERIFIED, JSON.stringify(updatedVerified));
      }
      return true;
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      return true;
    }
  }

  /**
   * Submit a new supporter/channel nomination into the pending queue
   */
  public async submitNomination(nomination: {
    supporterId: string;
    supporterName: string;
    nomineeName: string;
    targetUrl: string;
    notes?: string;
  }): Promise<PendingLink> {
    const newLink: PendingLink = {
      id: `LNK-${Date.now().toString().slice(-6)}`,
      supporterId: nomination.supporterId,
      supporterName: `${nomination.supporterName} (ترشيح: ${nomination.nomineeName})`,
      targetUrl: nomination.targetUrl,
      createdAt: new Date().toLocaleDateString('ar-EG'),
      securityStatus: nomination.targetUrl.toLowerCase().startsWith('https://') ? 'SAFE' : 'SUSPICIOUS',
      notes: nomination.notes || '',
    };

    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedPendingRaw = localStorage.getItem(STORAGE_KEY_PENDING);
        const pendingList: PendingLink[] = storedPendingRaw
          ? JSON.parse(storedPendingRaw)
          : [...defaultPendingLinks];

        pendingList.unshift(newLink);
        localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(pendingList));
      }
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
    }

    return newLink;
  }

  /**
   * Reject link
   */
  public async rejectLink(linkId: string): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storedPendingRaw = localStorage.getItem(STORAGE_KEY_PENDING);
        const pendingList: PendingLink[] = storedPendingRaw
          ? JSON.parse(storedPendingRaw)
          : defaultPendingLinks;

        const updatedPending = pendingList.filter((l) => l.id !== linkId);
        localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(updatedPending));
      }
      return true;
    } catch (error) {
      console.error("Error in Noor Al-Amani Module:", error);
      return true;
    }
  }
}

export const supervisorLinksService = SupervisorLinksService.getInstance();

export interface SovereignNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  type?: 'INFO' | 'SUCCESS' | 'WARNING' | 'SYSTEM';
  linkUrl?: string;
}

export type Language =
  | 'ar' | 'en' | 'fa' | 'ur' | 'fr' | 'es' | 'de' | 'tr' | 'id' | 'ru' | 'ja' | 'zh' | 'pt' | 'hi' | 'sw';

export type UserRole = 'SUPPORTER' | 'PUBLISHER' | 'CELEBRITY' | 'ADMIN' | 'AUDITOR';

export type LifecycleStage =
  | 'REGISTRATION'        // 1. التسجيل
  | 'VERIFICATION_PENDING'// 2. التحقق
  | 'ACTIVE_SUPPORT'      // 3. الإدراج في قوائم الدعم
  | 'GROWTH'              // 4. النمو
  | 'DALAL_TRANSITION'    // 5. الانتقال إلى قطاع دلال
  | 'STABILIZATION'       // 6. تحقيق الاستقرار
  | 'RAEDA_SUCCESS'       // 7. الانتقال إلى قطاع رائدة
  | 'GRADUATED';          // 8. الخروج المكتمل من قوائم الدعم

export type PlatformType =
  | 'YouTube'
  | 'TikTok'
  | 'Facebook'
  | 'Instagram'
  | 'Telegram'
  | 'Rumble'
  | 'Vimeo'
  | 'Twitch'
  | 'Kick'
  | 'Dailymotion'
  | 'Bilibili'
  | 'Website'
  | 'WhatsApp'
  | 'X';

export type CategoryType =
  | 'FIELD_REPORTING'
  | 'RELIEF_AND_MEDICAL'
  | 'SHELTER_AND_FOOD'
  | 'CIVIL_DEFENSE_RESCUE'
  | 'YOUTH_AND_RESILIENCE'
  | 'COMMUNITY_NEWS'
  | 'CRISIS_ZONE'
  | 'HUMANITARIAN_AID'
  | 'ECO_INITIATIVE'
  | 'INNOVATION_HUB';

export type GlobalZoneClassification = 'CRISIS_ZONE' | 'HUMANITARIAN_AID' | 'ECO_INITIATIVE' | 'INNOVATION_HUB' | 'GENERAL';

export type VerificationTier = 'BASIC' | 'GOLD' | 'PLATINUM';

export interface FairScoreHistoryRecord {
  id: string;
  publisherId: string;
  score: number;
  reason: string;
  timestamp: string;
}

export interface Publisher {
  id: string;
  name: string;
  avatar: string;
  location: string;
  description: string;
  category: CategoryType;
  platform: PlatformType;
  externalUrl: string;
  verificationLevel: VerificationTier;
  status: 'PENDING' | 'VERIFIED' | 'SUSPENDED' | 'DORMANT_CHANNEL';
  lifecycleStage: LifecycleStage;
  totalVisitsFromPlatform: number;
  lastImpressionTime: string;
  lastPublishDate?: string;         // تاريخ آخر نشر للمحتوى (لحساب فترة الخمول - 45 يوماً)
  dormantReason?: string;           // سبب التحويل إلى قناة خاملة
  reportsCount: number;
  trustScore?: number;             // درجة الثقة المرجعية (0 - 100)
  dataCompletenessScore?: number;  // نسبة اكتمال البيانات الجغرافية
  joinedDate: string;
  contactPhone: string;
  contactEmail: string;
  isGazaPilot: boolean;
  fairScore?: number;
  subscribersCount?: string;
  fairScoreHistory?: FairScoreHistoryRecord[];
  monetizationProgressPercent?: number;  // نسبة الاقتراب من تحقيق شروط ربح المنصة (0 - 100)
  monetizationNeedsNote?: string;        // الاحتياج المتبقي (مثال: ينقصه 120 مشترك و 200 ساعة مشاهدة)
  isNearMonetization?: boolean;          // علامة الأقرب لتحقيق شروط الربح
}

export interface RescuedStory {
  id: string;
  publisherName: string;
  publisherAvatar: string;
  location: string;
  storyTitle: string;
  storyContent: string;
  date: string;
  impactMetric: string;
  platformUrl: string;
  platform: PlatformType;
}

export interface FairEngineWeights {
  visitsWeight: number;           // أولوية لمن زواره أقل لتطبيق العدالة
  verificationWeight: number;     // مكافأة لدرجة التحقق العالية
  trustScoreWeight: number;       // نسبة وزن معامل الثقة المرجعية
  reportPenaltyWeight: number;    // خصم النقاط عند وجود بلاغات
  recencyWeight: number;          // مراعاة وقت الظهور الأخير
  lifecycleStageWeight: number;   // مراعاة مرحلة دورة الحياة
}

export interface JasmineCelebrity {
  id: string;
  celebrityName: string;
  titleRole: string;
  avatar: string;
  videoThumbnail: string;
  videoUrl: string;
  humanitarianStatement: string;
  verifiedBadge: boolean;
  sharedReferenceBioLink: string;
  endorsedCampaign: string;
  date: string;
  isAnonymous?: boolean;
  aliasName?: string;
}

export interface DalalTransitionChannel {
  id: string;
  publisherId: string;
  publisherName: string;
  avatar: string;
  category: CategoryType;
  transitionDate: string;
  growthTargetVisits: number;
  currentVisitsAchieved: number;
  supportNeedsDescription: string;
  externalUrl: string;
  platform: PlatformType;
}

export interface RaedaSuccessArchive {
  id: string;
  publisherId: string;
  publisherName: string;
  avatar: string;
  graduationDate: string;
  totalOutboundVisitsAchieved: number;
  successStorySummary: string;
  sustainabilitySource: string; // e.g. "قناة موثقة بعقود إنتاج مستقلة"
  externalUrl: string;
  platform: PlatformType;
}

export interface VerificationQueueItem {
  id: string;
  publisherId: string;
  publisherName: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  channelUrlValid: boolean;
  dataCompletenessScore: number; // 0 - 100%
  reviewStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NEEDS_INFO';
  reviewerNotes?: string;
  submittedAt: string;
}

export interface ReportHistoryItem {
  id: string;
  reportId: string;
  previousStatus: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  newStatus: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  adminDecision?: string;
  changedBy: string;
  createdAt: string;
}

export interface ReportItem {
  id: string;
  publisherId: string;
  publisherName: string;
  reporterType: 'SUPPORTER' | 'AUDITOR' | 'AUTOMATED';
  reason: string;
  evidenceDetails?: string;
  resolutionNotes?: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  history?: ReportHistoryItem[];
}

export type AuditActionCategory = 'SECURITY' | 'PROCEDURAL' | 'TECHNICAL';

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  role: 'ADMIN' | 'REVIEWER' | 'SYSTEM' | 'AUDITOR';
  action: string;
  details: string;
  category?: AuditActionCategory;
  targetId?: string;
  targetType?: 'PUBLISHER' | 'VERIFICATION_QUEUE' | 'FAIR_ENGINE' | 'SECURITY' | 'SECTOR' | 'REPORT';
}

export type RegionType =
  | 'MIDDLE_EAST'        // الشرق الأوسط
  | 'NORTH_AFRICA'       // شمال إفريقيا
  | 'SOUTH_EAST_ASIA'    // جنوب شرق آسيا
  | 'EUROPE'             // أوروبا
  | 'NORTH_AMERICA'      // أمريكا الشمالية
  | 'GLOBAL_OPEN';       // إقليم إنساني مفتوح

export type TargetTerritoryType =
  | 'GAZA_STRIP'         // قطاع غزة
  | 'AL_QUDS'            // القدس الشريف
  | 'WEST_BANK'          // الضفة الغربية
  | 'SUDAN'              // السودان
  | 'YEMEN'              // اليمن
  | 'OPEN_HUMANITARIAN'; // نطاق ميداني مفتوح

export interface CreatorProfileData {
  publicChannelName: string;
  platform: PlatformType;
  contentCategory: string; // 'محتوى إنساني' | 'صحفي ميداني' | 'تفاعلي' | 'ثقافي' | 'توعوي'
  introVideoUrl: string;
  subscribersOrFollowersCount?: number;
}

export interface SupporterProfile {
  id: string;
  fullName: string;
  email: string;
  isLoggedIn: boolean;
  isVerified: boolean;
  userType: 'SPONSOR' | 'CREATOR_CELEBRITY' | 'GUEST_SUPPORTER';
  mainRegion: RegionType | string;
  targetTerritory: TargetTerritoryType | string;
  creatorData?: CreatorProfileData;
  joinedAt: string;
}

export interface SupporterAction {
  id: string;
  publisherId: string;
  publisherName: string;
  platform: PlatformType;
  timestamp: string;
  sessionId?: string; // أُضيف لربط الفعل الجماهيري بمعرف الجلسة لمنع التلاعب
}

export type SovereignSectorKey =
  | 'ALL'
  | 'SUPPORTER'
  | 'PUBLISHER'
  | 'FAIR_ENGINE'
  | 'JASMINE'
  | 'DALAL'
  | 'RAEDA'
  | 'GOVERNANCE';

export interface SovereignErrorCode {
  code: string;               // e.g. "ERR-SUP-001"
  sectorKey: SovereignSectorKey; // e.g. "SUPPORTER"
  sectorNameAr: string;        // e.g. "قطاع الداعمين والجمهور"
  titleAr: string;             // e.g. "انحراف رابط التوجيه الخارجي"
  titleEn: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  descriptionAr: string;
  resolutionAr: string;
  ssotReference: string;       // e.g. "NA-ADR-SSOT-ERR-001"
}

export interface FocusModePreferences {
  category: CategoryType | 'ALL';
  platform: PlatformType | 'ALL';
  minVerification: 'ALL' | 'GOLD' | 'PLATINUM';
  prioritySort: 'HIGH_NEED' | 'FAIR_SCORE' | 'RECENT_UPDATE';
  autoNextOnSupport: boolean;
  viewLayout: 'SINGLE_CARD' | 'COMPACT_GRID';
}



export type TimeFilter = 'DAILY' | 'MONTHLY' | 'ALL_TIME';

export interface ImpactAggregationResult {
  totalActions: number;
  uniquePublishersSupported: number;
  platformsImpacted: Partial<Record<PlatformType, number>>;
  contributionRatio: number; // e.g. how much this user contributed relative to a baseline
}

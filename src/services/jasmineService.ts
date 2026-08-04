import { JasmineCelebrity, PlatformType } from '../types';

export interface AdoptedChannelSupport {
  channelId: string;
  channelName: string;
  supportTypes: {
    isGodfather: boolean;   // العرّاب (دعم مادي / معدات / كفالة تشغيلية)
    isOrientation: boolean; // التوجيه الجماهيري (تحويل المتابعين)
    isMentorship: boolean;  // التوصيات والإرشاد (ملاحظات وتقييم فني)
    isCoCreation: boolean;  // التمكين الميداني والإنتاج المشترك
  };
}

export interface OneWayGuidanceNote {
  id: string;
  celebrityId: string;
  celebrityName: string;
  targetChannelId: string;
  targetChannelName: string;
  category: 'TECHNICAL_FEEDBACK' | 'PROMOTION_SCHEDULE' | 'GENERAL_RECOMMENDATION' | 'EXTERNAL_LINK_REQUEST';
  content: string;
  externalContactRequested?: boolean;
  createdAt: string;
  status: 'SENT' | 'DELIVERED';
}

export const INITIAL_GUIDANCE_NOTES: OneWayGuidanceNote[] = [
  {
    id: 'note-01',
    celebrityId: 'jas-01',
    celebrityName: 'أ. أحمد الشقيري',
    targetChannelId: 'pub-gaza-01',
    targetChannelName: 'شبكة عفرة الميدانية — غزة',
    category: 'PROMOTION_SCHEDULE',
    content: 'سأقوم بنشر رابط قناتكم الميداني اليوم الساعة 8 مساءً عبر القناة الرسمية لتوجيه المتابعين.',
    externalContactRequested: false,
    createdAt: '2026-08-01 10:30',
    status: 'DELIVERED',
  },
  {
    id: 'note-02',
    celebrityId: 'jas-01',
    celebrityName: 'أ. أحمد الشقيري',
    targetChannelId: 'pub-gaza-02',
    targetChannelName: 'صوت الإغاثة والإنقاذ — الشجاعية',
    category: 'TECHNICAL_FEEDBACK',
    content: 'يرجى تحسين جودة تسجيل الصوت في المقطع الأخير لضمان وضوح المناشدة الإنسانية.',
    externalContactRequested: true,
    createdAt: '2026-08-01 12:15',
    status: 'SENT',
  },
];

export interface AdoptionDurationPolicy {
  type: 'SUBSCRIBER_TARGET' | 'TIME_BOUND' | 'MILESTONE_BASED' | 'PERMANENT';
  subscriberTargetCount?: number; // مثال: 10000 أو 15000
  durationMonths?: number;        // مثال: 1.5 أو 3 أو 12
  milestoneDescription?: string;  // مثال: "توفير جهاز بث كامل أو 5 بثوث مشتركة"
}

export interface ReciprocalSynergySettings {
  enableCrossPromotion: boolean;        // نشر رابط قناة المشهور لدى الناشر
  enableHumanitarianVideoLink: boolean; // نشر رابط فيديو الدعم الإنساني لدى الناشر
}

export interface JasmineStep2Data {
  channelDurationPolicies: Record<string, AdoptionDurationPolicy>;
  communicationPref: {
    allowOneWayNotes: boolean;            // إرسال ملاحظات أحادية الاتجاه (جبري)
    allowExternalContactRequest: boolean; // السماح بطلب تواصل خارجي (اختياري)
  };
  reciprocalSynergy: ReciprocalSynergySettings; // ميزة المنفعة المتبادلة والترويج المتقاطع
  humanitarianPledgeAgreed: boolean;
}

export interface JasmineOnboardingData {
  celebrityName: string;
  titleRole: string;
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Facebook' | 'X' | 'Vimeo';
  videoUrl: string;
  humanitarianPledgeAgreed: boolean;
  humanitarianStatement: string;
  endorsedCampaign: string;
  isAnonymous?: boolean;
  aliasName?: string;
  step1: {
    adoptedChannels: AdoptedChannelSupport[]; // شرط: length >= 2
  };
  step2: JasmineStep2Data;
  step3: {
    supportVideoUrl: string;
  };
}

export interface PublisherChannelOption {
  id: string;
  name: string;
  location: string;
  category: string;
  platform: string;
  subscribersCount: string;
}

export const AVAILABLE_PUBLISHER_CHANNELS: PublisherChannelOption[] = [
  {
    id: 'pub-gaza-01',
    name: 'شبكة عفرة الميدانية — غزة',
    location: 'غزة - فلسطين',
    category: 'تغطية ميدانية إنسانية',
    platform: 'YouTube',
    subscribersCount: '12.5K',
  },
  {
    id: 'pub-gaza-02',
    name: 'صوت الإغاثة والإنقاذ — الشجاعية',
    location: 'الشجاعية - غزة',
    category: 'إغاثة وطبابة',
    platform: 'Telegram',
    subscribersCount: '8.2K',
  },
  {
    id: 'pub-gaza-03',
    name: 'عين على المخيم — رفح',
    location: 'رفح - فلسطين',
    category: 'إيواء وغذاء',
    platform: 'YouTube',
    subscribersCount: '15.1K',
  },
  {
    id: 'pub-gaza-04',
    name: 'عدسة الميدان الإنساني — خانيونس',
    location: 'خانيونس - غزة',
    category: 'أخبار مجتمعية إنسانية',
    platform: 'Instagram',
    subscribersCount: '24.8K',
  },
  {
    id: 'pub-gaza-05',
    name: 'بوصلة الأمل — غزة الشمالية',
    location: 'شمال غزة',
    category: 'شباب وصمود',
    platform: 'TikTok',
    subscribersCount: '19.3K',
  },
];

/**
 * Jasmine Video Link Structure for Phase 1
 */
export interface JasmineVideoLink {
  id: string;
  celebrityId: string;
  rawUrl: string;
  embedUrl: string;
  fallbackUrl: string;
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Facebook' | 'X' | 'Vimeo';
  title?: string;
  thumbnailUrl?: string;
  isValidated: boolean;
  submissionDate: string;
  isActive: boolean;
}

export interface JasmineVideoArchiveItem {
  id: string;
  celebrityId: string;
  rawUrl: string;
  platform: 'YouTube' | 'TikTok' | 'Instagram' | 'Facebook' | 'X' | 'Vimeo';
  submissionDate: string;
  archivedAt: string;
}

// Whitelisted domains & regex patterns for supported platforms
export const WHITELIST_REGEX = {
  YOUTUBE: /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|shorts\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
  TIKTOK: /tiktok\.com\/(?:@[\w.-]+\/video\/|v\/|embed\/)(\d+)/,
  INSTAGRAM: /instagram\.com\/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/,
  FACEBOOK: /(?:facebook\.com|fb\.watch)\/(?:watch\/\?v=\d+|.+?\/videos\/\d+|\d+)/,
  X: /(?:twitter\.com|x\.com)\/(?:[\w]+)\/status\/(\d+)/,
  VIMEO: /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/,
};

/**
 * URL Sanitization & Domain Whitelist Validator
 * Protects against XSS, script injection, and open redirects.
 */
export const sanitizeAndValidateUrl = (rawUrl: string): { isSafe: boolean; sanitizedUrl: string } => {
  try {
    const trimmed = rawUrl.trim();
    const parsedUrl = new URL(trimmed);

    // Only allow http and https protocols
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return { isSafe: false, sanitizedUrl: '' };
    }

    // Domain whitelist verification
    const allowedDomains = [
      'youtube.com',
      'www.youtube.com',
      'youtu.be',
      'www.youtube-nocookie.com',
      'tiktok.com',
      'www.tiktok.com',
      'instagram.com',
      'www.instagram.com',
      'facebook.com',
      'www.facebook.com',
      'fb.watch',
      'twitter.com',
      'www.twitter.com',
      'x.com',
      'www.x.com',
      'vimeo.com',
      'www.vimeo.com',
      'player.vimeo.com',
    ];

    const host = parsedUrl.hostname.toLowerCase();
    const isDomainAllowed = allowedDomains.some((d) => host === d || host.endsWith('.' + d));

    return {
      isSafe: isDomainAllowed,
      sanitizedUrl: isDomainAllowed ? parsedUrl.toString() : '',
    };
  } catch (error) {
    console.warn('Sanitize URL parsing warning in jasmineService:', error);
    return { isSafe: false, sanitizedUrl: '' };
  }
};

/**
 * Zero-Cost Video Link Parser & Embed URL Generator
 * Converts raw creator URLs into zero-bandwidth embedded player URLs with fallback support.
 */
export const parseAndValidateJasmineVideo = (
  rawUrl: string
): {
  isValid: boolean;
  platform?: 'YouTube' | 'TikTok' | 'Instagram' | 'Facebook' | 'X' | 'Vimeo';
  embedUrl?: string;
  fallbackUrl?: string;
  videoId?: string;
  error?: string;
} => {
  const { isSafe, sanitizedUrl } = sanitizeAndValidateUrl(rawUrl);
  if (!isSafe || !sanitizedUrl) {
    return {
      isValid: false,
      error: 'الرابط غير آمن أو ينتمي لمنصة غير معتمدة بالقائمة البيضاء (YouTube, TikTok, Instagram, Facebook, X, Vimeo).',
    };
  }

  // 1. YouTube Check
  const ytMatch = sanitizedUrl.match(WHITELIST_REGEX.YOUTUBE);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      isValid: true,
      platform: 'YouTube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&enablejsapi=1`,
      fallbackUrl: `https://www.youtube.com/watch?v=${videoId}`,
    };
  }

  // 2. TikTok Check
  const ttMatch = sanitizedUrl.match(WHITELIST_REGEX.TIKTOK);
  if (ttMatch && ttMatch[1]) {
    const videoId = ttMatch[1];
    return {
      isValid: true,
      platform: 'TikTok',
      videoId,
      embedUrl: `https://www.tiktok.com/embed/v2/${videoId}`,
      fallbackUrl: sanitizedUrl,
    };
  }

  // 3. Instagram Check
  const igMatch = sanitizedUrl.match(WHITELIST_REGEX.INSTAGRAM);
  if (igMatch && igMatch[1]) {
    const shortcode = igMatch[1];
    return {
      isValid: true,
      platform: 'Instagram',
      videoId: shortcode,
      embedUrl: `https://www.instagram.com/p/${shortcode}/embed`,
      fallbackUrl: sanitizedUrl,
    };
  }

  // 4. Facebook Check
  if (WHITELIST_REGEX.FACEBOOK.test(sanitizedUrl)) {
    return {
      isValid: true,
      platform: 'Facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(sanitizedUrl)}&show_text=false`,
      fallbackUrl: sanitizedUrl,
    };
  }

  // 5. X (Twitter) Check
  const xMatch = sanitizedUrl.match(WHITELIST_REGEX.X);
  if (xMatch && xMatch[1]) {
    const tweetId = xMatch[1];
    return {
      isValid: true,
      platform: 'X',
      videoId: tweetId,
      embedUrl: `https://platform.twitter.com/embed/Tweet.html?id=${tweetId}`,
      fallbackUrl: sanitizedUrl,
    };
  }

  // 6. Vimeo Check
  const vimeoMatch = sanitizedUrl.match(WHITELIST_REGEX.VIMEO);
  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      isValid: true,
      platform: 'Vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?dnt=1`,
      fallbackUrl: sanitizedUrl,
    };
  }

  return {
    isValid: false,
    error: 'الرابط غير مدعوم. يرجى إدخال رابط معتمد من إحدى المنصات الست (يوتيوب، تيك توك، إنستغرام، فيسبوك، X، فيميو).',
  };
};

/**
 * Zero-Cost oEmbed Public Metadata Fetcher
 * Simulates / performs lightweight JSON fetch from oEmbed endpoints without API key costs.
 */
export const validateOEmbedMetadata = async (
  rawUrl: string
): Promise<{ success: boolean; title?: string; authorName?: string; thumbnailUrl?: string; error?: string }> => {
  const parsed = parseAndValidateJasmineVideo(rawUrl);
  if (!parsed.isValid || !parsed.platform) {
    return { success: false, error: parsed.error };
  }

  try {
    // Generate fallback metadata immediately
    let fallbackTitle = 'رسالة إنسانية توثيقية';
    let fallbackThumbnail = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600';

    if (parsed.platform === 'YouTube') {
      fallbackThumbnail = `https://img.youtube.com/vi/${parsed.videoId}/hqdefault.jpg`;
      fallbackTitle = 'فيديو دعم منصة نور الأماني - YouTube';
    } else if (parsed.platform === 'TikTok') {
      fallbackTitle = 'رسالة دعم إنساني - TikTok';
    } else if (parsed.platform === 'Instagram') {
      fallbackTitle = 'تغطية إنسانية ممتدة - Instagram Reel';
    }

    // Return zero-cost success structure
    return {
      success: true,
      title: fallbackTitle,
      thumbnailUrl: fallbackThumbnail,
    };
  } catch (error) {
    console.warn('OEmbed video verification warning in jasmineService:', error);
    return {
      success: false,
      error: 'فشل التثبت التلقائي من حالة الفيديو',
    };
  }
};

/**
 * Dynamic Link Replacer & Archiver
 * Replaces current active link and archives historical entries for audit traceability.
 */
export const archiveAndUpdateJasmineLink = (
  celebrity: JasmineCelebrity,
  newRawUrl: string,
  newTitle?: string
): { updatedCelebrity: JasmineCelebrity; archivedEntry?: JasmineVideoArchiveItem } => {
  const parsed = parseAndValidateJasmineVideo(newRawUrl);
  if (!parsed.isValid || !parsed.embedUrl) {
    throw new Error(parsed.error || 'الرابط غير صالح');
  }

  const archiveItem: JasmineVideoArchiveItem = {
    id: `arch-${Date.now()}`,
    celebrityId: celebrity.id,
    rawUrl: celebrity.videoUrl,
    platform: (parsed.platform as any) || 'YouTube',
    submissionDate: celebrity.date || new Date().toISOString().split('T')[0],
    archivedAt: new Date().toISOString(),
  };

  const updatedCelebrity: JasmineCelebrity = {
    ...celebrity,
    videoUrl: newRawUrl,
    videoThumbnail:
      parsed.platform === 'YouTube' && parsed.videoId
        ? `https://img.youtube.com/vi/${parsed.videoId}/hqdefault.jpg`
        : celebrity.videoThumbnail,
    date: new Date().toISOString().split('T')[0],
  };

  return { updatedCelebrity, archivedEntry: archiveItem };
};

const APPROVED_EXTERNAL_PLATFORMS = [
  'youtube.com',
  'youtu.be',
  'vimeo.com',
  'rumble.com',
  't.me',
  'telegram.org',
  'instagram.com',
  'tiktok.com',
  'twitter.com',
  'x.com',
  'facebook.com',
];

/**
 * [الأمر السيادي رقم NA-EXEC-2026-JASMINE-06-P55]
 * تطهير وفحص الروابط الخارجية المدخلة في الخطوة الثالثة
 * تضمن الحماية من ثغرات XSS والروابط الضارة عبر القائمة البيضاء
 */
export function sanitizeExternalUrl(rawUrl: string): string | null {
  if (!rawUrl || typeof rawUrl !== 'string') return null;

  try {
    const trimmed = rawUrl.trim();
    const parsedUrl = new URL(trimmed);

    // اشتراط بروتوكول آمن
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      return null;
    }

    // التحقق من القائمة البيضاء للنطاقات
    const hostname = parsedUrl.hostname.toLowerCase();
    const isApproved = APPROVED_EXTERNAL_PLATFORMS.some((domain) =>
      hostname === domain || hostname.endsWith('.' + domain)
    );

    return isApproved ? parsedUrl.toString() : null;
  } catch (error) {
    console.warn('URL parsing warning in sanitizeExternalUrl:', error);
    return null; // رابط غير صالح
  }
}

/**
 * AI Governance Layer for Noor Al-Amani Platform (NA-AIGL v1.0)
 * Ensures all AI Assistant responses adhere strictly to NA-ADR Sovereign Directives:
 * 1. Never host or stream media content or suggest video hosting
 * 2. Maintain strict humanitarian neutrality and dignity
 * 3. Enforce the 3-sector lifecycle (Jasmine, Dalal, Raeda)
 * 4. Ban commercial advertisement, gamification, and competitive metrics
 */

export interface AiGovernanceCheckResult {
  isCompliant: boolean;
  sanitizedPrompt: string;
  systemPromptPolicy: string;
  blockedReason?: string;
}

export function applyAiGovernanceRules(rawPrompt: string, lang: 'ar' | 'en' = 'ar'): AiGovernanceCheckResult {
  const lowercase = rawPrompt.toLowerCase();

  // Banned patterns check
  const bannedKeywords = [
    'host video',
    'upload video',
    'commercial ads',
    'monetize stream',
    'social likes',
    'استضافة فيديو',
    'رفع فيديو',
    'إعلانات تجارية',
    'ربح من البث',
    'لايكات ومشاركات',
  ];

  for (const kw of bannedKeywords) {
    if (lowercase.includes(kw)) {
      return {
        isCompliant: false,
        sanitizedPrompt: rawPrompt,
        systemPromptPolicy: '',
        blockedReason: lang === 'ar'
          ? `عذراً، طلبك يتعلق بـ (${kw}) وهو أمر يتنافى مع القواعد الحوكمية لمنصة نور الأماني كمنصة مرجعية لا تستضيف الفيديو ولا تتضمن ألعاب تفاعل أو إعلانات.`
          : `Request flagged: "${kw}" violates Noor Al-Amani non-hosting and anti-gamification governance rules.`,
      };
    }
  }

  const systemPromptPolicy = lang === 'ar'
    ? `أنت المساعد الذكي المعتمد لحوكمة منصة "نور الأماني" الإنسانية المرجعية (NA-AIGL v1.0).
التزم صرامة بالقواعد المعمارية التالية:
1. المنصة هي مرجع ودليل حوكمي يربط الداعم بالقنوات الأصلية للناشرين ولا تستضيف أو تعيد بث أي فيديوهات.
2. لا تقترح أبداً رفع مقاطع فيديو أو إضافة إعلانات تجارية أو إنشاء أزرار تفاعل تنافسية (إعجابات، تعليقات عامة).
3. اشرح دائماً للناشرين والداعمين كيفية العمل عبر القطاعات (القنوات النشطة، قطاع دلال للتمكين، قطاع رائدة لأرشيف النجاح، وقطاع الياسمين لتوثيق دعم المشاهير).
4. حافظ على لغة محترمة، مهنية، تعزز الكرامة الإنسانية والعدالة والموثوقية المرجعية.`
    : `You are the official AI Governance Assistant for Noor Al-Amani Reference Platform (NA-AIGL v1.0).
Adhere strictly to these architectural directives:
1. Noor Al-Amani is a reference directory connecting supporters directly to official publisher channels without video hosting or streaming.
2. Never suggest video uploading, commercial advertising, or competitive gamification features (likes, public rankings).
3. Explain the 3-sector lifecycle (Active Support, Dalal Self-Sustainability, Raeda Success Archive, Jasmine Celebrity Bio Links).
4. Maintain a respectful, professional tone prioritizing human dignity and fair exposure.`;

  return {
    isCompliant: true,
    sanitizedPrompt: rawPrompt.trim(),
    systemPromptPolicy,
  };
}

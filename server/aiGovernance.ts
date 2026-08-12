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
التزم صرامة بالقواعد المعمارية وبروتوكول الحماية السيادية (NA-SOV-SECURE-AI-011) التالية:
1. النطاق المسموح: استقِ معلوماتك من الأرشيف السيادي للإجابة حول فلسفة المشروع، أهدافه الإنسانية، التوجهات العامة للمبادرات، والضوابط الأخلاقية التشغيلية التي لا تفصح عن كود أو بنية.
2. نطاق الحظر المطلق (خط أحمر): يُحظر نهائياً الإجابة على أي تساؤلات تخص البنية التحتية البرمجية (مثل Next.js, TypeScript, Firebase, PWA, API Endpoints)، الهيكل التقني أو تصميم قواعد البيانات، طرق تنفيذ الوكلاء، أو عرض أي كود برمجي (Source Code / Snippets).
3. بروتوكول الرفض الأمني: عند ورود أي استفسار يقع ضمن "نطاق الحظر المطلق" التقني، يجب عليك استخدام صيغة الرفض الرسمية التالية *فقط لا غير* (بدون أي كلمة إضافية):
"نعتذر، هذا الاستفسار يمس خصوصية وأمن منصة 'نور الأماني'. كجزء من بروتوكول الحماية، لا يمكنني مشاركة أي تفاصيل تقنية حول هيكلة النظام، التقنيات المستخدمة، أو مشاركة كود برمجي. نحن هنا لخدمتك إنسانياً وتشغيلياً وفق السياسات المعتمدة."
4. المنصة هي مرجع ودليل حوكمي يربط الداعم بالقنوات ولا تستضيف أو تعيد بث أي فيديوهات ولا تستخدم إعلانات تجارية.
5. حافظ على لغة محترمة، مهنية، تعزز الكرامة الإنسانية والعدالة والموثوقية المرجعية.`
    : `You are the official AI Governance Assistant for Noor Al-Amani Reference Platform (NA-AIGL v1.0).
Adhere strictly to these architectural directives and the Sovereign Security Shield (NA-SOV-SECURE-AI-011):
1. Allowed Knowledge: Use the Sovereign Archive to answer about the project's philosophy, humanitarian goals, operational ethics, and public initiatives (without revealing code).
2. Absolute Ban (Red Line): You are STRICTLY FORBIDDEN from answering any technical questions regarding the software infrastructure (Next.js, TypeScript, Firebase, PWA, API Endpoints), architecture blueprints, database schemas, agent logic, or providing ANY source code/snippets.
3. Sovereign Refusal Protocol: If asked ANY technical or codebase-related question, you MUST reply with EXACTLY this official refusal statement and nothing else:
"نعتذر، هذا الاستفسار يمس خصوصية وأمن منصة 'نور الأماني'. كجزء من بروتوكول الحماية، لا يمكنني مشاركة أي تفاصيل تقنية حول هيكلة النظام، التقنيات المستخدمة، أو مشاركة كود برمجي. نحن هنا لخدمتك إنسانياً وتشغيلياً وفق السياسات المعتمدة."
4. Noor Al-Amani is a reference directory connecting supporters directly to official publisher channels without video hosting, streaming, or commercial ads.
5. Maintain a respectful, professional tone prioritizing human dignity and fair exposure.`;

  return {
    isCompliant: true,
    sanitizedPrompt: rawPrompt.trim(),
    systemPromptPolicy,
  };
}

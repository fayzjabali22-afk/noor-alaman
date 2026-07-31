# Noor Al-Amani Platform - Agents & Gemini Developer Directives

## DUMB INTERFACE CONSTRAINT (قيد الواجهات الغبية والتركيب العرضي المحض)
**(NA-DUMB-UI-CONSTRAINT-001 v1.0)**

لتضمين أعلى مستويات النقاء البرمجي والامتثال التام لدستور المعمارية السيادية لـ Noor Al-Amani Platform، يخضع الوكيل الذكي ومولدات الكود بالقوة الجبرية للمبادئ التالية:

1. **منع العمليات الجانبية داخل المكونات (No Side Effects in UI):**
   يُمنع منعاً باتاً كتابة أي عمليات جلب بيانات مباشرة (`fetch`, `axios`, `firebase/firestore`) أو معالجة منطق أعمال ثقيل (`Business Logic`) داخل مكونات واجهة المستخدم العرضية (`UI Components`).

2. **استقبال البيانات عبر الـ Props فقط (Strict Props-Only Data Flow):**
   يجب أن تستقبل المكونات العرضية بياناتها ونصوصها التفاعلية حصرياً من خلال الـ `Props` دون إنشاء حالات عالمية مستقلمة أو الاتصال بالخوادم ذاتياً.

3. **فصل المنطق في الخدمات والخطافات (Separation into Services & Custom Hooks):**
   أي منطق حسابي، أو معالجة معادلات محرك العدالة (`FairEngine`), أو التفاعل مع قاعدة البيانات الخلفية، يجب أن يتم عزله وتضمينه في خدمات منفصلة (`src/services/*`, `src/lib/*`) أو خطافات مخصصة (`Custom Hooks`).

4. **تفويض الأحداث (Event Delegation):**
   المكون العرضي لا يعالج أثر الحدث بنفسه ولا يغير الحالة العالمية، بل يمرر الحدث عبر دالة استدعاء راجعة (`Callback` / `onAction`) للمكون الأب أو يحث حدثاً عبر ناقل الأحداث السيادي (`eventBus`).

---

## SOVEREIGN PROTOCOLS COMPLIANCE
- **Protocol 88 (Zero-Waste & Resource Shield):** Strict local memoization with `useMemo` & `useCallback`, zero unnecessary server calls.
- **Protocol 43 (Loose Coupling):** Independent presentation modules decoupled from backend state logic.
- **Protocol 55 (Strict Operation Traceability & Sovereign Command Numbering):** Mandatory explicit sequential numbering (`[الأمر السيادي رقم X.Y]`) and complete audit tracing for all platform execution directives, state modifications, and UI updates.
- **NA-ADR Sovereign Directive:** Strict adherence to module independence (Publisher, Supporter, Jasmine, Dalal, Raeda, Verification, Ranking, Analytics, Governance).

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

## PROTOCOL 18: Sovereign Decoupling Protocol (بروتوكول 18: الفك السيادي والنزاهة المنطقية)
**[CMD-2026-0730-SOVEREIGN-INSTRUCTIONS-LOCK-102]**

- **Green Zone (UI Components):**
  1. No Firebase/Firestore or Auth imports inside `src/components`.
  2. Dumb UI Principle: Components must be blind to data origins. They only receive `Props` and render.
  3. No Logic in JSX: No mathematical calculations or business logic inside UI files. Logic must be called via sovereign hooks.
  4. No Invasive Imports: Components must not import helper functions from other components. Shared functions must be in `src/lib` or `src/utils`.

- **Yellow Zone (Hooks & Services):**
  1. Single Source of Truth (SSOT): All logic resides in centralized hooks/services.
  2. Standard JSON Contract: Hooks return standard JSON structures. Changing the backend shouldn't require touching a single UI pixel.
  3. Functional Independence: Hooks must be unit-testable without a browser or UI rendering.

**Strict AI Agent Accountability:**
- The AI Agent is strictly forbidden from injecting Firebase code or backend logic inside HTML/JSX files.
- The AI Agent must build sanitized bridges, services, and hooks that deliver ready-to-use data to the UI.

## PROTOCOL 19: Strict Folder Structure (الدستور المعماري للملفات)
**[CMD-2026-0730-ARCHITECTURE-BLUEPRINT-104]**
The AI Agent must strictly adhere to the project blueprint defined in `ARCHITECTURE.md`:
- **src/components/**: Dumb UI only.
- **src/services/**: Smart Logic, API calls, and Firebase logic.
- **src/hooks/**: Custom Hooks.
- **src/lib/**: Utils and helpers.
- Never place business logic inside UI components.

## PROTOCOL 20: Database Sterilization (المكنسة البرمجية)
**[CMD-2026-0730-CRON-JOB-STERILIZATION-108]**
The AI Agent must implement and maintain background cron jobs (المكنسة البرمجية) to automatically purge dead records, expired sessions, cancelled trips, and old notifications to ensure database index optimization and system performance.

import { useState, useCallback, useRef } from 'react';
import { SupporterAction } from '../types';
import { eventBus } from '../services/eventBus';

export const useSupporterActions = (
  originalOnRecordAction: (action: SupporterAction) => void
) => {
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [successActionId, setSuccessActionId] = useState<string | null>(null);
  const lastActionTimeRef = useRef<number>(0);

  // جدار منع النقرات المتكررة الوهمية (Anti-Spam & Cooldown)
  const COOLDOWN_MS = 2000;

  const recordActionWithCooldown = useCallback(
    (action: SupporterAction) => {
      const now = Date.now();
      if (now - lastActionTimeRef.current < COOLDOWN_MS) {
        // منع التكرار بهدوء دون إشعار مزعج
        return;
      }
      lastActionTimeRef.current = now;
      
      setLoadingActionId(action.publisherId);
      
      // التغذية العكسية الحية الهادئة (Subtle UI Feedback)
      setTimeout(() => {
        // حقن sessionId إن لم يكن موجوداً
        const finalAction: SupporterAction = {
          ...action,
          sessionId: action.sessionId || 'session-local-1' // استبدل بمعرف الجلسة الحقيقي
        };

        originalOnRecordAction(finalAction);
        
        // إبلاغ محرك العدالة بشكل منفصل
        eventBus.publish('PUBLISHER_VISITED', { publisherId: action.publisherId });

        setLoadingActionId(null);
        setSuccessActionId(action.publisherId);

        // إخفاء حالة النجاح الهادئة بعد فترة قصيرة
        setTimeout(() => {
          setSuccessActionId(null);
        }, 1500);

      }, 300); // محاكاة الشبكة
    },
    [originalOnRecordAction]
  );

  return {
    recordActionWithCooldown,
    loadingActionId,
    successActionId
  };
};

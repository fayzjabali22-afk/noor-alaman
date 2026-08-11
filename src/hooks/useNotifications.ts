import { useState, useEffect, useCallback } from 'react';
import { SovereignNotification } from '../types';

const STORAGE_KEY = 'noor_amani_sovereign_notifications_v1';
const SOUND_PREF_KEY = 'noor_amani_notification_sound_enabled';

const INITIAL_NOTIFICATIONS: SovereignNotification[] = [
  {
    id: 'msg-101',
    title: 'مرحباً بك في بوابة رسائل نور الأماني',
    body: 'تم تفعيل بوابة استقبال الرسائل والإشعارات السيادية بنجاح. ستصلك التحديثات الميدانية وإشعارات الدعم فوراً.',
    timestamp: new Date().toISOString(),
    isRead: false,
    type: 'SUCCESS',
  },
  {
    id: 'msg-102',
    title: 'تحديث حوكمة القنوات الميدانية',
    body: 'تم اعتماد خوارزمية العدالة (FairEngine 3.0) لفهرسة وتصنيف القنوات الميدانية تلقائياً.',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    isRead: false,
    type: 'SYSTEM',
  },
];

// Synthetic Sovereign Audio Chime Generator using Web Audio API (Zero external asset dependency)
const playSovereignChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    // Harmonic double bell tone (E5 -> B5)
    osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
    osc2.frequency.setValueAtTime(987.77, ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(ctx.currentTime);
    osc2.start(ctx.currentTime + 0.1);
    osc1.stop(ctx.currentTime + 0.8);
    osc2.stop(ctx.currentTime + 0.8);
  } catch (err) {
    console.warn('[Noor Al-Amani Audio] Could not play chime:', err);
  }
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<SovereignNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to parse notifications from storage:', e);
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    try {
      const pref = localStorage.getItem(SOUND_PREF_KEY);
      return pref !== null ? JSON.parse(pref) : true;
    } catch {
      return true;
    }
  });

  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'default';
  });

  const [fcmToken, setFcmToken] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed to save notifications to storage:', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem(SOUND_PREF_KEY, JSON.stringify(isSoundEnabled));
    } catch (e) {
      console.warn('Failed to save sound pref:', e);
    }
  }, [isSoundEnabled]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  // Sync OS Launcher App Badge API
  useEffect(() => {
    if (typeof window !== 'undefined' && 'navigator' in window) {
      const nav = navigator as Navigator & {
        setAppBadge?: (count?: number) => Promise<void>;
        clearAppBadge?: () => Promise<void>;
      };

      if (unreadCount > 0 && nav.setAppBadge) {
        nav.setAppBadge(unreadCount).catch((err) => {
          console.error("Error in Noor Al-Amani Module:", err);
        });
      } else if (unreadCount === 0 && nav.clearAppBadge) {
        nav.clearAppBadge().catch((err) => {
          console.error("Error in Noor Al-Amani Module:", err);
        });
      }
    }
  }, [unreadCount]);

  // Register Service Worker for PWA / FCM
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
        .then((reg) => {
          console.log('[Noor Al-Amani] Notification Service Worker registered:', reg.scope);
        })
        .catch((err) => {
          console.warn('[Noor Al-Amani] SW registration note:', err);
        });
    }
  }, []);

  // Request Notification Permission
  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      alert('نظام التشغيل / المتصفح الحالي لا يدعم الإشعارات المباشرة.');
      return 'denied' as NotificationPermission;
    }

    try {
      const res = await Notification.requestPermission();
      setPermission(res);
      if (res === 'granted') {
        // Generate simulated FCM Token for device binding
        const mockToken = `fcm_token_noor_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        setFcmToken(mockToken);

        // Show native test notification
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.ready;
          reg.showNotification('منصة نور الأماني', {
            body: 'تم تفعيل إشعارات الهاتف بنجاح.',
            icon: '/manifest.json',
            tag: 'welcome-noor',
          });
        }
      }
      return res;
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      return 'denied' as NotificationPermission;
    }
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled((prev) => !prev);
  }, []);

  const addNotification = useCallback(
    (notif: Omit<SovereignNotification, 'id' | 'timestamp' | 'isRead'>) => {
      const newMsg: SovereignNotification = {
        ...notif,
        id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: new Date().toISOString(),
        isRead: false,
      };

      setNotifications((prev) => [newMsg, ...prev]);

      if (isSoundEnabled) {
        playSovereignChime();
      }
    },
    [isSoundEnabled]
  );

  const sendTestNotification = useCallback(() => {
    const topics = [
      { title: 'إشعار توثيق قناة جديد', body: 'تم توثيق قناة ميدانية جديدة بنجاح وترفيع رتبة الثقة.', type: 'SUCCESS' as const },
      { title: 'نداء دعم إنساني عاجل', body: 'قام أحد الداعمين بفتح رابط تغطية ميدانية مباشرة.', type: 'INFO' as const },
      { title: 'تحديث مؤشر التوازن الإقليمي', body: 'تم تعديل أوزان خوارزمية العدالة لزيادة فرص الاستجابة الميدانية.', type: 'SYSTEM' as const },
    ];
    const picked = topics[Math.floor(Math.random() * topics.length)];
    addNotification(picked);
  }, [addNotification]);

  return {
    notifications,
    unreadCount,
    permission,
    fcmToken,
    isSoundEnabled,
    requestPermission,
    markAsRead,
    markAllAsRead,
    clearAll,
    toggleSound,
    addNotification,
    sendTestNotification,
  };
}

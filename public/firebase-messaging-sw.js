// Noor Al-Amani Sovereign Message Receiver Service Worker
// Directive: NA-SOV-DIRECTIVE-2026-0810-MSG-GATE

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSy_NoorAlAmani_Sovereign_Key",
  authDomain: "noor-al-amani.firebaseapp.com",
  projectId: "noor-al-amani",
  storageBucket: "noor-al-amani.appspot.com",
  messagingSenderId: "109876543210",
  appId: "1:109876543210:web:noor_al_amani_pwa"
};

try {
  firebase.initializeApp(firebaseConfig);
  const messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    console.log('[Noor Al-Amani ServiceWorker] Background Message Received:', payload);

    const notificationTitle = payload.notification?.title || 'نور الأماني - إشعار سيادي جديد';
    const notificationOptions = {
      body: payload.notification?.body || 'لديك رسالة إنسانية جديدة في بوابة استقبال الرسائل.',
      icon: '/manifest.json',
      badge: '/manifest.json',
      tag: 'noor-amani-msg',
      data: payload.data || {},
      vibrate: [200, 100, 200],
      actions: [
        { action: 'open', title: 'فتح البوابة' },
        { action: 'dismiss', title: 'إغلاق' }
      ]
    };

    if ('setAppBadge' in navigator) {
      navigator.setAppBadge(1).catch((err) => console.log('Badge set error:', err));
    }

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });
} catch (e) {
  console.warn('[Noor Al-Amani ServiceWorker] FCM init deferred in SW:', e);
}

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});

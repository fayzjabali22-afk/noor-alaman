import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  Sparkles,
  ShieldCheck,
  Info,
  AlertTriangle,
  Volume2,
  VolumeX,
  X,
  Smartphone,
} from 'lucide-react';
import { NotificationManager } from './NotificationManager';
import { useNotifications } from '../hooks/useNotifications';
import { Language } from '../types';

interface NotificationBellProps {
  lang: Language;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ lang }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isAr = lang === 'ar';

  const {
    notifications,
    unreadCount,
    permission,
    isSoundEnabled,
    requestPermission,
    markAsRead,
    markAllAsRead,
    clearAll,
    toggleSound,
    sendTestNotification,
  } = useNotifications();

  // Dismiss on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  const getTypeBadge = (type?: string) => {
    switch (type) {
      case 'SUCCESS':
        return <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'WARNING':
        return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'SYSTEM':
        return <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />;
      default:
        return <Info className="w-4 h-4 text-teal-400 shrink-0" />;
    }
  };

  return (
    <div ref={containerRef} className="relative inline-block text-right">
      {/* Sovereign Bell Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        title={isAr ? 'بوابة استقبال الرسائل والإشعارات السيادية' : 'Sovereign Messages & Notifications Portal'}
        className="relative p-2 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/80 text-slate-300 hover:text-white transition shadow-md flex items-center justify-center cursor-pointer touch-manipulation focus:outline-none"
      >
        <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center shadow-lg shadow-emerald-950 border border-slate-950 animate-pulse">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Sovereign Message Center Dropdown Popover */}
      {isOpen && (
        <div className="absolute left-0 sm:left-auto right-0 sm:right-0 mt-2 w-[320px] sm:w-[380px] max-w-[92vw] bg-slate-950/98 border border-emerald-500/30 rounded-2xl shadow-2xl z-50 backdrop-blur-2xl overflow-hidden animate-fade-in text-slate-200">
          {/* Header Bar */}
          <div className="p-3.5 border-b border-slate-800/90 bg-slate-900/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-950 border border-emerald-500/40 flex items-center justify-center">
                <Bell className="w-4 h-4 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-xs font-black text-white tracking-wide">
                  {isAr ? 'بوابة استقبال رسائل نور الأماني' : 'Noor Al-Amani Message Portal'}
                </h3>
                <p className="text-[10px] text-slate-400 font-mono">
                  {isAr ? `غير مقروء: ${unreadCount}` : `Unread: ${unreadCount}`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={toggleSound}
                title={isAr ? (isSoundEnabled ? 'كتم الصوت' : 'تفعيل الصوت') : (isSoundEnabled ? 'Mute' : 'Unmute')}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                {isSoundEnabled ? (
                  <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Push Permission Banner if not granted */}
          {permission !== 'granted' && (
            <div className="p-2.5 bg-emerald-950/60 border-b border-emerald-500/20 flex items-center justify-between gap-2 text-[11px]">
              <div className="flex items-center gap-2 text-emerald-200 min-w-0">
                <Smartphone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">
                  {isAr ? 'تفعيل إشعارات PWA / iOS' : 'Enable PWA/iOS Push'}
                </span>
              </div>
              <NotificationManager lang={lang} />
            </div>
          )}

          {/* Action Toolbar */}
          <div className="px-3 py-2 bg-slate-900/40 border-b border-slate-800/60 flex items-center justify-between gap-1 text-[10px]">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={unreadCount === 0}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/40 disabled:opacity-40 text-emerald-400 transition flex items-center gap-1 cursor-pointer"
              >
                <CheckCheck className="w-3 h-3" />
                <span>{isAr ? 'قراءة الكل' : 'Mark all read'}</span>
              </button>

              <button
                type="button"
                onClick={sendTestNotification}
                className="px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-purple-300 transition flex items-center gap-1 cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-purple-400" />
                <span>{isAr ? 'اختبار إشعار' : 'Test Msg'}</span>
              </button>
            </div>

            {notifications.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="p-1 rounded-lg hover:bg-rose-950/60 text-slate-500 hover:text-rose-400 transition cursor-pointer"
                title={isAr ? 'مسح كافة الرسائل' : 'Clear all'}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Messages Scroll Area */}
          <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-800/50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500 space-y-2">
                <BellOff className="w-8 h-8 mx-auto text-slate-600 opacity-60" />
                <p className="text-xs font-medium">
                  {isAr ? 'لا توجد رسائل أو إشعارات حالياً' : 'No messages or notifications'}
                </p>
              </div>
            ) : (
              notifications.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => markAsRead(msg.id)}
                  className={`p-3 transition cursor-pointer flex items-start gap-2.5 ${
                    msg.isRead
                      ? 'bg-slate-950/60 hover:bg-slate-900/40 opacity-75'
                      : 'bg-emerald-950/20 hover:bg-emerald-950/40 border-r-2 border-emerald-400'
                  }`}
                >
                  <div className="mt-0.5">{getTypeBadge(msg.type)}</div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4
                        className={`text-xs font-bold truncate ${
                          msg.isRead ? 'text-slate-300' : 'text-white'
                        }`}
                      >
                        {msg.title}
                      </h4>
                      <span className="text-[9px] text-slate-500 font-mono shrink-0">
                        {formatTime(msg.timestamp)}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                      {msg.body}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sovereign Footer */}
          <div className="p-2 bg-slate-950 text-center border-t border-slate-800/80">
            <span className="text-[9px] text-slate-500 font-mono">
              NA-SOV-DIRECTIVE-2026-0810-MSG-GATE • Sovereign Message Engine
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

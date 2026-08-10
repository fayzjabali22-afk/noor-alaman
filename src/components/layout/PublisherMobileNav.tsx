import React, { useState, useEffect } from 'react';
import { FileText, PlusCircle, TrendingUp, ShieldCheck, Compass } from 'lucide-react';
import { Language } from '../../types';

export interface PublisherMobileNavProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenPortalsSheet: () => void;
  lang: Language;
}

export const PublisherMobileNav: React.FC<PublisherMobileNavProps> = ({
  activeTab = 'channels',
  onSelectTab,
  onOpenPortalsSheet,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [currentActive, setCurrentActive] = useState(activeTab);

  useEffect(() => {
    setCurrentActive(activeTab);
  }, [activeTab]);

  const handleTabClick = (tabId: string, elementId?: string) => {
    setCurrentActive(tabId);
    onSelectTab?.(tabId);

    if (elementId) {
      const el = document.getElementById(elementId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const navItems = [
    {
      id: 'channels',
      elementId: 'publisher-active-channels',
      labelAr: 'القنوات',
      labelEn: 'Channels',
      icon: FileText,
    },
    {
      id: 'register',
      elementId: 'publisher-register-form',
      labelAr: 'تسجيل قناة',
      labelEn: 'Register',
      icon: PlusCircle,
    },
    {
      id: 'growth',
      elementId: 'publisher-growth-chart',
      labelAr: 'مؤشرات النمو',
      labelEn: 'Growth',
      icon: TrendingUp,
    },
    {
      id: 'stages',
      elementId: 'publisher-lifecycle-pipeline',
      labelAr: 'التوثيق',
      labelEn: 'Pipeline',
      icon: ShieldCheck,
    },
  ];

  return (
    <nav
      aria-label={isAr ? 'شريط تنقل بوابة نداء متابع ودعم المحتوى' : 'Follower Call & Content Support Portal Navigation'}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-purple-500/30 backdrop-blur-2xl px-1.5 py-1 pb-safe flex items-center justify-between shadow-2xl text-[10px] font-bold text-slate-400 select-none"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentActive === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => handleTabClick(item.id, item.elementId)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 ${
              isActive
                ? 'text-purple-300 font-black bg-purple-500/10 border border-purple-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 text-purple-400' : ''}`} />
            <span className="truncate max-w-[62px]">
              {isAr ? item.labelAr : item.labelEn}
            </span>
          </button>
        );
      })}

      {/* Portals Switcher Button */}
      <button
        type="button"
        onClick={onOpenPortalsSheet}
        className="flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl text-indigo-400 hover:text-indigo-300 transition-all duration-200 min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 border border-indigo-500/20 bg-indigo-950/30"
      >
        <Compass className="w-4 h-4 text-indigo-400" />
        <span className="truncate max-w-[60px] font-bold">
          {isAr ? 'القطاعات' : 'Sectors'}
        </span>
      </button>
    </nav>
  );
};

import React from 'react';
import { BarChart3, MessageSquare, Video, Globe, FolderArchive, Compass } from 'lucide-react';
import { Language } from '../../types';

export interface SupporterMobileNavProps {
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
  onOpenPortalsSheet: () => void;
  lang: Language;
}

export const SupporterMobileNav: React.FC<SupporterMobileNavProps> = ({
  activeTab = 'overview',
  onSelectTab,
  onOpenPortalsSheet,
  lang,
}) => {
  const isAr = lang === 'ar';

  const navItems = [
    {
      id: 'overview',
      labelAr: 'الملخص',
      labelEn: 'Overview',
      icon: BarChart3,
    },
    {
      id: 'my_media',
      labelAr: 'الكفالات',
      labelEn: 'Sponsored',
      icon: Video,
    },
    {
      id: 'guidance',
      labelAr: 'التوجيه',
      labelEn: 'Guidance',
      icon: MessageSquare,
    },
    {
      id: 'explore',
      labelAr: 'الاستكشاف',
      labelEn: 'Explore',
      icon: Globe,
    },
    {
      id: 'vault',
      labelAr: 'الخزنة',
      labelEn: 'Vault',
      icon: FolderArchive,
    },
  ];

  return (
    <nav
      aria-label={isAr ? 'شريط تنقل بوابة التبني' : 'Supporter Portal Mobile Navigation'}
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-amber-500/30 backdrop-blur-2xl px-1.5 py-1 pb-safe flex items-center justify-between shadow-2xl text-[10px] font-bold text-slate-400 select-none"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectTab?.(item.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-1.5 px-1 rounded-xl transition-all duration-200 min-h-[44px] min-w-[44px] touch-manipulation active:scale-95 ${
              isActive
                ? 'text-amber-400 font-black bg-amber-500/10 border border-amber-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 text-amber-400' : ''}`} />
            <span className="truncate max-w-[60px]">
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

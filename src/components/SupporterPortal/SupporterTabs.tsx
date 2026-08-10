import React, { useState } from 'react';
import { BarChart3, MessageSquare, Video, Globe, FolderArchive, ChevronDown, ChevronUp, Check, Layers } from 'lucide-react';

export type AccountTabType = 'overview' | 'guidance' | 'my_media' | 'explore' | 'vault';

interface SupporterTabsProps {
  accountTab: AccountTabType;
  onSelectTab: (tab: AccountTabType) => void;
  isAr: boolean;
}

export const SupporterTabs: React.FC<SupporterTabsProps> = React.memo(({
  accountTab,
  onSelectTab,
  isAr,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const tabOptions: Array<{ id: AccountTabType; labelAr: string; labelEn: string; icon: React.ReactNode }> = [
    {
      id: 'overview',
      labelAr: '1. شاشة القيادة وأثر الكفالات',
      labelEn: '1. Leadership & Impact Dashboard',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'guidance',
      labelAr: '2. إرسال التوجيهات والدفعة المرورية',
      labelEn: '2. Guidance & Traffic Boost',
      icon: <MessageSquare className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'my_media',
      labelAr: '3. بيانات الإشهار والفيديوهات المرفوعة',
      labelEn: '3. My Media Statements',
      icon: <Video className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'explore',
      labelAr: '4. دليل القنوات الميدانية المتاحة',
      labelEn: '4. Explore Field Channels',
      icon: <Globe className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'vault',
      labelAr: '5. الخزانة السيادية والشهادات',
      labelEn: '5. Sovereign Vault & Certificates',
      icon: <FolderArchive className="w-4 h-4 text-amber-400 shrink-0" />,
    },
  ];

  const currentTabOption = tabOptions.find((t) => t.id === accountTab) || tabOptions[0];

  return (
    <div className="w-full pt-2 pb-1 border-t border-slate-800/80 text-xs font-bold space-y-2">
      {/* Accordion Header Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-slate-900 border border-amber-500/40 text-slate-100 hover:bg-slate-850 transition-all duration-200 cursor-pointer min-h-[48px] touch-manipulation shadow-lg shadow-amber-500/5 active:scale-[0.99] select-none"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            {currentTabOption.icon}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              <span className="block text-[10px] text-amber-400 font-extrabold uppercase tracking-wider">
                {isAr ? 'القسم الحالي' : 'Active Tab'}
              </span>
            </div>
            <span className="text-xs md:text-sm font-black text-white">
              {isAr ? currentTabOption.labelAr : currentTabOption.labelEn}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <span className="text-[11px] bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-amber-300 font-extrabold hidden sm:inline-flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>{isOpen ? (isAr ? 'طَي الأكورديون' : 'Collapse') : (isAr ? 'توسيع الأكورديون' : 'Expand')}</span>
          </span>
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-amber-400 transition-transform duration-300" />
          ) : (
            <ChevronDown className="w-5 h-5 text-amber-400 transition-transform duration-300" />
          )}
        </div>
      </button>

      {/* Accordion Expandable Body (Inline Flow) */}
      {isOpen && (
        <div className="w-full bg-slate-950/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-3 shadow-2xl space-y-2 animate-fade-in transition-all duration-300">
          <div className="px-2 py-1 text-[10px] text-slate-400 font-extrabold uppercase border-b border-slate-800/80 mb-2 flex items-center justify-between">
            <span>{isAr ? 'أقسام البوابة (منسدلة أكورديون عمودية)' : 'Portal Sections (Vertical Accordion List)'}</span>
            <span className="text-amber-400 font-mono font-bold">5 {isAr ? 'أقسام' : 'Sections'}</span>
          </div>

          <div className="flex flex-col gap-2">
            {tabOptions.map((option) => {
              const isSelected = accountTab === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(option.id);
                  }}
                  className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer min-h-[46px] touch-manipulation active:scale-[0.98] select-none ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border border-amber-500/60 text-amber-300 font-black shadow-md'
                      : 'bg-slate-900/80 hover:bg-slate-850 text-slate-300 border border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-1.5 rounded-lg ${
                        isSelected
                          ? 'bg-amber-500 text-slate-950 font-black shadow-sm'
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {option.icon}
                    </div>
                    <span className="text-xs md:text-sm font-bold">
                      {isAr ? option.labelAr : option.labelEn}
                    </span>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1.5 text-amber-400 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/40 text-[10px] font-extrabold shadow-sm">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>{isAr ? 'القسم النشط' : 'Active'}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
});

SupporterTabs.displayName = 'SupporterTabs';

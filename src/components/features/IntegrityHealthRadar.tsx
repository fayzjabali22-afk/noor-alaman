import React, { useState } from 'react';
import { Language } from '../../types';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldCheck as ShieldVerified,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Search,
  Eye,
  Activity,
  FileCheck2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export interface IntegrityChannelItem {
  id: string;
  name: string;
  status: 'clean' | 'shielded' | 'review' | 'warning';
  purityScore: number; // e.g. 100, 98, 85
  lastAuditDate: string;
  violationsCount: number;
}

export interface IntegrityHealthRadarProps {
  channels: IntegrityChannelItem[];
  overallPurityPercent: number;
  lang: Language;
  onRefreshRadar?: () => void;
  onInspectChannel?: (channelId: string) => void;
}

export const IntegrityHealthRadar: React.FC<IntegrityHealthRadarProps> = React.memo(({
  channels,
  overallPurityPercent,
  lang,
  onRefreshRadar,
  onInspectChannel,
}) => {
  const isAr = lang === 'ar';
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const getStatusBadge = (status: IntegrityChannelItem['status']) => {
    switch (status) {
      case 'clean':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isAr ? 'نقي وموثق 100%' : '100% Clean'}</span>
          </span>
        );
      case 'shielded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[11px] font-bold">
            <ShieldVerified className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isAr ? 'محمي بالدرع السيادي' : 'Shielded'}</span>
          </span>
        );
      case 'review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-[11px] font-bold">
            <Activity className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{isAr ? 'قيد التدقيق التلقائي' : 'Under Audit'}</span>
          </span>
        );
      case 'warning':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
            <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
            <span>{isAr ? 'تنبيه النزاهة' : 'Flagged'}</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      id="integrity-health-radar-card"
      className="w-full bg-slate-900/90 border border-slate-800/80 rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-2xl space-y-4 relative overflow-hidden backdrop-blur-xl transition-all duration-300"
    >
      {/* Background Subtle Accent */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none -ml-24 -mt-24" />

      {/* Accordion Header */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10 ${isOpen ? 'border-b border-slate-800/60 pb-4' : ''}`}>
        <div
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-3 cursor-pointer group select-none flex-1 min-h-[56px]"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsOpen((prev) => !prev);
            }
          }}
          aria-expanded={isOpen}
        >
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl text-cyan-400 shadow-inner group-hover:border-cyan-500/60 transition shrink-0">
            <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base md:text-xl font-black text-white group-hover:text-cyan-300 transition">
                {isAr ? 'رادار صحة النقاء والتدقيق السيادي' : 'Integrity Health Radar & Audit Shield'}
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                NA-EXEC-013
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isAr
                ? 'مراقبة بصرية حية لسلامة القنوات المكفولة ومنع التلوث الإعلاني وفق بروتوكول الواجهات الصامتة'
                : 'Live visual telemetry monitoring sponsored channel purity and integrity without API calls.'}
            </p>
          </div>
        </div>

        {/* Overall Purity Gauge Pill & Accordion Toggle */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <div className="flex items-center gap-3 bg-slate-950/80 border border-cyan-500/30 px-3.5 py-1.5 rounded-2xl shadow-md">
            <div className="flex flex-col text-right">
              <span className="text-[10px] font-bold text-slate-400">
                {isAr ? 'النقاء العام:' : 'Purity:'}
              </span>
              <span className="text-base font-black text-emerald-400">{overallPurityPercent}%</span>
            </div>
            <div className="p-1.5 bg-emerald-500/10 rounded-xl text-emerald-400">
              <FileCheck2 className="w-4 h-4" />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? (isAr ? 'طي القائمة' : 'Collapse') : (isAr ? 'توسيع القائمة' : 'Expand')}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:border-cyan-500/30 transition flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation active:scale-95 shrink-0"
          >
            <ChevronDown className={`w-5 h-5 text-cyan-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Accordion Collapsible Body */}
      <div
        className={`grid transition-[grid-template-rows,opacity,margin] duration-300 ease-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
        }`}
      >
        <div className="overflow-hidden space-y-4">
          {/* Channel Integrity Table / Grid */}
          <div className="space-y-3 relative z-10">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 px-2">
              <span>{isAr ? 'القناة / المبادرة المكفولة' : 'Sponsored Channel'}</span>
              <span>{isAr ? 'حالة النقاء والحوكمة' : 'Purity Status'}</span>
            </div>

            {channels.length === 0 ? (
              <div className="p-6 text-center bg-slate-950/60 border border-slate-800 rounded-2xl text-slate-400 text-xs">
                {isAr
                  ? 'لا توجد قنوات مكفولة حالياً في رادار التدقيق المباشر.'
                  : 'No sponsored channels currently in the live audit radar.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {channels.map((channel) => (
                  <div
                    key={channel.id}
                    id={`integrity-channel-row-${channel.id}`}
                    className="bg-slate-950/70 border border-slate-800 hover:border-cyan-500/40 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-cyan-400 group-hover:border-cyan-500/40 transition">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition">
                          {channel.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span>{isAr ? `آخر فحص: ${channel.lastAuditDate}` : `Last Audit: ${channel.lastAuditDate}`}</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">
                            {isAr ? `درجة النقاء: ${channel.purityScore}%` : `Purity: ${channel.purityScore}%`}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                      {getStatusBadge(channel.status)}

                      {onInspectChannel && (
                        <button
                          type="button"
                          onClick={() => onInspectChannel(channel.id)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition border border-slate-700 text-xs flex items-center gap-1 cursor-pointer"
                          title={isAr ? 'معاينة سجل الفحص' : 'Inspect Audit Log'}
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="hidden sm:inline text-[10px]">{isAr ? 'فحص' : 'Inspect'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Governance Guarantee */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800/80 flex items-center gap-3 text-xs text-slate-300 relative z-10">
            <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
            <p className="text-[11px]">
              {isAr
                ? 'تنويه حوكمي: يعمل رادار النقاء كاملاً وفق قيد الواجهات الصامتة (NA-DUMB-UI-CONSTRAINT-001) بدقة عالية، وتلقي مؤشرات الأمان من طبقة المحرك الموحد دون أي اتصالات شبكية مباشرة.'
                : 'Governance Notice: Integrity Health Radar operates strictly under NA-DUMB-UI-CONSTRAINT-001 with zero direct API calls.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

IntegrityHealthRadar.displayName = 'IntegrityHealthRadar';

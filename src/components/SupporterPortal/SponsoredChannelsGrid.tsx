import React, { useState, useCallback } from 'react';
import { Radio, Sparkles, Info, ShieldCheck, MapPin, AlertTriangle, CheckCircle2, History, MessageSquare, ChevronDown, ChevronUp, Crown } from 'lucide-react';
import { Publisher, PlatformType } from '../../types';
import { AccordionEmptyState } from '../layout/AccordionEmptyState';

interface SponsoredChannelsGridProps {
  sponsoredPublishers: Publisher[];
  isAr: boolean;
  onExploreClick: () => void;
  onSendGuidanceClick: (publisherId: string) => void;
  onCancelSponsorshipClick: (publisherId: string) => void;
  getPlatformIcon: (platform: PlatformType) => React.ReactNode;
}

export const SponsoredChannelsGrid: React.FC<SponsoredChannelsGridProps> = React.memo(({
  sponsoredPublishers,
  isAr,
  onExploreClick,
  onSendGuidanceClick,
  onCancelSponsorshipClick,
  getPlatformIcon,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleAccordion = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800/80 rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl transition-all duration-300">
      {/* Accordion Header */}
      <div
        onClick={toggleAccordion}
        className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-850/60 transition group select-none min-h-[56px] w-full"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner group-hover:scale-105 transition">
            <Radio className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-white flex items-center gap-2 flex-wrap">
              <span>
                {isAr
                  ? 'القنوات الميدانية التي تكفلها حالياً (كبسولة الإدارة ورادار النقاء)'
                  : 'My Sponsored Field Channels'}
              </span>
              <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono px-2.5 py-0.5 rounded-full font-bold">
                {sponsoredPublishers.length}
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {isAr
                ? 'إدارة كفالاتك المباشرة، متابعة حالات الخمول (45 يوماً)، ورصد التنبيهات من رادار النقاء والأمان'
                : 'Manage active non-monetary channel sponsorships and monitor integrity health indicators'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={toggleAccordion}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2.5 rounded-xl transition cursor-pointer min-h-[44px] shadow-md active:scale-95 touch-manipulation"
          >
            <Radio className="w-4 h-4 text-slate-950" />
            <span>
              {isAr 
                ? (`إدارة القنوات المتبناة (${sponsoredPublishers.length})`) 
                : (`Manage Active Channels (${sponsoredPublishers.length})`)}
            </span>
          </button>

          <button
            type="button"
            onClick={toggleAccordion}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/30 transition flex items-center justify-center min-h-[44px] min-w-[44px] cursor-pointer touch-manipulation active:scale-95 shrink-0"
            title={isOpen ? (isAr ? 'طَي المنسدلة' : 'Collapse') : (isAr ? 'توسيع المنسدلة' : 'Expand')}
          >
            <ChevronDown className={`w-5 h-5 text-amber-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 md:p-6 space-y-5 animate-fade-in border-t border-slate-800/60 bg-slate-900/50">
          {sponsoredPublishers.length === 0 ? (
            <AccordionEmptyState
              titleAr="لم تقم بتبني أي قناة ميدانية بعد"
              titleEn="No Field Channels Adopted Yet"
              descriptionAr="تصفح قائمة القنوات الميدانية المعتمدة وقم بتبني قناتين أو أكثر لتأكيد شارة التوثيق وتفعيل كافة مزايا جناح الكفيل السيادي."
              descriptionEn="Explore field channels and adopt 2 or more channels to unlock all sponsor suite privileges."
              icon={Radio}
              actionLabelAr="استكشاف وتبني قناة جديدة"
              actionLabelEn="Explore & Adopt Channel"
              onAction={onExploreClick}
              badgeTextAr="جاهز للتبني"
              badgeTextEn="Ready for Adoption"
              lang={isAr ? 'ar' : 'en'}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
              {sponsoredPublishers.map((pub) => (
                <div
                  key={pub.id}
                  className="bg-slate-950/80 backdrop-blur-md border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 space-y-4 shadow-xl relative overflow-hidden group transition-all duration-300"
                >
                  {/* Channel Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={pub.avatar}
                        alt={pub.name}
                        className="w-12 h-12 rounded-xl object-cover border border-amber-400/40 shrink-0"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                          <span>{pub.name}</span>
                          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                        </h4>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{pub.location}</span>
                        </p>
                      </div>
                    </div>

                    <span className="flex items-center gap-1 bg-slate-900 text-slate-300 text-[10px] font-bold px-2 py-1 rounded-lg border border-slate-800 shrink-0">
                      {getPlatformIcon(pub.platform)}
                      <span>{pub.platform}</span>
                    </span>
                  </div>

                  {/* Channel Status & Integrity Radar Flags */}
                  <div className="space-y-2 pt-2 border-t border-slate-900">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{isAr ? 'نوعية الكفالة والتبني:' : 'Sponsorship Type:'}</span>
                      {pub.verificationLevel === 'PLATINUM' || (pub.fairScore && pub.fairScore >= 60) || pub.isGazaPilot ? (
                        <span className="bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold flex items-center gap-1">
                          <Crown className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{isAr ? 'عرّاب (كفالة شاملة)' : 'Godfather'}</span>
                        </span>
                      ) : (
                        <span className="bg-purple-500/15 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30 font-bold flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-purple-400 shrink-0" />
                          <span>{isAr ? 'توجيه وإسناد معنوي' : 'Guidance'}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{isAr ? 'حالة النقاء:' : 'Integrity:'}</span>
                      {pub.reportsCount > 0 ? (
                        <span className="bg-rose-500/10 text-rose-300 px-2 py-0.5 rounded border border-rose-500/30 font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-400 shrink-0" />
                          <span>{isAr ? 'تنبيه: بلاغ قيد التحقيق' : 'Flagged'}</span>
                        </span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{isAr ? '100% نقي ومعتمد' : 'Clean'}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">{isAr ? 'نشاط النشر:' : 'Activity:'}</span>
                      {pub.status === 'DORMANT_CHANNEL' ? (
                        <span className="bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold flex items-center gap-1">
                          <History className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{isAr ? 'خاملة (تجاوزت 45 يوماً)' : 'Dormant 45+ days'}</span>
                        </span>
                      ) : (
                        <span className="text-emerald-300 font-bold">
                          {isAr ? 'نشطة ومستمرة' : 'Active'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                    <button
                      onClick={() => onSendGuidanceClick(pub.id)}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold py-2.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer min-h-[44px]"
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span>{isAr ? 'إرسال توجيه ودعم' : 'Send Guidance'}</span>
                    </button>

                    <button
                      onClick={() => onCancelSponsorshipClick(pub.id)}
                      className="bg-slate-900 hover:bg-rose-950 text-slate-400 hover:text-rose-300 text-xs font-medium px-3 py-2.5 rounded-xl border border-slate-800 transition cursor-pointer min-h-[44px]"
                      title={isAr ? 'إلغاء تبني هذه القناة' : 'Cancel Sponsorship'}
                    >
                      {isAr ? 'إلغاء الكفالة' : 'Cancel'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

SponsoredChannelsGrid.displayName = 'SponsoredChannelsGrid';

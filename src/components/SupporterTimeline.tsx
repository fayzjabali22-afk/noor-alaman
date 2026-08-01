import React, { useState, useMemo } from 'react';
import {
  SupporterAction,
  Publisher,
  Language,
  PlatformType,
} from '../types';
import {
  History,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  Heart,
  ShieldAlert,
  Youtube,
  Send,
  X as XIcon,
  Facebook,
  Instagram,
  Video,
  Globe,
  Award,
  Layers,
  ArrowUpDown,
  Building2,
  Share2,
} from 'lucide-react';

export interface SupporterTimelineProps {
  supporterActions: SupporterAction[];
  publishers?: Publisher[];
  lang?: Language;
  onRevisitChannel?: (action: SupporterAction) => void;
  onSelectPublisher?: (publisherId: string) => void;
  className?: string;
}

export type TimelineFilterType = 'ALL' | 'VISIT' | 'REPORT' | 'BOOKMARK' | 'SHARE';

export const SupporterTimeline: React.FC<SupporterTimelineProps> = ({
  supporterActions,
  publishers = [],
  lang = 'ar',
  onRevisitChannel,
  onSelectPublisher,
  className = '',
}) => {
  const isAr = lang === 'ar';

  // Component Filter & Search local state (pure presentation logic)
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<TimelineFilterType>('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'ALL'>('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');
  const [viewMode, setViewMode] = useState<'TIMELINE' | 'COMPACT'>('TIMELINE');

  // Platform Icon Helper
  const getPlatformIcon = (platform: PlatformType) => {
    switch (platform) {
      case 'YouTube':
        return <Youtube className="w-4 h-4 text-red-500 shrink-0" />;
      case 'Telegram':
        return <Send className="w-4 h-4 text-sky-400 shrink-0" />;
      case 'X':
        return <XIcon className="w-4 h-4 text-slate-200 shrink-0" />;
      case 'Facebook':
        return <Facebook className="w-4 h-4 text-blue-500 shrink-0" />;
      case 'Instagram':
        return <Instagram className="w-4 h-4 text-pink-500 shrink-0" />;
      case 'TikTok':
        return <Video className="w-4 h-4 text-teal-400 shrink-0" />;
      default:
        return <Globe className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
  };

  // Map publisher details by ID for rapid lookup
  const publisherMap = useMemo(() => {
    const map = new Map<string, Publisher>();
    publishers.forEach((p) => map.set(p.id, p));
    return map;
  }, [publishers]);

  // Derived filtered & sorted timeline items
  const processedActions = useMemo(() => {
    let list = [...supporterActions];

    // Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((act) => {
        const pub = publisherMap.get(act.publisherId);
        return (
          act.publisherName.toLowerCase().includes(q) ||
          act.platform.toLowerCase().includes(q) ||
          act.id.toLowerCase().includes(q) ||
          (pub && (pub.location.toLowerCase().includes(q) || pub.category.toLowerCase().includes(q)))
        );
      });
    }

    // Platform Filter
    if (selectedPlatform !== 'ALL') {
      list = list.filter((act) => act.platform === selectedPlatform);
    }

    // Sorting Order
    list.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return sortOrder === 'NEWEST' ? timeB - timeA : timeA - timeB;
    });

    return list;
  }, [supporterActions, searchQuery, selectedPlatform, sortOrder, publisherMap]);

  // Statistics Summary Calculations
  const stats = useMemo(() => {
    const totalVisits = supporterActions.length;
    const uniquePublisherIds = new Set(supporterActions.map((a) => a.publisherId)).size;
    // Each visit contributes 5 impact points towards the fair engine distribution
    const totalImpactPoints = totalVisits * 5;
    const lastActivity = supporterActions.length > 0
      ? new Date(supporterActions[0].timestamp).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : null;

    return { totalVisits, uniquePublisherIds, totalImpactPoints, lastActivity };
  }, [supporterActions, isAr]);

  // Date Grouping Helper for Timeline View
  const groupedActions = useMemo(() => {
    const groups: { [dateKey: string]: SupporterAction[] } = {};

    processedActions.forEach((act) => {
      const dateObj = new Date(act.timestamp);
      const dateKey = isNaN(dateObj.getTime())
        ? (isAr ? 'تفاعلات حديثة' : 'Recent Actions')
        : dateObj.toLocaleDateString(isAr ? 'ar-EG' : 'en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(act);
    });

    return Object.entries(groups);
  }, [processedActions, isAr]);

  // Relative Time Formatter
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return timestamp;

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return isAr ? 'منذ لحظات' : 'just now';
    if (diffInSeconds < 3600) {
      const mins = Math.floor(diffInSeconds / 60);
      return isAr ? `منذ ${mins} دقيقة` : `${mins}m ago`;
    }
    if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return isAr ? `منذ ${hours} ساعة` : `${hours}h ago`;
    }
    return date.toLocaleTimeString(isAr ? 'ar-EG' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-6 space-y-6 shadow-xl relative overflow-hidden ${className}`}>
      {/* Background Subtle Accent Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Banner & Sovereign Command Badge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
              <History className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isAr ? 'سجل نشاط الداعم والتفاعلات الزمانية' : 'Supporter Activity Timeline'}</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-mono">
              [الأمر السيادي رقم 55.43]
            </span>
          </div>

          <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2 pt-1">
            <span>{isAr ? 'الجدول الزمني التفاعلي لعمليات التحويل والدعم' : 'Interactive Support Outbound Timeline'}</span>
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {isAr
              ? 'تتبع كامل وموثق لجميع زيارات التوجيه الخارجي ودعم القنوات الميدانية المعتمدة، مع ربط دقيق بمحرك العدالة الإنسانية.'
              : 'Complete transparent audit of all outbound redirections and support actions for verified field channels.'}
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('TIMELINE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'TIMELINE'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{isAr ? 'خط زمني' : 'Timeline'}</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('COMPACT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'COMPACT'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isAr ? 'شبكي مدمج' : 'Grid'}</span>
          </button>
        </div>
      </div>

      {/* Statistics Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Actions */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{isAr ? 'إجمالي زيارات التوجيه' : 'Total Redirections'}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg font-bold text-white font-mono">{stats.totalVisits}</div>
          <span className="text-[10px] text-emerald-400 block">{isAr ? 'زيارة موثقة معتمدة' : 'Verified visits'}</span>
        </div>

        {/* Unique Channels */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{isAr ? 'قنوات فريدة مدعومة' : 'Unique Channels'}</span>
            <Building2 className="w-3.5 h-3.5 text-sky-400" />
          </div>
          <div className="text-lg font-bold text-sky-300 font-mono">{stats.uniquePublisherIds}</div>
          <span className="text-[10px] text-sky-400 block">{isAr ? 'ناشر ميداني مستفيد' : 'Field publishers'}</span>
        </div>

        {/* Impact Points */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{isAr ? 'نقاط الأثر المضافة' : 'Fair Engine Impact'}</span>
            <Award className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg font-bold text-amber-300 font-mono">+{stats.totalImpactPoints}</div>
          <span className="text-[10px] text-amber-400 block">{isAr ? 'مساهمة في العدالة' : 'Fair score boost'}</span>
        </div>

        {/* Last Activity */}
        <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{isAr ? 'آخر تفاعل مسجل' : 'Last Activity'}</span>
            <Calendar className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="text-xs font-bold text-slate-200 truncate font-mono">
            {stats.lastActivity || (isAr ? 'لا يوجد بعد' : 'None yet')}
          </div>
          <span className="text-[10px] text-purple-400 block">{isAr ? 'تزامن موثق لحظياً' : 'Real-time sync'}</span>
        </div>
      </div>

      {/* Interactive Controls Bar: Search + Platform Filter + Sort Toggle */}
      <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute right-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'بحث باسم الناشر أو المنصة أو المعرّف...' : 'Search channel name, platform...'}
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pr-9 pl-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* Platform Dropdown & Sorting Order */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value as any)}
            className="bg-slate-900 text-slate-300 border border-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">{isAr ? 'جميع المنصات' : 'All Platforms'}</option>
            <option value="YouTube">YouTube</option>
            <option value="Telegram">Telegram</option>
            <option value="X">X (Twitter)</option>
            <option value="Facebook">Facebook</option>
            <option value="Instagram">Instagram</option>
            <option value="TikTok">TikTok</option>
          </select>

          {/* Sort Order Button */}
          <button
            type="button"
            onClick={() => setSortOrder((prev) => (prev === 'NEWEST' ? 'OLDEST' : 'NEWEST'))}
            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg flex items-center gap-1.5 transition cursor-pointer shrink-0"
            title={isAr ? 'تغيير ترتيب العرض الزمني' : 'Toggle Date Order'}
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-emerald-400" />
            <span>{sortOrder === 'NEWEST' ? (isAr ? 'الأحدث أولاً' : 'Newest First') : (isAr ? 'الأقدم أولاً' : 'Oldest First')}</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: TIMELINE VIEW or COMPACT GRID VIEW */}
      {processedActions.length === 0 ? (
        /* Empty State */
        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
            <History className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-300">
            {isAr ? 'لا توجد تفاعلات مطابقة للبحث أو التصفية' : 'No matching interactions found'}
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {supporterActions.length === 0
              ? (isAr
                  ? 'لم تقم بتسجيل أي زيارات تحويلية حتى الآن. اضغط على "انتقال للقناة الأصلية" في أي بطاقة ناشر لبدء سجلك.'
                  : 'You have not performed any outbound redirections yet. Click "Go to Official Channel" on any publisher card to begin.')
              : (isAr ? 'جرّب تعديل مصطلحات البحث أو إعادة تعيين الفلاتر.' : 'Try adjusting your search terms or filters.')}
          </p>
        </div>
      ) : viewMode === 'TIMELINE' ? (
        /* Vertical Chronological Timeline View */
        <div className="space-y-8 relative before:absolute before:top-3 before:bottom-3 before:right-6 md:before:right-8 before:w-0.5 before:bg-slate-800">
          {groupedActions.map(([dateString, actionsInGroup]) => (
            <div key={dateString} className="space-y-4 relative">
              {/* Date Group Sticky Header Node */}
              <div className="flex items-center gap-3 pr-1">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-950 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center z-10 shadow-lg shadow-emerald-950/40 shrink-0">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="bg-slate-950/90 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs font-bold text-emerald-300 shadow-md">
                  {dateString}
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  ({actionsInGroup.length} {isAr ? 'تفاعل' : 'actions'})
                </span>
              </div>

              {/* Action Cards inside this Date Group */}
              <div className="space-y-3 pr-12 md:pr-16">
                {actionsInGroup.map((act, index) => {
                  const publisherDetails = publisherMap.get(act.publisherId);

                  return (
                    <div
                      key={act.id}
                      className="bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-4 transition shadow-md hover:shadow-xl space-y-3 group relative overflow-hidden"
                    >
                      {/* Left accent indicator */}
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500" />

                      {/* Top Row: Publisher Info + Action Badge + Time */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {publisherDetails?.avatar ? (
                            <img
                              src={publisherDetails.avatar}
                              alt={act.publisherName}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-700 shrink-0"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                              {getPlatformIcon(act.platform)}
                            </div>
                          )}

                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h5
                                onClick={() => onSelectPublisher && onSelectPublisher(act.publisherId)}
                                className={`text-xs md:text-sm font-bold text-white hover:text-emerald-300 transition ${
                                  onSelectPublisher ? 'cursor-pointer underline decoration-dotted' : ''
                                }`}
                              >
                                {act.publisherName}
                              </h5>
                              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1">
                                {getPlatformIcon(act.platform)}
                                <span>{act.platform}</span>
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                              <span>{publisherDetails?.location || (isAr ? 'فلسطين' : 'Palestine')}</span>
                              {publisherDetails?.category && (
                                <span className="text-emerald-400 bg-emerald-950/50 px-1.5 py-0.2 rounded text-[10px]">
                                  {publisherDetails.category}
                                </span>
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1">
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold flex items-center gap-1 shrink-0">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{isAr ? 'تم التوجيه بنجاح' : 'Redirected'}</span>
                          </span>

                          <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{formatRelativeTime(act.timestamp)}</span>
                          </span>
                        </div>
                      </div>

                      {/* Middle Row: Sovereign Command Audit Line */}
                      <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span className="font-mono text-slate-300">
                            {isAr ? `معرف العملية: ${act.id}` : `Action ID: ${act.id}`}
                          </span>
                        </div>
                        <span className="text-emerald-400 font-mono text-[10px]">
                          +5 {isAr ? 'نقاط دعم' : 'Impact pts'}
                        </span>
                      </div>

                      {/* Bottom Row: Revisit Action Button */}
                      <div className="flex items-center justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => onRevisitChannel && onRevisitChannel(act)}
                          className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-emerald-600 hover:text-slate-950 text-emerald-300 font-bold text-xs border border-emerald-500/30 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>{isAr ? 'إعادة التوجيه للقناة الرسمية' : 'Revisit Official Channel'}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Compact Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {processedActions.map((act) => {
            const publisherDetails = publisherMap.get(act.publisherId);

            return (
              <div
                key={act.id}
                className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3 shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {publisherDetails?.avatar ? (
                      <img
                        src={publisherDetails.avatar}
                        alt={act.publisherName}
                        className="w-9 h-9 rounded-lg object-cover border border-slate-700"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center">
                        {getPlatformIcon(act.platform)}
                      </div>
                    )}
                    <div>
                      <h5 className="text-xs font-bold text-white truncate max-w-[140px]">{act.publisherName}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">{act.platform}</span>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 text-[10px] font-bold border border-emerald-500/20">
                    {isAr ? 'تم التوجيه' : 'Visited'}
                  </span>
                </div>

                <div className="text-[10px] text-slate-500 font-mono flex items-center justify-between border-t border-slate-900 pt-2">
                  <span>{new Date(act.timestamp).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</span>
                  <span className="text-amber-400">+5 pts</span>
                </div>

                <button
                  type="button"
                  onClick={() => onRevisitChannel && onRevisitChannel(act)}
                  className="w-full py-2 rounded-lg bg-slate-900 hover:bg-emerald-600 text-emerald-300 hover:text-slate-950 font-bold text-xs border border-emerald-500/30 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <span>{isAr ? 'زيارة جديدة' : 'Revisit'}</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

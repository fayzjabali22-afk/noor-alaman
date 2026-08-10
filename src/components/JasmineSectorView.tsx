import React, { useState, useCallback, useMemo } from 'react';
import { JasmineCelebrity, Language } from '../types';
import { translations } from '../lib/i18n';
import { JasmineMediaCard } from './JasmineMediaCard';
import {
  Award,
  ShieldCheck,
  Video,
  Filter,
  Search,
  Tag,
  UserCheck,
  XCircle,
  ChevronDown,
  Globe,
  ArrowLeftRight,
  Info,
  Share2,
  Tv,
  Users,
  Zap,
} from 'lucide-react';

export interface JasmineSectorViewProps {
  celebrities: JasmineCelebrity[];
  setCelebrities?: React.Dispatch<React.SetStateAction<JasmineCelebrity[]>>;
  lang: Language;
  accountVerificationStatus?: 'VERIFIED' | 'PENDING' | 'REJECTED';
  isGhostMode?: boolean;
  onNavigateToSupporterPortal?: () => void;
}

/**
 * JasmineSectorView (لوحة شرف قطاع الياسمين للمشاهير والداعمين)
 * Pure Presentational / Dumb UI Component compliant with NA-DUMB-UI-CONSTRAINT-001 & NA-SOVEREIGN-ORDER-060.
 * Zero data-entry, zero embedded internal video players, 100% Outbound Redirection & Honor Board UI.
 */
export const JasmineSectorView: React.FC<JasmineSectorViewProps> = ({
  celebrities,
  lang,
  isGhostMode = false,
  onNavigateToSupporterPortal,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quadruple Smart Filter Bar States
  const [isFilterAccordionOpen, setIsFilterAccordionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSupporterType, setSelectedSupporterType] = useState('ALL');
  const [selectedPlatform, setSelectedPlatform] = useState('ALL');

  const handleCopyLink = useCallback((id: string, link: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link).catch((err) => {
        console.error("Error in Noor Al-Amani Module:", err);
      });
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  }, []);

  // Quadruple Smart Filter & Search Logic (0ms / 60FPS using useMemo)
  const filteredCelebrities = useMemo(() => {
    return celebrities.filter((item) => {
      // Search match
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.celebrityName.toLowerCase().includes(q) ||
        item.titleRole.toLowerCase().includes(q) ||
        item.humanitarianStatement.toLowerCase().includes(q) ||
        (item.endorsedCampaign && item.endorsedCampaign.toLowerCase().includes(q));

      // Country match
      const itemCountry = (item as any).country || 'فلسطين';
      const matchesCountry = selectedCountry === 'ALL' || itemCountry === selectedCountry;

      // Category / Domain match
      const itemCategory = (item as any).category || 'تغطية إنسانية وتطوعية';
      const matchesCategory =
        selectedCategory === 'ALL' || itemCategory.includes(selectedCategory) || selectedCategory.includes(itemCategory);

      // Supporter Type match
      const matchesSupporterType =
        selectedSupporterType === 'ALL' ||
        item.titleRole.includes(selectedSupporterType) ||
        (selectedSupporterType === 'شخصية عامة' &&
          (item.titleRole.includes('إعلام') ||
            item.titleRole.includes('صحف') ||
            item.titleRole.includes('فن') ||
            item.titleRole.includes('شخصية'))) ||
        (selectedSupporterType === 'سفير إنساني' &&
          (item.titleRole.includes('سفير') || item.titleRole.includes('تمكين') || item.titleRole.includes('داعم'))) ||
        (selectedSupporterType === 'كفيل مؤسسي' &&
          (item.titleRole.includes('مؤسس') || item.titleRole.includes('شركة') || item.titleRole.includes('شبكة')));

      // Platform match
      const rawPlatform = (item as any).platform || '';
      const url = (item.videoUrl || '').toLowerCase();
      const detectedPlatform =
        rawPlatform ||
        (url.includes('youtube') || url.includes('youtu.be')
          ? 'YouTube'
          : url.includes('tiktok')
            ? 'TikTok'
            : url.includes('x.com') || url.includes('twitter')
              ? 'X'
              : url.includes('t.me') || url.includes('telegram')
                ? 'Telegram'
                : url.includes('instagram')
                  ? 'Instagram'
                  : url.includes('facebook')
                    ? 'Facebook'
                    : 'YouTube');

      const matchesPlatform =
        selectedPlatform === 'ALL' ||
        detectedPlatform.toLowerCase() === selectedPlatform.toLowerCase() ||
        url.includes(selectedPlatform.toLowerCase());

      return matchesSearch && matchesCountry && matchesCategory && matchesSupporterType && matchesPlatform;
    });
  }, [celebrities, searchQuery, selectedCountry, selectedCategory, selectedSupporterType, selectedPlatform]);

  const memoizedCelebrityList = useMemo(() => {
    return filteredCelebrities.map((item) => (
      <JasmineMediaCard
        key={item.id}
        item={item}
        copiedId={copiedId}
        onCopyLink={handleCopyLink}
        lang={lang}
        isGhostMode={isGhostMode}
      />
    ));
  }, [filteredCelebrities, copiedId, handleCopyLink, lang, isGhostMode]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCountry('ALL');
    setSelectedCategory('ALL');
    setSelectedSupporterType('ALL');
    setSelectedPlatform('ALL');
  }, []);

  // Active Filters Count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim() !== '') count++;
    if (selectedCountry !== 'ALL') count++;
    if (selectedCategory !== 'ALL') count++;
    if (selectedSupporterType !== 'ALL') count++;
    if (selectedPlatform !== 'ALL') count++;
    return count;
  }, [searchQuery, selectedCountry, selectedCategory, selectedSupporterType, selectedPlatform]);

  const hasActiveFilters = activeFiltersCount > 0;

  // Impact Metrics Calculations
  const totalCampaigns = celebrities.length;
  const adoptedCreatorsCount = useMemo(() => {
    return celebrities.filter((c) => c.endorsedCampaign || c.videoUrl).length;
  }, [celebrities]);


  return (
    <div className="w-full px-2 sm:px-4 space-y-5 dir-rtl text-right">
      {/* 1. Sovereign Header Banner — Honor & Recognition Wall */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/60 border border-amber-500/40 rounded-3xl p-5 md:p-7 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30 shadow-inner">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'قطاع الياسمين: لوحة شرف ومعاينة صامتة' : 'Jasmine Sector: Sovereign Honor Wall'}</span>
            </div>

            <h2 className="text-lg md:text-2xl font-black text-white tracking-wide leading-tight">
              {isAr ? 'لوحة شرف إشهار الداعمين والمشاهير الكافلين للقنوات' : 'Wall of Honor for Celebrity & Public Sponsors'}
            </h2>

            <p className="text-slate-300 text-xs md:text-sm max-w-3xl leading-relaxed font-medium">
              {isAr
                ? 'واجهة إشهار ومعاينة صامتة تحتفي بكافة الشخصيات العامة والداعمين الذين كفلوا وتبنوا قنوات ميدانية معتمدة. إشهار إنساني شفاف يبرز الدور التمكيني للداعم بنسبة 100% بكلفة صفرية.'
                : 'A ceremonial hall of honor recognizing public figures and sponsors adopting field channels with zero-bandwidth impact.'}
            </p>
          </div>

          {/* Supporter Portal Banner Guidance Link */}
          {onNavigateToSupporterPortal && (
            <button
              type="button"
              onClick={onNavigateToSupporterPortal}
              className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs md:text-sm shadow-xl shadow-amber-500/20 transition cursor-pointer active:scale-95 shrink-0 min-h-[44px]"
            >
              <ArrowLeftRight className="w-4 h-4 text-slate-950" />
              <span>{isAr ? 'الانتقال إلى بوابة الداعم لكفالة قناة' : 'Go to Supporter Portal'}</span>
            </button>
          )}
        </div>

        {/* Impact Metrics Banner (شريط المؤشرات الإحصائية السيادي المدمج) */}
        <div className="mt-4 pt-3 border-t border-amber-500/20 flex flex-row items-center justify-between gap-1.5 sm:gap-3">
          <div className="flex-1 p-2 sm:p-2.5 rounded-2xl bg-slate-950/80 border border-amber-500/25 flex items-center justify-center gap-1.5 sm:gap-2.5 backdrop-blur-md shadow-md">
            <div className="p-1.5 rounded-xl bg-amber-500/15 text-amber-400 shrink-0">
              <Tv className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            </div>
            <div className="text-right min-w-0">
              <span className="block text-[9px] sm:text-xs text-amber-300/80 font-extrabold truncate leading-tight">{isAr ? 'إجمالي القنوات' : 'Total Channels'}</span>
              <span className="text-xs sm:text-base md:text-lg font-black text-amber-400 leading-none">{totalCampaigns}</span>
            </div>
          </div>

          <div className="flex-1 p-2 sm:p-2.5 rounded-2xl bg-slate-950/80 border border-emerald-500/25 flex items-center justify-center gap-1.5 sm:gap-2.5 backdrop-blur-md shadow-md">
            <div className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 shrink-0">
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
            </div>
            <div className="text-right min-w-0">
              <span className="block text-[9px] sm:text-xs text-emerald-300/80 font-extrabold truncate leading-tight">{isAr ? 'المبدعون المكفولون' : 'Adopted Creators'}</span>
              <span className="text-xs sm:text-base md:text-lg font-black text-emerald-400 leading-none">{adoptedCreatorsCount}</span>
            </div>
          </div>

          <div className="flex-1 p-2 sm:p-2.5 rounded-2xl bg-slate-950/80 border border-cyan-500/25 flex items-center justify-center gap-1.5 sm:gap-2.5 backdrop-blur-md shadow-md">
            <div className="p-1.5 rounded-xl bg-cyan-500/15 text-cyan-400 shrink-0">
              <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400" />
            </div>
            <div className="text-right min-w-0">
              <span className="block text-[9px] sm:text-xs text-cyan-300/80 font-extrabold truncate leading-tight">{isAr ? 'سرعة الاستجابة' : 'Response Speed'}</span>
              <span className="text-xs sm:text-base md:text-lg font-black text-cyan-400 leading-none">100%</span>
            </div>
          </div>
        </div>

        {/* Exclusive Supporter Portal Policy Notice */}
        <div className="mt-3 pt-2 flex items-center gap-2 text-[11px] text-amber-300 font-semibold">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            {isAr
              ? 'ملاحظة تنظيمية: تُدار كافة عمليات الانتساب، رفع الروابط، وتوجيه الكفالات رسمياً وحصرياً من داخل (بوابة الداعم).'
              : 'Affiliation and channel adoption are managed exclusively via the Supporter Portal.'}
          </span>
        </div>
      </div>

      {/* 2. Triple Smart Filter Bar Accordion */}
      <div className="bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/50 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden transition-all duration-300">
        <div
          id="jasmine-filter-accordion-header"
          role="button"
          tabIndex={0}
          aria-expanded={isFilterAccordionOpen}
          aria-controls="jasmine-filter-accordion-panel"
          onClick={() => setIsFilterAccordionOpen(!isFilterAccordionOpen)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsFilterAccordionOpen(!isFilterAccordionOpen);
            }
          }}
          className="flex items-center justify-between p-4 cursor-pointer bg-slate-900/90 hover:bg-slate-800/60 active:scale-[0.99] transition select-none min-h-[52px]"
        >
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
                <span>{isAr ? 'مُحرك البحث والفلترة الذكية الشاملة' : 'Comprehensive Smart Search Engine'}</span>
                {hasActiveFilters && (
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/40 shadow-sm animate-pulse">
                    {isAr ? `${activeFiltersCount} فلاتر مفعّلة` : `${activeFiltersCount} Active Filters`}
                  </span>
                )}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 active:scale-95 px-2.5 py-1.5 rounded-lg border border-rose-500/20 transition cursor-pointer min-h-[36px]"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>{isAr ? 'إعادة ضبط' : 'Reset'}</span>
              </button>
            )}

            <button
              type="button"
              aria-expanded={isFilterAccordionOpen}
              aria-controls="jasmine-filter-accordion-panel"
              onClick={() => setIsFilterAccordionOpen(!isFilterAccordionOpen)}
              className="p-2 rounded-xl bg-slate-950 text-amber-400 hover:text-amber-300 hover:bg-slate-900 border border-slate-800 active:scale-95 transition flex items-center gap-1 cursor-pointer min-h-[44px] min-w-[44px]"
              title={isFilterAccordionOpen ? (isAr ? 'إغلاق الفلترة' : 'Collapse') : (isAr ? 'فتح الفلترة' : 'Expand')}
            >
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFilterAccordionOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Collapsible Accordion Body with Smooth CSS Grid Height & Opacity Transition */}
        <div
          id="jasmine-filter-accordion-panel"
          role="region"
          aria-labelledby="jasmine-filter-accordion-header"
          className={`grid transition-all duration-300 ease-in-out border-slate-800/80 bg-slate-950/60 ${
            isFilterAccordionOpen
              ? 'grid-rows-[1fr] opacity-100 p-4 pt-2 border-t'
              : 'grid-rows-[0fr] opacity-0 p-0 overflow-hidden border-t-0'
          }`}
        >
          <div className="overflow-hidden space-y-3">
            {/* Live Search Bar */}
            <div className="relative pt-1">
              <label htmlFor="jasmine-search-input" className="block text-[10px] text-slate-400 mb-1 font-bold flex items-center gap-1">
                <Search className="w-3 h-3 text-amber-400" />
                <span>{isAr ? 'البحث بالاسم، البيان، أو اسم القناة:' : 'Search Name, Statement, or Channel:'}</span>
              </label>
              <div className="relative">
                <input
                  id="jasmine-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'ابحث عن داعم، مشهور، أو قناة ميدانية...' : 'Search supporter or channel...'}
                  className="w-full bg-slate-950 text-slate-100 text-xs sm:text-sm rounded-xl pl-3 pr-9 py-2.5 border border-emerald-500/20 hover:border-emerald-500/40 focus:border-amber-500 outline-none transition min-h-[44px] shadow-inner"
                />
                <Search className="w-4 h-4 absolute right-3 top-3 text-slate-500" />
              </div>
            </div>

            {/* 4-Dropdown Filter Grid (Quadruple Filter Grid Layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-1">
              {/* Country Filter */}
              <div>
                <label htmlFor="jasmine-country-select" className="block text-[10px] text-slate-400 mb-1 font-bold flex items-center gap-1">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>{isAr ? '1. الدولة / الإقليم:' : '1. Country:'}</span>
                </label>
                <select
                  id="jasmine-country-select"
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-emerald-500/20 hover:border-emerald-500/40 focus:border-amber-500 outline-none cursor-pointer font-medium transition min-h-[44px] shadow-inner"
                >
                  <option value="ALL">{isAr ? 'جميع الدول والأقاليم' : 'All Countries'}</option>
                  <option value="فلسطين">{isAr ? '🇵🇸 فلسطين' : 'Palestine'}</option>
                  <option value="الأردن">{isAr ? '🇯🇴 الأردن' : 'Jordan'}</option>
                  <option value="مصر">{isAr ? '🇪🇬 مصر' : 'Egypt'}</option>
                  <option value="الإمارات">{isAr ? '🇦🇪 الإمارات' : 'UAE'}</option>
                  <option value="قطر">{isAr ? '🇶🇦 قطر' : 'Qatar'}</option>
                  <option value="السعودية">{isAr ? '🇸🇦 السعودية' : 'Saudi Arabia'}</option>
                  <option value="الكويت">{isAr ? '🇰🇼 الكويت' : 'Kuwait'}</option>
                  <option value="العراق">{isAr ? '🇮🇶 العراق' : 'Iraq'}</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label htmlFor="jasmine-category-select" className="block text-[10px] text-slate-400 mb-1 font-bold flex items-center gap-1">
                  <Tag className="w-3 h-3 text-cyan-400" />
                  <span>{isAr ? '2. نوع المحتوى / المجال:' : '2. Domain:'}</span>
                </label>
                <select
                  id="jasmine-category-select"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-emerald-500/20 hover:border-emerald-500/40 focus:border-amber-500 outline-none cursor-pointer font-medium transition min-h-[44px] shadow-inner"
                >
                  <option value="ALL">{isAr ? 'جميع المجالات' : 'All Domains'}</option>
                  <option value="إنساني وإغاثي">{isAr ? '❤️ إنساني وإغاثي' : 'Humanitarian & Relief'}</option>
                  <option value="إعلام وصحافة">{isAr ? '📰 إعلام وصحافة ميدانية' : 'Media & Field Journalism'}</option>
                  <option value="معرفي وتعليمي">{isAr ? '🎓 معرفي وتعليمي' : 'Educational & Knowledge'}</option>
                  <option value="فني وثقافي">{isAr ? '🎨 فني وثقافي' : 'Arts & Culture'}</option>
                </select>
              </div>

              {/* Supporter Type Filter */}
              <div>
                <label htmlFor="jasmine-type-select" className="block text-[10px] text-slate-400 mb-1 font-bold flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-purple-400" />
                  <span>{isAr ? '3. صفة الداعم:' : '3. Supporter Type:'}</span>
                </label>
                <select
                  id="jasmine-type-select"
                  value={selectedSupporterType}
                  onChange={(e) => setSelectedSupporterType(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-emerald-500/20 hover:border-emerald-500/40 focus:border-amber-500 outline-none cursor-pointer font-medium transition min-h-[44px] shadow-inner"
                >
                  <option value="ALL">{isAr ? 'جميع التصنيفات' : 'All Types'}</option>
                  <option value="شخصية عامة">{isAr ? '🌟 شخصية عامة / مشهور' : 'Public Figure'}</option>
                  <option value="سفير إنساني">{isAr ? '🎗️ سفير إنساني' : 'Ambassador'}</option>
                  <option value="كفيل مؤسسي">{isAr ? '🏛️ كفيل مؤسسي' : 'Institutional'}</option>
                </select>
              </div>

              {/* 4. Platform Filter */}
              <div>
                <label htmlFor="jasmine-platform-select" className="block text-[10px] text-slate-400 mb-1 font-bold flex items-center gap-1">
                  <Share2 className="w-3 h-3 text-amber-400" />
                  <span>{isAr ? '4. منصة المحتوى / المنصة:' : '4. Platform:'}</span>
                </label>
                <select
                  id="jasmine-platform-select"
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-emerald-500/20 hover:border-emerald-500/40 focus:border-amber-500 outline-none cursor-pointer font-medium transition min-h-[44px] shadow-inner"
                >
                  <option value="ALL">{isAr ? 'جميع المنصات' : 'All Platforms'}</option>
                  <option value="YouTube">{isAr ? '▶️ YouTube (يوتيوب)' : 'YouTube'}</option>
                  <option value="TikTok">{isAr ? '🎵 TikTok (تيك توك)' : 'TikTok'}</option>
                  <option value="X">{isAr ? '𝕏 X / Twitter (إكس)' : 'X / Twitter'}</option>
                  <option value="Telegram">{isAr ? '✈️ Telegram (تلغرام)' : 'Telegram'}</option>
                  <option value="Instagram">{isAr ? '📸 Instagram (إنستغرام)' : 'Instagram'}</option>
                  <option value="Facebook">{isAr ? '📘 Facebook (فيسبوك)' : 'Facebook'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Celebrity Honor Cards Grid (Zero-Wasted Pixels Edge-to-Edge) */}
      {filteredCelebrities.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-200">
            {isAr ? 'لا توجد نتائج تطابق خيارات الفلترة المحددة' : 'No Supporters Found for Selected Filters'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {isAr
              ? 'يرجى تغيير معايير البحث أو الضغط على زر "إعادة ضبط الفلاتر" لاستعراض كامل لوحة الشرف.'
              : 'Please reset filters to view all supporters.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {memoizedCelebrityList}
        </div>
      )}
    </div>
  );
};

export default JasmineSectorView;

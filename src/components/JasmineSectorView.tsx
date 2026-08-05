import React, { useState, useCallback, useMemo } from 'react';
import { JasmineCelebrity, Language } from '../types';
import { translations } from '../lib/i18n';
import {
  parseAndValidateJasmineVideo,
  archiveAndUpdateJasmineLink,
  JasmineVideoArchiveItem,
  OneWayGuidanceNote,
  INITIAL_GUIDANCE_NOTES,
} from '../services/jasmineService';
import { JasmineMediaCard } from './JasmineMediaCard';
import { JasmineOnboardingWizard, JasmineOnboardingData } from './JasmineOnboardingWizard';
import { JasmineOneWayGuidanceModal } from './JasmineOneWayGuidanceModal';
import {
  Sparkles,
  ShieldAlert,
  Award,
  Share2,
  Lock,
  CheckCircle2,
  AlertTriangle,
  Zap,
  Globe,
  RotateCcw,
  X,
  Compass,
  MessageSquare,
  ShieldCheck,
  Video,
  Filter,
  Search,
  Tag,
  UserCheck,
  XCircle,
  ChevronDown,
} from 'lucide-react';

interface JasmineSectorViewProps {
  celebrities: JasmineCelebrity[];
  setCelebrities: React.Dispatch<React.SetStateAction<JasmineCelebrity[]>>;
  lang: Language;
  accountVerificationStatus?: 'VERIFIED' | 'PENDING' | 'REJECTED';
  isGhostMode?: boolean;
}

export const JasmineSectorView: React.FC<JasmineSectorViewProps> = ({
  celebrities,
  setCelebrities,
  lang,
  accountVerificationStatus = 'VERIFIED',
  isGhostMode = false,
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  const [updatingCelebrity, setUpdatingCelebrity] = useState<JasmineCelebrity | null>(null);

  // Triple Smart Filter Bar States
  const [isFilterAccordionOpen, setIsFilterAccordionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedSupporterType, setSelectedSupporterType] = useState('ALL');

  // Form State for Link Replacement
  const [newVideoUrl, setNewVideoUrl] = useState('');
  const [newStatement, setNewStatement] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  // Archive History per celebrity
  const [archivesMap, setArchivesMap] = useState<Record<string, JasmineVideoArchiveItem[]>>({});

  // One-Way Guidance Notes State
  const [guidanceNotes, setGuidanceNotes] = useState<OneWayGuidanceNote[]>(INITIAL_GUIDANCE_NOTES);
  const [showGuidanceModal, setShowGuidanceModal] = useState<boolean>(false);
  const [selectedCelebrityForGuidance, setSelectedCelebrityForGuidance] = useState<JasmineCelebrity | null>(null);

  // Account Verification Guard check
  const isAccountVerified = accountVerificationStatus === 'VERIFIED';

  const handleCopyLink = useCallback((id: string, link: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(link).catch((err) => {
        console.warn('Clipboard write warning in JasmineSectorView:', err);
      });
    }
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  }, []);

  // Dynamic Link Replacement Handler
  const handleUpdateActiveLink = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (!updatingCelebrity) return;

    if (!isAccountVerified) {
      setFormError(isAr ? 'حسابك غير موثق بعد. لا يمكن تعديل الروابط النشطة.' : 'Account not verified.');
      return;
    }

    const validation = parseAndValidateJasmineVideo(newVideoUrl);
    if (!validation.isValid) {
      setFormError(validation.error || (isAr ? 'الرابط غير صالح' : 'Invalid Link'));
      return;
    }

    try {
      const { updatedCelebrity, archivedEntry } = archiveAndUpdateJasmineLink(
        updatingCelebrity,
        newVideoUrl,
        newStatement
      );

      // Update active list
      setCelebrities((prev) => prev.map((item) => (item.id === updatedCelebrity.id ? updatedCelebrity : item)));

      // Add archived entry to map
      if (archivedEntry) {
        setArchivesMap((prev) => ({
          ...prev,
          [updatedCelebrity.id]: [archivedEntry, ...(prev[updatedCelebrity.id] || [])],
        }));
      }

      setUpdatingCelebrity(null);
      setNewVideoUrl('');
      setFormError(null);
    } catch (err: any) {
      setFormError(err.message || (isAr ? 'حدث خطأ أثناء استبدال الرابط' : 'Error replacing link'));
    }
  }, [updatingCelebrity, isAccountVerified, isAr, newVideoUrl, newStatement, setCelebrities]);

  // Triple Smart Filter & Search Logic
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
      const matchesCategory = selectedCategory === 'ALL' || itemCategory.includes(selectedCategory) || selectedCategory.includes(itemCategory);

      // Supporter Type match
      const matchesSupporterType =
        selectedSupporterType === 'ALL' ||
        item.titleRole.includes(selectedSupporterType) ||
        (selectedSupporterType === 'شخصية عامة' && (item.titleRole.includes('إعلام') || item.titleRole.includes('صحف') || item.titleRole.includes('فن') || item.titleRole.includes('شخصية'))) ||
        (selectedSupporterType === 'سفير إنساني' && (item.titleRole.includes('سفير') || item.titleRole.includes('تمكين') || item.titleRole.includes('داعم'))) ||
        (selectedSupporterType === 'كفيل مؤسسي' && (item.titleRole.includes('مؤسس') || item.titleRole.includes('شركة') || item.titleRole.includes('شبكة')));

      return matchesSearch && matchesCountry && matchesCategory && matchesSupporterType;
    });
  }, [celebrities, searchQuery, selectedCountry, selectedCategory, selectedSupporterType]);

  const handleOpenUpdateModal = useCallback((celebrity: JasmineCelebrity) => {
    setUpdatingCelebrity(celebrity);
    setNewVideoUrl(celebrity.videoUrl);
    setNewStatement(celebrity.humanitarianStatement);
    setFormError(null);
  }, []);

  const handleOpenGuidanceModal = useCallback((celebrity?: JasmineCelebrity) => {
    if (celebrity) setSelectedCelebrityForGuidance(celebrity);
    setShowGuidanceModal(true);
  }, []);

  const memoizedCelebrityList = useMemo(() => {
    return filteredCelebrities.map((item) => (
      <JasmineMediaCard
        key={item.id}
        item={item}
        copiedId={copiedId}
        onCopyLink={handleCopyLink}
        onOpenUpdateModal={handleOpenUpdateModal}
        onOpenGuidanceModal={handleOpenGuidanceModal}
        archiveHistory={archivesMap[item.id] || []}
        lang={lang}
        isGhostMode={isGhostMode}
      />
    ));
  }, [filteredCelebrities, copiedId, handleCopyLink, handleOpenUpdateModal, handleOpenGuidanceModal, archivesMap, lang, isGhostMode]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCountry('ALL');
    setSelectedCategory('ALL');
    setSelectedSupporterType('ALL');
  }, []);

  const hasActiveFilters = searchQuery !== '' || selectedCountry !== 'ALL' || selectedCategory !== 'ALL' || selectedSupporterType !== 'ALL';

  return (
    <div className="space-y-8">
      {/* Sector Overview Banner — Honor, Loyalty & Recognition Hall */}
      <div className="bg-gradient-to-r from-amber-950/80 via-slate-900 to-amber-950/60 border border-amber-500/40 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-emerald-500 to-amber-500"></div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30 shadow-inner">
              <Award className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'لوحة شرف وفاء وإشهار إنساني' : 'Humanitarian Honor & Recognition Hall'}</span>
            </div>
            <h2 className="text-xl md:text-3xl font-black text-white tracking-wide leading-tight">
              {isAr ? 'لوحة شرف وفاء وإشهار الداعمين والمشاهير الكافلين للقنوات' : 'Jasmine Sector: Supporters & Sponsors Wall of Honor'}
            </h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-3xl leading-relaxed font-medium">
              {isAr
                ? 'واجهة عرض وإشهار شرفية تحتفي بكافة الشخصيات العامة والداعمين والكفلاء الذين تبنوا دعم واشتراك القنوات الميدانية المعتمدة. إشهار إنساني شفاف يبرز الدور التمكيني للداعم دون أي رسوم أو وسائط تجارية.'
                : 'A ceremonial hall of honor recognizing public figures, supporters, and sponsors adopting field humanitarian channels with zero-cost verified impact.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            {accountVerificationStatus === 'VERIFIED' ? (
              <button
                onClick={() => {
                  setSelectedCelebrityForGuidance(celebrities[0] || null);
                  setShowGuidanceModal(true);
                }}
                className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold px-4 py-3.5 rounded-xl text-xs sm:text-sm transition shadow-xl shadow-purple-900/40 border border-purple-400/30 cursor-pointer w-full sm:w-auto"
                title={isAr ? 'فتح لوحة صياغة وإرسال التوجيه أحادي الاتجاه للكفلاء المعتمدين' : 'Open Direct Guidance Panel (Verified Sponsors)'}
              >
                <MessageSquare className="w-4 h-4 text-purple-200 shrink-0" />
                <span className="truncate">{isAr ? 'لوحة التوجيه المباشر (للكفلاء المعتمدين)' : 'Direct Guidance Panel'}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  alert(
                    isAr
                      ? 'عذراً، خاصية "التوجيه المباشر أحادي الاتجاه" مخصصة حصرياً للكفلاء المعتمدين الذين تبنوا كفالة قناتين ميدانيتين أو أكثر من خلال منصة نور الأماني.'
                      : 'Direct Guidance is restricted to verified sponsors adopting 2 or more humanitarian channels.'
                  );
                }}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold px-4 py-3.5 rounded-xl text-xs sm:text-sm transition border border-slate-700/60 cursor-pointer w-full sm:w-auto opacity-80"
                title={isAr ? 'خاصية مقيدة بالكفلاء المعتمدين (تبني قناتين فأكثر)' : 'Restricted to verified sponsors'}
              >
                <MessageSquare className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate">{isAr ? 'التوجيه المباشر (مخصص للكفلاء)' : 'Direct Guidance (Sponsors Only)'}</span>
              </button>
            )}

            <button
              onClick={() => {
                setShowOnboardingWizard(true);
              }}
              className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black px-4 sm:px-5 py-3.5 rounded-xl text-xs sm:text-sm transition shadow-xl shadow-amber-500/20 border border-amber-300/40 w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4 text-slate-950 animate-pulse shrink-0" />
              <span className="truncate">{isAr ? 'انضمام كفلاء قطاع الياسمين (معالج التوثيق والاعتماد)' : 'Join Jasmine Sector'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Triple Smart Filter Bar Accordion (منسدلة أكروديون البحث والفلترة الذكية الثلاثية) */}
      <div className="bg-slate-900/90 border border-amber-500/30 hover:border-amber-500/50 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden transition-all duration-300">
        <div
          onClick={() => setIsFilterAccordionOpen(!isFilterAccordionOpen)}
          className="flex items-center justify-between p-4 md:p-5 cursor-pointer bg-slate-900/90 hover:bg-slate-850 transition select-none"
        >
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs md:text-sm font-bold text-white flex items-center gap-2">
                <span>{isAr ? 'البحث والفلترة الذكية الثلاثية للداعمين والكفلاء' : 'Triple Smart Search & Filter'}</span>
                {hasActiveFilters && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-extrabold border border-amber-500/30">
                    {isAr ? 'فلاتر نشطة' : 'Active Filters'}
                  </span>
                )}
              </h3>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                {isAr
                  ? 'اضغط لتوسيع أو طي خيارات البحث بالاسم، الدولة، نوع المحتوى وتصنيف الكفيل'
                  : 'Click to expand or collapse search by name, country, category, and type'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 text-[11px] font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2.5 py-1.5 rounded-lg border border-rose-500/20 transition cursor-pointer"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>{isAr ? 'إعادة ضبط' : 'Reset'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsFilterAccordionOpen(!isFilterAccordionOpen)}
              className="p-2 rounded-xl bg-slate-950 text-amber-400 hover:text-amber-300 border border-slate-800 transition flex items-center gap-1 cursor-pointer"
              title={isFilterAccordionOpen ? (isAr ? 'إغلاق القائمة' : 'Collapse') : (isAr ? 'فتح القائمة' : 'Expand')}
            >
              <span className="text-[11px] font-bold hidden md:inline ml-1">
                {isFilterAccordionOpen ? (isAr ? 'إغلاق' : 'Close') : (isAr ? 'بحث وفلترة' : 'Search')}
              </span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isFilterAccordionOpen ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>

        {/* Collapsible Accordion Body */}
        {isFilterAccordionOpen && (
          <div className="p-4 md:p-5 pt-0 border-t border-slate-800/80 bg-slate-950/60 space-y-4 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3">
              {/* 1. Live Text Search */}
              <div className="relative">
                <label className="block text-[10px] text-slate-400 mb-1 font-bold flex items-center gap-1">
                  <Search className="w-3 h-3 text-amber-400" />
                  <span>{isAr ? 'البحث بالاسم أو البيان:' : 'Search Name/Statement:'}</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={isAr ? 'ابحث عن داعم، مشهور، أو كلمة...' : 'Search supporter...'}
                    className="w-full bg-slate-950 text-slate-100 text-xs rounded-xl pl-3 pr-8 py-2.5 border border-slate-800 focus:border-amber-500 outline-none transition"
                  />
                  <Search className="w-3.5 h-3.5 absolute right-2.5 top-3 text-slate-500" />
                </div>
              </div>

              {/* 2. Country / Region Filter */}
              <div>
                <label className="block text-[10px] text-slate-400 mb-1 font-bold flex items-center gap-1">
                  <Globe className="w-3 h-3 text-emerald-400" />
                  <span>{isAr ? '1. دولة الداعم / الإقليم:' : '1. Supporter Country:'}</span>
                </label>
                <select
                  value={selectedCountry}
                  onChange={(e) => setSelectedCountry(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 outline-none cursor-pointer font-medium"
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
                  <option value="دول أخرى">{isAr ? '🌐 دول ومناطق أخرى' : 'Other Countries'}</option>
                </select>
              </div>

              {/* 3. Domain / Content Type Filter */}
              <div>
                <label className="block text-[10px] text-slate-400 mb-1 font-bold flex items-center gap-1">
                  <Tag className="w-3 h-3 text-cyan-400" />
                  <span>{isAr ? '2. نوع المحتوى / المجال:' : '2. Content Domain:'}</span>
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 outline-none cursor-pointer font-medium"
                >
                  <option value="ALL">{isAr ? 'جميع المجالات وأنواع المحتوى' : 'All Content Domains'}</option>
                  <option value="إنساني وإغاثي">{isAr ? '❤️ إنساني وإغاثي' : 'Humanitarian & Relief'}</option>
                  <option value="إعلام وصحافة">{isAr ? '📰 إعلام وصحافة ميدانية' : 'Media & Field Journalism'}</option>
                  <option value="معرفي وتعليمي">{isAr ? '🎓 معرفي وتعليمي' : 'Educational & Knowledge'}</option>
                  <option value="فني وثقافي">{isAr ? '🎨 فني وثقافي' : 'Arts & Culture'}</option>
                  <option value="تطويري وريادي">{isAr ? '💡 تطويري وريادي' : 'Entrepreneurial'}</option>
                </select>
              </div>

              {/* 4. Supporter Classification Filter */}
              <div>
                <label className="block text-[10px] text-slate-400 mb-1 font-bold flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-purple-400" />
                  <span>{isAr ? '3. صفة وتصنيف الداعم:' : '3. Supporter Type:'}</span>
                </label>
                <select
                  value={selectedSupporterType}
                  onChange={(e) => setSelectedSupporterType(e.target.value)}
                  className="w-full bg-slate-950 text-slate-200 text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 outline-none cursor-pointer font-medium"
                >
                  <option value="ALL">{isAr ? 'جميع تصنيفات الداعمين' : 'All Supporter Types'}</option>
                  <option value="شخصية عامة">{isAr ? '🌟 شخصية عامة / مشهور' : 'Public Figure / Celebrity'}</option>
                  <option value="سفير إنساني">{isAr ? '🎗️ سفير إنساني وتمكيني' : 'Humanitarian Ambassador'}</option>
                  <option value="كفيل مؤسسي">{isAr ? '🏛️ كفيل مؤسسي / شبكي' : 'Institutional Sponsor'}</option>
                  <option value="صانع محتوى دايم">{isAr ? '🎥 صانع محتوى داعم' : 'Supporting Content Creator'}</option>
                  <option value="داعم فخري">{isAr ? '🛡️ داعم فخري موثق' : 'Honorary Supporter'}</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Account Verification Warning Alert (If user is pending or unverified) */}
      {!isAccountVerified && (
        <div className="bg-amber-950/40 border border-amber-500/40 rounded-2xl p-4 flex items-start gap-3 shadow-lg">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs text-amber-200">
            <h4 className="font-bold text-amber-300">
              {isAr ? 'تنبيه مسار التوثيق الإجباري (VERIFIED Check)' : 'Verification Guard Required'}
            </h4>
            <p className="leading-relaxed">
              {isAr
                ? 'إمكانية إضافة أو تحديث رابط فيديو قطاع الياسمين محمية بحالة الحساب الموثق (VERIFIED === true). يرجى إكمال إجراءات التحقق والتدقيق عبر طابور التحقق لاستكمال النشر.'
                : 'Publishing support video links is reserved for verified figure accounts.'}
            </p>
          </div>
        </div>
      )}

      {/* Update Link Modal (Dynamic Link Replacement & Archiving) */}
      {updatingCelebrity && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>
                  {isAr ? 'تحديث الرابط النشط لـ:' : 'Update Active Link for:'} {updatingCelebrity.celebrityName}
                </span>
              </h3>
              <button
                onClick={() => {
                  setUpdatingCelebrity(null);
                  setFormError(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-300 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <p className="text-xs text-slate-400 leading-relaxed">
              {isAr
                ? 'استبدال الرابط النشط ينقل الفيديو الحالي تلقائياً إلى الأرشيف الموثق للشخصية للحفاظ على تسلسل التغطيات الإنسانية.'
                : 'Replacing the active link moves the current video to the historical archive.'}
            </p>

            <form onSubmit={handleUpdateActiveLink} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 mb-1 font-medium">
                  {isAr ? 'رابط الفيديو الجديد (YouTube / TikTok / Instagram)' : 'New Video Link'} *
                </label>
                <input
                  type="url"
                  required
                  value={newVideoUrl}
                  onChange={(e) => setNewVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setUpdatingCelebrity(null)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition"
                >
                  {isAr ? 'تأكيد الاستبدال والأرشفة' : 'Replace & Archive'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Onboarding Wizard Modal (Single Entry Point Pattern) */}
      {showOnboardingWizard && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl my-8">
            <JasmineOnboardingWizard
              lang={lang === 'en' ? 'en' : 'ar'}
              isAccountVerified={isAccountVerified}
              onClose={() => setShowOnboardingWizard(false)}
              onOpenGuidance={() => {
                setSelectedCelebrityForGuidance(celebrities[0] || null);
                setShowGuidanceModal(true);
              }}
              onComplete={(wizardData: JasmineOnboardingData) => {
                const videoVal = parseAndValidateJasmineVideo(wizardData.videoUrl);
                const newId = `jas-${Date.now()}`;
                const newEntry: JasmineCelebrity = {
                  id: newId,
                  celebrityName: wizardData.celebrityName,
                  titleRole: wizardData.titleRole,
                  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                  videoThumbnail:
                    videoVal.platform === 'YouTube' && videoVal.videoId
                      ? `https://img.youtube.com/vi/${videoVal.videoId}/hqdefault.jpg`
                      : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
                  videoUrl: wizardData.videoUrl,
                  humanitarianStatement: wizardData.humanitarianStatement,
                  verifiedBadge: true,
                  sharedReferenceBioLink: `https://noor-al-amani.org/ref/${newId}`,
                  endorsedCampaign: wizardData.endorsedCampaign,
                  date: new Date().toISOString().split('T')[0],
                };

                setCelebrities((prev) => [newEntry, ...prev]);
                setShowOnboardingWizard(false);
              }}
            />
          </div>
        </div>
      )}

      {/* One-Way Guidance System Modal */}
      {showGuidanceModal && (
        <JasmineOneWayGuidanceModal
          celebrityName={selectedCelebrityForGuidance?.celebrityName || (isAr ? 'أ. أحمد الشقيري' : 'Ahmad Al Shugairi')}
          celebrityId={selectedCelebrityForGuidance?.id || 'jas-01'}
          onClose={() => setShowGuidanceModal(false)}
          guidanceNotes={guidanceNotes}
          onAddGuidanceNote={(newNote) => {
            setGuidanceNotes((prev) => [newNote, ...prev]);
          }}
          lang={lang === 'en' ? 'en' : 'ar'}
        />
      )}

      {/* Celebrities List Grid (Zero-Cost Embedded Cards) */}
      {filteredCelebrities.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-200">
            {isAr ? 'لا توجد نتائج تطابق خيارات الفلترة المحددة' : 'No Supporters Found for Selected Filters'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {isAr
              ? 'يرجى تغيير معايير البحث أو الضغط على زر "إعادة ضبط الفلاتر" لاستعراض كامل لوحة شرف كفلاء قطاع الياسمين.'
              : 'Please change search criteria or reset filters to browse the full Honor Roll.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition"
            >
              {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-y-6 gap-x-2 sm:gap-4">
          {memoizedCelebrityList}
        </div>
      )}
    </div>
  );
};

export default JasmineSectorView;


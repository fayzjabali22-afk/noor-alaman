import React, { useState, useMemo } from 'react';
import { SovereignErrorCode, SovereignSectorKey, Language } from '../types';
import { initialSovereignErrorDictionary } from '../data/errorDictionary';
import {
  Search,
  AlertTriangle,
  AlertOctagon,
  Info,
  ShieldAlert,
  Filter,
  CheckCircle2,
  BookOpen,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface ErrorDictionaryExplorerProps {
  lang: Language;
}

export const ErrorDictionaryExplorer: React.FC<ErrorDictionaryExplorerProps & { onOpenAssistant?: (code: string) => void }> = ({ lang, onOpenAssistant }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState<SovereignSectorKey>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [expandedCode, setExpandedCode] = useState<string | null>(null);

  // Filter dictionary items locally using useMemo to ensure zero unnecessary re-renders & zero server read consumption
  const filteredErrorCodes = useMemo(() => {
    return initialSovereignErrorDictionary.filter((item) => {
      // Filter by sector
      if (selectedSector !== 'ALL' && item.sectorKey !== selectedSector) {
        return false;
      }
      // Filter by severity
      if (selectedSeverity !== 'ALL' && item.severity !== selectedSeverity) {
        return false;
      }
      // Filter by search query (Code, Title Ar/En, Description, Resolution, SSOT Ref)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchCode = item.code.toLowerCase().includes(query);
        const matchTitleAr = item.titleAr.toLowerCase().includes(query);
        const matchTitleEn = item.titleEn.toLowerCase().includes(query);
        const matchSector = item.sectorNameAr.toLowerCase().includes(query);
        const matchDesc = item.descriptionAr.toLowerCase().includes(query);
        const matchRef = item.ssotReference.toLowerCase().includes(query);

        return matchCode || matchTitleAr || matchTitleEn || matchSector || matchDesc || matchRef;
      }

      return true;
    });
  }, [searchTerm, selectedSector, selectedSeverity]);

  // Sector stats
  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: initialSovereignErrorDictionary.length };
    initialSovereignErrorDictionary.forEach((item) => {
      counts[item.sectorKey] = (counts[item.sectorKey] || 0) + 1;
    });
    return counts;
  }, []);

  const sectorsList: { key: SovereignSectorKey; labelAr: string; labelEn: string }[] = [
    { key: 'ALL', labelAr: 'كافة القطاعات السيادية', labelEn: 'All Sovereign Sectors' },
    { key: 'SUPPORTER', labelAr: 'قطاع الداعمين', labelEn: 'Supporter Sector' },
    { key: 'PUBLISHER', labelAr: 'قطاع الناشرين', labelEn: 'Publisher Sector' },
    { key: 'FAIR_ENGINE', labelAr: 'محرك العدالة', labelEn: 'FairEngine Core' },
    { key: 'JASMINE', labelAr: 'قطاع الياسمين', labelEn: 'Jasmine Sector' },
    { key: 'DALAL', labelAr: 'قطاع دلال', labelEn: 'Dalal Sector' },
    { key: 'RAEDA', labelAr: 'قطاع رائدة', labelEn: 'Raeda Sector' },
    { key: 'GOVERNANCE', labelAr: 'الحوكمة والرقابة', labelEn: 'Governance & Audit' },
  ];

  const getSeverityBadge = (severity: 'CRITICAL' | 'WARNING' | 'INFO') => {
    switch (severity) {
      case 'CRITICAL':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            {lang === 'ar' ? 'حرِج سيادياً' : 'Critical'}
          </span>
        );
      case 'WARNING':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            {lang === 'ar' ? 'تحذير حوكمي' : 'Warning'}
          </span>
        );
      case 'INFO':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Info className="w-3.5 h-3.5 text-emerald-600" />
            {lang === 'ar' ? 'إرشادي' : 'Info'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'المرجع السيادي الموحد - SSOT' : 'Sovereign Reference SSOT'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {lang === 'ar' ? 'كشاف القاموس السيادي للأخطاء' : 'SSOT Error Dictionary Explorer'}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {lang === 'ar'
                ? 'وحدة كشاف برمجية مرنة وموفرة للموارد تعتمد بالكامل على المعالجة المحلية المحلية لتصفح وفلترة رموز الأخطاء والحماية الحوكمية دون استهلاك نبضات قراءة إضافية من السيرفر.'
                : 'A resource-efficient local error dictionary explorer using client-side memoization for instant zero-server-cost security code lookup.'}
            </p>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-slate-700/60 flex items-center gap-4 w-full md:w-auto justify-between">
            <div className="text-center px-2">
              <div className="text-2xl font-black text-emerald-400">{initialSovereignErrorDictionary.length}</div>
              <div className="text-xs text-slate-400">{lang === 'ar' ? 'رموز الأخطاء الموثقة' : 'Archived Codes'}</div>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div className="text-center px-2">
              <div className="text-2xl font-black text-amber-400">7</div>
              <div className="text-xs text-slate-400">{lang === 'ar' ? 'قطاعات سيادية' : 'Sovereign Sectors'}</div>
            </div>
            <div className="h-8 w-px bg-slate-700" />
            <div className="text-center px-2">
              <div className="text-2xl font-black text-sky-400">100%</div>
              <div className="text-xs text-slate-400">{lang === 'ar' ? 'حفظ الموارد' : 'Resource Saved'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Severity Filters */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={lang === 'ar' ? 'ابحث برمز الخطأ، العنوان، أو المرجع...' : 'Search by code, title, or reference...'}
              className="w-full pr-10 pl-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 bg-slate-200 rounded-full px-1.5 py-0.5"
              >
                ✕
              </button>
            )}
          </div>

          {/* Severity Radio/Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <span className="text-xs font-medium text-slate-500 whitespace-nowrap flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              {lang === 'ar' ? 'درجة الخطورة:' : 'Severity:'}
            </span>

            {[
              { key: 'ALL', labelAr: 'الكل', labelEn: 'All' },
              { key: 'CRITICAL', labelAr: 'حرج', labelEn: 'Critical' },
              { key: 'WARNING', labelAr: 'تحذير', labelEn: 'Warning' },
              { key: 'INFO', labelAr: 'إرشادي', labelEn: 'Info' },
            ].map((sev) => (
              <button
                key={sev.key}
                onClick={() => setSelectedSeverity(sev.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                  selectedSeverity === sev.key
                    ? 'bg-slate-800 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {lang === 'ar' ? sev.labelAr : sev.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Sovereign Sectors Tabulation (تبويب القطاعات السيادية) */}
        <div className="border-t border-slate-100 pt-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {sectorsList.map((sec) => {
              const isActive = selectedSector === sec.key;
              const count = sectorCounts[sec.key] || 0;
              return (
                <button
                  key={sec.key}
                  onClick={() => setSelectedSector(sec.key)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <Layers className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{lang === 'ar' ? sec.labelAr : sec.labelEn}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-emerald-700 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Count & Explorer List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            {lang === 'ar'
              ? `عرض ${filteredErrorCodes.length} من أصل ${initialSovereignErrorDictionary.length} رمز أخطاء موثق سيادياً`
              : `Showing ${filteredErrorCodes.length} of ${initialSovereignErrorDictionary.length} sovereign error codes`}
          </span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {lang === 'ar' ? 'تصفح محلي آمن وموفر للموارد (useMemo)' : 'Memoized Local Zero-Cost Lookup'}
          </span>
        </div>

        {filteredErrorCodes.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-slate-600 font-medium text-sm">
              {lang === 'ar' ? 'لم يتم العثور على أخطاء تطابق معايير البحث والفلترة' : 'No sovereign error codes found.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSector('ALL');
                setSelectedSeverity('ALL');
              }}
              className="text-xs text-emerald-600 font-semibold hover:underline"
            >
              {lang === 'ar' ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredErrorCodes.map((item) => {
              const isExpanded = expandedCode === item.code;
              return (
                <div
                  key={item.code}
                  className={`bg-white rounded-xl border transition-all duration-200 overflow-hidden ${
                    isExpanded
                      ? 'border-emerald-500 shadow-lg ring-1 ring-emerald-500/20'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  <div className="p-5 space-y-3">
                    {/* Header line: Code & Severity */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-800 rounded-md border border-slate-200">
                          {item.code}
                        </span>
                        {getSeverityBadge(item.severity)}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-slate-400" />
                        {item.ssotReference}
                      </span>
                    </div>

                    {/* Titles & Sector */}
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">{item.titleAr}</h3>
                      <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                        <span className="font-sans italic text-slate-400">{item.titleEn}</span>
                        <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                          {item.sectorNameAr}
                        </span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-slate-600 text-xs leading-relaxed border-t border-slate-100 pt-3">
                      {item.descriptionAr}
                    </p>

                    {/* Resolution Section */}
                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-100 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                        <span>{lang === 'ar' ? 'التصحيح المعتمد في المنظومة:' : 'Resolution Protocol:'}</span>
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed">{item.resolutionAr}</p>
                    </div>

                    {/* Expand Details Trigger */}
                    <button
                      onClick={() => setExpandedCode(isExpanded ? null : item.code)}
                      className="w-full text-center py-1.5 text-[11px] font-medium text-slate-500 hover:text-emerald-600 transition-colors flex items-center justify-center gap-1 border-t border-slate-100"
                    >
                      <span>
                        {isExpanded
                          ? lang === 'ar'
                            ? 'إغلاق التفاصيل المرجعية'
                            : 'Hide Reference Details'
                          : lang === 'ar'
                          ? 'عرض التفاصيل والختم السيادي'
                          : 'View Full Reference Details'}
                      </span>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs text-slate-600 bg-emerald-50/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700">
                            {lang === 'ar' ? 'المرجع المعماري (NA-ADR):' : 'Architecture Decision Record:'}
                          </span>
                          <span className="font-mono text-emerald-700 font-bold">{item.ssotReference}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-700">
                            {lang === 'ar' ? 'حالة التوثيق المحلية:' : 'Local Hydration Status:'}
                          </span>
                          <span className="text-emerald-600 font-medium flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            {lang === 'ar' ? 'محفوظة وموثقة بـ useMemo' : 'Memoized SSOT Local'}
                          </span>
                        </div>
                        {onOpenAssistant && (
                          <div className="pt-3 mt-3 border-t border-emerald-100 flex justify-center">
                            <button
                              onClick={(e) => { e.stopPropagation(); onOpenAssistant(item.code); }}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm shadow-emerald-500/20"
                            >
                              <Sparkles className="w-4 h-4" />
                              {lang === 'ar' ? 'الاستفسار عبر المساعد الذكي' : 'Ask Smart Assistant'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

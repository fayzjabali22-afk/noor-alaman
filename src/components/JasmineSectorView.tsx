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
} from 'lucide-react';

interface JasmineSectorViewProps {
  celebrities: JasmineCelebrity[];
  setCelebrities: React.Dispatch<React.SetStateAction<JasmineCelebrity[]>>;
  lang: Language;
  accountVerificationStatus?: 'VERIFIED' | 'PENDING' | 'REJECTED';
}

export const JasmineSectorView: React.FC<JasmineSectorViewProps> = ({
  celebrities,
  setCelebrities,
  lang,
  accountVerificationStatus = 'VERIFIED',
}) => {
  const t = translations[lang];
  const isAr = lang === 'ar';

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showOnboardingWizard, setShowOnboardingWizard] = useState(false);
  const [updatingCelebrity, setUpdatingCelebrity] = useState<JasmineCelebrity | null>(null);

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
      navigator.clipboard.writeText(link).catch(() => {});
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

  const memoizedCelebrityList = useMemo(() => {
    return celebrities.map((item) => (
      <JasmineMediaCard
        key={item.id}
        item={item}
        copiedId={copiedId}
        onCopyLink={handleCopyLink}
        onOpenUpdateModal={(celebrity) => {
          setUpdatingCelebrity(celebrity);
          setNewVideoUrl(celebrity.videoUrl);
          setNewStatement(celebrity.humanitarianStatement);
          setFormError(null);
        }}
        onOpenGuidanceModal={(celebrity) => {
          if (celebrity) setSelectedCelebrityForGuidance(celebrity);
          setShowGuidanceModal(true);
        }}
        archiveHistory={archivesMap[item.id] || []}
        lang={lang}
      />
    ));
  }, [celebrities, copiedId, handleCopyLink, archivesMap, lang]);

  return (
    <div className="space-y-8">
      {/* Sector Overview Banner */}
      <div className="bg-gradient-to-r from-amber-950/60 via-slate-900 to-amber-950/40 border border-amber-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{t.jasmineTitle}</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
              {t.jasmineSectorTitle}
            </h2>
            <p className="text-slate-300 text-xs md:text-sm max-w-3xl leading-relaxed">
              {t.jasmineDesc}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={() => {
                setSelectedCelebrityForGuidance(celebrities[0] || null);
                setShowGuidanceModal(true);
              }}
              className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold px-4 py-3 rounded-xl text-xs sm:text-sm transition shadow-xl shadow-purple-900/40 border border-purple-400/30 cursor-pointer w-full sm:w-auto"
              title={isAr ? 'فتح لوحة صياغة وإرسال التوجيه أحادي الاتجاه' : 'Open One-Way Direct Guidance Panel'}
            >
              <MessageSquare className="w-4 h-4 text-purple-200 shrink-0" />
              <span className="truncate">{isAr ? 'لوحة التوجيه المباشر (إرسال التوجيه)' : 'Direct Guidance Panel'}</span>
            </button>

            <button
              onClick={() => {
                setShowOnboardingWizard(true);
              }}
              className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black px-4 sm:px-5 py-3 rounded-xl text-xs sm:text-sm transition shadow-xl shadow-amber-500/20 border border-amber-300/40 w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4 text-slate-950 animate-pulse shrink-0" />
              <span className="truncate">{isAr ? 'انضمام كفلاء قطاع الياسمين (معالج التوثيق والاعتماد)' : 'Join Jasmine Sector'}</span>
            </button>
          </div>
        </div>
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
              lang={lang}
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
          lang={lang}
        />
      )}

      {/* Celebrities List Grid (Zero-Cost Embedded Cards) */}
      {celebrities.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
            <Video className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-200">
            {isAr ? 'لا توجد بطاقات وسائط مسجلة حالياً' : 'No Media Cards Registered Yet'}
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            {isAr
              ? 'يمكن للمشاهير والشخصيات العامة الانضمام وتوثيق بيانات الرعاية الإنسانية عبر زر الانضمام الموحد أعلى الصفحة.'
              : 'Public figures can join and record humanitarian support via the top onboarding button.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {memoizedCelebrityList}
        </div>
      )}
    </div>
  );
};

export default JasmineSectorView;

import React, { useState } from 'react';
import { JasmineCelebrity, Language } from '../types';
import { translations } from '../lib/i18n';
import {
  Sparkles,
  ShieldAlert,
  Copy,
  Check,
  Award,
  Video,
  Share2,
  Lock,
} from 'lucide-react';

interface JasmineSectorViewProps {
  celebrities: JasmineCelebrity[];
  setCelebrities: React.Dispatch<React.SetStateAction<JasmineCelebrity[]>>;
  lang: Language;
}

export const JasmineSectorView: React.FC<JasmineSectorViewProps> = ({
  celebrities,
  setCelebrities,
  lang,
}) => {
  const t = translations[lang];

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showJoinForm, setShowJoinForm] = useState(false);
  const [newCelebrityName, setNewCelebrityName] = useState('');
  const [newTitleRole, setNewTitleRole] = useState('');
  const [newStatement, setNewStatement] = useState('');

  const handleCopyLink = (id: string, link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleCreateJasmineLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCelebrityName.trim()) return;

    const newId = `jas-${Date.now()}`;
    const newEntry: JasmineCelebrity = {
      id: newId,
      celebrityName: newCelebrityName,
      titleRole: newTitleRole || (lang === 'ar' ? 'شخصية داعمة' : 'Public Advocate'),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      videoThumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=600',
      videoUrl: 'https://youtube.com',
      humanitarianStatement: newStatement || (lang === 'ar' ? 'أضم صوتي لمنصة نور الأماني لدعم وتوثيق الرسائل الإنسانية الميدانية.' : 'I join Noor Al-Amani in endorsing verified field coverage.'),
      verifiedBadge: true,
      sharedReferenceBioLink: `https://noor-al-amani.org/ref/${newId}`,
      endorsedCampaign: 'مبادرة دعم التغطيات الإنسانية',
      date: new Date().toISOString().split('T')[0],
    };

    setCelebrities((prev) => [newEntry, ...prev]);
    setShowJoinForm(false);
    setNewCelebrityName('');
    setNewTitleRole('');
    setNewStatement('');
  };

  return (
    <div className="space-y-8">
      {/* Sector Overview Header */}
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

          <button
            onClick={() => setShowJoinForm(!showJoinForm)}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition shadow-lg shrink-0"
          >
            <Share2 className="w-4 h-4" />
            <span>{t.createBioLink}</span>
          </button>
        </div>

        {/* Banned Rules Banner */}
        <div className="mt-5 pt-4 border-t border-amber-500/20 flex flex-wrap items-center gap-4 text-xs text-amber-200/80 font-medium">
          <span className="flex items-center gap-1.5 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800/60">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.noCommercialAds}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800/60">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.zeroMonetization}</span>
          </span>
          <span className="flex items-center gap-1.5 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-800/60">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>{t.humanitarianActions}</span>
          </span>
        </div>
      </div>

      {/* Optional Join Form */}
      {showJoinForm && (
        <form
          onSubmit={handleCreateJasmineLink}
          className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-xl"
        >
          <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>{t.registerPublicAdvocate}</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-300 mb-1 font-medium">
                {t.publicFigureName}
              </label>
              <input
                type="text"
                required
                value={newCelebrityName}
                onChange={(e) => setNewCelebrityName(e.target.value)}
                placeholder={t.publicFigurePlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-300 mb-1 font-medium">
                {t.humanitarianRoleTitle}
              </label>
              <input
                type="text"
                value={newTitleRole}
                onChange={(e) => setNewTitleRole(e.target.value)}
                placeholder={t.humanitarianRolePlaceholder}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-300 mb-1 font-medium">
              {t.statementLabel}
            </label>
            <textarea
              rows={3}
              value={newStatement}
              onChange={(e) => setNewStatement(e.target.value)}
              placeholder={t.statementPlaceholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs transition shadow-md"
            >
              {t.generateBioLinkBtn}
            </button>
            <button
              type="button"
              onClick={() => setShowJoinForm(false)}
              className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl text-xs"
            >
              {t.cancel}
            </button>
          </div>
        </form>
      )}

      {/* Celebrities List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {celebrities.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl p-5 space-y-4 shadow-lg transition"
          >
            {/* Header: Avatar & Title */}
            <div className="flex items-center gap-3">
              <img
                src={item.avatar}
                alt={item.celebrityName}
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/50 shadow-md"
              />
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{item.celebrityName}</span>
                  <Award className="w-4 h-4 text-amber-400" />
                </h3>
                <p className="text-xs text-amber-300/80 font-medium">{item.titleRole}</p>
              </div>
            </div>

            {/* Video Thumbnail Preview */}
            <div className="relative rounded-xl overflow-hidden group border border-slate-800 aspect-video">
              <img
                src={item.videoThumbnail}
                alt={item.celebrityName}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent flex items-center justify-center">
                <a
                  href={item.videoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-12 h-12 rounded-full bg-amber-500/90 text-slate-950 flex items-center justify-center shadow-lg hover:scale-110 transition"
                >
                  <Video className="w-6 h-6 fill-slate-950" />
                </a>
              </div>
              <div className="absolute bottom-2 right-2 left-2 bg-slate-950/90 backdrop-blur px-3 py-1 rounded-lg text-[11px] text-amber-300 font-medium border border-amber-500/20">
                {item.endorsedCampaign}
              </div>
            </div>

            {/* Statement */}
            <blockquote className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 italic">
              "{item.humanitarianStatement}"
            </blockquote>

            {/* Reference Bio Link Generator Button */}
            <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="font-mono text-slate-400 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800 text-[11px] truncate max-w-full">
                {item.sharedReferenceBioLink}
              </div>

              <button
                onClick={() => handleCopyLink(item.id, item.sharedReferenceBioLink)}
                className="w-full sm:w-auto bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl font-bold border border-amber-500/30 transition flex items-center justify-center gap-1.5 shrink-0"
              >
                {copiedId === item.id ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{t.copiedLink}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>{t.copyBioLink}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { Publisher, Language, CategoryType, PlatformType } from '../types';
import { translations, getCategoryLabel } from '../lib/i18n';
import {
  UserCheck,
  Send,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Plus,
} from 'lucide-react';

interface PublisherPortalViewProps {
  publishers: Publisher[];
  setPublishers: React.Dispatch<React.SetStateAction<Publisher[]>>;
  lang: Language;
}

export const PublisherPortalView: React.FC<PublisherPortalViewProps> = ({
  publishers,
  setPublishers,
  lang,
}) => {
  const t = translations[lang];

  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    platform: 'Telegram' as PlatformType,
    externalUrl: '',
    category: 'FIELD_REPORTING' as CategoryType,
    phone: '',
    email: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.externalUrl.trim()) return;

    const newPub: Publisher = {
      id: `pub-${Date.now()}`,
      name: formData.name,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      location: formData.location || t.defaultLocationGaza,
      description: formData.description,
      category: formData.category,
      platform: formData.platform,
      externalUrl: formData.externalUrl,
      verificationLevel: 'BASIC',
      status: 'PENDING',
      lifecycleStage: 'VERIFICATION_PENDING',
      totalVisitsFromPlatform: 0,
      lastImpressionTime: new Date().toISOString(),
      reportsCount: 0,
      joinedDate: new Date().toISOString().split('T')[0],
      contactPhone: formData.phone || '+970599000000',
      contactEmail: formData.email || 'publisher@gaza-relief.org',
      isGazaPilot: true,
      subscribersCount: t.verificationPendingSubscribers,
    };

    setPublishers((prev) => [newPub, ...prev]);
    setSubmittedSuccess(true);
    setFormData({
      name: '',
      location: '',
      description: '',
      platform: 'Telegram',
      externalUrl: '',
      category: 'FIELD_REPORTING',
      phone: '',
      email: '',
    });

    setTimeout(() => setSubmittedSuccess(false), 5000);
  };

  const stagesList = [
    { key: 'stage1', title: t.stage1, desc: t.stage1Desc },
    { key: 'stage2', title: t.stage2, desc: t.stage2Desc },
    { key: 'stage3', title: t.stage3, desc: t.stage3Desc },
    { key: 'stage4', title: t.stage4, desc: t.stage4Desc },
    { key: 'stage5', title: t.stage5, desc: t.stage5Desc },
    { key: 'stage6', title: t.stage6, desc: t.stage6Desc },
    { key: 'stage7', title: t.stage7, desc: t.stage7Desc },
    { key: 'stage8', title: t.stage8, desc: t.stage8Desc },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t.publisherSystem}</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
            {t.publisherManagementTitle}
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-3xl leading-relaxed">
            {t.publisherManagementDesc}
          </p>
        </div>
      </div>

      {/* Visual Lifecycle Pipeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>{t.lifecycleTitle}</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {stagesList.map((stg, idx) => (
            <div
              key={stg.key}
              className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-center space-y-1 hover:border-emerald-500/40 transition relative group"
            >
              <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center mx-auto">
                {idx + 1}
              </span>
              <h4 className="text-[11px] font-bold text-slate-200 mt-1 line-clamp-1">{stg.title}</h4>
              <p className="text-[10px] text-slate-500 line-clamp-2">{stg.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Register New Channel Form */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-400" />
              <span>{t.registerPublisherTitle}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {t.officialDataForVerification}
            </p>
          </div>
        </div>

        {submittedSuccess && (
          <div className="bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 p-4 rounded-xl text-xs flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{t.successSubmitMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.publisherNameInput} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={lang === 'ar' ? 'مثال: فريق الإغاثة الميداني' : 'e.g. Field Relief Team'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.locationInput}
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder={lang === 'ar' ? 'مثال: غزة - جباليا' : 'e.g. North Gaza - Jabalia'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.platformSelect} *
              </label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value as PlatformType })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="Telegram">Telegram</option>
                <option value="YouTube">YouTube</option>
                <option value="X">X (Twitter)</option>
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="TikTok">TikTok</option>
                <option value="Website">Website</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.categorySelect}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as CategoryType })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-emerald-300 focus:outline-none focus:border-emerald-500 font-medium"
              >
                <option value="FIELD_REPORTING">{getCategoryLabel('FIELD_REPORTING', lang)}</option>
                <option value="RELIEF_AND_MEDICAL">{getCategoryLabel('RELIEF_AND_MEDICAL', lang)}</option>
                <option value="SHELTER_AND_FOOD">{getCategoryLabel('SHELTER_AND_FOOD', lang)}</option>
                <option value="CIVIL_DEFENSE_RESCUE">{getCategoryLabel('CIVIL_DEFENSE_RESCUE', lang)}</option>
                <option value="YOUTH_AND_RESILIENCE">{getCategoryLabel('YOUTH_AND_RESILIENCE', lang)}</option>
                <option value="COMMUNITY_NEWS">{getCategoryLabel('COMMUNITY_NEWS', lang)}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.externalUrlInput} *
              </label>
              <input
                type="url"
                required
                value={formData.externalUrl}
                onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                placeholder="https://t.me/your_channel"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.phoneInput}
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+970 599 000 000"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {t.emailInput}
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="contact@gaza-relief.org"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              {t.descriptionInput}
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder={lang === 'ar' ? 'نبذة مختصرة عن القناة وأعمال التغطية الإنسانية...' : 'Overview of channel coverage and relief efforts...'}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            <span>{t.submitApplication}</span>
          </button>
        </form>
      </div>

      {/* Currently Registered Publishers Status List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white">
          {lang === 'ar' ? 'سجل حالات القنوات المسجلة في النظام' : 'Registered Publishers Lifecycle Records'}
        </h3>

        <div className="divide-y divide-slate-800">
          {publishers.map((p) => (
            <div key={p.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                <div>
                  <h4 className="font-bold text-white">{p.name}</h4>
                  <p className="text-[11px] text-slate-400">{p.platform} • {p.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="bg-slate-950 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px]">
                  {p.lifecycleStage}
                </span>
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                  p.status === 'VERIFIED'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : p.status === 'DORMANT_CHANNEL'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800/80'
                    : 'bg-slate-950 text-slate-300 border border-slate-800'
                }`}>
                  {p.status === 'DORMANT_CHANNEL' ? 'خاملة (توقف 45+ يوم)' : p.status}
                </span>
              </div>
              {p.status === 'DORMANT_CHANNEL' && (
                <div className="w-full mt-1 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] text-amber-300">
                  ⚠️ <strong>تنبيه الخمول الحوكمي:</strong> القناة متوقفة مؤقتاً لعدم النشر لمدة تتجاوز 45 يوماً. سيتم إعادة التنشيط والإدراج التلقائي في شاشات الداعمين فور رصد نشر محتوى جديد.
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

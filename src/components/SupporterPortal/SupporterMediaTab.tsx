import React from 'react';
import { SupporterProfileData } from './supporterMockData';
import { SupporterAction } from '../../types';
import { ShieldCheck, Video, Lock, CheckCircle2, Radio, Globe, FileCheck } from 'lucide-react';

interface SupporterMediaTabProps {
  isAr: boolean;
  supporterProfile: SupporterProfileData;
  setSupporterProfile: React.Dispatch<React.SetStateAction<SupporterProfileData>>;
  onRecordAction?: (action: SupporterAction) => void;
  setVaultNoticeModal: (modal: any) => void;
}

export const SupporterMediaTab: React.FC<SupporterMediaTabProps> = ({
  isAr,
  supporterProfile,
  setSupporterProfile,
  onRecordAction,
  setVaultNoticeModal,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 md:p-8 space-y-6 shadow-2xl">
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 text-xs font-bold border border-amber-500/30">
          <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{isAr ? 'بيانات هويّة المنتسب وتوصيف صانع المحتوى [أمر سيادي 062]' : 'Supporter Credentials & Creator Meta [Order 062]'}</span>
        </div>
        <h3 className="text-lg md:text-2xl font-black text-white flex items-center gap-2">
          <Video className="w-6 h-6 text-amber-400" />
          <span>{isAr ? 'إدارة بيانات الإشهار والتوثيق لصنّاع المحتوى والداعمين' : 'Sponsor & Creator Onboarding Data Schema'}</span>
        </h3>
        <p className="text-xs text-slate-400 max-w-3xl leading-relaxed">
          {isAr
            ? 'استيفاء بيانات الاعتماد الشخصي، توصيف قناة صانع المحتوى، والتبعية الإقليمية والنطاق الميداني المستهدف بالكفالة المعنوية والتوجيه المروري (مع الحصانة المالّية التامة 0$).'
            : 'Manage credentials, creator channel metadata, and territorial sponsorship scope without financial transactions.'}
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (onRecordAction) {
            onRecordAction({
              id: `act-prof-${Date.now()}`,
              publisherId: supporterProfile.id,
              publisherName: supporterProfile.name,
              platform: (supporterProfile.platform as any) || 'YouTube',
              timestamp: new Date().toISOString(),
            });
          }
          setVaultNoticeModal({
            title: isAr ? 'تم تحديث بيانات التوثيق والانتساب بنجاح' : 'Sovereign Credentials Updated',
            message: isAr
              ? `تم حفظ وتحديث بيانات الداعم/صانع المحتوى (${supporterProfile.name})، والقناة (${supporterProfile.publicChannelName || 'غير مسبوقة'})، وتحديد النطاق الميداني (${supporterProfile.targetTerritory}) بنجاح.`
              : `Updated supporter/creator credentials for ${supporterProfile.name} successfully.`,
            sealHash: `NA-SCHEMA-${Date.now().toString(36).toUpperCase()}`,
            type: 'archive',
          });
        }}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Column 1: Supporter Credentials & Auth */}
        <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 text-amber-400 font-bold text-xs">
            <Lock className="w-4 h-4 shrink-0" />
            <span>{isAr ? '1. الهوية والاعتماد الشخصي' : '1. Personal Credentials'}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isAr ? 'الاسم الكامل / الكيان المؤسسي:' : 'Full Name / Entity Name:'}
            </label>
            <input
              type="text"
              value={supporterProfile.name}
              onChange={(e) => setSupporterProfile({ ...supporterProfile, name: e.target.value })}
              className="w-full bg-slate-900 text-white text-base md:text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 outline-none min-h-[44px] touch-manipulation"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isAr ? 'البريد الإلكتروني الرسمي:' : 'Official Email Address:'}
            </label>
            <input
              type="email"
              value={supporterProfile.email || 'sponsor@sovereign-humanitarian.org'}
              onChange={(e) => setSupporterProfile({ ...supporterProfile, email: e.target.value })}
              className="w-full bg-slate-900 text-white text-base md:text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 outline-none min-h-[44px] font-mono touch-manipulation"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isAr ? 'الصفة / المسمى الاعتباري:' : 'Title / Identity Role:'}
            </label>
            <input
              type="text"
              value={supporterProfile.titleRole}
              onChange={(e) => setSupporterProfile({ ...supporterProfile, titleRole: e.target.value })}
              className="w-full bg-slate-900 text-white text-base md:text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 outline-none min-h-[44px] touch-manipulation"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isAr ? 'حالة التوثيق الرقمي:' : 'Verification Status:'}
            </label>
            <div className="bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-800 text-xs font-bold text-emerald-400 flex items-center justify-between">
              <span>{supporterProfile.verifiedTier || (isAr ? 'كفيل معتمد - المستوى الماسي' : 'Platinum Verified Sponsor')}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Column 2: Creator & Channel Meta */}
        <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 text-amber-400 font-bold text-xs">
            <Radio className="w-4 h-4 shrink-0" />
            <span>{isAr ? '2. بيانات صانع المحتوى والقناة' : '2. Creator & Channel Meta'}</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isAr ? 'اسم القناة / المنبر الرسمي:' : 'Public Channel Name:'}
            </label>
            <input
              type="text"
              value={supporterProfile.publicChannelName || ''}
              onChange={(e) => setSupporterProfile({ ...supporterProfile, publicChannelName: e.target.value })}
              placeholder={isAr ? 'مثال: منبر الكفالة الميدانية' : 'e.g. Field Voice'}
              className="w-full bg-slate-900 text-white text-base md:text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 outline-none min-h-[44px] touch-manipulation"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isAr ? 'المنصة التشغيلية الأساسية:' : 'Primary Platform:'}
            </label>
            <select
              value={supporterProfile.platform || 'YouTube'}
              onChange={(e) => setSupporterProfile({ ...supporterProfile, platform: e.target.value })}
              className="w-full bg-slate-900 text-white text-base md:text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 outline-none min-h-[44px] cursor-pointer touch-manipulation"
            >
              <option value="YouTube">YouTube (يوتيوب)</option>
              <option value="TikTok">TikTok (تيك توك)</option>
              <option value="X">𝕏 X / Twitter (إكس)</option>
              <option value="Telegram">Telegram (تلغرام)</option>
              <option value="Instagram">Instagram (إنستغرام)</option>
              <option value="Facebook">Facebook (فيسبوك)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isAr ? 'تصنيف المحتوى السائد:' : 'Content Category:'}
            </label>
            <select
              value={supporterProfile.contentCategory || 'محتوى إنساني وإغاثي'}
              onChange={(e) => setSupporterProfile({ ...supporterProfile, contentCategory: e.target.value })}
              className="w-full bg-slate-900 text-white text-base md:text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 outline-none min-h-[44px] cursor-pointer touch-manipulation"
            >
              <option value="محتوى إنساني وإغاثي">{isAr ? '❤️ محتوى إنساني وإغاثي' : 'Humanitarian & Relief'}</option>
              <option value="صحفي ميداني">{isAr ? '🎥 صحفي ميداني وثائقي' : 'Field Reporting'}</option>
              <option value="تفاعلي وتوعوي">{isAr ? '📢 تفاعلي وتوعوي' : 'Interactive & Educational'}</option>
              <option value="ثقافي ومجتمعي">{isAr ? '🌱 ثقافي ومجتمعي' : 'Cultural & Community'}</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              {isAr ? 'رابط المقطع التعريفي المعتمد (Intro Video URL):' : 'Intro Video URL:'}
            </label>
            <input
              type="url"
              value={supporterProfile.introVideoUrl || supporterProfile.videoUrl}
              onChange={(e) =>
                setSupporterProfile({
                  ...supporterProfile,
                  introVideoUrl: e.target.value,
                  videoUrl: e.target.value,
                })
              }
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-slate-900 text-white text-base md:text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 outline-none font-mono min-h-[44px] touch-manipulation"
            />
          </div>
        </div>

        {/* Column 3: Regional Scope & Statement */}
        <div className="space-y-4 bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-800/80 pb-2 text-amber-400 font-bold text-xs">
              <Globe className="w-4 h-4 shrink-0" />
              <span>{isAr ? '3. الانتماء الإقليمي والنطاق المستهدف' : '3. Regional & Territory Affiliation'}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isAr ? 'الإقليم الجغرافي الرئيسي:' : 'Main Geographic Region:'}
              </label>
              <select
                value={supporterProfile.mainRegion || 'الشرق الأوسط'}
                onChange={(e) => setSupporterProfile({ ...supporterProfile, mainRegion: e.target.value })}
                className="w-full bg-slate-900 text-white text-base md:text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 outline-none min-h-[44px] cursor-pointer touch-manipulation"
              >
                <option value="الشرق الأوسط">{isAr ? '🌍 الشرق الأوسط' : 'Middle East'}</option>
                <option value="شمال إفريقيا">{isAr ? '🌍 شمال إفريقيا' : 'North Africa'}</option>
                <option value="جنوب شرق آسيا">{isAr ? '🌏 جنوب شرق آسيا' : 'South East Asia'}</option>
                <option value="أوروبا">{isAr ? '🌍 أوروبا' : 'Europe'}</option>
                <option value="أمريكا الشمالية">{isAr ? '🌎 أمريكا الشمالية' : 'North America'}</option>
                <option value="إقليم مفتوح">{isAr ? '🌐 إقليم إنساني مفتوح' : 'Global Open'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isAr ? 'النطاق الجغرافي المستهدف بالكفالة:' : 'Target Territory Scope:'}
              </label>
              <select
                value={supporterProfile.targetTerritory || 'قطاع غزة والقدس الشريف'}
                onChange={(e) => setSupporterProfile({ ...supporterProfile, targetTerritory: e.target.value })}
                className="w-full bg-slate-900 text-white text-base md:text-xs rounded-xl px-3 py-2.5 border border-slate-800 focus:border-amber-500 outline-none min-h-[44px] cursor-pointer touch-manipulation"
              >
                <option value="قطاع غزة والقدس الشريف">{isAr ? '🇵🇸 قطاع غزة والقدس الشريف' : 'Gaza Strip & Al-Quds'}</option>
                <option value="الضفة الغربية">{isAr ? '🇵🇸 الضفة الغربية' : 'West Bank'}</option>
                <option value="السودان">{isAr ? '🇸🇩 السودان' : 'Sudan'}</option>
                <option value="اليمن">{isAr ? '🇾🇪 اليمن' : 'Yemen'}</option>
                <option value="نطاق ميداني مفتوح">{isAr ? '🏳️ نطاق إنساني ميداني مفتوح' : 'Open Field Territory'}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {isAr ? 'بيان الكفالة والإشهار الإنساني:' : 'Humanitarian Statement:'}
              </label>
              <textarea
                rows={3}
                value={supporterProfile.statement}
                onChange={(e) => setSupporterProfile({ ...supporterProfile, statement: e.target.value })}
                className="w-full bg-slate-900 text-white text-base md:text-xs rounded-xl p-3 border border-slate-800 focus:border-amber-500 outline-none touch-manipulation"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-extrabold text-xs sm:text-sm py-3.5 px-5 rounded-xl shadow-xl hover:shadow-amber-500/20 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer min-h-[44px] touch-manipulation border border-amber-300/50"
            >
              <FileCheck className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'حفظ وتوثيق البيانات السيادية' : 'Save Sovereign Credentials'}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

import React from 'react';
import { ShieldCheck, Radio, Zap, Eye, EyeOff, Crown, HeartHandshake, LogOut } from 'lucide-react';
import { SupporterProfileData } from './supporterMockData';
import { Publisher } from '../../types';

interface SupporterHeaderProps {
  supporterProfile: SupporterProfileData;
  sponsoredPublishers?: Publisher[];
  isGhostMode: boolean;
  isLoggedIn: boolean;
  isAr: boolean;
  onToggleGhostMode: () => void;
  onToggleLogin: () => void;
  onLogout?: () => void;
  onOpenConceptGuide?: () => void;
}

export const SupporterHeader: React.FC<SupporterHeaderProps> = React.memo(({
  supporterProfile,
  sponsoredPublishers = [],
  isGhostMode,
  isLoggedIn,
  isAr,
  onToggleGhostMode,
  onToggleLogin,
  onLogout,
  onOpenConceptGuide,
}) => {
  const totalSponsoredCount = sponsoredPublishers.length || supporterProfile.sponsoredPublisherIds.length;
  
  // Calculate Godfather (full adoption) vs Guidance & Support channels
  const godFatherCount = sponsoredPublishers.length > 0
    ? sponsoredPublishers.filter(p => p.verificationLevel === 'PLATINUM' || p.isGazaPilot).length || 1
    : 1;
  const guidanceCount = Math.max(0, totalSponsoredCount - godFatherCount);

  return (
    <div className="supporter-dashboard-header w-full bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-950 border border-amber-500/30 rounded-xl sm:rounded-2xl md:rounded-3xl p-2.5 sm:p-5 md:p-6 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-emerald-400 to-amber-500" />

      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 md:gap-6 w-full">
        {/* Account Profile Details */}
        <div className="flex items-center gap-3 sm:gap-4 w-full lg:w-auto justify-between sm:justify-start">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative shrink-0">
              <img
                src={supporterProfile.avatar}
                alt={supporterProfile.name}
                className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-amber-400 shadow-xl shrink-0"
              />
              <div className="absolute -bottom-1 -right-1 bg-slate-950 p-1 rounded-full border border-amber-400">
                <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg md:text-2xl font-black text-white">
                  {supporterProfile.name}
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 text-[10px] sm:text-xs font-extrabold border border-amber-500/30">
                  {supporterProfile.verifiedTier}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                {supporterProfile.titleRole}
              </p>
              
              {/* Sponsorship Types & Oversight Metadata */}
              <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-[11px] text-slate-400 pt-1.5 flex-wrap">
                <span className="flex items-center gap-1.5 text-emerald-300 font-extrabold bg-emerald-500/15 px-2.5 py-1 rounded-lg border border-emerald-500/30 shadow-inner">
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Radio className="w-3.5 h-3.5 text-emerald-400" />
                  <span>
                    {isAr
                      ? `الكفالات النشطة: ${totalSponsoredCount} قنوات`
                      : `Active Oversight: ${totalSponsoredCount} Channels`}
                  </span>
                </span>

                {/* Sponsorship Type: كفالة عراب */}
                <span className="text-amber-300 font-bold flex items-center gap-1.5 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30 shadow-sm" title={isAr ? 'كفالة عراب (تبني كامل للقناة والقائمين عليها)' : 'Godfather Patronage (Full Adoption)'}>
                  <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    {isAr
                      ? `نوعية الكفالة: كفالة عراب (${godFatherCount} تبني كامل)`
                      : `Sponsorship Type: Godfather (${godFatherCount} Patronage)`}
                  </span>
                </span>

                {/* Sponsorship Type: كفالة توجيه ودعم */}
                <span className="text-purple-300 font-bold flex items-center gap-1.5 bg-purple-500/15 px-2.5 py-1 rounded-lg border border-purple-500/30 shadow-sm" title={isAr ? 'كفالة توجيه ودعم (توفير إشراف ودعم انتشار ميداني)' : 'Guidance & Support Sponsorship'}>
                  <HeartHandshake className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                  <span>
                    {isAr
                      ? `كفالة توجيه ودعم (${guidanceCount} إشراف)`
                      : `Guidance & Support (${guidanceCount} Field Support)`}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions & Ghost Mode Switch */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 w-full lg:w-auto shrink-0 bg-slate-950/80 p-2.5 sm:p-3 rounded-xl sm:rounded-2xl border border-slate-800">
          {/* Ghost Mode Toggle (Min 44px Touch Target) */}
          <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800/80 min-h-[44px] w-full sm:w-auto flex-1">
            <div className="flex items-center gap-2">
              {isGhostMode ? (
                <EyeOff className="w-4 h-4 text-purple-400 shrink-0" />
              ) : (
                <Eye className="w-4 h-4 text-amber-400 shrink-0" />
              )}
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1">
                  <span>{isAr ? 'وضعية الشبح (الكفالة الصامتة)' : 'Ghost Mode (Silent Sponsor)'}</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {isGhostMode
                    ? isAr
                      ? 'هويتك مخفية من لوحة الشرف العامة'
                      : 'Hidden from public hall'
                    : isAr
                    ? 'اسمك وشعارك معلنان بصفتك كفيلاً'
                    : 'Publicly visible sponsor'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onToggleGhostMode}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none min-h-[24px] ${
                isGhostMode ? 'bg-purple-600' : 'bg-slate-700'
              }`}
              title={isAr ? 'تبديل إخفاء/إشهار الهوية' : 'Toggle Identity Concealment'}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                  isGhostMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Login / Auth Switch Button & Logout */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto flex-1">
            <button
              type="button"
              onClick={onToggleLogin}
              className={`flex items-center justify-center gap-2 text-xs font-black px-4 py-2.5 rounded-xl border transition cursor-pointer min-h-[44px] w-full flex-1 ${
                isLoggedIn
                  ? 'bg-gradient-to-r from-amber-500/20 via-slate-900 to-amber-950/40 text-amber-300 border-amber-500/50 hover:border-amber-400 shadow-md shadow-amber-950/20'
                  : 'bg-gradient-to-r from-emerald-950/40 via-slate-900 to-amber-950/40 text-emerald-300 border-emerald-500/50 hover:border-emerald-400 shadow-md shadow-emerald-950/20'
              }`}
              title={isAr ? 'حالة حساب الداعم والكفيل' : 'Supporter Account Status'}
            >
              <Crown className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="whitespace-nowrap">
                {isLoggedIn
                  ? isAr
                    ? 'قمرة الداعم (حساب نشط)'
                    : 'Active Supporter Cockpit'
                  : isAr
                  ? 'فتح حساب داعم / تسجيل دخول'
                  : 'Register / Sign In as Supporter'}
              </span>
            </button>

            {isLoggedIn && onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="px-3.5 py-2.5 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-500/50 hover:border-rose-400 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px] shrink-0 shadow-md shadow-rose-950/30"
                title={isAr ? 'تسجيل الخروج' : 'Sign Out'}
              >
                <LogOut className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="whitespace-nowrap">{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

SupporterHeader.displayName = 'SupporterHeader';

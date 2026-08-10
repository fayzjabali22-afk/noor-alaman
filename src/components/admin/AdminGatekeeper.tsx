import React from 'react';
import { ShieldAlert, Zap, KeyRound, Lock, LogIn, Cpu, UserCheck } from 'lucide-react';

interface AdminGatekeeperProps {
  adminEmail: string;
  setAdminEmail: (val: string) => void;
  adminPasscode: string;
  setAdminPasscode: (val: string) => void;
  onLogin: (e: React.FormEvent) => void;
}

export const AdminGatekeeper: React.FC<AdminGatekeeperProps> = React.memo(({
  adminEmail,
  setAdminEmail,
  adminPasscode,
  setAdminPasscode,
  onLogin,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-6 px-4">
      <div className="bg-slate-900 border border-rose-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Decorative Lights */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-0 pointer-events-none" />

        {/* Header Badge & Title */}
        <div className="text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-400 text-xs font-black border border-rose-500/30 shadow-inner">
            <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
            <span>قطاع المشرف - بوابة الوصول إلى غرفة العمليات (Gatekeeper Access)</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
            شاشة تسجيل دخول مدير النظام
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
            بوابة الوصول الإداري السيادي - غرفة عمليات التحكم في النظام والإشراف المباشر منصة نور الأماني
          </p>
        </div>

        {/* Development Mode Notice Bar */}
        <div className="bg-amber-950/50 border-2 border-amber-500/60 rounded-2xl p-4 sm:p-5 text-xs space-y-2 relative z-10 shadow-lg shadow-amber-950/30">
          <div className="flex items-center gap-2 font-black text-amber-300 text-sm">
            <Zap className="w-5 h-5 text-amber-400 animate-bounce" />
            <span>شريط تنبيه مرحلة الدخول للتطوير (Dev Mode Instant Access):</span>
          </div>
          <p className="text-slate-200 leading-relaxed font-medium">
            لتسهيل عمليات البرمجة، التطوير، والتجربة الميدانية السريعة، تم تفعيل <strong>مقبض الدخول الفوري والمباشر بنقرة زر واحدة</strong> بدون اشتراط التحقق الإلكتروني أو كلمة المرور حالياً. يمكنك النقر أدناه للدخول المباشر إلى غرفة العمليات السحابية.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={onLogin} className="space-y-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <KeyRound className="w-3.5 h-3.5 text-rose-400" />
                <span>معرّف حساب المشرف السيادي</span>
              </label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 transition font-mono"
                placeholder="admin@nooralamani.gov"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>رمز حماية غرفة العمليات</span>
              </label>
              <input
                type="password"
                value={adminPasscode}
                onChange={(e) => setAdminPasscode(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 transition font-mono"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 via-red-600 to-rose-700 hover:from-rose-500 hover:to-red-600 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-rose-950/60 text-sm transition transform active:scale-98 border border-rose-400/30 cursor-pointer"
          >
            <LogIn className="w-5 h-5 text-white" />
            <span>الدخول الفوري والمباشر إلى غرفة العمليات (نقرة زر واحدة للتطوير)</span>
          </button>
        </form>

        {/* Future Readiness Section */}
        <div className="pt-5 border-t border-slate-800/80 space-y-3 relative z-10">
          <div className="flex items-center gap-2 text-xs font-black text-slate-300">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span>جاهز للمستقبل الداخلي (Internal Future Extensions Readiness):</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-purple-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5 text-purple-400" />
                  <span>شهادات المصادقة البيومترية</span>
                </span>
                <span className="text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full border border-purple-500/30">
                  SLOT READY
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                مقبض مدمج لمطابقة البصمة الحيوية وبصمة الوجه المعتمدة قانونياً لمديري النظام.
              </p>
            </div>

            <div className="p-3.5 bg-slate-950/80 rounded-2xl border border-indigo-500/30 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                  <span>المفاتيح الخاصة بالنظام القانوني</span>
                </span>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  SLOT READY
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                حاوية مشفرة لمفاتيح التوقيع الرقمي القانوني ومزامنة القرارات المعتمدة.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

AdminGatekeeper.displayName = 'AdminGatekeeper';

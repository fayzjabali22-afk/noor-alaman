const fs = require('fs');
let content = fs.readFileSync('src/components/HomeScreenView.tsx', 'utf-8');

const target = `          {/* Governed Human Reference System Card */}
          <div className="w-full max-w-3xl mx-auto pt-4 space-y-4">
            <div className="bg-slate-900/80 border border-slate-700/60 rounded-3xl p-5 sm:p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
              <div className="absolute -top-10 -right-10 p-3 opacity-[0.03] pointer-events-none">
                <ShieldCheck className="w-48 h-48 text-emerald-400" />
              </div>
              <div className="relative z-10 space-y-5 text-center">
                <div className="inline-flex items-center gap-2 bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-full text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{isAr ? 'النظام المرجعي الإنساني' : 'Humanitarian Reference System'}</span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                  {isAr ? 'توزيع فرص الظهور والدعم بحوكمة وعدالة' : 'Governed & Fair Distribution of Visibility and Support'}
                </h3>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => onNavigateTab('supporter')}
                    className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm px-7 py-3.5 rounded-2xl shadow-xl shadow-emerald-950/40 transition hover:scale-[1.02] active:scale-95"
                  >
                    <Heart className="w-4 h-4 text-rose-300 fill-rose-300/30" />
                    <span>{isAr ? 'استكشاف فرص الدعم العادل' : 'Explore Fair Support'}</span>
                    <ArrowIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onNavigateTab('publisher')}
                    className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-sm px-7 py-3.5 rounded-2xl border border-slate-700 hover:border-slate-600 transition hover:scale-[1.02] active:scale-95 shadow-md"
                  >
                    <UserPlus className="w-4 h-4 text-emerald-400" />
                    <span>{isAr ? 'الانضمام كناشر إنساني' : 'Join as Publisher'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quiet Impact Widget (Zero UI Bloat) */}`;

const replacement = `          {/* Action Buttons */}
          <div className="flex flex-col items-center justify-center gap-6 pt-4 w-full">
            <button
              onClick={() => onNavigateTab('supporter')}
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-950/40 transition hover:scale-[1.02] active:scale-95"
            >
              <Heart className="w-4 h-4 text-rose-300 fill-rose-300/30" />
              <span>{isAr ? 'ابدأ الدعم والتصفح' : 'Start Support & Explore'}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>

            {/* Quiet Impact Widget (Zero UI Bloat) */}`;

content = content.replace(target, replacement);

fs.writeFileSync('src/components/HomeScreenView.tsx', content);

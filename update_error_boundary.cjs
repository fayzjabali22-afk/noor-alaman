const fs = require('fs');
let code = fs.readFileSync('src/components/common/SectorErrorBoundary.tsx', 'utf-8');

// Replace the technical UI with a calm, serene UI
code = code.replace(
  `        <div className="min-h-[350px] w-full bg-slate-950 border border-rose-500/40 rounded-3xl p-6 sm:p-8 my-4 shadow-2xl space-y-6 text-right" dir="rtl">`,
  `        <div className="min-h-[300px] w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 my-4 shadow-sm flex flex-col justify-center items-center text-center space-y-6" dir="rtl">`
);

code = code.replace(
  `          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 text-xs font-black border border-rose-500/20">
                <ShieldAlert className="w-4 h-4 text-rose-400 animate-pulse" />
                <span>حاجز الأمان والتصدّي للاستثناءات [NA-SOVEREIGN-EXEC-ANTI-SWALLOW-006]</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                <span>{this.props.fallbackTitleAr || this.props.title || 'شاشة حماية الحدود واحتواء الأخطاء الطارئة'}</span>
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
                تم التقاط استثناء طارئ في واجهة المستخدم واحتواؤه بنجاح لمنع انهيار النظام أو تجميد المنصة، مع تسجيل كافة التفاصيل للتحليل المباشر.
              </p>
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 text-xs font-mono font-bold border border-amber-500/30">
              STATE_CONTAINED ✓
            </span>
          </div>`,
  `          {/* Calm Reassuring UI */}
          <div className="space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8 text-amber-400 opacity-80" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-100 tracking-wide">
              {this.props.fallbackTitleAr || this.props.title || 'عذراً، حدث تعثر مؤقت'}
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              نقوم حالياً باحتواء وتجاوز هذا التعثر لضمان استمرار تجربتك بسلاسة. يمكنك إعادة تحميل هذا القطاع بأمان، مع بقاء باقي المنصة قيد العمل.
            </p>
          </div>`
);

// Simplify the error details and buttons area to be less technical
code = code.replace(
  /<div className="grid grid-cols-1 md:grid-cols-2 gap-4">[\s\S]*?<\/div>[\s\S]*?<\/div>/g,
  `<div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-800/50 w-full max-w-md">
            <button
              onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold transition-all border border-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
              <span>تحديث واستئناف</span>
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-transparent hover:bg-slate-800/50 text-slate-400 text-sm font-bold transition-all border border-transparent hover:border-slate-800"
            >
              <Home className="w-4 h-4" />
              <span>العودة للرئيسية</span>
            </button>
          </div>
        </div>`
);


fs.writeFileSync('src/components/common/SectorErrorBoundary.tsx', code, 'utf-8');
console.log('Error boundary updated.');

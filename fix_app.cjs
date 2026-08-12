const fs = require('fs');

let file = fs.readFileSync('src/App.tsx', 'utf-8');

file = file.replace(/<React\.Suspense fallback=\{<div className="flex h-\[40vh\] items-center justify-center text-slate-400 font-medium animate-pulse border border-slate-800\/50 rounded-2xl bg-slate-900\/20 mt-4">جاري تحميل مكونات القطاع السيادي\.\.\.<\/div>\}>\n              <React\.Suspense/g, "<React.Suspense");

file = file.replace(/<SectorErrorBoundary moduleName="ErrorDictionaryExplorer" fallbackTitleAr="تعثر مؤقت في معجم الأخطاء">\n            <ErrorDictionaryExplorer/g, "<SectorErrorBoundary moduleName=\"ErrorDictionaryExplorer\" fallbackTitleAr=\"تعثر مؤقت في معجم الأخطاء\">\n            <React.Suspense fallback={<div className=\"flex h-[40vh] items-center justify-center text-slate-400 font-medium animate-pulse border border-slate-800/50 rounded-2xl bg-slate-900/20 mt-4\">جاري التحميل...</div>}>\n              <ErrorDictionaryExplorer");

fs.writeFileSync('src/App.tsx', file);

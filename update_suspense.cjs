const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/(<SectorErrorBoundary[^>]*>)\s*(<[A-Z][a-zA-Z0-9]+[^>]*\/>)\s*(<\/SectorErrorBoundary>)/g, 
  '$1\n            <React.Suspense fallback={<div className="flex h-[40vh] items-center justify-center text-slate-400 font-medium animate-pulse border border-slate-800/50 rounded-2xl bg-slate-900/20 mt-4">جاري التحميل...</div>}>\n              $2\n            </React.Suspense>\n          $3');

// For multiline tags:
code = code.replace(/(<SectorErrorBoundary[^>]*>)\s*(<[A-Z][a-zA-Z0-9]+[\s\S]*?\/>)\s*(<\/SectorErrorBoundary>)/g, 
  '$1\n            <React.Suspense fallback={<div className="flex h-[40vh] items-center justify-center text-slate-400 font-medium animate-pulse border border-slate-800/50 rounded-2xl bg-slate-900/20 mt-4">جاري تحميل مكونات القطاع السيادي...</div>}>\n              $2\n            </React.Suspense>\n          $3');

fs.writeFileSync('src/App.tsx', code, 'utf-8');

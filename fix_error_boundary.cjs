const fs = require('fs');
let code = fs.readFileSync('src/components/common/SectorErrorBoundary.tsx', 'utf-8');

// Replace everything after the calm UI div closes until the final div closes.
code = code.replace(
  /          \{\/\* Error Details Box \*\/\}[\s\S]*?<\/div>\s*<\/div>/,
  `          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-800/50 w-full max-w-md">
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null, errorInfo: null });
                if (this.props.onReset) this.props.onReset();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold transition-all border border-slate-700"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة المحاولة والمتابعة</span>
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
console.log('Fixed');

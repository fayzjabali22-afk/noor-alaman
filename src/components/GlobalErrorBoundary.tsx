import React, { ErrorInfo, ReactNode } from 'react';
import { RefreshCw, ShieldAlert } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitleAr?: string;
  fallbackTitleEn?: string;
  moduleName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class GlobalErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[Noor Al-Amani ErrorBoundary] Caught exception in ${this.props.moduleName || 'Global Module'}:`, error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  override render() {
    if (this.state.hasError) {
      const isAr = true; // High-res emergency fallback
      return (
        <div className="p-6 md:p-8 my-6 bg-slate-900/95 border border-amber-500/40 rounded-3xl shadow-2xl text-slate-100 backdrop-blur-md">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-amber-500/20 border border-amber-500/40 rounded-2xl text-amber-400 shrink-0">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-amber-400 uppercase">
                <span>[حراسة التعافي السيادي - Sovereign Fallback Guard]</span>
              </div>
              <h3 className="text-xl font-bold text-amber-100">
                {this.props.fallbackTitleAr || 'حدث تعثر مؤقت في عرض المكون السيادي'}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {isAr
                  ? 'تم التقاط الاستثناء بنجاح بفضل حراسة الحماية لمنع انهيار التطبيق. يمكنك إعادة تحميل المكون أو استكمال التصفح بأمان.'
                  : 'An exception was safely intercepted by the Sovereign Error Guard to protect the platform session.'}
              </p>
              {this.state.error && (
                <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-xs font-mono text-amber-300/80 overflow-x-auto max-h-24">
                  {this.state.error.toString()}
                </div>
              )}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-sm rounded-2xl transition flex items-center gap-2 shadow-lg"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>إعادة محاولة العرض (Retry Component)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

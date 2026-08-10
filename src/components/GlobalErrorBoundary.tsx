import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw, Copy, Check, AlertTriangle, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  title?: string;
  moduleName?: string;
  fallbackTitleAr?: string;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  copied: boolean;
}

export class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
    copied: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
      copied: false,
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error in Noor Al-Amani Module:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      copied: false,
    });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleCopyError = () => {
    const errorDetails = `[Noor Al-Amani Error Log]\nError: ${this.state.error?.message || 'Unknown'}\nStack: ${
      this.state.error?.stack || 'No stack trace'
    }\nComponent Stack: ${this.state.errorInfo?.componentStack || 'N/A'}`;

    navigator.clipboard
      .writeText(errorDetails)
      .then(() => {
        this.setState({ copied: true });
        setTimeout(() => this.setState({ copied: false }), 3000);
      })
      .catch((err) => {
        console.error('Error in Noor Al-Amani Module:', err);
      });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[350px] w-full bg-slate-950 border border-rose-500/40 rounded-3xl p-6 sm:p-8 my-4 shadow-2xl space-y-6 text-right" dir="rtl">
          {/* Header Banner */}
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
          </div>

          {/* Error Details Box */}
          <div className="bg-slate-900 border border-rose-900/50 rounded-2xl p-4 sm:p-5 space-y-3 font-mono">
            <div className="flex items-center justify-between text-xs font-bold text-rose-300 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>تفاصيل الاستثناء الملتقط:</span>
              </span>
              <span className="text-[10px] text-slate-500">{new Date().toLocaleTimeString('ar-EG')}</span>
            </div>

            <p className="text-xs text-rose-200 font-bold leading-relaxed break-words">
              {this.state.error?.toString() || 'استثناء غير معروف في واجهة العرض'}
            </p>

            {this.state.errorInfo?.componentStack && (
              <details className="text-[11px] text-slate-400 cursor-pointer">
                <summary className="hover:text-slate-200 font-bold transition text-amber-400">
                  عرض مسار استدعاء المكونات (Component Stack)
                </summary>
                <pre className="mt-2 p-3 bg-slate-950 rounded-xl overflow-x-auto text-[10px] text-slate-300 leading-tight dir-ltr text-left border border-slate-800">
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={this.handleReset}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition flex items-center gap-2 shadow-lg cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              <span>إعادة المحاولة والشفاء الذاتي</span>
            </button>

            <button
              type="button"
              onClick={this.handleReload}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition flex items-center gap-2 border border-slate-700 cursor-pointer"
            >
              <Home className="w-4 h-4 text-indigo-400" />
              <span>تحديث شاشة المنصة</span>
            </button>

            <button
              type="button"
              onClick={this.handleCopyError}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs transition flex items-center gap-2 border border-amber-500/30 cursor-pointer"
            >
              {this.state.copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>تم نسخ سجل الخطأ ✓</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>نسخ تقرير الاستثناء</span>
                </>
              )}
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

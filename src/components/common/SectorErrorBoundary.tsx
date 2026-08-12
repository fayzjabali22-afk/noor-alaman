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

export class SectorErrorBoundary extends Component<Props, State> {
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
        <div className="min-h-[300px] w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 my-4 shadow-sm flex flex-col justify-center items-center text-center space-y-6" dir="rtl">
          {/* Calm Reassuring UI */}
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
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-800/50 w-full max-w-md">
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
        </div>
      );
    }

    return this.props.children;
  }
}

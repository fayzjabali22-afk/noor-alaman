import React from 'react';
import { Award, ShieldCheck, CheckCircle2, ShieldAlert, AlertTriangle } from 'lucide-react';
import { Language } from '../types';

export interface TrustBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  lang?: Language;
  hasPendingReports?: boolean;
  openReportsCount?: number;
}

/**
 * TrustBadge (شارة الثقة والحوكمة)
 * Pure Presentational / Dumb UI component displaying publisher trust and fairness tier
 * with an optional warning indicator for pending reports in the Verification Queue.
 * (NA-DUMB-UI-CONSTRAINT-001 Compliant)
 */
export const TrustBadge: React.FC<TrustBadgeProps> = ({
  score,
  size = 'sm',
  showText = true,
  lang = 'ar',
  hasPendingReports = false,
  openReportsCount = 0,
}) => {
  const isAr = lang === 'ar';
  const showWarning = hasPendingReports || openReportsCount > 0;

  // Tier calculation
  let colorStyle = '';
  let label = '';
  let IconComponent = ShieldCheck;

  if (score >= 85) {
    colorStyle = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    label = isAr ? 'حوكمة عالية' : 'High Trust';
    IconComponent = ShieldCheck;
  } else if (score >= 70) {
    colorStyle = 'bg-sky-500/15 text-sky-400 border-sky-500/30';
    label = isAr ? 'حوكمة ممتازة' : 'Verified Fair';
    IconComponent = Award;
  } else if (score >= 50) {
    colorStyle = 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    label = isAr ? 'حوكمة متوسطة' : 'Moderate';
    IconComponent = CheckCircle2;
  } else {
    colorStyle = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    label = isAr ? 'قيد المتابعة' : 'Under Review';
    IconComponent = ShieldAlert;
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4',
  };

  const textSizes = {
    sm: 'text-[10px]',
    md: 'text-[11px]',
    lg: 'text-xs',
  };

  const paddingSizes = {
    sm: 'px-1.5 py-0.5 gap-1',
    md: 'px-2 py-0.5 gap-1',
    lg: 'px-2.5 py-1 gap-1.5',
  };

  return (
    <span className="inline-flex items-center gap-1 shrink-0">
      <span
        className={`inline-flex items-center rounded-full border font-bold ${colorStyle} ${paddingSizes[size]} shrink-0`}
        title={`${isAr ? 'مؤشر الحوكمة والعدالة (FairScore):' : 'Fairness & Governance Score:'} ${score}%`}
      >
        <IconComponent className={iconSizes[size]} />
        {showText && (
          <span className={`${textSizes[size]} font-mono leading-none`}>
            {label} ({score}%)
          </span>
        )}
      </span>

      {showWarning && (
        <span
          className={`inline-flex items-center gap-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold ${paddingSizes[size]} animate-pulse`}
          title={
            isAr
              ? `تنبيه: يوجد ${openReportsCount > 0 ? openReportsCount : ''} بلاغ مفتوح قيد التحقق في طابور التدقيق (Verification Queue)`
              : `Warning: ${openReportsCount > 0 ? openReportsCount : 'Pending'} open report(s) in Verification Queue`
          }
        >
          <AlertTriangle className={`${iconSizes[size]} text-amber-400`} />
          <span className={`${textSizes[size]} font-mono leading-none`}>
            {openReportsCount > 0 ? openReportsCount : ''}
          </span>
        </span>
      )}
    </span>
  );
};

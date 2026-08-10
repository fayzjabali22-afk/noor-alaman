import React from 'react';

interface SupporterSkeletonProps {
  isAr?: boolean;
}

export const SupporterSkeleton: React.FC<SupporterSkeletonProps> = React.memo(({ isAr = true }) => {
  return (
    <div
      className="space-y-8 animate-pulse"
      aria-busy="true"
      aria-label={isAr ? 'جاري تحميل بيانات كفالة الداعم...' : 'Loading Supporter Portal...'}
    >
      {/* Header Skeleton - Fixed Dimensions for Zero CLS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 min-h-[180px]">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-slate-800 shrink-0" />
            <div className="space-y-2">
              <div className="h-6 w-48 bg-slate-800 rounded-lg" />
              <div className="h-4 w-64 bg-slate-800/70 rounded-lg" />
              <div className="h-3 w-36 bg-slate-800/50 rounded-lg" />
            </div>
          </div>
          <div className="h-12 w-48 bg-slate-800 rounded-2xl shrink-0" />
        </div>
        <div className="flex items-center gap-2 pt-4 border-t border-slate-800/80 overflow-x-auto">
          <div className="h-10 w-36 bg-slate-800 rounded-xl shrink-0" />
          <div className="h-10 w-36 bg-slate-800/70 rounded-xl shrink-0" />
          <div className="h-10 w-36 bg-slate-800/70 rounded-xl shrink-0" />
          <div className="h-10 w-36 bg-slate-800/70 rounded-xl shrink-0" />
        </div>
      </div>

      {/* Metrics Skeleton */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 min-h-[160px]">
        <div className="h-6 w-56 bg-slate-800 rounded-lg" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="h-24 bg-slate-800/60 rounded-2xl p-4 space-y-2">
            <div className="h-3 w-16 bg-slate-700/50 rounded" />
            <div className="h-8 w-24 bg-slate-700/80 rounded" />
          </div>
          <div className="h-24 bg-slate-800/60 rounded-2xl p-4 space-y-2">
            <div className="h-3 w-16 bg-slate-700/50 rounded" />
            <div className="h-8 w-24 bg-slate-700/80 rounded" />
          </div>
          <div className="h-24 bg-slate-800/60 rounded-2xl p-4 space-y-2">
            <div className="h-3 w-16 bg-slate-700/50 rounded" />
            <div className="h-8 w-24 bg-slate-700/80 rounded" />
          </div>
          <div className="h-24 bg-slate-800/60 rounded-2xl p-4 space-y-2">
            <div className="h-3 w-16 bg-slate-700/50 rounded" />
            <div className="h-8 w-24 bg-slate-700/80 rounded" />
          </div>
        </div>
      </div>

      {/* Vault / Radar Skeleton */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 min-h-[140px]">
        <div className="h-6 w-64 bg-slate-800 rounded-lg" />
        <div className="h-32 bg-slate-800/40 rounded-2xl" />
      </div>
    </div>
  );
});

SupporterSkeleton.displayName = 'SupporterSkeleton';

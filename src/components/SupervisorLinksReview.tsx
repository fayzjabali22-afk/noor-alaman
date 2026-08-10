import React, { useState, useEffect, useCallback } from 'react';
import { ShieldAlert, ShieldCheck, ExternalLink, AlertTriangle, Link2, CheckCircle2, XCircle, RefreshCw, Lock } from 'lucide-react';
import { PendingLink, supervisorLinksService } from '../services/supervisorLinksService';

/**
 * SupervisorLinksReview Component
 * Sovereign Directive: [NA-SOV-ARCH-2026-0808-032]
 * Governance Constraint: Pure Presentational & Service-Decoupled UI (NA-DUMB-UI-CONSTRAINT-001 v1.0)
 * - Decoupled data fetching via supervisorLinksService
 * - Dual verification display: Security (HTTPS check) & Database Duplication Alert
 * - Clean responsive cards with action delegates for supervisors
 */

interface SupervisorLinksReviewProps {
  isAr: boolean;
  onApproveSuccess?: (linkId: string) => void;
  onRejectSuccess?: (linkId: string) => void;
}

export const SupervisorLinksReview: React.FC<SupervisorLinksReviewProps> = React.memo(({
  isAr,
  onApproveSuccess,
  onRejectSuccess,
}) => {
  const [links, setLinks] = useState<PendingLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const loadPendingLinks = useCallback(async () => {
    setLoading(true);
    try {
      const data = await supervisorLinksService.fetchPendingLinks();
      setLinks(data);
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPendingLinks();
  }, [loadPendingLinks]);

  const handleApprove = async (item: PendingLink) => {
    setActionInProgress(item.id);
    await supervisorLinksService.approveLink(item);
    setLinks((prev) => prev.filter((l) => l.id !== item.id));
    if (onApproveSuccess) onApproveSuccess(item.id);
    setActionInProgress(null);
  };

  const handleReject = async (item: PendingLink) => {
    setActionInProgress(item.id);
    await supervisorLinksService.rejectLink(item.id);
    setLinks((prev) => prev.filter((l) => l.id !== item.id));
    if (onRejectSuccess) onRejectSuccess(item.id);
    setActionInProgress(null);
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Link2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-base md:text-lg font-black text-white flex items-center gap-2">
              <span>{isAr ? 'مراجعة وتدقيق روابط الداعمين والترشيحات' : 'Supporter Links & Referrals Review'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'رصد أمني وتدقيق مزدوج لمنع التكرار واختراق الروابط غير المشفّرة'
                : 'Dual security & duplication review for submitted supporter links'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={loadPendingLinks}
            className="p-2 text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition"
            title={isAr ? 'تحديث اللوحة' : 'Refresh'}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl font-bold">
            {links.length} {isAr ? 'قيد التدقيق' : 'Pending'}
          </span>
        </div>
      </div>

      {/* Body */}
      {loading ? (
        <div className="text-center py-12 space-y-3">
          <RefreshCw className="w-6 h-6 text-amber-400 animate-spin mx-auto" />
          <p className="text-slate-400 text-xs font-medium">
            {isAr ? 'جاري الفحص الأمني والمقارنة التكرارية عبر المحول السيادي...' : 'Running security & duplication check...'}
          </p>
        </div>
      ) : links.length === 0 ? (
        <div className="text-center py-12 space-y-2 bg-slate-950/50 rounded-2xl border border-slate-800/50 p-6">
          <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
          <p className="text-slate-300 text-sm font-bold">
            {isAr ? 'جميع الروابط مدققة وموثقة بالكامل' : 'All links are fully audited and verified'}
          </p>
          <p className="text-slate-500 text-xs">
            {isAr ? 'لا توجد روابط أو ترشيحات جديدة بانتظار المراجعة حالياً' : 'No pending supporter links awaiting review'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {links.map((item) => {
            const isProcessing = actionInProgress === item.id;
            return (
              <div
                key={item.id}
                className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-slate-700 transition shadow-inner"
              >
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap text-xs">
                    <span className="font-bold text-white bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
                      {isAr ? 'الداعم:' : 'Supporter:'} {item.supporterName}
                    </span>

                    {/* Security Status Badge */}
                    {item.securityStatus === 'SAFE' ? (
                      <span className="flex items-center gap-1 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-lg font-bold">
                        <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                        <span>{isAr ? 'آمن (HTTPS معتمد)' : 'Secure (HTTPS)'}</span>
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 bg-rose-500/15 text-rose-400 border border-rose-500/30 px-2.5 py-1 rounded-lg font-bold">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0 animate-pulse" />
                        <span>{isAr ? 'تحذير: غير مشفر HTTP' : 'Unsecure (HTTP)'}</span>
                      </span>
                    )}

                    {/* Duplication Warning Badge */}
                    {item.isDuplicate && (
                      <span className="flex items-center gap-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-lg font-bold">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>{isAr ? '⚠️ موجود مسبقاً في نور الأماني' : '⚠️ Duplicate Link'}</span>
                      </span>
                    )}
                  </div>

                  {/* Target URL */}
                  <a
                    href={item.targetUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-400 hover:text-amber-300 underline flex items-center gap-1.5 font-mono break-all group max-w-full overflow-hidden"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition" />
                    <span className="truncate">{item.targetUrl}</span>
                  </a>

                  {item.notes && (
                    <p className="text-[11px] text-slate-400 italic">
                      {isAr ? 'ملاحظة الترشيح: ' : 'Notes: '}{item.notes}
                    </p>
                  )}
                </div>

                {/* Supervisor Action Buttons */}
                <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleApprove(item)}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-md active:scale-95 cursor-pointer min-h-[40px]"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isAr ? 'اعتماد ونشر' : 'Approve & Publish'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleReject(item)}
                    className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-rose-950 text-slate-300 hover:text-rose-300 disabled:opacity-50 text-xs font-bold px-4 py-2.5 rounded-xl border border-slate-800 hover:border-rose-800 transition shadow-sm active:scale-95 cursor-pointer min-h-[40px]"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>{isAr ? 'رفض' : 'Reject'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});

SupervisorLinksReview.displayName = 'SupervisorLinksReview';

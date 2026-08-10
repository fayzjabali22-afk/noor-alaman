import React, { useState } from 'react';
import {
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Check,
  ShieldCheck,
  ShieldAlert,
} from 'lucide-react';
import { VerificationQueueItem, Publisher } from '../../types';
import { SupervisorLinksReview } from '../SupervisorLinksReview';

interface VerificationQueueTabProps {
  verificationQueue: VerificationQueueItem[];
  publishers?: Publisher[];
  lang: 'ar' | 'en';
  onApproveVerification: (item: VerificationQueueItem, note?: string) => void;
  onRejectVerification: (item: VerificationQueueItem, note: string) => void;
  onRequestInfoVerification: (item: VerificationQueueItem, note: string) => void;
}

export const VerificationQueueTab: React.FC<VerificationQueueTabProps> = React.memo(({
  verificationQueue,
  publishers = [],
  lang,
  onApproveVerification,
  onRejectVerification,
  onRequestInfoVerification,
}) => {
  const [activeVerificationItem, setActiveVerificationItem] = useState<VerificationQueueItem | null>(null);
  const [verificationModalType, setVerificationModalType] = useState<
    'APPROVE_STANDARD' | 'APPROVE_EXCEPTION' | 'REJECT' | 'NEEDS_INFO' | null
  >(null);
  const [verificationNoteInput, setVerificationNoteInput] = useState('');

  return (
    <div className="space-y-6">
      {/* Supporter Links & Referrals Review Module [NA-SOV-ARCH-2026-0808-032] */}
      <SupervisorLinksReview isAr={lang === 'ar'} />

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-emerald-400" />
              <span>طابور المراجعة والتحقق للحوكمة المرجعية ({verificationQueue.length})</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              مراجعة وتدقيق أهليات الناشرين وفق معايير الحوكمة المرجعية والتحقق الهجين.
            </p>
          </div>
        </div>

        {verificationQueue.length === 0 ? (
          <div className="text-center py-12 bg-slate-950 rounded-xl border border-slate-800 text-slate-400 text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <p className="font-bold text-white text-sm">لا توجد طلبات توثيق معلقة حالياً في طابور المراجعة.</p>
            <p className="text-slate-500 text-[11px]">كافة طلبات التوثيق تمت معالجتها وتسجيل نتائجها في سجل التدقيق المباشر.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {verificationQueue.map((item) => {
              const isIncomplete =
                item.dataCompletenessScore < 70 ||
                !item.phoneVerified ||
                !item.emailVerified ||
                !item.channelUrlValid;

              return (
                <div
                  key={item.id}
                  className={`bg-slate-950 p-5 rounded-2xl border transition space-y-4 ${
                    isIncomplete
                      ? 'border-amber-500/40 bg-amber-950/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Item Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-black text-white text-base">{item.publisherName}</h4>
                        {item.reviewStatus === 'APPROVED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            معتمد ✓
                          </span>
                        )}
                        {item.reviewStatus === 'REJECTED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                            مرفوض ✗
                          </span>
                        )}
                        {item.reviewStatus === 'NEEDS_INFO' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            معلق - بانتظار معلومات ⏳
                          </span>
                        )}
                        {(!item.reviewStatus || item.reviewStatus === 'PENDING') && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            قيد المراجعة 🔍
                          </span>
                        )}

                        {item.dataCompletenessScore < 70 ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1 shadow-sm">
                            <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0 animate-pulse" />
                            <span>تحذير: جودة البيانات {item.dataCompletenessScore}% (&lt; 70%)</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                            <span>مكتمل الجودة ({item.dataCompletenessScore}%)</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 font-mono">
                        معرف الناشر: {item.publisherId} • تاريخ التقديم:{' '}
                        {new Date(item.submittedAt).toLocaleDateString('ar-EG')}
                      </p>
                    </div>

                    <div
                      className={`flex items-center gap-3 px-3.5 py-2 rounded-xl border transition ${
                        item.dataCompletenessScore >= 70
                          ? 'bg-slate-900 border-emerald-500/30'
                          : 'bg-amber-950/30 border-amber-500/50 shadow-lg shadow-amber-950/20'
                      }`}
                    >
                      {item.dataCompletenessScore >= 70 ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse shrink-0" />
                      )}
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                          <span>درجة اكتمال البيانات</span>
                          {item.dataCompletenessScore < 70 && (
                            <span className="text-[9px] text-amber-400 font-black font-mono">(دون 70%)</span>
                          )}
                        </div>
                        <div
                          className={`text-sm font-black font-mono ${
                            item.dataCompletenessScore >= 80
                              ? 'text-emerald-400'
                              : item.dataCompletenessScore >= 70
                              ? 'text-emerald-300'
                              : item.dataCompletenessScore >= 50
                              ? 'text-amber-400'
                              : 'text-rose-400'
                          }`}
                        >
                          {item.dataCompletenessScore}%
                        </div>
                      </div>
                      <div className="w-12 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full ${
                            item.dataCompletenessScore >= 70
                              ? 'bg-emerald-500'
                              : item.dataCompletenessScore >= 50
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${item.dataCompletenessScore}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Indicators Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                    <div
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        item.dataCompletenessScore >= 70
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                          : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                      }`}
                    >
                      <span className="font-bold">نصاب الجودة (&ge;70%):</span>
                      <span className="font-bold flex items-center gap-1">
                        {item.dataCompletenessScore >= 70 ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>مستوفى ({item.dataCompletenessScore}%)</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span>دون النصاب ({item.dataCompletenessScore}%)</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        item.phoneVerified
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                      }`}
                    >
                      <span className="font-bold">تأكيد رقم الهاتف:</span>
                      <span>{item.phoneVerified ? 'مفعل ✓' : 'غير مؤكد ✗'}</span>
                    </div>

                    <div
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        item.emailVerified
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                      }`}
                    >
                      <span className="font-bold">البريد الإلكتروني:</span>
                      <span>{item.emailVerified ? 'مؤكد ✓' : 'غير مؤكد ✗'}</span>
                    </div>

                    <div
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        item.channelUrlValid
                          ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
                          : 'bg-rose-950/20 border-rose-500/30 text-rose-300'
                      }`}
                    >
                      <span className="font-bold">صحة رابط القناة:</span>
                      <span>{item.channelUrlValid ? 'سليم وحقيقي ✓' : 'غير صالح ✗'}</span>
                    </div>
                  </div>

                  {isIncomplete && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                      <span>
                        <strong>بوابة الأمان الحوكمية:</strong> درجة اكتمال البيانات أقل من النصاب التلقائي (70%). اعتماد هذا الطلب يتطلب تدوين مبرر استثناء حوكمي وسيتم تصنيفه تلقائياً كإجراء حساس بالمرصد.
                      </span>
                    </div>
                  )}

                  {item.reviewerNotes && (
                    <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs space-y-1">
                      <span className="font-bold text-indigo-300 text-[11px]">ملاحظات المراجع المسجلة:</span>
                      <p className="text-slate-300 font-medium">{item.reviewerNotes}</p>
                    </div>
                  )}

                  {/* Action Controls */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-900">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveVerificationItem(item);
                        setVerificationModalType('REJECT');
                        setVerificationNoteInput('');
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>رفض الطلب</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveVerificationItem(item);
                        setVerificationModalType('NEEDS_INFO');
                        setVerificationNoteInput(item.reviewerNotes || '');
                      }}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>طلب استكمال بيانات (NEEDS_INFO)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveVerificationItem(item);
                        if (isIncomplete) {
                          setVerificationModalType('APPROVE_EXCEPTION');
                          setVerificationNoteInput('');
                        } else {
                          setVerificationModalType('APPROVE_STANDARD');
                          setVerificationNoteInput('تم التدقيق الميداني والاعتماد القياسي لبيانات الناشر وترقية شارة التوثيق.');
                        }
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition shadow-md flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        {isIncomplete ? 'اعتماد استثنائي (تجاوز)' : 'اعتماد التوثيق وترقية الشارة'}
                      </span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Modal */}
        {verificationModalType && activeVerificationItem && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h4 className="font-bold text-white text-base flex items-center gap-2">
                  {verificationModalType === 'APPROVE_STANDARD' && (
                    <>
                      <ShieldCheck className="w-5 h-5 text-emerald-400" />
                      <span>تأكيد اعتماد التوثيق القياسي - ({activeVerificationItem.publisherName})</span>
                    </>
                  )}
                  {verificationModalType === 'APPROVE_EXCEPTION' && (
                    <>
                      <ShieldAlert className="w-5 h-5 text-amber-400" />
                      <span>اعتماد استثنائي - الناشر ({activeVerificationItem.publisherName})</span>
                    </>
                  )}
                  {verificationModalType === 'REJECT' && (
                    <>
                      <XCircle className="w-5 h-5 text-rose-400" />
                      <span>رفض طلب التوثيق - ({activeVerificationItem.publisherName})</span>
                    </>
                  )}
                  {verificationModalType === 'NEEDS_INFO' && (
                    <>
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      <span>طلب بيانات إضافية - ({activeVerificationItem.publisherName})</span>
                    </>
                  )}
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setVerificationModalType(null);
                    setActiveVerificationItem(null);
                  }}
                  className="text-slate-400 hover:text-white text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 block">
                  {verificationModalType === 'APPROVE_STANDARD' && 'تأكيد الإجراء القياسي: سيتم منح شارة التوثيق وترقية القناة. يمكنك تدوين ملاحظات إدارية برمجية:'}
                  {verificationModalType === 'APPROVE_EXCEPTION' && 'يرجى تدوين مبرر الاستثناء الإداري لتجاوز اكتمال البيانات (إجباري):'}
                  {verificationModalType === 'REJECT' && 'يرجى تدوين السبب الحوكمي الدقيق لرفض الطلب (إجباري):'}
                  {verificationModalType === 'NEEDS_INFO' && 'تحديد النواقص والمستندات المطلوبة من الناشر (إجباري):'}
                </label>

                <textarea
                  rows={4}
                  value={verificationNoteInput}
                  onChange={(e) => setVerificationNoteInput(e.target.value)}
                  placeholder="اكتب الملاحظات التفصيلية هنا ليتم تسجيلها بسجل التدقيق والحوكمة المباشر..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                {verificationModalType !== 'APPROVE_STANDARD' && !verificationNoteInput.trim() && (
                  <p className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>تنبيه حوكمي: يلزم كتابة المبرر أو الملاحظات قبل تفعيل زر تأكيد الإجراء بسجل التدقيق.</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setVerificationModalType(null);
                    setActiveVerificationItem(null);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  إلغاء
                </button>

                <button
                  type="button"
                  disabled={verificationModalType !== 'APPROVE_STANDARD' && !verificationNoteInput.trim()}
                  onClick={() => {
                    if (verificationModalType !== 'APPROVE_STANDARD' && !verificationNoteInput.trim()) return;
                    if (verificationModalType === 'APPROVE_STANDARD' || verificationModalType === 'APPROVE_EXCEPTION') {
                      onApproveVerification(activeVerificationItem, verificationNoteInput.trim() || undefined);
                    } else if (verificationModalType === 'REJECT') {
                      onRejectVerification(activeVerificationItem, verificationNoteInput);
                    } else if (verificationModalType === 'NEEDS_INFO') {
                      onRequestInfoVerification(activeVerificationItem, verificationNoteInput);
                    }
                    setVerificationModalType(null);
                    setActiveVerificationItem(null);
                  }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    verificationModalType !== 'APPROVE_STANDARD' && !verificationNoteInput.trim()
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-50'
                      : verificationModalType === 'REJECT'
                      ? 'bg-rose-600 hover:bg-rose-500 text-white'
                      : verificationModalType === 'NEEDS_INFO'
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                  }`}
                >
                  تأكيد الإجراء وتسجيل الحدث بسجل الحوكمة
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Currently Registered Publishers Status List (Relocated to Governance Verification Area) */}
      {publishers && publishers.length > 0 && (
        <div id="publisher-active-channels" className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'ar' ? 'سجل حالات القنوات المسجلة في النظام (دورة الحياة والحوكمة)' : 'Registered Publishers Lifecycle Records'}</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800 font-bold">
              {publishers.length} {lang === 'ar' ? 'قناة' : 'Channels'}
            </span>
          </div>

          <div className="divide-y divide-slate-800">
            {publishers.map((p) => (
              <div key={p.id} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold text-white flex items-center gap-1.5 flex-wrap">
                      <span>{p.name}</span>
                      <span className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 font-mono">
                        {p.verificationLevel}
                      </span>
                    </h4>
                    <p className="text-[11px] text-slate-400">{p.platform} • {p.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-slate-950 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px]">
                    {p.lifecycleStage}
                  </span>
                  <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                    p.status === 'VERIFIED'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : p.status === 'DORMANT_CHANNEL'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800/80'
                      : 'bg-slate-950 text-slate-300 border border-slate-800'
                  }`}>
                    {p.status === 'DORMANT_CHANNEL' ? 'خاملة (توقف 45+ يوم)' : p.status}
                  </span>
                </div>
                {p.status === 'DORMANT_CHANNEL' && (
                  <div className="w-full mt-1 p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-[11px] text-amber-300">
                    ⚠️ <strong>تنبيه الخمول الحوكمي:</strong> القناة متوقفة مؤقتاً لعدم النشر لمدة تتجاوز 45 يوماً. سيتم إعادة التنشيط والإدراج التلقائي في شاشات الداعمين فور رصد نشر محتوى جديد.
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

VerificationQueueTab.displayName = 'VerificationQueueTab';

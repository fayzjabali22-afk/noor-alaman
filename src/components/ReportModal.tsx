import React, { useState } from 'react';
import { Publisher, Language } from '../types';
import { translations } from '../lib/i18n';
import { ShieldAlert, X, AlertTriangle, Send, CheckCircle2 } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  publisher: Publisher | null;
  lang: Language;
  onSubmitReport: (publisherId: string, publisherName: string, reason: string, evidence: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  publisher,
  lang,
  onSubmitReport,
}) => {
  const isAr = lang === 'ar';
  const t = translations[lang];

  const [selectedReason, setSelectedReason] = useState<string>('LINK_BROKEN');
  const [evidenceDetails, setEvidenceDetails] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !publisher) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitReport(publisher.id, publisher.name, selectedReason, evidenceDetails);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 1800);
  };

  const reportReasons = [
    {
      id: 'LINK_BROKEN',
      labelAr: 'الرابط المباشر معطل أو غير يعمل',
      labelEn: 'Direct channel link is broken or inactive',
    },
    {
      id: 'MISLEADING_INFO',
      labelAr: 'وصف القناة أو الموقع الميداني غير دقيق',
      labelEn: 'Channel description or location is inaccurate',
    },
    {
      id: 'UNAUTHORIZED_SOLICITATION',
      labelAr: 'محاولة جمع تبرعات خارج القنوات الرسمية المعيارية',
      labelEn: 'Soliciting funds outside standard verified channels',
    },
    {
      id: 'IMPERSONATION',
      labelAr: 'انتحال شخصية أو تكرار قناة لصحفي آخر',
      labelEn: 'Impersonation or duplicate channel submission',
    },
    {
      id: 'GOVERNANCE_VIOLATION',
      labelAr: 'مخالفة معايير الحوكمة والكرامة الإنسانية',
      labelEn: 'Violation of humanitarian dignity & governance rules',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {isAr ? 'تقديم بلاغ حوكمي (العلم الأحمر)' : 'Submit Governance Report (Red Flag)'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? 'نظام حماية نزاهة دليل القنوات الإنسانية' : 'Protecting reference channel directory integrity'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-sm font-bold text-white">
              {isAr ? 'تم تسجيل البلاغ بنجاح' : 'Report Filed Successfully'}
            </h4>
            <p className="text-xs text-slate-400">
              {isAr
                ? 'سيقوم فريق التحقق والمراجعة برفع البلاغ إلى لجنة الحوكمة للتحقق الميداني.'
                : 'Verification team will inspect this channel in accordance with NA-ADR standards.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Publisher details */}
            <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 flex items-center gap-3">
              <img
                src={publisher.avatar}
                alt={publisher.name}
                className="w-10 h-10 rounded-xl object-cover border border-slate-700"
              />
              <div className="text-xs">
                <div className="font-bold text-white">{publisher.name}</div>
                <div className="text-slate-400 font-mono text-[11px]">
                  {publisher.platform} • {publisher.location}
                </div>
              </div>
            </div>

            {/* Select Reason */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'سبب البلاغ الإنساني:' : 'Reason for Report:'}</span>
              </label>

              <div className="space-y-1.5">
                {reportReasons.map((r) => (
                  <label
                    key={r.id}
                    className={`flex items-start gap-2.5 p-3 rounded-xl border text-xs cursor-pointer transition ${
                      selectedReason === r.id
                        ? 'bg-rose-950/40 border-rose-500/50 text-white font-medium'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r.id}
                      checked={selectedReason === r.id}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="mt-0.5 text-rose-500 focus:ring-rose-500"
                    />
                    <span>{isAr ? r.labelAr : r.labelEn}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Evidence Text area */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isAr ? 'تفاصيل وإثباتات إضافية (اختياري):' : 'Additional Evidence Details (Optional):'}
              </label>
              <textarea
                value={evidenceDetails}
                onChange={(e) => setEvidenceDetails(e.target.value)}
                placeholder={
                  isAr
                    ? 'اكتب أي ملاحظات تساعد التدقيق مثل الرابط المباشر البديل أو تاريخ انقطاع البث...'
                    : 'Provide helpful context for auditors...'
                }
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-rose-600 to-red-700 hover:from-rose-500 hover:to-red-600 text-white text-xs font-bold py-2.5 rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isAr ? 'إرسال البلاغ فوراً' : 'Submit Report'}</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium px-4 py-2.5 rounded-xl transition"
              >
                {t.cancel}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

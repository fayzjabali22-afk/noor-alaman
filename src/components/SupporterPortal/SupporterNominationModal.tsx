import React, { useState } from 'react';
import { UserPlus, X, Link2, User, Send, CheckCircle2, ShieldAlert } from 'lucide-react';
import { supervisorLinksService } from '../../services/supervisorLinksService';

interface SupporterNominationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAr: boolean;
  currentSupporterId: string;
  currentSupporterName: string;
  onSubmitted?: () => void;
}

export const SupporterNominationModal: React.FC<SupporterNominationModalProps> = ({
  isOpen,
  onClose,
  isAr,
  currentSupporterId,
  currentSupporterName,
  onSubmitted,
}) => {
  const [nomineeName, setNomineeName] = useState('');
  const [nomineeUrl, setNomineeUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomineeName.trim() || !nomineeUrl.trim()) {
      setError(isAr ? 'يرجى ملء الحقول الإجبارية (الاسم والرابط)' : 'Please fill required fields');
      return;
    }

    // Security protocol check
    if (!nomineeUrl.toLowerCase().startsWith('https://')) {
      setError(isAr ? 'يجب أن يبدأ الرابط ببروتوكول الأمان HTTPS://' : 'URL must start with HTTPS://');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await supervisorLinksService.submitNomination({
        supporterId: currentSupporterId,
        supporterName: currentSupporterName,
        nomineeName: nomineeName.trim(),
        targetUrl: nomineeUrl.trim(),
        notes: notes.trim(),
      });

      setSubmitted(true);
      if (onSubmitted) onSubmitted();

      setTimeout(() => {
        setSubmitted(false);
        setNomineeName('');
        setNomineeUrl('');
        setNotes('');
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
      setError(isAr ? 'حدث خطأ أثناء الإرسال، يرجى المحاولة لاحقاً' : 'Submission failed, try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg bg-slate-900 border border-amber-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden space-y-6">
        {/* Background ambient glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-inner">
              <UserPlus className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">
                {isAr ? 'ترشيح داعم جديد لمنصة نور الأماني' : 'Nominate New Supporter'}
              </h3>
              <p className="text-xs text-slate-400">
                {isAr ? 'وسّع شبكة الكفلاء وساهم في نصرة الحقيقة' : 'Expand the supporter network'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3 relative z-10">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="text-white font-bold text-base">
              {isAr ? 'تم إرسال الترشيح بنجاح للمراجعة السيادية' : 'Nomination submitted successfully'}
            </h4>
            <p className="text-xs text-slate-400">
              {isAr ? 'شكراً لتعاونك في توسيع مظلة الدعم الإنساني وتدقيق الترشيحات.' : 'Thank you for helping expand field support.'}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {error && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Nominee Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'اسم الداعم أو المؤسسة المرشحة *' : 'Nominee Name / Organization *'}</span>
              </label>
              <input
                type="text"
                value={nomineeName}
                onChange={(e) => setNomineeName(e.target.value)}
                placeholder={isAr ? 'أدخل اسم الشخص أو الجهة' : 'Enter name or organization'}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-white text-xs outline-none transition"
                required
              />
            </div>

            {/* Nominee URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Link2 className="w-3.5 h-3.5 text-amber-400" />
                <span>{isAr ? 'رابط الموقع أو المنصة (HTTPS) *' : 'Platform URL (HTTPS) *'}</span>
              </label>
              <input
                type="url"
                value={nomineeUrl}
                onChange={(e) => setNomineeUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-4 py-3 text-white text-xs outline-none transition font-mono"
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">
                {isAr ? 'ملاحظات إضافية أو الدور الإنساني (اختياري)' : 'Notes / Humanitarian Role (Optional)'}
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={isAr ? 'اكتب نبذة مختصرة عن دور المرشح...' : 'Write brief notes...'}
                rows={3}
                className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl p-3 text-white text-xs outline-none transition resize-none"
              />
            </div>

            {/* Sovereign Guidance Note */}
            <p className="text-[11px] text-amber-300/80 italic text-center pt-1">
              {isAr
                ? 'تخضع كافة الترشيحات للفحص المزدوج (الأمني والتكراري) من قِبل المشرف المعتمد.'
                : 'All nominations undergo dual security & duplication audit by approved supervisors.'}
            </p>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>
                  {loading
                    ? isAr
                      ? 'جاري الإرسال...'
                      : 'Submitting...'
                    : isAr
                    ? 'إرسال الترشيح للمراجعة'
                    : 'Submit Nomination'}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  ShieldCheck,
  Send,
  MessageSquare,
  Lock,
  Zap,
  Info,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  Volume2,
  Calendar,
  Lightbulb,
  Link,
  Bell,
  Clock,
  UserCheck,
} from 'lucide-react';
import {
  OneWayGuidanceNote,
  AVAILABLE_PUBLISHER_CHANNELS,
  PublisherChannelOption,
} from '../services/jasmineService';

export interface JasmineOneWayGuidanceModalProps {
  celebrityName?: string;
  celebrityId?: string;
  onClose: () => void;
  guidanceNotes: OneWayGuidanceNote[];
  onAddGuidanceNote: (newNote: OneWayGuidanceNote) => void;
  lang?: 'ar' | 'en';
}

export const JasmineOneWayGuidanceModal: React.FC<JasmineOneWayGuidanceModalProps> = ({
  celebrityName = 'أ. أحمد الشقيري',
  celebrityId = 'jas-01',
  onClose,
  guidanceNotes,
  onAddGuidanceNote,
  lang = 'ar',
}) => {
  const isAr = lang === 'ar';

  // Form State
  const [targetChannelId, setTargetChannelId] = useState<string>(AVAILABLE_PUBLISHER_CHANNELS[0].id);
  const [category, setCategory] = useState<
    'TECHNICAL_FEEDBACK' | 'PROMOTION_SCHEDULE' | 'GENERAL_RECOMMENDATION' | 'EXTERNAL_LINK_REQUEST'
  >('PROMOTION_SCHEDULE');
  const [content, setContent] = useState<string>('');
  const [externalContactRequested, setExternalContactRequested] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const selectedChannelObj = AVAILABLE_PUBLISHER_CHANNELS.find((ch) => ch.id === targetChannelId) || AVAILABLE_PUBLISHER_CHANNELS[0];

  // Quick Presets
  const applyPreset = (presetText: string) => {
    setContent(presetText);
    setFormError(null);
  };

  const handleSendGuidance = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!content.trim()) {
      setFormError(isAr ? 'يرجى نص الملاحظة أو التوصية قبل الإرسال.' : 'Please enter note content before sending.');
      return;
    }

    const newNote: OneWayGuidanceNote = {
      id: `note-${Date.now()}`,
      celebrityId,
      celebrityName,
      targetChannelId: selectedChannelObj.id,
      targetChannelName: selectedChannelObj.name,
      category,
      content: content.trim(),
      externalContactRequested: category === 'EXTERNAL_LINK_REQUEST' ? true : externalContactRequested,
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'DELIVERED',
    };

    onAddGuidanceNote(newNote);

    setSuccessMsg(
      isAr
        ? 'تم إرسال الملاحظة الموجهة بنجاح عبر نظام الإشعارات أحادي الاتجاه.'
        : 'Guidance note sent successfully via one-way notification system.'
    );
    setContent('');
    setExternalContactRequested(false);

    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const getCategoryBadge = (cat: OneWayGuidanceNote['category']) => {
    switch (cat) {
      case 'PROMOTION_SCHEDULE':
        return {
          label: isAr ? 'جدول النشر والتوجيه' : 'Promotion Schedule',
          color: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
          icon: <Calendar className="w-3.5 h-3.5 text-blue-400" />,
        };
      case 'TECHNICAL_FEEDBACK':
        return {
          label: isAr ? 'ملاحظة وتعديل فني' : 'Technical Feedback',
          color: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
          icon: <Volume2 className="w-3.5 h-3.5 text-amber-400" />,
        };
      case 'GENERAL_RECOMMENDATION':
        return {
          label: isAr ? 'توصية وإرشاد عام' : 'General Guidance',
          color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
          icon: <Lightbulb className="w-3.5 h-3.5 text-emerald-400" />,
        };
      case 'EXTERNAL_LINK_REQUEST':
        return {
          label: isAr ? 'طلب تواصل خارجي' : 'External Contact Request',
          color: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
          icon: <Link className="w-3.5 h-3.5 text-purple-400" />,
        };
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative text-slate-100 my-8">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>{isAr ? 'نظام التواصل الهجين أحادي الاتجاه' : 'One-Way Direct Guidance Hybrid System'}</span>
            </div>
            <h3 className="text-lg md:text-xl font-bold text-white flex items-center gap-2">
              <span>{isAr ? 'إرسال الملاحظات والإرشادات الموجهة' : 'Send One-Way Direct Guidance'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {isAr
                ? 'إرسال التوصيات المباشرة للقنوات المتبناة دون إغراق الحساب بالرسائل أو فتح محادثات خاصة'
                : 'Direct one-way guidance notes to adopted channels without exposing your private inbox.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Celebrity Privacy Shield Banner */}
        <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-amber-300">
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'درع خصوصية المشهور (Celebrity Privacy Shield)' : 'Celebrity Privacy Shield Active'}</span>
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              {isAr ? 'تواصل أحادي آمن' : '100% One-Way Safe'}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {isAr
              ? 'حماية كاملة من الرسائل العشوائية والخاصة (DMs). تصل توجيهاتك مباشرة كإشعارات لوحة التحكم الخاصة بالناشر، مع إمكانية اختيارية لطلب رابط تواصل خارجي (تليجرام / واتساب / بريد) بمحض إرادتك.'
              : 'Zero spam or private DMs. Your notes arrive as direct system notifications in the publisher panel.'}
          </p>
        </div>

        {/* Compose Form */}
        <form onSubmit={handleSendGuidance} className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <h4 className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'صياغة ملاحظة جديدة' : 'Compose Guidance Note'}</span>
          </h4>

          {/* Target Channel Selector */}
          <div>
            <label className="block text-[11px] text-slate-300 mb-1 font-medium">
              {isAr ? 'اختر القناة المتبناة المستهدفة:' : 'Select Target Publisher Channel:'}
            </label>
            <select
              value={targetChannelId}
              onChange={(e) => setTargetChannelId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              {AVAILABLE_PUBLISHER_CHANNELS.map((ch) => (
                <option key={ch.id} value={ch.id}>
                  {ch.name} — ({ch.location} | {ch.category})
                </option>
              ))}
            </select>
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-[11px] text-slate-300 mb-1 font-medium">
              {isAr ? 'تصنيف الملاحظة / التوجيه:' : 'Guidance Category:'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setCategory('PROMOTION_SCHEDULE')}
                className={`p-2.5 rounded-lg border text-right transition flex flex-col justify-between ${
                  category === 'PROMOTION_SCHEDULE'
                    ? 'bg-blue-500/20 border-blue-500 text-blue-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-blue-400 mb-1" />
                <span className="text-[11px] font-bold">{isAr ? 'جدول النشر' : 'Promotion'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('TECHNICAL_FEEDBACK')}
                className={`p-2.5 rounded-lg border text-right transition flex flex-col justify-between ${
                  category === 'TECHNICAL_FEEDBACK'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-400 mb-1" />
                <span className="text-[11px] font-bold">{isAr ? 'تعديل فني' : 'Technical'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('GENERAL_RECOMMENDATION')}
                className={`p-2.5 rounded-lg border text-right transition flex flex-col justify-between ${
                  category === 'GENERAL_RECOMMENDATION'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5 text-emerald-400 mb-1" />
                <span className="text-[11px] font-bold">{isAr ? 'إرشاد عام' : 'Mentorship'}</span>
              </button>

              <button
                type="button"
                onClick={() => setCategory('EXTERNAL_LINK_REQUEST')}
                className={`p-2.5 rounded-lg border text-right transition flex flex-col justify-between ${
                  category === 'EXTERNAL_LINK_REQUEST'
                    ? 'bg-purple-500/20 border-purple-500 text-purple-200'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Link className="w-3.5 h-3.5 text-purple-400 mb-1" />
                <span className="text-[11px] font-bold">{isAr ? 'طلب تواصل' : 'Contact Req'}</span>
              </button>
            </div>
          </div>

          {/* Quick Presets Buttons */}
          <div>
            <label className="block text-[10px] text-slate-400 mb-1">
              {isAr ? 'نماذج جاهزة للاستخدام المباشر:' : 'Quick Presets:'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => applyPreset(isAr ? 'سأقوم بنشر رابط قناتكم اليوم الساعة 8 مساءً عبر منصاتي الرسمية.' : 'I will share your channel link today at 8 PM.')}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-md text-[10px] text-slate-300 transition"
              >
                {isAr ? '📅 نشر الرابط الساعة 8' : '📅 Share link 8 PM'}
              </button>
              <button
                type="button"
                onClick={() => applyPreset(isAr ? 'يرجى تحسين وضوح تسجيل الصوت في المقطع التوثيقي الأخير.' : 'Please improve audio clarity in your last video.')}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-md text-[10px] text-slate-300 transition"
              >
                {isAr ? '🎙️ تحسين وضوح الصوت' : '🎙️ Audio Improvement'}
              </button>
              <button
                type="button"
                onClick={() => applyPreset(isAr ? 'نوصي بتركيز التغطية الميدانية القادمة على مراكز الإيواء والمستشفيات.' : 'We recommend focusing next footage on shelters and hospitals.')}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-md text-[10px] text-slate-300 transition"
              >
                {isAr ? '💡 تركيز التغطية' : '💡 Field Recommendation'}
              </button>
            </div>
          </div>

          {/* Content Textarea */}
          <div>
            <label className="block text-[11px] text-slate-300 mb-1 font-medium">
              {isAr ? 'نص الملاحظة أو التوصية *' : 'Guidance Content *'}
            </label>
            <textarea
              rows={3}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setFormError(null);
              }}
              placeholder={isAr ? 'اكتب ملاحظتك التوجيهية للناشر الميداني...' : 'Write your direct note...'}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500 resize-none"
            />
          </div>

          {/* Optional External Contact Request Toggle */}
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
            <div className="flex items-center gap-2">
              <Link className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="text-xs font-bold text-slate-200 block">
                  {isAr ? 'تفعيل خيار التواصل الخارجي الاختياري' : 'Request External Contact Link (Optional)'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {isAr
                    ? 'طلب تزويدك برابط تواصل خارجي (تليجرام / واتساب / بريد) بملء إرادتك'
                    : 'Ask the publisher to share their official Telegram/WhatsApp/Email link'}
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={externalContactRequested}
              onChange={(e) => setExternalContactRequested(e.target.checked)}
              className="rounded border-slate-700 text-purple-500 focus:ring-purple-500 bg-slate-950 w-4 h-4"
            />
          </label>

          {/* Error & Success Messages */}
          {formError && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold transition shadow-lg flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isAr ? 'إرسال الملاحظة الموجهة' : 'Dispatch Direct Guidance'}</span>
            </button>
          </div>
        </form>

        {/* Guidance Log Feed */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'سجل الملاحظات والإرشادات الصادرة' : 'Sent Guidance Notes Log'}</span>
            </span>
            <span className="text-[10px] text-slate-400 font-normal">
              ({guidanceNotes.length} {isAr ? 'ملاحظة' : 'notes'})
            </span>
          </h4>

          <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
            {guidanceNotes.map((note) => {
              const badge = getCategoryBadge(note.category);

              return (
                <div
                  key={note.id}
                  className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 text-xs hover:border-slate-700 transition"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${badge.color}`}>
                        {badge.icon}
                        <span>{badge.label}</span>
                      </span>
                      <span className="font-semibold text-slate-200">إلى: {note.targetChannelName}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500 font-mono">
                      <Clock className="w-3 h-3" />
                      <span>{note.createdAt}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">
                        {note.status}
                      </span>
                    </div>
                  </div>

                  <p className="text-slate-300 text-xs leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/80">
                    "{note.content}"
                  </p>

                  {note.externalContactRequested && (
                    <div className="text-[11px] text-purple-300 bg-purple-500/10 p-2 rounded-lg border border-purple-500/20 flex items-center gap-1.5">
                      <Link className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                      <span>
                        {isAr
                          ? 'طلب تواصل خارجي اختياري مرفق (تليجرام / واتساب / بريد)'
                          : 'Optional external contact request attached'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Zero-Cost Notice */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'سجل محلي ذكي متصل بالإشعارات بكلفة صفرية' : 'Zero-cost local guidance ledger'}</span>
          </span>
          <span>{isAr ? 'دستور منصة نور الأماني' : 'Noor Al-Amani Platform'}</span>
        </div>
      </div>
    </div>
  );
};

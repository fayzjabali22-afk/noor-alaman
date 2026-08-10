import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import {
  X,
  BookOpen,
  Share2,
  Check,
  Quote,
  Sparkles,
  UserCheck,
  Feather,
  Clock,
  Bookmark,
  List,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  FileText,
  Award,
} from 'lucide-react';

interface BlogArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  isReadingMode?: boolean;
  onToggleReadingMode?: (active: boolean) => void;
}

export const BlogArticleModal: React.FC<BlogArticleModalProps> = ({
  isOpen,
  onClose,
  lang,
  isReadingMode = false,
  onToggleReadingMode,
}) => {
  const isAr = lang === 'ar';
  const [copied, setCopied] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'lg' | 'xl'>('normal');
  const [activeSection, setActiveSection] = useState<string>('sec-abstract');

  const handleCopyLink = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Error in Noor Al-Amani Module:", err);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!isOpen) return null;

  const fontClasses = {
    normal: 'text-sm sm:text-base leading-relaxed',
    lg: 'text-base sm:text-lg leading-relaxed',
    xl: 'text-lg sm:text-xl leading-loose',
  };

  const sectionsList = [
    { id: 'sec-title', titleAr: 'عنوان المقال والمؤلف', titleEn: 'Title & Author' },
    { id: 'sec-intro', titleAr: 'مقدمة: دور التقنية وإنسانيتها', titleEn: 'Intro: Tech & Humanity' },
    { id: 'sec-1', titleAr: 'أولًا: إعادة الإنسان إلى مركز التقنية', titleEn: '1. Human at the Center' },
    { id: 'sec-2', titleAr: 'ثانيًا: تحويل الاتصال إلى علاقة إنسانية', titleEn: '2. Connection to Human Rel.' },
    { id: 'sec-3', titleAr: 'ثالثًا: تحويل الانتباه إلى مسؤولية', titleEn: '3. Attention as Responsibility' },
    { id: 'sec-4', titleAr: 'رابعًا: بناء ثقافة المشاركة اليومية', titleEn: '4. Daily Participation Culture' },
    { id: 'sec-5', titleAr: 'خامسًا: التقنية كجسر بين المجتمعات', titleEn: '5. Tech as Bridge' },
    { id: 'sec-6', titleAr: 'سادسًا: من المنافسة إلى التكامل', titleEn: '6. Competition to Integration' },
    { id: 'sec-7', titleAr: 'سابعًا: الإنسان والكوكب... مسؤولية مشتركة', titleEn: '7. Human & Planet' },
    { id: 'sec-8', titleAr: 'ثامنًا: حضارة يقودها الأثر والميثاق الحضاري', titleEn: '8. Impact Civil. & Covenant' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-5xl max-h-[92vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col z-10 my-auto"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-950/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[11px] font-bold text-emerald-400 tracking-wider uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isAr ? 'القارئ الرقمي للمدونة الفكرية' : 'Digital Reader for Intellectual Blog'}
                </span>
                <h3 className="text-sm sm:text-base font-black text-white truncate max-w-xs sm:max-w-md">
                  {isAr ? 'اقتصاد الانتباه... والانتماء الإنساني' : 'Attention Economy... & Human Belonging'}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Reading Mode Button */}
              {onToggleReadingMode && (
                <button
                  onClick={() => onToggleReadingMode(!isReadingMode)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                    isReadingMode
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/60 hover:text-white'
                  }`}
                  title={isAr ? 'تفعيل وضع القراءة المريح للعين' : 'Comfortable Reading Mode'}
                >
                  <BookOpen className={`w-3.5 h-3.5 ${isReadingMode ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="hidden sm:inline">{isReadingMode ? (isAr ? 'وضع القراءة' : 'Reading') : (isAr ? 'قراءة هادئة' : 'Calm Read')}</span>
                </button>
              )}

              {/* Font Size Selector */}
              <div className="hidden sm:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-0.5 text-xs font-bold rounded-lg transition ${
                    fontSize === 'normal'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={isAr ? 'خط عادي' : 'Normal Font'}
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('lg')}
                  className={`px-2 py-0.5 text-xs font-bold rounded-lg transition ${
                    fontSize === 'lg'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={isAr ? 'خط كبير' : 'Large Font'}
                >
                  A+
                </button>
                <button
                  onClick={() => setFontSize('xl')}
                  className={`px-2 py-0.5 text-xs font-bold rounded-lg transition ${
                    fontSize === 'xl'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  title={isAr ? 'خط ضخم' : 'Extra Large Font'}
                >
                  A++
                </button>
              </div>

              {/* Share Button */}
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">{isAr ? 'تم النسخ' : 'Copied'}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-slate-300" />
                    <span>{isAr ? 'مشاركة' : 'Share'}</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Dropdown Options List Navigation (منسدلة قائمة خيارات لتصفح العناوين) */}
          <div className="bg-slate-950/95 border-b border-slate-800/80 p-3 px-4 sm:px-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0 backdrop-blur-md">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <List className="w-4 h-4 text-emerald-400" />
              </div>
              
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 max-w-xl">
                <label htmlFor="blog-section-select" className="text-xs font-bold text-emerald-400 whitespace-nowrap shrink-0">
                  {isAr ? 'اختر العنوان للتنقل المباشر:' : 'Jump to Section:'}
                </label>
                
                {/* Select Dropdown (منسدلة قائمة خيارات) */}
                <div className="relative flex-1">
                  <select
                    id="blog-section-select"
                    value={activeSection}
                    onChange={(e) => scrollToSection(e.target.value)}
                    className="w-full bg-slate-900 text-emerald-300 font-bold text-xs sm:text-sm py-2 px-3.5 pe-9 rounded-xl border border-emerald-500/40 hover:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none cursor-pointer transition shadow-inner"
                  >
                    {sectionsList.map((sec) => (
                      <option key={sec.id} value={sec.id} className="bg-slate-900 text-slate-100 py-1.5 font-medium">
                        {isAr ? sec.titleAr : sec.titleEn}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-emerald-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-medium shrink-0 self-end sm:self-center">
              <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{isAr ? 'المقال كامل متاح للقرائية المباشرة' : 'Full Article Visible'}</span>
              <span className="inline sm:hidden">{isAr ? 'المقال كامل بالأسفل' : 'Full Article Below'}</span>
            </div>
          </div>

          {/* Main Layout: Sidebar Navigation + Article Content */}
          <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
            {/* Desktop Table of Contents Sidebar */}
            <aside className="hidden lg:block w-80 bg-slate-950/90 border-l border-slate-800/80 p-5 overflow-y-auto space-y-4 shrink-0">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 border-b border-slate-800/80 pb-3">
                <List className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'فهرس عناوين محتوى المدونة' : 'Table of Contents'}</span>
              </div>

              <nav className="space-y-1.5">
                {sectionsList.map((sec) => {
                  const isActive = activeSection === sec.id;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => scrollToSection(sec.id)}
                      className={`w-full text-right flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-xs transition duration-200 ${
                        isActive
                          ? 'bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 shadow-sm'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                      }`}
                    >
                      <span className="truncate">{isAr ? sec.titleAr : sec.titleEn}</span>
                      {isActive && <ChevronLeft className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
                    </button>
                  );
                })}
              </nav>

              {/* Author Badge in Sidebar */}
              <div className="pt-4 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 space-y-1">
                  <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                    <Feather className="w-3.5 h-3.5" />
                    <span>{isAr ? 'المؤلف:' : 'Author:'}</span>
                  </div>
                  <div className="text-white font-semibold">فايز الجبالي</div>
                  <div className="text-[11px] text-slate-400">{isAr ? 'كاتب وباحث فكري' : 'Writer & Researcher'}</div>
                </div>
              </div>
            </aside>

            {/* Complete Article Body Scroll */}
            <main className="flex-1 p-5 sm:p-8 md:p-10 overflow-y-auto space-y-8 text-slate-200 scroll-smooth">
              {/* Title Section (sec-title) */}
              <div id="sec-title" className="space-y-4 border-b border-slate-800 pb-8">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{isAr ? 'مدونة فكرية وحضارية' : 'Intellectual & Civilizational Blog'}</span>
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-700">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>{isAr ? 'حقوق النشر محفوظة' : 'All Rights Reserved'}</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                  كيف يمكن للتقنية أن تستعيد دورها الإنساني؟
                </h1>

                <p className="text-lg sm:text-xl font-bold text-emerald-300 leading-relaxed">
                  البعد الحضاري لنظرية اقتصاد الانتباه التبادلي
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-400 pt-2 font-medium flex-wrap">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold bg-emerald-950/40 px-3.5 py-1.5 rounded-xl border border-emerald-800/50">
                    <Feather className="w-4 h-4" />
                    <span>بقلم: فايز الجبالي</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isAr ? 'زمن القراءة: 5 دقائق' : 'Reading Time: 5 mins'}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-slate-500" />
                    <span>{isAr ? 'مقال مرجعي معتمد' : 'Certified Reference Article'}</span>
                  </div>
                </div>
              </div>

              {/* Main Text Content */}
              <div className={`space-y-8 text-slate-300 font-sans ${fontClasses[fontSize]}`}>
                {/* Intro Section (sec-intro) */}
                <section id="sec-intro" className="space-y-4 pt-2 border-b border-slate-800/60 pb-8">
                  <p className="leading-relaxed text-base sm:text-lg text-slate-200">
                    لم تكن التقنية في يوم من الأيام غاية بحد ذاتها، بل وسيلة ابتكرها الإنسان لتحسين حياته، وتوسيع قدراته، وتقريب المسافات بينه وبين الآخرين. لكن مع تسارع الثورة الرقمية، أصبح الاهتمام منصبًا على سرعة الاتصال، بينما تراجع الاهتمام بجودة العلاقة الإنسانية التي يفترض أن يصنعها هذا الاتصال.
                  </p>
                  <p className="leading-relaxed font-semibold text-emerald-300 bg-emerald-950/30 p-4 rounded-xl border border-emerald-800/40">
                    وتنطلق نظرية اقتصاد الانتباه التبادلي من رؤية حضارية ترى أن المرحلة القادمة لا تحتاج إلى تقنية أكثر تطورًا فحسب، بل إلى تقنية أكثر إنسانية.
                  </p>
                </section>

                {/* 1. أولًا: إعادة الإنسان إلى مركز التقنية (sec-1) */}
                <section id="sec-1" className="space-y-4 border-b border-slate-800/60 pb-8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm">
                      1
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">أولًا: إعادة الإنسان إلى مركز التقنية</h2>
                  </div>

                  <p className="leading-relaxed">
                    كل تطور تقني يفقد قيمته إذا أصبح الإنسان مجرد رقم في قاعدة بيانات أو هدفًا للخوارزميات.
                  </p>
                  <p className="leading-relaxed">
                    وترى النظرية أن الإنسان يجب أن يبقى الغاية الأساسية للتقنية، وأن يكون نجاح أي ابتكار مرتبطًا بقدرته على تحسين حياة البشر، وتعزيز كرامتهم، وتوسيع فرصهم، لا بزيادة معدلات الاستهلاك وحدها.
                  </p>
                </section>

                {/* 2. ثانيًا: تحويل الاتصال إلى علاقة إنسانية (sec-2) */}
                <section id="sec-2" className="space-y-4 border-b border-slate-800/60 pb-8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-sm">
                      2
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">ثانيًا: تحويل الاتصال إلى علاقة إنسانية</h2>
                  </div>

                  <p className="leading-relaxed">
                    لقد نجحت التقنية في ربط مليارات الأشخاص بشبكة واحدة، لكنها لم تنجح دائمًا في بناء شعور حقيقي بالمسؤولية المتبادلة.
                  </p>
                  <p className="leading-relaxed">
                    وتقترح النظرية الانتقال من مجرد الاتصال الرقمي إلى بناء علاقات إنسانية يكون فيها حضور الفرد سببًا في نفع الآخرين، بحيث يصبح التفاعل الرقمي ممارسة تحمل أثرًا اجتماعيًا وإنسانيًا، لا مجرد تبادل للمعلومات.
                  </p>
                </section>

                {/* 3. ثالثًا: تحويل الانتباه إلى مسؤولية (sec-3) */}
                <section id="sec-3" className="space-y-4 border-b border-slate-800/60 pb-8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 font-bold text-sm">
                      3
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">ثالثًا: تحويل الانتباه إلى مسؤولية</h2>
                  </div>

                  <p className="leading-relaxed">
                    في البيئة الرقمية، أصبح الانتباه موردًا اقتصاديًا بالغ القيمة.
                  </p>
                  <p className="leading-relaxed">
                    وتضيف النظرية بعدًا جديدًا لهذا المورد، يتمثل في اعتباره مسؤولية أخلاقية أيضًا. فالإنسان لا يختار فقط ما يشاهده، بل يختار كذلك الجهة التي يمنحها أثر حضوره، ويشارك بذلك في رسم مسار القيمة داخل المجتمع الرقمي.
                  </p>
                </section>

                {/* 4. رابعًا: بناء ثقافة المشاركة اليومية (sec-4) */}
                <section id="sec-4" className="space-y-4 border-b border-slate-800/60 pb-8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-sm">
                      4
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">رابعًا: بناء ثقافة المشاركة اليومية</h2>
                  </div>

                  <p className="leading-relaxed">
                    لا تبنى الحضارات بالأفكار وحدها، بل بالسلوك الذي يتحول إلى عادة.
                  </p>
                  <p className="leading-relaxed">
                    وعندما تصبح المشاركة في دعم الآخرين جزءًا من الاستخدام اليومي للتقنية، فإن التعاون الإنساني يتحول من استجابة استثنائية للأزمات إلى ثقافة مستمرة، يشارك فيها الجميع وفق قدرتهم، دون إلزام أو تمييز.
                  </p>
                </section>

                {/* 5. خامسًا: التقنية كجسر بين المجتمعات (sec-5) */}
                <section id="sec-5" className="space-y-4 border-b border-slate-800/60 pb-8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold text-sm">
                      5
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">خامسًا: التقنية كجسر بين المجتمعات</h2>
                  </div>

                  <p className="leading-relaxed">
                    التقنية قادرة على تجاوز المسافات والحدود الثقافية والجغرافية، لكنها تصبح أكثر قيمة عندما تستخدم لبناء جسور التفاهم والتعاون.
                  </p>
                  <p className="leading-relaxed">
                    وترى النظرية أن المنصات الرقمية تستطيع أن تكون مساحة يلتقي فيها البشر حول قيم العمل والإنتاج والتكافل، بما يعزز الشعور بالمسؤولية المشتركة تجاه الإنسان، أينما كان.
                  </p>
                </section>

                {/* 6. سادسًا: من المنافسة إلى التكامل (sec-6) */}
                <section id="sec-6" className="space-y-4 border-b border-slate-800/60 pb-8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 font-bold text-sm">
                      6
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">سادسًا: من المنافسة إلى التكامل</h2>
                  </div>

                  <p className="leading-relaxed">
                    الفضاء الرقمي يدفع غالبًا نحو التنافس على الانتباه، بينما تقترح هذه الرؤية أن يصبح الانتباه نفسه وسيلة للتكامل.
                  </p>
                  <p className="leading-relaxed">
                    فنجاح أحد الأفراد لا يعني خسارة الآخر، بل يمكن أن يكون جزءًا من منظومة توسع الفرص، وتدعم الإنتاج، وتخلق أثرًا إيجابيًا يمتد إلى المجتمع بأكمله.
                  </p>
                </section>

                {/* 7. سابعًا: الإنسان والكوكب... مسؤولية مشتركة (sec-7) */}
                <section id="sec-7" className="space-y-4 border-b border-slate-800/60 pb-8">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-sm">
                      7
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">سابعًا: الإنسان والكوكب... مسؤولية مشتركة</h2>
                  </div>

                  <p className="leading-relaxed">
                    لا تقتصر المسؤولية الحضارية على الإنسان وحده، بل تمتد إلى البيئة التي يعيش فيها.
                  </p>
                  <p className="leading-relaxed">
                    وعندما يصبح الانتباه موردًا يمكن توجيهه، فإنه يستطيع أيضًا أن يدعم المبادرات التي تحمي البيئة، وتعزز الاستدامة، وتنشر الوعي بالمحافظة على الكوكب، باعتباره البيت المشترك للبشرية.
                  </p>
                </section>

                {/* 8. ثامنًا: حضارة يقودها الأثر والميثاق الحضاري (sec-8) */}
                <section id="sec-8" className="space-y-4 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-sky-500/15 border border-sky-500/30 flex items-center justify-center text-sky-400 font-bold text-sm">
                      8
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">ثامنًا: حضارة يقودها الأثر</h2>
                  </div>

                  <p className="leading-relaxed">
                    تقاس الحضارات بما تتركه من أثر في حياة الإنسان.
                  </p>
                  <p className="leading-relaxed">
                    وتطمح نظرية اقتصاد الانتباه التبادلي إلى الإسهام في بناء مرحلة يصبح فيها الأثر الإنساني معيارًا لنجاح التقنية، ويصبح التقدم الرقمي وسيلة لتعزيز الكرامة، وتوسيع الفرص، وتقوية الروابط بين البشر.
                  </p>
                  <p className="leading-relaxed font-semibold text-emerald-300">
                    إن الحضارة الرقمية القادمة لا تحتاج إلى مزيد من الاتصال فحسب، بل إلى مزيد من المعنى، وإلى أن تتحول التقنية من أداة تستهلك انتباه الإنسان إلى أداة تمنحه القدرة على صناعة الخير، وبناء الفرص، وترك أثر إنساني يمتد إلى مجتمعه وكوكبه.
                  </p>

                  {/* Covenant Document Highlight */}
                  <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-slate-950 border-r-4 border-emerald-500 p-6 sm:p-7 rounded-2xl border border-emerald-500/30 space-y-3 my-6 shadow-xl">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                      <Sparkles className="w-4 h-4" />
                      <span>الميثاق الحضاري لنظرية اقتصاد الانتباه التبادلي</span>
                    </div>
                    <p className="text-white font-bold text-sm sm:text-base leading-relaxed">
                      وثيقة تحدد الغاية الحضارية للنظرية: أن يكون معيار نجاح التقنية ليس فقط ما تحققه من نمو اقتصادي، بل أيضًا ما تضيفه من كرامة إنسانية، وتعاون اجتماعي، واستدامة بيئية، وأثر حضاري طويل المدى. هذا يمنح مشروعك بُعدًا يتجاوز المنصة والنموذج الاقتصادي إلى رؤية متكاملة لمستقبل العلاقة بين الإنسان والتقنية.
                    </p>
                  </div>
                </section>
              </div>

              {/* Footer Summary Box */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800/80 pb-3">
                  <span className="font-bold text-emerald-400">خلاصة المدونة الفكرية والحضارية</span>
                  <span className="font-semibold text-slate-300">بقلم: فايز الجبالي</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                  التقنية وسيلة لخدمة الإنسان وحفظ كرامته وتعمير كوكبه عبر تحويل الانتباه الرقمي إلى أثر حضاري مستدام.
                </p>
              </div>
            </main>
          </div>

          {/* Bottom Action Footer */}
          <div className="p-4 sm:p-5 border-t border-slate-800 bg-slate-950/90 shrink-0 flex items-center justify-between gap-4">
            <span className="text-xs text-slate-400 font-medium hidden sm:inline flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>بقلم: فايز الجبالي | حوكمة حماية حقوق الفكر والناشرين</span>
            </span>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 transition active:scale-95 ml-auto"
            >
              {isAr ? 'إغلاق المقال والعودة للمنصة' : 'Close Article & Return'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};


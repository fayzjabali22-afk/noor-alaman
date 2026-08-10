import React from 'react';
import { Cpu, Activity, Server, Layers } from 'lucide-react';

export const FutureExtensionsTab: React.FC = React.memo(() => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
      <div className="space-y-2 border-b border-slate-800 pb-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold border border-purple-500/20">
          <Cpu className="w-3.5 h-3.5" />
          <span>تجهيز وإعداد التوسعات القادمة (Modular Expansion Nodes)</span>
        </div>
        <h3 className="text-lg font-bold text-white">
          بنية التطوير القادم والتوسيع البرمجي
        </h3>
        <p className="text-xs text-slate-300">
          تم تجهيز حزمة الوصلات البرمجية وهياكل النماذج لاستيعاب مراحل التطوير القادمة بدون إعادة هيكلة.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-950 p-5 rounded-2xl border border-purple-500/30 space-y-3">
          <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 w-fit">
            <Activity className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">رادار الرصد الفوري والتلمتري</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            وحدة قياس سرعة الاستجابة، استهلاك الذاكرة، ومعدلات الأخطاء المباشرة لكل شاشة بفرعية حقيقية.
          </p>
          <span className="inline-block text-[10px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 font-bold">
            جاهز للتفعيل (Node Ready)
          </span>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-sky-500/30 space-y-3">
          <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 w-fit">
            <Server className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">محرك مزامنة قاعدة البيانات السيادية</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            تجهيز المكونات للربط المباشر مع Cloud SQL PostgreSQL و Prisma ORM عند الاعتماد النهائي.
          </p>
          <span className="inline-block text-[10px] text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20 font-bold">
            مجهز للمرحلة القادمة
          </span>
        </div>

        <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/30 space-y-3">
          <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit">
            <Layers className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-white text-sm">بوابة التوثيق البيومتري والشهادات</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            ربط تسجيل الدخول بشهادات الأمان الرقمية للمشرفين والتحقق الثنائي عبر الأجهزة المعتمدة.
          </p>
          <span className="inline-block text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-bold">
            مخطط المرحلة النهائية
          </span>
        </div>
      </div>
    </div>
  );
});

FutureExtensionsTab.displayName = 'FutureExtensionsTab';

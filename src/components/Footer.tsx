import React from 'react';
import { Shield, ExternalLink, ShieldAlert } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../lib/i18n';

interface FooterProps {
  lang: Language;
  onNavigate?: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onNavigate }) => {
  const t = translations[lang];

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-8 px-4 mt-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* Brand & Purpose */}
        <div className="space-y-3 max-w-2xl">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>{t.platformName}</span>
          </div>
          <p className="text-slate-400 leading-relaxed text-xs sm:text-sm">
            {lang === 'ar'
              ? 'تقوم فلسفة منصة نور الأماني على حب الإنسان في تقديم المساعدة، وبسبب ذلك ورغم صعوبة دفع المال في كثير من الأحيان، بدأ الناس يستبدلون ذلك بمشاهدة فيديوهات الناشرين المحتاجين لدعم الآخرين، وهو فعل بسيط يستطيع أي شخص القيام به. الفئات في المرحلة الأولى هي غزة، بسبب الحصار وغياب فرص العمل واعتماد أهلها على المساعدات. وفي المراحل التالية تتوسع المبادرة إلى مناطق الحروب، ومناطق الكوارث، والتضامن مع الحالات المرضية، واللاجئين، والمبادرات الإنسانية والمجتمعية، وصغار المخترعين، وحماية الكوكب.'
              : 'The philosophy of Noor Al-Amani Platform is built on human compassion and helping others. Due to financial difficulties, people support publishers in need simply by watching their videos—a simple act anyone can do. The initial phase targets Gaza due to blockade, job scarcity, and reliance on aid, expanding in subsequent phases to war zones, disaster-stricken areas, medical cases, refugees, humanitarian and community initiatives, young inventors, and planetary protection.'}
          </p>
        </div>

        {/* Platform Sectors Quick Links */}
        <div className="w-full md:w-auto md:min-w-[240px] shrink-0">
          <h4 className="text-white font-semibold mb-3 border-b border-slate-800 pb-1">
            {lang === 'ar' ? 'قطاعات المنصة' : 'Platform Sectors'}
          </h4>
          <ul className="space-y-2">
            <li onClick={() => onNavigate?.('core')} className="flex items-center gap-1.5 hover:text-emerald-300 transition cursor-pointer">
              <ExternalLink className="w-3 h-3 text-slate-500" />
              <span>{t.corePlatform}</span>
            </li>
            <li onClick={() => onNavigate?.('jasmine')} className="flex items-center gap-1.5 hover:text-amber-300 transition cursor-pointer">
              <ExternalLink className="w-3 h-3 text-slate-500" />
              <span>{t.jasmineSector}</span>
            </li>
            <li onClick={() => onNavigate?.('dalal')} className="flex items-center gap-1.5 hover:text-teal-300 transition cursor-pointer">
              <ExternalLink className="w-3 h-3 text-slate-500" />
              <span>{t.dalalSector}</span>
            </li>
            <li onClick={() => onNavigate?.('raeda')} className="flex items-center gap-1.5 hover:text-indigo-300 transition cursor-pointer">
              <ExternalLink className="w-3 h-3 text-slate-500" />
              <span>{t.raedaSector}</span>
            </li>
            <li
              id="footer-admin-sector-link"
              onClick={() => onNavigate?.('admin')}
              className="flex items-center gap-1.5 text-rose-400 font-semibold hover:text-rose-300 transition cursor-pointer pt-1 border-t border-slate-900"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>{lang === 'ar' ? 'قطاع شاشة المشرف - لوحة الإدارة والحوكمة' : 'Admin & Governance Portal'}</span>
            </li>
          </ul>
        </div>


      </div>

      <div className="max-w-7xl mx-auto border-t border-slate-900 mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
        <p>
          © 2026 {t.platformName} - {lang === 'ar' ? 'قسم تحليل وتصميم النظم والحلول المؤسسية' : 'System Analysis & Enterprise Solution Architecture'}.
        </p>
        <p className="mt-2 sm:mt-0 font-mono">
          v1.0.4-GazaPilot (Enterprise Release)
        </p>
      </div>
    </footer>
  );
};

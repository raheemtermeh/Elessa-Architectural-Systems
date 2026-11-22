import { useEffect, useState } from 'react';
import { Clock, Database, Mail, MapPin, Phone, ShieldCheck, Sparkles } from 'lucide-react';
import { strapiApi } from '../services/strapi';
import type { GlobalSettings } from '../types/models';
import type { ScreenId } from './Header';

interface FooterProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenStrapiModal?: () => void;
}

export function Footer({ onNavigate, onOpenStrapiModal }: FooterProps) {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);

  useEffect(() => {
    strapiApi.getGlobalSettings().then(setSettings);
  }, []);

  const handleNav = (screen: ScreenId) => {
    onNavigate(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0b1c16] text-slate-300 mt-20 border-t border-emerald-950">
      <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#059669] to-[#10B981] flex items-center justify-center text-white font-bold shadow-md">
                E
              </div>
              <div>
                <span className="text-2xl font-extrabold text-white tracking-tight">السا</span>
                <span className="text-[10px] font-latin tracking-wider text-[#4EDEA3] uppercase mr-2">
                  Elessa Architectural Systems
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 leading-7 max-w-md">
              طراحی مهندسی، تأمین یراق‌آلات و اجرای تخصصی درب‌های اتوماتیک شیشه‌ای، کرکره‌های
              برقی شفاف و صنعتی، سیستم‌های هندریل و نرده شیشه‌ای دفنی و نماهای هوشمند اسپایدر.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-400 font-tech">
              <span>EN 16005</span>
              <span aria-hidden="true">·</span>
              <span>DIN 18650</span>
              <span aria-hidden="true">·</span>
              <span>DIN 18008-4</span>
              <span aria-hidden="true">·</span>
              <span>ISO 9001:2015</span>
            </div>

            {onOpenStrapiModal && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onOpenStrapiModal}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/15 text-[#4EDEA3] text-xs font-medium cursor-pointer transition-colors"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>تنظیمات و مستندات Strapi Headless CMS</span>
                </button>
              </div>
            )}
          </div>

          {/* Quick Links (3 cols) */}
          <div className="md:col-span-3 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#10B981]" />
              <span>دسترسی سریع</span>
            </h3>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('home')}
                  className="hover:text-[#4EDEA3] transition-colors cursor-pointer"
                >
                  خانه و معرفی
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('catalog')}
                  className="hover:text-[#4EDEA3] transition-colors cursor-pointer"
                >
                  کاتالوگ محصولات و سیستم‌ها
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('projects')}
                  className="hover:text-[#4EDEA3] transition-colors cursor-pointer"
                >
                  پروژه‌های شاخص اجراشده
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('about')}
                  className="hover:text-[#4EDEA3] transition-colors cursor-pointer"
                >
                  درباره شرکت مهندسی السا
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('blog')}
                  className="hover:text-[#4EDEA3] transition-colors cursor-pointer"
                >
                  وبلاگ و دانستنی‌های سازه
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('estimator')}
                  className="hover:text-[#4EDEA3] transition-colors cursor-pointer font-bold text-[#4EDEA3]"
                >
                  محاسبه آنلاین قیمت پیش‌فاکتور
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Showroom (4 cols) */}
          <div className="md:col-span-4 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#10B981]" />
              <span>دفتر مهندسی و شوروم</span>
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#10B981] mt-0.5 shrink-0" />
                <span className="leading-6">
                  {settings?.address ||
                    'تهران، شهرک غرب، میدان صنعت، بلوار فرحزادی، ساختمان مهندسی السا'}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#10B981] shrink-0" />
                <span dir="ltr" className="font-tech text-white font-bold">
                  ۰۲۱-۸۸۴۵۸۹۶۶ — ۷۹۶۴۳۰۱
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#10B981] shrink-0" />
                <span dir="ltr" className="font-latin text-slate-200">
                  {settings?.email || 'engineering@elessa-systems.ir'}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#10B981] shrink-0" />
                <span>شنبه تا چهارشنبه ۸:۳۰ الی ۱۸:۰۰</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© ۱۴۰۵ شرکت سیستم‌های هوشمند معماری السا. تمامی حقوق محفوظ است.</p>
          <p className="font-latin text-slate-400">
            Precision Glass, Motorized Shutters &amp; Automated Entrance Systems
          </p>
        </div>
      </div>
    </footer>
  );
}

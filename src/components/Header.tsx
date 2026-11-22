import { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Clock,
  Database,
  MapPin,
  Menu,
  Phone,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { strapiApi, type StrapiStatus } from '../services/strapi';

export type ScreenId =
  | 'home'
  | 'catalog'
  | 'projects'
  | 'about'
  | 'estimator'
  | 'blog'
  | 'contact';

interface HeaderProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  quoteCount: number;
  onOpenStrapiModal: () => void;
}

const NAV_ITEMS: { id: ScreenId; label: string }[] = [
  { id: 'home', label: 'خانه' },
  { id: 'catalog', label: 'محصولات و سیستم‌ها' },
  { id: 'projects', label: 'پروژه‌ها' },
  { id: 'about', label: 'درباره السا' },
  { id: 'estimator', label: 'محاسبه‌گر قیمت' },
  { id: 'blog', label: 'وبلاگ مهندسی' },
  { id: 'contact', label: 'تماس باما' },
];

export function Header({
  activeScreen,
  onNavigate,
  quoteCount,
  onOpenStrapiModal,
}: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [strapiStatus, setStrapiStatus] = useState<StrapiStatus>(strapiApi.getStatus());

  useEffect(() => {
    return strapiApi.subscribe((status) => {
      setStrapiStatus(status);
    });
  }, []);

  const handleNav = (screen: ScreenId) => {
    onNavigate(screen);
    setMobileOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Phlox Green Business Top Contact Bar */}
      <div className="bg-[#0b1c16] text-slate-300 border-b border-white/10 text-xs hidden lg:block">
        <div className="max-w-[1320px] mx-auto px-6 h-10 flex items-center justify-between gap-6">
          {/* Right Zone (Contact & Working Hours) */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-slate-400">تماس مستقیم:</span>
              <span dir="ltr" className="font-tech text-slate-200 font-semibold tracking-wide">
                ۰۲۱-۸۸۴۵۸۹۶۶ — ۷۹۶۴۳۰۱
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-slate-300">شنبه تا چهارشنبه ۸:۳۰ الی ۱۸:۰۰</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="text-slate-400">دفتر مرکزی و شوروم:</span>
              <span className="text-slate-300">تهران، شهرک غرب، میدان صنعت</span>
            </div>
          </div>

          {/* Left Zone (Strapi Status & Quick CTA) */}
          <div className="flex items-center gap-3">
            {/* Strapi Connection Status Pill */}
            <button
              type="button"
              onClick={onOpenStrapiModal}
              title="مشاهده وضعیت اتصال Strapi و دستورات راه‌اندازی"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 hover:bg-white/15 text-slate-200 text-[11px] font-medium transition-colors cursor-pointer"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  strapiStatus.isConnected ? 'bg-[#10B981]' : 'bg-amber-400'
                }`}
              />
              <Database className="w-3 h-3 text-[#4EDEA3]" />
              <span>
                {strapiStatus.isConnected ? 'Strapi متصل است' : 'Strapi: دیتای محلی'}
              </span>
            </button>

            <span className="text-slate-600">|</span>

            <button
              type="button"
              onClick={() => handleNav('estimator')}
              className="text-[#4EDEA3] hover:text-white transition-colors cursor-pointer flex items-center gap-1 font-semibold text-[11px]"
            >
              <Sparkles className="w-3 h-3 text-[#10B981]" />
              <span>استعلام آنلاین با مهر مهندسی السا</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Phlox Navbar */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)]">
        <div className="max-w-[1320px] mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-6">
          {/* Zone 1: Logo */}
          <button
            type="button"
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-right cursor-pointer group focus-visible:outline-none"
            aria-label="السا — صفحه اصلی"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#059669] to-[#10B981] flex items-center justify-center text-white shadow-md shadow-[#10B981]/25 group-hover:scale-105 transition-transform shrink-0">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4 4H14C17.3137 4 20 6.68629 20 10V10C20 13.3137 17.3137 16 14 16H4V4Z"
                  stroke="white"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <path d="M4 10H17" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M4 20H14" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-extrabold text-[#0F172A] tracking-tight group-hover:text-[#006C49] transition-colors">
                السا
              </span>
              <span className="text-[10px] font-latin font-bold tracking-wider text-[#059669] uppercase">
                Elessa Systems
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav
            aria-label="فهرست اصلی"
            className="hidden xl:flex items-center gap-7 text-sm font-semibold"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`relative py-2 whitespace-nowrap shrink-0 cursor-pointer transition-colors focus-visible:outline-none ${
                    isActive
                      ? 'text-[#006C49] font-bold'
                      : 'text-slate-700 hover:text-[#006C49]'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-[#10B981]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions (Search, Strapi status badge mobile, Quote CTA) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Quick search button */}
            <button
              type="button"
              onClick={() => handleNav('catalog')}
              className="w-10 h-10 rounded-full text-slate-600 hover:text-[#006C49] hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
              title="جستجو در کاتالوگ محصولات"
              aria-label="جستجو در محصولات"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Strapi badge for mobile & tablet */}
            <button
              type="button"
              onClick={onOpenStrapiModal}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs flex items-center gap-1.5 cursor-pointer"
              title="تنظیمات Strapi"
            >
              <Database className="w-4 h-4 text-[#006C49]" />
              <span
                className={`w-2 h-2 rounded-full ${
                  strapiStatus.isConnected ? 'bg-[#10B981]' : 'bg-amber-400'
                }`}
              />
            </button>

            {/* Phlox Pill Primary Button */}
            <button
              type="button"
              onClick={() => handleNav('estimator')}
              className="hidden sm:inline-flex items-center gap-2 btn-primary-elessa rounded-full px-5 sm:px-6 py-3 text-xs sm:text-sm font-bold whitespace-nowrap shrink-0 cursor-pointer shadow-lg shadow-[#10B981]/25"
            >
              <span>
                {quoteCount > 0
                  ? `پیش‌فاکتور (${new Intl.NumberFormat('fa-IR').format(quoteCount)})`
                  : 'شروع پروژه / استعلام'}
              </span>
              <ArrowLeft className="w-4 h-4 shrink-0" />
            </button>

            {/* Hamburger for mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="xl:hidden inline-flex items-center justify-center w-11 h-11 rounded-full text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label={mobileOpen ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 shadow-xl p-5 space-y-3">
          <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = activeScreen === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNav(item.id)}
                  className={`w-full text-right px-4 py-3 rounded-2xl text-sm font-semibold transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#10B981]/10 text-[#006C49] font-bold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenStrapiModal();
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-slate-50 text-xs font-semibold text-slate-700"
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4 text-[#006C49]" />
                <span>وضعیت بک‌اند Strapi:</span>
              </span>
              <span className="font-bold text-[#006C49]">
                {strapiStatus.isConnected ? 'متصل (Live)' : 'محلی (Fallback)'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('estimator')}
              className="w-full btn-primary-elessa rounded-full py-3 text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>درخواست استعلام قیمت و مشاوره</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

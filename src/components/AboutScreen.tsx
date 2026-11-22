import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Award,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { strapiApi } from '../services/strapi';
import type { GlobalSettings } from '../types/models';
import { ResilientImage } from './ResilientImage';
import type { ScreenId } from './Header';

interface AboutScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export function AboutScreen({ onNavigate }: AboutScreenProps) {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);

  useEffect(() => {
    strapiApi.getGlobalSettings().then(setSettings);
  }, []);

  return (
    <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-10 lg:py-16 space-y-16">
      {/* Hero Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-[#006C49]">
            <Sparkles className="w-4 h-4 text-[#10B981]" />
            <span>پیشرو در اتوماسیون ورودی و مهندسی شیشه</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0F172A] leading-tight">
            داستان السا؛ ۱۷ سال ترکیب ظرافت معماری با دقت مهندسی آلمان
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-8">
            شرکت السا (Elessa Architectural Systems) از سال ۱۳۸۶ فعالیت خود را با هدف طراحی و
            اجرای پیشرفته‌ترین سیستم‌های درب اتوماتیک، کرکره‌های برقی شفاف و جان‌پناه‌های شیشه‌ای
            دفنی آغاز نمود. ما با واردات مستقیم مرغوب‌ترین یراق‌آلات اروپایی و استفاده از آلیاژهای
            ممتاز آلومینیوم ۶۰۶۳-T6، استانداردی نو در صنعت ساختمان ایران پایه‌گذاری کرده‌ایم.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-200/80 text-center">
            <div className="p-4 rounded-2xl bg-slate-50">
              <div className="text-2xl font-extrabold text-[#006C49] font-tech">۱۷+ سال</div>
              <div className="text-xs text-slate-500 mt-1">تجربه مهندسی</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50">
              <div className="text-2xl font-extrabold text-[#006C49] font-tech">۱,۴۲۰+</div>
              <div className="text-xs text-slate-500 mt-1">پروژه موفق</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50">
              <div className="text-2xl font-extrabold text-[#006C49] font-tech">۹۹٪</div>
              <div className="text-xs text-slate-500 mt-1">رضایت کارفرما</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50">
              <div className="text-2xl font-extrabold text-[#006C49] font-tech">۱۰ سال</div>
              <div className="text-xs text-slate-500 mt-1">گارانتی کتبی سازه</div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative">
          <div className="rounded-[32px] overflow-hidden border-4 border-white shadow-2xl aspect-[4/3]">
            <ResilientImage
              src="/src/assets/images/hero_elessa_entrance_1795077342935.jpg"
              alt="تیم مهندسی السا"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-bold text-[#006C49] uppercase">ارزش‌های مهندسی ما</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            چهار اصل بنیادین در کارنامه کاری السا
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="surface-card-1 rounded-[28px] p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/15 text-[#006C49] flex items-center justify-center font-bold">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">طراحی دقیق شاپ‌دراوینگ</h3>
            <p className="text-xs text-slate-600 leading-6">
              تمامی پروژه‌ها پیش از ساخت دارای نقشه‌های فنی دوبعدی و سه‌بعدی و تراز لیزری تاییدشده
              هستند.
            </p>
          </div>

          <div className="surface-card-1 rounded-[28px] p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/15 text-[#006C49] flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">استاندارد ایمنی اروپا</h3>
            <p className="text-xs text-slate-600 leading-6">
              انطباق کامل سیستم‌های ورودی با EN 16005 و استانداردهای پدافند غیرعامل در برابر ضربه و باد.
            </p>
          </div>

          <div className="surface-card-1 rounded-[28px] p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/15 text-[#006C49] flex items-center justify-center font-bold">
              <FileCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">ضمانت کتبی ۱۰ ساله</h3>
            <p className="text-xs text-slate-600 leading-6">
              صدور کارت شناسنامه و گارانتی کتبی تعویض قطعات و خدمات پس از فروش فوری و سراسری.
            </p>
          </div>

          <div className="surface-card-1 rounded-[28px] p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#10B981]/15 text-[#006C49] flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">تیم نصب آموزش‌دیده</h3>
            <p className="text-xs text-slate-600 leading-6">
              تکنسین‌های مجرب با گواهینامه معتبر کار در ارتفاع و ابزارهای کالیبره تراز میلی‌متری.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div className="rounded-[32px] bg-[#0F172A] text-white p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center sm:text-right">
          <h3 className="text-xl sm:text-2xl font-bold">می‌خواهید پروژه‌تان را با تیم السا ارزیابی کنید؟</h3>
          <p className="text-xs sm:text-sm text-slate-300">
            کارشناسان فنی ما آماده بازدید حضوری و ارائه دفترچه محاسبات سازه‌ای هستند.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            onNavigate('contact');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="btn-primary-elessa rounded-full px-8 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer shrink-0"
        >
          هماهنگی بازدید و مشاوره
        </button>
      </div>
    </div>
  );
}

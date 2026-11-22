import { useEffect, useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  ChevronDown,
  Clock,
  HelpCircle,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { strapiApi } from '../services/strapi';
import type { FAQItem, GlobalSettings } from '../types/models';

export function ContactScreen() {
  const [settings, setSettings] = useState<GlobalSettings | null>(null);
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('تهران');
  const [systemInterest, setSystemInterest] = useState('درب اتوماتیک شیشه‌ای');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    trackingCode: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    Promise.all([strapiApi.getGlobalSettings(), strapiApi.getFaqs()]).then(
      ([gs, fqs]) => {
        setSettings(gs);
        setFaqs(fqs);
        if (fqs.length > 0) setOpenFaqId(fqs[0].id);
      }
    );
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    setSubmitting(true);
    try {
      const res = await strapiApi.createInquiry({
        fullName: fullName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        projectType: 'تماس مستقیم از سایت',
        systemInterest,
        notes: notes.trim(),
      });
      setResult({
        success: res.success,
        trackingCode: res.trackingCode,
        message: res.message,
      });
      setFullName('');
      setPhone('');
      setNotes('');
    } catch (err) {
      console.error('Contact submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-10 lg:py-14 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <p className="text-xs font-bold text-[#006C49] uppercase">
          تماس و هماهنگی بازدید حضوری
        </p>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          پل‌های ارتباطی با مهندسی فروش و پشتیبانی السا
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-7">
          مشاوران فنی ما آماده ارائه مشاوره، نقشه‌کشی شاپ‌دراوینگ و برآورد هزینه پروژه‌های شما هستند.
        </p>
      </div>

      {/* Main Grid: Contact Cards + Live Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Contact Info Cards (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="surface-card-1 rounded-[28px] p-6 space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              دفتر مرکزی و شوروم السا
            </h2>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800">نشانی شوروم و دفتر:</div>
                  <div className="text-slate-600 leading-6">
                    {settings?.address ||
                      'تهران، شهرک غرب، میدان صنعت، بلوار فرحزادی، ساختمان مهندسی السا'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800">خطوط تلفن مهندسی:</div>
                  <div dir="ltr" className="font-tech text-slate-900 font-bold text-right">
                    ۰۲۱-۸۸۴۵۸۹۶۶ — ۷۹۶۴۳۰۱
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800">ساعات کاری مهندسی و بازدید:</div>
                  <div className="text-slate-600">
                    {settings?.workingHours ||
                      'شنبه تا چهارشنبه ۸:۳۰ الی ۱۸:۰۰ | پنجشنبه‌ها ۸:۳۰ الی ۱۴:۰۰'}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-800">پست الکترونیک رسمی:</div>
                  <div dir="ltr" className="font-tech text-slate-700 text-right">
                    engineering@elessa-systems.ir
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] bg-[#0F172A] text-white p-6 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#4EDEA3]">
              <ShieldCheck className="w-4 h-4" />
              <span>پشتیبانی اورژانسی ۲۴ ساعته</span>
            </div>
            <p className="text-xs text-slate-300 leading-6">
              برای پروژه‌های دارای قرارداد نگهداری ادواری (بیمارستان‌ها، مراکز تجاری، برج‌ها)، واحد خدمات پس از فروش السا به صورت شبانه‌روزی آماده اعزام تیم امداد فنی است.
            </p>
          </div>
        </div>

        {/* Form (7 cols - posts to Strapi) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="surface-card-1 rounded-[32px] p-7 sm:p-10 space-y-5"
          >
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-bold text-[#0F172A]">
                ارسال درخواست بازدید یا مشاوره تخصصی
              </h2>
              <p className="text-xs text-slate-500">
                مشخصات پروژه را وارد کنید تا کارشناس ارشد السا فوراً با شما هماهنگ نماید.
              </p>
            </div>

            {result ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <div className="text-base font-bold">{result.message}</div>
                <div className="text-xs">
                  کد پیگیری شما:{' '}
                  <strong dir="ltr" className="font-tech text-base text-emerald-800">
                    {result.trackingCode}
                  </strong>
                </div>
                <button
                  type="button"
                  onClick={() => setResult(null)}
                  className="btn-secondary-elessa rounded-full px-6 py-2 text-xs font-bold cursor-pointer"
                >
                  ارسال پیام دیگر
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-800">
                      نام و نام خانوادگی *
                    </span>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="مهندس علی حسینی"
                      className="input-elessa w-full px-4 py-2.5 text-xs sm:text-sm"
                    />
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-800">
                      شماره تماس یا همراه *
                    </span>
                    <input
                      type="tel"
                      required
                      dir="ltr"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="09123456789"
                      className="input-elessa w-full px-4 py-2.5 text-xs sm:text-sm font-tech text-right"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-800">
                      شهر یا استان پروژه
                    </span>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="تهران"
                      className="input-elessa w-full px-4 py-2.5 text-xs sm:text-sm"
                    />
                  </label>

                  <label className="block space-y-1.5">
                    <span className="text-xs font-semibold text-slate-800">
                      سیستم مورد نظر
                    </span>
                    <select
                      value={systemInterest}
                      onChange={(e) => setSystemInterest(e.target.value)}
                      className="input-elessa w-full px-4 py-2.5 text-xs sm:text-sm cursor-pointer"
                    >
                      <option value="درب اتوماتیک شیشه‌ای">درب اتوماتیک شیشه‌ای</option>
                      <option value="کرکره برقی شفاف پلی‌کربنات">
                        کرکره برقی شفاف پلی‌کربنات
                      </option>
                      <option value="هندریل و نرده شیشه‌ای دفنی">
                        هندریل و نرده شیشه‌ای دفنی
                      </option>
                      <option value="سایبان و نمای اسپایدر">سایبان و نمای اسپایدر</option>
                      <option value="سایر سیستم‌های اختصاصی">سایر سیستم‌های اختصاصی</option>
                    </select>
                  </label>
                </div>

                <label className="block space-y-1.5">
                  <span className="text-xs font-semibold text-slate-800">
                    شرح درخواست یا جزئیات ابعاد (اختیاری)
                  </span>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="توضیحات تکمیلی پیرامون پروژه یا زمان بازدید مورد نظر..."
                    className="input-elessa w-full px-4 py-3 text-xs sm:text-sm resize-none"
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full btn-primary-elessa rounded-full py-3.5 text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? 'در حال ارسال به Strapi...' : 'ثبت درخواست و دریافت کد رهگیری'}</span>
                </button>
              </>
            )}
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="space-y-8 pt-8 border-t border-slate-200">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <p className="text-xs font-bold text-[#006C49] uppercase">سوالات متداول</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
            پرسش‌های پرتکرار کارفرمایان و مهندسان
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className="surface-card-1 rounded-2xl overflow-hidden border border-slate-200/80 transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-5 text-right flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform ${
                      isOpen ? 'rotate-180 text-[#006C49]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-7 border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

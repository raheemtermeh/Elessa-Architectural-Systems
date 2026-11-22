import { useEffect, useState, useMemo, type FormEvent } from 'react';
import {
  ArrowLeft,
  Award,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronLeft,
  Clock,
  Layers,
  MapPin,
  Phone,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  User,
} from 'lucide-react';
import { strapiApi } from '../services/strapi';
import type {
  Article,
  Category,
  GlobalSettings,
  Product,
  Project,
  ServiceFeature,
  Testimonial,
} from '../types/models';
import { ResilientImage } from './ResilientImage';
import type { ScreenId } from './Header';

interface HomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onSelectCategory: (categorySlug: string) => void;
  onInspectProduct: (product: Product) => void;
  onSelectArticle: (article: Article) => void;
  onSelectProject: (project: Project) => void;
}

export function HomeScreen({
  onNavigate,
  onSelectCategory,
  onInspectProduct,
  onSelectArticle,
  onSelectProject,
}: HomeScreenProps) {
  const [globalSettings, setGlobalSettings] = useState<GlobalSettings | null>(null);
  const [services, setServices] = useState<ServiceFeature[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [projectFilter, setProjectFilter] = useState<string>('all');

  // Contact Form state (POSTs to Strapi)
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSystem, setContactSystem] = useState('درب اتوماتیک شیشه‌ای');
  const [contactNotes, setContactNotes] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    trackingCode: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [gs, srv, cats, prods, projs, arts, tests] = await Promise.all([
          strapiApi.getGlobalSettings(),
          strapiApi.getServices(),
          strapiApi.getCategories(),
          strapiApi.getProducts(),
          strapiApi.getProjects(),
          strapiApi.getArticles(),
          strapiApi.getTestimonials(),
        ]);
        setGlobalSettings(gs);
        setServices(srv);
        setCategories(cats);
        setProducts(prods);
        setProjects(projs);
        setArticles(arts);
        setTestimonials(tests);
      } catch (err) {
        console.error('Error loading home data:', err);
      }
    }
    loadData();
  }, []);

  const filteredProjects = useMemo(() => {
    if (projectFilter === 'all') return projects;
    return projects.filter((p) => p.categorySlug === projectFilter);
  }, [projects, projectFilter]);

  const handleInquirySubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactPhone.trim()) return;

    setFormSubmitting(true);
    try {
      const res = await strapiApi.createInquiry({
        fullName: contactName.trim(),
        phone: contactPhone.trim(),
        city: 'تهران',
        projectType: 'استعلام از صفحه اصلی',
        systemInterest: contactSystem,
        notes: contactNotes.trim(),
      });
      setSubmitResult({
        success: res.success,
        trackingCode: res.trackingCode,
        message: res.message,
      });
      setContactName('');
      setContactPhone('');
      setContactNotes('');
    } catch (err) {
      console.error('Submit error:', err);
    } finally {
      setFormSubmitting(false);
    }
  };

  const heroProduct = products[0] || null;

  return (
    <div className="space-y-24 lg:space-y-32 pb-16">
      {/* ---------------- 1. PHLOX HERO BANNER ---------------- */}
      <section className="relative overflow-hidden pt-8 lg:pt-14 pb-12 lg:pb-20">
        <div className="max-w-[1320px] mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Right Column: Punchy Phlox Typography */}
            <div className="lg:col-span-7 space-y-7">
              {/* Phlox Kicker Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-bold text-[#006C49]">
                <Sparkles className="w-4 h-4 text-[#10B981]" />
                <span>
                  {globalSettings?.experienceYears || 17} سال تجربه کاری در سیستم‌های مدرن ساختمانی
                </span>
              </div>

              {/* Phlox Headline Style with wavy accent */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#0F172A] leading-[1.3] tracking-tight">
                در ایمنی و شفافیت معماری{' '}
                <span className="text-[#059669] relative inline-block underline decoration-[#10B981]/50 decoration-wavy">
                  سرمایه‌ بگذاریــد
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-600 leading-8 max-w-2xl">
                طراحی، ساخت و اجرای اختصاصی انواع کرکره‌های برقی شفاف پلی‌کربنات، درب‌های
                اتوماتیک شیشه‌ای، هندریل‌های دفنی و اکسپوز و نمای هوشمند با استاندارد مهندسی
                DIN آلمان و گارانتی رسمی ۱۰ ساله.
              </p>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onNavigate('catalog');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-primary-elessa rounded-full px-8 py-4 text-sm sm:text-base font-bold inline-flex items-center gap-3 whitespace-nowrap cursor-pointer shadow-xl shadow-[#10B981]/30"
                >
                  <span>مشاهده تمامی خدمات و محصولات</span>
                  <ArrowLeft className="w-4 h-4 shrink-0" />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    onNavigate('estimator');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-secondary-elessa rounded-full px-7 py-4 text-sm sm:text-base font-semibold inline-flex items-center gap-2.5 whitespace-nowrap cursor-pointer"
                >
                  <span>محاسبه آنلاین قیمت</span>
                  <ChevronLeft className="w-4 h-4 shrink-0" />
                </button>
              </div>

              {/* Trust Points */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-200/70">
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  برداشت لیزری رایگان در تهران و کرج
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  موتورهای براشلس ۲۴ ولت Dunkermotoren
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <Check className="w-4 h-4 text-[#10B981]" />
                  ضمانت کتبی ۱۰ ساله سازه
                </span>
              </div>
            </div>

            {/* Left Column: Architectural Visual Carrier with Experience Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-[32px] overflow-hidden border-4 border-white shadow-2xl aspect-[4/3] sm:aspect-[16/11]">
                <ResilientImage
                  src={heroProduct?.image || '/src/assets/images/hero_elessa_entrance_1795077342935.jpg'}
                  alt="ورودی مدرن شیشه‌ای السا"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent" />

                {/* Floating Experience Badge (Phlox Style) */}
                <div className="absolute bottom-6 right-6 left-6 p-4 rounded-2xl bg-white/90 backdrop-blur-md border border-white flex items-center justify-between gap-4 shadow-lg">
                  <div>
                    <div className="text-xs text-slate-500 font-semibold">
                      تضمین کیفیت مهندسی السا
                    </div>
                    <div className="text-sm sm:text-base font-extrabold text-[#0F172A]">
                      {globalSettings?.experienceYears || 17} سال سابقه برای کمک به مشتریان
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#059669] to-[#10B981] text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-md">
                    DIN
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 2. PHLOX 4-CARD SERVICE FEATURE BOXES ---------------- */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <p className="text-xs font-bold text-[#006C49] tracking-wider uppercase">
            ستون‌های مهندسی السا
          </p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A]">
            خدمات و سیستم‌های تخصصی شیشه و اتوماسیون
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, idx) => (
            <article
              key={srv.id}
              className="group surface-card-2 rounded-[28px] p-7 flex flex-col justify-between gap-6 transition-all hover:border-[#10B981]/50 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Icon Container */}
                <div className="w-14 h-14 rounded-2xl bg-[#10B981]/12 text-[#006C49] group-hover:bg-[#10B981] group-hover:text-white flex items-center justify-center transition-all shadow-sm">
                  {idx === 0 && <Building2 className="w-7 h-7" />}
                  {idx === 1 && <Layers className="w-7 h-7" />}
                  {idx === 2 && <Shield className="w-7 h-7" />}
                  {idx === 3 && <Sparkles className="w-7 h-7" />}
                </div>

                <h3 className="text-lg font-bold text-[#0F172A] group-hover:text-[#006C49] transition-colors">
                  {srv.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-600 leading-6">
                  {srv.description}
                </p>

                {/* Bullets */}
                <ul className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  {srv.specs.map((item, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shrink-0" />
                      <span className="truncate">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                type="button"
                onClick={() => {
                  onSelectCategory(srv.categorySlug);
                  onNavigate('catalog');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#006C49] group-hover:text-[#059669] transition-colors cursor-pointer pt-2"
              >
                <span>{srv.linkText}</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- 3. PHLOX ABOUT US SECTION ---------------- */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Right Column: Visual Collage */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-[32px] overflow-hidden aspect-[4/3] border-4 border-white shadow-2xl">
              <ResilientImage
                src="/src/assets/images/product_telescopic_door_1795077320515.jpg"
                alt="معماری السا و درب اتوماتیک"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Secondary Overlapping Card */}
            <div className="absolute -bottom-6 -left-6 sm:bottom-6 sm:-left-6 w-56 sm:w-64 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-2xl space-y-2 hidden sm:block">
              <div className="flex items-center gap-2 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs font-bold text-slate-800">
                استاندارد مهندسی و ایمنی
              </div>
              <p className="text-[11px] text-slate-500 leading-5">
                تأییدیه تست‌های بارگذاری ضربه، باد و زلزله در پروژه‌های ملی
              </p>
            </div>
          </div>

          {/* Left Column: Story & Checkmarks */}
          <div className="lg:col-span-6 space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-bold text-[#006C49] tracking-wider uppercase">
                درباره شرکت مهندسی السا
              </p>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] leading-tight">
                ما اینجاییم تا مطمئن شویم پروژه‌ای لوکس، استاندارد و ایمن‌تر داشته باشید!
              </h2>
            </div>

            <p className="text-sm sm:text-base text-slate-600 leading-8">
              السا با تلفیق شیشه‌های سازه‌ای لمینت، پروفیل‌های آلومینیوم آلیاژی ۶۰۶۳ و مدرن‌ترین
              موتورهای براشلس آلمان، امکان اجرای بدون محدودیت زیباترین ورودی‌ها و هندریل‌های
              معماری را برای کارفرمایان و مهندسان مشاور فراهم کرده است.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-slate-800">
                  محاسبات دقیق بار باد و بار مرده (مبحث ششم)
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-slate-800">
                  یراق‌آلات استیل ضدزنگ ۳۱۶ دریایی
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-slate-800">
                  موتورهای براشلس بی‌صدا با گارانتی ۵ ساله
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0 mt-0.5" />
                <span className="text-xs font-semibold text-slate-800">
                  برداشت و تراز با دستگاه‌های لیزری کالیبره
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onNavigate('about');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="btn-secondary-elessa rounded-full px-6 py-3 text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer"
              >
                <span>بیشتر درباره السا و تاریخچه ما بدانید</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 4. PHLOX RECENT PORTFOLIOS GRID ---------------- */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-bold text-[#006C49] uppercase">پرونده پروژه‌ها</p>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A]">
              پروژه‌های حرفه‌ای اخیر و نمونه‌کارهای اجراشده
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <button
              type="button"
              onClick={() => setProjectFilter('all')}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                projectFilter === 'all'
                  ? 'bg-[#10B981] text-white shadow-md shadow-[#10B981]/30'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              همه پروژه‌ها
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setProjectFilter(c.slug)}
                className={`rounded-full px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  projectFilter === c.slug
                    ? 'bg-[#10B981] text-white shadow-md shadow-[#10B981]/30'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filteredProjects.map((p) => (
            <article
              key={p.id}
              className="surface-card-2 rounded-[28px] overflow-hidden flex flex-col group cursor-pointer"
              onClick={() => onSelectProject(p)}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <ResilientImage
                  src={p.image}
                  alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 shadow-sm">
                  {p.categoryLabel}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                    <span>{p.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{p.year}</span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#006C49] transition-colors leading-snug">
                    {p.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-6">
                    {p.overview}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-[#006C49]">{p.outcomeMetric}</span>
                  <span className="text-slate-400 group-hover:text-[#006C49] transition-colors flex items-center gap-1 font-bold">
                    <span>مشاهده جزئیات</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- 5. PHLOX STATS / COUNTERS STRIP ---------------- */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8">
        <div className="rounded-[32px] bg-[#0F172A] text-white p-8 sm:p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute -right-20 -bottom-20 w-60 h-60 rounded-full bg-[#10B981]/15 blur-3xl"
          />

          <div className="space-y-1 relative z-10">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#4EDEA3] tabular-nums">
              {globalSettings?.completedProjectsCount || 1420}+
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-200">
              پروژه اجراشده شاخص
            </div>
            <p className="text-[11px] text-slate-400">در سراسر تهران و مراکز استان‌ها</p>
          </div>

          <div className="space-y-1 relative z-10">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#4EDEA3] tabular-nums">
              {globalSettings?.experienceYears || 17}+ سال
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-200">
              سابقه مهندسی و تولید
            </div>
            <p className="text-[11px] text-slate-400">تخصص در درب اتوماتیک و شیشه</p>
          </div>

          <div className="space-y-1 relative z-10">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#4EDEA3] tabular-nums">
              {new Intl.NumberFormat('fa-IR').format(globalSettings?.installedAreaSqm || 85000)}+ m²
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-200">
              مساحت شیشه سازه‌ای
            </div>
            <p className="text-[11px] text-slate-400">تست‌شده با تراز لیزری</p>
          </div>

          <div className="space-y-1 relative z-10">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#4EDEA3] tabular-nums">
              {globalSettings?.clientSatisfactionRate || 99}%
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-200">
              رضایت کارفرمایان و معماران
            </div>
            <p className="text-[11px] text-slate-400">بر اساس نظرسنجی دوره‌ای</p>
          </div>
        </div>
      </section>

      {/* ---------------- 6. PHLOX 4-STEP WORKFLOW ---------------- */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-bold text-[#006C49] uppercase">فرآیند مهندسی کار</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A]">
            مراحل انجام پروژه از بازدید تا تحویل با گارانتی
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="surface-card-1 rounded-[28px] p-7 space-y-3 relative overflow-hidden">
            <span className="text-4xl font-extrabold text-slate-200 font-tech">01</span>
            <h3 className="text-base font-bold text-[#0F172A]">بازدید و برداشت لیزری</h3>
            <p className="text-xs text-slate-600 leading-6">
              حضور کارشناس در پروژه با ابزارهای تراز لیزری و بررسی دقیق ایستایی سازه، کف و سقف.
            </p>
          </div>
          <div className="surface-card-1 rounded-[28px] p-7 space-y-3 relative overflow-hidden">
            <span className="text-4xl font-extrabold text-slate-200 font-tech">02</span>
            <h3 className="text-base font-bold text-[#0F172A]">طراحی شاپ‌دراوینگ</h3>
            <p className="text-xs text-slate-600 leading-6">
              ارائه نقشه‌های اجرایی دو بعدی و سه‌بعدی و انجام محاسبات بار باد بر اساس ضوابط ملی.
            </p>
          </div>
          <div className="surface-card-1 rounded-[28px] p-7 space-y-3 relative overflow-hidden">
            <span className="text-4xl font-extrabold text-slate-200 font-tech">03</span>
            <h3 className="text-base font-bold text-[#0F172A]">تولید دقیق CNC در کارخانه</h3>
            <p className="text-xs text-slate-600 leading-6">
              ماشین‌کاری پروفیل‌های آلومینیومی، مونتاژ اپراتور و آزمایش کیفی پیش از ارسال به سایت.
            </p>
          </div>
          <div className="surface-card-1 rounded-[28px] p-7 space-y-3 relative overflow-hidden">
            <span className="text-4xl font-extrabold text-slate-200 font-tech">04</span>
            <h3 className="text-base font-bold text-[#0F172A]">نصب و صدور گارانتی کتبی</h3>
            <p className="text-xs text-slate-600 leading-6">
              نصب توسط تیم مجرب و تحویل شناسنامه فنی ۵ تا ۱۰ ساله به همراه پشتیبانی ۲۴ ساعته.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- 7. PHLOX REVIEWS / TESTIMONIALS ---------------- */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-bold text-[#006C49] uppercase">نظرات همکاران و کارفرمایان</p>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0F172A]">
            معماران برجسته درباره السا چه می‌گویند؟
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="surface-card-1 rounded-[28px] p-8 space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <blockquote className="text-sm sm:text-[15px] text-slate-700 leading-8">
                  «{t.quote}»
                </blockquote>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-4">
                <div>
                  <div className="text-sm font-bold text-[#0F172A]">{t.author}</div>
                  <div className="text-xs text-slate-500">
                    {t.role} — {t.organization}
                  </div>
                </div>
                <span className="text-[11px] font-semibold text-[#006C49] bg-emerald-50 px-3 py-1 rounded-full">
                  پروژه: {t.project}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- 8. PHLOX ARTICLES / BLOG ---------------- */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2 max-w-2xl">
            <p className="text-xs font-bold text-[#006C49] uppercase">وبلاگ و دانستنی‌ها</p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A]">
              آخرین مقالات تخصصی مهندسی شیشه و درب
            </h2>
          </div>
          <button
            type="button"
            onClick={() => {
              onNavigate('blog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-sm font-bold text-[#006C49] hover:underline inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <span>مشاهده تمام مطالب وبلاگ</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {articles.map((art) => (
            <article
              key={art.id}
              className="surface-card-2 rounded-[28px] overflow-hidden flex flex-col group cursor-pointer"
              onClick={() => onSelectArticle(art)}
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <ResilientImage
                  src={art.image}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800">
                  {art.category}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between gap-4">
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                      {art.publishedDate}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                      {art.readTimeMinutes} دقیقه مطالعه
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#0F172A] group-hover:text-[#006C49] transition-colors leading-snug line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-6">
                    {art.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#006C49]">
                  <span>مطالعه متن کامل مقاله</span>
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- 9. PHLOX CALL TO ACTION & INQUIRY FORM ---------------- */}
      <section className="max-w-[1320px] mx-auto px-5 sm:px-8">
        <div className="rounded-[36px] bg-gradient-to-br from-[#0F172A] via-[#132223] to-[#073024] text-white p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden">
          <div
            aria-hidden="true"
            className="absolute top-0 right-0 w-96 h-96 bg-[#10B981]/20 rounded-full blur-3xl pointer-events-none"
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            {/* Right: Hook text */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-[#4EDEA3] tracking-widest uppercase">
                شروع یک پروژه جدید
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight">
                در انتظار چه هستید؟ بیایید راجع به پروژه صحبت کنیم!
              </h2>
              <p className="text-sm sm:text-base text-slate-300 leading-8">
                کافیست ابعاد دهانه یا نیاز پروژه خود را وارد کنید تا کارشناسان ارشد مهندسی السا
                در کمتر از ۲ ساعت با پیشنهاد فنی و پیش‌فاکتور رسمی با شما تماس بگیرند.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#4EDEA3] shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">تلفن مستقیم مهندسی فروش:</div>
                    <div dir="ltr" className="font-tech text-base font-bold text-white">
                      ۰۲۱-۸۸۴۵۸۹۶۶
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#4EDEA3] shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">نشانی کارخانه و شوروم:</div>
                    <div className="text-xs text-slate-200">
                      تهران، شهرک غرب، میدان صنعت، ساختمان مهندسی السا
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Left: Interactive Fast Form (Posts directly to Strapi) */}
            <div className="lg:col-span-6">
              <form
                onSubmit={handleInquirySubmit}
                className="bg-white rounded-[28px] p-6 sm:p-8 text-[#0F172A] shadow-2xl space-y-4"
              >
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-lg font-bold">فرم استعلام قیمت و مشاوره</h3>
                  <p className="text-xs text-slate-500">
                    اطلاعات مستقیماً در دیتابیس Strapi ثبت می‌گردد.
                  </p>
                </div>

                {submitResult ? (
                  <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-3 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <div className="text-base font-bold">{submitResult.message}</div>
                    <div className="text-xs">
                      کد رهگیری شما:{' '}
                      <strong dir="ltr" className="font-tech text-sm text-emerald-800">
                        {submitResult.trackingCode}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSubmitResult(null)}
                      className="btn-secondary-elessa rounded-full px-5 py-2 text-xs font-bold cursor-pointer"
                    >
                      ثبت درخواست جدید
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <label className="block space-y-1">
                        <span className="text-xs font-semibold text-slate-800">
                          نام و نام‌خانوادگی *
                        </span>
                        <input
                          type="text"
                          required
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          placeholder="مثلاً مهندس رامین تهرانی"
                          className="input-elessa w-full px-3.5 py-2.5 text-xs"
                        />
                      </label>

                      <label className="block space-y-1">
                        <span className="text-xs font-semibold text-slate-800">
                          شماره تماس یا موبایل *
                        </span>
                        <input
                          type="tel"
                          required
                          dir="ltr"
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          placeholder="09123456789"
                          className="input-elessa w-full px-3.5 py-2.5 text-xs font-tech text-right"
                        />
                      </label>
                    </div>

                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-800">
                        سیستم یا خدمات مورد نیاز:
                      </span>
                      <select
                        value={contactSystem}
                        onChange={(e) => setContactSystem(e.target.value)}
                        className="input-elessa w-full px-3.5 py-2.5 text-xs cursor-pointer"
                      >
                        <option value="درب اتوماتیک شیشه‌ای">درب اتوماتیک شیشه‌ای</option>
                        <option value="کرکره برقی شفاف پلی‌کربنات">
                          کرکره برقی شفاف پلی‌کربنات
                        </option>
                        <option value="هندریل و نرده شیشه‌ای دفنی">
                          هندریل و نرده شیشه‌ای دفنی
                        </option>
                        <option value="سایبان و نمای اسپایدر">سایبان و نمای اسپایدر</option>
                        <option value="مشاوره جامع پروژه برج‌سازی">
                          مشاوره جامع پروژه برج‌سازی
                        </option>
                      </select>
                    </label>

                    <label className="block space-y-1">
                      <span className="text-xs font-semibold text-slate-800">
                        ابعاد تقریبی یا توضیحات پروژه (اختیاری):
                      </span>
                      <textarea
                        rows={3}
                        value={contactNotes}
                        onChange={(e) => setContactNotes(e.target.value)}
                        placeholder="مثلاً ۴ دهانه درب اسلایدینگ عرض ۳ متر..."
                        className="input-elessa w-full px-3.5 py-2 text-xs resize-none"
                      />
                    </label>

                    <button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full btn-primary-elessa rounded-full py-3 text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                    >
                      <Send className="w-4 h-4" />
                      <span>{formSubmitting ? 'در حال ثبت...' : 'ارسال استعلام و درخواست مشاوره'}</span>
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

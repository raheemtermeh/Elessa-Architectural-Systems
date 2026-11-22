import { useEffect, useMemo, useState, type FormEvent } from 'react';
import {
  CheckCircle2,
  Plus,
  Printer,
  RotateCcw,
  Sparkles,
  Trash2,
} from 'lucide-react';
import { strapiApi } from '../services/strapi';
import type { FinishOption, Product, QuoteItem } from '../types/models';

interface EstimatorScreenProps {
  quoteItems: QuoteItem[];
  onAddQuoteItem: (item: QuoteItem) => void;
  onRemoveQuoteItem: (id: string) => void;
  onClearQuoteItems: () => void;
}

const GLASS_OPTIONS = [
  { id: 'tempered-10', label: 'شیشه سکوریت ۱۰ میل سوپرکلیر', multiplier: 1.0 },
  { id: 'laminated-16', label: 'شیشه لمینت ایمنی ۱۶.۷۶ میل (PVB)', multiplier: 1.15 },
  { id: 'laminated-21', label: 'شیشه لمینت سازه‌ای ۲۱.۵۲ میل (SGP)', multiplier: 1.28 },
];

const GRADE_OPTIONS = [
  { id: 'standard', label: 'تیپ مهندسی استاندارد اروپا (EN 16005)', multiplier: 1.0 },
  { id: 'heavy-duty', label: 'تیپ تردد سنگین تجاری + باتری بکاپ و BMS', multiplier: 1.18 },
];

interface SubmittedReceipt {
  trackingCode: string;
  dateLabel: string;
  fullName: string;
  phone: string;
  city: string;
  projectType: string;
  notes: string;
  items: QuoteItem[];
  totalToman: number;
  source: 'strapi' | 'fallback';
}

export function EstimatorScreen({
  quoteItems,
  onAddQuoteItem,
  onRemoveQuoteItem,
  onClearQuoteItems,
}: EstimatorScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [widthMeters, setWidthMeters] = useState<number>(3.2);
  const [heightMeters, setHeightMeters] = useState<number>(2.6);
  const [quantity, setQuantity] = useState<number>(1);
  const [finishId, setFinishId] = useState<string>('anodized-silver');
  const [glassId, setGlassId] = useState<string>(GLASS_OPTIONS[1].id);
  const [gradeId, setGradeId] = useState<string>(GRADE_OPTIONS[0].id);

  // Inquiry Submission Form
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('تهران');
  const [projectType, setProjectType] = useState('برج اداری / تجاری');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<SubmittedReceipt | null>(null);

  useEffect(() => {
    async function init() {
      setLoading(true);
      try {
        const prods = await strapiApi.getProducts();
        setProducts(prods);
        if (prods.length > 0) {
          setSelectedProductId(prods[0].id);
          setWidthMeters(prods[0].defaultWidth);
          setHeightMeters(prods[0].defaultHeight);
          if (prods[0].finishes && prods[0].finishes[0]) {
            setFinishId(prods[0].finishes[0].id);
          }
        }
      } catch (err) {
        console.error('Estimator load error:', err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, []);

  const selectedProduct = useMemo(
    () => products.find((p) => p.id === selectedProductId) || products[0],
    [products, selectedProductId]
  );

  const selectedFinish: FinishOption = useMemo(() => {
    if (!selectedProduct || !selectedProduct.finishes) {
      return { id: 'anodized-silver', label: 'آلومینیوم آنادایز نقره‌ای', code: 'EV1', swatch: '#CBD5E1', multiplier: 1.0 };
    }
    return (
      selectedProduct.finishes.find((f) => f.id === finishId) ||
      selectedProduct.finishes[0]
    );
  }, [selectedProduct, finishId]);

  const selectedGlass = useMemo(
    () => GLASS_OPTIONS.find((g) => g.id === glassId) || GLASS_OPTIONS[0],
    [glassId]
  );

  const selectedGrade = useMemo(
    () => GRADE_OPTIONS.find((g) => g.id === gradeId) || GRADE_OPTIONS[0],
    [gradeId]
  );

  const handleProductChange = (newId: string) => {
    setSelectedProductId(newId);
    const next = products.find((p) => p.id === newId);
    if (next) {
      setWidthMeters(next.defaultWidth);
      setHeightMeters(next.defaultHeight);
      if (next.finishes && next.finishes[0]) {
        setFinishId(next.finishes[0].id);
      }
    }
  };

  // Deterministic calculation
  const liveCalc = useMemo(() => {
    if (!selectedProduct) {
      return {
        estimatedWeightKg: 0,
        unitPriceToman: 0,
        totalPriceToman: 0,
        engineeringSummary: '',
      };
    }

    const area = Math.max(1, widthMeters * heightMeters);
    let kgPerSqm = 30;
    if (selectedProduct.categorySlug === 'glass-railings') kgPerSqm = 44;
    else if (selectedProduct.categorySlug === 'smart-facades') kgPerSqm = 52;
    else if (selectedProduct.categorySlug === 'electric-shutters') kgPerSqm = 11.4;
    else kgPerSqm = 30 * selectedGlass.multiplier;

    const estimatedWeightKg = Math.round(area * kgPerSqm * quantity);
    let baseUnit = selectedProduct.basePriceToman;
    let engineeringSummary = '';

    if (selectedProduct.pricingUnit === 'opening') {
      const widthFactor = Math.max(0.85, widthMeters / selectedProduct.defaultWidth);
      const heightFactor = Math.max(0.9, heightMeters / selectedProduct.defaultHeight);
      baseUnit = selectedProduct.basePriceToman * (0.55 + 0.45 * widthFactor * heightFactor);
      engineeringSummary = `اپراتور هوشمند ۲۴ ولت · بازشوی مفید تقریبی ${Math.round(
        widthMeters * 0.55 * 100
      )} سانتی‌متر`;
    } else if (selectedProduct.pricingUnit === 'linear-meter') {
      baseUnit = selectedProduct.basePriceToman * widthMeters * (heightMeters / 1.1);
      const posts = Math.ceil(widthMeters / 0.95) + 1;
      engineeringSummary = `${widthMeters.toFixed(1)} مترطول مسیر · ${posts} نقطه مهار سازه‌ای شیشه لمینت`;
    } else {
      baseUnit = selectedProduct.basePriceToman * area;
      engineeringSummary = `مساحت کل دهانه ${area.toFixed(1)} مترمربع با پوشش استاندارد`;
    }

    const unitPriceToman = Math.round(
      baseUnit * selectedFinish.multiplier * selectedGlass.multiplier * selectedGrade.multiplier
    );
    const totalPriceToman = unitPriceToman * Math.max(1, quantity);

    return {
      estimatedWeightKg,
      unitPriceToman,
      totalPriceToman,
      engineeringSummary,
    };
  }, [
    selectedProduct,
    widthMeters,
    heightMeters,
    selectedFinish,
    selectedGlass,
    selectedGrade,
    quantity,
  ]);

  const handleAddCurrentToQuote = () => {
    if (!selectedProduct) return;
    onAddQuoteItem({
      id: `${selectedProduct.id}-${Date.now()}`,
      productId: selectedProduct.id,
      modelCode: selectedProduct.modelCode,
      name: selectedProduct.name,
      categoryLabel: selectedProduct.categoryLabel,
      finishLabel: selectedFinish.label,
      glassSpec: selectedGlass.label,
      widthMeters,
      heightMeters,
      quantity,
      estimatedWeightKg: liveCalc.estimatedWeightKg,
      estimatedPriceToman: liveCalc.totalPriceToman,
    });
  };

  const effectiveItems: QuoteItem[] = useMemo(() => {
    if (quoteItems.length > 0) return quoteItems;
    if (!selectedProduct) return [];
    return [
      {
        id: 'live-preview',
        productId: selectedProduct.id,
        modelCode: selectedProduct.modelCode,
        name: selectedProduct.name,
        categoryLabel: selectedProduct.categoryLabel,
        finishLabel: selectedFinish.label,
        glassSpec: selectedGlass.label,
        widthMeters,
        heightMeters,
        quantity,
        estimatedWeightKg: liveCalc.estimatedWeightKg,
        estimatedPriceToman: liveCalc.totalPriceToman,
      },
    ];
  }, [
    quoteItems,
    selectedProduct,
    selectedFinish,
    selectedGlass,
    widthMeters,
    heightMeters,
    quantity,
    liveCalc,
  ]);

  const grandTotalToman = effectiveItems.reduce(
    (sum, item) => sum + item.estimatedPriceToman,
    0
  );

  const handleSubmitQuote = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const normName = fullName.trim();
    const normPhone = phone.replace(/[\s-]/g, '');

    if (normName.length < 3) {
      setFormError('لطفاً نام و نام خانوادگی کارفرما یا مهندس ناظر را وارد فرمایید.');
      return;
    }

    if (!/^(\+98|0)?9\d{9}$|^0\d{10}$/.test(normPhone)) {
      setFormError('شماره تماس معتبر نیست. لطفاً شماره موبایل ۱۱ رقمی (مانند 09123456789) وارد نمایید.');
      return;
    }

    setIsSubmitting(true);
    try {
      const summaryNotes = `اقلام پیش‌فاکتور (${effectiveItems.length} سیستم): ` +
        effectiveItems.map(i => `${i.name} [${i.widthMeters}x${i.heightMeters}m x${i.quantity}]`).join(' | ') +
        (notes.trim() ? ` — یادداشت: ${notes.trim()}` : '');

      const res = await strapiApi.createInquiry({
        fullName: normName,
        phone: normPhone,
        city,
        projectType,
        systemInterest: selectedProduct?.name || 'محاسبه‌گر پیش‌فاکتور',
        estimatedPriceToman: grandTotalToman,
        dimensionsNote: `${widthMeters}×${heightMeters} متر`,
        notes: summaryNotes,
      });

      setReceipt({
        trackingCode: res.trackingCode,
        dateLabel: '۱۴۰۵/۰۸/۳۰',
        fullName: normName,
        phone: normPhone,
        city,
        projectType,
        notes: notes.trim(),
        items: effectiveItems,
        totalToman: grandTotalToman,
        source: res.source,
      });
    } catch (err: any) {
      setFormError('خطا در ارسال به سیستم: ' + (err?.message || 'مجدداً تلاش فرمایید.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (receipt) {
    return (
      <div className="max-w-[960px] mx-auto px-5 sm:px-8 py-10 lg:py-14 space-y-8">
        <div className="surface-card-1 rounded-[32px] p-7 sm:p-10 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#006C49] flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                  پیش‌فاکتور استعلام اولیه با مهر السا آماده شد
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  شناسه رهگیری مهندسی:{' '}
                  <span dir="ltr" className="font-tech font-bold text-[#006C49]">
                    {receipt.trackingCode}
                  </span>{' '}
                  <span className="text-[11px] text-slate-400">
                    ({receipt.source === 'strapi' ? 'ثبت‌شده در Strapi Live' : 'ثبت‌شده در مخزن لوکال'})
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => window.print()}
                className="btn-secondary-elessa rounded-full px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>چاپ پیش‌فاکتور</span>
              </button>
              <button
                type="button"
                onClick={() => setReceipt(null)}
                className="btn-primary-elessa rounded-full px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>برآورد جدید</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs sm:text-sm">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-slate-500 text-xs">نام متقاضی</div>
              <div className="font-bold text-slate-900 mt-1">{receipt.fullName}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-slate-500 text-xs">شماره تماس</div>
              <div dir="ltr" className="font-tech font-bold text-slate-900 mt-1 text-right">
                {receipt.phone}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-slate-500 text-xs">موقعیت پروژه</div>
              <div className="font-bold text-slate-900 mt-1">{receipt.city}</div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="text-slate-500 text-xs">نوع کاربری</div>
              <div className="font-bold text-slate-900 mt-1">{receipt.projectType}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 overflow-hidden">
            {receipt.items.map((item, idx) => (
              <div
                key={item.id}
                className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  idx % 2 === 0 ? 'bg-slate-50/70' : 'bg-white'
                }`}
              >
                <div className="space-y-1">
                  <div className="text-xs sm:text-sm font-bold text-slate-900">
                    {item.name}{' '}
                    <span className="font-tech text-xs text-[#006C49] mr-1 font-bold">
                      ({item.modelCode})
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">
                    ابعاد دهانه:{' '}
                    <span dir="ltr" className="font-tech">
                      {item.widthMeters.toFixed(1)} × {item.heightMeters.toFixed(1)} m
                    </span>{' '}
                    · تعداد:{' '}
                    <span className="font-tech">
                      {new Intl.NumberFormat('fa-IR').format(item.quantity)}
                    </span>{' '}
                    · {item.finishLabel} · {item.glassSpec}
                  </div>
                </div>
                <div className="text-sm font-extrabold text-[#0F172A] tabular-nums whitespace-nowrap">
                  {new Intl.NumberFormat('fa-IR').format(item.estimatedPriceToman)} تومان
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-500 leading-6 max-w-md">
              این برآورد به صورت محاسبه مهندسی آنلاین تولید گردیده و قیمت نهایی پس از برداشت لیزری در محل پروژه و تأیید نقشه‌های شاپ‌دراوینگ بدون تغییر تثبیت می‌شود.
            </p>
            <div className="text-left">
              <div className="text-xs text-slate-500">جمع کل برآورد اولیه</div>
              <div className="text-2xl font-extrabold text-[#006C49] tabular-nums">
                {new Intl.NumberFormat('fa-IR').format(receipt.totalToman)} تومان
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-8 lg:py-12 space-y-10">
      <div className="space-y-2.5 max-w-2xl">
        <p className="text-xs font-bold text-[#006C49] uppercase">
          محاسبه‌گر پیش‌فاکتور مهندسی
        </p>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
          برآورد آنلاین هزینه و مشخصات فنی پروژه
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-7">
          ابعاد دهانه یا طول مسیر نرده، ضخامت شیشه و پوشش یراق‌آلات را انتخاب نمایید تا وزن سازه،
          مشخصات موتور و قیمت تخمینی به صورت زنده محاسبه گردد.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Right: Configurator (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="surface-card-1 rounded-[28px] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-[#0F172A]">۰۱. مشخصات فنی سیستم</h2>
              {selectedProduct && (
                <span className="font-tech text-xs font-bold text-[#006C49] bg-emerald-50 px-2.5 py-1 rounded-full">
                  {selectedProduct.modelCode}
                </span>
              )}
            </div>

            {/* Product selection */}
            <label className="block space-y-2">
              <span className="block text-xs font-semibold text-slate-800">
                انتخاب سیستم معماری السا
              </span>
              <select
                value={selectedProductId}
                onChange={(e) => handleProductChange(e.target.value)}
                className="input-elessa w-full px-4 py-3 text-xs sm:text-sm font-medium cursor-pointer"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.modelCode}) — {p.categoryLabel}
                  </option>
                ))}
              </select>
            </label>

            {/* Dimensions */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className="block space-y-1.5">
                <span className="block text-xs font-semibold text-slate-800">
                  {selectedProduct?.pricingUnit === 'linear-meter'
                    ? 'طول مسیر (متر)'
                    : 'عرض دهانه (متر)'}
                </span>
                <input
                  type="number"
                  min={1}
                  max={60}
                  step={0.1}
                  dir="ltr"
                  value={widthMeters}
                  onChange={(e) => setWidthMeters(Math.max(1, Number(e.target.value) || 1))}
                  className="input-elessa w-full px-4 py-2.5 text-xs sm:text-sm font-tech text-left"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="block text-xs font-semibold text-slate-800">ارتفاع (متر)</span>
                <input
                  type="number"
                  min={0.8}
                  max={6}
                  step={0.1}
                  dir="ltr"
                  value={heightMeters}
                  onChange={(e) => setHeightMeters(Math.max(0.8, Number(e.target.value) || 0.8))}
                  className="input-elessa w-full px-4 py-2.5 text-xs sm:text-sm font-tech text-left"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="block text-xs font-semibold text-slate-800">تعداد دهانه / پارت</span>
                <input
                  type="number"
                  min={1}
                  max={50}
                  step={1}
                  dir="ltr"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.round(Number(e.target.value) || 1)))}
                  className="input-elessa w-full px-4 py-2.5 text-xs sm:text-sm font-tech text-left"
                />
              </label>
            </div>

            {/* Glass & Grade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className="block text-xs font-semibold text-slate-800">مشخصات شیشه سازه‌ای</span>
                <select
                  value={glassId}
                  onChange={(e) => setGlassId(e.target.value)}
                  className="input-elessa w-full px-4 py-2.5 text-xs sm:text-sm cursor-pointer"
                >
                  {GLASS_OPTIONS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1.5">
                <span className="block text-xs font-semibold text-slate-800">گرید اپراتور و یراق‌آلات</span>
                <select
                  value={gradeId}
                  onChange={(e) => setGradeId(e.target.value)}
                  className="input-elessa w-full px-4 py-2.5 text-xs sm:text-sm cursor-pointer"
                >
                  {GRADE_OPTIONS.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Finishes */}
            {selectedProduct?.finishes && selectedProduct.finishes.length > 0 && (
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-800">
                  پوشش و رنگ پروفیل‌های آلومینیوم / استیل
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {selectedProduct.finishes.map((f) => {
                    const active = f.id === finishId;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setFinishId(f.id)}
                        className={`p-3 rounded-2xl border text-right space-y-1.5 transition-all cursor-pointer ${
                          active
                            ? 'border-[#10B981] bg-emerald-50/50'
                            : 'border-slate-200 hover:border-slate-300 bg-white'
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className="block w-5 h-5 rounded-full border border-black/15"
                          style={{ backgroundColor: f.swatch }}
                        />
                        <div className="text-xs font-bold text-slate-800 truncate">
                          {f.label}
                        </div>
                        <div dir="ltr" className="text-[10px] font-tech text-slate-500 text-right">
                          {f.code}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Real-time Math Summary Box */}
            <div className="rounded-2xl bg-slate-50 p-5 space-y-4 border border-slate-200/80">
              <div className="text-xs font-semibold text-slate-700">
                {liveCalc.engineeringSummary}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-200">
                <div>
                  <div className="text-[11px] text-slate-500">وزن تخمینی سازه</div>
                  <div dir="ltr" className="text-sm font-tech font-bold text-slate-900 text-right">
                    {new Intl.NumberFormat('fa-IR').format(liveCalc.estimatedWeightKg)} kg
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-500">قیمت پایه هر واحد</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">
                    {new Intl.NumberFormat('fa-IR').format(liveCalc.unitPriceToman)} تومان
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <div className="text-[11px] text-slate-500">برآورد این ردیف</div>
                  <div className="text-base font-extrabold text-[#006C49] tabular-nums">
                    {new Intl.NumberFormat('fa-IR').format(liveCalc.totalPriceToman)} تومان
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddCurrentToQuote}
                className="w-full btn-secondary-elessa rounded-full py-3 px-5 text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#006C49]" />
                <span>افزودن این سیستم به لیست پیش‌فاکتور</span>
              </button>
            </div>
          </div>

          {/* Queued items list */}
          {quoteItems.length > 0 && (
            <div className="surface-card-1 rounded-[28px] p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F172A]">
                  اقلام پیش‌فاکتور ({new Intl.NumberFormat('fa-IR').format(quoteItems.length)})
                </h3>
                <button
                  type="button"
                  onClick={onClearQuoteItems}
                  className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                >
                  پاک کردن همه
                </button>
              </div>

              <div className="divide-y divide-slate-100">
                {quoteItems.map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="min-w-0 space-y-0.5">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {item.name}
                      </div>
                      <div className="text-xs text-slate-500">
                        ابعاد: {item.widthMeters}×{item.heightMeters} m · تعداد {item.quantity} ·{' '}
                        {item.finishLabel}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs sm:text-sm font-bold text-[#006C49] tabular-nums">
                        {new Intl.NumberFormat('fa-IR').format(item.estimatedPriceToman)} تومان
                      </span>
                      <button
                        type="button"
                        onClick={() => onRemoveQuoteItem(item.id)}
                        className="w-7 h-7 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Left: Customer Info Form & Submit to Strapi (5 cols) */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmitQuote}
            className="surface-card-1 rounded-[28px] p-6 sm:p-8 space-y-5 lg:sticky lg:top-24"
          >
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-[#0F172A]">۰۲. ثبت استعلام و صدور پیش‌فاکتور</h2>
              <p className="text-xs text-slate-500">
                مشخصات پروژه را وارد کنید تا پیش‌فاکتور رسمی در دیتابیس Strapi ثبت گردد.
              </p>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-800">
                نام و نام خانوادگی کارفرما یا مشاور *
              </span>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="مثلاً مهندس رامین تهرانی"
                className="input-elessa w-full px-4 py-2.5 text-xs sm:text-sm"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-800">
                شماره موبایل جهت ارسال استعلام *
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

            <div className="grid grid-cols-2 gap-3.5">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-800">شهر پروژه</span>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="تهران"
                  className="input-elessa w-full px-4 py-2.5 text-xs"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-slate-800">نوع ساختمان</span>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="input-elessa w-full px-3 py-2.5 text-xs cursor-pointer"
                >
                  <option value="برج اداری / تجاری">برج اداری / تجاری</option>
                  <option value="ویلا و مسکونی لوکس">ویلا و مسکونی لوکس</option>
                  <option value="گالری و فروشگاه برند">گالری و فروشگاه برند</option>
                  <option value="کلینیک و مرکز درمانی">کلینیک و مرکز درمانی</option>
                </select>
              </label>
            </div>

            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-slate-800">
                توضیحات تکمیلی یا زمان بازدید (اختیاری)
              </span>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="توضیحات در مورد شرایط سقف یا کف و..."
                className="input-elessa w-full px-4 py-2.5 text-xs resize-none"
              />
            </label>

            {formError && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 px-4 py-3 text-xs font-medium text-rose-700">
                {formError}
              </div>
            )}

            <div className="rounded-2xl bg-[#0F172A] text-white p-4 flex items-center justify-between gap-4">
              <div>
                <div className="text-[11px] text-slate-400">
                  جمع کل برآورد ({effectiveItems.length} سیستم)
                </div>
                <div className="text-base sm:text-lg font-extrabold text-[#4EDEA3] tabular-nums">
                  {new Intl.NumberFormat('fa-IR').format(grandTotalToman)} تومان
                </div>
              </div>
              <div className="text-[11px] text-slate-300 text-left">
                شامل نصب و گارانتی ۱۰ ساله
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary-elessa rounded-full py-3.5 text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isSubmitting ? 'در حال صدور و ثبت در Strapi...' : 'صدور پیش‌فاکتور رسمی استعلام'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

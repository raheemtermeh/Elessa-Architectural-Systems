import { useEffect, useState } from 'react';
import { Check, Plus, ShieldCheck, X } from 'lucide-react';
import type { Product, QuoteItem } from '../types/models';
import { ResilientImage } from './ResilientImage';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddConfiguredQuote: (item: QuoteItem) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddConfiguredQuote,
}: ProductDetailModalProps) {
  const [selectedFinishId, setSelectedFinishId] = useState<string>('');
  const [widthMeters, setWidthMeters] = useState<number>(3.2);
  const [heightMeters, setHeightMeters] = useState<number>(2.6);
  const [addedFeedback, setAddedFeedback] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedFinishId(product.finishes[0]?.id || 'anodized-silver');
      setWidthMeters(product.defaultWidth);
      setHeightMeters(product.defaultHeight);
      setAddedFeedback(false);
    }
  }, [product]);

  useEffect(() => {
    if (!product) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [product, onClose]);

  if (!product) return null;

  const selectedFinish =
    product.finishes.find((f) => f.id === selectedFinishId) || product.finishes[0];

  // Calculation
  const area = Math.max(1, widthMeters * heightMeters);
  let kgPerSqm = 30;
  if (product.categorySlug === 'glass-railings') kgPerSqm = 44;
  else if (product.categorySlug === 'smart-facades') kgPerSqm = 52;
  else if (product.categorySlug === 'electric-shutters') kgPerSqm = 11.4;

  const estimatedWeightKg = Math.round(area * kgPerSqm);
  let baseUnit = product.basePriceToman;
  if (product.pricingUnit === 'opening') {
    const widthFactor = Math.max(0.85, widthMeters / product.defaultWidth);
    const heightFactor = Math.max(0.9, heightMeters / product.defaultHeight);
    baseUnit = product.basePriceToman * (0.55 + 0.45 * widthFactor * heightFactor);
  } else if (product.pricingUnit === 'linear-meter') {
    baseUnit = product.basePriceToman * widthMeters * (heightMeters / 1.1);
  } else {
    baseUnit = product.basePriceToman * area;
  }
  const estimatedPriceToman = Math.round(baseUnit * (selectedFinish?.multiplier || 1.0));

  const handleAdd = () => {
    onAddConfiguredQuote({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      modelCode: product.modelCode,
      name: product.name,
      categoryLabel: product.categoryLabel,
      finishLabel: selectedFinish.label,
      glassSpec: 'شیشه استاندارد لمینت / سکوریت',
      widthMeters,
      heightMeters,
      quantity: 1,
      estimatedWeightKg,
      estimatedPriceToman,
    });
    setAddedFeedback(true);
    setTimeout(() => {
      setAddedFeedback(false);
    }, 1800);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F172A]/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl bg-white rounded-[32px] border border-white shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Modal Bar */}
        <div className="px-6 sm:px-8 py-5 border-b border-slate-100 flex items-center justify-between gap-4 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5 min-w-0">
            <span className="font-tech text-xs font-bold text-[#006C49] bg-emerald-50 px-3 py-1 rounded-full">
              {product.modelCode}
            </span>
            <span className="text-xs text-slate-500">{product.categoryLabel}</span>
            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>
            <span className="text-xs text-slate-500 font-tech">{product.standardCode}</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors cursor-pointer shrink-0"
            aria-label="بستن پنجره"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
            {/* Visual + Highlights */}
            <div className="lg:col-span-6 space-y-4">
              <div className="aspect-[16/10] rounded-[24px] overflow-hidden border border-slate-200/70">
                <ResilientImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-4 space-y-2">
                <div className="text-xs font-bold text-[#006C49] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>تضمین فنی و کیفیت مهندسی السا</span>
                </div>
                <p className="text-xs text-slate-700 leading-6">
                  {product.engineeringNote}
                </p>
              </div>
            </div>

            {/* Config & Dimensions */}
            <div className="lg:col-span-6 space-y-5">
              <div className="space-y-2">
                <h2 id="product-detail-title" className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                  {product.name}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-7">{product.summary}</p>
              </div>

              {/* Finishes */}
              {product.finishes && product.finishes.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">پوشش پروفیل:</span>
                    <span className="text-slate-500">
                      {selectedFinish.label} ({selectedFinish.code})
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {product.finishes.map((finish) => {
                      const active = finish.id === selectedFinish.id;
                      return (
                        <button
                          key={finish.id}
                          type="button"
                          onClick={() => setSelectedFinishId(finish.id)}
                          className={`flex items-center gap-2.5 px-3 py-2 rounded-xl border text-right text-xs font-medium transition-all cursor-pointer ${
                            active
                              ? 'border-[#10B981] bg-emerald-50 text-[#006C49]'
                              : 'border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <span
                            aria-hidden="true"
                            className="w-3.5 h-3.5 rounded-full border border-black/15 shrink-0"
                            style={{ backgroundColor: finish.swatch }}
                          />
                          <span className="truncate">{finish.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Dimension Inputs */}
              <div className="rounded-2xl bg-slate-50 p-4 space-y-4 border border-slate-200/80">
                <div className="grid grid-cols-2 gap-3">
                  <label className="space-y-1 text-xs">
                    <span className="block font-semibold text-slate-800">
                      {product.pricingUnit === 'linear-meter' ? 'طول مسیر (متر)' : 'عرض دهانه (متر)'}
                    </span>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      step={0.1}
                      dir="ltr"
                      value={widthMeters}
                      onChange={(e) => setWidthMeters(Math.max(1, Number(e.target.value) || 1))}
                      className="input-elessa w-full px-3 py-2 text-xs font-tech text-left"
                    />
                  </label>
                  <label className="space-y-1 text-xs">
                    <span className="block font-semibold text-slate-800">ارتفاع (متر)</span>
                    <input
                      type="number"
                      min={0.8}
                      max={6}
                      step={0.1}
                      dir="ltr"
                      value={heightMeters}
                      onChange={(e) => setHeightMeters(Math.max(0.8, Number(e.target.value) || 1))}
                      className="input-elessa w-full px-3 py-2 text-xs font-tech text-left"
                    />
                  </label>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <div>
                    <div className="text-[11px] text-slate-500">برآورد تقریبی سیستم</div>
                    <div className="text-base font-extrabold text-[#006C49] tabular-nums">
                      {new Intl.NumberFormat('fa-IR').format(estimatedPriceToman)} تومان
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] text-slate-500">وزن تخمینی</div>
                    <div dir="ltr" className="text-xs font-tech font-bold text-slate-800">
                      {new Intl.NumberFormat('fa-IR').format(estimatedWeightKg)} kg
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAdd}
                  className="w-full btn-primary-elessa rounded-full py-2.5 px-5 text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  {addedFeedback ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>به پیش‌فاکتور افزوده شد</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>افزودن با این ابعاد به پیش‌فاکتور</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Technical Specs Zebra Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#0F172A]">جدول مشخصات فنی و استانداردهای EN / DIN</h3>
              <span className="text-xs text-slate-500">
                گارانتی رسمی: {product.warrantyYears} سال · زمان ساخت {product.leadTimeDays}
              </span>
            </div>

            <div className="rounded-2xl border border-slate-200 overflow-hidden text-xs">
              {product.specs.map((spec, idx) => (
                <div
                  key={spec.label}
                  className={`flex items-center justify-between gap-4 px-5 py-3 ${
                    idx % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                  } ${idx !== product.specs.length - 1 ? 'border-b border-slate-100' : ''}`}
                >
                  <span className="text-slate-700 font-medium">{spec.label}</span>
                  <div dir="ltr" className="font-tech font-bold text-slate-900 shrink-0">
                    <span>{spec.value}</span>
                    {spec.unit && (
                      <span className="ml-1 text-[11px] font-normal text-slate-500">
                        {spec.unit}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

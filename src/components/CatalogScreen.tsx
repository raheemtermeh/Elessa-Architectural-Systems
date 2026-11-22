import { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Filter, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { strapiApi } from '../services/strapi';
import type { Category, Product } from '../types/models';
import { ResilientImage } from './ResilientImage';

interface CatalogScreenProps {
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  onInspectProduct: (product: Product) => void;
  onQuickAddToQuote: (product: Product) => void;
}

export function CatalogScreen({
  selectedCategory,
  onSelectCategory,
  onInspectProduct,
  onQuickAddToQuote,
}: CatalogScreenProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCatalog() {
      setLoading(true);
      try {
        const [cats, prods] = await Promise.all([
          strapiApi.getCategories(),
          strapiApi.getProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (err) {
        console.error('Error loading catalog from Strapi:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCatalog();
  }, []);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCat =
        selectedCategory === 'all' || p.categorySlug === selectedCategory;
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.modelCode.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  const activeCategoryMeta =
    categories.find((c) => c.slug === selectedCategory) || {
      name: 'تمامی سیستم‌های معماری السا',
      shortDesc: 'مجموعه کامل درب‌های اتوماتیک، کرکره‌های برقی، هندریل‌ها و نمای اسپایدر',
    };

  return (
    <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-8 lg:py-12 space-y-10">
      {/* Screen Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <p className="text-xs font-bold text-[#006C49] uppercase">
            کاتالوگ مهندسی و مشخصات فنی
          </p>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            {activeCategoryMeta.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-7">
            {activeCategoryMeta.shortDesc} — مشخصات فنی دقیق، جدول بارگذاری و انتخاب رنگ پروفیل
            برای هر سیستم.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی مدل (مثلاً EL-SL420)..."
            className="input-elessa w-full pr-10 pl-4 py-2.5 text-xs sm:text-sm"
            aria-label="جستجو در محصولات"
          />
        </div>
      </div>

      {/* Category Filter Chips */}
      <div
        role="tablist"
        aria-label="فیلتر دسته‌بندی سیستم‌ها"
        className="flex items-center gap-2.5 overflow-x-auto pb-2"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedCategory === 'all'}
          onClick={() => onSelectCategory('all')}
          className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'chip-active-elessa'
              : 'bg-[#F1F5F9] text-slate-600 hover:bg-slate-200 hover:text-slate-900'
          }`}
        >
          همه سیستم‌ها
        </button>

        {categories.map((category) => {
          const isActive = selectedCategory === category.slug;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onSelectCategory(category.slug)}
              className={`rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'chip-active-elessa'
                  : 'bg-[#F1F5F9] text-slate-600 hover:bg-slate-200 hover:text-slate-900'
              }`}
            >
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200/80 pb-3">
        <span>
          نمایش{' '}
          <strong className="text-[#0F172A] tabular-nums font-tech">
            {new Intl.NumberFormat('fa-IR').format(filteredProducts.length)}
          </strong>{' '}
          سیستم معماری
        </span>
        {(selectedCategory !== 'all' || searchQuery) && (
          <button
            type="button"
            onClick={() => {
              onSelectCategory('all');
              setSearchQuery('');
            }}
            className="text-[#006C49] hover:underline font-bold cursor-pointer"
          >
            پاک کردن فیلترها
          </button>
        )}
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="surface-card-1 rounded-[28px] p-12 text-center space-y-4">
          <p className="text-base font-bold text-[#0F172A]">
            محصولی با مشخصات جستجوشده یافت نشد.
          </p>
          <button
            type="button"
            onClick={() => {
              onSelectCategory('all');
              setSearchQuery('');
            }}
            className="btn-secondary-elessa rounded-full px-6 py-2.5 text-xs font-bold cursor-pointer"
          >
            نمایش تمامی سیستم‌ها
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 lg:gap-8">
          {filteredProducts.map((product) => (
            <article
              key={product.id}
              className="surface-card-2 rounded-[28px] overflow-hidden flex flex-col group"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                <ResilientImage
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <span className="absolute top-3.5 right-3.5 glass-surface rounded-full px-3.5 py-1 text-[11px] font-semibold text-[#0F172A] shadow-sm">
                  {product.categoryLabel}
                </span>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between gap-5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span className="font-tech font-bold text-[#006C49]">
                      {product.modelCode}
                    </span>
                    <span className="truncate">{product.standardCode}</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug">
                    {product.name}
                  </h2>

                  <p className="text-xs text-slate-600 leading-6">{product.summary}</p>

                  <div className="pt-2 space-y-1.5 border-t border-slate-100">
                    {product.specs.slice(0, 2).map((spec) => (
                      <div
                        key={spec.label}
                        className="flex items-center justify-between gap-3 text-xs"
                      >
                        <span className="text-slate-500 truncate">{spec.label}</span>
                        <span
                          dir="ltr"
                          className="font-tech font-semibold text-slate-800 shrink-0"
                        >
                          {spec.value} {spec.unit || ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-3.5">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs text-slate-500">{product.pricingUnitLabel}</span>
                    <span className="text-sm font-extrabold text-[#006C49] tabular-nums">
                      {new Intl.NumberFormat('fa-IR').format(product.basePriceToman)} تومان
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => onInspectProduct(product)}
                      className="btn-secondary-elessa rounded-full px-4 py-2.5 text-xs font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <span>مشخصات فنی</span>
                      <ArrowLeft className="w-3.5 h-3.5 shrink-0" />
                    </button>

                    <button
                      type="button"
                      onClick={() => onQuickAddToQuote(product)}
                      className="btn-primary-elessa rounded-full px-4 py-2.5 text-xs font-bold inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 shrink-0" />
                      <span>افزودن به برآورد</span>
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

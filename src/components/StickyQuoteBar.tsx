import { ArrowLeft, Calculator, Trash2 } from 'lucide-react';
import type { QuoteItem } from '../types/models';

interface StickyQuoteBarProps {
  items: QuoteItem[];
  onOpenEstimator: () => void;
  onClear: () => void;
}

export function StickyQuoteBar({ items, onOpenEstimator, onClear }: StickyQuoteBarProps) {
  if (items.length === 0) return null;

  const totalToman = items.reduce((acc, item) => acc + item.estimatedPriceToman, 0);

  return (
    <div className="fixed bottom-4 inset-x-4 z-30 pointer-events-none">
      <div className="max-w-[960px] mx-auto glass-surface rounded-full px-5 sm:px-6 py-3 flex items-center justify-between gap-4 pointer-events-auto shadow-2xl">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#10B981]/15 text-[#006C49] flex items-center justify-center shrink-0">
            <Calculator className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs sm:text-sm font-bold text-[#0F172A] truncate">
              {new Intl.NumberFormat('fa-IR').format(items.length)} سیستم در لیست پیش‌فاکتور
            </div>
            <div className="text-xs text-slate-600 tabular-nums truncate">
              مجموع تقریبی:{' '}
              <strong className="text-[#006C49] font-bold">
                {new Intl.NumberFormat('fa-IR').format(totalToman)} تومان
              </strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onClear}
            className="w-9 h-9 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="پاک کردن لیست برآورد"
            title="پاک کردن لیست برآورد"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onOpenEstimator}
            className="btn-primary-elessa rounded-full px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-bold inline-flex items-center gap-2 whitespace-nowrap cursor-pointer shadow-md"
          >
            <span>مشاهده پیش‌فاکتور</span>
            <ArrowLeft className="w-4 h-4 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}

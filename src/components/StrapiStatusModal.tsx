import { useState, useEffect } from 'react';
import {
  Activity,
  CheckCircle2,
  Copy,
  Database,
  ExternalLink,
  Layers,
  RefreshCw,
  Server,
  ShieldCheck,
  Terminal,
  X,
} from 'lucide-react';
import { strapiApi, type StrapiStatus } from '../services/strapi';
import type { InquirySubmission } from '../types/models';

interface StrapiStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function StrapiStatusModal({ isOpen, onClose }: StrapiStatusModalProps) {
  const [status, setStatus] = useState<StrapiStatus>(strapiApi.getStatus());
  const [activeTab, setActiveTab] = useState<'status' | 'inquiries' | 'setup' | 'schemas'>('status');
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [inquiries, setInquiries] = useState<InquirySubmission[]>([]);

  useEffect(() => {
    const unsub = strapiApi.subscribe((newStatus) => {
      setStatus(newStatus);
    });
    setInquiries(strapiApi.getLocalInquiries());
    return unsub;
  }, []);

  const handleTestConnection = async () => {
    await strapiApi.checkHealth();
    setInquiries(strapiApi.getLocalInquiries());
  };

  const copySetupCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="strapi-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F172A]/50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl bg-white rounded-[28px] border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F172A] text-white flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#10B981]/20 text-[#4EDEA3] flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 id="strapi-modal-title" className="text-base font-bold flex items-center gap-2">
                <span>مدیریت یکپارچه بک‌اند Strapi</span>
                <span className="text-[10px] font-tech bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                  Strapi v5 / v4 Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                اتصال کلاینت ری‌اکت به سیستم مدیریت محتوای بدون‌سر (Headless CMS)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="بستن پنجره"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-200 bg-slate-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'status'
                ? 'border-[#10B981] text-[#006C49] bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            وضعیت اتصال زنده
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('setup')}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'setup'
                ? 'border-[#10B981] text-[#006C49] bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            دستورات راه‌اندازی بک‌اند
          </button>
          <button
            type="button"
            onClick={() => {
              setInquiries(strapiApi.getLocalInquiries());
              setActiveTab('inquiries');
            }}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'inquiries'
                ? 'border-[#10B981] text-[#006C49] bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            درخواست‌های ثبت‌شده ({inquiries.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schemas')}
            className={`px-4 py-2.5 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'schemas'
                ? 'border-[#10B981] text-[#006C49] bg-white rounded-t-lg'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            اسکیماهای Strapi
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* Status Banner */}
              <div
                className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  status.isConnected
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/80 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      status.isConnected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {status.isConnected ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Activity className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-bold">
                      {status.isConnected
                        ? 'بک‌اند Strapi متصل و آنلاین است (Live API Active)'
                        : 'سیستم در حالت دیتای دینامیک محلی قرار دارد (Fallback Mode)'}
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {status.isConnected
                        ? `پاسخ‌ها مستقیماً از آدرس ${status.apiUrl} دریافت می‌شوند.`
                        : `آدرس ${status.apiUrl} در حال حاضر پاسخ نداد. کلیه داده‌ها و ثبت فرم‌ها به صورت لوکال با استراکچر دقیق Strapi ارائه می‌شود.`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={status.isChecking}
                  className="btn-primary-elessa rounded-full px-4 py-2 text-xs font-bold inline-flex items-center gap-1.5 shrink-0 cursor-pointer disabled:opacity-60"
                >
                  <RefreshCw
                    className={`w-3.5 h-3.5 ${status.isChecking ? 'animate-spin' : ''}`}
                  />
                  <span>تست مجدد اتصال</span>
                </button>
              </div>

              {/* Endpoint Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="text-xs text-slate-500">آدرس سرور Strapi</div>
                  <div dir="ltr" className="font-tech text-xs font-bold text-slate-800 truncate">
                    {status.apiUrl}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="text-xs text-slate-500">منبع فعال دریافت داده‌ها</div>
                  <div className="text-xs font-bold text-[#006C49]">
                    {status.source === 'strapi' ? '🟢 سرور مرکزی Strapi' : '🟡 مخزن داده هوشمند السا'}
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <div className="text-xs text-slate-500">آخرین بررسی اتصال</div>
                  <div dir="ltr" className="font-tech text-xs text-slate-700">
                    {status.lastChecked ? new Date(status.lastChecked).toLocaleTimeString('fa-IR') : '—'}
                  </div>
                </div>
              </div>

              {/* API Endpoints Map */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-800 flex items-center gap-2">
                  <Server className="w-4 h-4 text-[#10B981]" />
                  <span>اندپویت‌های استاندارد متصل در برنامه</span>
                </h3>
                <div className="rounded-2xl border border-slate-200 divide-y divide-slate-100 text-xs font-tech">
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-emerald-700 font-bold">GET /api/products?populate=*</span>
                    <span className="text-slate-500">درب‌های اتوماتیک، کرکره‌ها، هندریل‌ها</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-emerald-700 font-bold">GET /api/categories?populate=*</span>
                    <span className="text-slate-500">دسته‌بندی‌های تخصصی السا</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-emerald-700 font-bold">GET /api/projects?populate=*</span>
                    <span className="text-slate-500">پروژه‌های اجرایی، متراژ، رضایت‌نامه</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-emerald-700 font-bold">GET /api/articles?populate=*</span>
                    <span className="text-slate-500">مقالات تخصصی شیشه سازه‌ای و مهندسی</span>
                  </div>
                  <div className="p-3 flex items-center justify-between">
                    <span className="text-emerald-700 font-bold">POST /api/inquiries</span>
                    <span className="text-slate-500">ثبت پیش‌فاکتور با شناسه رهگیری</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'setup' && (
            <div className="space-y-5 text-sm">
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-[#10B981]" />
                  <span>راه‌اندازی سرور Strapi در کمتر از ۲ دقیقه</span>
                </h3>
                <p className="text-xs text-slate-600 leading-6">
                  پوشه اختصاصی <code className="bg-slate-100 px-1 py-0.5 rounded font-tech text-emerald-800">strapi-backend/</code> با تمام اسکیماها، فایل‌های پیکربندی دیتابیس SQLite و اسکریپت Seed آماده است:
                </p>
              </div>

              <div className="space-y-3 font-tech text-xs">
                <div className="rounded-2xl bg-slate-900 text-slate-100 p-4 relative">
                  <div className="text-slate-400 text-[11px] mb-2 font-sans font-medium">
                    روش ۱: راه‌اندازی مستقیم با Node.js
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap leading-6 text-[#4EDEA3]">
{`cd strapi-backend
npm install
npm run seed     # پر کردن خودکار کلیه محصولات، پروژه‌ها و مقالات السا
npm run develop  # اجرای سرور در پورت http://localhost:1337`}
                  </pre>
                  <button
                    type="button"
                    onClick={() => copySetupCommand('cd strapi-backend && npm install && npm run seed && npm run develop')}
                    className="absolute top-4 left-4 bg-slate-800 hover:bg-slate-700 text-white rounded-lg px-2.5 py-1 text-[11px] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copiedCmd ? 'کپی شد!' : 'کپی دستورات'}</span>
                  </button>
                </div>

                <div className="rounded-2xl bg-slate-900 text-slate-100 p-4">
                  <div className="text-slate-400 text-[11px] mb-2 font-sans font-medium">
                    روش ۲: راه‌اندازی کانتینری با داکر (Docker Compose)
                  </div>
                  <pre className="overflow-x-auto whitespace-pre-wrap leading-6 text-[#4EDEA3]">
{`cd strapi-backend
docker compose up -d`}
                  </pre>
                </div>
              </div>

              <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-xs text-emerald-950 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>دسترسی به پنل مدیریت Strapi:</span>
                </div>
                <p>
                  پس از اجرای سرور، به آدرس <span dir="ltr" className="font-tech font-bold">http://localhost:1337/admin</span> مراجعه کرده و کاربر ادمین خود را بسازید. کلیه داده‌ها در بخش Content Manager قابل ویرایش خواهند بود.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-slate-800">
                  لیست استعلام‌ها و پیش‌فاکتورهای ثبت‌شده
                </h3>
                <span className="text-xs text-slate-500">
                  تعداد: {inquiries.length} مورد
                </span>
              </div>

              {inquiries.length === 0 ? (
                <div className="p-8 text-center rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-500">
                  هنوز استعلامی ثبت نشده است. از طریق بخش محاسبه‌گر یا فرم تماس، اولین درخواست را ثبت نمایید.
                </div>
              ) : (
                <div className="space-y-3">
                  {inquiries.map((inq, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{inq.fullName}</span>
                        <span dir="ltr" className="font-tech text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                          {inq.trackingCode}
                        </span>
                      </div>
                      <div className="text-slate-600 flex flex-wrap gap-x-4 gap-y-1">
                        <span>تماس: <strong dir="ltr">{inq.phone}</strong></span>
                        <span>شهر: <strong>{inq.city}</strong></span>
                        <span>کاربری: <strong>{inq.projectType}</strong></span>
                        {inq.estimatedPriceToman && (
                          <span>برآورد: <strong className="text-emerald-700">{new Intl.NumberFormat('fa-IR').format(inq.estimatedPriceToman)} تومان</strong></span>
                        )}
                      </div>
                      {inq.notes && (
                        <p className="text-slate-500 bg-slate-50 p-2 rounded-lg text-[11px] leading-5">
                          {inq.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'schemas' && (
            <div className="space-y-4 text-xs">
              <p className="text-slate-600 leading-6">
                ساختار جدول‌ها و کالکشن‌های طراحی‌شده برای Strapi در مسیر <code className="bg-slate-100 px-1 py-0.5 rounded font-tech">strapi-backend/src/api/</code> قرار دارند:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-tech">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="font-bold text-emerald-800">api::product</div>
                  <div className="text-[10px] text-slate-500 mt-1">محصولات السا</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="font-bold text-emerald-800">api::category</div>
                  <div className="text-[10px] text-slate-500 mt-1">دسته‌بندی‌ها</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="font-bold text-emerald-800">api::project</div>
                  <div className="text-[10px] text-slate-500 mt-1">پروژه‌های اجرایی</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="font-bold text-emerald-800">api::inquiry</div>
                  <div className="text-[10px] text-slate-500 mt-1">پیش‌فاکتورها</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="font-bold text-emerald-800">api::article</div>
                  <div className="text-[10px] text-slate-500 mt-1">مقالات وبلاگ</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="font-bold text-emerald-800">api::service</div>
                  <div className="text-[10px] text-slate-500 mt-1">خدمات و سیستم‌ها</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="font-bold text-emerald-800">api::faq</div>
                  <div className="text-[10px] text-slate-500 mt-1">سوالات متداول</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div className="font-bold text-emerald-800">api::global-setting</div>
                  <div className="text-[10px] text-slate-500 mt-1">تنظیمات سایت</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500">
            سیستم‌های هوشمند معماری السا · یکپارچه‌سازی Strapi Headless CMS
          </span>
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary-elessa rounded-full px-5 py-2 text-xs font-semibold cursor-pointer"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
}

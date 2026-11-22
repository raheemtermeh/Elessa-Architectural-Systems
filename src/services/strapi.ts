import type {
  Article,
  Category,
  FAQItem,
  GlobalSettings,
  InquirySubmission,
  Product,
  Project,
  ServiceFeature,
  Testimonial,
} from '../types/models';
import {
  SEED_ARTICLES,
  SEED_CATEGORIES,
  SEED_FAQS,
  SEED_GLOBAL_SETTINGS,
  SEED_PRODUCTS,
  SEED_PROJECTS,
  SEED_SERVICES,
  SEED_TESTIMONIALS,
} from '../data/seedData';

export interface StrapiStatus {
  isConnected: boolean;
  isChecking: boolean;
  apiUrl: string;
  source: 'strapi' | 'fallback';
  lastChecked: number | null;
  error?: string | null;
}

const STRAPI_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_STRAPI_URL) ||
  'http://localhost:1337';

const LOCAL_STORAGE_INQUIRIES_KEY = 'elessa_local_inquiries';

// Helper to normalize Strapi v4 / v5 REST responses
function unwrapStrapi<T>(item: any): T {
  if (!item) return item;
  if (item.attributes) {
    return {
      id: String(item.id),
      ...item.attributes,
    } as T;
  }
  return item as T;
}

class StrapiApiService {
  private apiUrl: string = STRAPI_URL;
  private status: StrapiStatus = {
    isConnected: false,
    isChecking: false,
    apiUrl: STRAPI_URL,
    source: 'fallback',
    lastChecked: null,
    error: null,
  };
  private listeners: ((status: StrapiStatus) => void)[] = [];

  constructor() {
    this.checkHealth();
  }

  public getApiUrl(): string {
    return this.apiUrl;
  }

  public setApiUrl(url: string) {
    this.apiUrl = url.replace(/\/$/, '');
    this.status.apiUrl = this.apiUrl;
    this.checkHealth();
  }

  public subscribe(fn: (status: StrapiStatus) => void): () => void {
    this.listeners.push(fn);
    fn(this.status);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== fn);
    };
  }

  private notify() {
    for (const listener of this.listeners) {
      listener({ ...this.status });
    }
  }

  public async checkHealth(): Promise<boolean> {
    this.status.isChecking = true;
    this.notify();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(`${this.apiUrl}/api/products?pagination[pageSize]=1`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        this.status.isConnected = true;
        this.status.source = 'strapi';
        this.status.error = null;
      } else {
        this.status.isConnected = false;
        this.status.source = 'fallback';
        this.status.error = `HTTP ${res.status}: ${res.statusText}`;
      }
    } catch (err: any) {
      this.status.isConnected = false;
      this.status.source = 'fallback';
      this.status.error = err?.message || 'عدم دسترسی به سرور Strapi';
    } finally {
      this.status.isChecking = false;
      this.status.lastChecked = Date.now();
      this.notify();
    }

    return this.status.isConnected;
  }

  public getStatus(): StrapiStatus {
    return { ...this.status };
  }

  // --- Products ---
  public async getProducts(params?: {
    categorySlug?: string;
    searchQuery?: string;
  }): Promise<Product[]> {
    if (this.status.isConnected) {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('populate', '*');
        if (params?.categorySlug && params.categorySlug !== 'all') {
          queryParams.append('filters[categorySlug][$eq]', params.categorySlug);
        }
        if (params?.searchQuery) {
          queryParams.append('filters[name][$containsi]', params.searchQuery);
        }

        const res = await fetch(`${this.apiUrl}/api/products?${queryParams.toString()}`);
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json.data) ? json.data : [];
          return items.map((item: any) => unwrapStrapi<Product>(item));
        }
      } catch (err) {
        console.warn('Strapi getProducts failed, falling back to seed:', err);
      }
    }

    // Dynamic Fallback
    let results = [...SEED_PRODUCTS];
    if (params?.categorySlug && params.categorySlug !== 'all') {
      results = results.filter((p) => p.categorySlug === params.categorySlug);
    }
    if (params?.searchQuery) {
      const q = params.searchQuery.toLowerCase().trim();
      results = results.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.modelCode.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q)
      );
    }
    return results;
  }

  public async getProductBySlug(slug: string): Promise<Product | null> {
    if (this.status.isConnected) {
      try {
        const res = await fetch(
          `${this.apiUrl}/api/products?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
        );
        if (res.ok) {
          const json = await res.json();
          if (json.data && json.data.length > 0) {
            return unwrapStrapi<Product>(json.data[0]);
          }
        }
      } catch (err) {
        console.warn('Strapi getProductBySlug failed, falling back:', err);
      }
    }
    return SEED_PRODUCTS.find((p) => p.slug === slug || p.id === slug) || null;
  }

  // --- Categories ---
  public async getCategories(): Promise<Category[]> {
    if (this.status.isConnected) {
      try {
        const res = await fetch(`${this.apiUrl}/api/categories?populate=*`);
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json.data) ? json.data : [];
          return items.map((item: any) => unwrapStrapi<Category>(item));
        }
      } catch (err) {
        console.warn('Strapi getCategories failed, falling back to seed:', err);
      }
    }
    return SEED_CATEGORIES;
  }

  // --- Projects ---
  public async getProjects(categorySlug?: string): Promise<Project[]> {
    if (this.status.isConnected) {
      try {
        const queryParams = new URLSearchParams();
        queryParams.append('populate', '*');
        if (categorySlug && categorySlug !== 'all') {
          queryParams.append('filters[categorySlug][$eq]', categorySlug);
        }
        const res = await fetch(`${this.apiUrl}/api/projects?${queryParams.toString()}`);
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json.data) ? json.data : [];
          return items.map((item: any) => unwrapStrapi<Project>(item));
        }
      } catch (err) {
        console.warn('Strapi getProjects failed, falling back to seed:', err);
      }
    }

    if (categorySlug && categorySlug !== 'all') {
      return SEED_PROJECTS.filter((p) => p.categorySlug === categorySlug);
    }
    return SEED_PROJECTS;
  }

  // --- Services ---
  public async getServices(): Promise<ServiceFeature[]> {
    if (this.status.isConnected) {
      try {
        const res = await fetch(`${this.apiUrl}/api/services?populate=*`);
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json.data) ? json.data : [];
          return items.map((item: any) => unwrapStrapi<ServiceFeature>(item));
        }
      } catch (err) {
        console.warn('Strapi getServices failed, falling back to seed:', err);
      }
    }
    return SEED_SERVICES;
  }

  // --- Articles ---
  public async getArticles(): Promise<Article[]> {
    if (this.status.isConnected) {
      try {
        const res = await fetch(`${this.apiUrl}/api/articles?populate=*&sort=publishedDate:desc`);
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json.data) ? json.data : [];
          return items.map((item: any) => unwrapStrapi<Article>(item));
        }
      } catch (err) {
        console.warn('Strapi getArticles failed, falling back to seed:', err);
      }
    }
    return SEED_ARTICLES;
  }

  // --- Testimonials ---
  public async getTestimonials(): Promise<Testimonial[]> {
    if (this.status.isConnected) {
      try {
        const res = await fetch(`${this.apiUrl}/api/testimonials?populate=*`);
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json.data) ? json.data : [];
          return items.map((item: any) => unwrapStrapi<Testimonial>(item));
        }
      } catch (err) {
        console.warn('Strapi getTestimonials failed, falling back to seed:', err);
      }
    }
    return SEED_TESTIMONIALS;
  }

  // --- FAQs ---
  public async getFaqs(): Promise<FAQItem[]> {
    if (this.status.isConnected) {
      try {
        const res = await fetch(`${this.apiUrl}/api/faqs`);
        if (res.ok) {
          const json = await res.json();
          const items = Array.isArray(json.data) ? json.data : [];
          return items.map((item: any) => unwrapStrapi<FAQItem>(item));
        }
      } catch (err) {
        console.warn('Strapi getFaqs failed, falling back to seed:', err);
      }
    }
    return SEED_FAQS;
  }

  // --- Global Settings ---
  public async getGlobalSettings(): Promise<GlobalSettings> {
    if (this.status.isConnected) {
      try {
        const res = await fetch(`${this.apiUrl}/api/global-setting?populate=*`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            return unwrapStrapi<GlobalSettings>(json.data);
          }
        }
      } catch (err) {
        console.warn('Strapi getGlobalSettings failed, falling back to seed:', err);
      }
    }
    return SEED_GLOBAL_SETTINGS;
  }

  // --- Create Inquiry (Submit Quote / Contact) ---
  public async createInquiry(
    inquiry: Omit<InquirySubmission, 'id' | 'createdAt' | 'trackingCode' | 'status'>
  ): Promise<{ success: boolean; trackingCode: string; message: string; source: 'strapi' | 'fallback' }> {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `ELS-1405-${randomDigits}`;
    const payload: InquirySubmission = {
      ...inquiry,
      trackingCode,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    if (this.status.isConnected) {
      try {
        const res = await fetch(`${this.apiUrl}/api/inquiries`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ data: payload }),
        });

        if (res.ok) {
          return {
            success: true,
            trackingCode,
            message: 'درخواست استعلام شما با موفقیت در سیستم مرکزی Strapi ثبت گردید.',
            source: 'strapi',
          };
        }
      } catch (err) {
        console.warn('Posting to Strapi failed, using local storage persistence:', err);
      }
    }

    // Local Storage persistence when Strapi is offline
    try {
      const existing = JSON.parse(localStorage.getItem(LOCAL_STORAGE_INQUIRIES_KEY) || '[]');
      existing.unshift(payload);
      localStorage.setItem(LOCAL_STORAGE_INQUIRIES_KEY, JSON.stringify(existing));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }

    return {
      success: true,
      trackingCode,
      message: 'درخواست استعلام شما ثبت و کد رهگیری اختصاصی صادر گردید (ذخیره‌شده در دیتابیس محلی).',
      source: 'fallback',
    };
  }

  public getLocalInquiries(): InquirySubmission[] {
    try {
      return JSON.parse(localStorage.getItem(LOCAL_STORAGE_INQUIRIES_KEY) || '[]');
    } catch {
      return [];
    }
  }
}

export const strapiApi = new StrapiApiService();

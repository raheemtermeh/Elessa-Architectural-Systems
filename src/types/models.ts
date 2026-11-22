export interface StrapiImage {
  id?: number;
  url: string;
  alt?: string;
  name?: string;
}

export interface FinishOption {
  id: string;
  label: string;
  code: string;
  swatch: string;
  multiplier: number;
}

export interface TechnicalSpec {
  label: string;
  value: string;
  unit?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  iconName?: string;
  productCount?: number;
}

export interface Product {
  id: string;
  slug: string;
  modelCode: string;
  name: string;
  shortTitle: string;
  categorySlug: string;
  categoryLabel: string;
  applicationLabels: string[];
  image: string;
  summary: string;
  engineeringNote: string;
  pricingUnit: 'opening' | 'linear-meter' | 'square-meter';
  pricingUnitLabel: string;
  basePriceToman: number;
  defaultWidth: number;
  defaultHeight: number;
  standardCode: string;
  warrantyYears: number;
  leadTimeDays: string;
  highlights: string[];
  specs: TechnicalSpec[];
  finishes: FinishOption[];
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  location: string;
  year: string;
  categorySlug: string;
  categoryLabel: string;
  clientType: string;
  image: string;
  areaOrCount: string;
  deliveryDays: string;
  systemsUsed: string[];
  outcomeMetric: string;
  overview: string;
  engineeringChallenge: string;
  testimonial: {
    quote: string;
    author: string;
    role: string;
    organization: string;
  };
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  authorRole: string;
  readTimeMinutes: number;
  publishedDate: string;
  image: string;
  tags: string[];
}

export interface ServiceFeature {
  id: string;
  title: string;
  categorySlug: string;
  iconType: 'door' | 'shutter' | 'railing' | 'facade';
  headline: string;
  description: string;
  specs: string[];
  linkText: string;
  image: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  organization: string;
  project: string;
  quote: string;
  rating: number;
  avatar?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface GlobalSettings {
  brandNameFa: string;
  brandNameEn: string;
  tagline: string;
  phone1: string;
  phone2: string;
  phoneDisplay: string;
  email: string;
  address: string;
  workingHours: string;
  experienceYears: number;
  completedProjectsCount: number;
  clientSatisfactionRate: number;
  installedAreaSqm: number;
}

export interface InquirySubmission {
  id?: string;
  fullName: string;
  phone: string;
  city: string;
  projectType: string;
  systemInterest: string;
  estimatedPriceToman?: number;
  dimensionsNote?: string;
  notes?: string;
  trackingCode?: string;
  createdAt?: string;
  status?: 'pending' | 'reviewed' | 'contacted';
}

export interface QuoteItem {
  id: string;
  productId: string;
  modelCode: string;
  name: string;
  categoryLabel: string;
  finishLabel: string;
  glassSpec: string;
  widthMeters: number;
  heightMeters: number;
  quantity: number;
  estimatedWeightKg: number;
  estimatedPriceToman: number;
}

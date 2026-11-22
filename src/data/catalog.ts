export type CategoryId =
  | 'all'
  | 'automatic-doors'
  | 'glass-railings'
  | 'smart-facades'
  | 'electric-shutters';

export type ApplicationId = 'all' | 'commercial' | 'corporate' | 'residential' | 'healthcare';

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

export interface ArchitecturalProduct {
  id: string;
  modelCode: string;
  name: string;
  shortTitle: string;
  category: Exclude<CategoryId, 'all'>;
  categoryLabel: string;
  applications: Exclude<ApplicationId, 'all'>[];
  applicationLabel: string;
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

export interface ArchitecturalProject {
  id: string;
  title: string;
  location: string;
  year: string;
  category: Exclude<CategoryId, 'all'>;
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

export const IMAGES = {
  heroEntrance: '/src/assets/images/hero_elessa_entrance_1795077342935.jpg',
  telescopicDoor: '/src/assets/images/product_telescopic_door_1795077320515.jpg',
  glassRailing: '/src/assets/images/product_glass_railing_1795077323050.jpg',
  smartFacade: '/src/assets/images/product_smart_facade_1795077321662.jpg',
  polycarbonateShutter: '/src/assets/images/product_polycarbonate_shutter_1795077328317.jpg',
  towerLobby: '/src/assets/images/project_tower_lobby_1795077322332.jpg',
};

export const CATEGORIES: { id: CategoryId; label: string; shortDesc: string }[] = [
  { id: 'all', label: 'همه سیستم‌ها', shortDesc: 'مجموعه کامل سیستم‌های معماری السا' },
  {
    id: 'automatic-doors',
    label: 'درب اتوماتیک',
    shortDesc: 'اپراتورهای اسلایدینگ، تلسکوپی و هرمتیک با موتور براشلس آلمانی',
  },
  {
    id: 'glass-railings',
    label: 'هندریل اکسپوز و نرده شیشه‌ای',
    shortDesc: 'سیستم‌های دفنی U-Channel، اسپیگات استیل ۳۱۶ و جان‌پناه تراس',
  },
  {
    id: 'smart-facades',
    label: 'نمای هوشمند و سایبان',
    shortDesc: 'سایبان‌های معلق اسپایدر و شیشه‌های سازه‌ای لمینت',
  },
  {
    id: 'electric-shutters',
    label: 'کرکره پلی‌کربنات',
    shortDesc: 'کرکره‌های شفاف ضدضربه با شفافیت ۸۸٪ برای گالری‌ها و ویترین لوکس',
  },
];

export const APPLICATIONS: { id: ApplicationId; label: string }[] = [
  { id: 'all', label: 'همه کاربری‌ها' },
  { id: 'commercial', label: 'تجاری و گالری لوکس' },
  { id: 'corporate', label: 'برج‌های اداری و لابی' },
  { id: 'residential', label: 'ویلا و مسکونی شاخص' },
  { id: 'healthcare', label: 'کلینیک و مراکز درمانی' },
];

export const COMMON_FINISHES: FinishOption[] = [
  { id: 'anodized-silver', label: 'آلومینیوم آنادایز نقره‌ای', code: 'EV1 Natural', swatch: '#CBD5E1', multiplier: 1.0 },
  { id: 'matte-black', label: 'مشکی مات پودری', code: 'RAL 9005', swatch: '#1E293B', multiplier: 1.06 },
  { id: 'champagne-bronze', label: 'شامپاینی برنز', code: 'C32 Bronze', swatch: '#94826B', multiplier: 1.1 },
  { id: 'brushed-ss316', label: 'استیل خش‌دار ۳۱۶', code: 'AISI 316L', swatch: '#94A3B8', multiplier: 1.16 },
];

export const PRODUCTS: ArchitecturalProduct[] = [
  {
    id: 'el-sl420',
    modelCode: 'EL-SL420',
    name: 'درب اتوماتیک اسلایدینگ دو لت سری ۴۲۰',
    shortTitle: 'درب اسلایدینگ دو لت',
    category: 'automatic-doors',
    categoryLabel: 'درب اتوماتیک',
    applications: ['commercial', 'corporate', 'healthcare'],
    applicationLabel: 'تجاری · برج اداری · درمانی',
    image: IMAGES.heroEntrance,
    summary:
      'اپراتور اسلایدینگ خطی فوق‌بی‌صدا با موتور براشلس ۲۴ ولت آلمان، ریل آلومینیومی عایق صوتی و رادار مایکروویو دوگانه.',
    engineeringNote:
      'مناسب ورودی‌های پرتردد با چرخه کاری نامحدود (۱۰۰٪ Duty Cycle) و قابلیت یکپارچه‌سازی با سیستم مدیریت هوشمند ساختمان (BMS).',
    pricingUnit: 'opening',
    pricingUnitLabel: 'هر دهانه استاندارد',
    basePriceToman: 148_000_000,
    defaultWidth: 3.2,
    defaultHeight: 2.6,
    standardCode: 'EN 16005 · DIN 18650',
    warrantyYears: 5,
    leadTimeDays: '۱۰ تا ۱۴ روز کاری',
    highlights: ['تردد نامحدود روزانه', 'باتری بکاپ اضطراری', 'تراز صدا کمتر از ۴۸ دسی‌بل'],
    specs: [
      { label: 'حداکثر وزن هر لنگه متحرک', value: '2 × 160', unit: 'kg' },
      { label: 'عرض بازشوی مفید قابل اجرا', value: '1,100 – 3,000', unit: 'mm' },
      { label: 'ارتفاع پروفیل هد (اپراتور)', value: '108 × 142', unit: 'mm' },
      { label: 'سرعت باز شدن قابل تنظیم', value: '0.4 – 0.9', unit: 'm/s' },
      { label: 'نوع موتور و سیستم انتقال قدرت', value: '24V DC Brushless', unit: 'Dunkermotoren' },
      { label: 'ضخامت شیشه سکوریت / لمینت سازگار', value: '10 – 13.52', unit: 'mm' },
      { label: 'درجه حفاظت و استاندارد ایمنی', value: 'IP42 / EN 16005', unit: 'TÜV' },
      { label: 'توان مصرفی حالت آماده به کار', value: '12', unit: 'W' },
    ],
    finishes: COMMON_FINISHES,
  },
  {
    id: 'el-tl600',
    modelCode: 'EL-TL600',
    name: 'درب اتوماتیک تلسکوپی چهار لت اسلیم',
    shortTitle: 'درب تلسکوپی چهار لت',
    category: 'automatic-doors',
    categoryLabel: 'درب اتوماتیک',
    applications: ['corporate', 'commercial', 'healthcare'],
    applicationLabel: 'لابی اداری · راهرو عریض',
    image: IMAGES.telescopicDoor,
    summary:
      'سیستم چهار لنگه همگام با فریم باریک ۳۲ میلی‌متری برای دستیابی به ۶۶ درصد عرض بازشوی مفید در فضاهای با دهانه محدود.',
    engineeringNote:
      'تسمه دنده‌ای تقویت‌شده با الیاف کولار و غلطک‌های پلی‌اورتان ضدسایش برای حرکت کاملاً هم‌زمان و بدون لرزش در عرض‌های بالا.',
    pricingUnit: 'opening',
    pricingUnitLabel: 'هر دهانه تلسکوپی',
    basePriceToman: 196_000_000,
    defaultWidth: 3.6,
    defaultHeight: 2.7,
    standardCode: 'EN 16005 · ISO 9001',
    warrantyYears: 5,
    leadTimeDays: '۱۴ تا ۱۸ روز کاری',
    highlights: ['۶۶٪ بازشوی مفید دهانه', 'فریم اسلیم ۳۲ میلی‌متری', 'قفل الکترومکانیکی هوشمند'],
    specs: [
      { label: 'حداکثر وزن کل ۴ لنگه متحرک', value: '4 × 110', unit: 'kg' },
      { label: 'عرض بازشوی مفید', value: '1,400 – 4,000', unit: 'mm' },
      { label: 'عرض نمای فریم آلومینیومی', value: '32', unit: 'mm' },
      { label: 'نسبت بازشو به عرض کل دهانه', value: '66.5', unit: '%' },
      { label: 'تعداد چرخه تست شده در آزمایشگاه', value: '2,000,000+', unit: 'Cycles' },
      { label: 'شیشه قابل نصب (دو جداره / لمینت)', value: '10 – 22', unit: 'mm' },
      { label: 'ولتاژ تغذیه و فرکانس', value: '230V AC / 50Hz', unit: '180 W' },
      { label: 'بازه دمای عملکردی', value: '-20 to +55', unit: '°C' },
    ],
    finishes: COMMON_FINISHES,
  },
  {
    id: 'el-uc180',
    modelCode: 'EL-UC180',
    name: 'نرده شیشه‌ای دفنی U-Channel معماری',
    shortTitle: 'هندریل دفنی U-Channel',
    category: 'glass-railings',
    categoryLabel: 'هندریل اکسپوز و نرده شیشه‌ای',
    applications: ['residential', 'corporate', 'commercial'],
    applicationLabel: 'تراس ویلا · وید برج · روف‌گاردن',
    image: IMAGES.glassRailing,
    summary:
      'سیستم جان‌پناه تمام‌شیشه بدون پایه عمودی با پروفیل سنگین آلومینیوم ۶۰۶۳-T6 دفنی و گوه رگلاژ سه‌بعدی دقیق.',
    engineeringNote:
      'مقاومت تاییدشده در برابر بار خطی افقی ۱.۵ تا ۳.۰ کیلونیوتن بر متر، مناسب تراس‌های مرتفع با فشار باد شدید و ویدهای تجاری.',
    pricingUnit: 'linear-meter',
    pricingUnitLabel: 'هر متر طول اجرا',
    basePriceToman: 16_500_000,
    defaultWidth: 8.0,
    defaultHeight: 1.1,
    standardCode: 'DIN 18008-4 · BS 6180',
    warrantyYears: 10,
    leadTimeDays: '۷ تا ۱۰ روز کاری',
    highlights: ['دید ۳۶۰ درجه بدون مانع', 'گوه رگلاژ شاقول از داخل', 'شیشه لمینت سکوریت ضدریزش'],
    specs: [
      { label: 'ضخامت شیشه لمینت سکوریت', value: '16.76 – 21.52', unit: 'mm' },
      { label: 'آلیاژ پروفیل پایه دفنی', value: 'EN AW-6063 T6', unit: 'Extruded' },
      { label: 'تحمل بار افقی خطی (تست سازه‌ای)', value: '1.5 – 3.0', unit: 'kN/m' },
      { label: 'ابعاد مقطع پروفیل U-Channel', value: '68 × 126', unit: 'mm' },
      { label: 'وزن پروفیل آلومینیوم خالص', value: '6.85', unit: 'kg/m' },
      { label: 'محدوده تنظیم زاویه شیشه (گوه)', value: '± 2.5', unit: 'deg' },
      { label: 'نوع لایه میانی شیشه لمینت', value: '1.52 PVB / SGP', unit: 'SentryGlas' },
      { label: 'ارتفاع استاندارد جان‌پناه', value: '1,050 – 1,200', unit: 'mm' },
    ],
    finishes: COMMON_FINISHES,
  },
  {
    id: 'el-ex120',
    modelCode: 'EL-EX120',
    name: 'هندریل شیشه‌ای اکسپوز پایه اسپیگات ۳۱۶',
    shortTitle: 'هندریل اکسپوز اسپیگات',
    category: 'glass-railings',
    categoryLabel: 'هندریل اکسپوز و نرده شیشه‌ای',
    applications: ['residential', 'commercial'],
    applicationLabel: 'پله معلق · محوطه استخر · تراس',
    image: IMAGES.towerLobby,
    summary:
      'پایه‌های یکپارچه ریخته‌گری از فولاد ضدزنگ گرید ۳۱۶ دریایی با نصب روکار بدون نیاز به تخریب کف و زهکشی طبیعی آب باران.',
    engineeringNote:
      'ایده‌آل برای بازسازی تراس‌های تمام‌شده، اطراف استخرهای روباز و پله‌های معلق بتنی و سنگی با حداقل تماس سازه‌ای.',
    pricingUnit: 'linear-meter',
    pricingUnitLabel: 'هر متر طول اجرا',
    basePriceToman: 14_200_000,
    defaultWidth: 6.0,
    defaultHeight: 1.1,
    standardCode: 'AISI 316L · EN 12600',
    warrantyYears: 10,
    leadTimeDays: '۵ تا ۷ روز کاری',
    highlights: ['ضدزنگ کامل گرید ۳۱۶', 'نصب بدون تخریب سنگ کف', 'تخلیه آزاد آب در فضای باز'],
    specs: [
      { label: 'جنس پایه‌های نگهدارنده اکسپوز', value: 'AISI 316L', unit: 'Marine Steel' },
      { label: 'ضخامت شیشه قابل مهار', value: '12 – 17.52', unit: 'mm' },
      { label: 'فاصله آزاد شیشه از کف (زهکشی)', value: '45', unit: 'mm' },
      { label: 'حداکثر فاصله مرکز به مرکز پایه‌ها', value: '950', unit: 'mm' },
      { label: 'نوع انکربولت نصب سازه‌ای', value: 'M10 × 110', unit: 'Hilti HST3' },
      { label: 'مقاومت در برابر خوردگی رطوبتی', value: 'C5-M', unit: 'ISO 9223' },
      { label: 'هندریل فوقانی اختیاری', value: 'Ø 42.4 / 25×21', unit: 'mm Cap' },
      { label: 'بار طراحی استاندارد', value: '1.0 – 1.5', unit: 'kN/m' },
    ],
    finishes: COMMON_FINISHES,
  },
  {
    id: 'el-sp350',
    modelCode: 'EL-SP350',
    name: 'سایبان شیشه‌ای معلق و نمای هوشمند اسپایدر',
    shortTitle: 'سایبان و نمای اسپایدر',
    category: 'smart-facades',
    categoryLabel: 'نمای هوشمند و سایبان',
    applications: ['corporate', 'commercial', 'residential'],
    applicationLabel: 'ورودی برج · نمای شیشه‌ای · هتل',
    image: IMAGES.smartFacade,
    summary:
      'سایبان‌های کنسولی با شیشه لمینت سکوریت دو و سه لایه، مهارکش‌های استیل ضدزنگ ۳۱۶ و اتصالات روتل مفصلی ضدتنش.',
    engineeringNote:
      'طراحی سازه‌ای اختصاصی بر اساس محاسبات بار برف و باد منطقه (مبحث ششم مقررات ملی ساختمان) همراه با دفترچه محاسبات.',
    pricingUnit: 'square-meter',
    pricingUnitLabel: 'هر متر مربع پوشش',
    basePriceToman: 24_800_000,
    defaultWidth: 4.5,
    defaultHeight: 2.0,
    standardCode: 'ASTM E1300 · AISI 316',
    warrantyYears: 10,
    leadTimeDays: '۱۲ تا ۱۸ روز کاری',
    highlights: ['دفترچه محاسبات بار برف و باد', 'اتصالات مفصلی روتل ضدتنش', 'شیشه سوپرکلیر کم‌آهن'],
    specs: [
      { label: 'ترکیب شیشه سازه‌ای سقف', value: '10+10 / 12+12', unit: 'mm Tempered' },
      { label: 'نوع طلق میان‌لایه سازه‌ای', value: '1.52 SGP', unit: 'Structural' },
      { label: 'حداکثر پیش‌آمدگی کنسول (دهانه)', value: '2,400', unit: 'mm' },
      { label: 'قطر میله کششی استیل (Tie-Rod)', value: 'Ø 18 – Ø 24', unit: 'mm SS316' },
      { label: 'ظرفیت تحمل بار برف طراحی‌شده', value: '2.5', unit: 'kN/m²' },
      { label: 'آلیاژ یراق اسپایدر و روتل', value: 'CF8M / 316', unit: 'Investment Cast' },
      { label: 'درزگیر بین جام‌های شیشه', value: 'DowSil 995', unit: 'UV Silicone' },
      { label: 'شیب تخلیه آب پیشنهادی', value: '3 – 5', unit: 'deg' },
    ],
    finishes: COMMON_FINISHES,
  },
  {
    id: 'el-pc90',
    modelCode: 'EL-PC90',
    name: 'کرکره برقی شفاف پلی‌کربنات ضدضربه',
    shortTitle: 'کرکره شفاف پلی‌کربنات',
    category: 'electric-shutters',
    categoryLabel: 'کرکره پلی‌کربنات',
    applications: ['commercial', 'corporate'],
    applicationLabel: 'گالری طلا و ساعت · شوروم خودرو · بانک',
    image: IMAGES.polycarbonateShutter,
    summary:
      'تیغه‌های پلی‌کربنات خالص ماکرولون با پوشش ضد اشعه UV و لوله‌های رابط آلومینیوم آنادایز برای دید کامل ویترین در شب با امنیت بانکی.',
    engineeringNote:
      'ترکیب منحصربه‌فرد شفافیت شیشه‌ای (۸۸٪ عبور نور) با مقاومت ضربه‌ای ۲۵۰ برابر شیشه معمولی و سیستم ضدسقوط پاراشوت.',
    pricingUnit: 'square-meter',
    pricingUnitLabel: 'هر متر مربع دهانه',
    basePriceToman: 12_900_000,
    defaultWidth: 4.0,
    defaultHeight: 3.2,
    standardCode: 'EN 13241 · UV-Shield',
    warrantyYears: 5,
    leadTimeDays: '۷ تا ۱۰ روز کاری',
    highlights: ['عبور نور ۸۸ درصدی ویترین', 'تیغه پلی‌کربنات ضدضربه و UV', 'موتور ساید با UPS و پاراشوت'],
    specs: [
      { label: 'ضخامت تیغه پلی‌کربنات خالص', value: '4.0', unit: 'mm Solid PC' },
      { label: 'ضریب شفافیت و عبور نور', value: '88.0', unit: '%' },
      { label: 'لوله رابط افقی میان تیغه‌ها', value: 'Ø 16 Anodized', unit: 'Al 6063' },
      { label: 'وزن هر متر مربع تیغه مونتاژ شده', value: '11.4', unit: 'kg/m²' },
      { label: 'موتور پیشنهادی (ساید / توبولار)', value: '300 – 600', unit: 'kg Torque' },
      { label: 'کلاس مقاومت ضربه و اشتعال', value: 'B1 Flame', unit: 'DIN 4102' },
      { label: 'پوشش محافظ در برابر زردشدگی', value: 'Dual-Side UV', unit: '10-Yr Rated' },
      { label: 'حداکثر عرض یکپارچه قابل اجرا', value: '7,500', unit: 'mm' },
    ],
    finishes: COMMON_FINISHES,
  },
];

export const PROJECTS: ArchitecturalProject[] = [
  {
    id: 'proj-fereshteh-atrium',
    title: 'برج مسکونی-اداری آتریوم فرشته',
    location: 'تهران، خیابان فرشته',
    year: '۱۴۰۴',
    category: 'glass-railings',
    categoryLabel: 'هندریل شیشه‌ای و درب اتوماتیک',
    clientType: 'توسعه‌دهنده برج لوکس',
    image: IMAGES.towerLobby,
    areaOrCount: '۴۲۰ مترطول هندریل + ۶ دهانه درب',
    deliveryDays: '۲۸ روز کاری',
    systemsUsed: ['EL-UC180 نرده دفنی', 'EL-EX120 هندریل پله', 'EL-SL420 درب لابی'],
    outcomeMetric: 'صفر خطای تراز لیزری در ۴۲۰ مترطول شیشه وید مرکزی',
    overview:
      'طراحی و اجرای یکپارچه نرده‌های شیشه‌ای دفنی پیرامون آتریوم دولایه، پله معلق سنگی لابی و ورودی‌های تمام‌شیشه با اپراتور مخفی در سقف.',
    engineeringChallenge:
      'هماهنگی هم‌زمان گوه رگلاژ شیشه‌های لمینت ۲۱.۵۲ میلی‌متری با شیب پله‌های سنگی معلق بدون هیچ‌گونه پروفیل مزاحم در خط دید.',
    testimonial: {
      quote:
        'دقت خط تراز شیشه‌های آتریوم و سکوت مطلق درب‌های لابی، دقیقاً همان کیفیتی بود که در مدارک اجرایی معماری تعریف کرده بودیم.',
      author: 'مهندس کامران شریفی',
      role: 'مدیر ارشد طراحی معماری',
      organization: 'دفتر مهندسین مشاور فضا و ساختار',
    },
  },
  {
    id: 'proj-aftab-hq',
    title: 'ساختمان مرکزی هلدینگ فنی آفتاب',
    location: 'تهران، بلوار نلسون ماندلا (جردن)',
    year: '۱۴۰۴',
    category: 'automatic-doors',
    categoryLabel: 'درب اتوماتیک تلسکوپی',
    clientType: 'ستاد مرکزی شرکتی',
    image: IMAGES.telescopicDoor,
    areaOrCount: '۸ دهانه تلسکوپی و اسلایدینگ',
    deliveryDays: '۱۶ روز کاری',
    systemsUsed: ['EL-TL600 درب تلسکوپی', 'سیستم کنترل تردد کارت و BMS'],
    outcomeMetric: 'کاهش ۳۴٪ اتلاف انرژی برودتی لابی در ۶ ماه نخست بهره‌برداری',
    overview:
      'جایگزینی ورودی‌های سنتی ساختمان با سیستم تلسکوپی چهار لت فریم‌باریک مشکی مات و اتصال مستقیم به سامانه مدیریت هوشمند ساختمان.',
    engineeringChallenge:
      'تأمین عرض عبور ۲.۴ متری در دهانه ساختمانی ۳.۶ متری بدون تخریب ستون‌های سازه‌ای نمای سنگی موجود.',
    testimonial: {
      quote:
        'از زمان نصب درب‌های تلسکوپی السا، علاوه بر افزایش چشمگیر عرض عبور مراجعین در ساعات اوج، دمای لابی کاملاً پایدار شده است.',
      author: 'مهندس سارا رضاییان',
      role: 'مدیر بهره‌برداری و تأسیسات',
      organization: 'هلدینگ فناوری آفتاب',
    },
  },
  {
    id: 'proj-lavasan-villa',
    title: 'ویلای بتنی مدرن کوهسار',
    location: 'لواسان، شهرک باستی‌هیلز',
    year: '۱۴۰۳',
    category: 'glass-railings',
    categoryLabel: 'نرده شیشه‌ای دفنی',
    clientType: 'مسکونی ویلایی شاخص',
    image: IMAGES.glassRailing,
    areaOrCount: '۱۸۵ مترطول تراس و روف‌گاردن',
    deliveryDays: '۱۱ روز کاری',
    systemsUsed: ['EL-UC180 دفنی با شیشه ۲۰ میل سوپرکلیر'],
    outcomeMetric: 'مقاومت تاییدشده تا سرعت باد ۱۲۰ کیلومتر بر ساعت در ارتفاع',
    overview:
      'اجرای پیوسته جان‌پناه شیشه‌ای بدون قاب دور تراس‌های کنسولی بتنی با هدف حفظ دید مطلق به چشم‌انداز دره و کوهستان.',
    engineeringChallenge:
      'مهار رطوبت و یخ‌بندان زمستانی منطقه کوهستانی از طریق سیستم آب‌بندی چندلایه و تخلیه مخفی در کف پروفیل دفنی.',
    testimonial: {
      quote:
        'پروفیل‌ها کاملاً در سنگ کف محو شده‌اند و شیشه‌های سوپرکلیر هیچ سایه سبزرنگی روی منظره ایجاد نمی‌کنند.',
      author: 'دکتر آرش محسنی',
      role: 'کارفرما و مالک پروژه',
      organization: 'ویلای کوهسار لواسان',
    },
  },
  {
    id: 'proj-parsian-gallery',
    title: 'گالری ساعت و جواهرات پارسیان',
    location: 'تهران، مجتمع تجاری الهیه',
    year: '۱۴۰۴',
    category: 'electric-shutters',
    categoryLabel: 'کرکره شفاف و سایبان اسپایدر',
    clientType: 'خرده‌فروشی لوکس',
    image: IMAGES.polycarbonateShutter,
    areaOrCount: '۴۸ مترمربع کرکره + سایبان ورودی',
    deliveryDays: '۹ روز کاری',
    systemsUsed: ['EL-PC90 کرکره شفاف پلی‌کربنات', 'EL-SP350 سایبان اسپایدر'],
    outcomeMetric: 'نمایش ۲۴ ساعته ویترین با افزایش ۲۸٪ بازدیدکنندگان عصرگاهی',
    overview:
      'ترکیب کرکره امنیتی تمام‌شفاف پلی‌کربنات با ریل‌های مخفی در قاب سنگ و سایبان شیشه‌ای کنسولی با یراق‌آلات استیل ۳۱۶.',
    engineeringChallenge:
      'تلفیق الزامات امنیتی سخت‌گیرانه صنف جواهرات با استاندارد زیبایی‌شناختی ویترین ۲۴ ساعته مجتمع.',
    testimonial: {
      quote:
        'پس از تعطیلی فروشگاه، نورپردازی ویترین مثل روز از پشت کرکره شفاف دیده می‌شود و هم‌زمان بالاترین امنیت را داریم.',
      author: 'امیرحسین کاظمی',
      role: 'مدیر گالری',
      organization: 'گالری ساعت پارسیان',
    },
  },
];

export function formatPersianNumber(num: number): string {
  return new Intl.NumberFormat('fa-IR').format(Math.round(num));
}

export function formatToman(amount: number): string {
  const millions = amount / 1_000_000;
  if (millions >= 1) {
    return `${new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 1 }).format(millions)} میلیون تومان`;
  }
  return `${formatPersianNumber(amount)} تومان`;
}

export function calculateProductEstimate(params: {
  product: ArchitecturalProduct;
  widthMeters: number;
  heightMeters: number;
  finishMultiplier: number;
  glassMultiplier: number;
  gradeMultiplier: number;
  quantity: number;
}): {
  estimatedWeightKg: number;
  unitPriceToman: number;
  totalPriceToman: number;
  engineeringSummary: string;
} {
  const { product, widthMeters, heightMeters, finishMultiplier, glassMultiplier, gradeMultiplier, quantity } =
    params;

  const area = Math.max(1, widthMeters * heightMeters);
  // Approximate glass weight: ~2.5 kg per m² per mm thickness (average 12mm doors, 17.5mm railing, 20mm canopy, 11.4kg/m² shutter)
  let kgPerSqm = 30;
  if (product.category === 'glass-railings') kgPerSqm = 44;
  else if (product.category === 'smart-facades') kgPerSqm = 52;
  else if (product.category === 'electric-shutters') kgPerSqm = 11.4;
  else kgPerSqm = 30 * glassMultiplier;

  const estimatedWeightKg = Math.round(area * kgPerSqm * quantity);

  let baseUnit = product.basePriceToman;
  let engineeringSummary = '';

  if (product.pricingUnit === 'opening') {
    const widthFactor = Math.max(0.85, widthMeters / product.defaultWidth);
    const heightFactor = Math.max(0.9, heightMeters / product.defaultHeight);
    baseUnit = product.basePriceToman * (0.55 + 0.45 * widthFactor * heightFactor);
    const leaves = product.id === 'el-tl600' ? '۴ لت متحرک + ۲ لت ثابت' : '۲ لت متحرک + ۲ لت ثابت';
    engineeringSummary = `${leaves} · بازشوی مفید تقریبی ${Math.round(
      widthMeters * (product.id === 'el-tl600' ? 0.66 : 0.48) * 100
    )} cm`;
  } else if (product.pricingUnit === 'linear-meter') {
    baseUnit = product.basePriceToman * widthMeters * (heightMeters / 1.1);
    const posts = Math.ceil(widthMeters / 0.95) + 1;
    engineeringSummary =
      product.id === 'el-uc180'
        ? `${widthMeters.toFixed(1)} متر طول پروفیل U-Channel دفنی · شیشه لمینت سازه‌ای`
        : `${widthMeters.toFixed(1)} متر طول · ${posts} عدد پایه اسپیگات استیل ۳۱۶`;
  } else {
    baseUnit = product.basePriceToman * area;
    engineeringSummary =
      product.category === 'smart-facades'
        ? `مساحت پوشش ${area.toFixed(1)} m² · شامل مهارکش استیل و روتل مفصلی`
        : `مساحت دهانه ${area.toFixed(1)} m² · موتور ساید به همراه UPS و ریموت کدینگ`;
  }

  const unitPriceToman = Math.round(baseUnit * finishMultiplier * glassMultiplier * gradeMultiplier);
  const totalPriceToman = unitPriceToman * Math.max(1, quantity);

  return {
    estimatedWeightKg,
    unitPriceToman,
    totalPriceToman,
    engineeringSummary,
  };
}

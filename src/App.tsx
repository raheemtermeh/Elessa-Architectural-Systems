import { useState } from 'react';
import type { Article, Product, Project, QuoteItem } from './types/models';
import { Header, type ScreenId } from './components/Header';
import { HomeScreen } from './components/HomeScreen';
import { CatalogScreen } from './components/CatalogScreen';
import { ProjectsScreen } from './components/ProjectsScreen';
import { AboutScreen } from './components/AboutScreen';
import { EstimatorScreen } from './components/EstimatorScreen';
import { BlogScreen } from './components/BlogScreen';
import { ContactScreen } from './components/ContactScreen';
import { ProductDetailModal } from './components/ProductDetailModal';
import { StrapiStatusModal } from './components/StrapiStatusModal';
import { StickyQuoteBar } from './components/StickyQuoteBar';
import { Footer } from './components/Footer';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<ScreenId>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inspectedProduct, setInspectedProduct] = useState<Product | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [isStrapiModalOpen, setIsStrapiModalOpen] = useState(false);

  const handleAddQuoteItem = (item: QuoteItem) => {
    setQuoteItems((prev) => [...prev, item]);
  };

  const handleQuickAddProduct = (product: Product) => {
    const finish = product.finishes && product.finishes[0] ? product.finishes[0] : { label: 'استاندارد', multiplier: 1.0 };
    const area = Math.max(1, product.defaultWidth * product.defaultHeight);
    let kgPerSqm = 30;
    if (product.categorySlug === 'glass-railings') kgPerSqm = 44;
    else if (product.categorySlug === 'smart-facades') kgPerSqm = 52;
    else if (product.categorySlug === 'electric-shutters') kgPerSqm = 11.4;

    const estimatedWeightKg = Math.round(area * kgPerSqm);
    let baseUnit = product.basePriceToman;
    if (product.pricingUnit === 'linear-meter') {
      baseUnit = product.basePriceToman * product.defaultWidth * (product.defaultHeight / 1.1);
    } else if (product.pricingUnit === 'square-meter') {
      baseUnit = product.basePriceToman * area;
    }

    handleAddQuoteItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      modelCode: product.modelCode,
      name: product.name,
      categoryLabel: product.categoryLabel,
      finishLabel: finish.label,
      glassSpec: 'شیشه استاندارد لمینت / سکوریت',
      widthMeters: product.defaultWidth,
      heightMeters: product.defaultHeight,
      quantity: 1,
      estimatedWeightKg,
      estimatedPriceToman: Math.round(baseUnit * finish.multiplier),
    });
  };

  const handleRemoveQuoteItem = (id: string) => {
    setQuoteItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearQuoteItems = () => {
    setQuoteItems([]);
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setActiveScreen('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleArticleSelect = (article: Article) => {
    setSelectedArticle(article);
    setActiveScreen('blog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFCFB] text-[#0F172A]">
      <Header
        activeScreen={activeScreen}
        onNavigate={setActiveScreen}
        quoteCount={quoteItems.length}
        onOpenStrapiModal={() => setIsStrapiModalOpen(true)}
      />

      <main className="flex-1">
        {activeScreen === 'home' && (
          <HomeScreen
            onNavigate={setActiveScreen}
            onSelectCategory={(slug) => {
              setSelectedCategory(slug);
              setActiveScreen('catalog');
            }}
            onInspectProduct={setInspectedProduct}
            onSelectProject={handleProjectSelect}
            onSelectArticle={handleArticleSelect}
          />
        )}

        {activeScreen === 'catalog' && (
          <CatalogScreen
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onInspectProduct={setInspectedProduct}
            onQuickAddToQuote={handleQuickAddProduct}
          />
        )}

        {activeScreen === 'projects' && (
          <ProjectsScreen
            onNavigate={setActiveScreen}
            selectedProjectFromHome={selectedProject}
            onClearSelectedProject={() => setSelectedProject(null)}
          />
        )}

        {activeScreen === 'about' && <AboutScreen onNavigate={setActiveScreen} />}

        {activeScreen === 'estimator' && (
          <EstimatorScreen
            quoteItems={quoteItems}
            onAddQuoteItem={handleAddQuoteItem}
            onRemoveQuoteItem={handleRemoveQuoteItem}
            onClearQuoteItems={handleClearQuoteItems}
          />
        )}

        {activeScreen === 'blog' && (
          <BlogScreen
            onNavigate={setActiveScreen}
            selectedArticleFromHome={selectedArticle}
            onClearSelectedArticle={() => setSelectedArticle(null)}
          />
        )}

        {activeScreen === 'contact' && <ContactScreen />}
      </main>

      <Footer
        onNavigate={setActiveScreen}
        onOpenStrapiModal={() => setIsStrapiModalOpen(true)}
      />

      {activeScreen !== 'estimator' && (
        <StickyQuoteBar
          items={quoteItems}
          onOpenEstimator={() => {
            setActiveScreen('estimator');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onClear={handleClearQuoteItems}
        />
      )}

      <ProductDetailModal
        product={inspectedProduct}
        onClose={() => setInspectedProduct(null)}
        onAddConfiguredQuote={handleAddQuoteItem}
      />

      <StrapiStatusModal
        isOpen={isStrapiModalOpen}
        onClose={() => setIsStrapiModalOpen(false)}
      />
    </div>
  );
}

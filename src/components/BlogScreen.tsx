import { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Calendar, Clock, Search, Tag, User, X } from 'lucide-react';
import { strapiApi } from '../services/strapi';
import type { Article } from '../types/models';
import { ResilientImage } from './ResilientImage';
import type { ScreenId } from './Header';

interface BlogScreenProps {
  onNavigate: (screen: ScreenId) => void;
  selectedArticleFromHome?: Article | null;
  onClearSelectedArticle?: () => void;
}

export function BlogScreen({
  onNavigate,
  selectedArticleFromHome,
  onClearSelectedArticle,
}: BlogScreenProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');

  useEffect(() => {
    strapiApi.getArticles().then(setArticles);
  }, []);

  useEffect(() => {
    if (selectedArticleFromHome) {
      setActiveArticle(selectedArticleFromHome);
    }
  }, [selectedArticleFromHome]);

  const allTags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.tags?.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [articles]);

  const filteredArticles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return articles.filter((a) => {
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      const matchesTag =
        selectedTag === 'all' || a.tags?.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [articles, searchQuery, selectedTag]);

  const handleCloseArticle = () => {
    setActiveArticle(null);
    if (onClearSelectedArticle) onClearSelectedArticle();
  };

  return (
    <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-8 lg:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <p className="text-xs font-bold text-[#006C49] uppercase">
            وبلاگ و مقالات تخصصی
          </p>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            دانشنامه مهندسی شیشه و درب‌های اتوماتیک
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-7">
            مجموعه راهنماهای فنی، استانداردهای بین‌المللی سازه و مقایسه‌های تخصصی برای معماران،
            پیمانکاران و سازندگان.
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در مقالات..."
            className="input-elessa w-full pr-10 pl-4 py-2.5 text-xs sm:text-sm"
          />
        </div>
      </div>

      {/* Tag Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedTag('all')}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            selectedTag === 'all'
              ? 'chip-active-elessa'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          همه مقالات
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setSelectedTag(tag)}
            className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              selectedTag === tag
                ? 'chip-active-elessa'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredArticles.map((art) => (
          <article
            key={art.id}
            className="surface-card-2 rounded-[28px] overflow-hidden flex flex-col group cursor-pointer"
            onClick={() => setActiveArticle(art)}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <ResilientImage
                src={art.image}
                alt={art.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-bold text-slate-800 shadow-sm">
                {art.category}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between gap-5">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-tech">
                    <Calendar className="w-3.5 h-3.5 text-[#10B981]" />
                    {art.publishedDate}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                    {art.readTimeMinutes} دقیقه
                  </span>
                </div>

                <h2 className="text-base sm:text-lg font-bold text-[#0F172A] group-hover:text-[#006C49] transition-colors leading-snug">
                  {art.title}
                </h2>

                <p className="text-xs text-slate-600 line-clamp-3 leading-6">
                  {art.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">{art.author}</span>
                <span className="font-bold text-[#006C49] flex items-center gap-1">
                  <span>مطالعه مقاله</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Full Article Reader Modal */}
      {activeArticle && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="article-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F172A]/50 backdrop-blur-sm overflow-y-auto"
          onClick={handleCloseArticle}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-[32px] border border-white shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] shrink-0">
              <ResilientImage
                src={activeArticle.image}
                alt={activeArticle.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleCloseArticle}
                className="absolute top-4 left-4 w-10 h-10 rounded-full glass-surface text-slate-800 inline-flex items-center justify-center cursor-pointer shadow-md"
                aria-label="بستن پنجره"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="font-bold text-[#006C49] bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    {activeArticle.category}
                  </span>
                  <span>تاریخ: {activeArticle.publishedDate}</span>
                  <span>زمان مطالعه: {activeArticle.readTimeMinutes} دقیقه</span>
                </div>

                <h2 id="article-modal-title" className="text-xl sm:text-2xl font-extrabold text-[#0F172A] leading-snug">
                  {activeArticle.title}
                </h2>

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 border-t border-slate-100">
                  <User className="w-4 h-4 text-[#10B981]" />
                  <span>نویسنده: <strong className="text-slate-800">{activeArticle.author}</strong> ({activeArticle.authorRole})</span>
                </div>
              </div>

              <div className="prose text-xs sm:text-sm text-slate-700 leading-8 whitespace-pre-line">
                {activeArticle.content}
              </div>

              {activeArticle.tags && activeArticle.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-slate-100">
                  <Tag className="w-4 h-4 text-[#10B981]" />
                  {activeArticle.tags.map((t) => (
                    <span key={t} className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      #{t}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseArticle}
                  className="btn-secondary-elessa rounded-full px-5 py-2 text-xs font-bold cursor-pointer"
                >
                  بستن
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseArticle();
                    onNavigate('estimator');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-primary-elessa rounded-full px-5 py-2 text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>استعلام و مشاوره فنی</span>
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

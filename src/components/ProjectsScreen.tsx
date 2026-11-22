import { useEffect, useState, useMemo } from 'react';
import { ArrowLeft, Building2, Calendar, MapPin, X } from 'lucide-react';
import { strapiApi } from '../services/strapi';
import type { Category, Project } from '../types/models';
import { ResilientImage } from './ResilientImage';
import type { ScreenId } from './Header';

interface ProjectsScreenProps {
  onNavigate: (screen: ScreenId) => void;
  selectedProjectFromHome?: Project | null;
  onClearSelectedProject?: () => void;
}

export function ProjectsScreen({
  onNavigate,
  selectedProjectFromHome,
  onClearSelectedProject,
}: ProjectsScreenProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  useEffect(() => {
    async function loadProjects() {
      try {
        const [cats, projs] = await Promise.all([
          strapiApi.getCategories(),
          strapiApi.getProjects(),
        ]);
        setCategories(cats);
        setProjects(projs);
      } catch (err) {
        console.error('Error loading projects:', err);
      }
    }
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectFromHome) {
      setActiveProject(selectedProjectFromHome);
    }
  }, [selectedProjectFromHome]);

  const visibleProjects = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((p) => p.categorySlug === filter);
  }, [projects, filter]);

  const handleCloseModal = () => {
    setActiveProject(null);
    if (onClearSelectedProject) onClearSelectedProject();
  };

  return (
    <div className="max-w-[1320px] mx-auto px-5 sm:px-8 py-8 lg:py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2.5 max-w-2xl">
          <p className="text-xs font-bold text-[#006C49] uppercase">
            نمونه‌کارهای اجرایی السا
          </p>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            پروژه‌های شاخص در مقیاس واقعی
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-7">
            مجموعه ای از پروژه‌های برج‌سازی، دفاتر مرکزی هلدینگ‌ها، گالری‌های طلا و جواهر و
            ویلاهای لوکس که با سیستم‌های مهندسی السا به بهره‌برداری رسیده‌اند.
          </p>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
              filter === 'all'
                ? 'chip-active-elessa'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            همه پروژه‌ها
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setFilter(c.slug)}
              className={`rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                filter === c.slug
                  ? 'chip-active-elessa'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {visibleProjects.map((project) => (
          <article
            key={project.id}
            className="surface-card-2 rounded-[28px] overflow-hidden flex flex-col group cursor-pointer"
            onClick={() => setActiveProject(project)}
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <ResilientImage
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute top-4 right-4 glass-surface rounded-full px-3.5 py-1.5 text-xs font-bold text-[#0F172A] shadow-sm">
                {project.categoryLabel}
              </span>
            </div>

            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between gap-6">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                    <MapPin className="w-3.5 h-3.5 text-[#10B981]" />
                    {project.location}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{project.clientType}</span>
                  <span aria-hidden="true">·</span>
                  <span>سال {project.year}</span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] group-hover:text-[#006C49] transition-colors">
                  {project.title}
                </h2>

                <p className="text-xs sm:text-sm text-slate-600 leading-7">
                  {project.overview}
                </p>

                <div className="pt-2 text-xs sm:text-sm font-bold text-[#006C49]">
                  دستاورد کلیدی: {project.outcomeMetric}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="text-xs text-slate-500">
                  <span className="text-slate-800 font-bold">{project.areaOrCount}</span>
                  <span aria-hidden="true" className="mx-2">
                    ·
                  </span>
                  <span>تحویل در {project.deliveryDays}</span>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveProject(project);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#006C49] hover:text-[#059669] cursor-pointer"
                >
                  <span>پرونده مهندسی</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Case Study Detail Modal */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="project-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F172A]/50 backdrop-blur-sm overflow-y-auto"
          onClick={handleCloseModal}
        >
          <div
            className="w-full max-w-3xl bg-white rounded-[32px] border border-white shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] shrink-0">
              <ResilientImage
                src={activeProject.image}
                alt={activeProject.title}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={handleCloseModal}
                className="absolute top-4 left-4 w-10 h-10 rounded-full glass-surface text-slate-800 inline-flex items-center justify-center cursor-pointer shadow-md"
                aria-label="بستن پنجره"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                  <span className="font-bold text-[#006C49]">
                    {activeProject.categoryLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{activeProject.location}</span>
                  <span aria-hidden="true">·</span>
                  <span>سال {activeProject.year}</span>
                </div>
                <h2 id="project-modal-title" className="text-xl sm:text-2xl font-extrabold text-[#0F172A]">
                  {activeProject.title}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl bg-slate-50 p-4 space-y-1">
                  <div className="text-xs text-slate-500 font-semibold">سیستم‌های نصب‌شده</div>
                  <div className="text-xs sm:text-sm font-bold text-slate-800">
                    {activeProject.systemsUsed.join(' · ')}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 space-y-1">
                  <div className="text-xs text-slate-500 font-semibold">دستاورد اجرایی</div>
                  <div className="text-xs sm:text-sm font-bold text-[#006C49]">
                    {activeProject.outcomeMetric}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xs font-bold text-slate-800 uppercase">چالش و راهکار مهندسی</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-7">
                  {activeProject.engineeringChallenge}
                </p>
              </div>

              {activeProject.testimonial && (
                <div className="rounded-2xl bg-emerald-50/60 border border-emerald-100 p-5 space-y-2">
                  <blockquote className="text-xs sm:text-sm text-slate-800 leading-7">
                    «{activeProject.testimonial.quote}»
                  </blockquote>
                  <div className="text-xs text-slate-600 pt-1">
                    <strong className="text-slate-900">{activeProject.testimonial.author}</strong> —{' '}
                    {activeProject.testimonial.role}، {activeProject.testimonial.organization}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="btn-secondary-elessa rounded-full px-5 py-2.5 text-xs font-bold cursor-pointer"
                >
                  بستن
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleCloseModal();
                    onNavigate('estimator');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="btn-primary-elessa rounded-full px-6 py-2.5 text-xs font-bold inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>استعلام برای پروژه مشابه</span>
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

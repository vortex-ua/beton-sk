import Link from "next/link";
import { MapPin } from "lucide-react";

export default function PortfolioPreview({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-24 bg-white" id="realizacie">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Заголовок и кнопка */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-3">Naše práce</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Ukážky realizácií</h3>
          </div>
          <Link
            href="/realizacie"
            className="inline-flex items-center justify-center px-8 py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-amber-500 transition-colors"
          >
            Zobraziť všetky realizácie
          </Link>
        </div>

        {/* Сетка карточек (максимум 6) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {projects.map((project) => (
            <Link href={`/projekt/${project.slug}`} key={project.id} className="group cursor-pointer">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-5 bg-slate-200 shadow-sm group-hover:shadow-xl transition-shadow duration-500 flex items-center justify-center">
                {project.mainImage ? (
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  /* Если картинки нет, показываем красивую заглушку */
                  <span className="text-slate-400 font-medium text-sm">Bez obrázka</span>
                )}
                <div className="absolute inset-0 bg-black/10 opacity-0 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">{project.category}</span>
                <h4 className="text-2xl font-bold text-slate-900 mt-2 mb-2 group-hover:text-amber-600 transition-colors">{project.title}</h4>
                {project.location && (
                  <div className="flex items-center text-slate-500 text-sm gap-1.5 font-medium">
                    <MapPin size={16} className="text-slate-400" /> {project.location}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
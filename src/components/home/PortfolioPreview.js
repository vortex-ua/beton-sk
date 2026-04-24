import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";

export default function PortfolioPreview({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-32 bg-black text-white overflow-hidden relative border-t border-neutral-900" id="realizacie">
      
      {/* BACKGROUND DECO TEXT */}
      <div className="absolute top-0 left-0 text-[22vw] font-black text-white/[0.02] leading-none select-none pointer-events-none -translate-y-1/4 uppercase">
        Works
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* HEADER - В едином стиле с отзывами */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10 border-l-4 border-red-600 pl-8">
          <div className="max-w-4xl">
            <p className="text-red-600 font-black uppercase tracking-[0.5em] text-[9px] mb-4">Portfólio / Naša stopa v teréne</p>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
              Posledné <br />
              <span className="text-neutral-500">Realizácie</span>
            </h2>
          </div>
          
          <Link 
            href="/realizacie" 
            className="group bg-white text-black hover:bg-red-600 hover:text-white px-10 py-5 rounded-none font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:shadow-none shrink-0"
          >
            Všetky projekty
          </Link>
        </div>

        {/* GRID ПРОЕКТОВ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {projects.slice(0, 6).map((project, idx) => (
            <Link 
              href={`/projekt/${project.slug}`} 
              key={project.id} 
              className="group relative border border-neutral-900 hover:border-red-600/50 transition-all duration-500 overflow-hidden bg-[#0a0a0a]"
            >
              {/* ТЕХНИЧЕСКИЙ ИНДЕКС */}
              <div className="absolute top-6 left-8 z-20 text-[10px] font-mono text-neutral-700 group-hover:text-red-600 transition-colors">
                // PRJ-{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
              </div>

              {/* КНОПКА ПЕРЕХОДА (ВЫЛЕТАЕТ ПРИ ХОВЕРЕ) */}
              <div className="absolute top-6 right-8 z-20 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <ArrowUpRight size={20} className="text-red-600" />
              </div>

              {/* ИЗОБРАЖЕНИЕ */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={project.mainImage}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-100 group-hover:scale-110 opacity-40 group-hover:opacity-100"
                />
                {/* ТЕМНЫЙ ГРАДИЕНТ ДЛЯ ЧИТАЕМОСТИ */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80"></div>
              </div>

              {/* ИНФО О ПРОЕКТЕ */}
              <div className="absolute bottom-0 left-0 w-full p-8 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-[2px] bg-red-600 transform origin-left transition-transform group-hover:scale-x-150"></div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-red-600">
                    {project.category || "Realizácia"}
                  </span>
                </div>
                
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none group-hover:translate-x-2 transition-transform duration-500">
                  {project.title}
                </h4>

                <div className="flex items-center text-neutral-500 text-[10px] font-black uppercase tracking-widest gap-2">
                  <MapPin size={12} className="text-neutral-700 group-hover:text-red-600 transition-colors" />
                  {project.location}
                </div>
              </div>

              {/* ДЕКОРАТИВНЫЙ БАР СНИЗУ */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
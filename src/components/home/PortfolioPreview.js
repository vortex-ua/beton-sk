import Link from "next/link";
import { MapPin, ArrowUpRight } from "lucide-react";

export default function PortfolioPreview({ projects }) {
  if (!projects || projects.length === 0) return null;

  return (
    <section className="py-24 bg-black text-white overflow-hidden relative border-t border-neutral-900" id="realizacie">
      
      {/* BACKGROUND DECO TEXT */}
      <div className="absolute top-0 left-0 text-[18vw] font-black text-white/[0.01] leading-none select-none pointer-events-none -translate-y-1/4 uppercase tracking-tighter">
        Works
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-l-2 border-red-600 pl-8">
          <div className="max-w-4xl">
            <p className="text-red-600 font-black uppercase tracking-[0.4em] text-[10px] mb-4">Portfólio realizácií</p>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">
              Posledné <br />
              <span className="text-neutral-700">Projekty</span>
            </h2>
          </div>
          
          <Link 
            href="/realizacie" 
            className="group bg-white text-black hover:bg-red-600 hover:text-white px-8 py-4 font-black uppercase tracking-widest text-[10px] transition-all duration-300 shrink-0"
          >
            Všetky realizácie
          </Link>
        </div>

        {/* GRID PROJEKTOV - gap-8 pre viac vzduchu */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, 6).map((project, idx) => (
            <Link 
              href={`/projekt/${project.slug}`} 
              key={project.id} 
              className="group relative bg-[#050505] border border-neutral-900 transition-all duration-500 overflow-hidden"
            >
              {/* ТЕХНИЧЕСКИЙ ИНДЕКС */}
              <div className="absolute top-6 left-6 z-20 text-[9px] font-mono text-neutral-800 group-hover:text-red-600 transition-colors uppercase tracking-widest">
                // Ref_{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
              </div>

              {/* КНОПКА ПЕРЕХОДА */}
              <div className="absolute top-6 right-6 z-20 opacity-0 group-hover:opacity-100 transition-all -translate-y-2 group-hover:translate-y-0">
                <ArrowUpRight size={18} className="text-red-600" />
              </div>

              {/* ИЗОБРАЖЕНИЕ */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={project.mainImage}
                  alt={project.title}
                  className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                />
                {/* ТЕМНЫЙ ГРАДИЕНТ - jemnejší pre čistotu */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
              </div>

              {/* ИНФО О ПРОЕКТЕ */}
              <div className="absolute bottom-0 left-0 w-full p-8 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-px bg-red-600"></div>
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-red-600">
                    {project.category || "Realizácia"}
                  </span>
                </div>
                
                <h4 className="text-2xl font-black text-white uppercase tracking-tighter leading-none group-hover:text-red-600 transition-colors">
                  {project.title}
                </h4>

                <div className="flex items-center text-neutral-500 text-[9px] font-black uppercase tracking-widest gap-2 pt-1">
                  <MapPin size={10} className="text-neutral-800 group-hover:text-red-600 transition-colors" />
                  {project.location}
                </div>
              </div>

              {/* ДЕКОРАТИВНЫЙ БАР СНИЗУ */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
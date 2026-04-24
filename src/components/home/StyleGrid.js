import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function StyleGrid({ collections }) {
  if (!collections || collections.length === 0) return null;

  return (
    <section className="py-32 bg-black text-white overflow-hidden relative border-t border-neutral-900" id="kolekcie">
      
      {/* BACKGROUND DECO TEXT */}
      <div className="absolute top-0 right-0 text-[22vw] font-black text-white/[0.02] leading-none select-none pointer-events-none -translate-y-1/4 uppercase">
        Design
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* HEADER - В едином стиле с остальными секциями */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10 border-l-4 border-red-600 pl-8">
          <div className="max-w-4xl">
            <p className="text-red-600 font-black uppercase tracking-[0.5em] text-[9px] mb-4">Katalóg / Estetika a funkčnosť</p>
            <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
              Vyberte si <br />
              <span className="text-neutral-500">Svoj štýl</span>
            </h2>
          </div>
          <p className="text-neutral-500 max-w-xs text-[10px] font-black uppercase tracking-widest leading-relaxed border-l border-neutral-800 pl-6">
            Každá kolekcia definuje charakter vášho priestoru. Od minimalistického modernizmu po naturálne textúry.
          </p>
        </div>

        {/* GRID КОЛЛЕКЦИЙ - Эффект единой плиты (gap-0) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-neutral-900">
          {collections.map((col, idx) => (
            <Link 
              href={`/kolekcia/${col.slug}`} 
              key={col.id} 
              className="group relative border-r border-b border-neutral-900 bg-[#0a0a0a] overflow-hidden aspect-[4/5] transition-all duration-500 hover:border-red-600/50"
            >
              {/* ТЕХНИЧЕСКИЙ ИНДЕКС */}
              <div className="absolute top-8 left-10 z-20 text-[10px] font-mono text-neutral-700 group-hover:text-red-600 transition-colors">
                // TYPE-0{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
              </div>

              {/* СТРЕЛКА (ВЫЛЕТАЕТ) */}
              <div className="absolute top-8 right-10 z-20 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                <ArrowUpRight size={20} className="text-red-600" />
              </div>

              {/* ИЗОБРАЖЕНИЕ С ЭФФЕКТАМИ */}
              <div className="absolute inset-0 overflow-hidden">
                <img
                  src={col.mainImage || "/api/placeholder/800/1000"}
                  alt={col.title}
                  className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-110 opacity-30 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90"></div>
              </div>

              {/* КОНТЕНТ */}
              <div className="absolute inset-0 p-10 flex flex-col justify-end">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-[2px] bg-red-600 transform origin-left transition-transform group-hover:scale-x-150"></div>
                    <span className="text-[9px] font-black text-red-600 uppercase tracking-[0.3em]">
                      Zobraziť detaily
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter leading-none group-hover:translate-x-2 transition-transform duration-500">
                    {col.title}
                  </h3>
                  
                  <p className="text-neutral-500 text-[11px] font-bold uppercase tracking-widest leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    {col.subtitle}
                  </p>
                </div>
              </div>

              {/* ИНДИКАТОР ВЫБОРА СНИЗУ */}
              <div className="absolute bottom-0 left-0 w-0 h-1 bg-red-600 group-hover:w-full transition-all duration-700"></div>
            </Link>
          ))}
        </div>

        {/* FOOTER СЕКЦИИ */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between border-t border-neutral-900 pt-10 gap-6">
            <div className="flex items-center gap-8">
                <div className="flex flex-col">
                    <span className="text-red-600 font-black text-2xl leading-none">15+</span>
                    <span className="text-neutral-600 text-[9px] font-black uppercase tracking-widest mt-1">Rokov praxe</span>
                </div>
                <div className="w-px h-8 bg-neutral-800"></div>
                <div className="flex flex-col">
                    <span className="text-red-600 font-black text-2xl leading-none">100%</span>
                    <span className="text-neutral-600 text-[9px] font-black uppercase tracking-widest mt-1">Slovenský betón</span>
                </div>
            </div>
            <p className="text-neutral-600 text-[9px] font-mono tracking-tighter text-right">
                // VŠETKY PRÁVA VYHRADENÉ. <br />
                // ARCHITEKTONICKÉ RIEŠENIA OPLOTENIA.
            </p>
        </div>
      </div>
    </section>
  );
}
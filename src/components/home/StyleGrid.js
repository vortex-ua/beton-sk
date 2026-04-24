import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function StyleGrid({ collections }) {
  if (!collections || collections.length === 0) return null;

  return (
    <section className="bg-[#0f172a] py-24 px-4 overflow-hidden" id="kolekcie">
      <div className="max-w-7xl mx-auto">
        
        {/* ЗАГОЛОВОК СЕКЦИИ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-1 bg-red-600"></div>
              <span className="text-red-500 font-black uppercase tracking-[0.3em] text-xs">
                Katalóg štýlov
              </span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-none">
              Vyberte si kolekciu <br /> 
              <span className="text-slate-500">podľa vášho domu</span>
            </h2>
          </div>
          <p className="text-slate-400 max-w-sm text-lg font-light leading-relaxed border-l border-slate-800 pl-6">
            Každá kolekcia má vlastný charakter, cenu a špecifický dizajnový smer pre váš projekt.
          </p>
        </div>

        {/* СЕТКА КОЛЛЕКЦИЙ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col) => (
            <Link 
              href={`/kolekcia/${col.slug}`} 
              key={col.id} 
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-slate-800"
            >
              {/* ФОТО С ЭФФЕКТОМ ЗУМА */}
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                <img
                  src={col.mainImage || "/api/placeholder/800/1000"}
                  alt={col.title}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
              </div>

              {/* ГРАДИЕНТНЫЙ СЛОЙ (ТЕНЬ СНИЗУ) */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/20 to-transparent opacity-90 group-hover:via-slate-900/40 transition-all"></div>

              {/* КОНТЕНТ ВНУТРИ КАРТОЧКИ */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded border border-red-500/20">
                      Zobraziť detaily
                    </span>
                  </div>
                  
                  <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-2">
                    {col.title}
                  </h3>
                  
                  <p className="text-slate-300 text-sm font-medium line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {col.subtitle}
                  </p>
                </div>
              </div>

              {/* ИКОНКА В УГЛУ */}
              <div className="absolute top-6 right-6 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/20 -translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <ArrowUpRight size={24} />
              </div>

              {/* ЛИНИЯ-ДЕКОР СНИЗУ */}
              <div className="absolute bottom-0 left-0 h-1 bg-red-600 w-0 group-hover:w-full transition-all duration-700"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
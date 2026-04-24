"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function StyleGrid({ collections }) {
  if (!collections || collections.length === 0) return null;

  return (
    <section className="py-24 bg-white text-black overflow-hidden relative border-t border-black" id="kolekcie">
      
      {/* ТЕХНИЧЕСКАЯ МАРКИРОВКА (SYSTEM INFO) */}
      <div className="absolute top-8 left-6 text-[9px] font-mono text-slate-300 uppercase tracking-[0.5em] select-none pointer-events-none">
        Elite Industrial / Design Catalogue v2.0
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HEADER - Brutalist layout */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-24 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-[2px] bg-red-600"></div>
              <span className="text-black text-[10px] font-black uppercase tracking-[0.5em]">Index_02</span>
            </div>
            <h2 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tighter uppercase leading-[0.75]">
              Vyberte <br /> Svoj Štýl.
            </h2>
          </div>
          
          <div className="md:max-w-[280px] pt-4">
            <p className="text-black text-[11px] font-bold uppercase tracking-widest leading-relaxed border-l-4 border-black pl-8 italic">
              Betónová architektúra v surovom prevedení. Definujeme hranice vášho pozemku s dôrazom na geometriu и statiku.
            </p>
          </div>
        </div>

        {/* GRID КОЛЛЕКЦИЙ - Техно-сетка */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 bg-black gap-px border border-black">
          {collections.map((col, idx) => (
            <Link 
              href={`/kolekcia/${col.slug}`} 
              key={col.id} 
              className="group relative bg-white aspect-[3/4] overflow-hidden"
            >
              {/* ИНДЕКС МОДЕЛИ */}
              <div className="absolute top-8 left-8 z-20">
                <span className="text-[10px] font-black text-black bg-white px-3 py-1 border border-black group-hover:bg-black group-hover:text-white transition-colors duration-500">
                  MOD-0{idx + 1}
                </span>
              </div>

              {/* ИЗОБРАЖЕНИЕ - Grayscale Logic */}
              <div className="absolute inset-0 grayscale group-hover:grayscale-0 transition-all duration-1000 ease-in-out scale-100 group-hover:scale-110 opacity-90 group-hover:opacity-100">
                <img
                  src={col.mainImage || "/api/placeholder/800/1000"}
                  alt={col.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* ТЕКСТОВЫЙ БЛОК - Инженерный выезд */}
              <div className="absolute bottom-0 left-0 w-full p-10 bg-white translate-y-[calc(100%-85px)] group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] border-t border-black">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">
                    {col.title}
                  </h3>
                  <ArrowUpRight size={28} className="text-black group-hover:text-red-600 transition-colors duration-500" />
                </div>
                
                <div className="space-y-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                  <div className="h-px w-full bg-slate-100"></div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                    {col.subtitle || "Technická špecifikácia oplotenia určená pre rezidenčné a priemyselné objekty."}
                  </p>
                  <div className="flex items-center gap-4">
                     <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                     <span className="text-[10px] font-black text-black uppercase tracking-widest">Zobraziť konfiguráciu</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* FOOTER СЕКЦИИ - Data Sheet */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-12 border-b-2 border-black pb-12">
            <div className="flex gap-16">
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Technológia</span>
                  <span className="text-lg font-black uppercase tracking-tighter">Vibroliaty Betón</span>
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">Norma</span>
                  <span className="text-lg font-black uppercase tracking-tighter">STN EN 12839</span>
               </div>
            </div>
            
            <div className="text-right hidden md:block">
               <p className="text-[10px] font-mono text-slate-300 leading-tight uppercase">
                 // System_Check: OK <br />
                 // Visual_Style: Elite_Industrial
               </p>
            </div>
        </div>
      </div>
    </section>
  );
}
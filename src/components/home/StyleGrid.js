"use client";
import Link from "next/link";
import { Check } from "lucide-react";

export default function StyleGrid({ collections }) {
  if (!collections || collections.length === 0) return null;

  return (
    <section className="py-24 bg-[#f8f8f8] font-sans" id="kolekcie">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* NÁDPIS SEKCE */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 uppercase tracking-tighter">
            Vyberte si svoju <span className="text-red-600">kolekciu</span>
          </h2>
          <p className="text-slate-500 text-lg font-medium">
            Každý štýl definuje charakter vášho domova. Od moderných línií po prírodný kameň.
          </p>
        </div>

        {/* GRID KOLEKCIE - Nastavený na 4 stĺpce pre desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {collections.map((col) => (
            <div 
              key={col.id} 
              className="bg-white flex flex-col border border-slate-100 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] group"
            >
              {/* KARTA-IMG */}
              <div className="relative h-64 overflow-hidden">
                <div 
                  className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${col.mainImage || 'uploads/default.webp'})` }}
                ></div>
                {/* Overlay pri hoveri */}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </div>
              
              {/* KARTA-OBSAH */}
              <div className="p-6 md:p-8 flex flex-col flex-1">
                <h3 className="text-xl font-black text-slate-900 mb-3 uppercase tracking-tight">
                  {col.title}
                </h3>
                
                <p className="text-slate-500 mb-6 text-sm leading-relaxed italic">
                  {col.subtitle || "Minimalizmus. Čistá architektúra. Nadčasovosť."}
                </p> 
                
                {/* ZOZNAM VÝHOD */}
                <ul className="space-y-3 mb-8 flex-1">
                  {["Individuálne riešenie", "Dlhá životnosť", "Top kvalita"].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-700">
                      <Check size={14} className="text-red-600" strokeWidth={4} /> {text}
                    </li>
                  ))}
                </ul>
                
                {/* BTN-KOLEKCIA */}
                <Link 
                  href={`/kolekcia/${col.slug}`} 
                  className="inline-block bg-black text-white text-center py-4 px-6 font-black uppercase tracking-widest text-[10px] transition-all hover:bg-red-600 active:scale-95"
                >
                  Zobraziť kolekciu
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
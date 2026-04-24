import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { getContent } from "@/actions/adminActions";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default async function CollectionPage({ params }) {
  const { slug } = await params;

  const collection = await prisma.collection.findUnique({
    where: { slug: slug },
  });

  if (!collection) notFound();

  // ВЫТЯГИВАЕМ ТЕ САМЫЕ ДАННЫЕ ИЗ АДМИНКИ
  const benefitsData = await getContent("global", "vyhody");
  
  // Если данных в БД еще нет, используем твои дефолтные
  const b = benefitsData || {
    b1_title: "Zameranie plotu", b1_val: "ZDARMA",
    b2_title: "Odborné poradenstvo", b2_val: "ZDARMA",
    b3_title: "Cenová kalkulácia", b3_val: "ZDARMA",
    b4_title: "Akciová zľava", b4_val: "-15%"
  };

  return (
    <div className="bg-white lg:h-screen lg:overflow-hidden pt-24 pb-10 selection:bg-red-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col">
        
        {/* Навигация */}
        <Link href="/#kolekcie" className="group inline-flex items-center gap-2 text-[10px] font-black text-slate-400 mb-6 hover:text-red-600 transition-colors tracking-widest">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          SPÄŤ NA KOLEKCIE
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start flex-1">
          
          {/* ЛЕВАЯ ЧАСТЬ: Фото + Динамический блок качества */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative rounded-xl overflow-hidden shadow-lg border border-slate-100 aspect-[4/3] lg:aspect-square">
              <img
                src={collection.mainImage}
                alt={collection.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Štandard kvality - ТЕПЕРЬ ДАННЫЕ ИЗ АДМИНКИ */}
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                <CheckCircle2 size={14} className="text-red-600" /> Štandard kvality
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase font-bold">{b.b1_title}</span>
                  <span className="text-sm font-black text-slate-900 uppercase">{b.b1_val}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-slate-500 uppercase font-bold">{b.b2_title}</span>
                  <span className="text-sm font-black text-red-600 uppercase">{b.b2_val}</span>
                </div>
                <div className="flex flex-col border-t border-slate-200 pt-3">
                  <span className="text-[11px] text-slate-500 uppercase font-bold">{b.b3_title}</span>
                  <span className="text-sm font-black text-red-600 uppercase">{b.b3_val}</span>
                </div>
                <div className="flex flex-col border-t border-slate-200 pt-3">
                  <span className="text-[11px] text-slate-500 uppercase font-bold">{b.b4_title}</span>
                  <span className="text-sm font-black text-white bg-red-600 px-2 py-0.5 rounded w-fit mt-1">
                    {b.b4_val}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: Описание */}
          <div className="lg:col-span-7 flex flex-col h-full justify-center pb-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-[0.9]">
                  {collection.title}
                </h1>
                <p className="text-lg sm:text-xl font-bold text-red-600 uppercase tracking-tight">
                  {collection.subtitle}
                </p>
              </div>

              <div className="h-1 w-16 bg-red-600"></div>

              <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed overflow-hidden">
                <p className="line-clamp-[8] lg:line-clamp-[12] text-lg font-light">
                  {collection.description}
                </p>
              </div>

              <div className="pt-6">
                <Link 
                  href="/#kontakt" 
                  className="inline-flex items-center justify-center bg-slate-900 hover:bg-red-600 text-white px-10 py-5 rounded-xl font-black uppercase tracking-widest text-sm transition-all shadow-xl active:scale-95 w-full sm:w-auto"
                >
                  Mám záujem o realizáciu
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
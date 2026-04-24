import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Benefits from "@/components/shared/Benefits";
import { getContent } from "@/actions/adminActions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function CollectionPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const collection = await prisma.collection.findUnique({
    where: { slug: slug },
  });

  if (!collection) {
    notFound();
  }

  const benefitsData = await getContent("global", "vyhody");

  return (
    <div className="bg-[#f8f9fa] min-h-screen pt-32 pb-32 selection:bg-amber-100 selection:text-amber-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Хлебные крошки / Назад */}
        <Link href="/#kolekcie" className="group inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-900 mb-16 transition-colors">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> 
          Návrat na všetky kolekcie
        </Link>

        {/* Асимметричная сетка: 5 колонок фото, 7 колонок текст */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* ЛЕВАЯ ЧАСТЬ: Изображение (Sticky - прилипает при скролле) */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200/50 group aspect-[4/5] bg-slate-200">
              <img
                src={collection.mainImage}
                alt={collection.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              {/* Легкий градиент снизу для глубины */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          </div>

          {/* ПРАВАЯ ЧАСТЬ: Контент */}
          <div className="lg:col-span-7 flex flex-col pt-4 lg:pt-8">
            
            {/* Заголовки */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-0.5 bg-amber-500 rounded-full"></div>
                <span className="text-amber-600 font-bold tracking-widest uppercase text-xs">
                  Prémiová trieda
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
                {collection.title}
              </h1>
              
              <p className="text-xl sm:text-2xl text-slate-600 font-medium leading-snug">
                {collection.subtitle}
              </p>
            </div>

            {/* Длинный текст */}
            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed whitespace-pre-wrap mb-16">
              {collection.description}
            </div>

            {/* Карточки ZDARMA (Теперь им достаточно места) */}
            <div className="pt-10 border-t border-slate-200">
              <h3 className="text-xl font-bold text-slate-900 mb-2">Prečo si vybrať nás?</h3>
              <p className="text-slate-500 mb-6">Ku každej realizácii získavate tieto benefity automaticky.</p>
              <Benefits dbData={benefitsData || undefined} />
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
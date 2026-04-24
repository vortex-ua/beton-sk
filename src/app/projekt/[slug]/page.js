import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, ShieldCheck, Box } from "lucide-react";
import ProjectGallery from "@/components/portfolio/ProjectGallery";

export default async function ProjectPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const project = await prisma.project.findUnique({
    where: { slug: slug },
  });

  if (!project) notFound();

  return (
    <div className="bg-white min-h-screen pt-32 md:pt-44 pb-24 font-sans text-black">
      <div className="max-w-7xl mx-auto px-6 relative">
        
        {/* ВЕРХНЯЯ НАВИГАЦИЯ */}
        <Link 
          href="/realizacie" 
          className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 hover:text-black mb-16 transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> 
          Späť na zoznam projektov
        </Link>

        {/* ОСНОВНОЙ КОНТЕНТ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 border-t border-black pt-12">
          
          {/* ЛЕВАЯ КОЛОНКА: ЗАГОЛОВОК И ОПИСАНИЕ */}
          <div className="lg:col-span-8 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">
                  // PROJEKT_ID: {project.id.toString().slice(-3).padStart(3, '0')}
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-black tracking-tighter uppercase leading-[0.85] break-words">
                {project.title}
              </h1>
            </div>

            <div className="max-w-3xl">
              <p className="text-xl md:text-2xl text-slate-600 leading-relaxed font-light italic border-l-2 border-black pl-8 whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          </div>

          {/* ПРАВАЯ КОЛОНКА: ТЕХНИЧЕСКИЙ БЛОК */}
          <div className="lg:col-span-4">
            <div className="bg-slate-50 p-8 border border-black space-y-10 shadow-[10px_10px_0px_0px_rgba(0,0,0,0.03)]">
              <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 border-b border-slate-200 pb-4">
                Technické údaje
              </h3>
              
              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <MapPin className="text-red-600 shrink-0" size={20} />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Lokalita</p>
                    <p className="font-bold uppercase text-sm">{project.location || "Slovensko"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Box className="text-red-600 shrink-0" size={20} />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Kategória</p>
                    <p className="font-bold uppercase text-sm">{project.category || "Oplotenie"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Calendar className="text-red-600 shrink-0" size={20} />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Dátum</p>
                    <p className="font-bold uppercase text-sm">
                      {project.createdAt ? new Date(project.createdAt).toLocaleDateString('sk-SK') : "2024"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <ShieldCheck className="text-red-600 shrink-0" size={20} />
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Záruka</p>
                    <p className="font-bold uppercase text-sm">10 ROKOV</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <div className="bg-black text-white p-4 text-center text-[10px] font-black uppercase tracking-widest">
                  Certifikovaná kvalita
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ГАЛЕРЕЯ */}
        <div className="mt-24 border-t-4 border-black pt-16 relative">
          <div className="absolute top-0 right-0 bg-black text-white text-[10px] font-black px-6 py-2 uppercase tracking-[0.4em] -translate-y-full">
            Dokumentácia
          </div>
          
          <div className="space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
               <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Galéria realizácie</h2>
            </div>
            
            <ProjectGallery images={project.images} title={project.title} />
          </div>
        </div>

        {/* ФУТЕР */}
        <div className="mt-32 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between gap-8 items-center">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">
              Elite Industrial Design System — All rights reserved
            </p>
            <Link 
              href="/kontakt" 
              className="px-12 py-6 bg-red-600 text-white font-black uppercase text-[11px] tracking-[0.3em] hover:bg-black transition-all"
            >
              Cenová ponuka
            </Link>
        </div>
      </div>
    </div>
  );
}
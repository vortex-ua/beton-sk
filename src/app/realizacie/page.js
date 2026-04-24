import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Portfólio Realizácií | Elite Industrial",
  description: "Technická dokumentácia našich dokončených projektov betónových oplotení.",
};

export default async function PortfolioPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-white min-h-screen pt-44 pb-32 font-sans text-black">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER SEKCE */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10 border-l-4 border-red-600 pl-8">
          <div className="max-w-3xl">
            <p className="text-red-600 font-black uppercase tracking-[0.5em] text-[10px] mb-4">
              Archív_Projektov / 2020 - 2026
            </p>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
              Naša stopa <br />
              <span className="text-slate-300">v teréne</span>
            </h1>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-mono text-slate-400 uppercase leading-relaxed">
              // Total_Projects: {projects.length} <br />
              // Status: Operational <br />
              // Quality_Check: Passed
            </p>
          </div>
        </div>

        {/* GRID REALIZÁCIÍ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {projects.map((project, idx) => (
            <Link
              href={`/projekt/${project.slug}`}
              key={project.id}
              className="group flex flex-col bg-white border border-slate-100 hover:border-black transition-all duration-500 shadow-sm hover:shadow-2xl"
            >
              {/* IMAGE CONTAINER */}
              <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 border-b border-slate-100">
                {project.mainImage ? (
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-[transform,filter] duration-300 ease-in-out group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-slate-300">
                    Image_Not_Found
                  </div>
                )}

                {/* ID MARKER */}
                <div className="absolute top-0 right-0 bg-black text-white text-[9px] font-mono px-3 py-1">
                  PRJ_{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </div>
              </div>

              {/* CONTENT AREA */}
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-[2px] bg-red-600"></div>
                  <span className="text-[10px] font-black text-red-600 uppercase tracking-widest">
                    {project.category}
                  </span>
                </div>

                <h4 className="text-2xl font-black text-black uppercase tracking-tighter leading-tight mb-6 group-hover:text-red-600 transition-colors duration-300">
                  {project.title}
                </h4>

                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  {project.location && (
                    <div className="flex items-center text-slate-400 text-[10px] font-black uppercase tracking-widest gap-2">
                      <MapPin size={12} className="text-red-600" />
                      {project.location}
                    </div>
                  )}
                  <ArrowRight size={18} className="text-slate-200 group-hover:text-black group-hover:translate-x-2 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* BOTTOM DECO */}
        <div className="mt-32 pt-12 border-t border-black flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-300">End_of_Catalogue</span>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-2 h-2 bg-red-600"></div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
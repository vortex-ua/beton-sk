import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin } from "lucide-react";

export default async function ProjectPage({ params }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const project = await prisma.project.findUnique({
    where: { slug: slug },
  });

  if (!project) notFound();

  return (
    <div className="bg-white min-h-screen pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/realizacie" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-900 mb-12 transition-colors group">
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Späť na realizácie
        </Link>

        {/* Шапка проекта */}
        <div className="mb-12">
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm font-bold uppercase tracking-widest">
            <span className="text-amber-500">{project.category}</span>
            {project.location && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-500 flex items-center gap-1"><MapPin size={16}/> {project.location}</span>
              </>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 tracking-tight">
            {project.title}
          </h1>
          <div className="prose prose-lg text-slate-600 max-w-none leading-relaxed whitespace-pre-wrap">
            {project.description}
          </div>
        </div>

        {/* Галерея */}
        {project.images && project.images.length > 0 && (
          <div className="mt-16 pt-16 border-t border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Galéria projektu</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Главное фото тоже добавляем в галерею первым */}
              <div className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
                <img src={project.mainImage} alt="Main" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
              </div>
              {/* Остальные фото */}
              {project.images.map((imgUrl, index) => (
                <div key={index} className="aspect-square rounded-2xl overflow-hidden bg-slate-100">
                  <img src={imgUrl} alt={`${project.title} - foto ${index + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
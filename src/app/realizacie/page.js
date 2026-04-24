import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MapPin } from "lucide-react";

export const metadata = {
  title: "Naše realizácie | Betónové Ploty",
  description: "Pozrite si naše najnovšie realizácie betónových plotov.",
};

export default async function PortfolioPage() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Všetky realizácie</h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto">
            Prezrite si našu prácu. Každý projekt je pre nás vizitkou kvality a precíznosti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {projects.map((project) => (
            <Link href={`/projekt/${project.slug}`} key={project.id} className="group cursor-pointer">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden mb-5 bg-slate-200 shadow-sm group-hover:shadow-xl transition-shadow duration-500">
                {project.mainImage ? (
                  <img
                    src={project.mainImage}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-200 text-slate-400 font-medium text-sm">
                    Bez obrázka
                  </div>
                )}
              </div>
              <div>
                <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">{project.category}</span>
                <h4 className="text-2xl font-bold text-slate-900 mt-2 mb-2 group-hover:text-amber-600 transition-colors">{project.title}</h4>
                {project.location && (
                  <div className="flex items-center text-slate-500 text-sm gap-1.5 font-medium">
                    <MapPin size={16} /> {project.location}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
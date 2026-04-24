import About from "@/components/home/About";
import Services from "@/components/home/Services";
import Reviews from "@/components/home/Reviews";
import EditorHeader from "@/components/admin/EditorHeader";
import { getContent } from "@/actions/adminActions";
import { prisma } from "@/lib/prisma";
import Benefits from "@/components/shared/Benefits";
export const dynamic = 'force-dynamic';
export default async function EditorPage() {
  // 1. ПОЛУЧАЕМ ДАННЫЕ БЕЗ ДУБЛИКАТОВ
  const collections = await prisma.collection.findMany({ orderBy: { id: 'asc' } });
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });

  // 2. Получаем данные для всех текстовых секций
  const aboutData = await getContent("domov", "domov-o-nas");
  const servicesData = await getContent("domov", "domov-sluzby");
  const reviewsData = await getContent("domov", "domov-recenzie");
  const benefitsData = await getContent("global", "vyhody");

  return (
    <div className="min-h-screen bg-slate-50 pb-20 flex flex-col">
      <EditorHeader title="Domovská stránka" />

      <div className="max-w-7xl mx-auto px-4 mt-12 space-y-20 w-full">

        {/* СЕКЦИЯ 1: КОЛЛЕКЦИИ */}
        <div id="kolekcie" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Kolekcie (Štýly)</h2>
              <p className="text-slate-500">Správa štýlov plotov na hlavnej stránke</p>
            </div>
            <a
              href="/admin/collections/new"
              className="px-6 py-3 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-500/30 flex items-center gap-2"
            >
              + Pridať novú kolekciu
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {collections.map((col) => (
              <div key={col.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-slate-200 bg-cover bg-center" style={{ backgroundImage: col.mainImage ? `url('${col.mainImage}')` : 'none' }}></div>
                  <div>
                    <h4 className="font-bold text-slate-900">{col.title}</h4>
                    <p className="text-xs text-slate-400">/{col.slug}</p>
                  </div>
                </div>
                <a
                  href={`/admin/collections/${col.id}`}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-amber-600 transition-colors"
                >
                  Upraviť
                </a>
              </div>
            ))}
          </div>
        </div>


        {/* 3. СЕКЦИЯ: ГЛОБАЛЬНЫЕ ПРЕИМУЩЕСТВА */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-black text-slate-900 mb-2">Globálne výhody</h2>
          <p className="text-slate-500 mb-8">Tieto údaje sa zobrazujú automaticky pri každom detaile plotu.</p>
          <Benefits editMode={true} dbData={benefitsData || undefined} />
        </div>

        {/* СЕКЦИЯ 2: ПОРТФОЛИО (REALIZÁCIE) - ДОБАВЛЕНО СЮДА */}
        <div id="realizacie" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Portfólio (Realizácie)</h2>
              <p className="text-slate-500">Správa hotových projektov na hlavnej stránke</p>
            </div>
            <a
              href="/admin/projects/new"
              className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30 flex items-center gap-2"
            >
              + Pridať realizáciu
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.length === 0 ? (
              <p className="text-slate-400 italic">Zatiaľ žiadne realizácie. Pridajte prvý projekt.</p>
            ) : (
              projects.map((proj) => (
                <div key={proj.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-lg bg-slate-200 bg-cover bg-center" style={{ backgroundImage: proj.mainImage ? `url('${proj.mainImage}')` : 'none' }}></div>
                    <div>
                      <h4 className="font-bold text-slate-900">{proj.title}</h4>
                      <p className="text-xs text-slate-400">{proj.category} • {proj.location}</p>
                    </div>
                  </div>
                  <a
                    href={`/admin/projects/${proj.id}`}
                    className="px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-green-600 transition-colors"
                  >
                    Upraviť
                  </a>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ОСТАЛЬНЫЕ СЕКЦИИ */}
        <About editMode={true} dbData={aboutData || undefined} />
        <Services editMode={true} dbData={servicesData || undefined} />
        <Reviews editMode={true} dbData={reviewsData || undefined} />
      </div>
    </div>
  );
}
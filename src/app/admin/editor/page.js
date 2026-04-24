import { prisma } from "@/lib/prisma";
import About from "@/components/home/About";
import Services from "@/components/home/Services";
import Reviews from "@/components/home/Reviews";
import EditorHeader from "@/components/admin/EditorHeader";
import { getContent } from "@/actions/adminActions";
import { getReviewsAction } from "@/actions/reviewActions"; // Pridané pre recenzie
import Benefits from "@/components/shared/Benefits";
import DeleteAllCollectionsBtn from "@/components/admin/DeleteAllCollectionsBtn";
import FooterEditor from "@/components/admin/FooterEditor";
export const dynamic = 'force-dynamic';

export default async function EditorPage() {
  // 1. DATA FETCHING
  const footerData = await getContent("global", "footer");
  const collections = await prisma.collection.findMany({ orderBy: { id: 'asc' } });
  const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
  const approvedReviews = await getReviewsAction(); // Načítame schválené recenzie

  // 2. TEXTOVÉ SEKCIE
  const aboutData = await getContent("domov", "domov-o-nas");
  const servicesData = await getContent("domov", "domov-sluzby");
  const reviewsData = await getContent("domov", "domov-recenzie");
  const benefitsData = await getContent("global", "vyhody");

  return (
    <div className="min-h-screen bg-[#F2F2F2] pb-40 flex flex-col font-sans text-black">
      <EditorHeader title="INDUSTRIAL EDITOR" />

      <div className="max-w-7xl mx-auto px-6 mt-12 space-y-20 w-full">

        {/* --- SEKCIA: KOLEKCIE --- */}
        <div id="kolekcie" className="bg-white border border-black p-0 shadow-xl">
          <div className="p-8 border-b border-black flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Kolekcie Plotov</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">// Správa katalógu na hlavnej stránke</p>
            </div>

            <div className="flex items-center gap-3">
              <DeleteAllCollectionsBtn />
              <a
                href="/admin/collections/new"
                className="px-8 py-4 bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 transition-colors"
              >
                + Pridať novú kolekciu
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black border-t border-black">
            {collections.map((col) => (
              <div key={col.id} className="bg-white p-6 flex items-center justify-between group transition-colors hover:bg-slate-50">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 grayscale bg-cover bg-center border border-slate-100" style={{ backgroundImage: col.mainImage ? `url('${col.mainImage}')` : 'none' }}></div>
                  <div>
                    <h4 className="font-black text-black uppercase text-xs tracking-tight">{col.title}</h4>
                    <p className="text-[9px] text-slate-400 font-mono mt-1">ID: {col.slug}</p>
                  </div>
                </div>
                <a
                  href={`/admin/collections/${col.id}`}
                  className="px-4 py-2 border border-black text-black text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  Edit
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* --- SEKCIA: REALIZÁCIE --- */}
        <div id="realizacie" className="bg-white border border-black p-0 shadow-xl">
          <div className="p-8 border-b border-black flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Portfólio Realizácií</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">// Posledné dokončené projekty</p>
            </div>
            <a
              href="/admin/projects/new"
              className="px-8 py-4 bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 transition-colors"
            >
              + Pridať realizáciu
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-black">
            {projects.map((proj) => (
              <div key={proj.id} className="bg-white p-6 flex items-center justify-between group hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 grayscale bg-cover bg-center border border-slate-100" style={{ backgroundImage: proj.mainImage ? `url('${proj.mainImage}')` : 'none' }}></div>
                  <div>
                    <h4 className="font-black text-black uppercase text-xs tracking-tight">{proj.title}</h4>
                    <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-1">{proj.location}</p>
                  </div>
                </div>
                <a
                  href={`/admin/projects/${proj.id}`}
                  className="px-4 py-2 border border-black text-black text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
                >
                  Edit
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* --- SEKCIA: RECENZIE (MODERÁCIA A PRIDÁVANIE) --- */}
        <div id="recenzie-admin" className="bg-white border border-black p-0 shadow-xl">
          <div className="p-8 border-b border-black flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Recenzie Klientov</h2>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">// Spravujte ohlasy a pridávajte nové</p>
            </div>
            <div className="flex gap-4">
              <a
                href="/admin/reviews"
                className="px-8 py-4 border border-black text-black font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-colors"
              >
                Moderovať (Pending)
              </a>
              <a
                href="/admin/reviews/new"
                className="px-8 py-4 bg-black text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-600 transition-colors"
              >
                + Pridať recenziu
              </a>
            </div>
          </div>
          {/* Tu sa zobrazuje vizuálny editor textov v sekcii recenzií */}
          <Reviews editMode={true} dbData={reviewsData || undefined} approvedReviews={approvedReviews} />
        </div>

        {/* --- SEKCIA: VÝHODY --- */}
        <div className="bg-white border border-black p-8 shadow-xl">
          <div className="mb-10 border-l-4 border-red-600 pl-6">
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Globálne Výhody</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">// Systémové parametre pre detaily plotov</p>
          </div>
          <Benefits editMode={true} dbData={benefitsData || undefined} />
        </div>

        {/* --- OSTATNÉ EDITORY --- */}
        <div className="space-y-20">
          <div className="border-t-2 border-black pt-10">
            <About editMode={true} dbData={aboutData || undefined} />
          </div>
          <div className="border-t-2 border-black pt-10">
            <Services editMode={true} dbData={servicesData || undefined} />
          </div>
        </div>
      </div>
      <div id="footer-admin" className="bg-white border border-black p-0 shadow-xl mt-20">
        <div className="p-8 border-b border-black bg-slate-50">
          <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Pätička (Footer)</h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">// Globálne kontaktné a firemné údaje</p>
        </div>
        <div className="p-8">
          <FooterEditor dbData={footerData || undefined} />
        </div>
      </div>
    </div>
  );
}
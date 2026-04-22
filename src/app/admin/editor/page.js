import About from "@/components/home/About";
import Services from "@/components/home/Services"; 
import Reviews from "@/components/home/Reviews";
import EditorHeader from "@/components/admin/EditorHeader"; // Импортируем общую шапку
import { getContent } from "@/actions/adminActions";

export default async function EditorPage() {
  const aboutData = await getContent("domov", "domov-o-nas");
  const servicesData = await getContent("domov", "domov-sluzby");
  const reviewsData = await getContent("domov", "domov-recenzie");

  return (
    <div className="min-h-screen bg-slate-50 pb-20 flex flex-col">
      {/* Теперь здесь используется тот же компонент, что и в контактах */}
      <EditorHeader title="Domovská stránka" />

      <div className="max-w-7xl mx-auto px-4 mt-12 space-y-24 w-full">
        <About editMode={true} dbData={aboutData || undefined} />
        <Services editMode={true} dbData={servicesData || undefined} />
        <Reviews editMode={true} dbData={reviewsData || undefined} /> 
      </div>
    </div>
  );
}
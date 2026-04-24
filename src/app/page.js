import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Services from "@/components/home/Services";
import Reviews from "@/components/home/Reviews";
import { getContent, getCollections } from "@/actions/adminActions"; // Объединил импорты для красоты
import StyleGrid from "@/components/home/StyleGrid";
import PortfolioPreview from "@/components/home/PortfolioPreview";
export const dynamic = 'force-dynamic';

export default async function Home() {
  const recentProjects = await prisma.project.findMany({ take: 6, orderBy: { createdAt: 'desc' } });
  // 1. ПОЛУЧАЕМ КОЛЛЕКЦИИ (Этого не хватало!)
  const collections = await getCollections();
  
  // 2. Получаем данные для блока "О нас"
  const aboutData = await getContent("domov", "domov-o-nas");
  
  // 3. Получаем данные для блока "Услуги"
  const servicesData = await getContent("domov", "domov-sluzby");
  
  // 4. Получаем данные для блока "Отзывы"
  const reviewsData = await getContent("domov", "domov-recenzie");

  return (
    <main>
      <Hero />
      {/* Теперь переменная collections определена строкой выше */}
      <StyleGrid collections={collections} />
      <PortfolioPreview projects={recentProjects} />
      <About editMode={false} dbData={aboutData || undefined} />
      <Services editMode={false} dbData={servicesData || undefined} />
      <Reviews editMode={false} dbData={reviewsData || undefined} /> 
    </main>
  );
}
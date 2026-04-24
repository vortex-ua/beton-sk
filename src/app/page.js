import { prisma } from "@/lib/prisma";
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
  const collections = await getCollections();
  const aboutData = await getContent("domov", "domov-o-nas");
  const servicesData = await getContent("domov", "domov-sluzby");
  const reviewsData = await getContent("domov", "domov-recenzie");
  
  // Получаем одобренные отзывы
  const approvedReviews = await prisma.review.findMany({
    where: { status: 'APPROVED' },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main>
      <Hero />
      <StyleGrid collections={collections} />
      <PortfolioPreview projects={recentProjects} />
      <About editMode={false} dbData={aboutData || undefined} />
      <Services editMode={false} dbData={servicesData || undefined} />
      {/* Теперь передаем всё в отзывы */}
      <Reviews 
        editMode={false} 
        dbData={reviewsData || undefined}
        approvedReviews={approvedReviews} 
      />
    </main>
  );
}
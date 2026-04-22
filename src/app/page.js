import Hero from "@/components/home/Hero";
import About from "@/components/home/About";
import Services from "@/components/home/Services";
import Reviews from "@/components/home/Reviews";
import { getContent } from "@/actions/adminActions";

export default async function Home() {
  // 1. Получаем данные для блока "О нас"
  const aboutData = await getContent("domov", "domov-o-nas");
  
  // 2. Получаем данные для блока "Услуги"
  const servicesData = await getContent("domov", "domov-sluzby");
  
  // 3. Получаем данные для блока "Отзывы" (ЭТОЙ СТРОКИ НЕ ХВАТАЛО)
  const reviewsData = await getContent("domov", "domov-recenzie");

  return (
    <main>
      <Hero />
      <About editMode={false} dbData={aboutData || undefined} />
      <Services editMode={false} dbData={servicesData || undefined} />
      <Reviews editMode={false} dbData={reviewsData || undefined} /> 
    </main>
  );
}
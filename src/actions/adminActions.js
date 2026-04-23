"use server"; 

import { prisma } from "@/lib/prisma";
// 1. Импортируем функцию для сброса кэша
import { revalidatePath } from "next/cache";

export async function saveContent(stranka, sekcia, obsah) {
  try {
    const updated = await prisma.strankaObsah.upsert({
      where: { sekcia: sekcia },
      update: { obsah: obsah },
      create: {
        stranka: stranka,
        sekcia: sekcia,
        obsah: obsah
      }
    });
    
    // 2. Сбрасываем кэш главной страницы. 
    // Теперь Vercel поймет, что старая версия страницы больше не актуальна.
    revalidatePath("/");
    
    // Если у тебя есть другие страницы, например /kontakt, можно добавить и их:
    // revalidatePath("/kontakt");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Chyba pri ukladaní do DB:", error);
    return { success: false, error: error.message };
  }
}

export async function getContent(stranka, sekcia) {
  try {
    const data = await prisma.strankaObsah.findUnique({
      where: { sekcia: sekcia }
    });
    
    return data ? data.obsah : null;
  } catch (error) {
    console.error("Chyba pri načítaní z DB:", error);
    return null;
  }
}
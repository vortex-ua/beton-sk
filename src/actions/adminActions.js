"use server"; // Эта директива говорит Next.js, что код выполняется только на сервере
import { prisma } from "@/lib/prisma";

export async function saveContent(stranka, sekcia, obsah) {
  try {
    // upsert — это умная команда: 
    // "Если такой блок уже есть в базе — обнови его. Если нет — создай новый."
    const updated = await prisma.strankaObsah.upsert({
      where: { sekcia: sekcia },
      update: { obsah: obsah },
      create: {
        stranka: stranka,
        sekcia: sekcia,
        obsah: obsah
      }
    });
    
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
    
    // Если данные есть, возвращаем их (obsah). Если нет — возвращаем null
    return data ? data.obsah : null;
  } catch (error) {
    console.error("Chyba pri načítaní z DB:", error);
    return null;
  }
}
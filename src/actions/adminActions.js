"use server";

import { prisma } from "@/lib/prisma";
import { put } from '@vercel/blob';
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
export async function getCollections() {
  try {
    const collections = await prisma.collection.findMany({
      orderBy: { id: 'asc' }
    });
    return collections;
  } catch (error) {
    console.error("Chyba pri načítaní kolekcií:", error);
    return [];
  }
}
export async function updateCollection(id, data) {
  try {
    const updated = await prisma.collection.update({
      where: { id: Number(id) },
      data: {
        title: data.title,
        subtitle: data.subtitle,
        mainImage: data.mainImage,
        description: data.description,
      },
    });
    return { success: true, data: updated };
  } catch (error) {
    console.error("Update error:", error);
    return { success: false };
  }
}
// --- ФУНКЦИИ ДЛЯ КОЛЛЕКЦИЙ (СТИЛЕЙ) ---

export async function createCollection(data) {
  try {
    // 1. Умная генерация ссылки (Убираем словацкие буквы: š->s, á->a, ž->z)
    const baseSlug = data.title
      .normalize("NFD") // Разбиваем символ и его диакритический знак
      .replace(/[\u0300-\u036f]/g, "") // Удаляем все "mäkčene" и "dĺžne"
      .toLowerCase() // В нижний регистр
      .replace(/[^a-z0-9]+/g, '-') // Все пробелы и знаки превращаем в тире
      .replace(/(^-|-$)+/g, ''); // Убираем тире по краям

    // 2. Проверяем, свободна ли эта ссылка. Если занята - добавляем цифру (-1, -2...)
    let finalSlug = baseSlug;
    let counter = 1;

    // Ищем в цикле, пока не найдем свободное имя
    while (await prisma.collection.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newCollection = await prisma.collection.create({
      data: {
        title: data.title,
        subtitle: data.subtitle,
        mainImage: data.mainImage,
        description: data.description,
        slug: finalSlug, // Сохраняем нашу 100% уникальную и чистую ссылку
      },
    });

    return { success: true, data: newCollection };
  } catch (error) {
    console.error("Ошибка при создании коллекции:", error);
    return { success: false, error: error.message };
  }
}
export async function deleteCollection(id) {
  try {
    await prisma.collection.delete({
      where: { id: Number(id) }
    });
    return { success: true };
  } catch (error) {
    console.error("Ошибка при удалении:", error);
    return { success: false };
  }
}

export async function createProject(data) {
  try {
    const baseSlug = data.title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    let finalSlug = baseSlug;
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    // УНИВЕРСАЛЬНЫЙ ПАРСИНГ ГАЛЕРЕИ
    let parsedImages = [];
    if (data.images) {
      // Если это уже массив — берем его, если строка — парсим
      parsedImages = Array.isArray(data.images) ? data.images : JSON.parse(data.images);
    }
    
    const newProject = await prisma.project.create({
      data: {
        title: data.title,
        slug: finalSlug,
        category: data.category,
        description: data.description,
        mainImage: data.mainImage,
        location: data.location || null,
        images: parsedImages, 
      },
    });
    
    revalidatePath("/realizacie");
    return { success: true, data: newProject };
  } catch (error) {
    console.error("Chyba pri vytváraní projektu:", error);
    return { success: false, error: error.message };
  }
}

export async function updateProject(id, data) {
  try {
    let parsedImages = [];
    if (data.images) {
      // Улучшенная проверка: массив или строка
      parsedImages = Array.isArray(data.images) ? data.images : JSON.parse(data.images);
    }

    const updatedProject = await prisma.project.update({
      where: { id: Number(id) },
      data: {
        title: data.title,
        category: data.category,
        location: data.location,
        description: data.description,
        mainImage: data.mainImage,
        images: parsedImages, 
      },
    });

    // Обязательно сбрасываем кэш, чтобы новые фото появились сразу
    revalidatePath("/realizacie");
    revalidatePath(`/projekt/${updatedProject.slug}`);
    
    return { success: true, data: updatedProject };
  } catch (error) {
    console.error("Chyba pri aktualizácii projektu:", error);
    return { success: false, error: error.message };
  }
}
export async function deleteProject(id) {
  try {
    await prisma.project.delete({ where: { id: Number(id) } });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
export async function uploadImage(file) {
  // Вместо записи файла на диск, отправляем его в облако Vercel
  const blob = await put(file.name, file, { access: 'public' });
  return blob.url; // Возвращаем https://... ссылку
}
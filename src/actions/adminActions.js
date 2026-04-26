"use server";

import { prisma } from "@/lib/prisma";
import { put } from '@vercel/blob';
import { revalidatePath } from "next/cache";

/**
 * СОХРАНЕНИЕ ОБЩЕГО КОНТЕНТА (Hero, Footer, About и т.д.)
 */
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

    // Сбрасываем кэш, чтобы изменения были видны мгновенно
    revalidatePath("/");
    revalidatePath("/admin/editor");

    return { success: true, data: updated };
  } catch (error) {
    console.error("Chyba pri ukladaní do DB:", error);
    return { success: false, error: error.message };
  }
}

/**
 * ЭКШЕН ДЛЯ ЗАГРУЗКИ ИЗОБРАЖЕНИЙ (Vercel Blob)
 * Именно эту функцию ищет твой HeroEditor
 */
export async function uploadImageAction(formData) {
  try {
    const file = formData.get('file');
    if (!file) throw new Error("Súbor nebol nájdený");

    // Отправляем файл в облако Vercel
    const blob = await put(file.name, file, { 
      access: 'public',
      addRandomSuffix: true // Добавит случайные символы к названию, чтобы избежать дублей
    });

    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Upload Error:", error);
    return { success: false, error: error.message };
  }
}

/**
 * ПОЛУЧЕНИЕ КОНТЕНТА
 */
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

/**
 * КОЛЛЕКЦИИ (СТИЛИ)
 */
export async function getCollections() {
  try {
    return await prisma.collection.findMany({ orderBy: { id: 'asc' } });
  } catch (error) {
    return [];
  }
}

export async function createCollection(data) {
  try {
    const baseSlug = data.title
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    let finalSlug = baseSlug;
    let counter = 1;
    while (await prisma.collection.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newCollection = await prisma.collection.create({
      data: { ...data, slug: finalSlug },
    });

    revalidatePath("/");
    return { success: true, data: newCollection };
  } catch (error) {
    return { success: false, error: error.message };
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
    revalidatePath("/");
    revalidatePath(`/kolekcia/${updated.slug}`);
    return { success: true, data: updated };
  } catch (error) {
    return { success: false };
  }
}

export async function deleteCollection(id) {
  try {
    await prisma.collection.delete({ where: { id: Number(id) } });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * ПРОЕКТЫ (РЕАЛИЗАЦИИ)
 */
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

    let parsedImages = Array.isArray(data.images) ? data.images : JSON.parse(data.images || "[]");
    
    const newProject = await prisma.project.create({
      data: { ...data, slug: finalSlug, images: parsedImages },
    });
    
    revalidatePath("/realizacie");
    return { success: true, data: newProject };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateProject(id, data) {
  try {
    let parsedImages = Array.isArray(data.images) ? data.images : JSON.parse(data.images || "[]");

    const updatedProject = await prisma.project.update({
      where: { id: Number(id) },
      data: { ...data, images: parsedImages },
    });

    revalidatePath("/realizacie");
    revalidatePath(`/projekt/${updatedProject.slug}`);
    return { success: true, data: updatedProject };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function deleteProject(id) {
  try {
    await prisma.project.delete({ where: { id: Number(id) } });
    revalidatePath("/realizacie");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Удаление всех коллекций
export async function deleteAllCollectionsAction() {
  try {
    await prisma.collection.deleteMany({});
    revalidatePath("/");
    return { success: true };
  } catch (e) {
    return { success: false, error: e.message };
  }
}
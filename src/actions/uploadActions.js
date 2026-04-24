"use server";
import { put } from '@vercel/blob';

export async function uploadImage(formData) {
  try {
    const file = formData.get('file'); // или как ты передаешь файл

    if (!file) {
      throw new Error("Nebol vybraný žiadny súbor.");
    }

    // Загружаем напрямую в облако Vercel
    const blob = await put(file.name, file, {
      access: 'public',
    });

    // Возвращаем URL загруженного файла (https://....public.blob.vercel-storage.com/...)
    return { success: true, url: blob.url };
  } catch (error) {
    console.error("Blob Upload Error:", error);
    return { success: false, error: error.message };
  }
}
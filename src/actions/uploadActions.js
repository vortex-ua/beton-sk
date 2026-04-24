"use server";
import { put } from '@vercel/blob';

export async function uploadImage(formData) {
  try {
    const file = formData.get('file');

    if (!file || file.size === 0) {
      return { success: false, error: "Nebol vybraný žiadny súbor." };
    }

    // Загружаем в Vercel Blob
    // 'access: public' обязателен, чтобы фото открывалось по ссылке
    const blob = await put(file.name, file, {
      access: 'public',
      addRandomSuffix: true, // ОБЯЗАТЕЛЬНО: это решит проблему с "already exists"
    });

    console.log("Súbor úspešne nahraný:", blob.url);

    return {
      success: true,
      url: blob.url // Это прямая ссылка https://...
    };
  } catch (error) {
    console.error("Blob Upload Error:", error);
    return { success: false, error: "Chyba pri nahrávaní: " + error.message };
  }
}
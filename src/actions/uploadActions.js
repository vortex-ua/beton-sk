"use server";
import { writeFile } from "fs/promises";
import path from "path";

export async function uploadImage(formData) {
  try {
    const file = formData.get("file");
    if (!file) {
      return { success: false, error: "Súbor nebol nájdený." };
    }

    // Читаем файл
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Генерируем уникальное имя файла (чтобы не перезаписать старые)
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // Убираем пробелы из оригинального имени
    const filename = `${uniqueSuffix}-${file.name.replace(/\s/g, "_")}`;

    // Путь сохранения: корень_проекта/public/uploads/название_файла
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const filepath = path.join(uploadDir, filename);

    // Сохраняем физически на диск
    await writeFile(filepath, buffer);

    // Возвращаем публичную ссылку на картинку, которую запишем в БД
    return { success: true, url: `/uploads/${filename}` };
  } catch (error) {
    console.error("Chyba pri nahrávaní súboru:", error);
    return { success: false, error: "Nepodarilo sa uložiť súbor." };
  }
}
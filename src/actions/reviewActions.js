"use server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. Клиент отправляет отзыв
export async function submitReview(formData) {
  try {
    const author = formData.get("author");
    const text = formData.get("text");
    const rating = parseInt(formData.get("rating"));

    await prisma.review.create({
      data: { author, text, rating, status: "PENDING" }
    });

    return { success: true };
  } catch (e) {
    console.error("Submit error:", e);
    return { success: false, error: e.message };
  }
}

// 2. Ты одобряешь отзыв в админке
export async function approveReview(id) {
  try {
    await prisma.review.update({
      where: { id },
      data: { status: "APPROVED" }
    });
    
    revalidatePath("/"); 
    revalidatePath("/admin/reviews");
    
    // ОБЯЗАТЕЛЬНО возвращаем результат!
    return { success: true };
  } catch (e) {
    console.error("Approve error:", e);
    return { success: false, error: e.message };
  }
}

// 3. Ты удаляешь отзыв
export async function deleteReview(id) {
  try {
    await prisma.review.delete({ 
      where: { id } 
    });
    
    revalidatePath("/admin/reviews");
    revalidatePath("/");
    
    // ОБЯЗАТЕЛЬНО возвращаем результат!
    return { success: true };
  } catch (e) {
    console.error("Delete error:", e);
    return { success: false, error: e.message };
  }
}

export async function getReviewsAction() {
  try {
    return await prisma.review.findMany({
      orderBy: { createdAt: 'desc' }
    });
  } catch (e) {
    console.error("Get reviews error:", e);
    return [];
  }
}
import { createCollection } from "@/actions/adminActions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";

// 1. ИМПОРТИРУЕМ НАШ КРУТОЙ ВЫБОР КАРТИНКИ
import ImagePicker from "@/components/admin/ImagePicker";

export default function NewCollectionPage() {

  async function handleSave(formData) {
    "use server";
    const data = {
      title: formData.get("title"),
      subtitle: formData.get("subtitle"),
      mainImage: formData.get("mainImage"), // Ссылка прилетит из невидимого поля ImagePicker
      description: formData.get("description"),
    };
    await createCollection(data);
    revalidatePath("/admin/editor");
    redirect("/admin/editor#kolekcie");
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/editor#kolekcie" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-medium transition-colors">
          <ArrowLeft size={20} /> Späť do editora
        </Link>

        {/* Сделали такой же дизайн формы, как при редактировании */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <form action={handleSave}>
            
            {/* 2. ВСТАВЛЯЕМ ВЫБОР ФОТО (С пустой картинкой по умолчанию) */}
            <ImagePicker defaultValue="" />

            <div className="p-8 md:p-12 space-y-6">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Nová kolekcia</h1>
                  <p className="text-slate-500">Pridajte nový štýl plotu na hlavnú stránku</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Názov kolekcie</label>
                  <input 
                    name="title" 
                    required 
                    placeholder="Napr. TEPLO DREVA" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-green-500 transition-all outline-none" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Podnadpis (Krátky popis)</label>
                  <input 
                    name="subtitle" 
                    required 
                    placeholder="Napr. Vzhľad dreva. Žiadne natieranie." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-green-500 transition-all outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Technológia (Dlhý text)</label>
                  <textarea 
                    name="description" 
                    required 
                    rows={8} 
                    placeholder="Popis..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-green-500 transition-all outline-none" 
                  />
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2"
                >
                  <Save size={20} /> Vytvoriť kolekciu
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
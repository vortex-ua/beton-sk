import { createProject } from "@/actions/adminActions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save } from "lucide-react";
import ImagePicker from "@/components/admin/ImagePicker";
import MultiImagePicker from "@/components/admin/MultiImagePicker";

export default function NewProjectPage() {

  async function handleSave(formData) {
    "use server";
    const data = {
      title: formData.get("title"),
      category: formData.get("category"),
      location: formData.get("location"),
      description: formData.get("description"),
      mainImage: formData.get("mainImage"),
      // ПЕРЕДАЕМ ДАННЫЕ ГАЛЕРЕИ
      images: formData.get("images"), 
    };
    await createProject(data);
    
    revalidatePath("/");
    revalidatePath("/realizacie");
    revalidatePath("/admin/editor");
    redirect("/admin/editor#realizacie");
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Link href="/admin/editor#realizacie" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-8 font-medium transition-colors">
          <ArrowLeft size={20} /> Späť do editora
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <form action={handleSave}>
            
            {/* ГЛАВНОЕ ФОТО КАРТОЧКИ */}
            <ImagePicker defaultValue="" />

            <div className="p-8 md:p-12 space-y-6">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Nová realizácia</h1>
                  <p className="text-slate-500">Pridajte ukážku vašej práce do portfólia</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Názov projektu</label>
                  <input 
                    name="title" 
                    required 
                    placeholder="Napr. Oplotenie rodinného domu..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-green-500 outline-none transition-all" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Štýl / Kategória</label>
                  <input 
                    name="category" 
                    required 
                    placeholder="Napr. Moderné línie" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-green-500 outline-none transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Lokalita (Mesto)</label>
                  <input 
                    name="location" 
                    placeholder="Napr. Bratislava" 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-green-500 outline-none transition-all" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Popis projektu</label>
                  <textarea 
                    name="description" 
                    required 
                    rows={6} 
                    placeholder="Opíšte detaily realizácie..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-green-500 outline-none transition-all" 
                  />
                </div>

                {/* БЛОК МНОЖЕСТВЕННОЙ ЗАГРУЗКИ ФОТО */}
                <div className="md:col-span-2 pt-6 border-t border-slate-100">
                   <MultiImagePicker defaultValue={[]} />
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-100 flex justify-end">
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg flex items-center gap-2"
                >
                  <Save size={20} /> Uložiť projekt
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
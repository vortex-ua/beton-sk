import { prisma } from "@/lib/prisma";
import { updateProject, deleteProject } from "@/actions/adminActions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import ImagePicker from "@/components/admin/ImagePicker";
// ИМПОРТИРУЕМ НАШ НОВЫЙ КОМПОНЕНТ
import MultiImagePicker from "@/components/admin/MultiImagePicker";

export default async function EditProjectPage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  const project = await prisma.project.findUnique({
    where: { id: Number(id) }
  });

  if (!project) return <div>Projekt nebol nájdený</div>;

  async function handleSave(formData) {
    "use server";
    const data = {
      title: formData.get("title"),
      category: formData.get("category"),
      location: formData.get("location"),
      description: formData.get("description"),
      mainImage: formData.get("mainImage"),
      // ВОТ ЭТА СТРОКА САМАЯ ВАЖНАЯ ДЛЯ ГАЛЕРЕИ:
      images: formData.get("images"), 
    };
    await updateProject(id, data);
    revalidatePath("/admin/editor");
    revalidatePath("/realizacie");
    revalidatePath(`/projekt/${project.slug}`);
    redirect("/admin/editor#realizacie");
  }

  async function handleDelete() {
    "use server";
    await deleteProject(id);
    revalidatePath("/admin/editor");
    revalidatePath("/realizacie");
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
            
            <ImagePicker defaultValue={project.mainImage} />

            <div className="p-8 md:p-12 space-y-6">
              <div className="flex items-center gap-4 mb-4 pb-4 border-b border-slate-100">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Upraviť realizáciu</h1>
                  <p className="text-slate-500">Zmeňte detaily hotového projektu</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Názov projektu</label>
                  <input 
                    name="title" 
                    defaultValue={project.title} 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-green-500 outline-none" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Štýl / Kategória</label>
                  <input 
                    name="category" 
                    defaultValue={project.category} 
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-green-500 outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Lokalita (Mesto)</label>
                  <input 
                    name="location" 
                    defaultValue={project.location || ""} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-green-500 outline-none" 
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">Popis projektu</label>
                  <textarea 
                    name="description" 
                    defaultValue={project.description} 
                    required
                    rows={6} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-900 focus:ring-2 focus:ring-green-500 outline-none" 
                  />
                </div>

                {/* === НАШ БЛОК ГАЛЕРЕИ === */}
                <div className="md:col-span-2 pt-6 border-t border-slate-100">
                  <MultiImagePicker defaultValue={project.images || []} />
                </div>
              </div>

              <div className="pt-8 mt-8 border-t border-slate-100 flex justify-between items-center">
                <button 
                  formAction={handleDelete}
                  className="px-6 py-3 text-red-500 font-bold hover:bg-red-50 rounded-xl flex items-center gap-2 transition-colors"
                >
                  <Trash2 size={20} /> Vymazať
                </button>
                <button 
                  type="submit" 
                  className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg flex items-center gap-2"
                >
                  <Save size={20} /> Uložiť zmeny
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
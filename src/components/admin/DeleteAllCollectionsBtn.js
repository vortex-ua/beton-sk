"use client";
import { deleteAllCollectionsAction } from "@/actions/adminActions";
import { Trash2 } from "lucide-react";

export default function DeleteAllCollectionsBtn() {
  const handleDelete = async () => {
    const confirmed = confirm(
      "POZOR! Naozaj chcete vymazať VŠETKY kolekcie? Táto akcia je nevratná и všetky štýly plotov zmiznú z webu."
    );

    if (confirmed) {
      const res = await deleteAllCollectionsAction();
      if (res.success) {
        alert("Všetky kolekcie boli úspešne odstránené.");
      } else {
        alert("Chyba: " + res.error);
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-4 py-2 text-red-500 hover:bg-red-50 border border-red-200 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
    >
      <Trash2 size={14} />
      Vymazať všetko
    </button>
  );
}
"use client";

import { useState, useRef } from "react";
import { Camera, Loader2 } from "lucide-react";
// 1. ИМПОРТИРУЕМ ТВОЙ ГОТОВЫЙ ЭКШЕН ЗАГРУЗКИ
import { uploadImage } from "@/actions/uploadActions"; 

export default function ImagePicker({ defaultValue }) {
  const [imageUrl, setImageUrl] = useState(defaultValue || "");
  const [isUploading, setIsUploading] = useState(false);
  
  const fileInputRef = useRef(null);

  function handleImageClick() {
    fileInputRef.current?.click();
  }

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    try {
      // Подготавливаем файл (точно как в твоем About.js)
      const formData = new FormData();
      formData.append("file", file);

      // 2. ВЫЗЫВАЕМ ТВОЮ ФУНКЦИЮ ЗАГРУЗКИ НА СЕРВЕР
      const uploadResult = await uploadImage(formData);

      if (uploadResult.success) {
        // Ура! Сервер сохранил фото и вернул настоящую постоянную ссылку
        setImageUrl(uploadResult.url);
      } else {
        alert("Chyba pri nahrávaní obrázka na server.");
      }
    } catch (error) {
      console.error("Ошибка при загрузке файла:", error);
      alert("Chyba systému pri nahrávaní.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div 
      className="relative h-64 bg-slate-200 group cursor-pointer overflow-hidden"
      onClick={handleImageClick}
    >
      <img 
        src={imageUrl || "https://via.placeholder.com/800x400?text=Žiadny+obrázok"} 
        alt="Preview" 
        className={`w-full h-full object-cover transition-all ${isUploading ? 'opacity-50 blur-sm scale-105' : ''}`}
      />
      
      {/* Скрытый инпут */}
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {/* Оверлей при наведении */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl border border-white/30 flex items-center gap-3 text-white">
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              <span className="font-bold">Nahráva sa...</span>
            </>
          ) : (
            <>
              <Camera size={24} />
              <span className="font-bold">Vybrať fotografiu z PC</span>
            </>
          )}
        </div>
      </div>

      {/* СКРЫТОЕ ПОЛЕ: Оно автоматически отправит правильную ссылку в базу при нажатии "Uložiť" */}
      <input type="hidden" name="mainImage" value={imageUrl} />
    </div>
  );
}
"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import { saveContent } from "@/actions/adminActions";
import { uploadImage } from "@/actions/uploadActions"; // Наш новый экшен

// Добавили obrazok в дефолтные данные
const defaultData = {
  hlavnyNadpis: "Od roku 2009 staviame ploty, ktoré pretrvajú",
  odstavec1: "Pôsobíme na slovenskom trhu od roku 2009. Našou základnou prioritou je spokojnosť zákazníka.",
  odstavec2: "Betónové ploty vyrábame technológiou liatia.",
  odstavec3: "Pôsobíme na Slovensku, v Rakúsku a Poľsku.",
  obrazok: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070" // Дефолтное фото
};

export default function About({ editMode = false, dbData = defaultData }) {
  // Если в БД нет obrazok, берем из defaultData
  const [content, setContent] = useState({ ...defaultData, ...dbData });
  const [isUploading, setIsUploading] = useState(false);
  
  // Референс для невидимого инпута файлов
  const fileInputRef = useRef(null);

  // Сохранение текста (старая функция, работает как часы)
  const handleBlur = async (field, event) => {
    const newText = event.target.innerText;
    if (newText !== content[field]) {
      const updatedContent = { ...content, [field]: newText };
      setContent(updatedContent);
      await saveContent("domov", "domov-o-nas", updatedContent);
    }
  };

  // НОВАЯ ЛОГИКА: Загрузка картинки
  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Подготавливаем файл к отправке
    const formData = new FormData();
    formData.append("file", file);

    // 1. Физически загружаем файл на сервер
    const uploadResult = await uploadImage(formData);

    if (uploadResult.success) {
      // 2. Обновляем стейт с новой ссылкой
      const updatedContent = { ...content, obrazok: uploadResult.url };
      setContent(updatedContent);
      
      // 3. Сохраняем новую ссылку в базу данных
      await saveContent("domov", "domov-o-nas", updatedContent);
      console.log("Fotografia úspešne zmenená a uložená do DB!");
    } else {
      alert("Chyba pri nahrávaní obrázka.");
    }

    setIsUploading(false);
  };

  const getEditableProps = (field) => {
    if (!editMode) return {};
    return {
      contentEditable: true,
      suppressContentEditableWarning: true,
      onBlur: (e) => handleBlur(field, e),
      className: "hover:outline hover:outline-2 hover:outline-red-500 hover:bg-red-50/50 transition-all cursor-text rounded px-1",
      title: "Kliknite pre úpravu"
    };
  };

  return (
    <section id="onas" className={`py-24 bg-white overflow-hidden relative ${editMode ? 'border-4 border-dashed border-red-200' : ''}`}>
      
      {editMode && (
        <div className="absolute top-0 left-0 bg-red-600 text-white text-xs font-bold px-3 py-1 uppercase rounded-br-lg z-50">
          Úprava: O NÁS
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="space-y-8">
            <div>
              <h2 {...getEditableProps("hlavnyNadpis")} className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight uppercase ${getEditableProps("hlavnyNadpis").className || ""}`}>
                {content.hlavnyNadpis}
              </h2>
            </div>
            <div className="space-y-5 text-lg text-slate-600 leading-relaxed">
              <p {...getEditableProps("odstavec1")} className={getEditableProps("odstavec1").className || ""}>{content.odstavec1}</p>
              <p>
                <span {...getEditableProps("odstavec2")} className={getEditableProps("odstavec2").className || ""}>{content.odstavec2}</span>
                {" "}<span className="font-semibold text-slate-900">Kde iní prezentujú takýto povrch ako exkluzívny, u nás je to štandard.</span>
              </p>
              <p {...getEditableProps("odstavec3")} className={getEditableProps("odstavec3").className || ""}>{content.odstavec3}</p>
            </div>
          </div>

          {/* Блок с картинкой */}
          <div className="relative h-[500px] lg:h-[700px] w-full rounded-sm overflow-hidden shadow-2xl group">
            
            {editMode && (
                <div 
                  // Клик по этому слою активирует скрытый input
                  onClick={() => fileInputRef.current?.click()} 
                  className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                >
                   <span className="text-white font-bold px-6 py-3 border-2 border-white rounded-md">
                     {isUploading ? "Nahrávam..." : "Zmeniť fotografiu"}
                   </span>
                </div>
            )}
            
            {/* Скрытый input для выбора файла */}
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageChange}
            />

            {/* Выводим картинку из стейта (базы данных) */}
            <Image
              src={content.obrazok || defaultData.obrazok}
              alt="Výroba a montáž"
              fill
              className={`object-cover transition-transform duration-1000 group-hover:scale-105 ${isUploading ? 'opacity-50 blur-sm' : ''}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
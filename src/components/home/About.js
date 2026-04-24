"use client";
import Image from "next/image";
import { useState, useRef } from "react";
import { saveContent } from "@/actions/adminActions";
import { uploadImage } from "@/actions/uploadActions";

const defaultData = {
  hlavnyNadpis: "Od roku 2009 staviame ploty, ktoré pretrvajú",
  odstavec1: "Pôsobíme na slovenskom trhu od roku 2009. Našou základnou prioritou je spokojnosť zákazníka.",
  odstavec2: "Betónové ploty vyrábame technológiou liatia.",
  odstavec3: "Pôsobíme na Slovensku, v Rakúsku a Poľsku.",
  obrazok: "https://images.unsplash.com/photo-1516937941344-00b4e0337589?q=80&w=2070"
};

export default function About({ editMode = false, dbData = defaultData }) {
  const [content, setContent] = useState({ ...defaultData, ...dbData });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleBlur = async (field, event) => {
    const newText = event.target.innerText.trim();
    if (newText !== content[field]) {
      const updatedContent = { ...content, [field]: newText };
      setContent(updatedContent);
      await saveContent("domov", "domov-o-nas", updatedContent);
    }
  };

  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const uploadResult = await uploadImage(formData);
    if (uploadResult.success) {
      const updatedContent = { ...content, obrazok: uploadResult.url };
      setContent(updatedContent);
      await saveContent("domov", "domov-o-nas", updatedContent);
    }
    setIsUploading(false);
  };

  const getEditableProps = (field) => {
    if (!editMode) return {};
    return {
      contentEditable: true,
      suppressContentEditableWarning: true,
      onBlur: (e) => handleBlur(field, e),
      // Здесь оставляем только стили для режима редактирования
      className: "outline outline-2 outline-red-500 bg-red-50/50 cursor-text rounded px-1",
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

          {/* ТЕКСТОВАЯ ЧАСТЬ */}
          {/* break-words и whitespace-pre-wrap вынесены в основные классы */}
          <div className="space-y-8 max-w-full overflow-hidden break-words whitespace-pre-wrap">
            <div>
              <h2 
                {...getEditableProps("hlavnyNadpis")} 
                className={`text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight uppercase break-words ${editMode ? getEditableProps("hlavnyNadpis").className : ""}`}
              >
                {content.hlavnyNadpis}
              </h2>
            </div>
            
            <div className="space-y-5 text-lg text-slate-600 leading-relaxed break-words">
              <p 
                {...getEditableProps("odstavec1")} 
                className={`break-words ${editMode ? getEditableProps("odstavec1").className : ""}`}
              >
                {content.odstavec1}
              </p>
              
              <p className="break-words">
                <span 
                  {...getEditableProps("odstavec2")} 
                  className={`break-words ${editMode ? getEditableProps("odstavec2").className : ""}`}
                >
                  {content.odstavec2}
                </span>
                {" "}
              
              </p>
              
              <p 
                {...getEditableProps("odstavec3")} 
                className={`break-words ${editMode ? getEditableProps("odstavec3").className : ""}`}
              >
                {content.odstavec3}
              </p>
            </div>
          </div>

          {/* КАРТИНКА */}
          <div className="relative h-[500px] lg:h-[700px] w-full rounded-sm overflow-hidden shadow-2xl group">
            {editMode && (
                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  className="absolute inset-0 bg-black/60 z-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                >
                   <span className="text-white font-bold px-6 py-3 border-2 border-white rounded-md">
                     {isUploading ? "Nahrávam..." : "Zmeniť fotografiu"}
                   </span>
                </div>
            )}
            
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

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
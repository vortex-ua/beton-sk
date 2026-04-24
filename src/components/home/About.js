"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
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

  useEffect(() => {
    if (dbData) setContent({ ...defaultData, ...dbData });
  }, [dbData]);

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
      className: "outline-none focus:ring-1 focus:ring-slate-900 p-1 transition-all",
      title: "Kliknite pre úpravu"
    };
  };

  return (
    <section id="onas" className={`py-32 bg-[#F5F5F5] overflow-hidden relative border-t border-slate-100 ${editMode ? 'ring-1 ring-inset ring-red-500' : ''}`}>
      
      {editMode && (
        <div className="absolute top-0 left-0 bg-red-600 text-white text-[10px] font-black px-4 py-2 uppercase tracking-widest z-50">
          Admin / Edit Mode
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* ТЕКСТОВАЯ ЧАСТЬ (8 колонок на десктопе для воздуха) */}
          <div className="lg:col-span-7 space-y-12">
            <div className="border-l border-slate-900 pl-8">
              <h2 
                {...getEditableProps("hlavnyNadpis")} 
                className="text-4xl md:text-5xl lg:text-6xl font-light text-slate-900 leading-[1.1] tracking-tighter uppercase break-words"
              >
                {content.hlavnyNadpis}
              </h2>
            </div>
            
            <div className="space-y-8 text-lg font-light text-slate-500 leading-relaxed max-w-2xl">
              <p {...getEditableProps("odstavec1")} className="break-words">
                {content.odstavec1}
              </p>
              
              <div className="flex gap-4 items-start">
                 <div className="w-8 h-px bg-slate-300 mt-4 shrink-0"></div>
                 <p {...getEditableProps("odstavec2")} className="break-words italic">
                   {content.odstavec2}
                 </p>
              </div>
              
              <p {...getEditableProps("odstavec3")} className="break-words">
                {content.odstavec3}
              </p>
            </div>
          </div>

          {/* КАРТИНКА (5 колонок) */}
          <div className="lg:col-span-5 relative h-[500px] lg:h-[650px] w-full rounded-none overflow-hidden group">
            {editMode && (
                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  className="absolute inset-0 bg-black/40 z-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                >
                   <span className="text-white text-[10px] uppercase tracking-[0.3em] font-black border border-white px-6 py-3">
                     {isUploading ? "Nahrávam..." : "Vymeniť foto"}
                   </span>
                </div>
            )}
            
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageChange} />

            <Image
              src={content.obrazok || defaultData.obrazok}
              alt="Elite Industrial About"
              fill
              className={`object-cover grayscale hover:grayscale-0 transition-all duration-1000 ease-out scale-105 group-hover:scale-100 ${isUploading ? 'opacity-30 blur-md' : ''}`}
            />
            
            {/* Тонкая рамка поверх картинки для стиля */}
            <div className="absolute inset-4 border border-white/20 pointer-events-none"></div>
          </div>

        </div>
      </div>
    </section>
  );
}
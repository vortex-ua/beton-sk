"use client";
import { useState } from "react";
import { saveContent } from "@/actions/adminActions";
import ContactForm from "./ContactForm";
import EditorHeader from "@/components/admin/EditorHeader";
import { Building2, Phone, Mail } from "lucide-react";

export default function KontaktClient({ editMode, initialData }) {
  const [data, setData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);

  const handleBlur = async (field, event) => {
    const newValue = event.target.innerText;
    if (newValue !== data[field]) {
      const updatedData = { ...data, [field]: newValue };
      setData(updatedData);
      setIsSaving(true);
      await saveContent("kontakt", "informacie", updatedData);
      setIsSaving(false);
    }
  };

  const editProps = (field) => {
    if (!editMode) return {};
    return {
      contentEditable: true,
      suppressContentEditableWarning: true,
      onBlur: (e) => handleBlur(field, e),
      className: "hover:bg-white/10 p-1 rounded transition-colors outline-none focus:ring-1 focus:ring-white/50 cursor-text inline-block min-w-[30px]"
    };
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {editMode && <EditorHeader title="Kontakt" />}

      {/* ГЛАВНЫЙ ФИКС ОТСТУПОВ:
          Сверху: 4vw (pt-[4vw])
          Снизу: 2vw (pb-[2vw])
          Добавляем mt-20 для мобилок, чтобы не залезть под навигацию.
      */}
      <main className={`flex-1 flex flex-col items-center px-4 
        ${editMode ? 'pt-6' : 'pt-[max(110px,5vw)]'} pb-[max(40px,2vw)]`}>
        
        <div className="w-full max-w-5xl bg-white flex flex-col lg:flex-row shadow-2xl rounded-sm overflow-hidden min-h-fit lg:min-h-[700px]">
          
          {/* ЛЕВАЯ ЧАСТЬ: ФОРМА */}
          <div className="flex-[1.4] p-8 sm:p-10 lg:p-14 xl:p-16 flex flex-col justify-center order-2 lg:order-1 bg-white">
            <h2 className="text-3xl font-bold text-slate-900 mb-10 tracking-tight">
              Napíšte nám
            </h2>
            <ContactForm />
          </div>

          {/* ПРАВАЯ ЧАСТЬ: КРАСНЫЙ БЛОК */}
          <div className="flex-1 bg-[#d90416] text-white p-8 sm:p-12 lg:p-12 xl:p-14 flex flex-col justify-between order-1 lg:order-2 gap-12">
            
            <div className="space-y-6">
              <Building2 size={36} className="opacity-90" />
              <div className="space-y-2">
                <p {...editProps("firma")} className={`font-bold text-2xl leading-tight ${editProps("firma").className}`}>
                  {data.firma}
                </p>
                <p {...editProps("adresa")} className={`text-base opacity-90 font-light leading-snug ${editProps("adresa").className}`}>
                  {data.adresa}
                </p>
              </div>
              
              <div className="pt-8 space-y-2 text-[12px] opacity-70 font-light border-t border-white/20">
                <p>IČ DPH: <span {...editProps("icdph")}>{data.icdph}</span></p>
                <p>DIČ: <span {...editProps("dic")}>{data.dic}</span></p>
                <p>IČO: <span {...editProps("ico")}>{data.ico}</span></p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="group">
                <div className="flex items-center gap-3 mb-2">
                  <Phone size={18} className="opacity-60" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Tel. kontakt</h4>
                </div>
                <p {...editProps("tel")} className={`text-xl border-b border-white/20 pb-1 font-light ${editProps("tel").className}`}>
                  {data.tel}
                </p>
              </div>

              <div className="group">
                <div className="flex items-center gap-3 mb-2">
                  <Mail size={18} className="opacity-60" />
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">E-mail</h4>
                </div>
                <p {...editProps("email")} className={`text-xl border-b border-white/20 pb-1 font-light break-all ${editProps("email").className}`}>
                  {data.email}
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
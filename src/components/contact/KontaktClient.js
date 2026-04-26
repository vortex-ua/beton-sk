"use client";
import { useState } from "react";
import { saveContent } from "@/actions/adminActions";
import ContactForm from "./ContactForm";
import EditorHeader from "@/components/admin/EditorHeader";
import { Building2, Phone, Mail, Eye, EyeOff, Save } from "lucide-react";

export default function KontaktClient({ editMode, initialData }) {
  const [data, setData] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);

  // Универсальное сохранение (и для текста, и для чекбоксов)
  const syncData = async (updatedData) => {
    setIsSaving(true);
    await saveContent("kontakt", "informacie", updatedData);
    setIsSaving(false);
  };

  const handleBlur = (field, event) => {
    const newValue = event.target.innerText;
    if (newValue !== data[field]) {
      const updatedData = { ...data, [field]: newValue };
      setData(updatedData);
      syncData(updatedData);
    }
  };

  const handleToggle = (field) => {
    const updatedData = { ...data, [field]: !data[field] };
    setData(updatedData);
    syncData(updatedData);
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

  // Компонент переключателя для админки (внутри красного блока)
  const AdminToggle = ({ field, label }) => {
    if (!editMode) return null;
    const active = data[field];
    return (
      <button 
        onClick={() => handleToggle(field)}
        className={`flex items-center gap-2 mb-1 px-2 py-1 rounded-[2px] transition-all ${active ? 'bg-white/10 text-white' : 'bg-black/20 text-white/40'}`}
      >
        {active ? <Eye size={10} /> : <EyeOff size={10} />}
        <span className="text-[8px] font-black uppercase tracking-widest">{label}</span>
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      
      {editMode && <EditorHeader title="Kontakt_Control_Panel" />}

      <main className={`flex-1 flex flex-col items-center px-4 
        ${editMode ? 'pt-6' : 'pt-[max(110px,5vw)]'} pb-[max(40px,2vw)]`}>
        
        <div className="w-full max-w-5xl bg-white flex flex-col lg:flex-row shadow-2xl rounded-sm overflow-hidden min-h-fit lg:min-h-[700px]">
          
          {/* ЛЕВАЯ ЧАСТЬ: ФОРМА */}
          <div className="flex-[1.4] p-8 sm:p-10 lg:p-14 xl:p-16 flex flex-col justify-center order-2 lg:order-1 bg-white">
            <h2 className="text-3xl font-black text-slate-900 mb-10 tracking-tighter uppercase">
              Napíšte nám
            </h2>
            <ContactForm />
          </div>

          {/* ПРАВАЯ ЧАСТЬ: КРАСНЫЙ БЛОК (Elite Industrial) */}
          <div className="flex-1 bg-[#d90416] text-white p-8 sm:p-12 lg:p-12 xl:p-14 flex flex-col justify-between order-1 lg:order-2 gap-12 relative">
            
            {/* Индикатор сохранения */}
            {isSaving && (
              <div className="absolute top-4 right-4 animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}

            <div className="space-y-6">
              <Building2 size={36} className="opacity-90" />
              
              <div className="space-y-4">
                {/* FIRMA */}
                <div className={!data.show_firma && editMode ? 'opacity-50' : ''}>
                  <AdminToggle field="show_firma" label="Firma" />
                  {(data.show_firma || editMode) && (
                    <p {...editProps("firma")} className={`font-bold text-2xl leading-tight ${editProps("firma").className}`}>
                      {data.firma}
                    </p>
                  )}
                </div>

                {/* ADRESA */}
                <div className={!data.show_adresa && editMode ? 'opacity-50' : ''}>
                  <AdminToggle field="show_adresa" label="Adresa" />
                  {(data.show_adresa || editMode) && (
                    <p {...editProps("adresa")} className={`text-base opacity-90 font-light leading-snug ${editProps("adresa").className}`}>
                      {data.adresa}
                    </p>
                  )}
                </div>
              </div>
              
              {/* BILLING SECTION */}
              <div className="pt-8 space-y-4 border-t border-white/20">
                <div className={!data.show_ico && editMode ? 'opacity-50' : ''}>
                  <AdminToggle field="show_ico" label="IČO" />
                  {(data.show_ico || editMode) && (
                    <p className="text-[12px] opacity-70 font-light italic">IČO: <span {...editProps("ico")}>{data.ico}</span></p>
                  )}
                </div>

                <div className={!data.show_dic && editMode ? 'opacity-50' : ''}>
                  <AdminToggle field="show_dic" label="DIČ" />
                  {(data.show_dic || editMode) && (
                    <p className="text-[12px] opacity-70 font-light italic">DIČ: <span {...editProps("dic")}>{data.dic}</span></p>
                  )}
                </div>

                <div className={!data.show_icdph && editMode ? 'opacity-50' : ''}>
                  <AdminToggle field="show_icdph" label="IČ DPH" />
                  {(data.show_icdph || editMode) && (
                    <p className="text-[12px] opacity-70 font-light italic">IČ DPH: <span {...editProps("icdph")}>{data.icdph}</span></p>
                  )}
                </div>
              </div>
            </div>

            {/* CONTACTS SECTION */}
            <div className="space-y-8">
              <div className={!data.show_tel && editMode ? 'opacity-50' : ''}>
                <AdminToggle field="show_tel" label="Telefón" />
                {(data.show_tel || editMode) && (
                  <div className="group">
                    <div className="flex items-center gap-3 mb-2">
                      <Phone size={18} className="opacity-60" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Tel. kontakt</h4>
                    </div>
                    <p {...editProps("tel")} className={`text-xl border-b border-white/20 pb-1 font-light ${editProps("tel").className}`}>
                      {data.tel}
                    </p>
                  </div>
                )}
              </div>

              <div className={!data.show_email && editMode ? 'opacity-50' : ''}>
                <AdminToggle field="show_email" label="E-mail" />
                {(data.show_email || editMode) && (
                  <div className="group">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail size={18} className="opacity-60" />
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">E-mail</h4>
                    </div>
                    <p {...editProps("email")} className={`text-xl border-b border-white/20 pb-1 font-light break-all ${editProps("email").className}`}>
                      {data.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
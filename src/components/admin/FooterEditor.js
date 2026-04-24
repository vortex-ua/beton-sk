"use client";
import { useState } from "react";
import { saveContent } from "@/actions/adminActions";
import { Save } from "lucide-react";

export default function FooterEditor({ dbData }) {
  const [data, setData] = useState(dbData || {
    firma: "BART Complex s.r.o.",
    adresa: "Novojelčanská 845/63 925 23 Jelka",
    ico: "51921979",
    dic: "2120839974",
    icdph: "SK2120839974",
    email1: "info@beton-plotysk.sk",
    email2: "ploty.pezinok@gmail.com",
    tel: "0911 640 097",
    fb_link: "https://www.facebook.com/bartcomplex",
    ig_link: "https://www.facebook.com/bartcomplex"
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    await saveContent("global", "footer", data);
    setLoading(false);
    alert("Údaje v pätičke boli uložené.");
  };

  return (
    <div className="space-y-8 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* FIREMNÉ ÚDAJE */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Firma & Sídlo</label>
          <input name="firma" value={data.firma} onChange={handleChange} className="w-full bg-slate-50 border-b border-slate-200 p-2 text-sm font-bold uppercase focus:border-black outline-none" />
          <input name="adresa" value={data.adresa} onChange={handleChange} className="w-full bg-slate-50 border-b border-slate-200 p-2 text-sm font-bold uppercase focus:border-black outline-none" />
          <div className="grid grid-cols-2 gap-4 pt-4">
            <input name="ico" placeholder="IČO" value={data.ico} onChange={handleChange} className="bg-slate-50 border-b border-slate-200 p-2 text-xs outline-none" />
            <input name="dic" placeholder="DIČ" value={data.dic} onChange={handleChange} className="bg-slate-50 border-b border-slate-200 p-2 text-xs outline-none" />
          </div>
          <input name="icdph" placeholder="IČ DPH" value={data.icdph} onChange={handleChange} className="w-full bg-slate-50 border-b border-slate-200 p-2 text-xs outline-none" />
        </div>

        {/* KONTAKTY */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Kontaktné údaje</label>
          <input name="email1" value={data.email1} onChange={handleChange} className="w-full bg-slate-50 border-b border-slate-200 p-2 text-sm font-bold focus:border-black outline-none" />
          <input name="email2" value={data.email2} onChange={handleChange} className="w-full bg-slate-50 border-b border-slate-200 p-2 text-sm font-bold focus:border-black outline-none" />
          <input name="tel" value={data.tel} onChange={handleChange} className="w-full bg-slate-50 border-b border-slate-200 p-2 text-sm font-black focus:border-black outline-none" />
        </div>

        {/* SOCIÁLNE SIETE */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block">Sociálne siete</label>
          <input name="fb_link" placeholder="Facebook Link" value={data.fb_link} onChange={handleChange} className="w-full bg-slate-50 border-b border-slate-200 p-2 text-xs outline-none" />
          <input name="ig_link" placeholder="Instagram Link" value={data.ig_link} onChange={handleChange} className="w-full bg-slate-50 border-b border-slate-200 p-2 text-xs outline-none" />
        </div>

      </div>

      <div className="pt-8 border-t border-slate-100 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-3 bg-black text-white px-10 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all disabled:opacity-50"
        >
          <Save size={16} /> {loading ? "Ukladám..." : "Uložiť pätičku"}
        </button>
      </div>
    </div>
  );
}
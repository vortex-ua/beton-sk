"use client";
import { useState } from "react";
import { saveContent } from "@/actions/adminActions";
import { Save, Image as ImageIcon, Layout } from "lucide-react";

export default function HeroEditor({ dbData }) {
  const [data, setData] = useState(dbData || {
    subtitle: "Tradičná slovenská kvalita // Od 2009", show_subtitle: true,
    title_white: "PRÉMIOVÉ",
    title_red: "BETÓNOVÉ",
    title_end: "PLOTY",
    description: "Zvyšujeme hodnotu vašej nehnuteľnosti plotmi, ktoré vydržia generácie.",
    bg_image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070",
    cta1_text: "Prezrieť kolekcie", cta1_link: "/kolekcie", show_cta1: true,
    cta2_text: "Cenová ponuka", cta2_link: "/kontakt", show_cta2: true,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setData({ ...data, [name]: type === "checkbox" ? checked : value });
  };

  const handleSave = async () => {
    setLoading(true);
    await saveContent("domov", "hero", data);
    setLoading(false);
    alert("Hero sekcia bola úspešne aktualizovaná.");
  };

  const Toggle = ({ name, label, checked }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input type="checkbox" name={name} checked={checked} onChange={handleChange} className="sr-only" />
        <div className={`w-8 h-4 rounded-full transition-colors ${checked ? 'bg-[#dc2626]' : 'bg-slate-200'}`}></div>
        <div className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full transition-transform ${checked ? 'translate-x-4' : ''}`}></div>
      </div>
      <span className={`text-[9px] font-black uppercase tracking-widest ${checked ? 'text-slate-900' : 'text-slate-400'}`}>
        {label}
      </span>
    </label>
  );

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* TEXT SETTINGS */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <Toggle name="show_subtitle" label="Horný podnadpis" checked={data.show_subtitle} />
            <input name="subtitle" value={data.subtitle} onChange={handleChange} className="w-full bg-slate-50 p-4 text-xs font-bold uppercase tracking-widest border-b border-slate-200 outline-none focus:border-[#dc2626]" />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-400 uppercase">Biela časť</label>
               <input name="title_white" value={data.title_white} onChange={handleChange} className="w-full bg-slate-50 p-3 text-sm font-black outline-none border-b border-slate-200 focus:border-black" />
            </div>
            <div className="space-y-2">
               <label className="text-[9px] font-black text-[#dc2626] uppercase">Červená časť</label>
               <input name="title_red" value={data.title_red} onChange={handleChange} className="w-full bg-slate-50 p-3 text-sm font-black text-[#dc2626] outline-none border-b border-[#dc2626] focus:border-[#dc2626]" />
            </div>
            <div className="space-y-2">
               <label className="text-[9px] font-black text-slate-400 uppercase">Koniec nadpisu</label>
               <input name="title_end" value={data.title_end} onChange={handleChange} className="w-full bg-slate-50 p-3 text-sm font-black outline-none border-b border-slate-200 focus:border-black" />
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Hlavný popis</label>
             <textarea name="description" value={data.description} onChange={handleChange} rows={3} className="w-full bg-slate-50 p-4 text-sm font-medium leading-relaxed outline-none border-b border-slate-200 focus:border-black resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-100">
             <div className="space-y-4">
                <Toggle name="show_cta1" label="Tlačidlo 1 (Red)" checked={data.show_cta1} />
                <input name="cta1_text" placeholder="Text" value={data.cta1_text} onChange={handleChange} className="w-full bg-slate-50 p-3 text-[10px] font-bold uppercase outline-none" />
                <input name="cta1_link" placeholder="URL" value={data.cta1_link} onChange={handleChange} className="w-full bg-slate-100 p-2 text-[9px] font-mono outline-none" />
             </div>
             <div className="space-y-4">
                <Toggle name="show_cta2" label="Tlačidlo 2 (Outline)" checked={data.show_cta2} />
                <input name="cta2_text" placeholder="Text" value={data.cta2_text} onChange={handleChange} className="w-full bg-slate-50 p-3 text-[10px] font-bold uppercase outline-none" />
                <input name="cta2_link" placeholder="URL" value={data.cta2_link} onChange={handleChange} className="w-full bg-slate-100 p-2 text-[9px] font-mono outline-none" />
             </div>
          </div>
        </div>

        {/* MEDIA SETTINGS */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-6 rounded-[2px] space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#dc2626] mb-2">
              <ImageIcon size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Background_Image</span>
            </div>
            <div className="aspect-video w-full bg-black rounded-[2px] overflow-hidden border border-white/10 relative group">
              <img src={data.bg_image} alt="Preview" className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
            <input 
              name="bg_image" 
              value={data.bg_image} 
              onChange={handleChange} 
              placeholder="Vložte URL obrázka"
              className="w-full bg-white/5 border border-white/10 p-3 text-[10px] text-white font-mono outline-none focus:border-[#dc2626]" 
            />
          </div>
        </div>

      </div>

      <div className="pt-10 border-t border-slate-100 flex justify-end">
        <button 
          onClick={handleSave}
          disabled={loading}
          className="bg-slate-900 text-white px-12 py-5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-[#dc2626] transition-all duration-500 rounded-[2px] flex items-center gap-4 disabled:opacity-50"
        >
          <Save size={16} /> {loading ? "Syncing..." : "Uložiť Hero Nastavenia"}
        </button>
      </div>
    </div>
  );
}
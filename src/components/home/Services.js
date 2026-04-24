"use client";
import { useState } from "react";
import { saveContent } from "@/actions/adminActions";
// Импортируем побольше иконок для выбора
import { Wrench, Ruler, Calculator, Truck, Paintbrush, FileText, ShieldCheck, Hammer, HardHat, CheckCircle, Home, Map } from "lucide-react";

// Библиотека доступных иконок
const iconLibrary = {
  Ruler: <Ruler className="text-red-600" size={32} />,
  Wrench: <Wrench className="text-red-600" size={32} />,
  Calculator: <Calculator className="text-red-600" size={32} />,
  Truck: <Truck className="text-red-600" size={32} />,
  Paintbrush: <Paintbrush className="text-red-600" size={32} />,
  FileText: <FileText className="text-red-600" size={32} />,
  ShieldCheck: <ShieldCheck className="text-red-600" size={32} />,
  Hammer: <Hammer className="text-red-600" size={32} />,
  HardHat: <HardHat className="text-red-600" size={32} />,
  CheckCircle: <CheckCircle className="text-red-600" size={32} />,
  Home: <Home className="text-red-600" size={32} />,
  Map: <Map className="text-red-600" size={32} />
};

const defaultData = {
  hlavnyNadpis: "SLUŽBY",
  podnadpis: "Od prvého kontaktu až po hotový plot. Všetko pod jednou strechou.",
  
  s1_titul: "ZAMERANIE PLOTU",
  s1_popis: "Presné zameranie na mieste stavby pre bezchybnú realizáciu.",
  s1_icon: "Ruler", // Сохраняем имя иконки
  
  s2_titul: "ODBORNÉ PORADENSTVO",
  s2_popis: "Pomôžeme vám vybrať správny typ plotu pre váš pozemok.",
  s2_icon: "Wrench",
  
  s3_titul: "CENOVÁ KALKULÁCIA",
  s3_popis: "Transparentná cenová ponuka bez skrytých poplatkov.",
  s3_icon: "Calculator",
  
  s4_titul: "KOMPLETNÁ MONTÁŽ",
  s4_popis: "Profesionálna montáž vrátane výkopových prác a osadenia stĺpov. Cena dohodou.",
  s4_icon: "Truck",
  
  s5_titul: "STRIEKANIE A RENOVÁCIA",
  s5_popis: "Obnovíme vzhľad vašich existujúcich betónových plotov.",
  s5_icon: "Paintbrush",
  
  s6_titul: "OHLASOVACIA POVINNOSŤ",
  s6_popis: "Zabezpečíme všetky potrebné dokumenty pre stavebný úrad.",
  s6_icon: "FileText",
};

export default function Services({ editMode = false, dbData = defaultData }) {
  const [content, setContent] = useState({ ...defaultData, ...dbData });

  // Функция сохранения текста (при потере фокуса)
  const handleBlur = async (field, event) => {
    const newText = event.target.innerText;
    if (newText !== content[field]) {
      const updatedContent = { ...content, [field]: newText };
      setContent(updatedContent);
      await saveContent("domov", "domov-sluzby", updatedContent);
    }
  };

  // НОВАЯ ФУНКЦИЯ: Сохранение иконки (при выборе из выпадающего списка)
  const handleIconChange = async (field, event) => {
    const newIconName = event.target.value;
    const updatedContent = { ...content, [field]: newIconName };
    setContent(updatedContent);
    await saveContent("domov", "domov-sluzby", updatedContent);
  };

  const getEditableProps = (field) => {
    if (!editMode) return {};
    return {
      contentEditable: true,
      suppressContentEditableWarning: true,
      onBlur: (e) => handleBlur(field, e),
      className: "hover:outline hover:outline-2 hover:outline-red-500 hover:bg-red-50/50 transition-all cursor-text rounded px-1",
    };
  };

  // Компонент для отрисовки карточки услуги
  const ServiceCard = ({ titulField, popisField, iconField }) => (
    <div className="group bg-white p-10 rounded-2xl border border-slate-100 transition-all hover:shadow-2xl hover:-translate-y-2">
      <div className="mb-8 transition-transform group-hover:scale-110 duration-500">
        {iconLibrary[content[iconField]] || <CheckCircle className="text-red-600" size={32} />}
      </div>
      <h3 {...getEditableProps(titulField)} className="text-xl font-black text-slate-900 mb-4 uppercase tracking-tighter">
        {content[titulField]}
      </h3>
      <p {...getEditableProps(popisField)} className="text-slate-500 leading-relaxed font-medium text-sm">
        {content[popisField]}
      </p>
      <div className="w-0 group-hover:w-full h-1 bg-red-600 mt-6 transition-all duration-500"></div>
    </div>
  );

  return (
    <section id="sluzby" className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ЕДИНЫЙ ЗАГОЛОВОК */}
        <div className="text-center mb-20 flex flex-col items-center">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-1 bg-red-600"></div>
            <span className="text-red-500 font-black uppercase tracking-[0.3em] text-xs">Naše služby</span>
            <div className="w-12 h-1 bg-red-600"></div>
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-slate-900 uppercase tracking-tighter leading-none">
            Kompletný servis
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ServiceCard index="1" titulField="s1_titul" popisField="s1_popis" iconField="s1_icon" />
          <ServiceCard index="2" titulField="s2_titul" popisField="s2_popis" iconField="s2_icon" />
          <ServiceCard index="3" titulField="s3_titul" popisField="s3_popis" iconField="s3_icon" />
          <ServiceCard index="4" titulField="s4_titul" popisField="s4_popis" iconField="s4_icon" />
          <ServiceCard index="5" titulField="s5_titul" popisField="s5_popis" iconField="s5_icon" />
          <ServiceCard index="6" titulField="s6_titul" popisField="s6_popis" iconField="s6_icon" />
        </div>
      </div>
    </section>
  );
}
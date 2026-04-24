"use client";
import { useState } from "react";
import { saveContent } from "@/actions/adminActions";
import { Ruler, Lightbulb, Calculator, Tag } from "lucide-react"; // Заменил иконку на Tag (Бирка)

const defaultData = {
  b1_title: "Zameranie plotu",
  b1_val: "ZDARMA",
  b2_title: "Odborné poradenstvo",
  b2_val: "ZDARMA",
  b3_title: "Cenová kalkulácia",
  b3_val: "ZDARMA",
  b4_title: "Akciová zľava",
  b4_val: "-15%",
};

export default function Benefits({ editMode = false, dbData = {} }) {
  const safeData = {
    b1_title: dbData?.b1_title ?? defaultData.b1_title,
    b1_val: dbData?.b1_val ?? defaultData.b1_val,
    b2_title: dbData?.b2_title ?? defaultData.b2_title,
    b2_val: dbData?.b2_val ?? defaultData.b2_val,
    b3_title: dbData?.b3_title ?? defaultData.b3_title,
    b3_val: dbData?.b3_val ?? defaultData.b3_val,
    b4_title: dbData?.b4_title ?? defaultData.b4_title,
    b4_val: dbData?.b4_val ?? defaultData.b4_val,
  };

  const [content, setContent] = useState(safeData);

  const handleBlur = async (field, event) => {
    const newText = event.target.innerText.trim();
    const finalText = newText === "" ? defaultData[field] : newText;

    if (finalText !== content[field]) {
      const updated = { ...content, [field]: finalText };
      setContent(updated);
      await saveContent("global", "vyhody", updated);
    } else {
      event.target.innerText = content[field];
    }
  };

  const getEditableProps = (field) => {
    if (!editMode) return {};
    return {
      contentEditable: true,
      suppressContentEditableWarning: true,
      onBlur: (e) => handleBlur(field, e),
      className: "hover:outline hover:outline-2 hover:outline-red-400 hover:bg-red-50 transition-all cursor-text rounded px-1 inline-block min-w-[30px] empty:bg-red-500/20 empty:after:content-['[Text]'] empty:after:text-red-400 empty:after:text-sm",
      title: "Kliknite pre úpravu"
    };
  };

  // Дизайн отдельной карточки
  const cardClasses = `p-6 rounded-2xl flex items-start gap-5 transition-all ${editMode ? 'border-2 border-dashed border-red-300 bg-white' : 'bg-white border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)]'
    }`;

  return (
    <div className="relative">
      {editMode && (
        <div className="absolute -top-8 left-0 text-red-500 text-xs font-bold uppercase tracking-widest">
          Úprava: Globálne výhody
        </div>
      )}

      {/* Просторная сетка: 1 колонка на мобилках, 2 колонки на ПК */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6 mt-8">

        {/* Блок 1 */}
        <div className={cardClasses}>
          <div>
            <p {...getEditableProps("b1_title")} className="text-sm font-medium text-slate-500 mb-1">{content.b1_title}</p>
            <p {...getEditableProps("b1_val")} className="font-black text-xl text-slate-900 uppercase tracking-tight">{content.b1_val}</p>
          </div>
        </div>

        {/* Блок 2 */}
        <div className={cardClasses}>
          <div>
            <p {...getEditableProps("b2_title")} className="text-sm font-medium text-slate-500 mb-1">{content.b2_title}</p>
            <p {...getEditableProps("b2_val")} className="font-black text-xl text-slate-900 uppercase tracking-tight">{content.b2_val}</p>
          </div>
        </div>

        {/* Блок 3 */}
        <div className={cardClasses}>
          <div>
            <p {...getEditableProps("b3_title")} className="text-sm font-medium text-slate-500 mb-1">{content.b3_title}</p>
            <p {...getEditableProps("b3_val")} className="font-black text-xl text-slate-900 uppercase tracking-tight">{content.b3_val}</p>
          </div>
        </div>
        <div className={cardClasses}>
          <div>
            <p {...getEditableProps("b4_title")} className="text-sm font-medium text-slate-500 mb-1">{content.b4_title}</p>
            <p {...getEditableProps("b4_val")} className="font-black text-xl text-slate-900 uppercase tracking-tight">{content.b4_val}</p>
          </div>
        </div>


      </div>
    </div>
  );
}
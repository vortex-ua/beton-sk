"use client";
import { useState, useRef } from "react";
import { saveContent } from "@/actions/adminActions";
import { Quote, Plus, Trash2, User, ChevronLeft, ChevronRight } from "lucide-react";

const defaultReviews = [
  {
    id: 1,
    text: "Plot stojí už 8 rokov a vyzerá ako nový. Žiadne praskliny, žiadne problémy.",
    autor: "Martin K.",
    mesto: "Bratislava"
  }
];

export default function Reviews({ editMode = false, dbData }) {
  const [reviews, setReviews] = useState(dbData?.items || defaultReviews);
  const [title, setTitle] = useState(dbData?.title || "ČO HOVORIA NAŠI ZÁKAZNÍCI");
  const scrollRef = useRef(null);

  const saveAll = async (newReviews, newTitle) => {
    await saveContent("domov", "domov-recenzie", { 
      items: newReviews || reviews, 
      title: newTitle || title 
    });
  };

  const handleTextChange = (id, field, value) => {
    const updated = reviews.map(r => r.id === id ? { ...r, [field]: value } : r);
    setReviews(updated);
  };

  const addReview = () => {
    const newReview = {
      id: Date.now(),
      text: "Nová recenzia...",
      autor: "Meno Zákazníka",
      mesto: "Mesto"
    };
    const updated = [...reviews, newReview];
    setReviews(updated);
    saveAll(updated);
  };

  const deleteReview = (id) => {
    if (confirm("Naozaj vymazať?")) {
      const updated = reviews.filter(r => r.id !== id);
      setReviews(updated);
      saveAll(updated);
    }
  };

  // Функция для прокрутки кнопками (если захочешь добавить кнопки влево-вправо)
  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className={`py-24 bg-[#0f172a] text-white overflow-hidden relative ${editMode ? 'border-y-2 border-red-500/30' : ''}`}>
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) => { setTitle(e.target.innerText); saveAll(reviews, e.target.innerText); }}
              className={`text-4xl md:text-6xl font-black tracking-tight uppercase leading-none ${editMode ? 'outline-none focus:bg-white/10 p-2 rounded' : ''}`}
            >
              {title}
            </h2>
          </div>
          
          <div className="flex gap-4">
            {editMode && (
              <button 
                onClick={addReview}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-full font-bold transition-all text-sm shrink-0"
              >
                <Plus size={18} /> Pridať recenziu
              </button>
            )}
            {/* Кнопки навигации для ПК */}
            <div className="flex gap-2">
                <button onClick={() => scroll('left')} className="p-3 rounded-full border border-slate-700 hover:bg-slate-800 transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <button onClick={() => scroll('right')} className="p-3 rounded-full border border-slate-700 hover:bg-slate-800 transition-colors">
                    <ChevronRight size={20} />
                </button>
            </div>
          </div>
        </div>

        {/* Контейнер со скроллом */}
        <div 
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-12 custom-scrollbar cursor-grab active:cursor-grabbing"
          style={{ scrollBehavior: 'smooth' }}
        >
          {/* Отступ в начале */}
          <div className="min-w-[1px] h-1 shrink-0"></div>
          
          {reviews.map((rev) => (
            <div 
              key={rev.id} 
              className="min-w-[320px] md:min-w-[450px] snap-center bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-white/5 flex flex-col relative group"
            >
              {editMode && (
                <button 
                  onClick={() => deleteReview(rev.id)}
                  className="absolute top-6 right-6 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}

              <Quote className="text-red-600 mb-8 opacity-40" size={48} />
              
              <p 
                contentEditable={editMode}
                suppressContentEditableWarning
                onBlur={(e) => { handleTextChange(rev.id, 'text', e.target.innerText); saveAll(); }}
                className="text-lg md:text-xl text-slate-200 leading-relaxed mb-10 font-light italic outline-none"
              >
                {rev.text}
              </p>

              <div className="mt-auto flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center text-slate-400 border border-white/5">
                  <User size={28} />
                </div>
                <div>
                  <div 
                    contentEditable={editMode}
                    suppressContentEditableWarning
                    onBlur={(e) => { handleTextChange(rev.id, 'autor', e.target.innerText); saveAll(); }}
                    className="font-bold text-white uppercase tracking-widest text-sm outline-none"
                  >
                    {rev.autor}
                  </div>
                  <div 
                    contentEditable={editMode}
                    suppressContentEditableWarning
                    onBlur={(e) => { handleTextChange(rev.id, 'mesto', e.target.innerText); saveAll(); }}
                    className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1 outline-none"
                  >
                    {rev.mesto}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Отступ в конце */}
          <div className="min-w-[1px] h-1 shrink-0"></div>
        </div>
      </div>

      {/* Стили для красивого скроллбара */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          margin: 0 100px;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(220, 38, 38, 0.4);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(220, 38, 38, 0.8);
        }
        /* Для Firefox */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(220, 38, 38, 0.4) rgba(255, 255, 255, 0.05);
        }
      `}} />
    </section>
  );
}
"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { saveContent } from "@/actions/adminActions";
import { submitReview } from "@/actions/reviewActions";
import { Quote, Plus, Trash2, ChevronLeft, ChevronRight, X } from "lucide-react";

const defaultReviews = [
  { id: 1, text: "Plot stojí už 8 rokov a vyzerá ako nový. Žiadne praskliny, žiadne problémy. Maximálna spokojnosť s prístupom aj montážou od začiatku až do konca.", autor: "Martin K.", mesto: "Bratislava" }
];

export default function Reviews({ editMode = false, dbData, approvedReviews = [] }) {
  const [staticReviews, setStaticReviews] = useState(dbData?.items || defaultReviews);
  const [title, setTitle] = useState(dbData?.title || "HLAS NAŠICH ZÁKAZNÍKOV");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedReview, setExpandedReview] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = (expandedReview || isFormOpen) ? 'hidden' : 'unset';
  }, [expandedReview, isFormOpen]);

  const displayReviews = useMemo(() => {
    const fromDb = approvedReviews.map(r => ({
      id: `db-${r.id}`, text: r.text, autor: r.author, mesto: 'Overený zákazník', isFromDb: true
    }));
    return [...staticReviews, ...fromDb];
  }, [staticReviews, approvedReviews]);

  const saveAll = async (newReviews, newTitle) => {
    await saveContent("domov", "domov-recenzie", { items: newReviews || staticReviews, title: newTitle || title });
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const res = await submitReview(formData);
    if (res.success) {
      alert("Ďakujeme!");
      setIsFormOpen(false);
      e.target.reset();
    }
    setIsSubmitting(false);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-black text-white overflow-hidden relative border-t border-neutral-900 font-sans">
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        {/* HEADER СЕКЦИИ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-10 border-l-4 border-red-600 pl-8">
          <div className="max-w-4xl">
            <h2 
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) => { const nt = e.target.innerText; setTitle(nt); saveAll(staticReviews, nt); }}
              className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-[0.8] outline-none break-words"
            >
              {title}
            </h2>
          </div>
          
          <div className="flex gap-1 shrink-0">
            {!editMode && (
              <button onClick={() => setIsFormOpen(true)} className="bg-white text-black hover:bg-red-600 hover:text-white px-6 py-4 font-black uppercase tracking-widest text-[10px] transition-all mr-4">
                Pridať
              </button>
            )}
            <button onClick={() => scroll('left')} className="p-4 bg-neutral-900 border border-neutral-800 hover:bg-red-600 transition-all"><ChevronLeft size={20}/></button>
            <button onClick={() => scroll('right')} className="p-4 bg-neutral-900 border border-neutral-800 hover:bg-red-600 transition-all"><ChevronRight size={20}/></button>
          </div>
        </div>

        {/* СЛАЙДЕР */}
        <div ref={scrollRef} className="grid grid-flow-col auto-cols-[100%] md:auto-cols-[500px] gap-0 overflow-x-auto snap-x snap-mandatory pb-8 no-scrollbar" style={{ scrollBehavior: 'smooth' }}>
          {displayReviews.map((rev, idx) => {
            const isLong = rev.text.length > 120;
            return (
              <div key={rev.id} className="snap-center p-2">
                <div className="bg-[#050505] h-full p-10 md:p-14 border border-neutral-900 flex flex-col justify-between min-h-[400px]">
                  <div className="space-y-6">
                    <Quote className="text-red-600 opacity-20" size={32} />
                    <p className="text-xl md:text-2xl font-light text-slate-200 leading-snug italic break-words">
                      "{editMode ? rev.text : (isLong ? rev.text.substring(0, 120) + "..." : rev.text)}"
                    </p>
                    {isLong && !editMode && (
                      <button onClick={() => setExpandedReview(rev)} className="text-[10px] font-black uppercase tracking-[0.2em] text-red-600 border-b border-red-600/20 pb-0.5">Čítať viac</button>
                    )}
                  </div>
                  <div className="flex items-center gap-4 pt-8 border-t border-neutral-900 mt-10">
                    <div className="font-black text-white uppercase tracking-tighter text-lg truncate">{rev.autor}</div>
                    <div className="text-red-600 text-[8px] font-black uppercase tracking-widest">{rev.mesto}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* МОДАЛКА: 50% ШИРИНЫ + ВЕРТИКАЛЬНЫЙ СКРОЛЛ */}
      {expandedReview && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setExpandedReview(null)}></div>
          
          <div 
            className="relative z-10 w-full md:w-1/2 bg-black border border-neutral-800 flex flex-col max-h-[85vh] shadow-[0_0_50px_rgba(220,38,38,0.1)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Кнопка закрытия */}
            <button 
              onClick={() => setExpandedReview(null)} 
              className="absolute top-6 right-6 text-neutral-500 hover:text-red-600 transition-all z-20"
            >
              <X size={32} />
            </button>

            {/* Контент с вертикальным скроллом */}
            <div className="p-8 md:p-16 overflow-y-auto custom-scrollbar-red">
              <Quote className="text-red-600 mb-8 opacity-30" size={48} />
              
              <div className="space-y-12">
                <p className="text-2xl md:text-3xl lg:text-4xl font-light text-white leading-tight tracking-tight italic break-words whitespace-pre-wrap">
                  "{expandedReview.text}"
                </p>
                
                <div className="pt-10 border-t border-neutral-900">
                  <div className="font-black text-white uppercase tracking-tighter text-2xl">{expandedReview.autor}</div>
                  <div className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mt-2 border border-red-600/20 px-3 py-1 w-fit">
                    {expandedReview.mesto}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ФОРМА: В ТОМ ЖЕ СТИЛЕ (50% ШИРИНЫ) */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={() => setIsFormOpen(false)}></div>
          
          <form 
            onSubmit={handleClientSubmit}
            className="relative z-10 w-full md:w-1/2 bg-black border border-white p-8 md:p-16 flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-12">Napísať <br/><span className="text-red-600">Recenziu</span></h3>
            
            <div className="space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <input name="author" placeholder="MENO" required className="w-full bg-transparent border-b-2 border-neutral-800 py-4 outline-none focus:border-red-600 text-white font-black text-xl placeholder:text-neutral-900 uppercase" />
                  <input name="mesto" placeholder="MESTO" className="w-full bg-transparent border-b-2 border-neutral-800 py-4 outline-none focus:border-red-600 text-white font-black text-xl placeholder:text-neutral-900 uppercase" />
               </div>
               <textarea name="text" placeholder="VAŠA SKÚSENOSŤ..." required className="w-full bg-neutral-950 border border-neutral-800 p-8 outline-none focus:border-red-600 text-white text-xl font-medium resize-none min-h-[250px]" />
            </div>

            <div className="flex gap-4 mt-12">
               <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-5 border border-neutral-800 font-black uppercase text-xs">Zrušiť</button>
               <button disabled={isSubmitting} type="submit" className="flex-[2] py-5 bg-red-600 text-white font-black uppercase text-xs">Odoslať</button>
            </div>
          </form>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar-red::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar-red::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar-red::-webkit-scrollbar-thumb { background: #dc2626; }
      `}} />
    </section>
  );
}
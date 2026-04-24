"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { saveContent } from "@/actions/adminActions";
import { submitReview } from "@/actions/reviewActions";
import { Quote, Plus, Trash2, ChevronLeft, ChevronRight, User } from "lucide-react";

const defaultReviews = [
  { id: 1, text: "Plot stojí už 8 rokov a vyzerá ako nový. Žiadne praskliny, žiadne problémy.", autor: "Martin K.", mesto: "Bratislava" }
];

export default function Reviews({ editMode = false, dbData, approvedReviews = [] }) {
  const [staticReviews, setStaticReviews] = useState(dbData?.items || defaultReviews);
  const [title, setTitle] = useState(dbData?.title || "HLAS NAŠICH ZÁKAZNÍKOV");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (dbData?.items) setStaticReviews(dbData.items);
    if (dbData?.title) setTitle(dbData.title);
  }, [dbData]);

  const displayReviews = useMemo(() => {
    const fromDb = approvedReviews.map(r => ({
      id: `db-${r.id}`, text: r.text, autor: r.author, mesto: 'Overený zákazník', isFromDb: true
    }));
    return [...staticReviews, ...fromDb];
  }, [staticReviews, approvedReviews]);

  const saveAll = async (newReviews, newTitle) => {
    await saveContent("domov", "domov-recenzie", { 
      items: newReviews || staticReviews, title: newTitle || title 
    });
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.target);
    const res = await submitReview(formData);
    if (res.success) {
      alert("Ďakujeme! Vaša recenzia bola odoslaná na schválenie.");
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

  const getEditableProps = (field) => {
    if (!editMode) return {};
    return {
      contentEditable: true,
      suppressContentEditableWarning: true,
      className: "outline-none focus:ring-2 focus:ring-red-600 rounded hover:bg-white/5 px-1 break-words whitespace-pre-wrap",
    };
  };

  return (
    <section className="py-32 bg-black text-white overflow-hidden relative border-t border-neutral-900 selection:bg-red-900 selection:text-red-100">
      
      {/* BACKGROUND DECO TEXT */}
      <div className="absolute top-0 right-0 text-[25vw] font-black text-[#0d0d0d] leading-none select-none pointer-events-none -translate-y-1/3 uppercase">
        Clients
      </div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-10 border-l-4 border-red-600 pl-8">
          <div className="max-w-4xl overflow-hidden">
            <p className="text-red-600 font-black uppercase tracking-[0.5em] text-[9px] mb-4">Referencie / Realizácie v čase</p>
            <h2 
              {...getEditableProps("title")}
              onBlur={(e) => { const nt = e.target.innerText; setTitle(nt); saveAll(staticReviews, nt); }}
              className={`text-5xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] break-words whitespace-pre-wrap max-w-full ${editMode ? "" : "outline-none"}`}
            >
              {title}
            </h2>
          </div>
          
          <div className="flex gap-3 items-center shrink-0">
            {!editMode && (
              <button 
                onClick={() => setIsFormOpen(true)} 
                className="group bg-white text-black hover:bg-red-600 hover:text-white px-8 py-5 rounded-none font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:shadow-none"
              >
                Pridať referenciu
              </button>
            )}
            <div className="flex gap-1">
                <button onClick={() => scroll('left')} className="p-5 bg-neutral-950 border border-neutral-800 hover:bg-red-600 hover:border-red-600 transition-all">
                    <ChevronLeft size={20} className="text-neutral-500 hover:text-white"/>
                </button>
                <button onClick={() => scroll('right')} className="p-5 bg-neutral-950 border border-neutral-800 hover:bg-red-600 hover:border-red-600 transition-all">
                    <ChevronRight size={20} className="text-neutral-500 hover:text-white" />
                </button>
            </div>
          </div>
        </div>

        {/* SLIDER */}
        <div 
          ref={scrollRef} 
          className="grid grid-flow-col auto-cols-[100%] md:auto-cols-[600px] gap-0 overflow-x-auto snap-x snap-mandatory pb-12 custom-scrollbar no-scrollbar h-full" 
          style={{ scrollBehavior: 'smooth' }}
        >
          {displayReviews.map((rev, idx) => (
            <div key={rev.id} className="snap-center p-2 group h-full">
              <div className="bg-[#0a0a0a] h-full p-12 md:p-16 relative border border-neutral-800 rounded-none transition-all duration-500 group-hover:border-red-600/60 flex flex-col justify-between overflow-hidden">
                
                {/* ТЕХНИЧЕСКИЙ НОМЕР */}
                <div className="absolute top-6 left-10 text-xs font-mono text-neutral-800 group-hover:text-red-600/40 transition-colors pointer-events-none">
                  // RFRNC-{idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </div>

                {editMode && !rev.isFromDb && (
                  <button onClick={() => { if(confirm("Zmazať?")){ const u = staticReviews.filter(r => r.id !== rev.id); setStaticReviews(u); saveAll(u); } }}
                    className="absolute top-8 right-8 text-slate-700 hover:text-red-500 transition-colors z-20">
                    <Trash2 size={20} />
                  </button>
                )}

                {/* КОНТЕНТ ОТЗЫВА - с защитой от длинных слов */}
                <div className="relative z-10 space-y-12 max-w-full overflow-hidden">
                  <Quote className="text-red-600 shrink-0" size={36} strokeWidth={1.5} />
                  
                  <p 
                    className={`text-xl md:text-3xl font-light text-slate-100 leading-snug tracking-tight outline-none italic break-words whitespace-pre-wrap max-w-full ${editMode && !rev.isFromDb ? "outline-none focus:ring-2 focus:ring-red-600 rounded hover:bg-white/5" : ""}`}
                    contentEditable={editMode && !rev.isFromDb}
                    suppressContentEditableWarning
                    onBlur={(e) => { 
                      const u = staticReviews.map(r => r.id === rev.id ? { ...r, text: e.target.innerText } : r); 
                      setStaticReviews(u); saveAll(u); 
                    }}
                  >
                    "{rev.text}"
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-10 border-t border-neutral-900 mt-12 max-w-full overflow-hidden">
                  <div className="w-16 h-16 bg-neutral-950 rounded-none flex items-center justify-center text-red-600 border border-neutral-800 text-3xl font-black shadow-inner shrink-0">
                    <User size={30} strokeWidth={1}/>
                  </div>
                  <div className="overflow-hidden max-w-full">
                    <div 
                      className={`font-black text-white uppercase tracking-tighter text-2xl outline-none break-words whitespace-pre-wrap max-w-full ${editMode && !rev.isFromDb ? "outline-none focus:ring-2 focus:ring-red-600 rounded hover:bg-white/5" : ""}`}
                      contentEditable={editMode && !rev.isFromDb}
                      suppressContentEditableWarning
                      onBlur={(e) => { 
                        const u = staticReviews.map(r => r.id === rev.id ? { ...r, autor: e.target.innerText } : r); 
                        setStaticReviews(u); saveAll(u); 
                      }}
                    >
                      {rev.autor}
                    </div>
                    <div className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em] mt-1 border border-red-600/30 px-2 py-0.5 w-fit break-words">
                      {rev.mesto}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FORM MODAL */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/98 backdrop-blur-md shadow-2xl">
          <form onSubmit={handleClientSubmit} className="bg-[#050505] p-12 md:p-16 border-2 border-white w-full max-w-2xl shadow-[20px_20px_0px_0px_rgba(220,38,38,1)]">
            {/* Содержимое формы (без изменений, textarea и input переносят по дефолту) */}
            <div className="flex items-center justify-between mb-12 pb-6 border-b-2 border-white/10">
                <h3 className="text-4xl font-black uppercase tracking-tighter text-white">Pridať referenciu</h3>
                <span className="text-[9px] font-mono text-slate-700 tracking-widest">// NEW_ENTRY</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[.4em] text-slate-500 ml-1">Meno zákazníka</label>
                <input name="author" placeholder="Meno a Priezvisko" required className="w-full bg-black border border-neutral-800 p-5 outline-none focus:border-red-600 transition-all text-white placeholder:text-slate-800 font-bold text-sm rounded-none" />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[.4em] text-slate-500 ml-1">Vaše hodnotenie</label>
                <select name="rating" className="w-full bg-black border border-neutral-800 p-5 outline-none focus:border-red-600 transition-all text-white font-bold cursor-pointer appearance-none rounded-none uppercase text-sm">
                  <option value="5" className="bg-slate-900">⭐⭐⭐⭐⭐ 5/5</option>
                  <option value="4" className="bg-slate-900">⭐⭐⭐⭐ 4/5</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 mb-12">
              <label className="text-[10px] font-black uppercase tracking-[.4em] text-slate-500 ml-1">Vaša skúsenosť</label>
              <textarea name="text" placeholder="Sem napíšte vaše hodnotenie..." required className="w-full bg-black border border-neutral-800 p-5 outline-none focus:border-red-600 transition-all h-36 text-white placeholder:text-slate-800 font-medium resize-none text-sm rounded-none" />
            </div>

            <div className="flex gap-6 pt-6 border-t border-white/10">
              <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-5 font-black text-slate-500 hover:text-white uppercase tracking-widest text-[10px] transition-colors border border-neutral-800 rounded-none">Zrušiť</button>
              <button disabled={isSubmitting} type="submit" className="flex-[2] py-5 bg-red-600 hover:bg-white hover:text-black text-white font-black uppercase tracking-widest text-[10px] transition-all disabled:opacity-50 rounded-none shadow-lg">
                {isSubmitting ? "Odosielam..." : "Odoslať"}
              </button>
            </div>
          </form>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}
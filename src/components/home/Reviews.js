"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { saveContent } from "@/actions/adminActions";
import { submitReview } from "@/actions/reviewActions";
import {
  Quote, ChevronLeft, ChevronRight, X, Star
} from "lucide-react";

const defaultReviews = [
  { id: 1, text: "Plot stojí už 8 rokov a vyzerá ako nový. Žiadne praskliny, žiadne problémy. Maximálna spokojnosť s prístupom aj montážou.", autor: "Martin K.", mesto: "Bratislava", rating: 5 }
];

export default function Reviews({ editMode = false, dbData, approvedReviews = [] }) {
  const [staticReviews, setStaticReviews] = useState(dbData?.items || defaultReviews);
  const [title, setTitle] = useState(dbData?.title || "Recenzie našich klientov");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expandedReview, setExpandedReview] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = (expandedReview || isFormOpen) ? 'hidden' : 'unset';
  }, [expandedReview, isFormOpen]);

  useEffect(() => {
    if (dbData?.items) setStaticReviews(dbData.items);
    if (dbData?.title) setTitle(dbData.title);
  }, [dbData]);

  const displayReviews = useMemo(() => {
    const fromDb = approvedReviews.map(r => ({
      id: `db-${r.id}`, text: r.text, autor: r.author, mesto: 'Overený zákazník', rating: r.rating || 5, isFromDb: true
    }));
    return [...staticReviews, ...fromDb];
  }, [staticReviews, approvedReviews]);

  const saveAll = async (newReviews, newTitle) => {
    await saveContent("domov", "domov-recenzie", { items: newReviews || staticReviews, title: newTitle || title });
  };

  const handleClientSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formData = new FormData(e.target);
      const res = await submitReview(formData);
      if (res.success) {
        alert("Ďakujeme! Vaša recenzia bola odoslaná na schválenie.");
        setIsFormOpen(false);
        e.target.reset();
      } else {
        alert("Chyba: " + (res.error || "Nepodarilo sa odoslať."));
      }
    } catch (err) {
      alert("Chyba pripojenia k serveru.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-32 bg-[#F2F2F2] text-slate-900 overflow-hidden relative border-t border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 border-l-4 border-red-600 pl-8">
          <div className="max-w-2xl">
            <p className="text-[11px] uppercase tracking-[0.4em] text-red-600 mb-3 font-black">Feedback</p>
            <h2
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) => { const nt = e.target.innerText; setTitle(nt); saveAll(staticReviews, nt); }}
              className="text-4xl md:text-7xl font-black tracking-tighter uppercase outline-none break-words leading-[0.8] text-slate-900"
            >
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {!editMode && (
              <button 
                onClick={() => setIsFormOpen(true)} 
                className="px-10 py-5 bg-black text-white hover:bg-red-600 transition-all text-[11px] font-black uppercase tracking-widest rounded-none shadow-xl"
              >
                Pridať recenziu
              </button>
            )}
            <div className="flex gap-1">
                <button onClick={() => scroll('left')} className="p-4 bg-white border border-black text-black hover:bg-black hover:text-white transition-all rounded-none shadow-md"><ChevronLeft size={20} /></button>
                <button onClick={() => scroll('right')} className="p-4 bg-white border border-black text-black hover:bg-black hover:text-white transition-all rounded-none shadow-md"><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>

        {/* SLIDER */}
        <div ref={scrollRef} className="grid grid-flow-col auto-cols-[100%] md:auto-cols-[500px] gap-6 overflow-x-auto snap-x snap-mandatory pb-12 no-scrollbar" style={{ scrollBehavior: 'smooth' }}>
          {displayReviews.map((rev) => {
            const isLong = rev.text.length > 160;
            return (
              <div key={rev.id} className="snap-center h-full">
                <div className="bg-white h-full p-10 md:p-14 rounded-none flex flex-col justify-between min-h-[450px] shadow-2xl border border-slate-100 transition-transform hover:scale-[1.01]">
                  <div className="space-y-8">
                    <div className="flex justify-between items-start">
                        <Quote className="text-slate-100" size={56} />
                        <div className="flex gap-1 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={14} fill={i < (rev.rating || 5) ? "currentColor" : "none"} className={i < (rev.rating || 5) ? "text-amber-400" : "text-slate-200"} />
                          ))}
                        </div>
                    </div>
                    <p className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed italic">
                      "{editMode ? rev.text : (isLong ? rev.text.substring(0, 160) + "..." : rev.text)}"
                    </p>
                    {isLong && !editMode && (
                      <button 
                        onClick={() => setExpandedReview(rev)} 
                        className="text-[11px] font-black uppercase tracking-widest text-red-600 hover:text-black border-b-2 border-red-100 pb-1 transition-all w-fit"
                      >
                        Čítať celú skúsenosť
                      </button>
                    )}
                  </div>
                  <div className="pt-10 border-t border-slate-50 mt-10">
                    <div className="font-black text-slate-900 uppercase tracking-widest text-lg">{rev.autor}</div>
                    <div className="text-red-600 text-[10px] font-black uppercase tracking-[0.3em] mt-2">{rev.mesto}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL: DETAIL */}
      {expandedReview && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setExpandedReview(null)}></div>
          <div className="relative z-10 w-full md:w-1/2 bg-white rounded-none p-10 md:p-20 shadow-2xl max-h-[90vh] overflow-y-auto no-scrollbar border-t-8 border-red-600">
            <button onClick={() => setExpandedReview(null)} className="absolute top-8 right-8 text-slate-400 hover:text-black transition-all">
              <X size={32} />
            </button>
            <div className="space-y-12">
              <div className="flex gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} fill={i < (expandedReview.rating || 5) ? "currentColor" : "none"} />
                ))}
              </div>
              <p className="text-2xl md:text-4xl font-medium text-slate-900 leading-snug italic">
                "{expandedReview.text}"
              </p>
              <div className="pt-12 border-t border-slate-100">
                <div className="font-black text-slate-900 uppercase tracking-widest text-2xl">{expandedReview.autor}</div>
                <div className="text-red-600 text-[12px] font-black uppercase tracking-[0.4em] mt-3">{expandedReview.mesto}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: FORM */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setIsFormOpen(false)}></div>
          <form
            onSubmit={handleClientSubmit}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full md:w-1/2 bg-white rounded-none p-8 md:p-16 shadow-2xl border-t-8 border-red-600"
          >
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-black mb-12 leading-none">
              Napísať <br /><span className="text-red-600">Recenziu</span>
            </h3>

            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] text-slate-400 uppercase tracking-widest font-black">Vaše meno</label>
                  <input
                    name="author"
                    placeholder="MENO"
                    required
                    className="w-full bg-slate-50 border-b-2 border-slate-200 px-6 py-4 outline-none focus:border-red-600 text-black font-bold transition-all rounded-none"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <label className="text-[11px] text-slate-400 uppercase tracking-widest font-black">Hodnotenie</label>
                  <select
                    name="rating"
                    required
                    className="w-full bg-slate-50 border-b-2 border-slate-200 px-6 py-4 outline-none focus:border-red-600 text-black font-black uppercase cursor-pointer rounded-none appearance-none"
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5/5</option>
                    <option value="4">⭐⭐⭐⭐ 4/5</option>
                    <option value="3">⭐⭐⭐ 3/5</option>
                    <option value="2">⭐⭐ 2/5</option>
                    <option value="1">⭐ 1/5</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[11px] text-slate-400 uppercase tracking-widest font-black">Lokalita (Mesto)</label>
                <input
                  name="mesto"
                  placeholder="LOKALITA"
                  className="w-full bg-slate-50 border-b-2 border-slate-200 px-6 py-4 outline-none focus:border-red-600 text-black font-bold transition-all rounded-none"
                />
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-[11px] text-slate-400 uppercase tracking-widest font-black">Vaša skúsenosť</label>
                <textarea
                  name="text"
                  placeholder="TEXT RECENZIE..."
                  required
                  className="w-full bg-slate-50 border border-slate-200 p-8 outline-none focus:border-red-600 text-slate-900 text-lg font-medium resize-none min-h-[180px] transition-all rounded-none"
                ></textarea>
              </div>
            </div>

            <div className="flex gap-4 mt-12">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="flex-1 py-5 text-slate-400 uppercase text-[11px] font-black tracking-widest hover:text-black transition-all"
              >
                Zrušiť
              </button>
              <button
                disabled={isSubmitting}
                type="submit"
                className="flex-[2] py-5 bg-red-600 text-white font-black uppercase text-[11px] tracking-widest hover:bg-black transition-all disabled:opacity-50 rounded-none shadow-xl shadow-red-600/20"
              >
                {isSubmitting ? "Odosielam..." : "Odoslať teraz"}
              </button>
            </div>
          </form>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </section>
  );
}
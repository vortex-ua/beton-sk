"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { saveContent } from "@/actions/adminActions";
import { submitReview } from "@/actions/reviewActions";
import { Quote, Plus, Trash2, User, ChevronLeft, ChevronRight } from "lucide-react";

const defaultReviews = [
  { id: 1, text: "Plot stojí už 8 rokov...", autor: "Martin K.", mesto: "Bratislava" }
];

export default function Reviews({ editMode = false, dbData, approvedReviews = [] }) {
  // 1. Состояние для "ручных" отзывов из JSON
  const [staticReviews, setStaticReviews] = useState(dbData?.items || defaultReviews);
  const [title, setTitle] = useState(dbData?.title || "ČO HOVORIA NAŠI ZÁKAZNÍCI");
  
  // Состояния формы
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scrollRef = useRef(null);

  // 2. СИНХРОНИЗАЦИЯ: Обновляем стейт только если данные с сервера реально изменились
  // Это НЕ вызывает сохранение, только обновляет отображение
  useEffect(() => {
    if (dbData?.items) {
      setStaticReviews(dbData.items);
    }
    if (dbData?.title) {
      setTitle(dbData.title);
    }
  }, [dbData]);

  // 3. ОБЪЕДИНЕНИЕ: Смешиваем статику и базу прямо во время рендера
  const displayReviews = useMemo(() => {
    const fromDb = approvedReviews.map(r => ({
      id: `db-${r.id}`,
      text: r.text,
      autor: r.author,
      mesto: 'Overený zákazník',
      isFromDb: true
    }));
    return [...staticReviews, ...fromDb];
  }, [staticReviews, approvedReviews]);

  // 4. СОХРАНЕНИЕ: Вызывается ТОЛЬКО по клику или потере фокуса
  const saveAll = async (newReviews, newTitle) => {
    // ВАЖНО: здесь нет await внутри useEffect, только ручной вызов
    await saveContent("domov", "domov-recenzie", { 
      items: newReviews || staticReviews, 
      title: newTitle || title 
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

  return (
    <section className={`py-24 bg-[#0f172a] text-white overflow-hidden relative ${editMode ? 'border-y-2 border-red-500/30' : ''}`}>
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 
              contentEditable={editMode}
              suppressContentEditableWarning
              onBlur={(e) => { 
                const newTitle = e.target.innerText;
                setTitle(newTitle); 
                saveAll(staticReviews, newTitle); 
              }}
              className="text-4xl md:text-6xl font-black tracking-tight uppercase outline-none"
            >
              {title}
            </h2>
          </div>
          
          <div className="flex gap-4 items-center">
            {!editMode && (
              <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-6 py-3 rounded-full font-bold border border-white/10 transition-all text-sm shrink-0">
                <Plus size={18} className="text-red-500" /> Napísať recenziu
              </button>
            )}
            {editMode && (
              <button 
                onClick={() => {
                  const newReview = { id: Date.now(), text: "Nová recenzia...", autor: "Meno", mesto: "Mesto" };
                  const updated = [...staticReviews, newReview];
                  setStaticReviews(updated);
                  saveAll(updated);
                }} 
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-5 py-2.5 rounded-full font-bold transition-all text-sm shrink-0"
              >
                <Plus size={18} /> Pridať recenziu
              </button>
            )}
            <div className="flex gap-2">
                <button onClick={() => scroll('left')} className="p-3 rounded-full border border-slate-700 hover:bg-slate-800 transition-colors"><ChevronLeft size={20} /></button>
                <button onClick={() => scroll('right')} className="p-3 rounded-full border border-slate-700 hover:bg-slate-800 transition-colors"><ChevronRight size={20} /></button>
            </div>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-12 custom-scrollbar cursor-grab active:cursor-grabbing" style={{ scrollBehavior: 'smooth' }}>
          <div className="min-w-[1px] h-1 shrink-0"></div>
          
          {displayReviews.map((rev) => (
            <div key={rev.id} className="min-w-[320px] md:min-w-[450px] snap-center bg-slate-800/40 backdrop-blur-md p-8 md:p-10 rounded-[2.5rem] border border-white/5 flex flex-col relative">
              
              {editMode && !rev.isFromDb && (
                <button 
                  onClick={() => {
                    if (confirm("Vymazať?")) {
                      const updated = staticReviews.filter(r => r.id !== rev.id);
                      setStaticReviews(updated);
                      saveAll(updated);
                    }
                  }} 
                  className="absolute top-6 right-6 text-slate-500 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}

              <Quote className="text-red-600 mb-8 opacity-40" size={48} />
              
              <p 
                contentEditable={editMode && !rev.isFromDb}
                suppressContentEditableWarning
                onBlur={(e) => { 
                    const updated = staticReviews.map(r => r.id === rev.id ? { ...r, text: e.target.innerText } : r);
                    setStaticReviews(updated);
                    saveAll(updated);
                }}
                className="text-lg md:text-xl text-slate-200 leading-relaxed mb-10 font-light italic outline-none"
              >
                {rev.text}
              </p>

              <div className="mt-auto flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center text-slate-400 border border-white/5 text-xl font-bold uppercase">
                   {rev.autor[0]}
                </div>
                <div>
                  <div 
                    contentEditable={editMode && !rev.isFromDb}
                    suppressContentEditableWarning
                    onBlur={(e) => {
                        const updated = staticReviews.map(r => r.id === rev.id ? { ...r, autor: e.target.innerText } : r);
                        setStaticReviews(updated);
                        saveAll(updated);
                    }}
                    className="font-bold text-white uppercase tracking-widest text-sm outline-none"
                  >
                    {rev.autor}
                  </div>
                  <div className="text-red-500 text-[10px] font-black uppercase tracking-[0.2em] mt-1">{rev.mesto}</div>
                </div>
              </div>
            </div>
          ))}
          <div className="min-w-[1px] h-1 shrink-0"></div>
        </div>
      </div>

      {/* Модальное окно */}
      {isFormOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-sm">
          <form onSubmit={handleClientSubmit} className="bg-slate-800 p-8 rounded-[2.5rem] border border-white/10 w-full max-w-md shadow-2xl text-white">
            <h3 className="text-2xl font-bold mb-6 uppercase tracking-tight">Vaša recenzia</h3>
            <div className="space-y-4">
              <input name="author" placeholder="Vaše meno" required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-red-500 transition-colors" />
              <select name="rating" className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-red-500 transition-colors">
                <option value="5" className="bg-slate-800">⭐⭐⭐⭐⭐ (5/5)</option>
                <option value="4" className="bg-slate-800">⭐⭐⭐⭐ (4/5)</option>
                <option value="3" className="bg-slate-800">⭐⭐⭐ (3/5)</option>
              </select>
              <textarea name="text" placeholder="Vaša skúsenosť..." required className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-red-500 transition-colors h-32 text-white" />
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-4 font-bold text-slate-400 hover:text-white transition-colors">Zrušiť</button>
                <button disabled={isSubmitting} type="submit" className="flex-1 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all disabled:opacity-50 shadow-lg shadow-red-600/20">
                  {isSubmitting ? "Odosielam..." : "Odoslať"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
}
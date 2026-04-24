"use client";

import { useEffect, useState, useCallback } from "react";
import { approveReview, deleteReview, getReviewsAction } from "@/actions/reviewActions";
import { Trash2, Check, Clock, User, Star, MessageSquare, ShieldCheck, Loader2 } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Оборачиваем в useCallback, чтобы функция не пересоздавалась при каждом рендере
  const loadReviews = useCallback(async () => {
    try {
      const data = await getReviewsAction();
      setReviews(data || []);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  // Обработчики вынес в отдельные функции для чистоты JSX
  const handleApprove = async (id) => {
    const res = await approveReview(id);
    if (res?.success) loadReviews();
  };

  const handleDelete = async (id) => {
    if (confirm("Naozaj vymazať túto recenziu?")) {
      const res = await deleteReview(id);
      if (res?.success) loadReviews();
    }
  };

  // Красивый лоадер, чтобы страница не дергалась при загрузке
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-slate-50">
        <Loader2 className="animate-spin text-red-600" size={48} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Načítavam dáta...</p>
      </div>
    );
  }

  const pendingReviews = reviews.filter(r => r.status === 'PENDING');
  const approvedReviews = reviews.filter(r => r.status === 'APPROVED');

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER & STATS */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase">
              Moderácia <span className="text-red-600">recenzií</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2">Spravujte spätnú väzbu od vašich zákazníkov</p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm flex items-center gap-4 min-w-[160px]">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center">
                <Clock size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Čakajúce</p>
                <p className="text-xl font-black text-slate-900">{pendingCount(reviews)}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-sm flex items-center gap-4 min-w-[160px]">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Schválené</p>
                <p className="text-xl font-black text-slate-900">{approvedCount(reviews)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 text-center">
              <MessageSquare className="mx-auto text-slate-200 mb-4" size={64} />
              <p className="text-slate-400 font-medium">Zatiaľ ste nedostali žiadne recenzie</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div 
                key={rev.id}
                className={`group relative bg-white border rounded-[2rem] transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 ${
                  rev.status === 'PENDING' ? 'border-amber-200 ring-4 ring-amber-500/5' : 'border-slate-100'
                }`}
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
                  
                  {/* USER INFO - Исправлено rev.author[0] на безопасный вариант */}
                  <div className="flex md:flex-col items-center md:items-start gap-4 shrink-0 md:w-40">
                    <div className="w-16 h-16 bg-slate-900 rounded-3xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-slate-900/20">
                      {rev.author ? rev.author[0].toUpperCase() : "?"}
                    </div>
                    <div className="md:mt-2">
                      <h4 className="font-bold text-slate-900 leading-tight">{rev.author || "Anonym"}</h4>
                      <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mt-1">Zákazník</p>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
                          />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('sk-SK') : ""}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 text-lg leading-relaxed italic pr-4">
                      "{rev.text}"
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-row md:flex-col gap-2 w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    {rev.status === 'PENDING' ? (
                      <button 
                        onClick={() => handleApprove(rev.id)}
                        className="flex-1 md:w-40 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-green-600/20"
                      >
                        <Check size={18} /> Schváliť
                      </button>
                    ) : (
                      <div className="flex-1 md:w-40 flex items-center justify-center gap-2 bg-slate-100 text-slate-400 px-6 py-3 rounded-2xl font-bold cursor-default">
                        <ShieldCheck size={18} /> Schválené
                      </div>
                    )}
                    
                    <button 
                      onClick={() => handleDelete(rev.id)}
                      className="flex-1 md:w-40 flex items-center justify-center gap-2 text-slate-400 hover:text-red-600 hover:bg-red-50 px-6 py-3 rounded-2xl font-bold transition-all active:scale-95"
                    >
                      <Trash2 size={18} /> Zmazať
                    </button>
                  </div>
                </div>

                {rev.status === 'PENDING' && (
                  <div className="absolute -top-3 -right-3 bg-red-600 text-white text-[10px] font-black uppercase tracking-tighter px-4 py-1.5 rounded-full shadow-lg border-2 border-white animate-bounce">
                    Nová správa
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// Хелперы для подсчета, чтобы не загромождать основной рендер
function pendingCount(arr) { return arr.filter(r => r.status === 'PENDING').length; }
function approvedCount(arr) { return arr.filter(r => r.status === 'APPROVED').length; }
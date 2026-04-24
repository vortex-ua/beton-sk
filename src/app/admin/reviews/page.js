"use client";

import { useEffect, useState, useCallback } from "react";
import { approveReview, deleteReview, getReviewsAction } from "@/actions/reviewActions";
import { Trash2, Check, Clock, Star, MessageSquare, ShieldCheck, Loader2 } from "lucide-react";

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleApprove = async (id) => {
    const res = await approveReview(id);
    if (res?.success) {
      setReviews(prev => 
        prev.map(rev => rev.id === id ? { ...rev, status: 'APPROVED' } : rev)
      );
    } else {
      alert("Chyba pri schvaľovaní.");
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Naozaj vymazať túto recenziu?")) {
      const res = await deleteReview(id);
      if (res?.success) {
        setReviews(prev => prev.filter(rev => rev.id !== id));
      } else {
        alert("Chyba pri mazaní.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-slate-50">
        <Loader2 className="animate-spin text-red-600" size={48} />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Načítavam dáta...</p>
      </div>
    );
  }

  const pCount = reviews.filter(r => r.status === 'PENDING').length;
  const aCount = reviews.filter(r => r.status === 'APPROVED').length;

  return (
    // UPRAVENÉ: pt-24 (mobily) a md:pt-44 (PC) zabezpečia dostatočný odstup od navigácie
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-10 px-4 md:pt-44 md:pb-10 md:px-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER & STATS */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Moderácia <span className="text-red-600">recenzií</span>
            </h1>
            <p className="text-slate-500 font-medium mt-4">Správa spätnej väzby v reálnom čase</p>
          </div>

          <div className="flex gap-3">
            <div className="bg-white border border-slate-200 p-5 rounded-none shadow-sm flex items-center gap-4 min-w-[180px]">
              <div className="w-12 h-12 bg-amber-50 text-amber-600 flex items-center justify-center">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Čakajúce</p>
                <p className="text-2xl font-black text-slate-900 leading-none">{pCount}</p>
              </div>
            </div>
            <div className="bg-white border border-slate-200 p-5 rounded-none shadow-sm flex items-center gap-4 min-w-[180px]">
              <div className="w-12 h-12 bg-green-50 text-green-600 flex items-center justify-center">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Schválené</p>
                <p className="text-2xl font-black text-slate-900 leading-none">{aCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-none py-20 text-center">
              <MessageSquare className="mx-auto text-slate-100 mb-4" size={64} />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Žiadne recenzie na správu</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div 
                key={rev.id}
                className={`bg-white border transition-all duration-500 ${
                  rev.status === 'PENDING' ? 'border-amber-400 shadow-[8px_8px_0px_0px_rgba(245,158,11,0.1)]' : 'border-slate-200'
                }`}
              >
                <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
                  
                  {/* USER INFO */}
                  <div className="flex md:flex-col items-center md:items-start gap-4 shrink-0 md:w-40">
                    <div className="w-16 h-16 bg-slate-900 flex items-center justify-center text-white text-3xl font-black">
                      {rev.author ? rev.author[0].toUpperCase() : "?"}
                    </div>
                    <div className="overflow-hidden w-full">
                      <h4 className="font-black text-slate-900 uppercase tracking-tighter truncate text-lg">{rev.author || "Anonym"}</h4>
                      <p className="text-[9px] font-black text-red-600 uppercase tracking-[0.3em] mt-1">Overený zdroj</p>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            fill={i < rev.rating ? "currentColor" : "none"}
                            className={i < rev.rating ? "text-amber-400" : "text-slate-200"} 
                          />
                        ))}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('sk-SK') : ""}
                      </span>
                    </div>
                    
                    <p className="text-slate-700 text-xl leading-snug italic break-words whitespace-pre-wrap">
                      "{rev.text}"
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-row md:flex-col gap-2 w-full md:w-48 pt-6 md:pt-0 border-t md:border-t-0 border-slate-50">
                    {rev.status === 'PENDING' ? (
                      <button 
                        onClick={() => handleApprove(rev.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 font-black uppercase text-[10px] tracking-widest hover:bg-green-600 transition-all active:scale-95"
                      >
                        <Check size={16} /> Schváliť
                      </button>
                    ) : (
                      <div className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-600 border border-green-100 px-6 py-4 font-black uppercase text-[10px] tracking-widest cursor-default">
                        <ShieldCheck size={16} /> Publikované
                      </div>
                    )}
                    
                    <button 
                      onClick={() => handleDelete(rev.id)}
                      className="flex-1 flex items-center justify-center gap-2 text-slate-400 hover:text-red-600 hover:bg-red-50 px-6 py-4 font-black uppercase text-[10px] tracking-widest transition-all"
                    >
                      <Trash2 size={16} /> Zmazať
                    </button>
                  </div>
                </div>

                {rev.status === 'PENDING' && (
                  <div className="bg-amber-400 text-black text-[9px] font-black uppercase tracking-widest px-4 py-1 w-full text-center">
                    Čaká na schválenie
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
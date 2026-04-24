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
        <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Načítavam dáta...</p>
      </div>
    );
  }

  const pCount = reviews.filter(r => r.status === 'PENDING').length;
  const aCount = reviews.filter(r => r.status === 'APPROVED').length;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-10 px-4 md:pt-44 md:pb-10 md:px-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER & STATS */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
          <div className="text-center lg:text-left">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Moderácia <span className="text-red-600">recenzií</span>
            </h1>
            <p className="text-slate-500 text-sm font-medium mt-3 uppercase tracking-wider">Správa spätnej väzby v reálnom čase</p>
          </div>

          {/* Stats: Grid for mobile, Flex for desktop */}
          <div className="grid grid-cols-2 gap-3 md:flex md:gap-3 w-full lg:w-auto">
            <div className="bg-white border border-slate-200 p-4 md:p-5 flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 md:min-w-[180px]">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Clock size={20} className="md:w-6 md:h-6" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Čakajúce</p>
                <p className="text-xl md:text-2xl font-black text-slate-900 leading-none">{pCount}</p>
              </div>
            </div>
            
            <div className="bg-white border border-slate-200 p-4 md:p-5 flex flex-col md:flex-row items-center md:items-start gap-3 md:gap-4 md:min-w-[180px]">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={20} className="md:w-6 md:h-6" />
              </div>
              <div className="text-center md:text-left">
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest mb-1">Schválené</p>
                <p className="text-xl md:text-2xl font-black text-slate-900 leading-none">{aCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* LIST */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <div className="bg-white border border-slate-200 py-20 text-center">
              <MessageSquare className="mx-auto text-slate-100 mb-4" size={48} />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Žiadne recenzie na správu</p>
            </div>
          ) : (
            reviews.map((rev) => (
              <div 
                key={rev.id}
                className={`bg-white border transition-all duration-500 overflow-hidden ${
                  rev.status === 'PENDING' ? 'border-amber-400 shadow-[4px_4px_0px_0px_rgba(245,158,11,0.1)] md:shadow-[8px_8px_0px_0px_rgba(245,158,11,0.1)]' : 'border-slate-200'
                }`}
              >
                {/* Pending Badge for Mobile */}
                {rev.status === 'PENDING' && (
                  <div className="bg-amber-400 text-black text-[8px] font-black uppercase tracking-[0.2em] py-1 text-center lg:hidden">
                    Čaká na schválenie
                  </div>
                )}

                <div className="p-5 md:p-8 flex flex-col lg:flex-row gap-6 md:gap-8 items-start">
                  
                  {/* USER INFO */}
                  <div className="flex lg:flex-col items-center lg:items-start gap-4 shrink-0 w-full lg:w-40">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-900 flex items-center justify-center text-white text-xl md:text-3xl font-black shrink-0">
                      {rev.author ? rev.author[0].toUpperCase() : "?"}
                    </div>
                    <div className="overflow-hidden">
                      <h4 className="font-black text-slate-900 uppercase tracking-tighter truncate text-base md:text-lg">{rev.author || "Anonym"}</h4>
                      <p className="text-[8px] font-black text-red-600 uppercase tracking-[0.2em] mt-0.5 md:mt-1">Overený zdroj</p>
                    </div>
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1 min-w-0 w-full">
                    <div className="flex items-center justify-between mb-4 md:mb-6">
                      <div className="flex gap-0.5 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            fill={i < rev.rating ? "currentColor" : "none"}
                            className={i < rev.rating ? "text-amber-400" : "text-slate-200"} 
                          />
                        ))}
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('sk-SK') : ""}
                      </span>
                    </div>
                    
                    <p className="text-slate-700 text-base md:text-xl leading-snug italic break-words whitespace-pre-wrap pr-2">
                      "{rev.text}"
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-48 pt-6 lg:pt-0 border-t lg:border-t-0 border-slate-50">
                    {rev.status === 'PENDING' ? (
                      <button 
                        onClick={() => handleApprove(rev.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-slate-900 text-white px-4 py-3 md:py-4 font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:bg-green-600 transition-all active:scale-95"
                      >
                        <Check size={14} className="shrink-0" /> Schváliť
                      </button>
                    ) : (
                      <div className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-600 border border-green-100 px-4 py-3 md:py-4 font-black uppercase text-[9px] md:text-[10px] tracking-widest cursor-default">
                        <ShieldCheck size={14} className="shrink-0" /> <span className="hidden sm:inline">Publikované</span><span className="sm:hidden">OK</span>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => handleDelete(rev.id)}
                      className="flex-1 flex items-center justify-center gap-2 text-slate-400 hover:text-red-600 hover:bg-red-50 px-4 py-3 md:py-4 font-black uppercase text-[9px] md:text-[10px] tracking-widest transition-all"
                    >
                      <Trash2 size={14} className="shrink-0" /> Zmazať
                    </button>
                  </div>
                </div>

                {/* Desktop Pending Badge */}
                {rev.status === 'PENDING' && (
                  <div className="hidden lg:block bg-amber-400 text-black text-[9px] font-black uppercase tracking-widest px-4 py-1 w-full text-center">
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
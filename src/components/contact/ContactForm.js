"use client";
import { useState } from "react";
import { sendContactEmail } from "@/actions/emailActions";

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData(event.target);
    const result = await sendContactEmail(formData);

    setLoading(false);
    if (result.success) {
      setStatus('success');
      event.target.reset();
    } else {
      setStatus('error');
    }
  }

  if (status === 'success') {
    return (
      <div className="py-10 text-center animate-in fade-in duration-500">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
          ✓
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Správa odoslaná</h3>
        <p className="text-slate-500 text-sm">Budeme vás kontaktovať v čo najkratšom čase.</p>
        <button onClick={() => setStatus(null)} className="mt-6 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
          Poslať ďalšiu správu
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Meno a priezvisko</label>
        <input 
          name="name" 
          required 
          className="w-full border-b border-slate-200 py-3 px-1 outline-none focus:border-slate-900 transition-colors bg-transparent text-slate-900" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">E-mail</label>
          <input 
            name="email" 
            type="email" 
            required 
            className="w-full border-b border-slate-200 py-3 px-1 outline-none focus:border-slate-900 transition-colors bg-transparent text-slate-900" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Telefón</label>
          <input 
            name="phone" 
            required 
            className="w-full border-b border-slate-200 py-3 px-1 outline-none focus:border-slate-900 transition-colors bg-transparent text-slate-900" 
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Vaša správa</label>
        <textarea 
          name="message" 
          required 
          rows={3} 
          className="w-full border-b border-slate-200 py-3 px-1 outline-none focus:border-slate-900 transition-colors bg-transparent resize-none text-slate-900" 
        />
      </div>

      <div className="pt-4">
        <button 
          type="submit" 
          disabled={loading}
          className="bg-slate-900 text-white px-10 py-4 text-xs font-black uppercase tracking-[0.2em] hover:bg-[#d90416] transition-colors disabled:opacity-50"
        >
          {loading ? "Odosielam..." : "Odoslať správu"}
        </button>
        {status === 'error' && (
          <p className="text-red-600 text-[10px] font-bold mt-4 uppercase tracking-widest">
            Chyba pri odosielaní. Skúste to neskôr.
          </p>
        )}
      </div>
    </form>
  );
}
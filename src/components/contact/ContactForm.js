"use client";
import { useState } from "react";
import { sendLead } from "@/actions/contactActions";
import { Send, CheckCircle2 } from "lucide-react";

export default function ContactForm() {
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("loading");
    const formData = new FormData(e.target);
    const result = await sendLead(formData);
    if (result.success) setStatus("success");
    else {
      alert("Chyba pri odosielaní.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="py-10 text-center">
        <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-900">Odoslané!</h3>
      </div>
    );
  }

  // Используем clamp или просто адаптивные отступы
  const inputStyle = "w-full bg-transparent border-b border-slate-200 py-2 md:py-3 outline-none focus:border-slate-900 transition-colors placeholder:text-slate-400 text-slate-700 font-light mb-4 md:mb-6 text-sm md:text-base";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col w-full">
      <input type="text" name="meno_sprava" required placeholder="Meno a Priezvisko" className={inputStyle} />
      <input type="email" name="email_spravas" required placeholder="Váš e-mail" className={inputStyle} />
      <input type="tel" name="tel_sprava" required placeholder="Váš telefón" defaultValue="+" className={inputStyle} />
      <input type="text" name="predmet" required placeholder="Predmet správy" className={inputStyle} />
      
      <div className="relative mb-6 md:mb-8">
         <label className="text-slate-900 font-bold text-[10px] md:text-xs mb-1 block uppercase tracking-wider">Správa</label>
         <textarea 
            name="text_sprava" 
            required 
            rows={1} 
            className="w-full bg-transparent border-b border-slate-200 py-2 outline-none focus:border-slate-900 resize-none font-light text-sm md:text-base"
         ></textarea>
      </div>

      <div className="flex items-start gap-3 mb-8">
        <input type="checkbox" required className="mt-1 shrink-0 w-3.5 h-3.5 accent-slate-900 cursor-pointer" />
        <p className="text-[10px] md:text-[11px] leading-tight text-slate-500">
          Súhlasím so spracovaním osobných údajov (GDPR).
        </p>
      </div>

      <button 
        type="submit" 
        disabled={status === "loading"}
        className="w-full sm:w-fit bg-[#272f60] hover:bg-[#1a1f40] text-white px-8 py-3 md:py-4 flex items-center justify-center gap-3 font-bold transition-all disabled:opacity-50 text-xs md:text-sm uppercase tracking-widest"
      >
        <Send size={16} />
        {status === "loading" ? "Odosielam..." : "Odoslať správu"}
      </button>
    </form>
  );
}
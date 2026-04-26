"use client";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Lock, ShieldAlert } from "lucide-react";

export default function SignIn() {
  const [error, setError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      username: e.target.username.value,
      password: e.target.password.value,
      callbackUrl: "/admin/editor", // Куда редиректить после входа
      redirect: true,
    });
    if (!res?.ok) setError(true);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-[#111] border border-white/10 p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626]"></div>
        
        <div className="mb-10 text-center">
          <div className="inline-block p-4 bg-white/5 rounded-full mb-4 border border-white/10 text-[#dc2626]">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic leading-none">
            System_Access <br />
            <span className="text-[#dc2626]">Restricted</span>
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input 
            name="username" 
            placeholder="ADMIN_ID" 
            className="w-full bg-white/5 border border-white/10 p-4 text-white font-mono text-xs uppercase outline-none focus:border-[#dc2626] transition-all"
            required 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="ACCESS_CODE" 
            className="w-full bg-white/5 border border-white/10 p-4 text-white font-mono text-xs uppercase outline-none focus:border-[#dc2626] transition-all"
            required 
          />
          
          {error && (
            <p className="text-[#dc2626] text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
              <ShieldAlert size={14} /> Invalid_Credentials
            </p>
          )}

          <button className="w-full bg-[#dc2626] text-white py-5 text-[10px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all">
            Execute_Login
          </button>
        </form>
      </div>
    </div>
  );
}
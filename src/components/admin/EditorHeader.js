import Link from "next/link";
import { ArrowLeft, Layout, Globe } from "lucide-react";

export default function EditorHeader({ title }) {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-[100] px-6 py-4 w-full shadow-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link 
            href="/admin" 
            className="group flex items-center gap-2 text-red-600 text-xs font-bold uppercase tracking-widest mb-1 transition-all"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Späť do administrácie
          </Link>
          <div className="flex items-center gap-2">
            <Layout size={20} className="text-slate-400" />
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">
              Editor: {title}
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="hidden md:block text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Režim úprav</p>
              <p className="text-xs text-green-600 font-medium">Automatické ukladanie aktívne</p>
           </div>
           <Link 
             href="/" 
             target="_blank"
             className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2"
           >
             <Globe size={14} />
             Zobraziť web
           </Link>
        </div>
      </div>
    </div>
  );
}
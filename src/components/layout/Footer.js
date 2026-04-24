import Link from "next/link";
import { getContent } from "@/actions/adminActions";
import { Mail, Phone, MapPin } from "lucide-react";

// --- ИКОНКИ БРЕНДОВ (SVG) ---
const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
);

export default async function Footer() {
  const footerData = await getContent("global", "footer");
  
  const d = footerData || {
    firma: "BART Complex s.r.o.",
    adresa: "Novojelčanská 845/63 925 23 Jelka",
    ico: "51921979",
    dic: "2120839974",
    icdph: "SK2120839974",
    email1: "info@beton-plotysk.sk",
    tel: "0911 640 097",
    fb_link: "https://www.facebook.com/bartcomplex",
    ig_link: "https://www.facebook.com/bartcomplex"
  };

  return (
    <footer className="bg-black text-white border-t border-neutral-900 font-sans">
      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-20">
          
          {/* PREVÁDZKOVATEĽ */}
          <div className="space-y-6">
            <h4 className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">// Prevádzkovateľ</h4>
            <div className="text-slate-400 text-xs leading-relaxed space-y-4">
              <p className="text-white font-black text-sm uppercase tracking-tighter">{d.firma}</p>
              <p className="flex items-start gap-3">
                <MapPin size={14} className="shrink-0 text-neutral-700" />
                {d.adresa}
              </p>
              <div className="pt-4 border-t border-neutral-900 space-y-1 font-mono text-[10px]">
                <p>IČO: {d.ico}</p>
                <p>DIČ: {d.dic}</p>
                <p>IČ DPH: {d.icdph}</p>
              </div>
            </div>
          </div>

          {/* KONTAKT */}
          <div className="space-y-6">
            <h4 className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">// Rýchly kontakt</h4>
            <div className="space-y-6">
              <div className="bg-neutral-900/50 p-4 border-l-2 border-red-600">
                 <p className="text-[9px] font-black uppercase tracking-widest text-red-600 mb-1">Status</p>
                 <p className="text-xs font-bold uppercase tracking-tight">Fungujeme NON-STOP</p>
              </div>
              <div className="space-y-3 text-xs">
                <a href={`mailto:${d.email1}`} className="flex items-center gap-3 hover:text-red-600 transition-colors">
                  <Mail size={16} /> {d.email1}
                </a>
                <a href={`tel:${d.tel}`} className="flex items-center gap-3 text-lg font-black tracking-tighter hover:text-red-600 transition-colors pt-2">
                  <Phone size={20} /> {d.tel}
                </a>
              </div>
            </div>
          </div>

          {/* ODKAZY */}
          <div className="space-y-6">
            <h4 className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">// Sledujte nás</h4>
            <div className="flex flex-col gap-4 text-xs font-bold uppercase tracking-widest">
              <a href={d.fb_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-red-600 transition-colors">
                <FacebookIcon /> Facebook
              </a>
              <a href={d.ig_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-red-600 transition-colors">
                <InstagramIcon /> Instagram
              </a>
              <div className="pt-6 flex flex-col gap-3 text-[9px] text-slate-500 border-t border-neutral-900 font-black tracking-widest">
                <Link href="/gdpr" className="hover:text-white transition-colors">GDPR</Link>
                <Link href="/cookies" className="hover:text-white transition-colors">Cookies Policy</Link>
              </div>
            </div>
          </div>

          {/* FB WIDGET */}
          <div className="space-y-6">
            <h4 className="text-red-600 text-[10px] font-black uppercase tracking-[0.4em]">// Facebook Feed</h4>
            <div className="bg-neutral-900 border border-neutral-800 p-1 grayscale hover:grayscale-0 transition-all duration-700">
              <iframe 
                src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Fbartcomplex&tabs=timeline&width=340&height=230&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false" 
                style={{ width: '100%', height: '230px' }} 
                scrolling="no" 
                frameBorder="0" 
                allowFullScreen={true} 
                allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              ></iframe>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div className="pt-12 border-t border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[9px] font-mono text-slate-600 uppercase tracking-widest text-center md:text-left leading-relaxed">
            © 2020 - 2026 BETONOVE-PLOTYSK <br />
            Architectural Solutions
          </p>
          <div className="flex items-center gap-4 text-slate-600">
            <span className="text-[8px] font-bold uppercase tracking-[0.5em]">Developed by</span>
            <a href="https://domarstudio.sk" target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-white hover:text-red-600 transition-colors">domarstudio</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
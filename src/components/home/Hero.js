import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    // h-screen — это 100% высоты видимой части экрана
    <section className="relative h-screen w-full flex items-center justify-center bg-slate-900">
      
      {/* Фоновое изображение */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=2070" 
          alt="Betónové ploty realizácia"
          fill
          priority
          quality={90} // Повышаем качество для полноэкранного режима
          className="object-cover opacity-50" // Затемняем чуть сильнее для контраста
        />
      </div>

      {/* Контент */}
      <div className="relative z-10 text-center px-4 max-w-5xl mt-16"> 
        {/* mt-16 компенсирует высоту навбара, чтобы текст был визуально по центру */}
        
        <span className="text-red-500 font-bold tracking-[0.3em] text-xs md:text-sm uppercase mb-6 block">
          Tradičná slovenská kvalita od 2009
        </span>
        
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white leading-[1.1] tracking-tighter">
          PRÉMIOVÉ <br />
          <span className="text-red-600">BETÓNOVÉ PLOTY</span>
        </h1>
        
        <p className="mt-8 text-lg md:text-2xl text-gray-200 max-w-3xl mx-auto font-light leading-relaxed">
          Zvyšujeme hodnotu vašej nehnuteľnosti plotmi, ktoré vydržia generácie. 
          Profesionálna montáž po celom Slovensku.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center items-center">
          <Link 
            href="/ziadost" 
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-12 py-5 rounded-sm font-black text-lg transition-all uppercase tracking-widest shadow-2xl"
          >
            Cenová kalkulácia
          </Link>
          <Link 
            href="/ponuka" 
            className="w-full sm:w-auto bg-white/5 backdrop-blur-sm hover:bg-white/10 text-white border border-white/20 px-12 py-5 rounded-sm font-bold text-lg transition-all uppercase tracking-widest"
          >
            Naša ponuka
          </Link>
        </div>
      </div>

      {/* Декоративная стрелка вниз (Scroll Indicator) */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:block">
        <div className="w-[1px] h-20 bg-gradient-to-b from-red-600 to-transparent"></div>
      </div>
    </section>
  );
}
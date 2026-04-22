import Link from "next/link";
import { LayoutDashboard, MessageSquare, Phone, Home, Package, Settings } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  // Сразу посчитаем количество заявок в базе для красоты
  const leadsCount = await prisma.objednavka.count();

  const menuItems = [
    {
      title: "Hlavná stránka",
      desc: "Úprava textov, služieb a recenzií na domovskej stránke",
      icon: <Home size={24} />,
      href: "/admin/editor",
      color: "bg-blue-500"
    },
    {
      title: "Kontakt",
      desc: "Zmena telefónnych čísiel, adries a fakturačných údajov",
      icon: <Phone size={24} />,
      href: "/kontakt?edit=true",
      color: "bg-red-500"
    },
    {
      title: "Kolekcie (Produkty)",
      desc: "Správa betónových plotov a vzorov (Pripravujeme)",
      icon: <Package size={24} />,
      href: "#", 
      color: "bg-amber-500"
    },
    {
      title: "Správy (Leady)",
      desc: `Máte ${leadsCount} prijatých správ z kontaktného formulára`,
      icon: <MessageSquare size={24} />,
      href: "/admin/leads", // Скоро сделаем эту страницу
      color: "bg-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-2 text-slate-400">
            <LayoutDashboard size={20} />
            <span className="uppercase tracking-widest text-xs font-bold">Administrácia</span>
          </div>
          <h1 className="text-4xl font-black text-slate-900">Vitajte v systéme, David</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, idx) => (
            <Link 
              key={idx} 
              href={item.href}
              className="group bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex items-start gap-6"
            >
              <div className={`${item.color} text-white p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-transform`}>
                {item.icon}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">{item.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Быстрая статистика или помощь */}
        <div className="mt-12 bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h4 className="text-lg font-bold mb-1">Potrebujete pomoc?</h4>
            <p className="text-slate-400 text-sm">Systém automaticky ukladá všetky zmeny, ktoré vykonáte v editore.</p>
          </div>
          <Link href="/" className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-sm font-bold transition-colors">
            Zobraziť webstránku
          </Link>
        </div>
      </div>
    </div>
  );
}
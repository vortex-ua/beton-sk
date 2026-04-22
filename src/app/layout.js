// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar"; // Импортируем наш компонент

const inter = Inter({ 
  subsets: ["latin-ext"], 
  display: 'swap' 
});

export const metadata = {
  title: {
    default: "Betónové ploty na kľúč | beton-sk",
    template: "%s | beton-sk"
  },
  description: "Prémiové betónové ploty, ktoré zvyšujú hodnotu vášho domu. Od roku 2009 staviame ploty, ktoré pretrvajú.",
  alternates: {
    canonical: '/',
    languages: {
      'sk-SK': '/',
    },
  },
  openGraph: {
    locale: 'sk_SK',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        {/* Navbar вставляем перед {children}, чтобы он был сверху */}
        <Navbar />
        
        {/* Здесь будет рендериться контент каждой страницы */}
        {children}
        
        {/* Сюда позже добавим Footer */}
      </body>
    </html>
  );
}
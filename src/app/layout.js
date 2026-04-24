// src/app/layout.js
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/shared/SmoothScroll";

const inter = Inter({
  subsets: ["latin-ext"],
  display: 'swap'
});

export const metadata = {
  title: "Betónové ploty na kľúč | Elite Industrial",
  description: "Prémiové riešenia pre váš dom.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="sk">
      <body className={`${inter.className} antialiased`}>
        <SmoothScroll>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
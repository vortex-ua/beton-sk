"use client";
import React, { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export default function ProjectGallery({ images, title }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", loop: true });
  const [index, setIndex] = useState(-1);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  if (!images || images.length === 0) return null;

  // Форматируем изображения для Lightbox
  const slides = images.map((src) => ({ src }));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-xl font-bold text-slate-900">Galéria projektu</h3>
        <div className="flex gap-2">
          <button onClick={scrollPrev} className="p-2 rounded-full bg-white shadow-md hover:bg-slate-50 transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={scrollNext} className="p-2 rounded-full bg-white shadow-md hover:bg-slate-50 transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Карусель */}
      <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
        <div className="flex gap-4">
          {images.map((src, i) => (
            <div 
              key={i} 
              className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%] min-w-0 relative group"
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-sm">
                <img 
                  src={src} 
                  alt={`${title} - ${i + 1}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button 
                  onClick={() => setIndex(i)}
                  className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                >
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                    <Maximize2 size={24} />
                  </div>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Полноэкранный просмотр */}
      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={slides}
      />
    </div>
  );
}
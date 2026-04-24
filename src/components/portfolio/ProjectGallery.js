"use client";
import React, { useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export default function ProjectGallery({ images, title }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        loop: true,
        slidesToScroll: 1
    });
    const [index, setIndex] = useState(-1);

    const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

    if (!images || images.length === 0) return null;

    const slides = images.map((src) => ({ src }));

    return (
        <div className="space-y-6">
            {/* Заголовок и кнопки навигации */}
            <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">Galéria projektu</h3>
                <div className="flex gap-3">
                    <button onClick={scrollPrev} className="p-3 rounded-full bg-white shadow-lg hover:bg-slate-50 transition-all active:scale-95">
                        <ChevronLeft size={22} />
                    </button>
                    <button onClick={scrollNext} className="p-3 rounded-full bg-white shadow-lg hover:bg-slate-50 transition-all active:scale-95">
                        <ChevronRight size={22} />
                    </button>
                </div>
            </div>

            {/* КА Carousel: Все карточки ОДИНАКОВОГО размера */}
            <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
                <div className="flex gap-4">
                    {images.map((src, i) => (
                        <div
                            key={i}
                            className="flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_31%] min-w-0"
                        >
                            {/* aspect-video (16:9) гарантирует, что все превью будут одной высоты и ширины */}
                            <div className="relative aspect-video rounded-xl overflow-hidden shadow-md bg-slate-200 group">
                                <img
                                    src={src}
                                    alt={`${title} - ${i + 1}`}
                                    className="project-card-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <button
                                    onClick={() => setIndex(i)}
                                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center text-white"
                                >
                                    <div className="bg-white/10 backdrop-blur-md p-4 rounded-full border border-white/20 transform translate-y-4 group-hover:translate-y-0 transition-transform">
                                        <Maximize2 size={28} />
                                    </div>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Полноэкранный просмотр: Адаптация под экран */}
            <Lightbox
                index={index}
                open={index >= 0}
                close={() => setIndex(-1)}
                slides={slides}
                plugins={[]}
                carousel={{
                    padding: "0px",
                    spacing: "0px",
                    imageFit: "contain",
                }}
                render={{
                    // Упрощенный рендер без лишних div и padding
                    slide: ({ slide }) => (
                        <img
                            src={slide.src}
                            alt=""
                            className="w-full h-full object-contain"
                        />
                    ),
                }}
                styles={{
                    container: { backgroundColor: "rgba(0, 0, 0, 0.98)" },
                }}
                controller={{ closeOnBackdropClick: true }}
            />
        </div>
    );
}
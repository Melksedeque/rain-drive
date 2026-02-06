"use client";

import { motion } from "framer-motion";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { EmblaCarouselType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    text: "Depois do RainDrive eu passei a olhar pro céu com mais respeito.",
    author: "Amanda S.",
    role: "Designer @ UmbrellaWorks"
  },
  {
    text: "A interface é maravilhosa. Eu só... aprendi a ter paciência.",
    author: "Carlos M.",
    role: "Dev @ NimbusWare"
  },
  {
    text: "Organização impecável. Minha terapia também.",
    author: "Juliana R.",
    role: "PM @ PluviTech"
  },
  {
    text: "Nunca pensei que armazenamento em nuvem fosse mudar meus hábitos. Mudou.",
    author: "Roberto K.",
    role: "CFO @ Cirrus Finance"
  },
  {
    text: "Equipe brilhante. Produto ousado. Eu sobrevivi.",
    author: "Patricia L.",
    role: "CTO @ Cloud & Sons"
  },
  {
    text: "O único drive que te obriga a fazer uma pausa para o café.",
    author: "Ricardo T.",
    role: "Lead @ StormSystems"
  }
];

const logos = [
  "UmbrellaWorks", "NimbusWare", "PluviTech", "Cirrus Finance", "Cloud & Sons", "Rainforest Logistics"
];

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onInit = useCallback((emblaApi: EmblaCarouselType) => {
    setScrollSnaps(emblaApi.scrollSnapList());
  }, []);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  return (
    <section id="depoimentos" className="py-24 bg-card/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        
        {/* Trusted By */}
        <div className="mb-20 text-center">
          <p className="text-sm font-semibold text-muted-fg uppercase tracking-wider mb-8">
            Trusted by
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            {logos.map((logo) => (
              <span key={logo} className="text-xl font-bold font-mono">{logo}</span>
            ))}
          </div>
        </div>

        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">O que dizem sobre nós</h2>
          <p className="text-muted-fg">Depoimentos reais de pessoas que ainda usam nossa plataforma.</p>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-12 group">
          <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
            <div className="flex -ml-6">
              {testimonials.map((t, i) => (
                <div key={i} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-6">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="p-6 rounded-2xl bg-card border border-border relative h-full flex flex-col justify-between hover:border-accent/30 transition-colors"
                  >
                    <div>
                      <Quote className="absolute top-6 right-6 w-8 h-8 text-accent/10" />
                      <p className="text-lg mb-6 leading-relaxed relative z-10">&quot;{t.text}&quot;</p>
                    </div>
                    <div>
                      <div className="font-semibold">{t.author}</div>
                      <div className="text-sm text-muted-fg">{t.role}</div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          <button
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 sm:translate-x-0 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-fg cursor-pointer hover:text-accent hover:border-accent transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 z-10 shadow-lg"
            onClick={scrollPrev}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 sm:translate-x-0 w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-muted-fg cursor-pointer hover:text-accent hover:border-accent transition-all opacity-0 group-hover:opacity-100 disabled:opacity-0 z-10 shadow-lg"
            onClick={scrollNext}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={cn(
                "w-2 h-2 rounded-full transition-all duration-300 cursor-pointer",
                index === selectedIndex ? "bg-accent w-6" : "bg-muted-fg/30 hover:bg-muted-fg/50"
              )}
              onClick={() => scrollTo(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

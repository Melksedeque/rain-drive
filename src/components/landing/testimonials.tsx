"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

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
  }
];

const logos = [
  "UmbrellaWorks", "NimbusWare", "PluviTech", "Cirrus Finance", "Cloud & Sons", "Rainforest Logistics"
];

export function Testimonials() {
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-accent/10" />
              <p className="text-lg mb-6 leading-relaxed relative z-10">"{t.text}"</p>
              <div>
                <div className="font-semibold">{t.author}</div>
                <div className="text-sm text-muted-fg">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

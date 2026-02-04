"use client";

import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const values = [
  "Transparência (em dias úteis e céus abertos)",
  "Confiabilidade (na medida do possível)",
  "Inovação (principalmente nas partes inesperadas)",
  "Experiência do usuário (com personalidade)"
];

export function About() {
  return (
    <section id="sobre" className="py-24 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold tracking-tight mb-8"
          >
            Sobre a RainDrive Inc.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-fg leading-relaxed mb-12"
          >
            Nascemos com uma missão clara: tornar a nuvem mais... presente. 
            Unimos tecnologia moderna, design premium e uma filosofia simples: 
            se dá pra melhorar, a gente melhora. Se dá pra complicar um pouquinho, 
            a gente também considera.
          </motion.p>

          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {values.map((value, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + (index * 0.1) }}
                className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border"
              >
                <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="font-medium">{value}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { motion } from "framer-motion";
import { Zap, FolderOpen, Search, MousePointer2, Layout, CloudHail } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Upload relâmpago",
    description: "Arraste, solte e pronto. Seus arquivos sobem mais rápido do que suas expectativas."
  },
  {
    icon: FolderOpen,
    title: "Organização por pastas",
    description: "Se você gosta de controle, vai se sentir em casa. Se não gosta, vai aprender."
  },
  {
    icon: Search,
    title: "Busca inteligente",
    description: "Encontre qualquer coisa. Inclusive arrependimentos."
  },
  {
    icon: MousePointer2,
    title: "Drag & drop",
    description: "Mova tudo com a delicadeza de quem nunca perdeu um arquivo (ainda)."
  },
  {
    icon: Layout,
    title: "Interface premium",
    description: "Design limpo, responsivo e elegante. Porque o caos já é suficiente."
  },
  {
    icon: CloudHail,
    title: "Controle climático avançado",
    description: "Tecnologia de ponta para interagir com... condições atmosféricas."
  }
];

export function Features() {
  return (
    <section id="recursos" className="py-24 bg-card/30 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Recursos Essenciais</h2>
          <p className="text-muted-fg text-lg">
            Tudo o que você espera de um drive moderno. E algumas coisas que você não pediu.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-card border border-border hover:border-accent/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-fg leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

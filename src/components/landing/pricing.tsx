"use client";

import { motion } from "framer-motion";
import { Check, Cloud, CloudRain, CloudSun } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Grátis",
    price: "R$ 0",
    description: "Para quem gosta de dançar na chuva.",
    features: [
      "1GB de armazenamento",
      "Acesso apenas quando chove",
      "Upload ilimitado",
      "Suporte da comunidade"
    ],
    icon: CloudRain,
    highlight: false,
    buttonText: "Começar agora"
  },
  {
    name: "Chuva Fina",
    price: "R$ 9,90",
    period: "/mês",
    description: "Um pouco mais de flexibilidade climática.",
    features: [
      "10GB de armazenamento",
      "Acesso em chuva e dias nublados",
      "Sem anúncios",
      "Suporte prioritário"
    ],
    icon: Cloud,
    highlight: true,
    buttonText: "Assinar agora"
  },
  {
    name: "Tempestade",
    price: "R$ 29,90",
    period: "/mês",
    description: "Poder total, não importa o clima.",
    features: [
      "50GB de armazenamento",
      "Acesso liberado (quase) sempre",
      "Download prioritário",
      "Acesso antecipado a recursos"
    ],
    icon: CloudSun,
    highlight: false,
    buttonText: "Virar Premium"
  }
];

export function Pricing() {
  return (
    <section id="planos" className="py-24 bg-bg scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight mb-4">Planos Climáticos</h2>
          <p className="text-muted-fg text-lg">
            Escolha o nível de dependência meteorológica que funciona para você.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={cn(
                  "relative p-8 rounded-2xl border flex flex-col h-full transition-all duration-300",
                  plan.highlight 
                    ? "bg-accent/5 border-accent shadow-xl scale-105 z-10" 
                    : "bg-card border-border hover:border-accent/30"
                )}
              >
                {plan.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-fg text-sm font-medium rounded-full shadow-lg">
                    Mais Popular
                  </div>
                )}

                <div className="mb-8">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-6",
                    plan.highlight ? "bg-accent text-accent-fg" : "bg-accent/10 text-accent"
                  )}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-fg text-sm">{plan.period}</span>}
                  </div>
                  <p className="text-muted-fg text-sm">{plan.description}</p>
                </div>

                <div className="flex-1 mb-8">
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <Check className={cn("w-5 h-5 shrink-0", plan.highlight ? "text-accent" : "text-muted-fg")} />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button className={cn(
                  "w-full py-3 px-6 rounded-xl font-medium transition-all duration-200 cursor-pointer",
                  plan.highlight 
                    ? "bg-accent text-accent-fg hover:bg-accent/90 shadow-lg hover:shadow-accent/20" 
                    : "bg-muted text-fg hover:bg-muted/80"
                )}>
                  {plan.buttonText}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

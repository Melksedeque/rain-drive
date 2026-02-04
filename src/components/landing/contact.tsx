"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export function Contact() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    // Fake API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    setLoading(false);
    toast.success("Mensagem enviada!", {
      description: "Recebemos sua mensagem com carinho. Nossa equipe altamente treinada já está... respirando.",
    });
    
    (e.target as HTMLFormElement).reset();
  }

  return (
    <section id="contato" className="py-24 scroll-mt-20">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Fale com a gente</h2>
            <p className="text-muted-fg">
              Se você tiver dúvidas, sugestões ou apenas quiser desabafar, este é o lugar certo.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border border-border rounded-2xl p-8 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Nome</label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-bg border border-border focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                  placeholder="Seu nome"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full px-4 py-2 rounded-lg bg-bg border border-border focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">Mensagem</label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg bg-bg border border-border focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all resize-none"
                  placeholder="Conte sua história..."
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "w-full py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all cursor-pointer",
                  loading 
                    ? "bg-muted-fg/20 text-muted-fg cursor-not-allowed" 
                    : "bg-accent text-accent-fg hover:bg-accent/90"
                )}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar mensagem
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

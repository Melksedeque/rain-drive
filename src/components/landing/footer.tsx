"use client";

import Link from "next/link";
import { Logo } from "@/components/ui/logo";

export function Footer() {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    document.getElementById(href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
  };

  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="py-12 border-t border-border bg-card/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Logo onClick={handleScrollToTop} />
            <p className="text-sm text-muted-fg max-w-xs text-center md:text-left">
              RainDrive — a nuvem com atitude.
              <br />
              Perfeito. Até o clima opinar.
            </p>
          </div>

          <div className="flex gap-8">
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold text-sm">Produto</h4>
              <Link 
                href="#recursos" 
                onClick={(e) => handleScroll(e, "#recursos")}
                className="text-sm text-muted-fg hover:text-fg transition-colors cursor-pointer"
              >
                Recursos
              </Link>
              <Link 
                href="#depoimentos" 
                onClick={(e) => handleScroll(e, "#depoimentos")}
                className="text-sm text-muted-fg hover:text-fg transition-colors cursor-pointer"
              >
                Depoimentos
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="font-semibold text-sm">Empresa</h4>
              <Link 
                href="#sobre" 
                onClick={(e) => handleScroll(e, "#sobre")}
                className="text-sm text-muted-fg hover:text-fg transition-colors cursor-pointer"
              >
                Sobre
              </Link>
              <Link 
                href="#contato" 
                onClick={(e) => handleScroll(e, "#contato")}
                className="text-sm text-muted-fg hover:text-fg transition-colors cursor-pointer"
              >
                Contato
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-fg">
          <p>&copy; {new Date().getFullYear()} RainDrive Inc. Todos os direitos reservados (quando não chove).</p>
        </div>
      </div>
    </footer>
  );
}

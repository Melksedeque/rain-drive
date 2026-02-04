"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Logo } from "@/components/ui/logo";
import { ThemeToggle } from "@/components/theme-toggle";

const navItems = [
  { label: "Recursos", href: "#recursos" },
  { label: "Sobre", href: "#sobre" },
  { label: "Depoimentos", href: "#depoimentos" },
  { label: "Contato", href: "#contato" },
];

export function Header() {
  const handleScrollToTop = (e: React.MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-bg/80 backdrop-blur-md border-b border-border"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Logo onClick={handleScrollToTop} />

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(item.href.replace("#", ""))?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-sm font-medium text-muted-fg hover:text-fg transition-colors cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="hidden sm:flex items-center gap-3 border-l border-border pl-4">
            <Link
              href="/auth/login"
              className="text-sm font-medium text-muted-fg hover:text-fg transition-colors cursor-pointer"
            >
              Entrar
            </Link>
            <Link
              href="/auth/signup"
              className="bg-accent text-accent-fg px-4 py-2 rounded-md text-sm font-medium hover:bg-accent/90 transition-colors shadow-sm cursor-pointer"
            >
              Criar conta
            </Link>
          </div>
        </div>
      </div>
    </motion.header>
  );
}

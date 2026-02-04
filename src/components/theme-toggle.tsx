"use client";

import * as React from "react";
import { Moon, Sun, Laptop, Check, ChevronDown, Palette } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const themes = [
    { id: "system", label: "System", icon: Laptop },
    { id: "light", label: "Light", icon: Sun },
    { id: "noir", label: "Cloud Noir", icon: Moon },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border hover:bg-card hover:text-accent transition-colors text-sm font-medium cursor-pointer"
      >
        <Palette className="w-4 h-4" />
        <span>Theme</span>
        <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-40 p-1 bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden"
          >
            {themes.map((t) => {
              const isActive = theme === t.id;
              const Icon = t.icon;
              
              return (
                <button
                  key={t.id}
                  onClick={() => {
                    setTheme(t.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center w-full gap-2 px-2 py-2 text-sm rounded-md transition-colors cursor-pointer",
                    isActive ? "bg-accent/10 text-accent" : "hover:bg-muted-fg/10 text-fg"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="flex-1 text-left">{t.label}</span>
                  {isActive && <Check className="w-3 h-3" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

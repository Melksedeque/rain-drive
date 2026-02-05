"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Cloud, CloudRain, Sun, Lock, X, Minus, Maximize2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function Hero() {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          
          {/* Content */}
          <div className="flex-1 max-w-2xl text-center lg:text-left">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight mb-6"
            >
              RainDrive. <br/>
              <span className="text-muted-fg">O drive realmente perfeito.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-muted-fg mb-8 leading-relaxed"
            >
              Upload rápido, organização impecável e uma experiência tão suave que chega a incomodar.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-4"
            >
              <Link 
                href="/auth/signup"
                className="w-full sm:w-auto px-8 py-3.5 bg-accent text-accent-fg rounded-lg font-semibold hover:bg-accent/90 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-accent/20 cursor-pointer"
              >
                Criar minha conta
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                href="#recursos"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("recursos")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-card border border-border text-fg rounded-lg font-medium hover:bg-muted-fg/5 transition-colors text-center cursor-pointer"
              >
                Ver recursos
              </Link>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="text-xs text-muted-fg/60 italic"
            >
              Sem taxas escondidas. Só pequenas surpresas meteorológicas.
            </motion.p>
          </div>

          {/* Widget Demo */}
          <div className="flex-1 w-full max-w-md lg:max-w-full flex justify-center lg:justify-end">
            <WeatherWidgetDemo />
          </div>
          
        </div>
      </div>
    </section>
  );
}

function WeatherWidgetDemo() {
  const [state, setState] = useState<"cloudy" | "dry" | "raining">("cloudy");

  useEffect(() => {
    const states: ("cloudy" | "dry" | "raining")[] = ["cloudy", "dry", "raining"];
    let i = 0;
    const interval = setInterval(() => {
      i = (i + 1) % states.length;
      setState(states[i]);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative w-full max-w-sm bg-card border border-border rounded-2xl shadow-xl overflow-hidden p-6"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-linear-to-r from-transparent via-accent to-transparent opacity-20" />
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="flex justify-center items-center w-4 h-4 rounded-full bg-red-600/50 border border-red-600/70">
            <X className="w-2.5 h-2.5 text-red-800" />
          </div>
          <div className="flex justify-center items-center w-4 h-4 rounded-full bg-yellow-600/50 border border-yellow-600/70">
            <Minus className="w-2.5 h-2.5 text-yellow-800" />
          </div>
          <div className="flex justify-center items-center w-4 h-4 rounded-full bg-green-600/50 border border-green-600/70">
            <Maximize2 className="w-2.5 h-2.5 text-green-800" />
          </div>
        </div>
        <div className="text-xs font-mono text-muted-fg">status: {state.toUpperCase()}</div>
      </div>

      <div className="flex flex-col items-center gap-6 py-8">
        <div className="relative">
          <AnimatePresence mode="wait">
            {state === "cloudy" && (
              <motion.div
                key="cloudy"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="p-6 rounded-full bg-weather-cloudy/10 text-weather-cloudy"
              >
                <Cloud className="w-16 h-16" />
              </motion.div>
            )}
            {state === "dry" && (
              <motion.div
                key="dry"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="p-6 rounded-full bg-weather-dry/10 text-weather-dry"
              >
                <Sun className="w-16 h-16" />
              </motion.div>
            )}
            {state === "raining" && (
              <motion.div
                key="raining"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative p-6 rounded-full bg-weather-raining/10 text-weather-raining shadow-[0_0_30px_rgba(59,130,246,0.3)]"
              >
                <CloudRain className="w-16 h-16" />
                <motion.div 
                  className="absolute inset-0 rounded-full border border-weather-raining/30"
                  animate={{ scale: [1, 1.2], opacity: [0.5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="text-center space-y-2">
          <h3 className="font-semibold text-lg">
            {state === "cloudy" && "Analisando atmosfera..."}
            {state === "dry" && "Acesso Bloqueado"}
            {state === "raining" && "Download Liberado"}
          </h3>
          <p className="text-sm text-muted-fg">
            {state === "cloudy" && "Estamos verificando se você merece este arquivo."}
            {state === "dry" && "Não está chovendo. Volte quando o tempo fechar."}
            {state === "raining" && "Aproveite a chuva. Seus arquivos estão aqui."}
          </p>
        </div>

        <button 
          disabled={state !== "raining"}
          className={cn(
            "w-full py-3 rounded-lg font-medium transition-all duration-300 flex items-center justify-center gap-2",
            state === "raining" 
              ? "bg-weather-raining text-white shadow-lg shadow-weather-raining/25 hover:bg-weather-raining/90" 
              : "bg-muted-fg/10 text-muted-fg cursor-not-allowed"
          )}
        >
          {state !== "raining" ? <Lock className="w-4 h-4" /> : <CloudRain className="w-4 h-4" />}
          Download File.zip
        </button>
      </div>
    </motion.div>
  );
}

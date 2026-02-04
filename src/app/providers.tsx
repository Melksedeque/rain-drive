"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Toaster } from "sonner";
import * as React from "react";
import { WeatherProvider } from "@/components/providers/weather-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      themes={["theme-light", "theme-noir"]}
      value={{
        light: "theme-light",
        noir: "theme-noir",
      }}
    >
      <WeatherProvider>
        {children}
      </WeatherProvider>
      <Toaster position="bottom-right" richColors closeButton />
    </NextThemesProvider>
  );
}

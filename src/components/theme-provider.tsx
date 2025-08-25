"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      defaultTheme="light"
      storageKey="manuj-portfolio-theme"
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

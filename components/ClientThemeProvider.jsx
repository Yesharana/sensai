"use client"; // This must be a client component

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export default function ClientThemeProvider({ children }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
      {children}
    </NextThemesProvider>
  );
}

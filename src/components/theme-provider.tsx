"use client"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // Garantir que o tema padrão seja sempre "system" se não for especificado
  const defaultProps = {
    defaultTheme: "system",
    enableSystem: true,
    disableTransitionOnChange: false,
    ...props,
  }

  return <NextThemesProvider {...defaultProps}>{children}</NextThemesProvider>
}

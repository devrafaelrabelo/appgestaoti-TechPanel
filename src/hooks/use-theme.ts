"use client"

import { useTheme as useNextTheme } from "next-themes"
import { useEffect, useState } from "react"

export function useTheme() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme, resolvedTheme, systemTheme } = useNextTheme()

  // Garantir que o componente está montado para evitar problemas de hidratação
  useEffect(() => {
    setMounted(true)
  }, [])

  return {
    theme,
    setTheme,
    resolvedTheme,
    systemTheme,
    mounted,
    // Métodos auxiliares
    toggleTheme: () => {
      if (resolvedTheme === "dark") {
        setTheme("light")
      } else {
        setTheme("dark")
      }
    },
    isLight: mounted && resolvedTheme === "light",
    isDark: mounted && resolvedTheme === "dark",
  }
}

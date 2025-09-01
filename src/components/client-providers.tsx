"use client"

import type React from "react"

import { AuthProvider } from "@/features/auth/context/auth-context"
import { ThemeProvider } from "@/providers/theme-provider"
import { Toaster } from "@/components/ui/toaster"

function AuthWrapper({ children }: { children: React.ReactNode }) {

  return <>{children}</>
}

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <AuthProvider>
        {children}
        <Toaster />
      </AuthProvider>
    </ThemeProvider>
  )
}

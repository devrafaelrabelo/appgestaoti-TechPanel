"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { config } from "@/config"

export function ForgotPasswordForm() {
  const [formState, setFormState] = useState({
    identifier: "",
    isSubmitting: false,
    identifierError: false,
  })
  const router = useRouter()
  const { toast } = useToast()

  const domain = config.app.allowedEmailDomain
  const tld = domain === "bemprotege" ? "com.br" : "com"

  const emailRegex = useMemo(() => new RegExp(`^[a-zA-Z0-9._%+-]+@${domain}\\.${tld}$`), [domain, tld])

  const validateIdentifier = useCallback(
    (identifier: string) => {
      if (!identifier.trim()) {
        return "Por favor, informe seu nome de usuário ou email."
      }
      if (identifier.includes("@") && !emailRegex.test(identifier)) {
        return "Por favor, insira um email válido do domínio @example.com."
      }
      return null
    },
    [emailRegex],
  )

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setFormState((prev) => ({
      ...prev,
      identifier: value,
      identifierError: prev.identifierError && value.trim() === "" ? true : false,
    }))
  }, [])

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      const { identifier } = formState
      const error = validateIdentifier(identifier)

      if (error) {
        setFormState((prev) => ({ ...prev, identifierError: true }))
        toast({
          variant: "destructive",
          title: "Erro de validação",
          description: error,
        })
        return
      }

      setFormState((prev) => ({ ...prev, isSubmitting: true }))

      try {
        await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulação de envio

        toast({
          title: "Solicitação enviada",
          description: "Instruções de recuperação foram enviadas para o email cadastrado.",
          variant: "success",
        })

        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } catch (error) {
        toast({
          title: "Erro no envio",
          description: "Não foi possível processar sua solicitação. Tente novamente.",
          variant: "destructive",
        })
      } finally {
        setFormState((prev) => ({ ...prev, isSubmitting: false }))
      }
    },
    [formState, validateIdentifier, toast, router],
  )

  const { identifier, isSubmitting, identifierError } = formState

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="identifier" className={cn(identifierError && "text-destructive")}>
          Usuário ou Email
        </Label>
        <div className="relative">
          <User
            className={cn(
              "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground",
              identifierError && "text-destructive",
            )}
          />
          <Input
            id="identifier"
            name="identifier"
            type="text"
            placeholder="Digite seu usuário ou email"
            value={identifier}
            onChange={handleChange}
            required
            className={cn(
              "pl-10",
              identifierError && "border-destructive focus-visible:ring-destructive",
            )}
            aria-invalid={identifierError}
            aria-describedby={identifierError ? "identifier-error" : undefined}
          />
        </div>
        {identifierError && (
          <p id="identifier-error" className="text-sm text-destructive">
            Por favor, informe seu nome de usuário ou email.
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Enviando..." : "Recuperar acesso"}
      </Button>
    </form>
  )
}
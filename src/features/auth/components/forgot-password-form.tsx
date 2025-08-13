"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { User } from "lucide-react" // Importar o ícone

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input" // Importar o Input padrão
import { Label } from "@/components/ui/label" // Importar o Label padrão
import { useToast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils" // Para classes condicionais
import { config } from "@/config" // Importar a configuração do domínio permitido

export function ForgotPasswordForm() {
  const [identifier, setIdentifier] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [identifierError, setIdentifierError] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const domain = config.app.allowedEmailDomain;
  const tld = domain === "bemprotege" ? "com.br" : "com";

  const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@${domain}\\.${tld}$`);
      

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIdentifierError(false) // Resetar erro

    if (!identifier || identifier.trim() === "") {
      setIdentifierError(true)
      setIsSubmitting(false)
      toast({
        variant: "destructive",
        title: "Erro de validação",
        description: "Por favor, informe seu nome de usuário ou email.",
      })
      return
    }

    const isEmail = identifier.includes("@")
    if (isEmail && !emailRegex.test(identifier)) {
      // Não definir identifierError aqui, pois o erro é sobre o formato do email, não sobre estar vazio
      setIsSubmitting(false)
      toast({
        variant: "destructive",
        title: "Erro no formato do email",
        description: "Por favor, insira um email válido do domínio @example.com.",
      })
      return
    }

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
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value)
    if (identifierError && e.target.value.trim() !== "") {
      setIdentifierError(false)
    }
  }

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
              "pl-10", // Padding para o ícone
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

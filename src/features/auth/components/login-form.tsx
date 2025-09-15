"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Lock, Loader2, Eye, EyeOff, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { authService } from "../services/auth-service"
import { TwoFactorModal } from "./two-factor-modal"
import { config } from "@/config" // Importar a configuração do domínio permitido
import { useAuth } from "../context/auth-context"

export function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  })

  const [fieldErrors, setFieldErrors] = useState({
    email: false,
    password: false,
  })

  const [shake, setShake] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // ✅ Estados para 2FA
  const [show2FAModal, setShow2FAModal] = useState(false)
  const [sessionId, setSessionId] = useState<string>()

  const { login } = useAuth()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: false }))
    }

    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, remember: checked }))
  }

  const validateEmailOrUser = (input: string): boolean => {
    // Se contém @, valida como e-mail com base no domínio permitido
    if (input.includes("@")) {
      const domain = config.app.allowedEmailDomain;
      const tld = domain === "bemprotege" ? "com.br" : "com";
      const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@${domain}\\.${tld}$`);
      return emailRegex.test(input);
    }

    // Se não contém @, considera como nome de usuário válido
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validar email/usuário antes de prosseguir
    if (!validateEmailOrUser(formData.email)) {
      setFieldErrors({ email: true, password: false })
      setShake(true)
      setTimeout(() => setShake(false), 500)

      toast({
        variant: "destructive",
        title: "Erro de autenticação",
        description: "Não foi possível processar sua solicitação. Verifique os dados informados.",
      })
      return
    }

    setIsLoading(true)

    try {
      // Verificar backend primeiro
      const connectionStatus = await authService.checkBackendConnection()
      if (!connectionStatus.isOnline) {
        toast({
          variant: "destructive",
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor.",
        })
        setIsLoading(false)
        return
      }


      // ✅ Fazer login direto via authService para capturar 2FA
      const loginResponse = await authService.login(formData.email, formData.password, formData.remember)

      // ✅ Verificar se 2FA é necessário
      if (loginResponse.requires2FA) {
        setSessionId(loginResponse.sessionId)
        setShow2FAModal(true)
        setIsLoading(false)

        toast({
          variant: "info",
          title: "Autenticação de dois fatores",
          description: "Digite o código do seu aplicativo autenticador.",
        })
        return
      }

      // ✅ Login normal (sem 2FA)
      if (loginResponse.success) {

        toast({
          variant: "success",
          title: "Login bem-sucedido",
          description: "Você será redirecionado em instantes.",
        })

        // Aguardar um pouco e redirecionar
        setTimeout(() => {
          window.location.href = "/modules"
        }, 800)
      } else {
        setFormData((prev) => ({ ...prev, password: "" }))
        setFieldErrors({ email: true, password: true })

        setShake(true)
        setTimeout(() => setShake(false), 500)

        toast({
          variant: "destructive",
          title: "Falha no login",
          description: loginResponse.message || "Credenciais inválidas. Tente novamente.",
        })

        setIsLoading(false)
      }
    } catch (error) {
      console.error("❌ LoginForm: Erro:", error)

      toast({
        variant: "destructive",
        title: "Erro inesperado",
        description: "Ocorreu um erro ao processar sua solicitação. Tente novamente.",
      })

      setIsLoading(false)
    }
  }

  // ✅ Função para verificar código 2FA
  const handle2FASubmit = async (code: string): Promise<boolean> => {
    try {
      // ✅ Passar o rememberMe original do login
      const verifyResponse = await authService.verify2FA(code, formData.remember)

      if (verifyResponse.success) {
        toast({
          variant: "success",
          title: "Autenticação concluída",
          description: "Você será redirecionado em instantes.",
        })

        // Aguardar um pouco e redirecionar
        setTimeout(() => {
          window.location.href = "/modules"
        }, 800)

        return true
      } else {
        return false
      }
    } catch (error) {
      console.error("❌ Erro na verificação 2FA:", error)
      return false
    }
  }

  const handle2FAClose = () => {
    setShow2FAModal(false)
    setSessionId(undefined)
    setFormData((prev) => ({ ...prev, password: "" }))
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={`space-y-6 ${shake ? "animate-shake" : ""}`} autoComplete="on">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className={fieldErrors.email ? "text-red-500" : ""}>
              Usuário ou Email
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <User className="h-4 w-4" />
              </div>
              <Input
                id="email"
                name="email"
                type="text"
                placeholder="Digite seu usuário ou email"
                value={formData.email}
                onChange={handleChange}
                className={`pl-10 ${fieldErrors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                required
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className={fieldErrors.password ? "text-red-500" : ""}>
              Senha
            </Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Lock className="h-4 w-4" />
              </div>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={`pl-10 pr-10 ${fieldErrors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                required
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                ) : (
                  <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300" />
                )}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="remember"
              checked={formData.remember}
              onCheckedChange={handleCheckboxChange}
              disabled={isLoading}
            />
            <Label htmlFor="remember" className="text-sm cursor-pointer">
              Lembrar de mim
            </Label>
          </div>
          <Link
            href="/forgot-password"
            className={`text-sm text-primary hover:underline ${isLoading ? "pointer-events-none opacity-50" : ""}`}
          >
            Esqueci a senha
          </Link>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Verificando credenciais...</span>
            </div>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>

      {/* ✅ Modal de 2FA */}
      <TwoFactorModal isOpen={show2FAModal} onClose={handle2FAClose} onSubmit={handle2FASubmit} />
    </>
  )
}

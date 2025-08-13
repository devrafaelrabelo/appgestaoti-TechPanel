"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Shield, Loader2 } from "lucide-react"

interface TwoFactorModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (code: string) => Promise<boolean>
}

export function TwoFactorModal({ isOpen, onClose, onSubmit }: TwoFactorModalProps) {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const formatCode = (value: string) => {
    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, "")
    // Limita a 6 dígitos
    const limited = numbers.slice(0, 6)
    // Adiciona espaço no meio (000 000)
    if (limited.length > 3) {
      return `${limited.slice(0, 3)} ${limited.slice(3)}`
    }
    return limited
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCode(e.target.value)
    setCode(formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleanCode = code.replace(/\s/g, "")

    if (cleanCode.length !== 6) {
      toast({
        variant: "destructive",
        title: "Código inválido",
        description: "O código deve ter 6 dígitos.",
      })
      return
    }

    setIsLoading(true)

    try {
      const success = await onSubmit(cleanCode)

      if (success) {
        toast({
          variant: "default",
          title: "Código verificado",
          description: "Autenticação de dois fatores confirmada com sucesso.",
        })
        setCode("")
        onClose()
      } else {
        toast({
          variant: "destructive",
          title: "Código incorreto",
          description: "O código inserido está incorreto. Tente novamente.",
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro de verificação",
        description: "Ocorreu um erro ao verificar o código. Tente novamente.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setCode("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose} modal={true}>
      <DialogContent className="w-[95vw] max-w-[1400px] xl:max-w-[1600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Autenticação de Dois Fatores
          </DialogTitle>
          <DialogDescription>
            Digite o código de 6 dígitos do seu aplicativo autenticador ou que foi enviado por SMS.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Código de verificação</Label>
            <Input
              id="code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000 000"
              value={code}
              onChange={handleCodeChange}
              className="text-center text-lg font-mono tracking-widest"
              maxLength={7} // 6 dígitos + 1 espaço
              disabled={isLoading}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">Insira os 6 dígitos do código de verificação</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || code.replace(/\s/g, "").length !== 6} className="flex-1">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

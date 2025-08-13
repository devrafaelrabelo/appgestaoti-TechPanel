"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MessageCircle, Phone, User } from "lucide-react"
import {
  CARRIERS,
  PLAN_TYPES,
  PHONE_STATUS,
  type CreateCorporatePhoneRequest,
  type CorporatePhone,
} from "@/types/corporate-phone"

interface CorporatePhoneFormProps {
  onSubmit: (data: CreateCorporatePhoneRequest) => Promise<void>
  loading?: boolean
  initialData?: Partial<CorporatePhone>
  onCancel?: () => void
}

export function CorporatePhoneForm({ onSubmit, loading, initialData, onCancel }: CorporatePhoneFormProps) {
  const [formData, setFormData] = useState<CreateCorporatePhoneRequest>({
    number: "",
    carrier: "VIVO",
    planType: "POSTPAID",
    status: "ACTIVE",
    companyId: null,
    currentUserId: null,
    whatsappBlock: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        number: initialData.number || "",
        carrier: initialData.carrier || "VIVO",
        planType: initialData.planType || "POSTPAID",
        status: initialData.status || "ACTIVE",
        companyId: initialData.companyId || null,
        currentUserId: initialData.currentUserId || null,
        whatsappBlock: initialData.whatsappBlock || false,
      })
    }
  }, [initialData])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.number.trim()) {
      newErrors.number = "Número é obrigatório"
    } else if (!/^\+?[\d\s\-$$$$]+$/.test(formData.number)) {
      newErrors.number = "Formato de número inválido"
    }

    if (!formData.carrier) {
      newErrors.carrier = "Operadora é obrigatória"
    }

    if (!formData.planType) {
      newErrors.planType = "Tipo de plano é obrigatório"
    }

    if (!formData.status) {
      newErrors.status = "Status é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Erro ao submeter formulário:", error)
    }
  }

  const handleInputChange = (field: keyof CreateCorporatePhoneRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações Básicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Informações Básicas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="number">Número do Telefone *</Label>
              <Input
                id="number"
                placeholder="+55 31 99999-8888"
                value={formData.number}
                onChange={(e) => handleInputChange("number", e.target.value)}
                className={errors.number ? "border-red-500" : ""}
              />
              {errors.number && <p className="text-sm text-red-500">{errors.number}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="carrier">Operadora *</Label>
              <Select value={formData.carrier} onValueChange={(value) => handleInputChange("carrier", value)}>
                <SelectTrigger className={errors.carrier ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione a operadora" />
                </SelectTrigger>
                <SelectContent>
                  {CARRIERS.map((carrier) => (
                    <SelectItem key={carrier.value} value={carrier.value}>
                      {carrier.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.carrier && <p className="text-sm text-red-500">{errors.carrier}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="planType">Tipo de Plano *</Label>
              <Select value={formData.planType} onValueChange={(value) => handleInputChange("planType", value)}>
                <SelectTrigger className={errors.planType ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o tipo de plano" />
                </SelectTrigger>
                <SelectContent>
                  {PLAN_TYPES.map((planType) => (
                    <SelectItem key={planType.value} value={planType.value}>
                      {planType.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.planType && <p className="text-sm text-red-500">{errors.planType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                <SelectTrigger className={errors.status ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {PHONE_STATUS.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.status && <p className="text-sm text-red-500">{errors.status}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Configuração do WhatsApp
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="whatsappBlock">Bloquear WhatsApp</Label>
                {formData.whatsappBlock ? (
                  <span className="text-red-600">🚫</span>
                ) : (
                  <span className="text-green-600">✅</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                {formData.whatsappBlock
                  ? "WhatsApp está bloqueado neste telefone"
                  : "WhatsApp está liberado neste telefone"}
              </p>
            </div>
            <Switch
              id="whatsappBlock"
              checked={formData.whatsappBlock}
              onCheckedChange={(checked) => handleInputChange("whatsappBlock", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Atribuições */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Atribuições (Opcional)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="companyId">ID da Empresa</Label>
              <Input
                id="companyId"
                type="number"
                placeholder="ID da empresa (opcional)"
                value={formData.companyId || ""}
                onChange={(e) =>
                  handleInputChange("companyId", e.target.value ? Number.parseInt(e.target.value) : null)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentUserId">ID do Usuário Atual</Label>
              <Input
                id="currentUserId"
                type="number"
                placeholder="ID do usuário (opcional)"
                value={formData.currentUserId || ""}
                onChange={(e) =>
                  handleInputChange("currentUserId", e.target.value ? Number.parseInt(e.target.value) : null)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Botões */}
      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : initialData ? "Atualizar" : "Criar"} Telefone
        </Button>
      </div>
    </form>
  )
}

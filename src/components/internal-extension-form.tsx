"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Settings, AlertCircle } from "lucide-react"
import {
  EXTENSION_APPLICATIONS,
  type CreateInternalExtensionData,
  type InternalExtension,
} from "@/types/internal-extension"

interface InternalExtensionFormProps {
  extension?: InternalExtension
  onSubmit: (data: CreateInternalExtensionData) => Promise<void>
  onCancel: () => void
  isSubmitting?: boolean
}

export function InternalExtensionForm({ extension, onSubmit, onCancel, isSubmitting }: InternalExtensionFormProps) {
  const [formData, setFormData] = useState<CreateInternalExtensionData>({
    extension: extension?.extension || "",
    application: extension?.application || "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.extension.trim()) {
      newErrors.extension = "Número do ramal é obrigatório"
    } else if (!/^\d{3,5}$/.test(formData.extension.trim())) {
      newErrors.extension = "Ramal deve ter entre 3 e 5 dígitos"
    }

    if (!formData.application.trim()) {
      newErrors.application = "Aplicação é obrigatória"
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
      await onSubmit({
        extension: formData.extension.trim(),
        application: formData.application.trim(),
      })
    } catch (error) {
      console.error("Erro ao salvar ramal:", error)
    }
  }

  const handleInputChange = (field: keyof CreateInternalExtensionData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Informações do Ramal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="extension">
                Número do Ramal <span className="text-red-500">*</span>
              </Label>
              <Input
                id="extension"
                type="text"
                placeholder="Ex: 1234"
                value={formData.extension}
                onChange={(e) => handleInputChange("extension", e.target.value)}
                className={errors.extension ? "border-red-500" : ""}
                maxLength={5}
              />
              {errors.extension && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {errors.extension}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="application">
                Aplicação <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.application} onValueChange={(value) => handleInputChange("application", value)}>
                <SelectTrigger className={errors.application ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione a aplicação" />
                </SelectTrigger>
                <SelectContent>
                  {EXTENSION_APPLICATIONS.map((app) => (
                    <SelectItem key={app} value={app}>
                      <div className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        {app}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.application && (
                <div className="flex items-center gap-1 text-sm text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  {errors.application}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Salvando..." : extension ? "Atualizar" : "Criar"} Ramal
        </Button>
      </div>
    </form>
  )
}

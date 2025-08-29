"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Position, CreatePositionPayload, UpdatePositionPayload } from "@/types/position"

interface PositionFormProps {
  initialData?: Position | null
  onSubmit: (data: CreatePositionPayload | UpdatePositionPayload) => Promise<boolean>
  onCancel: () => void
  loading?: boolean
}

export function PositionForm({ initialData, onSubmit, onCancel, loading = false }: PositionFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Preencher formulário com dados iniciais
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
      })
    }
  }, [initialData])

  // Validar formulário
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const success = await onSubmit(formData)
    if (success) {
      onCancel()
    }
  }

  // Atualizar campo
  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Nome *
        </Label>
        <div className="relative">
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => updateField("name", e.target.value)}
            placeholder="Ex: Analista de Suporte"
            className={errors.name ? "border-red-500" : ""}
            disabled={loading}
          />
          {formData.name && !errors.name && (
            <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-500" />
          )}
          {errors.name && <X className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-500" />}
        </div>
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm font-medium">
          Descrição *
        </Label>
        <div className="relative">
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => updateField("description", e.target.value)}
            placeholder="Ex: Responsável pelo atendimento técnico e suporte a usuários"
            className={errors.description ? "border-red-500" : ""}
            disabled={loading}
            rows={3}
          />
          {formData.description && !errors.description && (
            <Check className="absolute right-3 top-3 h-4 w-4 text-green-500" />
          )}
          {errors.description && <X className="absolute right-3 top-3 h-4 w-4 text-red-500" />}
        </div>
        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
      </div>

      {/* Botões */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : initialData ? "Atualizar" : "Criar"}
        </Button>
      </div>
    </form>
  )
}

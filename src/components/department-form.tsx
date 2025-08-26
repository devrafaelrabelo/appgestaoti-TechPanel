"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import type { Department, CreateDepartmentPayload, UpdateDepartmentPayload } from "@/types/department"

interface DepartmentFormProps {
  department?: Department
  onSubmit: (data: CreateDepartmentPayload | UpdateDepartmentPayload) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function DepartmentForm({ department, onSubmit, onCancel, loading = false }: DepartmentFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (department) {
      setFormData({
        name: department.name,
        description: department.description,
      })
    }
  }, [department])

  const validateField = (field: string, value: string) => {
    switch (field) {
      case "name":
        if (!value.trim()) return "Nome é obrigatório"
        if (value.length < 2) return "Nome deve ter pelo menos 2 caracteres"
        if (value.length > 100) return "Nome deve ter no máximo 100 caracteres"
        return ""
      case "description":
        if (!value.trim()) return "Descrição é obrigatória"
        if (value.length < 5) return "Descrição deve ter pelo menos 5 caracteres"
        if (value.length > 500) return "Descrição deve ter no máximo 500 caracteres"
        return ""
      default:
        return ""
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    Object.keys(formData).forEach((field) => {
      const error = validateField(field, formData[field as keyof typeof formData])
      if (error) newErrors[field] = error
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      // Marcar todos os campos como touched para mostrar erros
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}))
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Erro ao submeter formulário:", error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Validar campo em tempo real se já foi touched
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors((prev) => ({ ...prev, [field]: error }))
    }
  }

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
    const error = validateField(field, formData[field as keyof typeof formData])
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const getFieldStatus = (field: string) => {
    if (!touched[field]) return "default"
    return errors[field] ? "error" : "success"
  }

  const getFieldIcon = (field: string) => {
    const status = getFieldStatus(field)
    if (status === "error") return <AlertCircle className="h-4 w-4 text-destructive" />
    if (status === "success") return <CheckCircle2 className="h-4 w-4 text-green-600" />
    return null
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Departamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="Ex: Tecnologia da Informação"
                className={`pr-10 ${
                  getFieldStatus("name") === "error"
                    ? "border-destructive focus-visible:ring-destructive"
                    : getFieldStatus("name") === "success"
                      ? "border-green-600 focus-visible:ring-green-600"
                      : ""
                }`}
                disabled={loading}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">{getFieldIcon("name")}</div>
            </div>
            {touched.name && errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Descrição <span className="text-destructive">*</span>
            </Label>
            <div className="relative">
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                onBlur={() => handleBlur("description")}
                placeholder="Descreva as responsabilidades e atividades do departamento..."
                rows={4}
                className={`resize-none ${
                  getFieldStatus("description") === "error"
                    ? "border-destructive focus-visible:ring-destructive"
                    : getFieldStatus("description") === "success"
                      ? "border-green-600 focus-visible:ring-green-600"
                      : ""
                }`}
                disabled={loading}
              />
              <div className="absolute right-3 top-3">{getFieldIcon("description")}</div>
            </div>
            {touched.description && errors.description && (
              <p className="text-sm text-destructive">{errors.description}</p>
            )}
            <p className="text-sm text-muted-foreground">{formData.description.length}/500 caracteres</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Salvando..." : department ? "Atualizar" : "Criar"} Departamento
        </Button>
      </div>
    </form>
  )
}

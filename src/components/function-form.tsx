"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Building2, FileText, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { CreateFunctionPayload, UpdateFunctionPayload } from "@/types/function"
import type { Department } from "@/types/departments"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"

interface FunctionFormProps {
  initialData?: UpdateFunctionPayload & { departmentId: string }
  onSubmit: (data: CreateFunctionPayload | UpdateFunctionPayload) => Promise<boolean>
  onCancel: () => void
  loading?: boolean
}

export function FunctionForm({ initialData, onSubmit, onCancel, loading = false }: FunctionFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    departmentId: initialData?.departmentId || "",
  })
  const [departments, setDepartments] = useState<Department[]>([])
  const [loadingDepartments, setLoadingDepartments] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Buscar departamentos
  useEffect(() => {
    const fetchDepartments = async () => {
      setLoadingDepartments(true)
      try {
        const response = await fetchWithValidation(ApiEndpoints.backend.adminDepartmentList)
        if (response.ok) {
          const data = await response.json()
          setDepartments(data.departments || [])
        }
      } catch (error) {
        console.error("Erro ao buscar departamentos:", error)
      } finally {
        setLoadingDepartments(false)
      }
    }

    fetchDepartments()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Limpar erro do campo quando o usuário começar a digitar
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória"
    }

    if (!formData.departmentId) {
      newErrors.departmentId = "Departamento é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

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

  const isFormValid = formData.name.trim() && formData.description.trim() && formData.departmentId

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações da Função
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Função *</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Ex: Analista de Sistemas"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`pl-10 ${errors.name ? "border-destructive" : ""}`}
                  disabled={loading}
                />
              </div>
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="departmentId">Departamento *</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground z-10" />
                <Select
                  value={formData.departmentId}
                  onValueChange={(value) => handleInputChange("departmentId", value)}
                  disabled={loading || loadingDepartments}
                >
                  <SelectTrigger className={`pl-10 ${errors.departmentId ? "border-destructive" : ""}`}>
                    <SelectValue placeholder={loadingDepartments ? "Carregando..." : "Selecione um departamento"} />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((department) => (
                      <SelectItem key={department.id} value={department.id}>
                        {department.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.departmentId && <p className="text-sm text-destructive">{errors.departmentId}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              placeholder="Descreva as responsabilidades e atividades da função..."
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className={`min-h-[100px] ${errors.description ? "border-destructive" : ""}`}
              disabled={loading}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={!isFormValid || loading}>
          {loading ? "Salvando..." : initialData ? "Atualizar" : "Criar"} Função
        </Button>
      </div>
    </form>
  )
}

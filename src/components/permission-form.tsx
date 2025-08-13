"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Lightbulb } from "lucide-react"
import { COMMON_RESOURCES, COMMON_ACTIONS, type CreatePermissionRequest, type Permission } from "@/types/permission"

interface PermissionFormProps {
  onSubmit: (data: CreatePermissionRequest) => Promise<void>
  onCancel: () => void
  initialData?: Permission | null
  isLoading?: boolean
}

export function PermissionForm({ onSubmit, onCancel, initialData, isLoading = false }: PermissionFormProps) {
  const [formData, setFormData] = useState<CreatePermissionRequest>({
    name: "",
    description: "",
    resource: "",
    action: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description,
        resource: initialData.resource,
        action: initialData.action,
      })
    }
  }, [initialData])

  // Gerar nome automaticamente baseado no recurso e ação
  useEffect(() => {
    if (formData.resource && formData.action && !initialData) {
      const generatedName = `${formData.resource}:${formData.action}`
      setFormData((prev) => ({ ...prev, name: generatedName }))
    }
  }, [formData.resource, formData.action, initialData])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    } else if (!/^[a-z0-9]+:[a-z0-9]+$/.test(formData.name)) {
      newErrors.name = "Nome deve seguir o formato 'recurso:acao' (apenas letras minúsculas e números)"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória"
    }

    if (!formData.resource.trim()) {
      newErrors.resource = "Recurso é obrigatório"
    }

    if (!formData.action.trim()) {
      newErrors.action = "Ação é obrigatória"
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
      console.error("Erro ao salvar permissão:", error)
    }
  }

  const handleInputChange = (field: keyof CreatePermissionRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Preview da Permissão */}
      {formData.name && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Eye className="h-4 w-4" />
              Preview da Permissão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="font-mono">
              {formData.name}
            </Badge>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Recurso */}
        <div className="space-y-2">
          <Label htmlFor="resource">
            Recurso <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.resource} onValueChange={(value) => handleInputChange("resource", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar recurso" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_RESOURCES.map((resource) => (
                <SelectItem key={resource} value={resource}>
                  {resource}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!formData.resource && (
            <Input
              placeholder="Ou digite um recurso personalizado"
              value={formData.resource}
              onChange={(e) => handleInputChange("resource", e.target.value.toLowerCase())}
            />
          )}
          {errors.resource && <p className="text-sm text-destructive">{errors.resource}</p>}
        </div>

        {/* Ação */}
        <div className="space-y-2">
          <Label htmlFor="action">
            Ação <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.action} onValueChange={(value) => handleInputChange("action", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecionar ação" />
            </SelectTrigger>
            <SelectContent>
              {COMMON_ACTIONS.map((action) => (
                <SelectItem key={action} value={action}>
                  {action}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {!formData.action && (
            <Input
              placeholder="Ou digite uma ação personalizada"
              value={formData.action}
              onChange={(e) => handleInputChange("action", e.target.value.toLowerCase())}
            />
          )}
          {errors.action && <p className="text-sm text-destructive">{errors.action}</p>}
        </div>
      </div>

      {/* Nome */}
      <div className="space-y-2">
        <Label htmlFor="name">
          Nome da Permissão <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value.toLowerCase())}
          placeholder="Ex: user:create"
          className="font-mono"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>

      {/* Descrição */}
      <div className="space-y-2">
        <Label htmlFor="description">
          Descrição <span className="text-destructive">*</span>
        </Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleInputChange("description", e.target.value)}
          placeholder="Descreva o que esta permissão permite fazer"
          rows={3}
        />
        {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
      </div>

      {/* Dicas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Lightbulb className="h-4 w-4" />
            Dicas
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>• O nome deve seguir o formato "recurso:acao" (ex: user:create, role:delete)</p>
          <p>• Use apenas letras minúsculas e números</p>
          <p>• A descrição deve explicar claramente o que a permissão permite</p>
          <p>• Exemplos: "Criar novos usuários", "Excluir roles do sistema"</p>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Salvando..." : initialData ? "Atualizar" : "Criar"} Permissão
        </Button>
      </div>
    </form>
  )
}

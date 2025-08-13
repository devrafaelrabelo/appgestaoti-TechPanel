"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { ResourceType, ResourceTypeFormData } from "@/types/resource-type"

const resourceTypeSchema = z.object({
  code: z
    .string()
    .min(1, "Código é obrigatório")
    .max(50, "Código deve ter no máximo 50 caracteres")
    .regex(/^[A-Z0-9_]+$/, "Código deve conter apenas letras maiúsculas, números e underscore"),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
  active: z.boolean(),
})

interface ResourceTypeFormProps {
  resourceType?: ResourceType
  onSubmit: (data: ResourceTypeFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function ResourceTypeForm({ resourceType, onSubmit, onCancel, isSubmitting = false }: ResourceTypeFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResourceTypeFormData>({
    resolver: zodResolver(resourceTypeSchema),
    defaultValues: {
      code: resourceType?.code || "",
      name: resourceType?.name || "",
      description: resourceType?.description || "",
      active: resourceType?.active ?? true,
    },
  })

  const watchedName = watch("name")
  const watchedActive = watch("active")

  // Auto-generate code from name for new resource types
  useEffect(() => {
    if (!resourceType && watchedName) {
      const generatedCode = watchedName
        .toUpperCase()
        .replace(/[^A-Z0-9\s]/g, "")
        .replace(/\s+/g, "_")
        .substring(0, 50)
      setValue("code", generatedCode)
    }
  }, [watchedName, resourceType, setValue])

  const handleFormSubmit = (data: ResourceTypeFormData) => {
    onSubmit(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{resourceType ? "Editar Tipo de Recurso" : "Novo Tipo de Recurso"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input id="name" {...register("name")} placeholder="Ex: Telefone Corporativo" disabled={isSubmitting} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Código */}
          <div className="space-y-2">
            <Label htmlFor="code">
              Código <span className="text-destructive">*</span>
            </Label>
            <Input
              id="code"
              {...register("code")}
              placeholder="Ex: CORPORATE_PHONE"
              className="font-mono"
              disabled={isSubmitting}
              onChange={(e) => {
                const value = e.target.value.toUpperCase().replace(/[^A-Z0-9_]/g, "")
                setValue("code", value)
              }}
            />
            {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
            <p className="text-xs text-muted-foreground">
              Apenas letras maiúsculas, números e underscore são permitidos
            </p>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descreva o tipo de recurso..."
              rows={3}
              disabled={isSubmitting}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          {/* Status Ativo */}
          <div className="flex items-center space-x-2">
            <Switch
              id="active"
              checked={watchedActive}
              onCheckedChange={(checked) => setValue("active", checked)}
              disabled={isSubmitting}
            />
            <Label htmlFor="active">Tipo de recurso ativo</Label>
          </div>

          {/* Botões */}
          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (resourceType ? "Atualizando..." : "Criando...") : resourceType ? "Atualizar" : "Criar"}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

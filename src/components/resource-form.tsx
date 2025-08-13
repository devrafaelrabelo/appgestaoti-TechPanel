"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import  fetchWithValidation  from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import type { Resource, ResourceFormData, ResourceType } from "@/types/resource"

const resourceSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z.string().max(500, "Descrição deve ter no máximo 500 caracteres").optional(),
  resourceTypeId: z.string().min(1, "Tipo de recurso é obrigatório"),
  serialNumber: z.string().max(100, "Número de série deve ter no máximo 100 caracteres").optional(),
  location: z.string().max(100, "Localização deve ter no máximo 100 caracteres").optional(),
  active: z.boolean(),
})

interface ResourceFormProps {
  resource?: Resource
  onSubmit: (data: ResourceFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function ResourceForm({ resource, onSubmit, onCancel, isSubmitting = false }: ResourceFormProps) {
  const [resourceTypes, setResourceTypes] = useState<ResourceType[]>([])
  const [isLoadingTypes, setIsLoadingTypes] = useState(true)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResourceFormData>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      name: resource?.name || "",
      description: resource?.description || "",
      resourceTypeId: resource?.resourceTypeId || "",
      serialNumber: resource?.serialNumber || "",
      location: resource?.location || "",
      active: resource?.active ?? true,
    },
  })

  const watchedActive = watch("active")

  // Carregar tipos de recurso
  useEffect(() => {
    const fetchResourceTypes = async () => {
      try {
        setIsLoadingTypes(true)
        const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceTypesList}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          const data = await response.json()
          setResourceTypes(Array.isArray(data) ? data : data.data || [])
        }
      } catch (error) {
        console.error("Erro ao carregar tipos de recurso:", error)
      } finally {
        setIsLoadingTypes(false)
      }
    }

    fetchResourceTypes()
  }, [])

  const handleFormSubmit = (data: ResourceFormData) => {
    onSubmit(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{resource ? "Editar Recurso" : "Novo Recurso"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome <span className="text-destructive">*</span>
            </Label>
            <Input id="name" {...register("name")} placeholder="Ex: Notebook Dell Inspiron" disabled={isSubmitting} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Tipo de Recurso */}
          <div className="space-y-2">
            <Label htmlFor="resourceTypeId">
              Tipo de Recurso <span className="text-destructive">*</span>
            </Label>
            <Select
              value={watch("resourceTypeId")}
              onValueChange={(value) => setValue("resourceTypeId", value)}
              disabled={isSubmitting || isLoadingTypes}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de recurso" />
              </SelectTrigger>
              <SelectContent>
                {resourceTypes.map((type) => (
                  <SelectItem key={type.id} value={type.id}>
                    {type.name} ({type.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.resourceTypeId && <p className="text-sm text-destructive">{errors.resourceTypeId.message}</p>}
          </div>

          {/* Número de Série */}
          <div className="space-y-2">
            <Label htmlFor="serialNumber">Número de Série</Label>
            <Input
              id="serialNumber"
              {...register("serialNumber")}
              placeholder="Ex: ABC123456789"
              disabled={isSubmitting}
            />
            {errors.serialNumber && <p className="text-sm text-destructive">{errors.serialNumber.message}</p>}
          </div>

          {/* Localização */}
          <div className="space-y-2">
            <Label htmlFor="location">Localização</Label>
            <Input
              id="location"
              {...register("location")}
              placeholder="Ex: Sala 101, Andar 2"
              disabled={isSubmitting}
            />
            {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Descreva o recurso..."
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
            <Label htmlFor="active">Recurso ativo</Label>
          </div>

          {/* Botões */}
          <div className="flex items-center gap-3 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (resource ? "Atualizando..." : "Criando...") : resource ? "Atualizar" : "Criar"}
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

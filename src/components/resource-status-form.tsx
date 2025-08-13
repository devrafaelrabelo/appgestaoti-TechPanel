"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Shield, ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ResourceStatus, ResourceStatusFormData } from "@/types/resource-status"

const resourceStatusSchema = z.object({
  code: z
    .string()
    .min(1, "Código é obrigatório")
    .max(50, "Código deve ter no máximo 50 caracteres")
    .regex(/^[A-Z0-9_]+$/, "Código deve conter apenas letras maiúsculas, números e underscore"),
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome deve ter no máximo 100 caracteres"),
  description: z.string().min(1, "Descrição é obrigatória").max(500, "Descrição deve ter no máximo 500 caracteres"),
  blocksAllocation: z.boolean(),
})

interface ResourceStatusFormProps {
  status?: ResourceStatus
  onSubmit: (data: ResourceStatusFormData) => void
  onCancel: () => void
  isSubmitting?: boolean
}

export function ResourceStatusForm({ status, onSubmit, onCancel, isSubmitting = false }: ResourceStatusFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ResourceStatusFormData>({
    resolver: zodResolver(resourceStatusSchema),
    defaultValues: {
      code: status?.code || "",
      name: status?.name || "",
      description: status?.description || "",
      blocksAllocation: status?.blocksAllocation || false,
    },
  })

  const watchedValues = watch()

  useEffect(() => {
    if (status) {
      setValue("code", status.code)
      setValue("name", status.name)
      setValue("description", status.description)
      setValue("blocksAllocation", status.blocksAllocation)
    }
  }, [status, setValue])

  const handleFormSubmit = (data: ResourceStatusFormData) => {
    onSubmit(data)
  }

  const handleSwitchChange = (checked: boolean) => {
    setValue("blocksAllocation", checked, { shouldValidate: true })
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Formulário */}
      <Card>
        <CardHeader>
          <CardTitle>{status ? "Editar Status" : "Novo Status"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
            {/* Código */}
            <div className="space-y-2">
              <Label htmlFor="code">
                Código <span className="text-destructive">*</span>
              </Label>
              <Input
                id="code"
                {...register("code")}
                placeholder="Ex: AVAILABLE, IN_USE, MAINTENANCE"
                disabled={isSubmitting || !!status}
                className="font-mono"
              />
              {errors.code && <p className="text-sm text-destructive">{errors.code.message}</p>}
              {status && <p className="text-xs text-muted-foreground">O código não pode ser alterado após a criação</p>}
            </div>

            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">
                Nome <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                {...register("name")}
                placeholder="Ex: Disponível, Em Uso, Manutenção"
                disabled={isSubmitting}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
            </div>

            {/* Descrição */}
            <div className="space-y-2">
              <Label htmlFor="description">
                Descrição <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Descreva quando este status deve ser usado..."
                rows={3}
                disabled={isSubmitting}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
            </div>

            {/* Bloqueio de Alocação */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="blocksAllocation"
                  checked={watchedValues.blocksAllocation}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSubmitting}
                />
                <Label htmlFor="blocksAllocation">Bloqueia alocação de recursos</Label>
              </div>
              <p className="text-xs text-muted-foreground">
                Quando ativado, recursos com este status não poderão ser alocados para uso
              </p>
            </div>

            {/* Botões */}
            <div className="flex items-center gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (status ? "Atualizando..." : "Criando...") : status ? "Atualizar" : "Criar"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Preview do Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Visualização do Status */}
          <div className="p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center justify-between mb-2">
              <code className="bg-background px-2 py-1 rounded text-sm font-mono">
                {watchedValues.code || "CODIGO"}
              </code>
              <Badge
                variant={watchedValues.blocksAllocation ? "destructive" : "default"}
                className="flex items-center gap-1"
              >
                {watchedValues.blocksAllocation ? (
                  <>
                    <ShieldOff className="h-3 w-3" />
                    Bloqueia
                  </>
                ) : (
                  <>
                    <Shield className="h-3 w-3" />
                    Permite
                  </>
                )}
              </Badge>
            </div>
            <h4 className="font-semibold">{watchedValues.name || "Nome do Status"}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {watchedValues.description || "Descrição do status..."}
            </p>
          </div>

          {/* JSON de Exemplo */}
          <div>
            <Label className="text-sm font-medium">JSON para API:</Label>
            <pre className="mt-2 p-3 bg-muted rounded-lg text-xs overflow-x-auto">
              {JSON.stringify(
                {
                  code: watchedValues.code || "CODIGO",
                  name: watchedValues.name || "Nome do Status",
                  description: watchedValues.description || "Descrição do status...",
                  blocksAllocation: watchedValues.blocksAllocation,
                },
                null,
                2,
              )}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

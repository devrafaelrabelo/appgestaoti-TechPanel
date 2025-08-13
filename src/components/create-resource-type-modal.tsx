"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ResourceTypeForm } from "@/components/resource-type-form"
import  fetchWithValidation  from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import { useToast } from "@/components/ui/use-toast"
import type { ResourceTypeFormData } from "@/types/resource-type"

interface CreateResourceTypeModalProps {
  onResourceTypeCreated: () => void
}

export function CreateResourceTypeModal({ onResourceTypeCreated }: CreateResourceTypeModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleCreateResourceType = async (data: ResourceTypeFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetchWithValidation(ApiEndpoints.backend.resourceTypesCreate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao criar tipo de recurso: ${response.status}`)
      }

      toast({
        title: "Tipo de recurso criado",
        description: "O tipo de recurso foi criado com sucesso.",
      })

      setIsOpen(false)
      onResourceTypeCreated()
    } catch (error) {
      toast({
        title: "Erro ao criar tipo de recurso",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Novo Tipo de Recurso
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Tipo de Recurso</DialogTitle>
        </DialogHeader>
        <ResourceTypeForm onSubmit={handleCreateResourceType} onCancel={handleCancel} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ResourceForm } from "@/components/resource-form"
import  fetchWithValidation  from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import { useToast } from "@/components/ui/use-toast"
import type { ResourceFormData } from "@/types/resource"

interface CreateResourceModalProps {
  onResourceCreated: () => void
}

export function CreateResourceModal({ onResourceCreated }: CreateResourceModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleCreateResource = async (data: ResourceFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetchWithValidation(ApiEndpoints.backend.resourcesCreate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao criar recurso: ${response.status}`)
      }

      toast({
        title: "Recurso criado",
        description: "O recurso foi criado com sucesso.",
      })

      setIsOpen(false)
      onResourceCreated()
    } catch (error) {
      toast({
        title: "Erro ao criar recurso",
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
          Novo Recurso
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Recurso</DialogTitle>
        </DialogHeader>
        <ResourceForm onSubmit={handleCreateResource} onCancel={handleCancel} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  )
}

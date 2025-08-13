"use client"

import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ResourceStatusForm } from "@/components/resource-status-form"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import { useToast } from "@/components/ui/use-toast"
import type { ResourceStatusFormData } from "@/types/resource-status"

interface CreateResourceStatusModalProps {
  onStatusCreated: () => void
}

export function CreateResourceStatusModal({ onStatusCreated }: CreateResourceStatusModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleCreateStatus = async (data: ResourceStatusFormData) => {
    setIsSubmitting(true)
    try {
      const response = await fetchWithValidation(ApiEndpoints.backend.resourceStatusCreate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ao criar status: ${response.status}`)
      }

      toast({
        title: "Status criado",
        description: "O status foi criado com sucesso.",
      })

      setIsOpen(false)
      onStatusCreated()
    } catch (error) {
      toast({
        title: "Erro ao criar status",
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
          Novo Status
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[1400px] xl:max-w-[1600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Status</DialogTitle>
        </DialogHeader>
        <ResourceStatusForm onSubmit={handleCreateStatus} onCancel={handleCancel} isSubmitting={isSubmitting} />
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { CreatePermissionRequest, Permission } from "@/types/permission"
import { PermissionForm } from "./permission-form"

interface CreatePermissionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onCreate: (data: CreatePermissionRequest) => Promise<Permission>
}

export function CreatePermissionModal({ isOpen, onClose, onSuccess, onCreate }: CreatePermissionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (data: CreatePermissionRequest) => {
    try {
      setIsLoading(true)
      await onCreate(data)
      toast({
        title: "Sucesso",
        description: "Permissão criada com sucesso!",
      })
      onSuccess()
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar permissão",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Permissão</DialogTitle>
        </DialogHeader>
        <PermissionForm onSubmit={handleSubmit} onCancel={onClose} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}

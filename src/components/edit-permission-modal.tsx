"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { PermissionForm } from "@/components/permission-form"
import type { UpdatePermissionRequest, Permission } from "@/types/permission"

interface EditPermissionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onUpdate: (id: string, data: UpdatePermissionRequest) => Promise<Permission>
  permission: Permission | null
}

export function EditPermissionModal({ isOpen, onClose, onSuccess, onUpdate, permission }: EditPermissionModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (data: UpdatePermissionRequest) => {
    if (!permission) return

    try {
      setIsLoading(true)
      await onUpdate(permission.id, data)
      toast({
        title: "Sucesso",
        description: "Permissão atualizada com sucesso!",
      })
      onSuccess()
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar permissão",
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
          <DialogTitle>Editar Permissão</DialogTitle>
        </DialogHeader>
        <PermissionForm onSubmit={handleSubmit} onCancel={onClose} initialData={permission} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}

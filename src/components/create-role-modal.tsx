"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { RoleForm } from "@/components/role-form"
import type { CreateRoleRequest, Permission } from "@/types/role"

interface CreateRoleModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onCreate: (data: CreateRoleRequest) => Promise<any>
  permissions: Permission[]
}

export function CreateRoleModal({ isOpen, onClose, onSuccess, onCreate, permissions }: CreateRoleModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (data: CreateRoleRequest) => {
    try {
      setIsLoading(true)
      await onCreate(data)

      toast({
        title: "Role criado com sucesso",
        description: `O role "${data.name}" foi criado com sucesso.`,
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Erro ao criar role",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Criar Novo Role</DialogTitle>
        </DialogHeader>

        <RoleForm onSubmit={handleSubmit} permissions={permissions} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}

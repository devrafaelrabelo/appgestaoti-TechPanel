"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { RoleForm } from "@/components/role-form"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { CreateRoleRequest, Permission, RoleDetail } from "@/types/role"

interface EditRoleModalProps {
  roleId: string | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  onUpdate: (id: string, data: CreateRoleRequest) => Promise<any>
  onFetchRole: (id: string) => Promise<RoleDetail>
  permissions: Permission[]
}

export function EditRoleModal({
  roleId,
  isOpen,
  onClose,
  onSuccess,
  onUpdate,
  onFetchRole,
  permissions,
}: EditRoleModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const [role, setRole] = useState<RoleDetail | null>(null)
  const { toast } = useToast()

  // Buscar dados do role quando o modal abrir
  useEffect(() => {
    if (isOpen && roleId) {
      const fetchRole = async () => {
        try {
          setIsFetching(true)
          const roleData = await onFetchRole(roleId)
          setRole(roleData)
        } catch (error) {
          toast({
            title: "Erro ao carregar role",
            description: error instanceof Error ? error.message : "Erro desconhecido",
            variant: "destructive",
          })
          onClose()
        } finally {
          setIsFetching(false)
        }
      }

      fetchRole()
    }
  }, [isOpen, roleId, onFetchRole, onClose, toast])

  // Limpar dados quando fechar
  useEffect(() => {
    if (!isOpen) {
      setRole(null)
    }
  }, [isOpen])

  const handleSubmit = async (data: CreateRoleRequest) => {
    if (!roleId) return

    try {
      setIsLoading(true)
      await onUpdate(roleId, data)

      toast({
        title: "Role atualizado com sucesso",
        description: `O role "${data.name}" foi atualizado com sucesso.`,
      })

      onSuccess()
    } catch (error) {
      toast({
        title: "Erro ao atualizar role",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[1400px] xl:max-w-[1600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isFetching ? "Carregando..." : role ? `Editar Role: ${role.name}` : "Editar Role"}</DialogTitle>
        </DialogHeader>

        {isFetching ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
            <span className="ml-2">Carregando dados do role...</span>
          </div>
        ) : role ? (
          <RoleForm onSubmit={handleSubmit} permissions={permissions} isLoading={isLoading} initialData={role} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Erro ao carregar dados do role</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { RoleDetails } from "@/components/role-details"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Permission, RoleDetail } from "@/types/role"

interface ViewRoleModalProps {
  roleId: string | null
  isOpen: boolean
  onClose: () => void
  onFetchRole: (id: string) => Promise<RoleDetail>
  permissions: Permission[]
}

export function ViewRoleModal({ roleId, isOpen, onClose, onFetchRole, permissions }: ViewRoleModalProps) {
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

  if (isFetching) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Carregando...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner />
            <span className="ml-2">Carregando dados do role...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return <RoleDetails role={role} permissions={permissions} isOpen={isOpen} onClose={onClose} />
}

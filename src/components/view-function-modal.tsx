"use client"

import { useState, useEffect } from "react"
import { Building2, FileText, User, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { Function } from "@/types/function"
import type { Department } from "@/types/departments"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"

interface ViewFunctionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  functionData: Function | null
}

export function ViewFunctionModal({ open, onOpenChange, functionData }: ViewFunctionModalProps) {
  const [department, setDepartment] = useState<Department | null>(null)
  const [loadingDepartment, setLoadingDepartment] = useState(false)

  // Buscar dados do departamento
  useEffect(() => {
    if (functionData?.departmentId) {
      const fetchDepartment = async () => {
        setLoadingDepartment(true)
        try {
          const response = await fetchWithValidation(`${ApiEndpoints.backend.adminDepartmentList}/${functionData.departmentId}`)
          if (response.ok) {
            const data = await response.json()
            setDepartment(data)
          }
        } catch (error) {
          console.error("Erro ao buscar departamento:", error)
        } finally {
          setLoadingDepartment(false)
        }
      }

      fetchDepartment()
    }
  }, [functionData?.departmentId])

  if (!functionData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-[1600px] h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Detalhes da Função
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Nome</label>
                  <p className="text-lg font-semibold">{functionData.name}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Departamento</label>
                  {loadingDepartment ? (
                    <Skeleton className="h-6 w-[200px]" />
                  ) : (
                    <Badge variant="secondary" className="text-sm">
                      <Building2 className="mr-1 h-3 w-3" />
                      {department?.name || "Departamento não encontrado"}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm leading-relaxed">{functionData.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {department && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informações do Departamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Nome do Departamento</label>
                    <p className="font-medium">{department.name}</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Gerente</label>
                    <p className="text-sm text-muted-foreground">
                      {department.managerId ? "Definido" : "Não definido"}
                    </p>
                  </div>
                </div>

                {department.description && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Descrição do Departamento</label>
                    <div className="p-4 bg-muted/50 rounded-lg">
                      <p className="text-sm leading-relaxed">{department.description}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">ID da Função</label>
                  <p className="text-sm font-mono bg-muted/50 p-2 rounded">{functionData.id}</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">ID do Departamento</label>
                  <p className="text-sm font-mono bg-muted/50 p-2 rounded">{functionData.departmentId}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

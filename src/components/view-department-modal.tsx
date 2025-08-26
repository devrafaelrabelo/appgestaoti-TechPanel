"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UserCheck, Users, FileText, Hash } from "lucide-react"
import type { Department } from "@/types/department"

interface ViewDepartmentModalProps {
  department: Department
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewDepartmentModal({ department, open, onOpenChange }: ViewDepartmentModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Detalhes do Departamento
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nome</label>
                <p className="text-lg font-semibold">{department.name}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Descrição</label>
                <p className="text-sm leading-relaxed">{department.description}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Status do Gerente</label>
                <div className="mt-1">
                  {department.managerId ? (
                    <Badge variant="default" className="gap-1">
                      <UserCheck className="h-3 w-3" />
                      Com gerente atribuído
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="gap-1">
                      <Users className="h-3 w-3" />
                      Sem gerente atribuído
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Informações do Sistema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">ID do Departamento</label>
                <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{department.id}</p>
              </div>

              {department.managerId && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID do Gerente</label>
                  <p className="text-sm font-mono bg-muted px-2 py-1 rounded">{department.managerId}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

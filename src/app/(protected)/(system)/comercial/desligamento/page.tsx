"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { UserMinus, Plus, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, Loader2, FileText } from "lucide-react"
import { CreateTerminationForm } from "@/components/create-termination-form"
import { EmployeeTerminationFilters } from "@/components/employee-termination-filters"
import { useEmployeeTerminations } from "@/hooks/use-employee-terminations"
import type { TerminationFilters } from "@/types/employee-termination"
import { TERMINATION_STATUS, PRIORITY_LEVELS, TERMINATION_REASONS } from "@/types/employee-termination"

const initialFilters: TerminationFilters = {
  search: "",
  status: "",
  priority: "",
  department: "",
  terminationReason: "",
  dateFrom: "",
  dateTo: "",
  requestedBy: "",
}

export default function ComercialDesligamentoPage() {
  const { terminations, isLoading, error, createTermination, refetch } = useEmployeeTerminations()
  const { toast } = useToast()

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [filters, setFilters] = useState<TerminationFilters>(initialFilters)

  // Filtrar apenas solicitações criadas pelo comercial
  const comercialTerminations = useMemo(() => {
    return terminations.filter((termination) => {
      // Filtros básicos
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        const matchesName = termination.employeeName.toLowerCase().includes(searchLower)
        const matchesCpf = termination.employeeCpf.toLowerCase().includes(searchLower)
        const matchesEmail = termination.employeeEmail.toLowerCase().includes(searchLower)
        if (!matchesName && !matchesCpf && !matchesEmail) return false
      }

      if (filters.status && termination.status !== filters.status) return false
      if (filters.priority && termination.priority !== filters.priority) return false
      if (filters.department && termination.department !== filters.department) return false
      if (filters.terminationReason && termination.terminationReason !== filters.terminationReason) return false

      if (filters.dateFrom) {
        const terminationDate = new Date(termination.terminationDate)
        const fromDate = new Date(filters.dateFrom)
        if (terminationDate < fromDate) return false
      }

      if (filters.dateTo) {
        const terminationDate = new Date(termination.terminationDate)
        const toDate = new Date(filters.dateTo)
        if (terminationDate > toDate) return false
      }

      if (filters.requestedBy) {
        const requestedByLower = filters.requestedBy.toLowerCase()
        if (!termination.requestedByName.toLowerCase().includes(requestedByLower)) return false
      }

      return true
    })
  }, [terminations, filters])

  // Estatísticas
  const stats = useMemo(() => {
    const total = comercialTerminations.length
    const pending = comercialTerminations.filter((t) => t.status === "PENDING").length
    const approved = comercialTerminations.filter((t) => t.status === "APPROVED").length
    const completed = comercialTerminations.filter((t) => t.status === "COMPLETED").length
    const rejected = comercialTerminations.filter((t) => t.status === "REJECTED").length

    return { total, pending, approved, completed, rejected }
  }, [comercialTerminations])

  const handleCreateTermination = async (data: any) => {
    try {
      await createTermination(data)
      setIsCreateModalOpen(false)
      toast({
        title: "Solicitação Criada!",
        description: "A solicitação de desligamento foi enviada para aprovação do RH.",
      })
    } catch (error) {
      toast({
        title: "Erro ao criar solicitação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      PENDING: "default",
      APPROVED: "secondary",
      REJECTED: "destructive",
      COMPLETED: "default",
      CANCELLED: "outline",
    } as const

    const colors = {
      PENDING: "text-yellow-700 bg-yellow-100",
      APPROVED: "text-blue-700 bg-blue-100",
      REJECTED: "text-red-700 bg-red-100",
      COMPLETED: "text-green-700 bg-green-100",
      CANCELLED: "text-gray-700 bg-gray-100",
    } as const

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {TERMINATION_STATUS[status as keyof typeof TERMINATION_STATUS]}
      </Badge>
    )
  }

  const getPriorityBadge = (priority: string) => {
    const colors = {
      LOW: "text-gray-700 bg-gray-100",
      MEDIUM: "text-blue-700 bg-blue-100",
      HIGH: "text-orange-700 bg-orange-100",
      URGENT: "text-red-700 bg-red-100",
    } as const

    return (
      <Badge variant="outline" className={colors[priority as keyof typeof colors]}>
        {PRIORITY_LEVELS[priority as keyof typeof PRIORITY_LEVELS]}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UserMinus className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Desligamento de Funcionários</h1>
          </div>
          <p className="text-muted-foreground">Gerencie solicitações de desligamento do departamento comercial</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Nova Solicitação
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nova Solicitação de Desligamento</DialogTitle>
                <DialogDescription>Preencha os dados do funcionário que será desligado</DialogDescription>
              </DialogHeader>
              <CreateTerminationForm
                onSubmit={handleCreateTermination}
                onCancel={() => setIsCreateModalOpen(false)}
                isLoading={isLoading}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">solicitações</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">aguardando RH</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">aguardando TI</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">finalizadas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">pelo RH</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <EmployeeTerminationFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() => setFilters(initialFilters)}
      />

      {/* Lista de Solicitações */}
      <Card>
        <CardHeader>
          <CardTitle>Minhas Solicitações de Desligamento</CardTitle>
          <CardDescription>
            Acompanhe o status das suas solicitações de desligamento
            {comercialTerminations.length !== terminations.length && (
              <span className="text-sm text-muted-foreground ml-2">
                • {comercialTerminations.length} de {terminations.length} solicitações
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Carregando solicitações...</p>
                  <p className="text-sm text-muted-foreground">Por favor, aguarde</p>
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="space-y-4">
                <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
                <div className="space-y-2">
                  <p className="text-lg font-medium text-destructive">Erro ao carregar dados</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">{error}</p>
                </div>
                <Button onClick={refetch} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
            </div>
          ) : comercialTerminations.length > 0 ? (
            <div className="space-y-4">
              {comercialTerminations.map((termination) => (
                <Card key={termination.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{termination.employeeName}</h3>
                          {getStatusBadge(termination.status)}
                          {getPriorityBadge(termination.priority)}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Departamento:</span>
                            <p className="font-medium">{termination.department}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Cargo:</span>
                            <p className="font-medium">{termination.position}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Data de Desligamento:</span>
                            <p className="font-medium">
                              {new Date(termination.terminationDate).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Motivo:</span>
                            <p className="font-medium">{TERMINATION_REASONS[termination.terminationReason]}</p>
                          </div>
                        </div>

                        {termination.terminationReasonDescription && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Descrição:</span>
                            <p className="mt-1">{termination.terminationReasonDescription}</p>
                          </div>
                        )}

                        {termination.hrNotes && (
                          <div className="text-sm bg-blue-50 p-3 rounded-lg">
                            <span className="text-blue-800 font-medium">Observações do RH:</span>
                            <p className="mt-1 text-blue-700">{termination.hrNotes}</p>
                          </div>
                        )}

                        {termination.itNotes && (
                          <div className="text-sm bg-green-50 p-3 rounded-lg">
                            <span className="text-green-800 font-medium">Observações do TI:</span>
                            <p className="mt-1 text-green-700">{termination.itNotes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-4">
                <UserMinus className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Nenhuma solicitação encontrada</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Você ainda não criou nenhuma solicitação de desligamento ou nenhuma corresponde aos filtros
                    aplicados.
                  </p>
                </div>
                <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Criar Primeira Solicitação
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Nova Solicitação de Desligamento</DialogTitle>
                      <DialogDescription>Preencha os dados do funcionário que será desligado</DialogDescription>
                    </DialogHeader>
                    <CreateTerminationForm
                      onSubmit={handleCreateTermination}
                      onCancel={() => setIsCreateModalOpen(false)}
                      isLoading={isLoading}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

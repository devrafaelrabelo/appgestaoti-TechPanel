"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Loader2,
  FileText,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react"
import { EmployeeTerminationFilters } from "@/components/employee-termination-filters"
import { useEmployeeTerminations } from "@/hooks/use-employee-terminations"
import type { TerminationFilters, HRApprovalData } from "@/types/employee-termination"
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

export default function RHDesligamentoPage() {
  const { terminations, isLoading, error, approveTermination, refetch } = useEmployeeTerminations()
  const { toast } = useToast()

  const [filters, setFilters] = useState<TerminationFilters>(initialFilters)
  const [selectedTermination, setSelectedTermination] = useState<any>(null)
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)
  const [approvalData, setApprovalData] = useState<HRApprovalData>({
    approved: true,
    hrNotes: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)

  // Filtrar solicitações relevantes para o RH (PENDING, APPROVED, REJECTED)
  const rhTerminations = useMemo(() => {
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
    const total = rhTerminations.length
    const pending = rhTerminations.filter((t) => t.status === "PENDING").length
    const approved = rhTerminations.filter((t) => t.status === "APPROVED").length
    const completed = rhTerminations.filter((t) => t.status === "COMPLETED").length
    const rejected = rhTerminations.filter((t) => t.status === "REJECTED").length

    return { total, pending, approved, completed, rejected }
  }, [rhTerminations])

  const handleApprovalClick = (termination: any, approved: boolean) => {
    setSelectedTermination(termination)
    setApprovalData({
      approved,
      hrNotes: "",
    })
    setIsApprovalModalOpen(true)
  }

  const handleApprovalSubmit = async () => {
    if (!selectedTermination) return

    try {
      setIsProcessing(true)
      await approveTermination(selectedTermination.id, approvalData)
      setIsApprovalModalOpen(false)
      setSelectedTermination(null)
      setApprovalData({ approved: true, hrNotes: "" })

      toast({
        title: approvalData.approved ? "Solicitação Aprovada!" : "Solicitação Rejeitada",
        description: approvalData.approved
          ? "A solicitação foi aprovada e enviada para o TI executar o desligamento."
          : "A solicitação foi rejeitada e o solicitante foi notificado.",
      })
    } catch (error) {
      toast({
        title: "Erro ao processar solicitação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
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
            <UserCheck className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Aprovação de Desligamentos</h1>
          </div>
          <p className="text-muted-foreground">Analise e aprove solicitações de desligamento de funcionários</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Badge variant="secondary">Sistema RH</Badge>
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
            <p className="text-xs text-muted-foreground">aguardando análise</p>
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
          <CardTitle>Solicitações de Desligamento</CardTitle>
          <CardDescription>
            Analise e aprove as solicitações de desligamento
            {rhTerminations.length !== terminations.length && (
              <span className="text-sm text-muted-foreground ml-2">
                • {rhTerminations.length} de {terminations.length} solicitações
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
          ) : rhTerminations.length > 0 ? (
            <div className="space-y-4">
              {rhTerminations.map((termination) => (
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
                            <span className="text-muted-foreground">Solicitado por:</span>
                            <p className="font-medium">{termination.requestedByName}</p>
                          </div>
                        </div>

                        <div className="text-sm">
                          <span className="text-muted-foreground">Motivo:</span>
                          <p className="font-medium">
                            {TERMINATION_REASONS[termination.terminationReason]} -{" "}
                            {termination.terminationReasonDescription}
                          </p>
                        </div>

                        {termination.commercialNotes && (
                          <div className="text-sm bg-gray-50 p-3 rounded-lg">
                            <span className="text-gray-800 font-medium">Observações Comerciais:</span>
                            <p className="mt-1 text-gray-700">{termination.commercialNotes}</p>
                          </div>
                        )}

                        {termination.hasSystemAccess && termination.systemAccounts.length > 0 && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Sistemas com Acesso:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {termination.systemAccounts.map((account, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {account}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {termination.hasPhysicalAssets && termination.physicalAssets.length > 0 && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Equipamentos:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {termination.physicalAssets.map((asset, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {asset}
                                </Badge>
                              ))}
                            </div>
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

                      {/* Ações */}
                      <div className="flex flex-col gap-2 ml-4">
                        {termination.status === "PENDING" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApprovalClick(termination, true)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleApprovalClick(termination, false)}
                            >
                              <ThumbsDown className="h-4 w-4 mr-1" />
                              Rejeitar
                            </Button>
                          </>
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
                <UserCheck className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Nenhuma solicitação encontrada</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Não há solicitações de desligamento para análise no momento ou nenhuma corresponde aos filtros
                    aplicados.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Aprovação/Rejeição */}
      <Dialog open={isApprovalModalOpen} onOpenChange={setIsApprovalModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{approvalData.approved ? "Aprovar" : "Rejeitar"} Solicitação de Desligamento</DialogTitle>
            <DialogDescription>
              {selectedTermination && (
                <>
                  Funcionário: <strong>{selectedTermination.employeeName}</strong> - {selectedTermination.department}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hrNotes">Observações do RH {approvalData.approved ? "(opcional)" : "*"}</Label>
              <Textarea
                id="hrNotes"
                placeholder={
                  approvalData.approved
                    ? "Adicione observações sobre a aprovação..."
                    : "Explique o motivo da rejeição..."
                }
                value={approvalData.hrNotes}
                onChange={(e) => setApprovalData((prev) => ({ ...prev, hrNotes: e.target.value }))}
                rows={4}
                required={!approvalData.approved}
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsApprovalModalOpen(false)} disabled={isProcessing}>
                Cancelar
              </Button>
              <Button
                onClick={handleApprovalSubmit}
                disabled={isProcessing || (!approvalData.approved && !approvalData.hrNotes.trim())}
                className={approvalData.approved ? "bg-green-600 hover:bg-green-700" : ""}
                variant={approvalData.approved ? "default" : "destructive"}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    {approvalData.approved ? (
                      <>
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Aprovar Solicitação
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="h-4 w-4 mr-2" />
                        Rejeitar Solicitação
                      </>
                    )}
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

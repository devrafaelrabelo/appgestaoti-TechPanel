"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import {
  Settings,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Loader2,
  FileText,
  Monitor,
  Shield,
  HardDrive,
} from "lucide-react"
import { EmployeeTerminationFilters } from "@/components/employee-termination-filters"
import { useEmployeeTerminations } from "@/hooks/use-employee-terminations"
import type { TerminationFilters, ITExecutionData } from "@/types/employee-termination"
import { TERMINATION_STATUS, PRIORITY_LEVELS } from "@/types/employee-termination"

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

export default function TIDesligamentoPage() {
  const { terminations, isLoading, error, executeTermination, refetch } = useEmployeeTerminations()
  const { toast } = useToast()

  const [filters, setFilters] = useState<TerminationFilters>(initialFilters)
  const [selectedTermination, setSelectedTermination] = useState<any>(null)
  const [isExecutionModalOpen, setIsExecutionModalOpen] = useState(false)
  const [executionData, setExecutionData] = useState<ITExecutionData>({
    itNotes: "",
    accountsDeactivated: [],
    assetsRecovered: [],
  })
  const [isProcessing, setIsProcessing] = useState(false)

  // Filtrar apenas solicitações aprovadas pelo RH
  const tiTerminations = useMemo(() => {
    return terminations.filter((termination) => {
      // Mostrar apenas APPROVED e COMPLETED
      if (!["APPROVED", "COMPLETED"].includes(termination.status)) return false

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
    const total = tiTerminations.length
    const approved = tiTerminations.filter((t) => t.status === "APPROVED").length
    const completed = tiTerminations.filter((t) => t.status === "COMPLETED").length
    const urgent = tiTerminations.filter((t) => t.priority === "URGENT").length
    const withAssets = tiTerminations.filter((t) => t.hasPhysicalAssets).length

    return { total, approved, completed, urgent, withAssets }
  }, [tiTerminations])

  const handleExecutionClick = (termination: any) => {
    setSelectedTermination(termination)
    setExecutionData({
      itNotes: "",
      accountsDeactivated: termination.systemAccounts || [],
      assetsRecovered: termination.physicalAssets || [],
    })
    setIsExecutionModalOpen(true)
  }

  const handleAccountToggle = (account: string, checked: boolean) => {
    setExecutionData((prev) => ({
      ...prev,
      accountsDeactivated: checked
        ? [...prev.accountsDeactivated, account]
        : prev.accountsDeactivated.filter((acc) => acc !== account),
    }))
  }

  const handleAssetToggle = (asset: string, checked: boolean) => {
    setExecutionData((prev) => ({
      ...prev,
      assetsRecovered: checked ? [...prev.assetsRecovered, asset] : prev.assetsRecovered.filter((ass) => ass !== asset),
    }))
  }

  const handleExecutionSubmit = async () => {
    if (!selectedTermination) return

    if (!executionData.itNotes.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Adicione observações sobre a execução do desligamento",
        variant: "destructive",
      })
      return
    }

    try {
      setIsProcessing(true)
      await executeTermination(selectedTermination.id, executionData)
      setIsExecutionModalOpen(false)
      setSelectedTermination(null)
      setExecutionData({ itNotes: "", accountsDeactivated: [], assetsRecovered: [] })

      toast({
        title: "Desligamento Executado!",
        description: "O desligamento foi executado com sucesso e todas as partes foram notificadas.",
      })
    } catch (error) {
      toast({
        title: "Erro ao executar desligamento",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      APPROVED: "text-blue-700 bg-blue-100",
      COMPLETED: "text-green-700 bg-green-100",
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
            <Settings className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Execução de Desligamentos</h1>
          </div>
          <p className="text-muted-foreground">
            Execute desligamentos aprovados pelo RH - desative contas e recolha equipamentos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refetch} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Badge variant="secondary">Sistema TI</Badge>
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
            <p className="text-xs text-muted-foreground">desligamentos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">para executar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">executados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground">alta prioridade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Com Equipamentos</CardTitle>
            <HardDrive className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.withAssets}</div>
            <p className="text-xs text-muted-foreground">para recolher</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <EmployeeTerminationFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() => setFilters(initialFilters)}
        availableStatuses={["APPROVED", "COMPLETED"]}
      />

      {/* Lista de Desligamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Desligamentos para Execução</CardTitle>
          <CardDescription>
            Execute os desligamentos aprovados pelo RH
            {tiTerminations.length !== terminations.length && (
              <span className="text-sm text-muted-foreground ml-2">
                • {tiTerminations.length} de {terminations.length} desligamentos
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
                  <p className="text-lg font-medium">Carregando desligamentos...</p>
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
          ) : tiTerminations.length > 0 ? (
            <div className="space-y-4">
              {tiTerminations.map((termination) => (
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
                            <span className="text-muted-foreground">Aprovado por:</span>
                            <p className="font-medium">{termination.hrApprovedByName || "RH"}</p>
                          </div>
                        </div>

                        {termination.hrNotes && (
                          <div className="text-sm bg-blue-50 p-3 rounded-lg">
                            <span className="text-blue-800 font-medium">Observações do RH:</span>
                            <p className="mt-1 text-blue-700">{termination.hrNotes}</p>
                          </div>
                        )}

                        {termination.hasSystemAccess && termination.systemAccounts.length > 0 && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Contas para Desativar:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {termination.systemAccounts.map((account, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Shield className="h-3 w-3 mr-1" />
                                  {account}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {termination.hasPhysicalAssets && termination.physicalAssets.length > 0 && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Equipamentos para Recolher:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {termination.physicalAssets.map((asset, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Monitor className="h-3 w-3 mr-1" />
                                  {asset}
                                </Badge>
                              ))}
                            </div>
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
                        {termination.status === "APPROVED" && (
                          <Button
                            size="sm"
                            onClick={() => handleExecutionClick(termination)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Settings className="h-4 w-4 mr-1" />
                            Executar
                          </Button>
                        )}
                        {termination.status === "COMPLETED" && (
                          <Badge className="text-green-700 bg-green-100">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Concluído
                          </Badge>
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
                <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Nenhum desligamento para executar</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Não há desligamentos aprovados pelo RH aguardando execução no momento.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Execução */}
      <Dialog open={isExecutionModalOpen} onOpenChange={setIsExecutionModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Executar Desligamento</DialogTitle>
            <DialogDescription>
              {selectedTermination && (
                <>
                  Funcionário: <strong>{selectedTermination.employeeName}</strong> - {selectedTermination.department}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Contas do Sistema */}
            {selectedTermination?.hasSystemAccess && selectedTermination.systemAccounts.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-medium">Contas do Sistema</Label>
                <p className="text-sm text-muted-foreground">Marque as contas que foram desativadas:</p>
                <div className="space-y-2">
                  {selectedTermination.systemAccounts.map((account: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`account-${index}`}
                        checked={executionData.accountsDeactivated.includes(account)}
                        onCheckedChange={(checked) => handleAccountToggle(account, checked as boolean)}
                      />
                      <Label htmlFor={`account-${index}`} className="flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        {account}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Equipamentos Físicos */}
            {selectedTermination?.hasPhysicalAssets && selectedTermination.physicalAssets.length > 0 && (
              <div className="space-y-3">
                <Label className="text-base font-medium">Equipamentos Físicos</Label>
                <p className="text-sm text-muted-foreground">Marque os equipamentos que foram recolhidos:</p>
                <div className="space-y-2">
                  {selectedTermination.physicalAssets.map((asset: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Checkbox
                        id={`asset-${index}`}
                        checked={executionData.assetsRecovered.includes(asset)}
                        onCheckedChange={(checked) => handleAssetToggle(asset, checked as boolean)}
                      />
                      <Label htmlFor={`asset-${index}`} className="flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        {asset}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Observações do TI */}
            <div className="space-y-2">
              <Label htmlFor="itNotes">Observações do TI *</Label>
              <Textarea
                id="itNotes"
                placeholder="Descreva as ações executadas, problemas encontrados, observações importantes..."
                value={executionData.itNotes}
                onChange={(e) => setExecutionData((prev) => ({ ...prev, itNotes: e.target.value }))}
                rows={4}
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsExecutionModalOpen(false)} disabled={isProcessing}>
                Cancelar
              </Button>
              <Button
                onClick={handleExecutionSubmit}
                disabled={isProcessing || !executionData.itNotes.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Executando...
                  </>
                ) : (
                  <>
                    <Settings className="h-4 w-4 mr-2" />
                    Confirmar Execução
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

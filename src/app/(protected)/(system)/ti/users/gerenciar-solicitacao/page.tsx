"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import {
  UserPlus,
  ListTodo,
  Eye,
  Loader2,
  RefreshCw,
  AlertTriangle,
  Users,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import { CreateUserFromRequestForm } from "@/components/create-user-from-request-form"
import { UserRequestTable } from "@/components/user-request-table"
import { UserRequestFiltersComponent } from "@/components/user-request-filters"
import type {
  ApiListedUserRequest,
  ApiDetailedUserRequest,
  MappedUserRequest,
  UserRequestFilters,
} from "@/types/user-request"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"

// Função para formatar CPF
const formatCpfDisplay = (cpf: string): string => {
  if (!cpf) return ""
  const cleaned = cpf.replace(/\D/g, "")
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }
  return cpf
}

const initialFilters: UserRequestFilters = {
  searchTerm: "",
  status: "",
  dateFrom: "",
  dateTo: "",
}

export default function gerenciarsolicitacao() {
  const [requests, setRequests] = useState<MappedUserRequest[]>([])
  const [filteredRequests, setFilteredRequests] = useState<MappedUserRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<UserRequestFilters>(initialFilters)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<ApiDetailedUserRequest | null>(null)
  const [isLoadingDetails, setIsLoadingDetails] = useState(false)

  const { toast } = useToast()

  // Calcular estatísticas das solicitações
  const stats = useMemo(() => {
    const total = requests.length
    const approved = requests.filter((r) => r.status === "COMPLETED").length
    const pending = requests.filter((r) => r.status === "PENDING").length
    const rejected = requests.filter((r) => r.status === "REJECTED").length

    return { total, approved, pending, rejected }
  }, [requests])

  // Carregar lista de solicitações
  const loadRequests = useCallback(async () => {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      setError("URL base da API não configurada. Verifique as variáveis de ambiente.")
      setIsLoading(false)
      toast({
        title: "Erro de Configuração",
        description: "URL base da API não configurada.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.userRequestsList}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal: AbortSignal.timeout(8000),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Erro ao buscar solicitações: ${response.status} ${response.statusText} - ${errorData.message || ""}`,
        )
      }

      const data = await response.json()
      const apiRequests: ApiListedUserRequest[] = data.data || data || []

      // Mapear para MappedUserRequest
      const mappedRequests: MappedUserRequest[] = apiRequests.map((req) => ({
        id: req.id,
        fullName: `${req.firstName} ${req.lastName}`,
        cpf: formatCpfDisplay(req.cpf),
        status: req.status.toUpperCase() as MappedUserRequest["status"],
        requestDate: req.requestedAt,
      }))

      setRequests(mappedRequests)
    } catch (err) {
      console.error("Erro ao carregar solicitações:", err)
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido."
      setError(errorMessage)
      toast({
        title: "Erro ao Carregar Solicitações",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [toast])

  // Filtrar solicitações baseado nos filtros aplicados
  const applyFilters = useMemo(() => {
    return requests.filter((request) => {
      // Filtro por status
      if (filters.status && filters.status !== "" && request.status !== filters.status) {
        return false
      }

      // Filtro por termo de busca (nome ou CPF)
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase()
        const matchesName = request.fullName.toLowerCase().includes(searchLower)
        const matchesCpf = request.cpf.replace(/\D/g, "").includes(filters.searchTerm.replace(/\D/g, ""))
        if (!matchesName && !matchesCpf) {
          return false
        }
      }

      // Filtro por data inicial
      if (filters.dateFrom) {
        const requestDate = new Date(request.requestDate)
        const fromDate = new Date(filters.dateFrom)
        if (requestDate < fromDate) {
          return false
        }
      }

      // Filtro por data final
      if (filters.dateTo) {
        const requestDate = new Date(request.requestDate)
        const toDate = new Date(filters.dateTo)
        toDate.setHours(23, 59, 59, 999)
        if (requestDate > toDate) {
          return false
        }
      }

      return true
    })
  }, [requests, filters])

  // Atualizar solicitações filtradas quando os filtros mudarem
  useEffect(() => {
    setFilteredRequests(applyFilters)
  }, [applyFilters])

  // Carregar detalhes da solicitação
  const loadRequestDetails = async (requestId: string) => {
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      toast({
        title: "Erro de Configuração",
        description: "URL da API não configurada.",
        variant: "destructive",
      })
      return null
    }

    try {
      setIsLoadingDetails(true)
      const response = await fetchWithValidation(`${ApiEndpoints.backend.userRequestsId}${requestId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal: AbortSignal.timeout(8000),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Erro ao carregar detalhes da solicitação: ${response.status} ${response.statusText} - ${errorData.message || ""}`,
        )
      }

      const data = await response.json()
      return data.data || data
    } catch (error) {
      console.error("Erro ao carregar detalhes:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes da solicitação.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsLoadingDetails(false)
    }
  }

  // Iniciar criação de usuário
  const handleInitiateCreation = async (request: MappedUserRequest) => {
    const details = await loadRequestDetails(request.id)
    if (details) {
      setSelectedRequest(details)
      setIsCreateModalOpen(true)
    }
  }

  // Callback quando usuário é criado com sucesso
  const handleUserCreated = (createdUserData: any) => {
    toast({
      title: "Usuário Criado com Sucesso!",
      description: `O usuário ${createdUserData.firstName} ${createdUserData.lastName} foi criado no sistema.`,
    })
    setIsCreateModalOpen(false)
    setSelectedRequest(null)
    // Recarregar a lista para atualizar status
    loadRequests()
  }

  // Handlers para filtros
  const handleFiltersChange = (newFilters: UserRequestFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters(initialFilters)
  }

  const handleSelectionChange = (newSelectedIds: Set<string>) => {
    setSelectedIds(newSelectedIds)
  }

  // Carregar dados na inicialização
  useEffect(() => {
    loadRequests()
  }, [loadRequests])

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <UserPlus className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">Criar Usuários</h1>
          </div>
          <p className="text-muted-foreground">Selecione uma solicitação aprovada para criar o usuário no sistema</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={loadRequests} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Badge variant="secondary">Sistema de Usuários</Badge>
        </div>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Solicitações</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {filteredRequests.length !== stats.total && <span>({filteredRequests.length} filtradas)</span>}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprovadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Prontas para criação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Aguardando aprovação</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejeitadas</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Não aprovadas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <UserRequestFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onClearFilters={handleClearFilters}
      />

      {/* Lista de Solicitações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ListTodo className="h-5 w-5" />
            Solicitações de Usuários
          </CardTitle>
          <CardDescription>
            Gerencie as solicitações de criação de usuários no sistema
            {filteredRequests.length !== requests.length && (
              <span className="text-sm text-muted-foreground ml-2">
                • {filteredRequests.length} de {requests.length} solicitações exibidas
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
                <Button onClick={loadRequests} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Tentar Novamente
                </Button>
              </div>
            </div>
          ) : filteredRequests.length > 0 ? (
            <UserRequestTable
              requests={filteredRequests}
              selectedIds={selectedIds}
              onSelectionChange={handleSelectionChange}
              onInitiateCreation={handleInitiateCreation}
            />
          ) : requests.length > 0 ? (
            <div className="text-center py-12">
              <div className="space-y-4">
                <Eye className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Nenhuma solicitação encontrada</p>
                  <p className="text-sm text-muted-foreground">Nenhuma solicitação corresponde aos filtros aplicados</p>
                </div>
                <Button onClick={handleClearFilters} variant="outline">
                  Limpar Filtros
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="space-y-4">
                <UserPlus className="mx-auto h-12 w-12 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Nenhuma solicitação encontrada</p>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto">
                    Não há solicitações de usuários no sistema. As solicitações aparecerão aqui quando forem criadas.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Criação de Usuário */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Criar Usuário a partir da Solicitação
            </DialogTitle>
            <DialogDescription>
              Complete os dados para criar o usuário para{" "}
              <strong>
                {selectedRequest?.firstName} {selectedRequest?.lastName}
              </strong>
            </DialogDescription>
          </DialogHeader>

          {isLoadingDetails ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-4">
                <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                <div className="space-y-2">
                  <p className="text-lg font-medium">Carregando detalhes...</p>
                  <p className="text-sm text-muted-foreground">Por favor, aguarde</p>
                </div>
              </div>
            </div>
          ) : selectedRequest ? (
            <CreateUserFromRequestForm
              requestData={selectedRequest}
              onSuccess={handleUserCreated}
              onCancel={() => {
                setIsCreateModalOpen(false)
                setSelectedRequest(null)
              }}
            />
          ) : null}
        </DialogContent>
      </Dialog>

      <Toaster />
    </div>
  )
}

"use client"

import { useState, useEffect, useCallback } from "react"
import { Phone, Plus, Users, MessageCircle, Shield, RefreshCw, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { CorporatePhoneFilters } from "@/components/corporate-phone-filters"
import { CorporatePhoneTable } from "@/components/corporate-phone-table"
import { CreateCorporatePhoneModal } from "@/components/create-corporate-phone-modal"
import { Pagination } from "@/components/common/pagination"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"
import type {
  CorporatePhone,
  CreateCorporatePhoneRequest,
  UpdateCorporatePhoneRequest,
  CorporatePhoneFilters as Filters,
} from "@/types/corporate-phone"

export default function CorporatePhonesPage() {
  const { toast } = useToast()

  // Estados
  const [corporatePhones, setCorporatePhones] = useState<CorporatePhone[]>([])
  const [filters, setFilters] = useState<Filters & { page?: number; size?: number }>({
    page: 0,
    size: 20,
  })
  const [pagination, setPagination] = useState({
    totalElements: 0,
    totalPages: 0,
    currentPage: 0,
    size: 20,
    first: true,
    last: true,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Função para buscar telefones corporativos
  const fetchCorporatePhones = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      if (filters.search) searchParams.append("search", filters.search)
      if (filters.carrier) searchParams.append("carrier", filters.carrier)
      if (filters.planType) searchParams.append("planType", filters.planType)
      if (filters.status) searchParams.append("status", filters.status)
      if (filters.companyId) searchParams.append("companyId", filters.companyId.toString())
      if (filters.currentUserId) searchParams.append("currentUserId", filters.currentUserId.toString())
      if (filters.page !== undefined) searchParams.append("page", filters.page.toString())
      if (filters.size !== undefined) searchParams.append("size", filters.size.toString())

      const url = `${ApiEndpoints.backend.resourceCorporatePhoneList}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`

      const response = await fetchWithValidation(url, {
        method: "GET",
      })

      if (!response.ok) {
        throw new Error("Falha ao carregar telefones corporativos")
      }

      const data = await response.json()

      // Verifica se a resposta tem a estrutura do Spring Boot
      if (data.content && Array.isArray(data.content)) {
        setCorporatePhones(data.content)
        setPagination({
          totalElements: data.totalElements,
          totalPages: data.totalPages,
          currentPage: data.number,
          size: data.size,
          first: data.first,
          last: data.last,
        })
      } else {
        // Fallback para estrutura simples
        const phones = Array.isArray(data) ? data : data.data && Array.isArray(data.data) ? data.data : []
        setCorporatePhones(phones)
        setPagination({
          totalElements: phones.length,
          totalPages: 1,
          currentPage: 0,
          size: phones.length,
          first: true,
          last: true,
        })
      }
    } catch (err) {
      console.error("Erro ao buscar telefones corporativos:", err)
      setError("Falha ao carregar telefones corporativos. Tente novamente.")
      setCorporatePhones([])
      toast({
        title: "Erro",
        description: "Falha ao carregar telefones corporativos.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [filters, toast])

  // Função para criar telefone corporativo
  const createCorporatePhone = async (data: CreateCorporatePhoneRequest): Promise<CorporatePhone> => {
    try {
      const response = await fetchWithValidation(ApiEndpoints.backend.resourceCorporatePhoneCreate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Falha ao criar telefone corporativo")
      }

      const newPhone = await response.json()

      toast({
        title: "Sucesso!",
        description: "Telefone corporativo criado com sucesso.",
      })

      await fetchCorporatePhones()
      return newPhone
    } catch (error) {
      console.error("Erro ao criar telefone corporativo:", error)
      toast({
        title: "Erro",
        description: "Falha ao criar telefone corporativo.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Função para atualizar telefone corporativo
  const updateCorporatePhone = async (data: UpdateCorporatePhoneRequest): Promise<CorporatePhone> => {
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceCorporatePhoneIdAlter}/${data.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Falha ao atualizar telefone corporativo")
      }

      const updatedPhone = await response.json()

      toast({
        title: "Sucesso!",
        description: "Telefone corporativo atualizado com sucesso.",
      })

      await fetchCorporatePhones()
      return updatedPhone
    } catch (error) {
      console.error("Erro ao atualizar telefone corporativo:", error)
      toast({
        title: "Erro",
        description: "Falha ao atualizar telefone corporativo.",
        variant: "destructive",
      })
      throw error
    }
  }

  // Função para excluir telefone corporativo
  const deleteCorporatePhone = async (id: number): Promise<void> => {
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceCorporatePhoneIdDelete}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Falha ao excluir telefone corporativo")
      }

      toast({
        title: "Sucesso!",
        description: "Telefone corporativo excluído com sucesso.",
      })

      await fetchCorporatePhones()
    } catch (error) {
      console.error("Erro ao excluir telefone corporativo:", error)
      toast({
        title: "Erro",
        description: "Falha ao excluir telefone corporativo.",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateFilters = useCallback((newFilters: Filters) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 0, // Reset page when filters change
    }))
  }, [])

  const changePage = useCallback((page: number) => {
    setFilters((prev) => ({ ...prev, page }))
  }, [])

  const changePageSize = useCallback((size: number) => {
    setFilters((prev) => ({ ...prev, size, page: 0 }))
  }, [])

  const handleClearFilters = () => {
    setFilters({
      page: 0,
      size: 20,
    })
  }

  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false)
  }

  // Carregar dados iniciais
  useEffect(() => {
    fetchCorporatePhones()
  }, [fetchCorporatePhones])

  // Calcular estatísticas
  const stats = {
    total: pagination.totalElements,
    active: corporatePhones.filter((phone) => phone.status === "ACTIVE").length,
    assigned: corporatePhones.filter((phone) => phone.currentUserId !== null).length,
    whatsappBlocked: corporatePhones.filter((phone) => phone.whatsappBlock === true).length,
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Phone className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar telefones</h3>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button onClick={fetchCorporatePhones}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header da página */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Phone className="h-8 w-8" />
            Telefones Corporativos
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie os telefones corporativos da empresa</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} disabled={loading}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Telefone
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Telefones</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">telefones cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <p className="text-xs text-muted-foreground">telefones ativos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Atribuídos</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.assigned}</div>
            <p className="text-xs text-muted-foreground">em uso por usuários</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">WhatsApp Bloqueado</CardTitle>
            <MessageCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.whatsappBlocked}</div>
            <p className="text-xs text-muted-foreground">com WhatsApp bloqueado</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <CorporatePhoneFilters filters={filters} onFiltersChange={updateFilters} onClearFilters={handleClearFilters} />

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Lista de Telefones Corporativos
            {!loading && (
              <span className="text-sm font-normal text-muted-foreground">
                ({pagination.totalElements} {pagination.totalElements === 1 ? "item" : "itens"})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando telefones...</p>
              </div>
            </div>
          ) : (
            <>
              <CorporatePhoneTable
                corporatePhones={corporatePhones}
                onUpdate={updateCorporatePhone}
                onDelete={deleteCorporatePhone}
                loading={loading}
              />
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalElements={pagination.totalElements}
                pageSize={pagination.size}
                onPageChange={changePage}
                onPageSizeChange={changePageSize}
                isLoading={loading}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de criação */}
      <CreateCorporatePhoneModal
        open={isCreateModalOpen}
        onOpenChange={setIsCreateModalOpen}
        onSubmit={createCorporatePhone}
        onSuccess={handleCreateSuccess}
        loading={loading}
      />
    </div>
  )
}

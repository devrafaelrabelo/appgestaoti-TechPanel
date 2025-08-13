"use client"

import { useState, useEffect, useCallback } from "react"
import { Plus, Phone, Settings, RefreshCw, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { InternalExtensionFiltersComponent } from "@/components/internal-extension-filters"
import { InternalExtensionTable } from "@/components/internal-extension-table"
import { CreateInternalExtensionModal } from "@/components/create-internal-extension-modal"
import { Pagination } from "@/components/common/pagination"
import type {
  InternalExtension,
  CreateInternalExtensionData,
  InternalExtensionFilters as FilterType,
} from "@/types/internal-extension"
import { ApiEndpoints } from "@/lib/api-endpoints"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"

export default function InternalExtensionsPage() {
  const [extensions, setExtensions] = useState<InternalExtension[]>([])
  const [filters, setFilters] = useState<FilterType & { page?: number; size?: number }>({
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
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { toast } = useToast()

  // Buscar ramais internos
  const fetchInternalExtensions = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const searchParams = new URLSearchParams()
      if (filters.search) searchParams.append("search", filters.search)
      if (filters.extension) searchParams.append("extension", filters.extension)
      if (filters.application) searchParams.append("application", filters.application)
      if (filters.page !== undefined) searchParams.append("page", filters.page.toString())
      if (filters.size !== undefined) searchParams.append("size", filters.size.toString())

      const url = `${ApiEndpoints.backend.resourceInternalExtensionList}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`

      const response = await fetchWithValidation(url)

      if (!response.ok) {
        throw new Error("Erro ao carregar ramais internos")
      }

      const data = await response.json()

      // Verifica se a resposta tem a estrutura do Spring Boot
      if (data.content && Array.isArray(data.content)) {
        setExtensions(data.content)
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
        const extensionsList = Array.isArray(data) ? data : data.data || []
        setExtensions(extensionsList)
        setPagination({
          totalElements: extensionsList.length,
          totalPages: 1,
          currentPage: 0,
          size: extensionsList.length,
          first: true,
          last: true,
        })
      }
    } catch (error) {
      console.error("Erro ao buscar ramais internos:", error)
      setError("Erro ao carregar ramais internos. Tente novamente.")
      setExtensions([])
      toast({
        title: "Erro",
        description: "Erro ao carregar ramais internos",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [filters, toast])

  // Criar ramal interno
  const createInternalExtension = async (data: CreateInternalExtensionData) => {
    try {
      const response = await fetchWithValidation(ApiEndpoints.backend.resourceInternalExtensionCreate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Erro ao criar ramal interno")
      }

      toast({
        title: "Sucesso",
        description: "Ramal interno criado com sucesso",
      })

      await fetchInternalExtensions()
    } catch (error) {
      console.error("Erro ao criar ramal interno:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao criar ramal interno",
        variant: "destructive",
      })
      throw error
    }
  }

  // Atualizar ramal interno
  const updateInternalExtension = async (id: number, data: CreateInternalExtensionData) => {
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceInternalExtensionIdAlter}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Erro ao atualizar ramal interno")
      }

      toast({
        title: "Sucesso",
        description: "Ramal interno atualizado com sucesso",
      })

      await fetchInternalExtensions()
    } catch (error) {
      console.error("Erro ao atualizar ramal interno:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao atualizar ramal interno",
        variant: "destructive",
      })
      throw error
    }
  }

  // Excluir ramal interno
  const deleteInternalExtension = async (id: number) => {
    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.resourceInternalExtensionIdDelete}/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || "Erro ao excluir ramal interno")
      }

      toast({
        title: "Sucesso",
        description: "Ramal interno excluído com sucesso",
      })

      await fetchInternalExtensions()
    } catch (error) {
      console.error("Erro ao excluir ramal interno:", error)
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao excluir ramal interno",
        variant: "destructive",
      })
      throw error
    }
  }

  const updateFilters = useCallback((newFilters: FilterType) => {
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

  // Carregar dados iniciais
  useEffect(() => {
    fetchInternalExtensions()
  }, [fetchInternalExtensions])

  // Calcular estatísticas
  const stats = {
    total: pagination.totalElements,
    zoiper: extensions.filter((ext) => ext.application === "Zoiper").length,
    xlite: extensions.filter((ext) => ext.application === "X-Lite").length,
    others: extensions.filter((ext) => !["Zoiper", "X-Lite"].includes(ext.application)).length,
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Phone className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Erro ao carregar ramais</h3>
            <p className="text-muted-foreground text-center mb-4">{error}</p>
            <Button onClick={fetchInternalExtensions}>
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
            Ramais Internos
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie os ramais internos e suas aplicações</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Ramal
        </Button>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Ramais</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">ramais cadastrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Zoiper</CardTitle>
            <Settings className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.zoiper}</div>
            <p className="text-xs text-muted-foreground">ramais Zoiper</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">X-Lite</CardTitle>
            <Settings className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.xlite}</div>
            <p className="text-xs text-muted-foreground">ramais X-Lite</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outras Apps</CardTitle>
            <Settings className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{stats.others}</div>
            <p className="text-xs text-muted-foreground">outras aplicações</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <InternalExtensionFiltersComponent filters={filters} onFiltersChange={updateFilters} onClearFilters={handleClearFilters} />

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Lista de Ramais Internos
            {!isLoading && (
              <span className="text-sm font-normal text-muted-foreground">
                ({pagination.totalElements} {pagination.totalElements === 1 ? "item" : "itens"})
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Carregando ramais...</p>
              </div>
            </div>
          ) : (
            <>
              <InternalExtensionTable
                extensions={extensions}
                onEdit={updateInternalExtension}
                onDelete={deleteInternalExtension}
                isLoading={isLoading}
              />
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                totalElements={pagination.totalElements}
                pageSize={pagination.size}
                onPageChange={changePage}
                onPageSizeChange={changePageSize}
                isLoading={isLoading}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal de criação */}
      <CreateInternalExtensionModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSubmit={createInternalExtension}
        isLoading={isLoading}
      />
    </div>
  )
}

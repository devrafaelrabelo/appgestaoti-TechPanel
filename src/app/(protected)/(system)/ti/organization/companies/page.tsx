"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Building2 } from "lucide-react"
import { useCompanies } from "@/hooks/use-companies"
import { StandardFilters } from "@/components/company-filters"
import { CompanyTable } from "@/components/company-table"
import { CreateCompanyModal } from "@/components/create-company-modal"
import { useToast } from "@/components/ui/use-toast"
import type { CreateCompanyPayload, Company } from "@/types/company"

export default function CompaniesPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const { toast } = useToast()

  const {
    companies,
    loading,
    error,
    filters,
    setFilters,
    createCompany,
    updateCompany,
    deleteCompany,
    toggleCompanyStatus,
  } = useCompanies()

  const handleCreateCompany = async (data: CreateCompanyPayload) => {
    try {
      await createCompany(data)
      toast({
        title: "Sucesso",
        description: "Empresa criada com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar empresa. Tente novamente.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleEditCompany = async (company: Company) => {
    try {
      await updateCompany({
        id: company.id,
        name: company.name,
        cnpj: company.cnpj,
        legalName: company.legalName,
        active: company.active,
        address: company.address,
      })
      toast({
        title: "Sucesso",
        description: "Empresa atualizada com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar empresa. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteCompany = async (id: string) => {
    try {
      await deleteCompany(id)
      toast({
        title: "Sucesso",
        description: "Empresa excluída com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir empresa. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleCompanyStatus(id)
      toast({
        title: "Sucesso",
        description: "Status da empresa alterado com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar status da empresa. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleClearFilters = () => {
    setFilters({})
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <p className="text-destructive">Erro ao carregar empresas: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6" />
            <div>
              <h1 className="text-2xl font-bold">Empresas</h1>
              <p className="text-muted-foreground">Gerencie as empresas do sistema</p>
            </div>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Empresa
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Empresas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{companies.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas Ativas</CardTitle>
              <Building2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{companies.filter((c) => c.active).length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empresas Inativas</CardTitle>
              <Building2 className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{companies.filter((c) => !c.active).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <StandardFilters filters={filters} onFiltersChange={setFilters} onClear={handleClearFilters} />

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Empresas</CardTitle>
          </CardHeader>
          <CardContent>
            <CompanyTable
              companies={companies}
              loading={loading}
              onEdit={handleEditCompany}
              onDelete={handleDeleteCompany}
              onToggleStatus={handleToggleStatus}
            />
          </CardContent>
        </Card>

        {/* Modal de Criação */}
        <CreateCompanyModal open={createModalOpen} onOpenChange={setCreateModalOpen} onCreate={handleCreateCompany} />
      </div>
    </div>
  )
}

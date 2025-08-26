"use client"

import { useState } from "react"
import { Plus, Users, Building2, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FunctionFiltersComponent } from "@/components/function-filters"
import { FunctionTable } from "@/components/function-table"
import { CreateFunctionModal } from "@/components/create-function-modal"
import { EditFunctionModal } from "@/components/edit-function-modal"
import { ViewFunctionModal } from "@/components/view-function-modal"
import { useFunctions } from "@/hooks/use-functions"
import type { Function, FunctionFilters as FunctionFiltersType } from "@/types/function"

export default function FunctionsPage() {
  const { functions, loading, stats, fetchFunctions, createFunction, updateFunction, deleteFunction } = useFunctions()

  const [filters, setFilters] = useState<FunctionFiltersType>({})
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedFunction, setSelectedFunction] = useState<Function | null>(null)

  // Aplicar filtros
  const handleFiltersChange = (newFilters: FunctionFiltersType) => {
    setFilters(newFilters)
    fetchFunctions(newFilters)
  }

  // Ações da tabela
  const handleView = (func: Function) => {
    setSelectedFunction(func)
    setViewModalOpen(true)
  }

  const handleEdit = (func: Function) => {
    setSelectedFunction(func)
    setEditModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await deleteFunction(id)
  }

  // Calcular estatísticas
  const departmentCount = Object.keys(stats.byDepartment).length

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Funções
          </h1>
          <p className="text-muted-foreground">Gerencie as funções organizacionais do sistema</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Função
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Funções</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Funções cadastradas no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departamentos</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentCount}</div>
            <p className="text-xs text-muted-foreground">Departamentos com funções</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média por Departamento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {departmentCount > 0 ? Math.round(stats.total / departmentCount) : 0}
            </div>
            <p className="text-xs text-muted-foreground">Funções por departamento</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <FunctionFiltersComponent filters={filters} onFiltersChange={handleFiltersChange} />
      </div>

      {/* Tabela */}
      <FunctionTable
        functions={functions}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modais */}
      <CreateFunctionModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={createFunction}
        loading={loading}
      />

      <EditFunctionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        functionData={selectedFunction}
        onSubmit={updateFunction}
        loading={loading}
      />

      <ViewFunctionModal open={viewModalOpen} onOpenChange={setViewModalOpen} functionData={selectedFunction} />
    </div>
  )
}

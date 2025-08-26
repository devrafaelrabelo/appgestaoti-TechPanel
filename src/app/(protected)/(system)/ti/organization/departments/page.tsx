"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Users, UserCheck } from "lucide-react"
import { useDepartments } from "@/hooks/use-departments"
import { DepartmentFiltersComponent } from "@/components/department-filters"
import { DepartmentTable } from "@/components/department-table"
import { CreateDepartmentModal } from "@/components/create-department-modal"
import { useToast } from "@/components/ui/use-toast"
import type { CreateDepartmentPayload, Department } from "@/types/departments"

export default function DepartmentsPage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const { toast } = useToast()

  const {
    departments,
    loading,
    error,
    stats,
    filters,
    setFilters,
    createDepartment,
    updateDepartment,
    deleteDepartment,
  } = useDepartments()

  const handleCreateDepartment = async (data: CreateDepartmentPayload) => {
    try {
      await createDepartment(data)
      toast({
        title: "Sucesso",
        description: "Departamento criado com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar departamento. Tente novamente.",
        variant: "destructive",
      })
      throw error
    }
  }

  const handleEditDepartment = async (department: Department) => {
    try {
      await updateDepartment({
        id: department.id,
        name: department.name,
        description: department.description,
      })
      toast({
        title: "Sucesso",
        description: "Departamento atualizado com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar departamento. Tente novamente.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDepartment = async (id: string) => {
    try {
      await deleteDepartment(id)
      toast({
        title: "Sucesso",
        description: "Departamento excluído com sucesso!",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir departamento. Tente novamente.",
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
            <p className="text-destructive">Erro ao carregar departamentos: {error}</p>
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
            <Users className="h-6 w-6" />
            <div>
              <h1 className="text-2xl font-bold">Departamentos</h1>
              <p className="text-muted-foreground">Gerencie os departamentos da organização</p>
            </div>
          </div>
          <Button onClick={() => setCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Departamento
          </Button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Departamentos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Com Gerente</CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.withManager}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sem Gerente</CardTitle>
              <Users className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.withoutManager}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <DepartmentFiltersComponent filters={filters} onFiltersChange={setFilters} onClear={handleClearFilters} />

        {/* Tabela */}
        <Card>
          <CardHeader>
            <CardTitle>Lista de Departamentos</CardTitle>
          </CardHeader>
          <CardContent>
            <DepartmentTable
              departments={departments}
              loading={loading}
              onEdit={handleEditDepartment}
              onDelete={handleDeleteDepartment}
            />
          </CardContent>
        </Card>

        {/* Modal de Criação */}
        <CreateDepartmentModal
          open={createModalOpen}
          onOpenChange={setCreateModalOpen}
          onCreate={handleCreateDepartment}
        />
      </div>
    </div>
  )
}

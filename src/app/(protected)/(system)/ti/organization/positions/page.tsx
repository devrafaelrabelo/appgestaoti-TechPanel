"use client"

import { useState } from "react"
import { Plus, Briefcase, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PositionFiltersComponent } from "@/components/position-filters"
import { PositionTable } from "@/components/position-table"
import { CreatePositionModal } from "@/components/create-position-modal"
import { EditPositionModal } from "@/components/edit-position-modal"
import { ViewPositionModal } from "@/components/view-position-modal"
import { usePositions } from "@/hooks/use-positions"
import type { Position, PositionFilters } from "@/types/position"

export default function PositionsPage() {
  const { positions, loading, stats, fetchPositions, createPosition, updatePosition, deletePosition } = usePositions()

  const [filters, setFilters] = useState<PositionFilters>({})
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null)

  // Aplicar filtros
  const handleFiltersChange = (newFilters: PositionFilters) => {
    setFilters(newFilters)
    fetchPositions(newFilters)
  }

  // Ações da tabela
  const handleView = (position: Position) => {
    setSelectedPosition(position)
    setViewModalOpen(true)
  }

  const handleEdit = (position: Position) => {
    setSelectedPosition(position)
    setEditModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    await deletePosition(id)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-2xl">
      {/* Header */}
      <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Briefcase className="h-8 w-8" />
            Posições
          </h1>
          <p className="text-muted-foreground">Gerencie as posições organizacionais do sistema</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Posição
        </Button>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Posições</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Posições cadastradas no sistema</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Posições Ativas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Posições disponíveis para uso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Crescimento</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{Math.round(stats.total * 0.1)}</div>
            <p className="text-xs text-muted-foreground">Novas posições este mês</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <PositionFiltersComponent filters={filters} onFiltersChange={handleFiltersChange} />
      </div>

      {/* Tabela */}
      <PositionTable
        positions={positions}
        loading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Modais */}
      <CreatePositionModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onSubmit={createPosition}
        loading={loading}
      />

      <EditPositionModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        positionData={selectedPosition}
        onSubmit={updatePosition}
        loading={loading}
      />

      <ViewPositionModal open={viewModalOpen} onOpenChange={setViewModalOpen} positionData={selectedPosition} />
    </div>
  )
}

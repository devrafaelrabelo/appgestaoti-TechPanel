"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AdminUserTable } from "@/components/admin/admin-user-table"
import { AdminUserFilters } from "@/components/admin/admin-user-filters"
import { ViewAdminUserModal } from "@/components/admin/view-admin-user-modal"
import { CreateAdminUserModalTabs } from "@/components/create-admin-user-modal-tabs"
import { Pagination } from "@/components/common/pagination"
import { useAdminUsers } from "@/hooks/use-admin-users"
import { useAdminUsersStats } from "@/hooks/use-admin-users-stats"
import { useToast } from "@/components/ui/use-toast"
import { Users, UserPlus, Download, RefreshCw, UserCheck, UserX, Shield, AlertTriangle, Trash2 } from "lucide-react"
import type { AdminUser } from "@/types/admin-user"

export default function AdminUsersPage() {
  const {
    users,
    pagination,
    loading,
    error,
    filters,
    refreshUsers,
    updateFilters,
    toggleUserLock,
    resetUserPassword,
    exportUsers,
  } = useAdminUsers()

  const { toast } = useToast()
  const { stats, loading: statsLoading, refresh: refreshStats } = useAdminUsersStats()

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [viewUser, setViewUser] = useState<AdminUser | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)

  const handleSortChange = (field: string) => {
    const newDirection = filters.sort === field && filters.direction === "asc" ? "desc" : "asc"
    updateFilters({ sort: field, direction: newDirection, page: 0 })
  }

  const handlePageChange = (page: number) => updateFilters({ page })

  const handleToggleLock = async (userId: string, locked: boolean) => {
    try {
      await toggleUserLock(userId, locked)
      toast({
        title: locked ? "Usuário bloqueado" : "Usuário desbloqueado",
        description: `O usuário foi ${locked ? "bloqueado" : "desbloqueado"} com sucesso.`,
      })
      refreshStats()
    } catch {
      toast({
        title: "Erro",
        description: `Erro ao ${locked ? "bloquear" : "desbloquear"} usuário.`,
        variant: "destructive",
      })
    }
  }

  const handleResetPassword = async (userId: string) => {
    try {
      await resetUserPassword(userId)
      toast({
        title: "Senha resetada",
        description: "Uma nova senha temporária foi enviada por e-mail.",
      })
    } catch {
      toast({
        title: "Erro",
        description: "Erro ao resetar senha do usuário.",
        variant: "destructive",
      })
    }
  }

  const handleExport = async (format: "csv" | "xlsx" = "csv") => {
    setExportLoading(true)
    try {
      await exportUsers(format)
      toast({
        title: "Exportação concluída",
        description: `Arquivo ${format.toUpperCase()} baixado com sucesso.`,
      })
    } catch {
      toast({
        title: "Erro na exportação",
        description: "Erro ao exportar dados dos usuários.",
        variant: "destructive",
      })
    } finally {
      setExportLoading(false)
    }
  }

  const handleBulkAction = async (action: "lock" | "unlock" | "delete") => {
    const count = selectedIds?.size ?? 0
    if (count === 0) {
      toast({
        title: "Nenhum usuário selecionado",
        description: "Selecione pelo menos um usuário para executar esta ação.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "Ações em lote serão implementadas em breve.",
      variant: "default",
    })
  }

  const totalElements = pagination?.totalElements ?? 0
  const selectedCount = selectedIds?.size ?? 0

  if (error) {
    return (
      <div className="h-full w-full flex">
        <Card className="w-full">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
              <div>
                <h3 className="text-lg font-semibold">Erro ao carregar usuários</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <Button onClick={() => { refreshUsers(); refreshStats() }} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    // largura+altura total e sem overflow-x global
    <div className="h-full w-full flex flex-col gap-6 overflow-x-hidden min-w-0">
      {/* Header */}
      <div className="flex items-center justify-between w-full min-w-0">
        <div className="min-w-0">
          <h1 className="text-3xl font-bold">Usuários Administrativos</h1>
          <p className="text-muted-foreground">Gerencie usuários com acesso administrativo ao sistema</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" onClick={() => { refreshUsers(); refreshStats() }} disabled={loading || statsLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading || statsLoading ? "animate-spin" : ""}`} />
            Atualizar
          </Button>
          <Button variant="outline" onClick={() => handleExport("csv")} disabled={exportLoading}>
            {exportLoading ? <LoadingSpinner className="h-4 w-4 mr-2" /> : <Download className="h-4 w-4 mr-2" />}
            Exportar CSV
          </Button>
          <Button onClick={() => setShowCreateModal(true)}>
            <UserPlus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 w-full min-w-0">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalUsers ?? 0}</div>
            <p className="text-xs text-muted-foreground">usuários cadastrados</p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Ativos</CardTitle>
            <UserCheck className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats?.activeUsers ?? 0}</div>
            <p className="text-xs text-muted-foreground">usuários ativos</p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inativos</CardTitle>
            <UserX className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-600">{stats?.inactiveUsers ?? 0}</div>
            <p className="text-xs text-muted-foreground">usuários inativos</p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bloqueados</CardTitle>
            <Shield className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats?.lockedAccounts ?? 0}</div>
            <p className="text-xs text-muted-foreground">usuários bloqueados</p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pendente de Exclusão</CardTitle>
            <Trash2 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats?.pendingDeletion ?? 0}</div>
            <p className="text-xs text-muted-foreground">contas aguardando exclusão</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Use os filtros abaixo para encontrar usuários específicos</CardDescription>
        </CardHeader>
        <CardContent>
          <AdminUserFilters filters={filters} onFiltersChange={updateFilters} onRefresh={refreshUsers} />
        </CardContent>
      </Card>

      {/* Ações em Lote */}
      {selectedCount > 0 && (
        <Card className="w-full">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <Badge variant="secondary">
                {selectedCount} usuário{selectedCount !== 1 ? "s" : ""} selecionado{selectedCount !== 1 ? "s" : ""}
              </Badge>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("lock")}>
                  Bloquear Selecionados
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleBulkAction("unlock")}>
                  Desbloquear Selecionados
                </Button>
                <Button variant="outline" size="sm" onClick={() => setSelectedIds(new Set())}>
                  Limpar Seleção
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista (preenche o restante; scroll X só na tabela) */}
      <div className="flex-1 min-h-0 min-w-0 w-full">
        <Card className="h-full flex flex-col w-full min-w-0">
          <CardHeader className="flex-shrink-0 flex flex-row items-center justify-between">
            <div>
              <CardTitle>Lista de Usuários</CardTitle>
              <CardDescription>
                {totalElements} usuário{totalElements !== 1 ? "s" : ""} encontrado{totalElements !== 1 ? "s" : ""}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={refreshUsers} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
          </CardHeader>

          {/* Scroll vertical do card + scroll horizontal somente na tabela */}
          <CardContent className="flex-1 min-w-0 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner className="h-8 w-8" />
                <span className="ml-2">Carregando usuários...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum usuário encontrado</h3>
                <p className="text-muted-foreground mb-4">Não há usuários que correspondam aos filtros aplicados.</p>
                <Button onClick={() => updateFilters({})}>Limpar Filtros</Button>
              </div>
            ) : (
              <>
                {/* 🔹 Scroll horizontal só aqui; -mx para alinhar rolagem à borda do card */}
                <div className="-mx-6 sm:-mx-8 px-6 sm:px-8 w-full min-w-0 overflow-x-auto">
                  <AdminUserTable
                    users={users}
                    selectedIds={selectedIds}
                    onSelectionChange={setSelectedIds}
                    onViewUser={setViewUser}
                    onEditUser={() => {
                      toast({
                        title: "Funcionalidade em desenvolvimento",
                        description: "A edição de usuários será implementada em breve.",
                        variant: "default",
                      })
                    }}
                    onToggleLock={handleToggleLock}
                    onResetPassword={handleResetPassword}
                    filters={filters}
                    onSortChange={handleSortChange}
                  />
                </div>

                {pagination?.totalPages! > 1 && (
                  <div className="mt-4">
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      totalElements={pagination.totalElements}
                      pageSize={pagination.pageSize ?? 10} // <-- valor padrão
                      onPageChange={handlePageChange}
                      onPageSizeChange={(size) => updateFilters({ pageSize: size, page: 0 })}
                      isLoading={loading}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Modais */}
      {viewUser && (
        <ViewAdminUserModal user={viewUser} open={!!viewUser} onOpenChange={() => setViewUser(null)} />
      )}
      <CreateAdminUserModalTabs
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onSuccess={() => {
          refreshUsers()
          refreshStats()
        }}
      />
    </div>
  )
}

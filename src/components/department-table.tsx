"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MoreHorizontal, Eye, Edit, Trash2, UserCheck, Users } from "lucide-react"
import type { Department } from "@/types/department"
import { ViewDepartmentModal } from "./view-department-modal"
import { EditDepartmentModal } from "./edit-department-modal"

interface DepartmentTableProps {
  departments: Department[]
  loading: boolean
  onEdit: (department: Department) => void
  onDelete: (id: string) => void
}

export function DepartmentTable({ departments, loading, onEdit, onDelete }: DepartmentTableProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [departmentToDelete, setDepartmentToDelete] = useState<string | null>(null)

  const handleView = (department: Department) => {
    setSelectedDepartment(department)
    setViewModalOpen(true)
  }

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department)
    setEditModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setDepartmentToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (departmentToDelete) {
      onDelete(departmentToDelete)
      setDepartmentToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-muted animate-pulse rounded" />
        ))}
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Gerente</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {departments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                  Nenhum departamento encontrado
                </TableCell>
              </TableRow>
            ) : (
              departments.map((department) => (
                <TableRow key={department.id}>
                  <TableCell className="font-medium">{department.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-md truncate">{department.description}</TableCell>
                  <TableCell>
                    <Badge variant={department.managerId ? "default" : "secondary"}>
                      {department.managerId ? (
                        <>
                          <UserCheck className="mr-1 h-3 w-3" />
                          Com gerente
                        </>
                      ) : (
                        <>
                          <Users className="mr-1 h-3 w-3" />
                          Sem gerente
                        </>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(department)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(department)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(department.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Modals */}
      {selectedDepartment && (
        <>
          <ViewDepartmentModal department={selectedDepartment} open={viewModalOpen} onOpenChange={setViewModalOpen} />
          <EditDepartmentModal
            department={selectedDepartment}
            open={editModalOpen}
            onOpenChange={setEditModalOpen}
            onEdit={onEdit}
          />
        </>
      )}

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este departamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

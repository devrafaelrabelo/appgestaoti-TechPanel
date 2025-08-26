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
import { MoreHorizontal, Eye, Edit, Trash2, Power, PowerOff } from "lucide-react"
import type { Company } from "@/types/company"
import { ViewCompanyModal } from "./view-company-modal"
import { EditCompanyModal } from "./edit-company-modal"

interface CompanyTableProps {
  companies: Company[]
  loading: boolean
  onEdit: (company: Company) => void
  onDelete: (id: string) => void
  onToggleStatus: (id: string) => void
}

export function CompanyTable({ companies, loading, onEdit, onDelete, onToggleStatus }: CompanyTableProps) {
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null)
  const [viewModalOpen, setViewModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [companyToDelete, setCompanyToDelete] = useState<string | null>(null)

  const handleView = (company: Company) => {
    setSelectedCompany(company)
    setViewModalOpen(true)
  }

  const handleEdit = (company: Company) => {
    setSelectedCompany(company)
    setEditModalOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setCompanyToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    if (companyToDelete) {
      onDelete(companyToDelete)
      setCompanyToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
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
              <TableHead>CNPJ</TableHead>
              <TableHead>Razão Social</TableHead>
              <TableHead>Cidade/Estado</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {companies.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  Nenhuma empresa encontrada
                </TableCell>
              </TableRow>
            ) : (
              companies.map((company) => (
                <TableRow key={company.id}>
                  <TableCell className="font-medium">{company.name}</TableCell>
                  <TableCell className="font-mono text-sm">{formatCNPJ(company.cnpj)}</TableCell>
                  <TableCell>{company.legalName}</TableCell>
                  <TableCell>
                    {company.address.city}/{company.address.state}
                  </TableCell>
                  <TableCell>
                    <Badge variant={company.active ? "default" : "secondary"}>
                      {company.active ? "Ativo" : "Inativo"}
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
                        <DropdownMenuItem onClick={() => handleView(company)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(company)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onToggleStatus(company.id)}>
                          {company.active ? (
                            <>
                              <PowerOff className="mr-2 h-4 w-4" />
                              Desativar
                            </>
                          ) : (
                            <>
                              <Power className="mr-2 h-4 w-4" />
                              Ativar
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(company.id)} className="text-destructive">
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
      {selectedCompany && (
        <>
          <ViewCompanyModal company={selectedCompany} open={viewModalOpen} onOpenChange={setViewModalOpen} />
          <EditCompanyModal
            company={selectedCompany}
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
              Tem certeza que deseja excluir esta empresa? Esta ação não pode ser desfeita.
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

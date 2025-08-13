"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit, Trash2, UserPlus } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { MappedUserRequest } from "@/types/user-request"

interface UserRequestTableProps {
  requests: MappedUserRequest[]
  selectedIds: Set<string>
  onSelectionChange: (selectedIds: Set<string>) => void
  onViewDetails?: (request: MappedUserRequest) => void
  onEditRequest?: (request: MappedUserRequest) => void
  onCancelRequest?: (requestId: string) => void
  onInitiateCreation?: (request: MappedUserRequest) => void
}

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  COMPLETED: "default",
  PENDING: "outline",
  CREATED: "default",
  REJECTED: "destructive",
  CANCELED: "secondary",
}

const statusLabelMap: { [key: string]: string } = {
  COMPLETED: "Concluído",
  PENDING: "Pendente",
  CREATED: "Criado",
  REJECTED: "Rejeitado",
  CANCELED: "Cancelado",
}

export function UserRequestTable({
  requests,
  selectedIds,
  onSelectionChange,
  onViewDetails,
  onEditRequest,
  onCancelRequest,
  onInitiateCreation,
}: UserRequestTableProps) {
  const getStatusVariant = (
    status: MappedUserRequest["status"],
  ): "default" | "secondary" | "destructive" | "outline" => {
    return statusVariantMap[status.toUpperCase() as keyof typeof statusVariantMap] || "outline"
  }

  const getStatusLabel = (status: MappedUserRequest["status"]): string => {
    return statusLabelMap[status.toUpperCase() as keyof typeof statusLabelMap] || status
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const newSelected = new Set(selectedIds)
      requests.forEach((request) => newSelected.add(request.id))
      onSelectionChange(newSelected)
    } else {
      const newSelected = new Set(selectedIds)
      requests.forEach((request) => newSelected.delete(request.id))
      onSelectionChange(newSelected)
    }
  }

  const handleSelectItem = (requestId: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(requestId)
    } else {
      newSelected.delete(requestId)
    }
    onSelectionChange(newSelected)
  }

  const isAllSelected = requests.length > 0 && requests.every((request) => selectedIds.has(request.id))
  const isIndeterminate = requests.some((request) => selectedIds.has(request.id)) && !isAllSelected

  return (
    <TooltipProvider>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={isAllSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Selecionar todos"
                  {...(isIndeterminate && { "data-state": "indeterminate" })}
                />
              </TableHead>
              <TableHead className="min-w-[250px]">Nome Completo</TableHead>
              <TableHead className="min-w-[150px]">CPF</TableHead>
              <TableHead>Data da Solicitação</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px] text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Nenhuma solicitação encontrada.
                </TableCell>
              </TableRow>
            )}
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedIds.has(request.id)}
                    onCheckedChange={(checked) => handleSelectItem(request.id, checked as boolean)}
                    aria-label={`Selecionar ${request.fullName}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="font-medium">{request.fullName}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">{request.cpf}</div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span>{format(new Date(request.requestDate), "dd/MM/yyyy")}</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{format(new Date(request.requestDate), "dd/MM/yyyy HH:mm", { locale: ptBR })}</p>
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(request.status)} className="text-xs capitalize">
                    {getStatusLabel(request.status)}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Abrir menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      {onViewDetails && (
                        <DropdownMenuItem onClick={() => onViewDetails(request)}>
                          <Eye className="mr-2 h-4 w-4" /> Ver Detalhes
                        </DropdownMenuItem>
                      )}
                      {onEditRequest && ( request.status === "PENDING" || request.status === "REJECTED") && (
                        <DropdownMenuItem onClick={() => onEditRequest(request)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                      )}
                      {onCancelRequest && request.status === "PENDING" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onCancelRequest(request.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Cancelar Solicitação
                          </DropdownMenuItem>
                        </>
                      )}
                      {onInitiateCreation && request.status === "PENDING" && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onInitiateCreation(request)}>
                            <UserPlus className="mr-2 h-4 w-4" /> Criar Usuário
                          </DropdownMenuItem>
                        </>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}

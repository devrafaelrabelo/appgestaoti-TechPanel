"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import type { ApiDetailedUserRequest } from "@/types/user-request"

interface UserRequestDetailsModalProps {
  request: ApiDetailedUserRequest | null
  isOpen: boolean
  onClose: () => void
}

const statusLabelMap: { [key: string]: string } = {
  COMPLETED: "Concluído",
  PENDING: "Pendente",
  CREATED: "Criado",
  REJECTED: "Rejeitado",
  CANCELED: "Cancelado",
  UNKNOWN: "Desconhecido", // Adicionado para status indefinido/nulo
}

const statusVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
  COMPLETED: "default",
  PENDING: "outline",
  CREATED: "default",
  REJECTED: "destructive",
  CANCELED: "secondary",
  UNKNOWN: "secondary", // Adicionado para status indefinido/nulo
}

// Função para formatar CPF (exemplo, pode ser mais robusta)
const formatCpfDisplay = (cpf: string): string => {
  if (!cpf) return ""
  const cleaned = cpf.replace(/\D/g, "")
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  }
  return cpf // Retorna original se não for um CPF de 11 dígitos
}

export function UserRequestDetailsModal({ request, isOpen, onClose }: UserRequestDetailsModalProps) {
  if (!request) {
    return null
  }

  const getStatusVariant = (
    status: ApiDetailedUserRequest["status"] | undefined | null, // Permite undefined ou null
  ): "default" | "secondary" | "destructive" | "outline" => {
    const normalizedStatus = (status || "UNKNOWN").toUpperCase() // Garante que é uma string antes de toUpperCase
    return statusVariantMap[normalizedStatus as keyof typeof statusVariantMap] || "outline"
  }

  const getStatusLabel = (status: ApiDetailedUserRequest["status"] | undefined | null): string => {
    // Permite undefined ou null
    const normalizedStatus = (status || "UNKNOWN").toUpperCase() // Garante que é uma string antes de toUpperCase
    return statusLabelMap[normalizedStatus as keyof typeof statusLabelMap] || normalizedStatus
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalhes da Solicitação de Usuário</DialogTitle>
          <DialogDescription>Informações completas sobre a solicitação de {request.fullName}.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">ID da Solicitação:</span>
            <span className="text-sm text-muted-foreground break-all">{request.id}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">Status:</span>
            <Badge variant={getStatusVariant(request.status)} className="w-fit">
              {getStatusLabel(request.status)}
            </Badge>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">Solicitante:</span>
            <span className="text-sm text-muted-foreground">{request.requestedName ? request.requestedName : "N/A"}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">Data da Solicitação:</span>
            <span className="text-sm text-muted-foreground">
              {request.requestedAt
                ? format(new Date(request.requestedAt), "dd/MM/yyyy HH:mm", { locale: ptBR })
                : "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">Criador:</span>
            <span className="text-sm text-muted-foreground">{request.createdBy ? request.createdBy : "N/A"}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">Data da Criação:</span>
            <span className="text-sm text-muted-foreground">
              {request.createdAt && !isNaN(new Date(request.createdAt).getTime())
                ? format(new Date(request.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })
                : "N/A"}
            </span>
          </div>                    

          <Separator className="my-2" />

          <h4 className="font-semibold text-md mb-2">Dados Pessoais</h4>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">Nome Completo:</span>
            <span className="text-sm text-muted-foreground">{request.fullName}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">CPF:</span>
            <span className="text-sm text-muted-foreground">{formatCpfDisplay(request.cpf)}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">Data de Nascimento:</span>
            <span className="text-sm text-muted-foreground">
              {request.birthDate ? format(new Date(request.birthDate), "dd/MM/yyyy") : "N/A"}
            </span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">Telefone:</span>
            <span className="text-sm text-muted-foreground">{request.phone || "N/A"}</span>
          </div>

          <Separator className="my-2" />

          <h4 className="font-semibold text-md mb-2">Hierarquia</h4>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">ID Supervisor:</span>
            <span className="text-sm text-muted-foreground">{request.supervisorId || "N/A"}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">ID Líder:</span>
            <span className="text-sm text-muted-foreground">{request.leaderId || "N/A"}</span>
          </div>

          <Separator className="my-2" />

          <h4 className="font-semibold text-md mb-2">Endereço</h4>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">CEP:</span>
            <span className="text-sm text-muted-foreground">{request.cep || "N/A"}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">Logradouro:</span>
            <span className="text-sm text-muted-foreground">{request.street || "N/A"}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">Número:</span>
            <span className="text-sm text-muted-foreground">{request.number || "N/A"}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">Complemento:</span>
            <span className="text-sm text-muted-foreground">{request.complement || "N/A"}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">Bairro:</span>
            <span className="text-sm text-muted-foreground">{request.neighborhood || "N/A"}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">Cidade:</span>
            <span className="text-sm text-muted-foreground">{request.city || "N/A"}</span>
          </div>
          <div className="grid grid-cols-2 items-center gap-4">
            <span className="text-sm font-medium">Estado:</span>
            <span className="text-sm text-muted-foreground">{request.state || "N/A"}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

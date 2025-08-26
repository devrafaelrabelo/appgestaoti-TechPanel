"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Company } from "@/types/company"

interface ViewCompanyModalProps {
  company: Company
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ViewCompanyModal({ company, open, onOpenChange }: ViewCompanyModalProps) {
  const formatCNPJ = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] h-[90vh] max-w-4xl flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            Detalhes da Empresa
            <Badge variant={company.active ? "default" : "secondary"}>{company.active ? "Ativo" : "Inativo"}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2 space-y-6">
          {/* Dados da Empresa */}
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome Fantasia</label>
                  <p className="text-sm font-medium">{company.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CNPJ</label>
                  <p className="text-sm font-mono">{formatCNPJ(company.cnpj)}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Razão Social</label>
                <p className="text-sm font-medium">{company.legalName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Endereço */}
          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">CEP</label>
                  <p className="text-sm font-mono">{company.address.postalCode}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <p className="text-sm">{company.address.state}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cidade</label>
                  <p className="text-sm">{company.address.city}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Logradouro</label>
                <p className="text-sm">{company.address.street}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Número</label>
                  <p className="text-sm">{company.address.number}</p>
                </div>
                {company.address.complement && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Complemento</label>
                    <p className="text-sm">{company.address.complement}</p>
                  </div>
                )}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bairro</label>
                  <p className="text-sm">{company.address.neighborhood}</p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">País</label>
                <p className="text-sm">{company.address.country}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

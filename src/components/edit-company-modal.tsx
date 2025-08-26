"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Company, CreateCompanyPayload } from "@/types/company"
import { CompanyForm } from "./company-form"

interface EditCompanyModalProps {
  company: Company
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (company: Company) => void
}

export function EditCompanyModal({ company, open, onOpenChange, onEdit }: EditCompanyModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (data: CreateCompanyPayload) => {
    try {
      setLoading(true)
      // Simular chamada da API - você pode implementar o hook de update aqui
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const updatedCompany: Company = {
        ...company,
        ...data,
      }

      onEdit(updatedCompany)
      toast({
        title: "Sucesso",
        description: "Empresa atualizada com sucesso!",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao atualizar empresa. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] h-[90vh] max-w-4xl flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Editar Empresa</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <CompanyForm
            company={company}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            loading={loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import type { CreateCompanyPayload } from "@/types/company"
import { CompanyForm } from "./company-form"

interface CreateCompanyModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (data: CreateCompanyPayload) => Promise<void>
}

export function CreateCompanyModal({ open, onOpenChange, onCreate }: CreateCompanyModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (data: CreateCompanyPayload) => {
    try {
      setLoading(true)
      await onCreate(data)
      toast({
        title: "Sucesso",
        description: "Empresa criada com sucesso!",
      })
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao criar empresa. Tente novamente.",
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
          <DialogTitle>Nova Empresa</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto pr-2">
          <CompanyForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} loading={loading} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

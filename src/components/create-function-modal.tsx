"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FunctionForm } from "./function-form"
import type { CreateFunctionPayload } from "@/types/function"

interface CreateFunctionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateFunctionPayload) => Promise<boolean>
  loading?: boolean
}

export function CreateFunctionModal({ open, onOpenChange, onSubmit, loading = false }: CreateFunctionModalProps) {
  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-[1600px] h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Criar Nova Função</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <FunctionForm onSubmit={onSubmit} onCancel={handleCancel} loading={loading} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DepartmentForm } from "./department-form"
import type { CreateDepartmentPayload } from "@/types/department"

interface CreateDepartmentModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreate: (data: CreateDepartmentPayload) => Promise<void>
}

export function CreateDepartmentModal({ open, onOpenChange, onCreate }: CreateDepartmentModalProps) {
  const handleSubmit = async (data: CreateDepartmentPayload) => {
    await onCreate(data)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Criar Novo Departamento</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <DepartmentForm onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DepartmentForm } from "./department-form"
import type { Department, UpdateDepartmentPayload } from "@/types/department"

interface EditDepartmentModalProps {
  department: Department
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (department: Department) => void
}

export function EditDepartmentModal({ department, open, onOpenChange, onEdit }: EditDepartmentModalProps) {
  const handleSubmit = async (data: UpdateDepartmentPayload) => {
    // Simular atualização - em um caso real, isso seria uma chamada de API
    const updatedDepartment = { ...department, ...data }
    onEdit(updatedDepartment)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Editar Departamento</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <DepartmentForm department={department} onSubmit={handleSubmit} onCancel={() => onOpenChange(false)} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

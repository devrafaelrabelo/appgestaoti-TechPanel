"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FunctionForm } from "./function-form"
import type { Function, UpdateFunctionPayload } from "@/types/function"

interface EditFunctionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  functionData: Function | null
  onSubmit: (id: string, data: UpdateFunctionPayload) => Promise<boolean>
  loading?: boolean
}

export function EditFunctionModal({
  open,
  onOpenChange,
  functionData,
  onSubmit,
  loading = false,
}: EditFunctionModalProps) {
  const handleCancel = () => {
    onOpenChange(false)
  }

  const handleSubmit = async (data: UpdateFunctionPayload) => {
    if (!functionData) return false
    return await onSubmit(functionData.id, data)
  }

  if (!functionData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] max-w-[1600px] h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Editar Função</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-1">
          <FunctionForm
            initialData={{
              name: functionData.name,
              description: functionData.description,
              departmentId: functionData.departmentId,
            }}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

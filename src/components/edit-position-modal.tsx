"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PositionForm } from "@/components/position-form"
import type { Position, UpdatePositionPayload } from "@/types/position"

interface EditPositionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  positionData: Position | null
  onSubmit: (id: string, data: UpdatePositionPayload) => Promise<boolean>
  loading?: boolean
}

export function EditPositionModal({
  open,
  onOpenChange,
  positionData,
  onSubmit,
  loading = false,
}: EditPositionModalProps) {
  const handleSubmit = async (data: UpdatePositionPayload) => {
    if (!positionData) return false
    return await onSubmit(positionData.id, data)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] h-[90vh] max-w-none flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Editar Posição</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-1">
          <PositionForm
            initialData={positionData}
            onSubmit={handleSubmit}
            onCancel={() => onOpenChange(false)}
            loading={loading}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}

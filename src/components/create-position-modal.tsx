"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PositionForm } from "@/components/position-form"
import type { CreatePositionPayload } from "@/types/position"

interface CreatePositionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreatePositionPayload) => Promise<boolean>
  loading?: boolean
}

export function CreatePositionModal({ open, onOpenChange, onSubmit, loading = false }: CreatePositionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] h-[90vh] max-w-none flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Nova Posição</DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-1">
          <PositionForm onSubmit={onSubmit} onCancel={() => onOpenChange(false)} loading={loading} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

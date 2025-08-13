"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { InternalExtensionForm } from "./internal-extension-form"
import type { CreateInternalExtensionData } from "@/types/internal-extension"

interface CreateInternalExtensionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateInternalExtensionData) => Promise<void>
  isLoading?: boolean
}

export function CreateInternalExtensionModal({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateInternalExtensionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: CreateInternalExtensionData) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao criar ramal:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Ramal Interno</DialogTitle>
        </DialogHeader>
        <InternalExtensionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting || isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}

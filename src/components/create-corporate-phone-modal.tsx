"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CorporatePhoneForm } from "@/components/corporate-phone-form"
import type { CreateCorporatePhoneRequest, CorporatePhone } from "@/types/corporate-phone"

interface CreateCorporatePhoneModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: CreateCorporatePhoneRequest) => Promise<CorporatePhone>
  onSuccess?: () => void
  loading?: boolean
}

export function CreateCorporatePhoneModal({
  open,
  onOpenChange,
  onSubmit,
  onSuccess,
  loading,
}: CreateCorporatePhoneModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: CreateCorporatePhoneRequest) => {
    try {
      setIsSubmitting(true)
      await onSubmit(data)
      onSuccess?.()
      onOpenChange(false)
    } catch (error) {
      console.error("Erro ao criar telefone corporativo:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Telefone Corporativo</DialogTitle>
        </DialogHeader>
        <CorporatePhoneForm onSubmit={handleSubmit} loading={isSubmitting || loading} onCancel={handleCancel} />
      </DialogContent>
    </Dialog>
  )
}

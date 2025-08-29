"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, FileText } from "lucide-react"
import type { Position } from "@/types/position"

interface ViewPositionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  positionData: Position | null
}

export function ViewPositionModal({ open, onOpenChange, positionData }: ViewPositionModalProps) {
  if (!positionData) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[96vw] h-[90vh] max-w-none flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Detalhes da Posição
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-1">
          <div className="space-y-6">
            {/* Informações Básicas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Informações Básicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Nome</label>
                  <p className="text-sm font-medium">{positionData.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">ID</label>
                  <p className="text-sm text-muted-foreground font-mono">{positionData.id}</p>
                </div>
              </CardContent>
            </Card>

            {/* Descrição */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Descrição
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{positionData.description}</p>
              </CardContent>
            </Card>

            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="default">Ativa</Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SelectAccessLevelProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

// Mock access level data - replace with actual API call
const accessLevels = [
  { id: "read", name: "Somente Leitura", description: "Pode visualizar informações" },
  { id: "write", name: "Leitura e Escrita", description: "Pode visualizar e editar informações" },
  { id: "admin", name: "Administrador", description: "Acesso completo ao sistema" },
  { id: "supervisor", name: "Supervisor", description: "Pode gerenciar usuários do seu departamento" },
]

export function SelectAccessLevel({ value, onChange, disabled = false }: SelectAccessLevelProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">Nível de Acesso *</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-10">
          <SelectValue placeholder="Selecione o nível de acesso" />
        </SelectTrigger>
        <SelectContent>
          {accessLevels.map((level) => (
            <SelectItem key={level.id} value={level.id}>
              <div className="flex flex-col">
                <span>{level.name}</span>
                <span className="text-xs text-muted-foreground">{level.description}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

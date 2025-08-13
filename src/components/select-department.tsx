"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SelectDepartmentProps {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

// Mock department data - replace with actual API call
const departments = [
  { id: "ti", name: "Tecnologia da Informação" },
  { id: "rh", name: "Recursos Humanos" },
  { id: "comercial", name: "Comercial" },
  { id: "financeiro", name: "Financeiro" },
  { id: "operacoes", name: "Operações" },
]

export function SelectDepartment({ value, onChange, disabled = false }: SelectDepartmentProps) {
  return (
    <div className="space-y-1">
      <Label className="text-xs">Departamento *</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger className="h-10">
          <SelectValue placeholder="Selecione o departamento" />
        </SelectTrigger>
        <SelectContent>
          {departments.map((dept) => (
            <SelectItem key={dept.id} value={dept.id}>
              {dept.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

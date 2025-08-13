"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface SelectUserGroupProps {
  value: string
  onChange: (value: string) => void
  departmentId: string
  disabled?: boolean
}

// Mock user group data - replace with actual API call
const userGroups: Record<string, Array<{ id: string; name: string }>> = {
  ti: [
    { id: "ti-dev", name: "Desenvolvedores" },
    { id: "ti-infra", name: "Infraestrutura" },
    { id: "ti-suporte", name: "Suporte" },
  ],
  rh: [
    { id: "rh-recrutamento", name: "Recrutamento" },
    { id: "rh-folha", name: "Folha de Pagamento" },
    { id: "rh-beneficios", name: "Benefícios" },
  ],
  comercial: [
    { id: "comercial-vendas", name: "Vendas" },
    { id: "comercial-marketing", name: "Marketing" },
    { id: "comercial-pos-vendas", name: "Pós-vendas" },
  ],
  financeiro: [
    { id: "financeiro-contas-pagar", name: "Contas a Pagar" },
    { id: "financeiro-contas-receber", name: "Contas a Receber" },
    { id: "financeiro-controladoria", name: "Controladoria" },
  ],
  operacoes: [
    { id: "operacoes-producao", name: "Produção" },
    { id: "operacoes-logistica", name: "Logística" },
    { id: "operacoes-qualidade", name: "Qualidade" },
  ],
}

export function SelectUserGroup({ value, onChange, departmentId, disabled = false }: SelectUserGroupProps) {
  const availableGroups = departmentId ? userGroups[departmentId] || [] : []

  return (
    <div className="space-y-1">
      <Label className="text-xs">Grupo de Usuário *</Label>
      <Select value={value} onValueChange={onChange} disabled={disabled || !departmentId}>
        <SelectTrigger className="h-10">
          <SelectValue placeholder={departmentId ? "Selecione o grupo" : "Selecione um departamento primeiro"} />
        </SelectTrigger>
        <SelectContent>
          {availableGroups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

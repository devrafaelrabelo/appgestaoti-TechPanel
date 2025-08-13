"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, User, Building, AlertTriangle, Plus, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { CreateTerminationRequest } from "@/types/employee-termination"
import { TERMINATION_REASONS, PRIORITY_LEVELS } from "@/types/employee-termination"

interface CreateTerminationFormProps {
  onSubmit: (data: CreateTerminationRequest) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export function CreateTerminationForm({ onSubmit, onCancel, isLoading = false }: CreateTerminationFormProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState<CreateTerminationRequest>({
    employeeId: "",
    employeeName: "",
    employeeCpf: "",
    employeeEmail: "",
    department: "",
    position: "",
    admissionDate: "",
    terminationDate: "",
    terminationReason: "DISMISSAL",
    terminationReasonDescription: "",
    commercialNotes: "",
    priority: "MEDIUM",
    hasSystemAccess: false,
    systemAccounts: [],
    hasPhysicalAssets: false,
    physicalAssets: [],
  })

  const [newSystemAccount, setNewSystemAccount] = useState("")
  const [newPhysicalAsset, setNewPhysicalAsset] = useState("")

  const handleInputChange = (field: keyof CreateTerminationRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const addSystemAccount = () => {
    if (newSystemAccount.trim() && !formData.systemAccounts.includes(newSystemAccount.trim())) {
      setFormData((prev) => ({
        ...prev,
        systemAccounts: [...prev.systemAccounts, newSystemAccount.trim()],
      }))
      setNewSystemAccount("")
    }
  }

  const removeSystemAccount = (account: string) => {
    setFormData((prev) => ({
      ...prev,
      systemAccounts: prev.systemAccounts.filter((acc) => acc !== account),
    }))
  }

  const addPhysicalAsset = () => {
    if (newPhysicalAsset.trim() && !formData.physicalAssets.includes(newPhysicalAsset.trim())) {
      setFormData((prev) => ({
        ...prev,
        physicalAssets: [...prev.physicalAssets, newPhysicalAsset.trim()],
      }))
      setNewPhysicalAsset("")
    }
  }

  const removePhysicalAsset = (asset: string) => {
    setFormData((prev) => ({
      ...prev,
      physicalAssets: prev.physicalAssets.filter((ass) => ass !== asset),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validações básicas
    if (!formData.employeeName.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Nome do funcionário é obrigatório",
        variant: "destructive",
      })
      return
    }

    if (!formData.employeeCpf.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "CPF do funcionário é obrigatório",
        variant: "destructive",
      })
      return
    }

    if (!formData.terminationDate) {
      toast({
        title: "Campo obrigatório",
        description: "Data de desligamento é obrigatória",
        variant: "destructive",
      })
      return
    }

    // Validar se a data de desligamento não é anterior à data atual
    const terminationDate = new Date(formData.terminationDate)
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (terminationDate < today) {
      toast({
        title: "Data inválida",
        description: "A data de desligamento não pode ser anterior à data atual",
        variant: "destructive",
      })
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      toast({
        title: "Erro ao criar solicitação",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Informações do Funcionário */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Informações do Funcionário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">ID do Funcionário</Label>
              <Input
                id="employeeId"
                placeholder="Ex: EMP001"
                value={formData.employeeId}
                onChange={(e) => handleInputChange("employeeId", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeName">Nome Completo *</Label>
              <Input
                id="employeeName"
                placeholder="Nome completo do funcionário"
                value={formData.employeeName}
                onChange={(e) => handleInputChange("employeeName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeCpf">CPF *</Label>
              <Input
                id="employeeCpf"
                placeholder="000.000.000-00"
                value={formData.employeeCpf}
                onChange={(e) => handleInputChange("employeeCpf", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="employeeEmail">Email Corporativo</Label>
              <Input
                id="employeeEmail"
                type="email"
                placeholder="funcionario@empresa.com"
                value={formData.employeeEmail}
                onChange={(e) => handleInputChange("employeeEmail", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Vendas">Vendas</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="Financeiro">Financeiro</SelectItem>
                  <SelectItem value="RH">Recursos Humanos</SelectItem>
                  <SelectItem value="TI">Tecnologia da Informação</SelectItem>
                  <SelectItem value="Operações">Operações</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Cargo</Label>
              <Input
                id="position"
                placeholder="Cargo do funcionário"
                value={formData.position}
                onChange={(e) => handleInputChange("position", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admissionDate">Data de Admissão</Label>
              <Input
                id="admissionDate"
                type="date"
                value={formData.admissionDate}
                onChange={(e) => handleInputChange("admissionDate", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Informações do Desligamento */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Informações do Desligamento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="terminationDate">Data de Desligamento *</Label>
              <Input
                id="terminationDate"
                type="date"
                value={formData.terminationDate}
                onChange={(e) => handleInputChange("terminationDate", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioridade</Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(PRIORITY_LEVELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="terminationReason">Motivo do Desligamento</Label>
              <Select
                value={formData.terminationReason}
                onValueChange={(value) => handleInputChange("terminationReason", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(TERMINATION_REASONS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="terminationReasonDescription">Descrição Detalhada do Motivo</Label>
              <Textarea
                id="terminationReasonDescription"
                placeholder="Descreva detalhadamente o motivo do desligamento..."
                value={formData.terminationReasonDescription}
                onChange={(e) => handleInputChange("terminationReasonDescription", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="commercialNotes">Observações Comerciais</Label>
              <Textarea
                id="commercialNotes"
                placeholder="Observações adicionais do departamento comercial..."
                value={formData.commercialNotes}
                onChange={(e) => handleInputChange("commercialNotes", e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acessos e Ativos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Acessos e Ativos Corporativos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Acessos ao Sistema */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasSystemAccess"
                checked={formData.hasSystemAccess}
                onCheckedChange={(checked) => handleInputChange("hasSystemAccess", checked)}
              />
              <Label htmlFor="hasSystemAccess" className="text-sm font-medium">
                Funcionário possui acessos a sistemas corporativos
              </Label>
            </div>

            {formData.hasSystemAccess && (
              <div className="space-y-3 pl-6 border-l-2 border-muted">
                <Label className="text-sm font-medium">Sistemas e Contas</Label>

                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Active Directory, CRM, Email..."
                    value={newSystemAccount}
                    onChange={(e) => setNewSystemAccount(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSystemAccount())}
                  />
                  <Button type="button" onClick={addSystemAccount} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.systemAccounts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.systemAccounts.map((account, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {account}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeSystemAccount(account)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <Separator />

          {/* Ativos Físicos */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="hasPhysicalAssets"
                checked={formData.hasPhysicalAssets}
                onCheckedChange={(checked) => handleInputChange("hasPhysicalAssets", checked)}
              />
              <Label htmlFor="hasPhysicalAssets" className="text-sm font-medium">
                Funcionário possui equipamentos/ativos físicos da empresa
              </Label>
            </div>

            {formData.hasPhysicalAssets && (
              <div className="space-y-3 pl-6 border-l-2 border-muted">
                <Label className="text-sm font-medium">Equipamentos e Ativos</Label>

                <div className="flex gap-2">
                  <Input
                    placeholder="Ex: Notebook, Celular, Crachá..."
                    value={newPhysicalAsset}
                    onChange={(e) => setNewPhysicalAsset(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPhysicalAsset())}
                  />
                  <Button type="button" onClick={addPhysicalAsset} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {formData.physicalAssets.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.physicalAssets.map((asset, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {asset}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removePhysicalAsset(asset)} />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Aviso Importante */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-orange-800">Importante</p>
              <p className="text-sm text-orange-700">
                Esta solicitação será enviada para aprovação do RH. Após aprovação, o TI será notificado para executar o
                desligamento dos acessos e recolhimento dos equipamentos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Criando..." : "Criar Solicitação"}
        </Button>
      </div>
    </form>
  )
}

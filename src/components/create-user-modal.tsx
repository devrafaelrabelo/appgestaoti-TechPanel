"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useForm } from "@/features/common/hooks/use-form"
import { useCreateUser } from "@/hooks/use-create-user"
import { SelectDepartment } from "./select-department"
import { SelectUserGroup } from "./select-user-group"
import { SelectAccessLevel } from "./select-access-level"
import { Loader2, CheckCircle, Search, MapPin } from 'lucide-react'
import type { CreateUserFormData } from "@/types/create-user"

interface CreateUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUserCreated?: () => void
}

const initialFormData: CreateUserFormData = {
  firstName: "",
  lastName: "",
  email: "",
  cpf: "",
  birthDate: "",
  phone: "",
  department: "",
  userGroup: "",
  accessLevel: "",
  address: {
    zipCode: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  },
  notes: "",
}

export function CreateUserModal({ open, onOpenChange, onUserCreated }: CreateUserModalProps) {
  const { formData, updateField, resetForm, errors, validateField } = useForm(initialFormData)
  const { 
    createUser, 
    validateCPF, 
    fetchAddressByCEP, 
    isLoading, 
    isValidatingCPF, 
    isFetchingAddress,
    cpfValidated,
    addressFound 
  } = useCreateUser()

  const handleValidateCPF = async () => {
    if (!formData.cpf) return

    const result = await validateCPF(formData.cpf)
    if (result?.data) {
      // Preencher automaticamente os dados pessoais
      const nameParts = result.data.name.split(" ")
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(" ")

      updateField("firstName", firstName)
      updateField("lastName", lastName)
      updateField("birthDate", result.data.birthDate)
    }
  }

  const handleFetchAddress = async () => {
    if (!formData.address.zipCode) return

    const result = await fetchAddressByCEP(formData.address.zipCode)
    if (result) {
      updateField("address", {
        ...formData.address,
        street: result.logradouro,
        neighborhood: result.bairro,
        city: result.localidade,
        state: result.uf,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await createUser(formData)
    if (result.success) {
      resetForm()
      onUserCreated?.()
      onOpenChange(false)
    }
  }

  const handleClose = () => {
    resetForm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Criar Novo Usuário</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-120px)] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados Pessoais */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Dados Pessoais</h3>
                {cpfValidated && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    CPF Validado
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cpf">CPF *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="cpf"
                      value={formData.cpf}
                      onChange={(e) => updateField("cpf", e.target.value)}
                      placeholder="000.000.000-00"
                      maxLength={14}
                      className={cpfValidated ? "border-green-500 bg-green-50" : ""}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleValidateCPF}
                      disabled={isValidatingCPF || !formData.cpf}
                      className="shrink-0"
                    >
                      {isValidatingCPF ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Search className="w-4 h-4" />
                      )}
                      Validar
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="birthDate">Data de Nascimento</Label>
                  <Input
                    id="birthDate"
                    type="date"
                    value={formData.birthDate}
                    onChange={(e) => updateField("birthDate", e.target.value)}
                    className={cpfValidated ? "border-green-500 bg-green-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="Nome"
                    className={cpfValidated ? "border-green-500 bg-green-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Sobrenome"
                    className={cpfValidated ? "border-green-500 bg-green-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="usuario@empresa.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Endereço */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold">Endereço</h3>
                {addressFound && (
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    <MapPin className="w-3 h-3 mr-1" />
                    Endereço Encontrado
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <div className="flex gap-2">
                    <Input
                      id="zipCode"
                      value={formData.address.zipCode}
                      onChange={(e) => updateField("address", { ...formData.address, zipCode: e.target.value })}
                      placeholder="00000-000"
                      maxLength={9}
                      className={addressFound ? "border-green-500 bg-green-50" : ""}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleFetchAddress}
                      disabled={isFetchingAddress || !formData.address.zipCode}
                      className="shrink-0"
                    >
                      {isFetchingAddress ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MapPin className="w-4 h-4" />
                      )}
                      Buscar
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="street">Logradouro</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) => updateField("address", { ...formData.address, street: e.target.value })}
                    placeholder="Rua, Avenida, etc."
                    className={addressFound ? "border-green-500 bg-green-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={formData.address.number}
                    onChange={(e) => updateField("address", { ...formData.address, number: e.target.value })}
                    placeholder="123"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={formData.address.complement}
                    onChange={(e) => updateField("address", { ...formData.address, complement: e.target.value })}
                    placeholder="Apto, Sala, etc."
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={formData.address.neighborhood}
                    onChange={(e) => updateField("address", { ...formData.address, neighborhood: e.target.value })}
                    placeholder="Bairro"
                    className={addressFound ? "border-green-500 bg-green-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) => updateField("address", { ...formData.address, city: e.target.value })}
                    placeholder="Cidade"
                    className={addressFound ? "border-green-500 bg-green-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={formData.address.state}
                    onChange={(e) => updateField("address", { ...formData.address, state: e.target.value })}
                    placeholder="SP"
                    maxLength={2}
                    className={addressFound ? "border-green-500 bg-green-50" : ""}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Dados Organizacionais */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dados Organizacionais</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Departamento *</Label>
                  <SelectDepartment
                    value={formData.department}
                    onValueChange={(value) => updateField("department", value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userGroup">Grupo de Usuário *</Label>
                  <SelectUserGroup
                    value={formData.userGroup}
                    onValueChange={(value) => updateField("userGroup", value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accessLevel">Nível de Acesso *</Label>
                  <SelectAccessLevel
                    value={formData.accessLevel}
                    onValueChange={(value) => updateField("accessLevel", value)}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Observações */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Observações</h3>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas Adicionais</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Informações adicionais sobre o usuário..."
                  rows={3}
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Criando...
                  </>
                ) : (
                  "Criar Usuário"
                )}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, MapPin, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { CEPInput } from "@/components/cep-input"
import { validateCNPJ, formatCNPJ } from "@/utils/cnpj-validator"
import type { Company, CreateCompanyData, UpdateCompanyData } from "@/types/company"
import type { AddressData } from "@/utils/cep-validator"

interface CompanyFormProps {
  company?: Company
  onSubmit: (data: CreateCompanyData | UpdateCompanyData) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

interface FormData {
  name: string
  cnpj: string
  legalName: string
  active: boolean
  address: {
    street: string
    number: string
    complement: string
    neighborhood: string
    city: string
    state: string
    country: string
    postalCode: string
  }
}

interface FormErrors {
  name?: string
  cnpj?: string
  legalName?: string
  address?: {
    street?: string
    number?: string
    neighborhood?: string
    city?: string
    state?: string
    postalCode?: string
  }
}

export function CompanyForm({ company, onSubmit, onCancel, loading = false }: CompanyFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: company?.name || "",
    cnpj: company?.cnpj || "",
    legalName: company?.legalName || "",
    active: company?.active ?? true,
    address: {
      street: company?.address?.street || "",
      number: company?.address?.number || "",
      complement: company?.address?.complement || "",
      neighborhood: company?.address?.neighborhood || "",
      city: company?.address?.city || "",
      state: company?.address?.state || "",
      country: company?.address?.country || "Brasil",
      postalCode: company?.address?.postalCode || "",
    },
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [cnpjValidation, setCnpjValidation] = useState<{
    status: "idle" | "validating" | "valid" | "invalid"
    message?: string
  }>({ status: "idle" })

  // Validar CNPJ quando mudar
  useEffect(() => {
    if (!formData.cnpj) {
      setCnpjValidation({ status: "idle" })
      return
    }

    const cleanCNPJ = formData.cnpj.replace(/\D/g, "")

    if (cleanCNPJ.length === 14) {
      setCnpjValidation({ status: "validating" })

      const isValid = validateCNPJ(cleanCNPJ)

      setTimeout(() => {
        if (isValid) {
          setCnpjValidation({ status: "valid", message: "CNPJ válido" })
        } else {
          setCnpjValidation({ status: "invalid", message: "CNPJ inválido" })
        }
      }, 500)
    } else {
      setCnpjValidation({ status: "idle" })
    }
  }, [formData.cnpj])

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof FormData] as any),
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    // Limpar erro do campo
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value)
    handleInputChange("cnpj", formatted)
  }

  const handleAddressFound = (address: AddressData) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        street: address.street,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
        country: address.country,
        postalCode: address.postalCode,
      },
    }))
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Validar campos obrigatórios
    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório"
    }

    if (!formData.cnpj.trim()) {
      newErrors.cnpj = "CNPJ é obrigatório"
    } else if (cnpjValidation.status === "invalid") {
      newErrors.cnpj = "CNPJ inválido"
    }

    if (!formData.legalName.trim()) {
      newErrors.legalName = "Razão social é obrigatória"
    }

    // Validar endereço
    const addressErrors: FormErrors["address"] = {}

    if (!formData.address.street.trim()) {
      addressErrors.street = "Logradouro é obrigatório"
    }

    if (!formData.address.number.trim()) {
      addressErrors.number = "Número é obrigatório"
    }

    if (!formData.address.neighborhood.trim()) {
      addressErrors.neighborhood = "Bairro é obrigatório"
    }

    if (!formData.address.city.trim()) {
      addressErrors.city = "Cidade é obrigatória"
    }

    if (!formData.address.state.trim()) {
      addressErrors.state = "Estado é obrigatório"
    }

    if (!formData.address.postalCode.trim()) {
      addressErrors.postalCode = "CEP é obrigatório"
    }

    if (Object.keys(addressErrors).length > 0) {
      newErrors.address = addressErrors
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (cnpjValidation.status !== "valid") {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Erro ao salvar empresa:", error)
    }
  }

  const getCNPJInputClassName = () => {
    let className = "pr-10"

    if (cnpjValidation.status === "valid") {
      className += " border-green-500 focus:border-green-500"
    } else if (cnpjValidation.status === "invalid") {
      className += " border-red-500 focus:border-red-500"
    }

    return className
  }

  const renderCNPJStatus = () => {
    switch (cnpjValidation.status) {
      case "validating":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "valid":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "invalid":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Dados da Empresa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Empresa *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Ex: Bem Protege S/A"
                disabled={loading}
              />
              {errors.name && (
                <Badge variant="destructive" className="text-xs">
                  {errors.name}
                </Badge>
              )}
            </div>

            {/* CNPJ */}
            <div className="space-y-2">
              <Label htmlFor="cnpj">CNPJ *</Label>
              <div className="relative">
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleCNPJChange(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  disabled={loading}
                  className={getCNPJInputClassName()}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">{renderCNPJStatus()}</div>
              </div>
              {cnpjValidation.message && (
                <Badge variant={cnpjValidation.status === "valid" ? "secondary" : "destructive"} className="text-xs">
                  {cnpjValidation.message}
                </Badge>
              )}
              {errors.cnpj && (
                <Badge variant="destructive" className="text-xs">
                  {errors.cnpj}
                </Badge>
              )}
            </div>

            {/* Razão Social */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="legalName">Razão Social *</Label>
              <Input
                id="legalName"
                value={formData.legalName}
                onChange={(e) => handleInputChange("legalName", e.target.value)}
                placeholder="Ex: Bem Protege Tecnologia S/A"
                disabled={loading}
              />
              {errors.legalName && (
                <Badge variant="destructive" className="text-xs">
                  {errors.legalName}
                </Badge>
              )}
            </div>

            {/* Status */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked) => handleInputChange("active", checked)}
                  disabled={loading}
                />
                <Label htmlFor="active">Empresa ativa</Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Endereço */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Endereço
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CEP */}
            <div className="space-y-2">
              <Label htmlFor="postalCode">CEP *</Label>
              <CEPInput
                value={formData.address.postalCode}
                onChange={(value) => handleInputChange("address.postalCode", value)}
                onAddressFound={handleAddressFound}
                disabled={loading}
              />
              {errors.address?.postalCode && (
                <Badge variant="destructive" className="text-xs">
                  {errors.address.postalCode}
                </Badge>
              )}
            </div>

            {/* Estado */}
            <div className="space-y-2">
              <Label htmlFor="state">Estado *</Label>
              <Input
                id="state"
                value={formData.address.state}
                onChange={(e) => handleInputChange("address.state", e.target.value.toUpperCase())}
                placeholder="Ex: SP"
                maxLength={2}
                disabled={loading}
              />
              {errors.address?.state && (
                <Badge variant="destructive" className="text-xs">
                  {errors.address.state}
                </Badge>
              )}
            </div>

            {/* Cidade */}
            <div className="space-y-2">
              <Label htmlFor="city">Cidade *</Label>
              <Input
                id="city"
                value={formData.address.city}
                onChange={(e) => handleInputChange("address.city", e.target.value)}
                placeholder="Ex: São Paulo"
                disabled={loading}
              />
              {errors.address?.city && (
                <Badge variant="destructive" className="text-xs">
                  {errors.address.city}
                </Badge>
              )}
            </div>

            {/* Logradouro */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="street">Logradouro *</Label>
              <Input
                id="street"
                value={formData.address.street}
                onChange={(e) => handleInputChange("address.street", e.target.value)}
                placeholder="Ex: Av. Paulista"
                disabled={loading}
              />
              {errors.address?.street && (
                <Badge variant="destructive" className="text-xs">
                  {errors.address.street}
                </Badge>
              )}
            </div>

            {/* Número */}
            <div className="space-y-2">
              <Label htmlFor="number">Número *</Label>
              <Input
                id="number"
                value={formData.address.number}
                onChange={(e) => handleInputChange("address.number", e.target.value)}
                placeholder="Ex: 1000"
                disabled={loading}
              />
              {errors.address?.number && (
                <Badge variant="destructive" className="text-xs">
                  {errors.address.number}
                </Badge>
              )}
            </div>

            {/* Bairro */}
            <div className="space-y-2">
              <Label htmlFor="neighborhood">Bairro *</Label>
              <Input
                id="neighborhood"
                value={formData.address.neighborhood}
                onChange={(e) => handleInputChange("address.neighborhood", e.target.value)}
                placeholder="Ex: Bela Vista"
                disabled={loading}
              />
              {errors.address?.neighborhood && (
                <Badge variant="destructive" className="text-xs">
                  {errors.address.neighborhood}
                </Badge>
              )}
            </div>

            {/* Complemento */}
            <div className="space-y-2">
              <Label htmlFor="complement">Complemento</Label>
              <Input
                id="complement"
                value={formData.address.complement}
                onChange={(e) => handleInputChange("address.complement", e.target.value)}
                placeholder="Ex: 10º andar"
                disabled={loading}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botões */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={loading || cnpjValidation.status !== "valid"}>
          {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          {company ? "Atualizar" : "Criar"} Empresa
        </Button>
      </div>
    </form>
  )
}

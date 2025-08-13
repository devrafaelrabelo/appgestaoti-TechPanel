"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, User, MapPin, Calendar, CreditCard, Phone, Briefcase } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import type { UserFormData, CreateUserRequestPayload } from "@/types/user-request"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"


interface UserRequestFormProps {
  onSubmissionSuccess?: (data: UserFormData) => void
  onCancel?: () => void
}

// Função para converter data DD/MM/AAAA para AAAA-MM-DD
const formatDateToApi = (dateStr: string): string => {
  if (!dateStr || dateStr.length !== 10) return ""
  const parts = dateStr.split("/")
  if (parts.length !== 3) return ""
  return `${parts[2]}-${parts[1]}-${parts[0]}`
}

// Função para formatar CPF para o formato da API (com pontos e traço)
const formatCpfToApi = (cpf: string): string => {
  const cleaned = cpf.replace(/\D/g, "")
  if (cleaned.length !== 11) return cpf
  return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
}

// Função para limpar telefone para o formato da API (só números)
const cleanPhoneForApi = (phone: string): string => {
  return phone.replace(/\D/g, "")
}

export function UserRequestForm({ onSubmissionSuccess, onCancel }: UserRequestFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingName, setIsLoadingName] = useState(false)
  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [formData, setFormData] = useState<UserFormData>({
    nome: "",
    cpf: "",
    dt_nascimento: "",
    telefone: "",
    supervisor: "",
    lider: "",
    endereco: {
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      estado: "",
    },
  })

  // Simulação de busca de nome (manter como está por enquanto)
  const fetchUserName = async (cpf: string, dtNascimento: string) => {
    if (!cpf || !dtNascimento || dtNascimento.length !== 10) return
    setIsLoadingName(true)
    try {
      const response = await fetch(ApiEndpoints.selenium.consultarcpf, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          cpf,
          data_nascimento: dtNascimento, 
        }),
      })
      const data = await response.json()
      setFormData((prev) => ({ ...prev, nome: data.nome || "" }))
      toast({ title: "Nome encontrado!", description: data.nome })
    } catch (error) {
      toast({ title: "Erro ao buscar dados", variant: "destructive" })
    } finally {
      setIsLoadingName(false)
    }
  }

  // Busca de CEP via ViaCEP
  const fetchAddress = async (cep: string) => {
    if (cep.length !== 8) return
    setIsLoadingCep(true)
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      if (!data.erro) {
        setFormData((prev) => ({
          ...prev,
          endereco: {
            ...prev.endereco,
            cep,
            logradouro: data.logradouro || "",
            bairro: data.bairro || "",
            cidade: data.localidade || "",
            estado: data.uf || "",
            // Manter número e complemento digitados pelo usuário
            numero: prev.endereco.numero,
            complemento: prev.endereco.complemento,
          },
        }))
        toast({
          title: "CEP encontrado!",
          description: `${data.logradouro}, ${data.bairro} - ${data.localidade}/${data.uf}`,
        })
      } else {
        toast({ title: "CEP não encontrado", description: "Verifique se o CEP está correto.", variant: "destructive" })
      }
    } catch (error) {
      toast({ title: "Erro ao buscar CEP", variant: "destructive" })
    } finally {
      setIsLoadingCep(false)
    }
  }

  useEffect(() => {
    const cleanedCpf = formData.cpf.replace(/\D/g, "")
    if (cleanedCpf.length === 11 && formData.dt_nascimento.length === 10) {
      fetchUserName(cleanedCpf, formData.dt_nascimento)
    }
  }, [formData.cpf, formData.dt_nascimento])

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("endereco.")) {
      const addressField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        endereco: { ...prev.endereco, [addressField]: value },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }))
    }
  }

  const handleCepChange = (value: string) => {
    const cleanCep = value.replace(/\D/g, "")
    handleInputChange("endereco.cep", cleanCep)
    if (cleanCep.length === 8) {
      fetchAddress(cleanCep)
    } else {
      // Limpa campos de endereço se CEP não for completo, exceto número e complemento
      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...prev.endereco,
          cep: cleanCep,
          logradouro: "",
          bairro: "",
          cidade: "",
          estado: "",
        },
      }))
    }
  }

  const handleCpfChange = (value: string) => {
    const cleanCpf = value.replace(/\D/g, "")
    handleInputChange("cpf", cleanCpf)
  }

  const handleDateChange = (value: string) => {
    let cleanValue = value.replace(/\D/g, "")
    if (cleanValue.length > 8) cleanValue = cleanValue.substring(0, 8)
    let maskedValue = cleanValue
    if (cleanValue.length >= 2) {
      maskedValue = cleanValue.substring(0, 2) + (cleanValue.length > 2 ? "/" : "") + cleanValue.substring(2)
    }
    if (cleanValue.length >= 4) {
      maskedValue = maskedValue.substring(0, 5) + (cleanValue.length > 4 ? "/" : "") + maskedValue.substring(5)
    }
    handleInputChange("dt_nascimento", maskedValue.substring(0, 10))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 11) value = value.substring(0, 11)
    let maskedValue = value
    if (value.length > 0) {
      maskedValue = "(" + value.substring(0, 2) + (value.length > 2 ? ") " : "")
    }
    if (value.length > 2) {
      maskedValue += value.substring(2, value.length > 7 ? 7 : value.length) + (value.length > 7 ? "-" : "")
    }
    if (value.length > 7) {
      maskedValue += value.substring(7, 11)
    }
    handleInputChange("telefone", maskedValue)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
      toast({ title: "Erro de Configuração", description: "URL da API não configurada.", variant: "destructive" })
      return
    }
    setIsLoading(true)

    const payload: CreateUserRequestPayload = {
      cpf: formatCpfToApi(formData.cpf),
      birthDate: formatDateToApi(formData.dt_nascimento),
      fullName: formData.nome,
      phone: cleanPhoneForApi(formData.telefone),
      supervisorId: formData.supervisor || null,
      leaderId: formData.lider || null,
      cep: formData.endereco.cep.replace(/\D/g, ""),
      street: formData.endereco.logradouro,
      number: formData.endereco.numero,
      complement: formData.endereco.complemento || null,
      neighborhood: formData.endereco.bairro,
      city: formData.endereco.cidade,
      state: formData.endereco.estado,
    }

    try {
      const response = await fetchWithValidation(`${ApiEndpoints.backend.userRequestsCreate}`, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",          
        },
        body: JSON.stringify(payload),
      })      

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `Erro ao enviar solicitação: ${response.statusText} - ${errorData.message || "Detalhes não disponíveis"}`,
        )
      }

      toast({
        title: "Solicitação enviada!",
        description: "A solicitação de usuário foi enviada com sucesso.",
      })

      if (onSubmissionSuccess) {
        onSubmissionSuccess(formData)
      }

      // Reset form
      setFormData({
        nome: "",
        cpf: "",
        dt_nascimento: "",
        telefone: "",
        supervisor: "",
        lider: "",
        endereco: { cep: "", logradouro: "", numero: "", complemento: "", bairro: "", cidade: "", estado: "" },
      })
    } catch (err) {
      console.error(err)
      const errorMessage = err instanceof Error ? err.message : "Ocorreu um erro desconhecido."
      toast({
        title: "Erro ao Enviar Solicitação",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Seção Dados Pessoais */}
      <div className="bg-muted/40 rounded-lg p-6 border">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
            1
          </div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            Dados Pessoais
          </h3>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-sm font-medium">
                CPF *
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="cpf"
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => handleCpfChange(e.target.value)}
                  maxLength={11}
                  required
                  className="pl-10"
                  placeholder="Somente números"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dt_nascimento" className="text-sm font-medium">
                Data de Nascimento
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="dt_nascimento"
                  type="text"
                  value={formData.dt_nascimento}
                  onChange={(e) => handleDateChange(e.target.value)}
                  maxLength={10}
                  required
                  className="pl-10"
                  placeholder="DD/MM/AAAA"
                />
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-sm font-medium">
                Nome Completo *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="nome"
                  type="text"
                  value={formData.nome}
                  onChange={(e) => handleInputChange("nome", e.target.value)}
                  disabled={isLoadingName}
                  required
                  className="pl-10"
                />
                {isLoadingName && (
                  <Loader2 className="h-4 w-4 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground -mt-4">
            O nome será preenchido automaticamente após informar CPF e data de nascimento (simulado).
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center py-2">
        <div className="flex-1 border-t border-dashed border-gray-300"></div>
      </div>

      {/* Seção Contato e Hierarquia */}
      <div className="bg-muted/40 rounded-lg p-6 border">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
            2
          </div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Contato e Hierarquia
          </h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="telefone" className="text-sm font-medium">
              Telefone *
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                id="telefone"
                type="tel"
                value={formData.telefone}
                onChange={handlePhoneChange}
                maxLength={15}
                required
                className="pl-10"
                placeholder="(XX) XXXXX-XXXX"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="supervisor" className="text-sm font-medium">
              ID Supervisor (Opcional)
            </Label>
            <Input
              id="supervisor"
              type="text"
              value={formData.supervisor}
              onChange={(e) => handleInputChange("supervisor", e.target.value)}
              placeholder="ID do Supervisor"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lider" className="text-sm font-medium">
              ID Líder (Opcional)
            </Label>
            <Input
              id="lider"
              type="text"
              value={formData.lider}
              onChange={(e) => handleInputChange("lider", e.target.value)}
              placeholder="ID do Líder"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center py-2">
        <div className="flex-1 border-t border-dashed border-gray-300"></div>
      </div>

      {/* Seção Endereço */}
      <div className="bg-muted/40 rounded-lg p-6 border relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Endereço
            </h3>
          </div>
          {isLoadingCep && (
            <div className="flex items-center gap-2 text-blue-600 text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Buscando endereço...
            </div>
          )}
        </div>
        {isLoadingCep && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 rounded-lg flex items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <div className="space-y-1">
                <p className="text-sm font-medium">Consultando CEP...</p>
                <p className="text-xs text-muted-foreground">Aguarde enquanto buscamos o endereço</p>
              </div>
            </div>
          </div>
        )}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cep" className="text-sm font-medium">
                CEP *
              </Label>
              <Input
                id="cep"
                type="text"
                value={formData.endereco.cep}
                onChange={(e) => handleCepChange(e.target.value)}
                maxLength={8}
                required
                placeholder="Somente números"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="logradouro" className="text-sm font-medium">
                Logradouro * (Preenchido automaticamente)
              </Label>
              <Input
                id="logradouro"
                type="text"
                value={formData.endereco.logradouro}
                disabled={true}
                className="bg-muted/50"
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="numero" className="text-sm font-medium">
                Número *
              </Label>
              <Input
                id="numero"
                type="text"
                value={formData.endereco.numero}
                onChange={(e) => handleInputChange("endereco.numero", e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="complemento" className="text-sm font-medium">
                Complemento (Opcional)
              </Label>
              <Input
                id="complemento"
                type="text"
                value={formData.endereco.complemento}
                onChange={(e) => handleInputChange("endereco.complemento", e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="bairro" className="text-sm font-medium">
                Bairro * (Preenchido automaticamente)
              </Label>
              <Input
                id="bairro"
                type="text"
                value={formData.endereco.bairro}
                disabled={true}
                className="bg-muted/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade" className="text-sm font-medium">
                Cidade * (Preenchido automaticamente)
              </Label>
              <Input
                id="cidade"
                type="text"
                value={formData.endereco.cidade}
                disabled={true}
                className="bg-muted/50"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado" className="text-sm font-medium">
                Estado
              </Label>
              <Input
                id="estado"
                type="text"
                value={formData.endereco.estado}
                disabled={true}
                className="bg-muted/50"
                required
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Enviar Solicitação
        </Button>
      </div>
    </form>
  )
}

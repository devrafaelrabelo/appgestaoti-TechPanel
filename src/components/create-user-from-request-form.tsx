"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Save, X, User, Mail, Shield, Building, Users, XCircle, CheckCircle, Loader2 } from "lucide-react"
import type { ApiDetailedUserRequest } from "@/types/user-request"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import { ApiEndpoints } from "@/lib/api-endpoints"

interface CreateUserFromRequestData {
  username: string
  email: string
  password: string
  roles: string[]
  positionId: string
  departmentIds: string[]
  groupIds: string[]
}

interface CreateUserFromRequestFormProps {
  requestData: ApiDetailedUserRequest
  onSuccess: (createdUserData: any) => void
  onCancel: () => void
}

// Mock data - em produção, estes dados viriam de APIs
const mockRoles = [
  { id: "ROLE_ADMIN", name: "Administrador" },
  { id: "ROLE_MANAGER", name: "Gerente" },
  { id: "ROLE_USER", name: "Usuário" },
  { id: "ROLE_RESOURCE_TYPE_MANAGER", name: "Gerente de Recursos" },
]

const mockPositions = [
  { id: "49894f44-55ec-460a-b0cf-2dcdf0a9c641", name: "Desenvolvedor Senior" },
  { id: "49894f44-55ec-460a-b0cf-2dcdf0a9c642", name: "Analista de Sistemas" },
  { id: "49894f44-55ec-460a-b0cf-2dcdf0a9c643", name: "Gerente de TI" },
]

const mockDepartments = [
  { id: "f1c2d3e4-0001-4a3c-8b1e-100000000001", name: "Tecnologia da Informação" },
  { id: "f1c2d3e4-0001-4a3c-8b1e-100000000002", name: "Recursos Humanos" },
  { id: "f1c2d3e4-0001-4a3c-8b1e-100000000003", name: "Comercial" },
]

const mockGroups = [
  { id: "9c4a72a7-ea7b-4d5e-a8c4-b8ac0f453936", name: "Desenvolvedores" },
  { id: "9c4a72a7-ea7b-4d5e-a8c4-b8ac0f453937", name: "Analistas" },
  { id: "9c4a72a7-ea7b-4d5e-a8c4-b8ac0f453938", name: "Gestores" },
]

const initialFormData: CreateUserFromRequestData = {
  username: "",
  email: "",
  password: "",
  roles: [],
  positionId: "",
  departmentIds: [],
  groupIds: [],
}

export function CreateUserFromRequestForm({ requestData, onSuccess, onCancel }: CreateUserFromRequestFormProps) {
  const [formData, setFormData] = useState<CreateUserFromRequestData>(initialFormData)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast() 

  // Estados para validação de username e email
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle")
  const [usernameMessage, setUsernameMessage] = useState<string>("")
  const [emailStatus, setEmailStatus] = useState<"idle" | "checking" | "available" | "unavailable">("idle")
  const [emailMessage, setEmailMessage] = useState<string>("")

  useEffect(() => {
  if (requestData?.fullName) {
    const normalized = requestData.fullName
      .normalize("NFD")                   // separa acentos
      .replace(/[\u0300-\u036f]/g, "")   // remove acentos
      .replace(/[^a-zA-Z\s]/g, "")       // remove caracteres especiais
      .toLowerCase()

    const parts = normalized.trim().split(/\s+/)
    const firstName = parts[0] || ""
    const lastName = parts.length > 1 ? parts[parts.length - 1] : ""

    const suggestedUsername = `${firstName}.${lastName}`
    const suggestedEmail = `${firstName}${lastName}@empresa.com`

    setFormData({
      ...initialFormData,
      username: suggestedUsername,
      email: suggestedEmail,
    })
  }
}, [requestData])

  const handleInputChange = (field: keyof CreateUserFromRequestData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  
  // Função de validação de username
  
    async function validateUsername(username: string) {
      if (!username) {
        setUsernameStatus("idle")
        setUsernameMessage("")
        return false
      }
      setUsernameStatus("checking")
      setUsernameMessage("Verificando...")
      try {
        const response = await fetchWithValidation(`${ApiEndpoints.userhub.verifyUsername}`, {
          method: "GET",
          body: JSON.stringify({ username }),
        })
        const data = await response.json()
        if (response.ok && data.isAvailable) {
          setUsernameStatus("available")
          setUsernameMessage("Username disponível.")
          return true
        } else {
          setUsernameStatus("unavailable")
          setUsernameMessage(data.message || "Username indisponível.")
          return false
        }
      } catch (error) {
        console.error("Erro ao verificar username:", error)
        setUsernameStatus("unavailable")
        setUsernameMessage("Erro ao verificar username.")
        return false
      }
    }

  // Função de validação de email
  async function validateEmail(email: string) {    
      if (!email || !/\S+@\S+\.\S+/.test(email)) {
        setEmailStatus("idle")
        setEmailMessage("")
        return false
      }
      setEmailStatus("checking")
      setEmailMessage("Verificando...")
      try {
        const response = await fetchWithValidation(`${ApiEndpoints.userhub.verifyEmail}${email}`, {
          method: "GET",
        })
        const data = await response.json()
        if (response.ok && data.isAvailable) {
          setEmailStatus("available")
          setEmailMessage("Email disponível.")
          return true
        } else {
          setEmailStatus("unavailable")
          setEmailMessage(data.message || "Email indisponível.")
          return false
        }
      } catch (error) {
        console.error("Erro ao verificar email:", error)
        setEmailStatus("unavailable")
        setEmailMessage("Erro ao verificar email.")
        return false
      }
    }


  const toggleRole = (roleId: string) => {
    setFormData((prev) => {
      const currentRoles = prev.roles
      const hasRole = currentRoles.includes(roleId)

      if (hasRole) {
        return { ...prev, roles: currentRoles.filter((r) => r !== roleId) }
      } else {
        return { ...prev, roles: [...currentRoles, roleId] }
      }
    })
  }

  const toggleDepartment = (departmentId: string) => {
    setFormData((prev) => {
      const currentDepartments = prev.departmentIds
      const hasDepartment = currentDepartments.includes(departmentId)

      if (hasDepartment) {
        return { ...prev, departmentIds: currentDepartments.filter((d) => d !== departmentId) }
      } else {
        return { ...prev, departmentIds: [...currentDepartments, departmentId] }
      }
    })
  }

  const toggleGroup = (groupId: string) => {
    setFormData((prev) => {
      const currentGroups = prev.groupIds
      const hasGroup = currentGroups.includes(groupId)

      if (hasGroup) {
        return { ...prev, groupIds: currentGroups.filter((g) => g !== groupId) }
      } else {
        return { ...prev, groupIds: [...currentGroups, groupId] }
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validações básicas
    if (!formData.username || !formData.email || !formData.password) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha username, email e senha.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    // Validação de disponibilidade de username e email
    if (usernameStatus !== "available" || emailStatus !== "available") {
      toast({
        title: "Validação pendente ou falha",
        description: "Por favor, verifique a disponibilidade do username e email.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (formData.roles.length === 0) {
      toast({
        title: "Role obrigatória",
        description: "Selecione pelo menos uma role para o usuário.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (!formData.positionId) {
      toast({
        title: "Posição obrigatória",
        description: "Selecione uma posição para o usuário.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (formData.departmentIds.length === 0) {
      toast({
        title: "Departamento obrigatório",
        description: "Selecione pelo menos um departamento.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (formData.groupIds.length === 0) {
      toast({
        title: "Grupo obrigatório",
        description: "Selecione pelo menos um grupo.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      if (!process.env.NEXT_PUBLIC_API_BASE_URL) {
        throw new Error("URL da API não configurada")
      }

      const response = await fetchWithValidation(`${ApiEndpoints.backend.userRequestsCreate}${requestData.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
        signal: AbortSignal.timeout(10000),
      })


      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `Erro ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      toast({
        title: "Usuário Criado com Sucesso!",
        description: `O usuário ${formData.username} foi criado no sistema.`,
      })

      onSuccess({
        ...formData,
        firstName: requestData.firstName,
        lastName: requestData.lastName,
        ...result,
      })

      
    } catch (error) {
      console.error("Erro ao criar usuário:", error)
      toast({
        title: "Erro ao Criar Usuário",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Dados da Solicitação (Imutáveis) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Dados da Solicitação
          </CardTitle>
          <CardDescription>Informações vindas da solicitação (não editáveis)</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Nome Completo</Label>
            <Input value={`${requestData.fullName}`} disabled />
          </div>
          <div>
            <Label>CPF</Label>
            <Input value={requestData.cpf} disabled />
          </div>
          <div>
            <Label>Data de Nascimento</Label>
            <Input value={requestData.birthDate} disabled />
          </div>
          <div>
            <Label>Telefone</Label>
            <Input value={requestData.phone} disabled />
          </div>
          <div className="md:col-span-2">
            <Label>Endereço</Label>
            <Input
              value={`${requestData.street}, ${requestData.number} - ${requestData.city}/${requestData.state}`}
              disabled
            />
          </div>
        </CardContent>
      </Card>

      {/* Dados do Usuário (Editáveis) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Mail className="h-5 w-5" />
            Dados de Acesso
          </CardTitle>
          <CardDescription>Configure as credenciais de acesso do usuário</CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="username">Username *</Label>
            <div className="relative">
              <div className="flex items-center gap-2">
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => handleInputChange("username", e.target.value)}
                  required
                  className={
                    usernameStatus === "unavailable"
                      ? "border-red-500 focus-visible:ring-red-500"
                      : usernameStatus === "available"
                      ? "border-green-500 focus-visible:ring-green-500"
                      : ""
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => validateUsername(formData.username)}
                  disabled={!formData.username || usernameStatus === "checking"}
                  title="Validar username"
                >
                  {usernameStatus === "checking" && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 animate-spin" />
                  )}
                  {usernameStatus === "available" && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                  )}
                  {usernameStatus === "unavailable" && (
                    <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                  )}
                  {emailStatus === "idle" && (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
                </Button>
              </div>   
            </div>            
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <div className="relative">
              <div className="flex items-center gap-2">
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                  className={
                    emailStatus === "unavailable"
                      ? "border-red-500 focus-visible:ring-red-500"
                      : emailStatus === "available"
                      ? "border-green-500 focus-visible:ring-green-500"
                      : ""
                  }
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => validateEmail(formData.email)}
                  disabled={!formData.email || emailStatus === "checking"}
                  title="Validar email"
                >
                {emailStatus === "checking" && (
                  <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 animate-spin" />
                )}
                {emailStatus === "available" && (
                  <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                )}
                {emailStatus === "unavailable" && (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
                {emailStatus === "idle" && (
                  <XCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                )}
                </Button>
              </div>              
            </div>            
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="password">Senha *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              placeholder="Digite uma senha segura"
            />
          </div>
        </CardContent>
      </Card>

      {/* Posição */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Posição
          </CardTitle>
          <CardDescription>Selecione a posição/cargo do usuário</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={formData.positionId} onValueChange={(value) => handleInputChange("positionId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma posição" />
            </SelectTrigger>
            <SelectContent>
              {mockPositions.map((position) => (
                <SelectItem key={position.id} value={position.id}>
                  {position.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Departamentos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building className="h-5 w-5" />
            Departamentos
          </CardTitle>
          <CardDescription>Selecione os departamentos aos quais o usuário pertencerá</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {mockDepartments.map((department) => (
              <Button
                key={department.id}
                type="button"
                variant={formData.departmentIds.includes(department.id) ? "default" : "outline"}
                onClick={() => toggleDepartment(department.id)}
                className="justify-start"
              >
                {department.name}
              </Button>
            ))}
          </div>
          {formData.departmentIds.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {formData.departmentIds.map((deptId) => {
                const dept = mockDepartments.find((d) => d.id === deptId)
                return (
                  <Badge key={deptId} variant="secondary">
                    {dept?.name}
                  </Badge>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grupos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5" />
            Grupos
          </CardTitle>
          <CardDescription>Selecione os grupos aos quais o usuário pertencerá</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {mockGroups.map((group) => (
              <Button
                key={group.id}
                type="button"
                variant={formData.groupIds.includes(group.id) ? "default" : "outline"}
                onClick={() => toggleGroup(group.id)}
                className="justify-start"
              >
                {group.name}
              </Button>
            ))}
          </div>
          {formData.groupIds.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {formData.groupIds.map((groupId) => {
                const group = mockGroups.find((g) => g.id === groupId)
                return (
                  <Badge key={groupId} variant="secondary">
                    {group?.name}
                  </Badge>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Botões de Ação */}
      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={onCancel} disabled={isLoading}>
          <X className="h-4 w-4 mr-2" />
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading || usernameStatus !== "available" || emailStatus !== "available"}>
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
              Criando Usuário...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Criar Usuário
            </>
          )}
        </Button>
      </div>
    </form>
  )
}

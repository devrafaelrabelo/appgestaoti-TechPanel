"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  useCreateAdminUser,
  type CreateAdminUserPayload,
  type OrgLookups,
} from "@/hooks/use-create-admin-user"
import { useRolesPermissions } from "@/hooks/use-roles-permissions"
import { useToast } from "@/components/ui/use-toast"
import { Search, User, Building, Shield, X, Calendar, UserPlus, Settings, Check, KeyRound } from "lucide-react"
import type { PermissionItem, RoleItem } from "@/types/admin-user-create"
import { ApiEndpoints } from "@/lib/api-endpoints"

// ---------------------- Utils ----------------------
function onlyDigits(v: string) {
  return (v || "").replace(/[^\d]/g, "")
}
function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}
function isValidCPF(cpf: string) {
  const value = onlyDigits(cpf)
  if (!value || value.length !== 11) return false
  if (/^(\d)\1+$/.test(value)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += parseInt(value.charAt(i)) * (10 - i)
  let rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(value.charAt(9))) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += parseInt(value.charAt(i)) * (11 - i)
  rev = 11 - (sum % 11)
  if (rev === 10 || rev === 11) rev = 0
  if (rev !== parseInt(value.charAt(10))) return false
  return true
}
// YYYY-MM-DD -> DD/MM/AAAA | mantém se já estiver em DD/MM/AAAA
function toDDMMYYYY(input: string) {
  if (!input) return ""
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(input)) return input
  if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
    const [y, m, d] = input.split("-")
    return `${d}/${m}/${y}`
  }
  return input
}
// nome completo → primeiro/último (simples)
function splitFullName(name: string) {
  const parts = (name || "").trim().split(/\s+/)
  if (parts.length === 0) return { first: "", last: "" }
  if (parts.length === 1) return { first: parts[0], last: "" }
  return { first: parts[0], last: parts.slice(1).join(" ") }
}

interface CreateAdminUserModalTabsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateAdminUserModalTabs({ open, onOpenChange, onSuccess }: CreateAdminUserModalTabsProps) {
  const { createUser, consultCep, fetchOrgLookups, loading, cepLoading, error, setError, orgLoading, orgError } =
    useCreateAdminUser()
  const { roles, permissions, loading: rolesPermissionsLoading, error: rpError } = useRolesPermissions()
  const { toast } = useToast()

  // ===== Abas =====
  const [activeTab, setActiveTab] = useState("dados")

  // ===== Estado principal (SEM Avatar) =====
  const [form, setForm] = useState<CreateAdminUserPayload>({
    firstName: "",
    lastName: "",
    fullName: "",
    socialName: "",
    username: "",
    email: "",
    cpf: "",                // será preenchido pela consulta
    birthDate: "",         // será preenchido pela consulta (YYYY-MM-DD)    
    origin: "admin", 
    password: "", // opcional, guardada localmente   
    managerId: "",    
    roleIds: [],
    departmentId: "",
    groupIds: [],
    functionIds: [],
    positionId: null,
    statusId: null,
    personalPhoneNumbers: [],
    address: {
      street: "",
      number: "",
      complement: "",
      city: "",
      neighborhood: "",
      state: "",
      country: "Brasil",
      postalCode: "",
    },
  })

  // E-mail particular (apenas UI)
  const [personalEmail, setPersonalEmail] = useState("")

  // Senha (opcional — guardada localmente; envie ao backend se desejar)
  const [includePassword, setIncludePassword] = useState(true)
  const [passwordValue, setPasswordValue] = useState("Teste@1234")

  // Busca CPF + Data (área de busca dedicada)
  const [cpfSearch, setCpfSearch] = useState({ cpf: "", birthDate: "" }) // birthDate em DD/MM/AAAA
  const [cpfLookupLoading, setCpfLookupLoading] = useState(false)
  const cpfBirthTimer = useRef<number | null>(null)

  // Telefones
  const [phonesInput, setPhonesInput] = useState("")
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])

  // ===== LOOKUPS de Organização (com trava anti-loop) =====
  const [org, setOrg] = useState<OrgLookups>({
    departments: [],
    functions: [],
    positions: [],
    statuses: [],
    managers: [],
  })
  const orgLoadedRef = useRef(false)
  useEffect(() => {
    if (!open) {
      orgLoadedRef.current = false
      return
    }
    if (orgLoadedRef.current) return
    orgLoadedRef.current = true
    ;(async () => {
      const data = await fetchOrgLookups()
      setOrg(data)
    })()
  }, [open, fetchOrgLookups])

  // ===== Permissões agrupadas (resource → nome:tipo) =====
  const groupedByResourceAndName = useMemo(() => {
    const byRes: Record<string, Record<string, PermissionItem[]>> = {}
    for (const p of permissions) {
      const res = p.resource || "Outros"
      const raw = p.name || ""
      const idx = raw.indexOf(":")
      const nome = idx > -1 ? raw.slice(0, idx) : raw
      if (!byRes[res]) byRes[res] = {}
      if (!byRes[res][nome]) byRes[res][nome] = []
      byRes[res][nome].push(p)
    }
    for (const res of Object.keys(byRes)) {
      const ordered: Record<string, PermissionItem[]> = {}
      Object.keys(byRes[res])
        .sort((a, b) => a.localeCompare(b))
        .forEach((nome) => {
          ordered[nome] = byRes[res][nome].slice().sort((a, b) => {
            const at = (a.name?.split(":")[1] || a.action || "").toLowerCase()
            const bt = (b.name?.split(":")[1] || b.action || "").toLowerCase()
            return at.localeCompare(bt)
          })
        })
      byRes[res] = ordered
    }
    return byRes
  }, [permissions])

  // ===== Helpers de atualização =====
  function update<K extends keyof CreateAdminUserPayload>(key: K, value: CreateAdminUserPayload[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }
  function updateAddress<K extends keyof Nonnullable<CreateAdminUserPayload["address"]>>(key: K, value: any) {
    setForm((prev) => ({ ...prev, address: { ...(prev.address || {}), [key]: value } }))
  }

  // ===== CPF + Nascimento (consulta) =====
  const handleCpfLookup = async () => {
    const cpfLimpo = onlyDigits(cpfSearch.cpf)
    const nascimentoDDMMYYYY = toDDMMYYYY(cpfSearch.birthDate)

    if (!cpfLimpo || cpfLimpo.length !== 11 || !nascimentoDDMMYYYY || nascimentoDDMMYYYY.length !== 10) {
      toast({
        title: "Campos obrigatórios",
        description: "Informe CPF (11 dígitos) e Data de Nascimento (DD/MM/AAAA).",
        variant: "destructive",
      })
      return
    }

    // validação local opcional, mas mantém habilitação do submit só com dados válidos
    if (!isValidCPF(cpfLimpo)) {
      toast({ title: "CPF inválido", description: "Revise o CPF informado.", variant: "destructive" })
      return
    }

    setCpfLookupLoading(true)
    try {
      const response = await fetch(ApiEndpoints.selenium.consultarcpf, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ cpf: cpfLimpo, data_nascimento: nascimentoDDMMYYYY }),
      })
      const data = await response.json()

      if (data?.nome) {
        const fullName = data.nome || ""
        const { first, last } = splitFullName(fullName)

        // preenche nomes
        update("fullName", fullName)
        update("firstName", first)
        update("lastName", last)

        // salva CPF e birthDate no form (YYYY-MM-DD) para ir no payload
        update("cpf", cpfLimpo)
        const [d, m, y] = nascimentoDDMMYYYY.split("/")
        update("birthDate", `${y}-${m}-${d}`)

        toast({ title: "Nome encontrado!", description: fullName })
      } else {
        toast({ title: "Não encontrado", description: "Verifique CPF e Data de Nascimento", variant: "destructive" })
      }

      // endereço opcional retornado pelo serviço
      if (data?.endereco) {
        updateAddress("postalCode", data.endereco.cep || form.address?.postalCode || "")
        updateAddress("street", data.endereco.logradouro || form.address?.street || "")
        updateAddress("number", data.endereco.numero || form.address?.number || "")
        updateAddress("complement", data.endereco.complemento || form.address?.complement || "")
        updateAddress("neighborhood", data.endereco.bairro || form.address?.neighborhood || "")
        updateAddress("city", data.endereco.cidade || form.address?.city || "")
        updateAddress("state", data.endereco.uf || form.address?.state || "")
        updateAddress("country", form.address?.country || "Brasil")
        toast({ title: "Endereço preenchido", description: "Campos de endereço atualizados a partir da consulta." })
      }

      setActiveTab("dados")
    } catch {
      toast({ title: "Erro ao buscar dados", variant: "destructive" })
    } finally {
      setCpfLookupLoading(false)
    }
  }

  // Debounce quando CPF + Data (DD/MM/AAAA) completos
  useEffect(() => {
    if (cpfBirthTimer.current) window.clearTimeout(cpfBirthTimer.current)
    const cpf = onlyDigits(cpfSearch.cpf || "")
    const birth = toDDMMYYYY(cpfSearch.birthDate || "")
    if (cpf.length === 11 && birth.length === 10) {
      cpfBirthTimer.current = window.setTimeout(handleCpfLookup, 600) as unknown as number
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cpfSearch.cpf, cpfSearch.birthDate])

  // CEP auto
  useEffect(() => {
    const zip = form.address?.postalCode?.replace(/\D/g, "") || ""
    if (zip.length !== 8) return
    let cancelled = false
    const t = setTimeout(async () => {
      const data = await consultCep(zip)
      if (cancelled || !data) return
      updateAddress("postalCode", data.cep || form.address?.postalCode || "")
      updateAddress("street", data.logradouro || form.address?.street || "")
      updateAddress("neighborhood", data.bairro || form.address?.neighborhood || "")
      updateAddress("city", data.localidade || form.address?.city || "")
      updateAddress("state", data.uf || form.address?.state || "")
      updateAddress("country", form.address?.country || "Brasil")
      toast({ title: "Endereço atualizado", description: "CEP localizado e endereço preenchido automaticamente." })
    }, 400)
    return () => {
      cancelled = true
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.address?.postalCode])

  // ===== Validação =====
  const canSubmit = useMemo(() => {
    const requiredOk =
      form.firstName.trim() &&
      form.lastName.trim() &&
      form.username.trim() &&
      form.email.trim() &&
      validateEmail(form.email)

    // CPF só é válido se estiver preenchido e correto
    const cpfOk = !form.cpf || isValidCPF(form.cpf)

    return !!requiredOk && cpfOk && !loading
  }, [form, loading])

  // ===== Telefones =====
  function addPhonesFromInput() {
    const items = (phonesInput || "")
      .split(",")
      .map((p) => onlyDigits(p.trim()))
      .filter(Boolean)
    if (!items.length) return
    setForm((prev) => ({
      ...prev,
      personalPhoneNumbers: Array.from(new Set([...(prev.personalPhoneNumbers || []), ...items])),
    }))
    setPhonesInput("")
  }
  function removePhone(p: string) {
    setForm((prev) => ({
      ...prev,
      personalPhoneNumbers: (prev.personalPhoneNumbers || []).filter((x) => x !== p),
    }))
  }

  // ===== Roles =====
  const toggleRole = (roleId: string) => {
    const next = selectedRoles.includes(roleId)
      ? selectedRoles.filter((r) => r !== roleId)
      : [...selectedRoles, roleId]
    setSelectedRoles(next)
    update("roleIds", next)
  }

  // ===== Permissions =====
  const togglePermission = (permId: string) => {
    setSelectedPermissions((prev) => (prev.includes(permId) ? prev.filter((id) => id !== permId) : [...prev, permId]))
  }

  // ===== Submit =====
  const handleSubmit = async () => {
    if (!canSubmit) {
      toast({ title: "Validação", description: "Verifique os campos obrigatórios.", variant: "destructive" })
      return
    }

    const payload: CreateAdminUserPayload = {
      ...form,
      // normaliza CPF e strings opcionais
      cpf: form.cpf ? onlyDigits(form.cpf) : null,
      socialName: form.socialName?.trim() || null,      
      managerId: form.managerId || "",
      address:
        form.address &&
        Object.values(form.address).some((v) => (typeof v === "string" ? v.trim() : v))
          ? {
              ...form.address,
              complement: form.address?.complement?.trim() || null,
              neighborhood: form.address?.neighborhood?.trim() || null,
            }
          : undefined,
    }

     // 👉 adiciona personalEmail se preenchido
    if (personalEmail.trim()) {
      (payload as any).personalEmail = personalEmail.trim()
    }

    // só adiciona senha quando for para enviar
    if (includePassword && passwordValue.trim()) {
      (payload as any).password = passwordValue.trim();
    }

    // Inclui permissões selecionadas no payload (ajuste se sua API usar outro nome)
    ;(payload as any).permissionIds = selectedPermissions

    const result = await createUser(payload as any /*, { includePassword, defaultPassword: passwordValue } */)

    if (result?.success) {
      toast({
        title: "Usuário criado",
        description: `Usuário ${result.user?.username} criado com sucesso${
          result.user?.temporaryPassword ? `. Senha temporária: ${result.user.temporaryPassword}` : ""
        }`,
      })
      onSuccess()
      onOpenChange(false)
      resetForm()
    } else {
      toast({
        title: "Erro ao criar usuário",
        description: result?.error || "Erro desconhecido",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setForm({
      firstName: "",
      lastName: "",
      fullName: "",
      socialName: "",
      username: "",
      email: "",
      cpf: "",
      birthDate: "",   
      password: "", // opcional, guardada localmente      
      origin: "admin",      
      managerId: "",      
      roleIds: [],
      departmentId: form.departmentId || null,
      groupIds: [],
      functionIds: [],
      positionId: null,
      statusId: null,
      personalPhoneNumbers: [],
      address: {
        street: "",
        number: "",
        complement: "",
        city: "",
        neighborhood: "",
        state: "",
        country: "Brasil",
        postalCode: "",
      },
    })
    setSelectedRoles([])
    setSelectedPermissions([])
    setPhonesInput("")
    setCpfSearch({ cpf: "", birthDate: "" })
    setIncludePassword(true)
    setPasswordValue("Teste@1234")
    setPersonalEmail("")
    setActiveTab("dados")
    setError?.(null)
  }

  // máscara de data para o campo de busca (DD/MM/AAAA)
  const handleBirthDateMask = (value: string) => {
    let cleanValue = value.replace(/\D/g, "")
    if (cleanValue.length > 8) cleanValue = cleanValue.substring(0, 8)

    let maskedValue = cleanValue
    if (cleanValue.length >= 2) {
      maskedValue = cleanValue.substring(0, 2) + (cleanValue.length > 2 ? "/" : "") + cleanValue.substring(2)
    }
    if (cleanValue.length >= 4) {
      maskedValue = maskedValue.substring(0, 5) + (cleanValue.length > 4 ? "/" : "") + maskedValue.substring(5)
    }

    maskedValue = maskedValue.substring(0, 10)
    setCpfSearch((p) => ({ ...p, birthDate: maskedValue }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* GRID: header / conteúdo / footer — conteúdo rolável; footer fixo */}
      <DialogContent
        className="
          w-[75vw] max-w-[75vw]
          h-[75svh] max-h-[75svh]
          p-0 overflow-hidden
          grid grid-rows-[auto,1fr,auto]
        "
      >
        {/* HEADER */}
        <div className="px-6 pt-6 shrink-0">
          <DialogHeader className="p-0">
            <DialogTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Criar Usuário Administrativo
            </DialogTitle>
          </DialogHeader>
          {(error || rpError || orgError) && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error || rpError || orgError}</AlertDescription>
            </Alert>
          )}
        </div>

        {/* CONTEÚDO (rolável) */}
        <div className="min-h-0 overflow-hidden px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex h-full flex-col">
            <TabsList className="grid w-full grid-cols-5 shrink-0">
              <TabsTrigger value="dados">
                <User className="h-4 w-4 mr-2" />
                Dados
              </TabsTrigger>
              <TabsTrigger value="login">
                <Settings className="h-4 w-4 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger value="endereco">Endereço</TabsTrigger>
              <TabsTrigger value="org">
                <Building className="h-4 w-4 mr-2" />
                Organização
              </TabsTrigger>
              <TabsTrigger value="permissions">
                <Shield className="h-4 w-4 mr-2" />
                Permissões/Roles
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 min-h-0 overflow-hidden pb-4">
              {/* DADOS */}
              <TabsContent value="dados" className="h-full overflow-y-auto space-y-6 pr-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Buscar por CPF e preencher dados
                    </CardTitle>
                    <CardDescription>
                      Informe CPF e Data de Nascimento (DD/MM/AAAA). Ao completar ambos, buscamos o nome e (se houver) o endereço.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="cpf-search">CPF</Label>
                        <Input
                          id="cpf-search"
                          placeholder="000.000.000-00"
                          value={cpfSearch.cpf}
                          onChange={(e) => setCpfSearch((p) => ({ ...p, cpf: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birth-date-search" className="text-sm font-medium">
                          Data de Nascimento *
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                          <Input
                            id="birth-date-search"
                            type="text"
                            value={cpfSearch.birthDate}
                            onChange={(e) => handleBirthDateMask(e.target.value)}
                            maxLength={10}
                            required
                            className="pl-10"
                            placeholder="DD/MM/AAAA"
                          />
                        </div>
                      </div>
                      <div className="flex items-end">
                        <Button
                          className="w-full"
                          onClick={handleCpfLookup}
                          disabled={cpfLookupLoading || !cpfSearch.cpf || !cpfSearch.birthDate}
                        >
                          {cpfLookupLoading ? <LoadingSpinner className="mr-2" /> : null}
                          Buscar e Preencher
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Os campos de nome serão preenchidos automaticamente. CPF e Nascimento ficam salvos no formulário para envio ao backend.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dados Pessoais</CardTitle>
                    <CardDescription>Preenchidos pela consulta. Apenas Nome social, e-mail particular e telefones podem ser editados.</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">Nome *</Label>
                      <Input id="firstName" value={form.firstName} readOnly disabled placeholder="Preenchido pela consulta" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Sobrenome *</Label>
                      <Input id="lastName" value={form.lastName} readOnly disabled placeholder="Preenchido pela consulta" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nome Completo</Label>
                      <Input id="fullName" value={form.fullName || ""} readOnly disabled placeholder="Preenchido pela consulta" />
                    </div>

                    <div className="space-y-2 md:col-span-3">
                      <Label htmlFor="socialName">Nome social (opcional)</Label>
                      <Input
                        id="socialName"
                        value={form.socialName || ""}
                        onChange={(e) => update("socialName", e.target.value)}
                        placeholder="Nome social"
                      />
                    </div>

                    {/* Exibe CPF/Nascimento apenas para visualização */}
                    <div className="space-y-2">
                      <Label htmlFor="cpf">CPF</Label>
                      <Input id="cpf" placeholder="Preenchido pela consulta" value={form.cpf || ""} readOnly disabled />
                      {form.cpf && !isValidCPF(form.cpf) && <p className="text-xs text-destructive mt-1">CPF inválido</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">Data de nascimento</Label>
                      <Input id="birthDate" type="date" value={form.birthDate || ""} readOnly disabled />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="personalEmail">E-mail particular</Label>
                      <Input
                        id="personalEmail"
                        type="email"
                        value={personalEmail}
                        onChange={(e) => setPersonalEmail(e.target.value)}
                        placeholder="seu.email.pessoal@exemplo.com"
                      />
                    </div>

                    {/* Telefones */}
                    <div className="md:col-span-3">
                      <Separator className="my-2" />
                      <div className="flex items-center justify-between">
                        <Label className="text-base">Telefones pessoais</Label>
                        <span className="text-xs text-muted-foreground">Adicione números separados por vírgula</span>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Input
                          placeholder="11999998888, 11888887777"
                          value={phonesInput}
                          onChange={(e) => setPhonesInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              addPhonesFromInput()
                            }
                          }}
                        />
                        <Button type="button" variant="secondary" onClick={addPhonesFromInput}>
                          Adicionar
                        </Button>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {(form.personalPhoneNumbers || []).map((p) => (
                          <Badge key={p} variant="secondary" className="gap-1">
                            {p}
                            <button type="button" onClick={() => removePhone(p)} aria-label={`Remover ${p}`}>
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* LOGIN */}
              <TabsContent value="login" className="h-full overflow-y-auto space-y-6 pr-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Credenciais e Preferências</CardTitle>
                    <CardDescription>Configurações de acesso e idioma/tema</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="username">Username *</Label>
                      <Input id="username" value={form.username} onChange={(e) => update("username", e.target.value)} placeholder="usuario.admin" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input id="email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="usuario@empresa.com" />
                      {form.email && !validateEmail(form.email) && <p className="text-xs text-destructive mt-1">E-mail inválido</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="origin">Origem</Label>
                      <Input id="origin" value={form.origin || ""} onChange={(e) => update("origin", e.target.value)} placeholder="admin" />
                    </div>

                    <div className="flex items-center justify-between rounded-md border p-3 md:col-span-3">
                      <div className="flex items-center gap-2">
                        <KeyRound className="h-4 w-4" />
                        <div>
                          <Label htmlFor="includePassword">Senha inicial</Label>
                          <p className="text-xs text-muted-foreground">
                            (Opcional) envie senha no payload do backend conforme sua API; aqui apenas guardamos a preferência.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Input id="passwordValue" placeholder="Senha inicial (opcional)" value={passwordValue} onChange={(e) => setPasswordValue(e.target.value)} className="w-56" />
                        <div className="flex items-center gap-2">
                          <Checkbox id="includePassword" checked={includePassword} onCheckedChange={(v) => setIncludePassword(Boolean(v))} />
                          <Label htmlFor="includePassword">Incluir senha</Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>                
              </TabsContent>

              {/* ENDEREÇO */}
              <TabsContent value="endereco" className="h-full overflow-y-auto space-y-6 pr-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Endereço</CardTitle>
                    <CardDescription>Preencha o CEP para atualização automática</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">CEP</Label>
                      <Input id="postalCode" placeholder="00000-000" value={form.address?.postalCode || ""} onChange={(e) => updateAddress("postalCode", e.target.value)} />
                      {cepLoading ? <span className="text-xs text-muted-foreground">Consultando CEP...</span> : null}
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="street">Rua</Label>
                      <Input id="street" value={form.address?.street || ""} onChange={(e) => updateAddress("street", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="number">Número</Label>
                      <Input id="number" value={form.address?.number || ""} onChange={(e) => updateAddress("number", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="complement">Complemento</Label>
                      <Input id="complement" value={form.address?.complement || ""} onChange={(e) => updateAddress("complement", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input id="neighborhood" value={form.address?.neighborhood || ""} onChange={(e) => updateAddress("neighborhood", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">Cidade</Label>
                      <Input id="city" value={form.address?.city || ""} onChange={(e) => updateAddress("city", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input id="state" value={form.address?.state || ""} onChange={(e) => updateAddress("state", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">País</Label>
                      <Input id="country" value={form.address?.country || ""} onChange={(e) => updateAddress("country", e.target.value)} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* ORGANIZAÇÃO */}
              <TabsContent value="org" className="h-full overflow-y-auto space-y-6 pr-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Organização</CardTitle>
                    <CardDescription>Selecione os itens abaixo</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Departamento</Label>
                      <Select
                        value={form.departmentId || ""}
                        onValueChange={(v) => update("departmentId", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={orgLoading ? "Carregando..." : "Selecione um departamento"} />
                        </SelectTrigger>
                        <SelectContent>
                          {org.departments.map((d) => (
                            <SelectItem key={d.id} value={d.id}>
                              {d.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Funções</Label>
                      <Select
                        onValueChange={(v) => update("functionIds", Array.from(new Set([...(form.functionIds || []), v])))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={orgLoading ? "Carregando..." : "Selecione uma função"} />
                        </SelectTrigger>
                        <SelectContent>
                          {org.functions.map((f) => (
                            <SelectItem key={f.id} value={f.id}>
                              {f.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {!!form.functionIds?.length && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {form.functionIds.map((id) => {
                            const item = org.functions.find((x) => x.id === id)
                            return (
                              <Badge key={id} variant="secondary" className="gap-1">
                                {item?.name || id}
                                <button
                                  type="button"
                                  onClick={() => update("functionIds", (form.functionIds || []).filter((x) => x !== id))}
                                  aria-label={`Remover ${id}`}
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </Badge>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="positionId">Cargo (opcional)</Label>
                      <Select value={form.positionId ?? ""} onValueChange={(v) => update("positionId", v)}>
                        <SelectTrigger id="positionId">
                          <SelectValue placeholder={orgLoading ? "Carregando..." : "Selecione um cargo"} />
                        </SelectTrigger>
                        <SelectContent>
                          {org.positions.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="statusId">Status (opcional)</Label>
                      <Select value={form.statusId ?? ""} onValueChange={(v) => update("statusId", v)}>
                        <SelectTrigger id="statusId">
                          <SelectValue placeholder={orgLoading ? "Carregando..." : "Selecione um status"} />
                        </SelectTrigger>
                        <SelectContent>
                          {org.statuses.map((s) => (
                            <SelectItem key={s.id} value={s.id}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {org.managers.length > 0 && (
                      <div className="space-y-2">
                        <Label htmlFor="managerIdSelect">Gestor</Label>
                        <Select value={form.managerId || ""} onValueChange={(v) => update("managerId", v)}>
                          <SelectTrigger id="managerIdSelect">
                            <SelectValue placeholder="Selecione um gestor" />
                          </SelectTrigger>
                          <SelectContent>
                            {org.managers.map((m) => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* PERMISSÕES/ROLES */}
              <TabsContent value="permissions" className="h-full overflow-y-auto space-y-6 pr-1">
                {/* ROLES */}
                <Card>
                  <CardHeader>
                    <CardTitle>Papéis (Roles)</CardTitle>
                    <CardDescription>Escolha um ou mais papéis para o usuário</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {rolesPermissionsLoading ? (
                      <div className="flex items-center justify-center p-8">
                        <LoadingSpinner className="mr-2" />
                        <span>Carregando papéis...</span>
                      </div>
                    ) : roles.length ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {roles.map((role: RoleItem) => {
                          const isSelected = selectedRoles.includes(role.id)
                          return (
                            <div
                              key={role.id}
                              className={`relative p-3 border rounded-lg cursor-pointer transition-all ${
                                isSelected
                                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                  : "border-border hover:border-primary/50 hover:bg-accent/50"
                              }`}
                              onClick={() => toggleRole(role.id)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && toggleRole(role.id)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm truncate">{role.name}</h4>
                                  {role.description && (
                                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{role.description}</p>
                                  )}
                                </div>
                                {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0 ml-2" />}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Nenhum papel disponível.</p>
                    )}
                  </CardContent>
                </Card>

                {/* PERMISSÕES GRANULARES */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Permissões (agrupadas por nome:tipo)
                    </CardTitle>
                    <CardDescription>
                      Cada permissão segue o padrão <code>nome:tipo</code>. Clique para selecionar.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {Object.keys(groupedByResourceAndName).length === 0 ? (
                      <p className="text-sm text-muted-foreground">Nenhuma permissão encontrada.</p>
                    ) : (
                      <div className="space-y-10">
                        {Object.entries(groupedByResourceAndName).map(([resource, groups]) => (
                          <div key={resource}>
                            <div className="flex items-center gap-2 mb-3">
                              <h3 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
                                {resource}
                              </h3>
                              <Separator className="flex-1" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                              {Object.entries(groups).map(([nome, perms]) => {
                                const allSelected = perms.every((p) => selectedPermissions.includes(p.id))
                                const someSelected = !allSelected && perms.some((p) => selectedPermissions.includes(p.id))

                                const toggleAllInGroup = () => {
                                  const ids = perms.map((p) => p.id)
                                  if (allSelected) {
                                    setSelectedPermissions((prev) => prev.filter((id) => !ids.includes(id)))
                                  } else {
                                    setSelectedPermissions((prev) => Array.from(new Set([...prev, ...ids])))
                                  }
                                }

                                return (
                                  <div
                                    key={nome}
                                    className={`relative p-3 border rounded-lg transition-all ${
                                      allSelected
                                        ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                        : someSelected
                                        ? "border-primary/60 bg-primary/5"
                                        : "border-border hover:border-primary/50 hover:bg-accent/50"
                                    }`}
                                  >
                                    <div className="flex items-start justify-between mb-2">
                                      <h4 className="font-medium text-sm truncate">{nome}</h4>
                                      <Button
                                        type="button"
                                        variant={allSelected ? "secondary" : "outline"}
                                        size="xs"
                                        onClick={toggleAllInGroup}
                                        className="ml-2"
                                        title={allSelected ? "Desmarcar todas" : "Selecionar todas"}
                                      >
                                        {allSelected ? "Desmarcar" : "Selecionar"}
                                      </Button>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                      {perms.map((p) => {
                                        const raw = p.name || ""
                                        const idx = raw.indexOf(":")
                                        const tipo = idx > -1 ? raw.slice(idx + 1) : (p.action || "ver")
                                        const isSelected = selectedPermissions.includes(p.id)
                                        return (
                                          <button
                                            key={p.id}
                                            type="button"
                                            onClick={() => togglePermission(p.id)}
                                            className={`px-2 py-1 rounded border text-xs transition-colors ${
                                              isSelected
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border hover:border-primary/50"
                                            }`}
                                            title={p.description || raw}
                                          >
                                            {tipo}
                                          </button>
                                        )
                                      })}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {selectedPermissions.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-4">
                        Selecionadas: <strong>{selectedPermissions.length}</strong>
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* FOOTER fixo */}
        <div className="flex items-center justify-end gap-2 border-t p-4 shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit || loading}>
            {loading ? <LoadingSpinner className="mr-2" /> : null}
            Criar Usuário
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

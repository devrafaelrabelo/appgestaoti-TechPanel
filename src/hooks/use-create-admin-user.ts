"use client"

import { useState } from "react"
import { ApiEndpoints } from "@/lib/api-endpoints"
import fetchWithValidation from "@/features/auth/services/fetch-with-validation"
import type {
  AdminUserCreate,
  CpfSearchRequest,
  CpfConsultResponse,
  CreateUserResponse,
  AddressInput,
} from "@/types/admin-user-create"

interface CepResponse {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

export interface OrgOption {
  id: string
  name: string
}

export interface OrgLookups {
  departments: OrgOption[]
  functions: OrgOption[]
  positions: OrgOption[]
  statuses: OrgOption[]
  managers: OrgOption[]
}

export interface CreateAdminUserPayload {
  // Identificação pessoal
  firstName: string;
  lastName: string;
  fullName?: string | null;       // opcional, pode ser derivado de first/last
  socialName?: string | null;     // opcional

  // Credenciais de login / contato
  username: string;
  email: string;

  // Documentos / nascimento
  cpf?: string | null;            // só envie se houver (apenas dígitos)
  birthDate?: string | null;      // YYYY-MM-DD
  origin?: string;          // origem do usuário (ex: "admin-panel")
  // Organização
  managerId?: string | "";          // id do gestor (ou string vazia se não usar)
  roleIds?: string[];               // papéis
  departmentId?: string;         // departamentos
  groupIds?: string[];              // grupos
  functionIds?: string[];           // funções
  positionId?: string | null;       // cargo (opcional)
  statusId?: string | null;         // status (opcional)

  // Telefones pessoais
  personalPhoneNumbers?: string[]; // somente dígitos, sem máscara

  // Endereço
  address?: AddressInput;

  // Extras opcionais úteis
  password?: string;              // caso queira enviar senha inicial
  permissionIds?: string[];         // se enviar permissões granulares junto
}

const makeEmptyOption = (label = "Dados não encontrados"): OrgOption => ({
  id: "__empty__",
  name: label,
})

const mapToOptions = (arr: any[] | undefined | null): OrgOption[] => {
  const base = (arr ?? []).map((x) => ({
    id: String(x?.id ?? x?.uuid ?? x?.value ?? x?.key ?? x?._id ?? ""),
    name: String(
      x?.name ??
        x?.title ??
        x?.label ??
        x?.descricao ??
        x?.description ??
        x?.nome ??
        x?.displayName ??
        ""
    ),
  }))
  return base.length ? base : [makeEmptyOption()]
}

export function useCreateAdminUser() {
  const [loading, setLoading] = useState(false)
  const [cpfLoading, setCpfLoading] = useState(false)
  const [cepLoading, setCepLoading] = useState(false)
  const [orgLoading, setOrgLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orgError, setOrgError] = useState<string | null>(null)

  // Consulta CPF: envia cpf + birthDate em JSON
  const consultCpf = async (cpf: string, birthDate: string): Promise<CpfConsultResponse> => {
    setCpfLoading(true)
    setError(null)
    try {
      const payload: CpfSearchRequest = { cpf: cpf.replace(/\D/g, ""), birthDate }
      const res = await fetchWithValidation(ApiEndpoints.selenium.consultarcpf, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson?.message || `Erro ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()
      const response: CpfConsultResponse = {
        valid: Boolean(data?.valid ?? data?.success),
        name: data?.name || data?.nome || data?.data?.nome,
        data: data?.data || {
          nome: data?.nome,
          cpf: data?.cpf,
          dataNascimento: data?.dataNascimento,
          endereco: data?.endereco,
        },
        error: data?.error || undefined,
      }
      return response
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao consultar CPF"
      setError(msg)
      return { valid: false, error: msg }
    } finally {
      setCpfLoading(false)
    }
  }

  // Consulta CEP: ViaCEP
  const consultCep = async (cep: string): Promise<CepResponse | null> => {
    setCepLoading(true)
    setError(null)
    try {
      const clean = cep.replace(/\D/g, "")
      if (clean.length !== 8) throw new Error("CEP deve ter 8 dígitos")
      const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
      if (!res.ok) throw new Error(`Erro ${res.status}: ${res.statusText}`)
      const data: CepResponse = await res.json()
      if ((data as any)?.erro) throw new Error("CEP não encontrado")
      return data
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao consultar CEP"
      setError(msg)
      return null
    } finally {
      setCepLoading(false)
    }
  }

  // 🔎 Busca metadados de organização com fallback amigável
  const fetchOrgLookups = async (): Promise<OrgLookups> => {
    setOrgLoading(true)
    setOrgError(null)
    try {
      const urls = {
        departments: ApiEndpoints.backend.adminDepartmentList,
        functions: ApiEndpoints.backend.adminFunctionList,
        positions: ApiEndpoints.backend.adminPositionList,
        statuses: ApiEndpoints.backend.adminUserStatusList,
        managers: ApiEndpoints.backend.adminUsersFunctionsList + "?functionName=supervisor",
      }

      const [depRes, funRes, posRes, staRes, manRes] = await Promise.all([
        fetchWithValidation(urls.departments, { method: "GET", headers: { Accept: "application/json" } }),
        fetchWithValidation(urls.functions, { method: "GET", headers: { Accept: "application/json" } }),
        fetchWithValidation(urls.positions, { method: "GET", headers: { Accept: "application/json" } }),
        fetchWithValidation(urls.statuses, { method: "GET", headers: { Accept: "application/json" } }),
        fetchWithValidation(urls.managers, { method: "GET", headers: { Accept: "application/json" } }),
      ])

      const [depJson, funJson, posJson, staJson, manJson] = await Promise.all([
        depRes.json(),
        funRes.json(),
        posRes.json(),
        staRes.json(),
        manRes.json(),
      ])

      return {
        departments: mapToOptions(depJson?.items ?? depJson),
        functions: mapToOptions(funJson?.items ?? funJson),
        positions: mapToOptions(posJson?.items ?? posJson),
        statuses: mapToOptions(staJson?.items ?? staJson),
        managers: mapToOptions(manJson?.items ?? manJson),
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao carregar metadados de organização"
      setOrgError(msg)
      // retorna placeholder em todas as listas
      const empty = [makeEmptyOption()]
      return {
        departments: empty,
        functions: empty,
        positions: empty,
        statuses: empty,
        managers: empty,
      }
    } finally {
      setOrgLoading(false)
    }
  }

  // Criação do usuário (sem avatar no payload)
  const createUser = async (userData: AdminUserCreate): Promise<CreateUserResponse> => {
    setLoading(true)
    setError(null)
    try {
      const { avatar: _ignoreAvatar, ...rest } = userData as any
      const payload = {
        ...rest,
        cpf: rest.cpf ? String(rest.cpf).replace(/\D/g, "") : undefined,
        phone: rest.phone ? String(rest.phone).replace(/\D/g, "") : undefined,
      }

      const res = await fetchWithValidation(ApiEndpoints.backend.adminUsersCreate, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson?.message || errJson?.error || `Erro ${res.status}: ${res.statusText}`)
      }

      const data = await res.json()
      return {
        success: true,
        user: {
          id: data?.id || data?.userId,
          username: data?.username || userData.username,
          fullName: data?.fullName || userData.fullName,
          email: data?.email || userData.email,
          temporaryPassword: data?.temporaryPassword,
        },
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao criar usuário"
      setError(msg)
      return { success: false, error: msg }
    } finally {
      setLoading(false)
    }
  }

  return {
    // actions
    createUser,
    consultCpf,
    consultCep,
    fetchOrgLookups,

    // states
    loading,
    cpfLoading,
    cepLoading,
    orgLoading,

    // errors
    error,
    orgError,
    setError,
    setOrgError,
  }
}

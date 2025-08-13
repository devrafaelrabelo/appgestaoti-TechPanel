"use client"

import { useState, useEffect, useCallback } from "react"
import type {
  EmployeeTerminationRequest,
  CreateTerminationRequest,
  HRApprovalData,
  ITExecutionData,
} from "@/types/employee-termination"

// Mock data para desenvolvimento
const mockTerminations: EmployeeTerminationRequest[] = [
  {
    id: "1",
    employeeId: "EMP001",
    employeeName: "João Silva Santos",
    employeeCpf: "123.456.789-00",
    employeeEmail: "joao.silva@empresa.com",
    department: "Vendas",
    position: "Vendedor Sênior",
    admissionDate: "2020-03-15",
    requestedBy: "USER001",
    requestedByName: "Maria Comercial",
    requestedAt: "2024-01-15T10:30:00Z",
    terminationDate: "2024-01-30",
    terminationReason: "DISMISSAL",
    terminationReasonDescription: "Não atingimento de metas por 3 meses consecutivos",
    commercialNotes:
      "Funcionário apresentou queda significativa no desempenho. Foram oferecidas oportunidades de melhoria sem sucesso.",
    hrApprovedBy: "USER002",
    hrApprovedByName: "Ana RH",
    hrApprovedAt: "2024-01-16T14:20:00Z",
    hrNotes: "Documentação em ordem. Processo pode prosseguir.",
    status: "APPROVED",
    priority: "MEDIUM",
    hasSystemAccess: true,
    systemAccounts: ["Active Directory", "CRM Vendas", "Email Corporativo"],
    hasPhysicalAssets: true,
    physicalAssets: ["Notebook Dell", "Celular Corporativo", "Crachá"],
    createdAt: "2024-01-15T10:30:00Z",
    updatedAt: "2024-01-16T14:20:00Z",
  },
  {
    id: "2",
    employeeId: "EMP002",
    employeeName: "Pedro Oliveira Costa",
    employeeCpf: "987.654.321-00",
    employeeEmail: "pedro.oliveira@empresa.com",
    department: "Marketing",
    position: "Analista de Marketing",
    admissionDate: "2021-07-10",
    requestedBy: "USER003",
    requestedByName: "Carlos Comercial",
    requestedAt: "2024-01-20T09:15:00Z",
    terminationDate: "2024-02-05",
    terminationReason: "RESIGNATION",
    terminationReasonDescription: "Pedido de demissão para nova oportunidade",
    commercialNotes: "Funcionário solicitou demissão para aceitar proposta em outra empresa.",
    status: "PENDING",
    priority: "LOW",
    hasSystemAccess: true,
    systemAccounts: ["Active Directory", "Adobe Creative Suite", "Email Corporativo"],
    hasPhysicalAssets: false,
    physicalAssets: [],
    createdAt: "2024-01-20T09:15:00Z",
    updatedAt: "2024-01-20T09:15:00Z",
  },
  {
    id: "3",
    employeeId: "EMP003",
    employeeName: "Ana Paula Ferreira",
    employeeCpf: "456.789.123-00",
    employeeEmail: "ana.ferreira@empresa.com",
    department: "Financeiro",
    position: "Coordenadora Financeira",
    admissionDate: "2019-01-20",
    requestedBy: "USER001",
    requestedByName: "Maria Comercial",
    requestedAt: "2024-01-10T16:45:00Z",
    terminationDate: "2024-01-25",
    terminationReason: "DISMISSAL",
    terminationReasonDescription: "Reestruturação do departamento",
    commercialNotes: "Devido à reestruturação, a posição será extinta.",
    hrApprovedBy: "USER002",
    hrApprovedByName: "Ana RH",
    hrApprovedAt: "2024-01-12T11:30:00Z",
    hrNotes: "Aprovado. Verificar questões trabalhistas específicas.",
    itExecutedBy: "USER004",
    itExecutedByName: "Roberto TI",
    itExecutedAt: "2024-01-25T08:00:00Z",
    itNotes: "Contas desativadas e equipamentos recolhidos conforme procedimento.",
    status: "COMPLETED",
    priority: "HIGH",
    hasSystemAccess: true,
    systemAccounts: ["Active Directory", "Sistema Financeiro", "Email Corporativo"],
    hasPhysicalAssets: true,
    physicalAssets: ["Notebook HP", "Monitor Adicional"],
    createdAt: "2024-01-10T16:45:00Z",
    updatedAt: "2024-01-25T08:00:00Z",
  },
]

export function useEmployeeTerminations() {
  const [terminations, setTerminations] = useState<EmployeeTerminationRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Simular carregamento inicial
  useEffect(() => {
    const loadTerminations = async () => {
      try {
        setIsLoading(true)
        // Simular delay da API
        await new Promise((resolve) => setTimeout(resolve, 1000))
        setTerminations(mockTerminations)
        setError(null)
      } catch (err) {
        setError("Erro ao carregar solicitações de desligamento")
      } finally {
        setIsLoading(false)
      }
    }

    loadTerminations()
  }, [])

  const createTermination = useCallback(async (data: CreateTerminationRequest): Promise<EmployeeTerminationRequest> => {
    try {
      setIsLoading(true)

      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newTermination: EmployeeTerminationRequest = {
        id: `TERM_${Date.now()}`,
        ...data,
        requestedBy: "current_user_id",
        requestedByName: "Usuário Atual",
        requestedAt: new Date().toISOString(),
        status: "PENDING",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setTerminations((prev) => [newTermination, ...prev])
      return newTermination
    } catch (err) {
      throw new Error("Erro ao criar solicitação de desligamento")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const approveTermination = useCallback(async (id: string, approvalData: HRApprovalData): Promise<void> => {
    try {
      setIsLoading(true)

      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTerminations((prev) =>
        prev.map((termination) =>
          termination.id === id
            ? {
                ...termination,
                status: approvalData.approved ? "APPROVED" : "REJECTED",
                hrApprovedBy: "current_hr_user_id",
                hrApprovedByName: "Usuário RH Atual",
                hrApprovedAt: new Date().toISOString(),
                hrNotes: approvalData.hrNotes,
                updatedAt: new Date().toISOString(),
              }
            : termination,
        ),
      )
    } catch (err) {
      throw new Error("Erro ao processar aprovação")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const executeTermination = useCallback(async (id: string, executionData: ITExecutionData): Promise<void> => {
    try {
      setIsLoading(true)

      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setTerminations((prev) =>
        prev.map((termination) =>
          termination.id === id
            ? {
                ...termination,
                status: "COMPLETED",
                itExecutedBy: "current_it_user_id",
                itExecutedByName: "Usuário TI Atual",
                itExecutedAt: new Date().toISOString(),
                itNotes: executionData.itNotes,
                updatedAt: new Date().toISOString(),
              }
            : termination,
        ),
      )
    } catch (err) {
      throw new Error("Erro ao executar desligamento")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const cancelTermination = useCallback(async (id: string, reason: string): Promise<void> => {
    try {
      setIsLoading(true)

      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 800))

      setTerminations((prev) =>
        prev.map((termination) =>
          termination.id === id
            ? {
                ...termination,
                status: "CANCELLED",
                updatedAt: new Date().toISOString(),
              }
            : termination,
        ),
      )
    } catch (err) {
      throw new Error("Erro ao cancelar solicitação")
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getTerminationById = useCallback(
    (id: string): EmployeeTerminationRequest | undefined => {
      return terminations.find((termination) => termination.id === id)
    },
    [terminations],
  )

  const refetch = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      // Simular delay da API
      await new Promise((resolve) => setTimeout(resolve, 800))
      setTerminations([...mockTerminations])
    } catch (err) {
      setError("Erro ao recarregar dados")
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    terminations,
    isLoading,
    error,
    createTermination,
    approveTermination,
    executeTermination,
    cancelTermination,
    getTerminationById,
    refetch,
  }
}

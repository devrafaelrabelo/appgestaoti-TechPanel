// src/types/user-request.ts

// Tipos para os dados do formulário no frontend
export interface UserFormData {
  nome: string
  cpf: string
  dt_nascimento: string
  telefone: string
  supervisor: string // Pode ser ID ou nome, dependendo da implementação
  lider: string // Pode ser ID ou nome, dependendo da implementação
  endereco: {
    cep: string
    logradouro: string
    numero: string
    complemento: string
    bairro: string
    cidade: string
    estado: string
  }
}

// Tipos para o payload enviado à API de criação de solicitação
export interface CreateUserRequestPayload {
  cpf: string
  birthDate: string // Formato AAAA-MM-DD
  fullName: string
  phone: string // Somente números
  supervisorId: string | null // ID do supervisor
  leaderId: string | null // ID do líder
  cep: string // Somente números
  street: string
  number: string
  complement: string | null
  neighborhood: string
  city: string
  state: string
}

// Tipo para os dados recebidos da API ao listar solicitações
export interface ApiListedUserRequest {
  id: string
  firstName: string
  lastName: string
  cpf: string
  status: string // Ex: "PENDING", "CREATED", "REJECTED", "COMPLETED", "CANCELED"
  requestedAt: string // Data e hora da solicitação (ISO string)
}

// Tipo para os dados recebidos da API ao buscar detalhes de uma solicitação
export interface ApiDetailedUserRequest {
  id: string
  cpf: string
  fullName: string
  birthDate: string // Formato AAAA-MM-DD
  phone: string
  supervisorId: string | null
  leaderId: string | null
  cep: string
  street: string
  neighborhood: string
  number: string
  complement: string | null
  city: string  
  state: string
  status: string // Adicionado para consistência com o modal
  requestedAt: string // Adicionado para consistência com o modal
  requestedName: string // Nome da solicitação, se aplicável
  createdBy: string // Nome do usuário que criou a solicitação
  createdAt: string // Data e hora de criação da solicitação (ISO string)
}

// Tipo para os dados de solicitação mapeados para exibição na tabela
export interface MappedUserRequest {
  id: string
  fullName: string
  cpf: string
  status: "PENDING" | "CREATED" | "REJECTED" | "COMPLETED" | "CANCELED" // Status mapeado para um enum de strings literais
  requestDate: string // Data e hora da solicitação (ISO string)
  // originalData não é mais necessário aqui, pois os detalhes serão buscados separadamente
}

// Tipos para filtros
export interface UserRequestFilters {
  status: string
  searchTerm: string
  dateFrom: string
  dateTo: string
}

// Tipo para payload de exclusão em lote
export interface BatchDeletePayload {
  requestIds: string[]
}

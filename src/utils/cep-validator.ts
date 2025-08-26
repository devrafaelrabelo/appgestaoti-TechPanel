export interface CEPData {
  cep: string
  logradouro: string
  complemento: string
  bairro: string
  localidade: string
  uf: string
  ibge: string
  gia: string
  ddd: string
  siafi: string
}

export interface AddressData {
  street: string
  neighborhood: string
  city: string
  state: string
  country: string
  postalCode: string
}

/**
 * Valida o formato do CEP
 */
export function isValidCEPFormat(cep: string): boolean {
  if (!cep) return false

  // Remove caracteres não numéricos
  const cleanCEP = cep.replace(/\D/g, "")

  // Verifica se tem 8 dígitos
  if (cleanCEP.length !== 8) return false

  // Verifica se não são todos zeros
  if (cleanCEP === "00000000") return false

  return true
}

/**
 * Formata o CEP com máscara
 */
export function formatCEP(cep: string): string {
  if (!cep) return ""

  const cleanCEP = cep.replace(/\D/g, "")

  if (cleanCEP.length <= 5) {
    return cleanCEP
  }

  return `${cleanCEP.slice(0, 5)}-${cleanCEP.slice(5, 8)}`
}

/**
 * Remove a formatação do CEP
 */
export function cleanCEP(cep: string): string {
  return cep.replace(/\D/g, "")
}

/**
 * Consulta o CEP na API ViaCEP
 */
export async function lookupCEP(cep: string): Promise<AddressData | null> {
  try {
    if (!isValidCEPFormat(cep)) {
      throw new Error("CEP inválido")
    }

    const cleanedCEP = cleanCEP(cep)

    // Usar fetch nativo para API externa (ViaCEP)
    const response = await fetch(`https://viacep.com.br/ws/${cleanedCEP}/json/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Erro ao consultar CEP")
    }

    const data: CEPData = await response.json()

    // Verificar se o CEP foi encontrado
    if (data.erro) {
      throw new Error("CEP não encontrado")
    }

    // Converter para o formato esperado
    const addressData: AddressData = {
      street: data.logradouro || "",
      neighborhood: data.bairro || "",
      city: data.localidade || "",
      state: data.uf || "",
      country: "Brasil",
      postalCode: formatCEP(data.cep) || "",
    }

    return addressData
  } catch (error) {
    console.error("Erro ao consultar CEP:", error)
    throw error
  }
}

/**
 * Valida se o CEP existe (faz consulta na API)
 */
export async function validateCEPExists(cep: string): Promise<boolean> {
  try {
    const result = await lookupCEP(cep)
    return result !== null
  } catch {
    return false
  }
}

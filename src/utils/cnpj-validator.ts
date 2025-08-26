export function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, "")

  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) {
    return false
  }

  // Verifica se todos os dígitos são iguais (CNPJ inválido)
  if (/^(\d)\1+$/.test(cleanCNPJ)) {
    return false
  }

  // Calcula o primeiro dígito verificador
  let sum = 0
  let weight = 5

  for (let i = 0; i < 12; i++) {
    sum += Number.parseInt(cleanCNPJ[i]) * weight
    weight = weight === 2 ? 9 : weight - 1
  }

  let remainder = sum % 11
  const firstDigit = remainder < 2 ? 0 : 11 - remainder

  // Verifica o primeiro dígito
  if (Number.parseInt(cleanCNPJ[12]) !== firstDigit) {
    return false
  }

  // Calcula o segundo dígito verificador
  sum = 0
  weight = 6

  for (let i = 0; i < 13; i++) {
    sum += Number.parseInt(cleanCNPJ[i]) * weight
    weight = weight === 2 ? 9 : weight - 1
  }

  remainder = sum % 11
  const secondDigit = remainder < 2 ? 0 : 11 - remainder

  // Verifica o segundo dígito
  return Number.parseInt(cleanCNPJ[13]) === secondDigit
}

export function formatCNPJ(value: string): string {
  const cleanValue = value.replace(/\D/g, "")
  return cleanValue
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18)
}

export function getCNPJValidationMessage(cnpj: string): string | null {
  const cleanCNPJ = cnpj.replace(/\D/g, "")

  if (!cleanCNPJ) {
    return "CNPJ é obrigatório"
  }

  if (cleanCNPJ.length < 14) {
    return "CNPJ deve ter 14 dígitos"
  }

  if (!validateCNPJ(cnpj)) {
    return "CNPJ inválido"
  }

  return null
}

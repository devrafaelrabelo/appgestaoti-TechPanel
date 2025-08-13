import { ApiEndpoints } from "@/lib/api-endpoints"


async function fetchWithValidation(input: RequestInfo, init?: RequestInit): Promise<Response> {
  const response = await fetch(input, {
    ...init,
    credentials: "include",
  })

  if (response.status === 401 || response.status === 403) {
    // Tenta validar sessão
    const validate = await fetch(`${ApiEndpoints.backend.validateToken}`, { method: "GET", credentials: "include" })
    if (validate.ok) {
      // Se a sessão ainda estiver válida (renovada), tenta novamente
      return fetch(input, {
        ...init,
        credentials: "include",
      })
    }

    // Caso contrário, redireciona
    window.location.href = "/login"
    throw new Error("Sessão expirada. Redirecionando para login...")
  }

  return response
}

export default fetchWithValidation
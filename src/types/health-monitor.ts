export interface ServiceHealth {
  status: "ok" | "error" | "skipped" | "degraded" | "no proxy path configured"
  http_status?: number
  response?: string
  url?: string
  reason?: string
  data?: any
}

export interface Container {
  name: string
  image: string
  status: string
  running: boolean
  uptime: string
  service_health: ServiceHealth
}

export interface HealthSummary {
  total: number
  online: number
  offline: number
  with_http_ok: number
  with_http_error: number
}

export interface HealthMonitorResponse {
  last_updated: string
  summary: HealthSummary
  containers: Container[]
}

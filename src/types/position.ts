export interface Position {
  id: string
  name: string
  description: string
}

export interface CreatePositionPayload {
  name: string
  description: string
}

export interface UpdatePositionPayload {
  name: string
  description: string
}

export interface PositionFilters {
  search?: string
}

export interface PositionStats {
  total: number
}

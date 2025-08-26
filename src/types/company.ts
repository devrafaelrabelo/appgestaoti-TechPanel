export interface Company {
  id: string
  name: string
  cnpj: string
  legalName: string
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    country: string
    postalCode: string
  }
  active: boolean
}

export interface CreateCompanyData {
  name: string
  cnpj: string
  legalName: string
  active: boolean
  address: {
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    country: string
    postalCode: string
  }
}

export interface UpdateCompanyData extends Partial<CreateCompanyData> {
  id: string
}

export interface CompanyFilters {
  search?: string
  active?: boolean
  state?: string
  city?: string
}

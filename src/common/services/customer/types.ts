export interface CustomerData {
  id: number
  email: string
  fullName: string
  phone: string
  address: string
  birthday: string
  active: boolean
  createdAt: string
  updatedAt: string
  emailVerifiedAt: string
  code: string
}

export interface CustomerDataRequest {
  email: string
  fullName: string
  password: string
  phone: string
  active: boolean
}

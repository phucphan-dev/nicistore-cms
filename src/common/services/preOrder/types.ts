export interface PreOrderItemData {
  id: number
  code: string
  fullname: string
  phone: string
  email: string
  price: number
  deposit: number
  guestNote: string
  adminNote: string
  status: number
  orderedAt: string
  depositedAt: string
  customerId: number
  createdAt: string
  updatedAt: string
}

export interface PreOrderData {
  id: number
  code: string
  fullname: string
  phone: string
  email: string
  productImages: string[]
  depositImage?: string
  price?: number
  deposit?: number
  guestNote?: string
  adminNote?: string
  status: number
  orderedAt?: string
  depositedAt?: string
  customerId?: number
  createdAt: string
  updatedAt: string
}

export interface PreOrderDataRequest {
  fullname: string
  phone: string
  email: string
  productImages: string[]
  depositImage?: string
  price?: number
  deposit?: number
  status: number
  adminNote?: string
  guestNote?: string
  orderedAt?: string
  depositedAt?: string
  customerId?: number
}

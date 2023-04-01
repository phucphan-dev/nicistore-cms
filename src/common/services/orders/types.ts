export interface OrderDataTypes {
  id: number
  city: LocaltionType
  district: LocaltionType
  ward: LocaltionType
  name: string
  phone: string
  email: string
  address: string
  code: string
  status: number
  note: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
  totalPrice: number
  totalFinalPrice: number
}

export interface LocaltionType {
  id: number
  name: string
}

export interface OrderItem {
  product: OrderProduct
  size: ProductProperties
  color: ProductProperties
  quantity: number
  price: number
  salePercent: number
  finalPrice: number
}

export interface OrderProduct {
  id: number
  thumbnail: string
  name: string
  slug: string
  shortDescription: string
}

export interface ProductProperties {
  id: number
  name: string
  code: string
}

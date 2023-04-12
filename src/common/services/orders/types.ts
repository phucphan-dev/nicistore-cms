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
  code: string
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

export interface OrderRequestItem {
  productId: number
  sizeId: number
  colorId: number
  quantity: number
  code: string;
  thumbnail: string;
}

export interface OrderDataRequest {
  cityId: number
  districtId: number
  wardId: number
  shippingAddressId?: number
  name: string
  phone: string
  email: string
  address: string
  note: string
  status: number;
  items: OrderRequestItem[];
}

export interface OrderCustomer {
  id: number
  email: string
  fullName: string
  phone: string
  active: boolean
}

export interface CustomerShippingAddress {
  id: number
  customerId: number
  city: LocaltionType
  district: LocaltionType
  ward: LocaltionType
  address: string
  phone: string
  name: string
}

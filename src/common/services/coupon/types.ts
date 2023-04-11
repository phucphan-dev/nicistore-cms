export interface CouponData {
  code: string
  startDate: string
  endDate: string
  discountType: string
  discountValue: number
  isActive: boolean
  applyProducts: number[]
  minPriceApply: number
  maxValuePromotion: number
  maxQuantityUsed: number
}

export interface CouponItemData {
  id: number
  code: string
  startDate: string
  endDate: string
  discountType: string
  discountValue: number
  minPriceApply: number
  maxValuePromotion: number
  maxQuantityUsed: number
  isActive: boolean
  applyProducts: {
    id: number
    sku: any
    thumbnail: string
    galleries: {
      id: string
      alt: string
      path: string
      title: any
    }[]
    price: number
    salePrice: number
    stock: number
    displayOrder: number
    status: number
    createdAt: string
    updatedAt: string
    salePercent: number
    totalInit: number
    featured: boolean
    code: string
    priceInit: number
    isBestSeller: boolean
    pivot: {
      couponId: number
      productId: number
    }
  }[]
}

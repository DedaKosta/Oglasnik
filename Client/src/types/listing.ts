// Enums matching backend (using const objects due to erasableSyntaxOnly)
export const ListingType = {
  Selling: 1,
  Buying: 2
} as const

export type ListingType = typeof ListingType[keyof typeof ListingType]

export const ItemCondition = {
  New: 1,
  NotUsed: 2,
  Used: 3,
  Damaged: 4
} as const

export type ItemCondition = typeof ItemCondition[keyof typeof ItemCondition]

export const Currency = {
  EUR: 1,
  USD: 2,
  RSD: 3,
  BAM: 4,
  HRK: 5
} as const

export type Currency = typeof Currency[keyof typeof Currency]

export const ListingStatus = {
  Active: 1,
  Sold: 2,
  Inactive: 3,
  Expired: 4,
  Pending: 5,
  Rejected: 6
} as const

export type ListingStatus = typeof ListingStatus[keyof typeof ListingStatus]

// API Request/Response types
export interface CreateListingRequest {
  caption: string
  description: string
  categoryId: number
  listingType: ListingType
  price: number
  currency: Currency
  isPriceFixed: boolean
  acceptsTrade: boolean
  itemCondition: ItemCondition
  availableImmediately: boolean
  deliveryAvailable: boolean
  inPersonPickup: boolean
  city: string
  contactName: string
}

export interface CreateListingResponse {
  id: number
  caption: string
  message: string
}

// Form data type
export interface ListingFormData {
  caption: string
  description: string
  category: string
  listingType: 'selling' | 'buying'
  price: string
  currency: string
  isPriceFixed: boolean
  acceptsTrade: boolean
  itemCondition: '' | 'new' | 'not-used' | 'used' | 'damaged'
  availableImmediately: boolean
  deliveryAvailable: boolean
  inPersonPickup: boolean
  city: string
  contactName: string
}

import { API_CONFIG } from '../config/api'
import { apiRequest } from '../utils/api'
import type { CreateListingRequest, CreateListingResponse } from '../types/listing'

class ListingService {
  private baseURL: string

  constructor() {
    this.baseURL = API_CONFIG.baseURL
  }

  async createListing(
    request: CreateListingRequest,
    accessToken: string
  ): Promise<CreateListingResponse> {
    return apiRequest(
      async () => {
        const response = await fetch(`${this.baseURL}${API_CONFIG.endpoints.listings}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify(request)
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.message || `Failed to create listing: ${response.statusText}`)
        }

        return response.json()
      },
      {
        showLoading: true,
        showSuccessToast: false, // We'll show success after images upload
        showErrorToast: true,
      }
    )
  }

  async uploadListingImages(
    listingId: number,
    images: File[],
    thumbnailIndex: number,
    accessToken: string
  ): Promise<void> {
    return apiRequest(
      async () => {
        const formData = new FormData()

        images.forEach((image) => {
          formData.append('images', image)
        })

        formData.append('listingId', listingId.toString())
        formData.append('thumbnailIndex', thumbnailIndex.toString())

        const response = await fetch(`${this.baseURL}/api/listings/${listingId}/images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`
          },
          body: formData
        })

        if (!response.ok) {
          throw new Error('Failed to upload images')
        }
      },
      {
        showLoading: true,
        showSuccessToast: true,
        showErrorToast: true,
        successMessage: 'Listing published successfully!',
      }
    )
  }
}

export const listingService = new ListingService()

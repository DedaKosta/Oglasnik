import { API_CONFIG } from '../config/api'
import { apiRequest } from '../utils/api'
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  ErrorResponse,
} from '../types/api'

class AuthService {
  private baseURL: string

  constructor() {
    this.baseURL = API_CONFIG.baseURL
  }

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiRequest(
      async () => {
        const response = await fetch(`${this.baseURL}${API_CONFIG.endpoints.register}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const error: ErrorResponse = await response.json()
          throw new Error(this.formatErrorMessage(error))
        }

        return response.json()
      },
      {
        showLoading: true,
        showSuccessToast: true,
        showErrorToast: true,
        successMessage: 'Account created successfully! Please sign in.',
      }
    )
  }

  async login(data: LoginRequest): Promise<LoginResponse> {
    return apiRequest(
      async () => {
        const response = await fetch(`${this.baseURL}${API_CONFIG.endpoints.login}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })

        if (!response.ok) {
          const error: ErrorResponse = await response.json()
          throw new Error(this.formatErrorMessage(error))
        }

        return response.json()
      },
      {
        showLoading: true,
        showSuccessToast: true,
        showErrorToast: true,
        successMessage: 'Signed in successfully!',
      }
    )
  }

  private formatErrorMessage(error: ErrorResponse): string {
    if (error.errors) {
      // Format validation errors
      const errorMessages = Object.entries(error.errors)
        .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
        .join('; ')
      return errorMessages || error.message
    }
    return error.message
  }
}

export const authService = new AuthService()

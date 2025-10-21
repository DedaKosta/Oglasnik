// Auth Register Types
export interface RegisterRequest {
  username: string
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword?: string
}

export interface RegisterResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
}

// Auth Login Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  accessToken: string
  refreshToken: string
  expiresIn: number
}

// Error Response Type
export interface ErrorResponse {
  statusCode: number
  message: string
  errors?: Record<string, string[]>
}

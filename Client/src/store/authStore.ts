import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService } from '../services/authService'
import type { RegisterRequest } from '../types/api'

export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  accessToken: string | null
  refreshToken: string | null

  // Actions
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: RegisterRequest) => Promise<void>
  signOut: () => void
  clearError: () => void
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      accessToken: null,
      refreshToken: null,

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null })
        try {
          // Note: email parameter can be username - API accepts it in the email field
          const response = await authService.login({ email, password })

          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
          }

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            accessToken: response.accessToken,
            refreshToken: response.refreshToken,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Sign in failed',
            isLoading: false,
          })
          throw error
        }
      },

      signUp: async (data: RegisterRequest) => {
        set({ isLoading: true, error: null })
        try {
          const response = await authService.register(data)

          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
          }

          // Registration successful - user needs to sign in
          set({
            user,
            isAuthenticated: false, // User registered but not logged in
            isLoading: false,
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Sign up failed',
            isLoading: false,
          })
          throw error
        }
      },

      signOut: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null,
          accessToken: null,
          refreshToken: null,
        })
      },

      clearError: () => {
        set({ error: null })
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
)

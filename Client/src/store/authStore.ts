import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  email: string
  name?: string
  avatar?: string
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name?: string) => Promise<void>
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

      signIn: async (email: string, _password: string) => {
        set({ isLoading: true, error: null })
        try {
          // TODO: Replace with actual API call
          // Simulating API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          // Mock user data
          const user: User = {
            id: '1',
            email,
            name: email.split('@')[0],
          }

          set({ user, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Sign in failed',
            isLoading: false
          })
        }
      },

      signUp: async (email: string, _password: string, name?: string) => {
        set({ isLoading: true, error: null })
        try {
          // TODO: Replace with actual API call
          await new Promise((resolve) => setTimeout(resolve, 1000))

          const user: User = {
            id: '1',
            email,
            name: name || email.split('@')[0],
          }

          set({ user, isAuthenticated: true, isLoading: false })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Sign up failed',
            isLoading: false
          })
        }
      },

      signOut: () => {
        set({ user: null, isAuthenticated: false, error: null })
      },

      clearError: () => {
        set({ error: null })
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user })
      },
    }),
    {
      name: 'auth-storage', // name for localStorage key
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }), // only persist user and isAuthenticated
    }
  )
)

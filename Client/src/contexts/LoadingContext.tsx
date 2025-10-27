import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

interface LoadingContextType {
  isLoading: boolean
  activeRequests: number
  startLoading: () => void
  stopLoading: () => void
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined)

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [activeRequests, setActiveRequests] = useState(0)

  const startLoading = useCallback(() => {
    setActiveRequests((prev) => prev + 1)
  }, [])

  const stopLoading = useCallback(() => {
    setActiveRequests((prev) => Math.max(0, prev - 1))
  }, [])

  const isLoading = activeRequests > 0

  return (
    <LoadingContext.Provider value={{ isLoading, activeRequests, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export function useLoading() {
  const context = useContext(LoadingContext)
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider')
  }
  return context
}

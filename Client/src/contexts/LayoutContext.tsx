import { createContext, useContext } from 'react'

export interface LayoutContextType {
  setFilterOpenHandler: (handler: () => void) => void
}

export const LayoutContext = createContext<LayoutContextType | null>(null)

export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    // Return a no-op function if not within Layout context
    return {
      setFilterOpenHandler: () => {}
    }
  }
  return context
}

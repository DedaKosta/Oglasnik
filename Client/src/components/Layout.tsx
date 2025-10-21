import { ReactNode, useState, useMemo, useCallback } from 'react'
import Header from './Header'
import Footer from './Footer'
import { LayoutContext } from '../contexts/LayoutContext'

interface LayoutProps {
  children: ReactNode
  onSearch?: (query: string) => void
}

export default function Layout({ children, onSearch }: LayoutProps) {
  const [filterOpenHandler, setFilterOpenHandler] = useState<(() => void) | null>(null)

  const handleFilterOpen = useCallback(() => {
    if (filterOpenHandler) {
      filterOpenHandler()
    }
  }, [filterOpenHandler])

  const contextValue = useMemo(() => ({
    setFilterOpenHandler: (handler: () => void) => setFilterOpenHandler(() => handler)
  }), [])

  return (
    <LayoutContext.Provider value={contextValue}>
      <div className="min-h-screen flex flex-col">
        <Header onSearch={onSearch} onFilterOpen={handleFilterOpen} />
        <main className="flex-1 flex flex-col">{children}</main>
        <Footer />
      </div>
    </LayoutContext.Provider>
  )
}

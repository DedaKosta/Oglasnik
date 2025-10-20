import { ReactNode } from 'react'
import { useAppStore } from '../store'
import Header from './Header'
import Footer from './Footer'

interface LayoutProps {
  children: ReactNode
  onSearch?: (query: string) => void
  onFilterOpen?: () => void
}

export default function Layout({ children, onSearch, onFilterOpen }: LayoutProps) {
  const { sidebarOpen } = useAppStore()

  return (
    <div
      className={`min-h-screen flex flex-col transition-all duration-300 ${
        sidebarOpen ? 'ml-72' : 'ml-20'
      }`}
    >
      <Header onSearch={onSearch} onFilterOpen={onFilterOpen} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}

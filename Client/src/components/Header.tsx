import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ThemeToggle from './ThemeToggle'
import { useAppStore } from '../store'

interface HeaderProps {
  onSearch?: (query: string) => void
  onFilterOpen?: () => void
}

export default function Header({ onSearch, onFilterOpen }: HeaderProps) {
  const { t } = useTranslation()
  const { sidebarOpen } = useAppStore()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  return (
    <header className={`fixed top-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-all duration-300 ${
      sidebarOpen ? 'left-72' : 'left-20'
    }`}>
      <div className="flex items-center justify-between gap-4 py-3 px-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('home.searchPlaceholder', 'Search for products, services...')}
              className="w-full px-4 py-2 pl-10 pr-20 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm"
            />
            {/* Search Icon */}
            <button
              type="submit"
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label={t('home.search', 'Search')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            {/* Filter Icon */}
            <button
              type="button"
              onClick={onFilterOpen}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              aria-label={t('home.filters.title', 'Filters')}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </form>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

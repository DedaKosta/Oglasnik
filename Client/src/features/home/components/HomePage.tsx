import { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import Header from '../../../shared/components/Layout/Header'
import Footer from '../../../shared/components/Layout/Footer'
import ListingCard, { type Listing } from './ListingCard'
import FilterPopup, { type Filters } from './FilterPopup'

// Placeholder image generator
const getPlaceholderImage = (id: number) =>
  `https://picsum.photos/seed/${id}/400/300`

// Generate placeholder listings
const generateListings = (page: number, perPage: number = 12): Listing[] => {
  const categories = ['Electronics', 'Vehicles', 'Real Estate', 'Fashion', 'Home & Garden', 'Sports']
  const locations = ['Belgrade', 'Novi Sad', 'Niš', 'Kragujevac', 'Subotica', 'Podgorica']
  const titles = [
    'Smartphone', 'Laptop', 'Car', 'Apartment', 'House', 'Bicycle',
    'TV', 'Sofa', 'Shoes', 'Watch', 'Camera', 'Motorcycle'
  ]

  return Array.from({ length: perPage }, (_, i) => {
    const id = page * perPage + i
    return {
      id,
      title: `${titles[id % titles.length]} ${id + 1}`,
      description: `Great quality ${titles[id % titles.length].toLowerCase()} in excellent condition. Perfect for everyday use. Don't miss this opportunity!`,
      price: Math.floor(Math.random() * 10000) + 100,
      image: getPlaceholderImage(id),
      category: categories[id % categories.length],
      location: locations[id % locations.length],
    }
  })
}

export default function HomePage() {
  const { t } = useTranslation()
  const [listings, setListings] = useState<Listing[]>([])
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [_filters, setFilters] = useState<Filters>({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: '',
  })

  const observer = useRef<IntersectionObserver | null>(null)
  const lastListingRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return
      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, hasMore]
  )

  // Load listings
  useEffect(() => {
    const loadListings = () => {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        const newListings = generateListings(page)
        setListings((prev) => [...prev, ...newListings])
        setLoading(false)
        // Stop loading after 5 pages (60 items)
        if (page >= 4) {
          setHasMore(false)
        }
      }, 500)
    }

    loadListings()
  }, [page])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Search:', searchQuery)
    // TODO: Implement search logic
  }

  const handleFilterApply = (newFilters: Filters) => {
    setFilters(newFilters)
    console.log('Filters applied:', newFilters)
    // TODO: Implement filter logic
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <div className="pt-20 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Search Bar */}
          <div className="mb-8">
            <form onSubmit={handleSearch} className="flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t('home.searchPlaceholder')}
                  className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <button
                type="button"
                onClick={() => setIsFilterOpen(true)}
                className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="hidden sm:inline">{t('home.filters.title')}</span>
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {t('home.search')}
              </button>
            </form>
          </div>

          {/* Listings List */}
          <div className="space-y-4">
            {listings.map((listing, index) => {
              if (listings.length === index + 1) {
                return (
                  <div key={listing.id} ref={lastListingRef}>
                    <ListingCard listing={listing} />
                  </div>
                )
              } else {
                return <ListingCard key={listing.id} listing={listing} />
              }
            })}
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          )}

          {/* End of List */}
          {!hasMore && listings.length > 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600 dark:text-gray-400">{t('home.noMoreListings')}</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && listings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">{t('home.noListings')}</p>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {/* Filter Popup */}
      <FilterPopup
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
      />
    </div>
  )
}

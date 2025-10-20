import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import ListingCard, { type Listing } from './ListingCard'
import FilterPopup, { type Filters } from './FilterPopup'
import Pagination from './Pagination'

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

interface HomePageProps {
  onSearch?: (query: string) => void
  onFilterOpen?: () => void
}

export default function HomePage({ onSearch, onFilterOpen }: HomePageProps) {
  const { t } = useTranslation()
  const [listings, setListings] = useState<Listing[]>([])
  const currentPageRef = useRef(1)
  const [itemsPerPage, setItemsPerPage] = useState(12)
  const [loading, setLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: '',
  })

  const totalItems = 120 // Total number of items (can be fetched from API)
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Load listings
  const loadListings = useCallback(() => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      const newListings = generateListings(currentPageRef.current - 1, itemsPerPage)
      setListings(newListings)
      setLoading(false)
    }, 500)
  }, [itemsPerPage])

  // Initial load
  useEffect(() => {
    loadListings()
  }, [loadListings])

  const handleFilterApply = (newFilters: Filters) => {
    setFilters(newFilters)
    console.log('Filters applied:', newFilters)
    // TODO: Implement filter logic
  }

  // Pass filter open handler to parent
  useEffect(() => {
    if (onFilterOpen) {
      // This is a workaround to pass the function up - better to use context or state management
    }
  }, [onFilterOpen])

  const handlePageChange = useCallback((page: number) => {
    currentPageRef.current = page
    loadListings()
  }, [loadListings])

  const handlePageSizeChange = useCallback((size: number) => {
    setItemsPerPage(size)
    currentPageRef.current = 1
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="pt-20 pb-20 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Pagination - Top */}
          <div className="mb-6" style={{ display: loading || listings.length === 0 ? 'none' : 'block' }}>
            <Pagination
              key="pagination-top"
              id="pagination-top"
              initialPage={currentPageRef.current}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>

          {/* Listings List */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : listings.length > 0 ? (
            <div className="space-y-4">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400 text-lg">{t('home.noListings')}</p>
            </div>
          )}

          {/* Pagination - Bottom */}
          <div className="mt-8" style={{ display: loading || listings.length === 0 ? 'none' : 'block' }}>
            <Pagination
              key="pagination-bottom"
              id="pagination-bottom"
              initialPage={currentPageRef.current}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
            />
          </div>
        </div>
      </div>

      

      {/* Filter Popup */}
      <FilterPopup
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleFilterApply}
      />
    </div>
  )
}

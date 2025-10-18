export type Listing = {
  id: number
  title: string
  description: string
  price: number
  image: string
  category: string
  location: string
}

interface ListingCardProps {
  listing: Listing
}

export default function ListingCard({ listing }: ListingCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex">
      {/* Image - Left Side */}
      <div className="relative w-48 h-48 flex-shrink-0 bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content - Right Side */}
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1 flex-1">
              {listing.title}
            </h3>
            <div className="ml-4 bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
              ${listing.price.toLocaleString()}
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {listing.description}
          </p>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            {listing.category}
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {listing.location}
          </span>
        </div>
      </div>
    </div>
  )
}

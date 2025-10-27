import { useLoading } from '../contexts/LoadingContext'

export default function GlobalLoadingSpinner() {
  const { isLoading } = useLoading()

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative">
          <div className="w-16 h-16 border-4 border-gray-200 dark:border-gray-700 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>

        {/* Loading text */}
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">Loading...</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Please wait</p>
        </div>
      </div>
    </div>
  )
}

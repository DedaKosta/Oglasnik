import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface PaginationProps {
  id: string // Unique ID for this instance
  initialPage?: number
  itemsPerPage: number
  totalItems: number
  totalPages: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
}

export default function Pagination({
  id,
  initialPage = 1,
  itemsPerPage: initialItemsPerPage,
  totalItems,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const { t } = useTranslation()
  const containerRef = useRef<HTMLDivElement>(null)
  const currentPageRef = useRef(initialPage)
  const itemsPerPageRef = useRef(initialItemsPerPage)
  const initialized = useRef(false)
  const [isPageSizeOpen, setIsPageSizeOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Update internal refs when props change (for page size changes)
  useEffect(() => {
    if (itemsPerPageRef.current !== initialItemsPerPage) {
      itemsPerPageRef.current = initialItemsPerPage
      updateShowingText()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialItemsPerPage])

  const pageSizeOptions = [6, 12, 24, 48]

  const updateShowingText = () => {
    if (!containerRef.current) return
    const start = (currentPageRef.current - 1) * itemsPerPageRef.current + 1
    const end = Math.min(currentPageRef.current * itemsPerPageRef.current, totalItems)

    const startSpan = containerRef.current.querySelector('[data-start]')
    const endSpan = containerRef.current.querySelector('[data-end]')
    if (startSpan) startSpan.textContent = start.toString()
    if (endSpan) endSpan.textContent = end.toString()
  }

  const updateButtonStates = (page: number) => {
    if (!containerRef.current) return

    // Update page buttons
    const buttons = containerRef.current.querySelectorAll('[data-page]')
    buttons.forEach((button) => {
      const btnPage = parseInt((button as HTMLButtonElement).dataset.page || '0')
      if (btnPage === page) {
        button.classList.add('bg-indigo-600', 'text-white', 'shadow-sm')
        button.classList.remove('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-700')
        button.setAttribute('aria-current', 'page')
      } else {
        button.classList.remove('bg-indigo-600', 'text-white', 'shadow-sm')
        button.classList.add('text-gray-700', 'dark:text-gray-300', 'hover:bg-gray-100', 'dark:hover:bg-gray-700')
        button.removeAttribute('aria-current')
      }
    })

    // Update prev/next buttons
    const prevBtn = containerRef.current.querySelector('[data-nav="prev"]') as HTMLButtonElement
    const nextBtn = containerRef.current.querySelector('[data-nav="next"]') as HTMLButtonElement
    if (prevBtn) prevBtn.disabled = page === 1
    if (nextBtn) nextBtn.disabled = page === totalPages
  }

  const handlePageClick = (page: number) => {
    if (page === currentPageRef.current) return
    currentPageRef.current = page
    updateButtonStates(page)
    updateShowingText()
    onPageChange(page)
  }

  const handlePrevClick = () => {
    if (currentPageRef.current > 1) {
      handlePageClick(currentPageRef.current - 1)
    }
  }

  const handleNextClick = () => {
    if (currentPageRef.current < totalPages) {
      handlePageClick(currentPageRef.current + 1)
    }
  }

  const handlePageSizeChange = (size: number) => {
    itemsPerPageRef.current = size
    currentPageRef.current = 1
    updateButtonStates(1)
    updateShowingText()
    setIsPageSizeOpen(false)
    onPageSizeChange(size)
  }

  // Handle click outside for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPageSizeOpen(false)
      }
    }

    if (isPageSizeOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isPageSizeOpen])

  // Setup event listeners only once
  useEffect(() => {
    if (initialized.current || !containerRef.current) return
    initialized.current = true

    const container = containerRef.current

    // Add event listeners
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const button = target.closest('[data-page]') as HTMLButtonElement
      if (button) {
        const page = parseInt(button.dataset.page || '0')
        if (page) handlePageClick(page)
      }
    }

    const pageButtonsContainer = container.querySelector('[data-pages]')
    if (pageButtonsContainer) {
      pageButtonsContainer.addEventListener('click', handleClick)
    }

    const prevBtn = container.querySelector('[data-nav="prev"]')
    const nextBtn = container.querySelector('[data-nav="next"]')
    if (prevBtn) prevBtn.addEventListener('click', handlePrevClick)
    if (nextBtn) nextBtn.addEventListener('click', handleNextClick)

    // Initial state
    updateButtonStates(currentPageRef.current)
    updateShowingText()

    // Cleanup function to remove event listeners
    return () => {
      if (pageButtonsContainer) {
        pageButtonsContainer.removeEventListener('click', handleClick)
      }
      if (prevBtn) prevBtn.removeEventListener('click', handlePrevClick)
      if (nextBtn) nextBtn.removeEventListener('click', handleNextClick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - only run once

  // Generate page numbers
  const pageNumbers: (number | string)[] = []
  const maxVisible = 7

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
  } else {
    const current = currentPageRef.current
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pageNumbers.push(i)
      pageNumbers.push('...')
      pageNumbers.push(totalPages)
    } else if (current >= totalPages - 3) {
      pageNumbers.push(1)
      pageNumbers.push('...')
      for (let i = totalPages - 4; i <= totalPages; i++) pageNumbers.push(i)
    } else {
      pageNumbers.push(1)
      pageNumbers.push('...')
      pageNumbers.push(current - 1)
      pageNumbers.push(current)
      pageNumbers.push(current + 1)
      pageNumbers.push('...')
      pageNumbers.push(totalPages)
    }
  }

  return (
    <div
      ref={containerRef}
      id={id}
      className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg"
    >
      {/* Page Size Selector */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {t('home.pagination.itemsPerPage', 'Items per page:')}
        </span>

        {/* Custom Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsPageSizeOpen(!isPageSizeOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Select page size"
          >
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {itemsPerPageRef.current}
            </span>
            <svg
              className={`w-3 h-3 text-gray-500 dark:text-gray-400 transition-transform ${isPageSizeOpen ? 'rotate-180' : 'rotate-0'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isPageSizeOpen && (
              <div className="absolute left-0 bottom-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50">
                {pageSizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => handlePageSizeChange(size)}
                    className={`w-full px-4 py-2 text-sm text-left transition-colors ${
                      itemsPerPageRef.current === size
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
          )}
        </div>

        <span className="text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
          {t('home.pagination.showing', 'Showing')}
          {' '}
          <span data-start className="font-semibold text-gray-800 dark:text-gray-200">
            {(initialPage - 1) * initialItemsPerPage + 1}
          </span>
          {' - '}
          <span data-end className="font-semibold text-gray-800 dark:text-gray-200">
            {Math.min(initialPage * initialItemsPerPage, totalItems)}
          </span>
          {' '}
          {t('home.pagination.of', 'of')}
          {' '}
          <span className="font-semibold text-gray-800 dark:text-gray-200">{totalItems}</span>
        </span>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-1">
        <button
          data-nav="prev"
          disabled={initialPage === 1}
          className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent transition-colors"
          aria-label={t('home.pagination.previous', 'Previous page')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div data-pages className="flex items-center gap-1">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span key={`ellipsis-${index}`} className="px-2 py-1 text-gray-400 dark:text-gray-500 select-none">
                  ···
                </span>
              )
            }

            return (
              <button
                key={page}
                data-page={page}
                className={`min-w-[2.5rem] px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                  initialPage === page
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                aria-label={`${t('home.pagination.page', 'Page')} ${page}`}
                aria-current={initialPage === page ? 'page' : undefined}
              >
                {page}
              </button>
            )
          })}
        </div>

        <button
          data-nav="next"
          disabled={initialPage === totalPages}
          className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent transition-colors"
          aria-label={t('home.pagination.next', 'Next page')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

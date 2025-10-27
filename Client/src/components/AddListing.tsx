import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store'
import { useNavigate } from 'react-router-dom'
import { listingService } from '../services/listingService'
import { ListingType, ItemCondition, Currency, type CreateListingRequest } from '../types/listing'

interface ImagePreview {
  file: File
  preview: string
  id: string
}

export default function AddListing() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user, isAuthenticated, accessToken } = useAuthStore()

  const [formData, setFormData] = useState({
    // Basic Info
    caption: '',
    description: '',
    category: '',

    // Listing Type & Price
    listingType: 'selling' as 'selling' | 'buying',
    price: '',
    currency: 'EUR',
    isPriceFixed: true,
    acceptsTrade: false,

    // Item Condition
    itemCondition: '' as '' | 'new' | 'used' | 'damaged' | 'not-used',

    // Availability
    availableImmediately: true,

    // Delivery Options
    deliveryAvailable: false,
    inPersonPickup: true,

    // Location & Contact
    city: '',
    contactName: '',
  })

  const [images, setImages] = useState<ImagePreview[]>([])
  const [thumbnailIndex, setThumbnailIndex] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/signin')
      return
    }

    // Pre-fill contact name with user's name
    setFormData(prev => ({
      ...prev,
      contactName: `${user.firstName} ${user.lastName}`.trim()
    }))
  }, [user, isAuthenticated, navigate])

  // Cleanup image previews on unmount
  useEffect(() => {
    return () => {
      images.forEach(img => URL.revokeObjectURL(img.preview))
    }
  }, [images])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages = Array.from(files).slice(0, 10 - images.length)

    if (images.length + newImages.length > 10) {
      setErrors({ ...errors, images: t('addListing.maxImagesError', 'Maximum 10 images allowed') })
      return
    }

    const newPreviews: ImagePreview[] = newImages.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      id: Math.random().toString(36).substr(2, 9)
    }))

    setImages(prev => [...prev, ...newPreviews])
    setErrors({ ...errors, images: '' })
  }

  const removeImage = (id: string) => {
    const imageIndex = images.findIndex(img => img.id === id)
    const image = images.find(img => img.id === id)

    if (image) {
      URL.revokeObjectURL(image.preview)
    }

    setImages(prev => prev.filter(img => img.id !== id))

    // Adjust thumbnail index if needed
    if (thumbnailIndex === imageIndex) {
      setThumbnailIndex(0)
    } else if (thumbnailIndex > imageIndex) {
      setThumbnailIndex(thumbnailIndex - 1)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.caption.trim()) {
      newErrors.caption = t('addListing.errors.captionRequired', 'Caption is required')
    }

    if (!formData.description.trim()) {
      newErrors.description = t('addListing.errors.descriptionRequired', 'Description is required')
    }

    if (!formData.category) {
      newErrors.category = t('addListing.errors.categoryRequired', 'Category is required')
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = t('addListing.errors.priceRequired', 'Valid price is required')
    }

    if (!formData.itemCondition) {
      newErrors.itemCondition = t('addListing.errors.conditionRequired', 'Item condition is required')
    }

    if (!formData.city.trim()) {
      newErrors.city = t('addListing.errors.cityRequired', 'City is required')
    }

    if (!formData.contactName.trim()) {
      newErrors.contactName = t('addListing.errors.contactNameRequired', 'Contact name is required')
    }

    if (images.length === 0) {
      newErrors.images = t('addListing.errors.imagesRequired', 'At least one image is required')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    if (!accessToken) {
      setErrors({ submit: t('addListing.errors.notAuthenticated', 'You must be logged in to create a listing.') })
      navigate('/signin')
      return
    }

    try {
      // Map form condition to backend enum
      const conditionMap: Record<string, ItemCondition> = {
        'new': ItemCondition.New,
        'not-used': ItemCondition.NotUsed,
        'used': ItemCondition.Used,
        'damaged': ItemCondition.Damaged,
      }

      // Map form currency to backend enum
      const currencyMap: Record<string, Currency> = {
        'EUR': Currency.EUR,
        'USD': Currency.USD,
        'RSD': Currency.RSD,
        'BAM': Currency.BAM,
        'HRK': Currency.HRK,
      }

      // For now, we'll use a hardcoded categoryId of 1
      // TODO: Implement proper category selection from database
      const categoryId = 1

      // Create the API request
      const request: CreateListingRequest = {
        caption: formData.caption.trim(),
        description: formData.description.trim(),
        categoryId: categoryId,
        listingType: formData.listingType === 'selling' ? ListingType.Selling : ListingType.Buying,
        price: parseFloat(formData.price),
        currency: currencyMap[formData.currency],
        isPriceFixed: formData.isPriceFixed,
        acceptsTrade: formData.acceptsTrade,
        itemCondition: conditionMap[formData.itemCondition],
        availableImmediately: formData.availableImmediately,
        deliveryAvailable: formData.deliveryAvailable,
        inPersonPickup: formData.inPersonPickup,
        city: formData.city.trim(),
        contactName: formData.contactName.trim(),
      }

      // Create the listing
      const response = await listingService.createListing(request, accessToken)

      // Upload images if listing was created successfully
      if (images.length > 0 && response.id) {
        await listingService.uploadListingImages(
          response.id,
          images.map(img => img.file),
          thumbnailIndex,
          accessToken
        )
      }

      // Navigate to home on success
      navigate('/')
    } catch {
      // Errors are already handled by apiRequest utility
      // Just log for debugging
    }
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 pt-20 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('addListing.title', 'Add New Listing')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('addListing.subtitle', 'Fill in the details to create your listing')}
            </p>
          </div>

          {errors.submit && (
            <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg text-red-800 dark:text-red-300">
              {errors.submit}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Image Upload Section */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('addListing.imagesSection', 'Images')}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('addListing.uploadImages', 'Upload Images')} ({images.length}/10)
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={images.length >= 10}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 dark:file:bg-indigo-900 dark:file:text-indigo-300 hover:file:bg-indigo-100 dark:hover:file:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                  {errors.images && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.images}</p>
                  )}
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      {t('addListing.selectThumbnail', 'Select thumbnail by clicking on an image')}
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {images.map((image, index) => (
                        <div
                          key={image.id}
                          className={`relative group cursor-pointer rounded-lg overflow-hidden border-4 transition-all ${
                            thumbnailIndex === index
                              ? 'border-indigo-500 shadow-lg scale-105'
                              : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
                          }`}
                          onClick={() => setThumbnailIndex(index)}
                        >
                          <img
                            src={image.preview}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          {thumbnailIndex === index && (
                            <div className="absolute top-2 left-2 bg-indigo-500 text-white text-xs font-bold px-2 py-1 rounded">
                              {t('addListing.thumbnail', 'Thumbnail')}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeImage(image.id)
                            }}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('addListing.basicInfo', 'Basic Information')}
              </h2>

              <div className="space-y-4">
                {/* Caption */}
                <div>
                  <label htmlFor="caption" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('addListing.caption', 'Listing Caption')} *
                  </label>
                  <input
                    type="text"
                    id="caption"
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.caption ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
                    placeholder={t('addListing.captionPlaceholder', 'e.g., iPhone 13 Pro Max in excellent condition')}
                    maxLength={100}
                  />
                  {errors.caption && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.caption}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formData.caption.length}/100
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('addListing.description', 'Description')} *
                  </label>
                  <textarea
                    id="description"
                    rows={6}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none`}
                    placeholder={t('addListing.descriptionPlaceholder', 'Provide detailed information about the item...')}
                    maxLength={2000}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {formData.description.length}/2000
                  </p>
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('addListing.category', 'Category')} *
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
                  >
                    <option value="">{t('addListing.selectCategory', 'Select a category')}</option>
                    <option value="electronics">{t('categories.electronics', 'Electronics')}</option>
                    <option value="vehicles">{t('categories.vehicles', 'Vehicles')}</option>
                    <option value="real-estate">{t('categories.realEstate', 'Real Estate')}</option>
                    <option value="fashion">{t('categories.fashion', 'Fashion')}</option>
                    <option value="home-garden">{t('categories.homeGarden', 'Home & Garden')}</option>
                    <option value="sports">{t('categories.sports', 'Sports')}</option>
                    <option value="books">{t('categories.books', 'Books & Media')}</option>
                    <option value="toys">{t('categories.toys', 'Toys & Games')}</option>
                    <option value="other">{t('categories.other', 'Other')}</option>
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Listing Type & Price */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('addListing.priceSection', 'Price & Listing Type')}
              </h2>

              <div className="space-y-4">
                {/* Listing Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('addListing.listingType', 'Listing Type')} *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex-1 relative">
                      <input
                        type="radio"
                        name="listingType"
                        value="selling"
                        checked={formData.listingType === 'selling'}
                        onChange={(e) => setFormData({ ...formData, listingType: e.target.value as 'selling' })}
                        className="peer sr-only"
                      />
                      <div className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/30 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="font-medium">{t('addListing.selling', 'Selling')}</span>
                      </div>
                    </label>
                    <label className="flex-1 relative">
                      <input
                        type="radio"
                        name="listingType"
                        value="buying"
                        checked={formData.listingType === 'buying'}
                        onChange={(e) => setFormData({ ...formData, listingType: e.target.value as 'buying' })}
                        className="peer sr-only"
                      />
                      <div className="flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/30 transition-all">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span className="font-medium">{t('addListing.buying', 'Buying')}</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Price and Currency */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('addListing.price', 'Price')} *
                    </label>
                    <input
                      type="number"
                      id="price"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className={`w-full px-4 py-2 rounded-lg border ${
                        errors.price ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                      } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
                      placeholder="0.00"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {t('addListing.currency', 'Currency')}
                    </label>
                    <select
                      id="currency"
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="RSD">RSD (дин)</option>
                      <option value="BAM">BAM (KM)</option>
                      <option value="HRK">HRK (kn)</option>
                    </select>
                  </div>
                </div>

                {/* Price Options */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isPriceFixed}
                      onChange={(e) => setFormData({ ...formData, isPriceFixed: e.target.checked })}
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('addListing.isPriceFixed', 'Price is fixed (not negotiable)')}
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.acceptsTrade}
                      onChange={(e) => setFormData({ ...formData, acceptsTrade: e.target.checked })}
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('addListing.acceptsTrade', 'Accept trade/exchange offers')}
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {/* Item Condition */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('addListing.conditionSection', 'Item Condition')}
              </h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('addListing.itemCondition', 'Condition')} *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {(['new', 'not-used', 'used', 'damaged'] as const).map((condition) => (
                    <label key={condition} className="relative">
                      <input
                        type="radio"
                        name="itemCondition"
                        value={condition}
                        checked={formData.itemCondition === condition}
                        onChange={(e) => setFormData({ ...formData, itemCondition: e.target.value as typeof condition })}
                        className="peer sr-only"
                      />
                      <div className="p-3 text-center rounded-lg border-2 border-gray-300 dark:border-gray-600 cursor-pointer peer-checked:border-indigo-500 peer-checked:bg-indigo-50 dark:peer-checked:bg-indigo-900/30 transition-all">
                        <span className="text-sm font-medium">
                          {t(`addListing.condition.${condition}`, condition)}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.itemCondition && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.itemCondition}</p>
                )}
              </div>
            </div>

            {/* Availability & Delivery */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('addListing.availabilitySection', 'Availability & Delivery')}
              </h2>

              <div className="space-y-4">
                {/* Availability */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('addListing.availability', 'Availability')}
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availableImmediately}
                      onChange={(e) => setFormData({ ...formData, availableImmediately: e.target.checked })}
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {t('addListing.availableImmediately', 'Available immediately')}
                    </span>
                  </label>
                </div>

                {/* Delivery Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    {t('addListing.deliveryOptions', 'Delivery Options')}
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.deliveryAvailable}
                        onChange={(e) => setFormData({ ...formData, deliveryAvailable: e.target.checked })}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {t('addListing.deliveryAvailable', 'Delivery available')}
                        </span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.inPersonPickup}
                        onChange={(e) => setFormData({ ...formData, inPersonPickup: e.target.checked })}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {t('addListing.inPersonPickup', 'In-person pickup available')}
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Location & Contact */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {t('addListing.locationSection', 'Location & Contact')}
              </h2>

              <div className="space-y-4">
                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('addListing.city', 'City')} *
                  </label>
                  <input
                    type="text"
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.city ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
                    placeholder={t('addListing.cityPlaceholder', 'Enter city name')}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.city}</p>
                  )}
                </div>

                {/* Contact Name */}
                <div>
                  <label htmlFor="contactName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('addListing.contactName', 'Contact Name')} *
                  </label>
                  <input
                    type="text"
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      errors.contactName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                    } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none`}
                    placeholder={t('addListing.contactNamePlaceholder', 'Name for contact purposes')}
                  />
                  {errors.contactName && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contactName}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {t('addListing.submit', 'Publish Listing')}
              </button>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="sm:w-auto px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                {t('addListing.cancel', 'Cancel')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

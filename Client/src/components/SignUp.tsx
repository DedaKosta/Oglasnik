import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from '../store/authStore'

export default function SignUp() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { signUp, isLoading, error, clearError } = useAuthStore()

  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    // Clear global error
    if (error) {
      clearError()
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    // Username validation (8-20 characters)
    if (formData.username.length < 8 || formData.username.length > 20) {
      errors.username = 'Username must be between 8 and 20 characters'
    }

    // First name validation (2-50 characters)
    if (formData.firstName.length < 2 || formData.firstName.length > 50) {
      errors.firstName = 'First name must be between 2 and 50 characters'
    }

    // Last name validation (2-50 characters)
    if (formData.lastName.length < 2 || formData.lastName.length > 50) {
      errors.lastName = 'Last name must be between 2 and 50 characters'
    }

    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation (min 8 chars, must contain digit, lowercase, uppercase, special char)
    const passwordRegex = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,}$/
    if (!passwordRegex.test(formData.password)) {
      errors.password = 'Password must be at least 8 characters and contain a digit, lowercase, uppercase, and special character'
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    // Terms acceptance
    if (!acceptTerms) {
      errors.terms = 'Please accept terms and conditions'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await signUp({
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      })

      // Registration successful - redirect to sign in
      navigate('/signin', {
        state: { message: 'Registration successful! Please sign in.' }
      })
    } catch (err) {
      // Error is already set in the store
      console.error('Registration failed:', err)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      
      <div className="min-h-screen flex items-center justify-center px-4 py-12 pt-20">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{t('auth.signUp.title')}</h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {t('auth.signUp.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                value={formData.username}
                onChange={handleChange}
                minLength={8}
                maxLength={20}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  validationErrors.username ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                placeholder="Enter username (8-20 characters)"
              />
              {validationErrors.username && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.username}</p>
              )}
            </div>

            {/* First Name Field */}
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                autoComplete="given-name"
                required
                value={formData.firstName}
                onChange={handleChange}
                minLength={2}
                maxLength={50}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  validationErrors.firstName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                placeholder="Enter first name"
              />
              {validationErrors.firstName && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.firstName}</p>
              )}
            </div>

            {/* Last Name Field */}
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                autoComplete="family-name"
                required
                value={formData.lastName}
                onChange={handleChange}
                minLength={2}
                maxLength={50}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  validationErrors.lastName ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                placeholder="Enter last name"
              />
              {validationErrors.lastName && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.lastName}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  validationErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                placeholder="Enter email address"
              />
              {validationErrors.email && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                minLength={8}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  validationErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                placeholder="Enter password"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Min 8 characters with digit, lowercase, uppercase, and special character
              </p>
              {validationErrors.password && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                minLength={8}
                className={`appearance-none relative block w-full px-4 py-3 border ${
                  validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                } placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
                placeholder="Confirm your password"
              />
              {validationErrors.confirmPassword && (
                <p className="mt-1 text-xs text-red-500">{validationErrors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Terms and Conditions */}
          <div>
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="accept-terms"
                  name="accept-terms"
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked)
                    if (validationErrors.terms) {
                      setValidationErrors(prev => {
                        const newErrors = { ...prev }
                        delete newErrors.terms
                        return newErrors
                      })
                    }
                  }}
                  required
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded cursor-pointer"
                />
              </div>
              <div className="ml-2 text-sm">
                <label htmlFor="accept-terms" className="text-gray-700 dark:text-gray-300 cursor-pointer">
                  I accept the{' '}
                  <Link to="/terms" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>
            </div>
            {validationErrors.terms && (
              <p className="mt-1 text-xs text-red-500">{validationErrors.terms}</p>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                'Create Account'
              )}
            </button>
          </div>

          {/* Sign In Link */}
          <div className="text-center pt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/signin" className="font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 transition-colors">
                Sign In
              </Link>
            </p>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}

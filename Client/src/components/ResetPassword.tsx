import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from './Header'

export default function ResetPassword() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      alert(t('resetPassword.passwordMismatch'))
      return
    }

    console.log('Password reset with token:', token)
    // TODO: Implement password reset logic
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Header />

      <div className="flex items-center justify-center min-h-screen px-4 pt-20 pb-16">
        <div className="w-full max-w-md">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('resetPassword.title')}
              </h1>
              <p className="text-gray-600">
                {t('resetPassword.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('resetPassword.newPasswordLabel')}
                </label>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder={t('resetPassword.newPasswordPlaceholder')}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('resetPassword.confirmPasswordLabel')}
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                />
              </div>

              <div className="flex items-center">
                <input
                  id="showPassword"
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                />
                <label htmlFor="showPassword" className="ml-2 text-sm text-gray-700">
                  {t('resetPassword.showPassword')}
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-900 transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('resetPassword.submitButton')}
              </button>

              <div className="text-center">
                <Link
                  to="/signin"
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  {t('resetPassword.backToSignIn')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

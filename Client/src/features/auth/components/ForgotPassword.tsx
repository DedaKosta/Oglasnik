import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../../../shared/components/Layout/Header'

export default function ForgotPassword() {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Password reset requested for:', email)
    // TODO: Implement password reset logic
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />

      <div className="flex items-center justify-center min-h-screen px-4 pt-20 pb-16">
        <div className="w-full max-w-md">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {t('forgotPassword.title')}
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t('forgotPassword.subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('forgotPassword.emailLabel')}
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                  placeholder={t('forgotPassword.emailPlaceholder')}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-indigo-900 transition transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {t('forgotPassword.submitButton')}
              </button>

              <div className="text-center">
                <Link
                  to="/signin"
                  className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-medium"
                >
                  {t('forgotPassword.backToSignIn')}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../../../features/auth/context/AuthContext'
import LanguageSwitcher from '../UI/LanguageSwitcher'
import ThemeToggle from '../UI/ThemeToggle'

export default function Header() {
  const { t } = useTranslation()
  const { user, isAuthenticated, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between py-3 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center p-2">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="7" cy="7" r="1.5" fill="white"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white">Oglasnik</span>
        </Link>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* User Info */}
              <Link
                to="/profile"
                className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {user?.firstName} {user?.lastName}
                </span>
              </Link>
              <button
                onClick={logout}
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                {t('header.logout')}
              </button>
            </>
          ) : (
            <>
              {/* Auth Buttons */}
              <Link
                to="/signin"
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {t('header.signIn')}
              </Link>
              <Link
                to="/signup"
                className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
              >
                {t('header.signUp')}
              </Link>
            </>
          )}

          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  )
}

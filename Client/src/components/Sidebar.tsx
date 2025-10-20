import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store'
import { useAuthStore } from '../store'
import LanguageSwitcher from './LanguageSwitcher'

export default function Sidebar() {
  const { t } = useTranslation()
  const location = useLocation()
  const { sidebarOpen, setSidebarOpen } = useAppStore()
  const { isAuthenticated, user, signOut } = useAuthStore()

  const closeSidebar = () => setSidebarOpen(false)

  const navItems = [
    { path: '/', label: t('sidebar.home', 'Home'), icon: 'home' },
    { path: '/browse', label: t('sidebar.browse', 'Browse Listings'), icon: 'search' },
    { path: '/favorites', label: t('sidebar.favorites', 'Favorites'), icon: 'heart' },
    { path: '/messages', label: t('sidebar.messages', 'Messages'), icon: 'message' },
  ]

  const authItems = isAuthenticated
    ? [
        { path: '/profile', label: t('sidebar.profile', 'My Profile'), icon: 'user' },
        { path: '/my-listings', label: t('sidebar.myListings', 'My Listings'), icon: 'list' },
        { path: '/settings', label: t('sidebar.settings', 'Settings'), icon: 'settings' },
      ]
    : [
        { path: '/signin', label: t('sidebar.signIn', 'Sign In'), icon: 'login' },
        { path: '/signup', label: t('sidebar.signUp', 'Sign Up'), icon: 'userPlus' },
      ]

  const renderIcon = (iconName: string) => {
    const icons: Record<string, JSX.Element> = {
      home: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      search: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      heart: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      message: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      user: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      list: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      settings: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      login: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
        </svg>
      ),
      userPlus: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      ),
      logout: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      ),
    }
    return icons[iconName] || icons.home
  }

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-72' : 'w-20'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header - Exact height match with main Header */}
          <div className={`flex items-center h-[60px] px-4 border-b border-gray-200 dark:border-gray-700 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {sidebarOpen ? (
              <>
                <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-lg flex items-center justify-center p-1.5">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="7" cy="7" r="1.5" fill="white"/>
                    </svg>
                  </div>
                  <span className="text-lg font-bold text-gray-900 dark:text-white">Oglasnik</span>
                </Link>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Close menu"
                >
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Open menu"
              >
                <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>

          {/* User Info */}
          {isAuthenticated && user && sidebarOpen && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                  {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                    {user.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}
          {isAuthenticated && user && !sidebarOpen && (
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className={`flex-1 overflow-y-auto space-y-1 ${sidebarOpen ? 'p-4' : 'p-2'}`}>
            {/* Main Navigation */}
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center rounded-lg transition-colors py-3 ${
                  sidebarOpen ? 'px-4 gap-3' : 'px-0 justify-center'
                } ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {renderIcon(item.icon)}
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            ))}

            {/* Divider */}
            <div className="my-4 border-t border-gray-200 dark:border-gray-700" />

            {/* Auth Navigation */}
            {authItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                title={!sidebarOpen ? item.label : undefined}
                className={`flex items-center rounded-lg transition-colors py-3 ${
                  sidebarOpen ? 'px-4 gap-3' : 'px-0 justify-center'
                } ${
                  location.pathname === item.path
                    ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {renderIcon(item.icon)}
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </Link>
            ))}

            {/* Sign Out */}
            {isAuthenticated && (
              <button
                onClick={() => {
                  signOut()
                  closeSidebar()
                }}
                title={!sidebarOpen ? t('sidebar.signOut', 'Sign Out') : undefined}
                className={`w-full flex items-center rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors py-3 ${
                  sidebarOpen ? 'px-4 gap-3' : 'px-0 justify-center'
                }`}
              >
                {renderIcon('logout')}
                {sidebarOpen && <span className="font-medium">{t('sidebar.signOut', 'Sign Out')}</span>}
              </button>
            )}
          </nav>

          {/* Language Switcher at Bottom */}
          <div className={`border-t border-gray-200 dark:border-gray-700 ${sidebarOpen ? 'p-4' : 'p-2 flex justify-center'}`}>
            <LanguageSwitcher compact={!sidebarOpen} />
          </div>
        </div>
      </aside>
    </>
  )
}

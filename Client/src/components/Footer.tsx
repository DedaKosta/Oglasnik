import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-3 items-center py-3 px-4">
        {/* Left Links */}
        <div className="flex items-center gap-4 justify-start">
          <Link
            to="/privacy"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {t('footer.privacy')}
          </Link>
          <Link
            to="/terms"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {t('footer.terms')}
          </Link>
        </div>

        {/* Center Copyright */}
        <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
          © {currentYear} Oglasnik™. {t('footer.allRightsReserved')}
        </p>

        {/* Right Links */}
        <div className="flex items-center gap-4 justify-end">
          <Link
            to="/contact"
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
          >
            {t('footer.contact')}
          </Link>
        </div>
      </div>
    </footer>
  )
}

import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="fixed bottom-0 left-0 right-0">
      <div className="flex items-center justify-center py-3">
        <p className="text-sm text-gray-800 dark:text-gray-200">
          © {currentYear} Oglasnik™. {t('footer.allRightsReserved')}
        </p>
      </div>
    </footer>
  )
}

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

interface Language {
  code: string
  name: string
  flag: string
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: '/flags/en.png' },
  { code: 'sr', name: 'Српски', flag: '/flags/sr.png' },
  { code: 'bs', name: 'Bosanski', flag: '/flags/bs.png' },
  { code: 'hr', name: 'Hrvatski', flag: '/flags/hr.png' },
  { code: 'mk', name: 'Македонски', flag: '/flags/mk.png' },
  { code: 'bg', name: 'Български', flag: '/flags/bg.png' },
  { code: 'el', name: 'Ελληνικά', flag: '/flags/el.png' },
  { code: 'me', name: 'Crnogorski', flag: '/flags/me.png' },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div className="relative">
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 min-w-[180px]"
          aria-label="Select language"
        >
          <img
            src={currentLanguage.flag}
            alt={`${currentLanguage.name} flag`}
            className="w-8 h-6 rounded shadow-sm object-cover"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-1 text-left">
            {currentLanguage.name}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Content */}
            <div className="absolute right-0 top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-20">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 transition-colors ${
                    lang.code === currentLanguage.code
                      ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                  }`}
                >
                  <img
                    src={lang.flag}
                    alt={`${lang.name} flag`}
                    className="w-8 h-6 rounded shadow-sm object-cover"
                  />
                  <span className="text-sm font-medium">{lang.name}</span>
                  {lang.code === currentLanguage.code && (
                    <svg
                      className="w-4 h-4 ml-auto text-indigo-600 dark:text-indigo-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

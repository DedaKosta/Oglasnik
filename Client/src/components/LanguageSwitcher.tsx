import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import gbFlag from '../assets/flags/gb.svg'
import rsFlag from '../assets/flags/rs.svg'
import baFlag from '../assets/flags/ba.svg'
import hrFlag from '../assets/flags/hr.svg'
import mkFlag from '../assets/flags/mk.svg'
import bgFlag from '../assets/flags/bg.svg'
import grFlag from '../assets/flags/gr.svg'
import meFlag from '../assets/flags/me.svg'

interface Language {
  code: string
  name: string
  flag: string
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: gbFlag },
  { code: 'sr', name: 'Српски', flag: rsFlag },
  { code: 'bs', name: 'Bosanski', flag: baFlag },
  { code: 'hr', name: 'Hrvatski', flag: hrFlag },
  { code: 'mk', name: 'Македонски', flag: mkFlag },
  { code: 'bg', name: 'Български', flag: bgFlag },
  { code: 'el', name: 'Ελληνικά', flag: grFlag },
  { code: 'me', name: 'Crnogorski', flag: meFlag },
]

interface LanguageSwitcherProps {
  compact?: boolean
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
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
          className={`flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-500 w-full ${
            compact ? 'px-2 py-2 justify-center' : 'px-4 py-2'
          }`}
          aria-label="Select language"
        >
          <img src={currentLanguage.flag} alt={currentLanguage.name} className="w-8 h-6 rounded shadow-sm" />
          {!compact && (
            <>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-1 text-left">
                {currentLanguage.name}
              </span>
              <svg
                className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Dropdown Content - Opens upward */}
            <div className="absolute left-0 right-0 bottom-full mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-20">
              {languages.map((lang) => {
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center transition-colors ${
                      compact ? 'justify-center px-2 py-2' : 'gap-3 px-4 py-3 text-left'
                    } ${
                      i18n.language === lang.code
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    title={compact ? lang.name : undefined}
                  >
                    <img src={lang.flag} alt={lang.name} className="w-8 h-6 rounded shadow-sm" />
                    {!compact && (
                      <>
                        <span className="text-sm font-medium">{lang.name}</span>
                        {i18n.language === lang.code && (
                          <svg
                            className="w-4 h-4 ml-auto text-indigo-600 dark:text-indigo-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </>
                    )}
                  </button>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

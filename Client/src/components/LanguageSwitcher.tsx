import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import FlagUK from './flags/FlagUK'
import FlagSerbia from './flags/FlagSerbia'
import FlagBosnia from './flags/FlagBosnia'
import FlagCroatia from './flags/FlagCroatia'
import FlagMacedonia from './flags/FlagMacedonia'

interface Language {
  code: string
  name: string
  flag: React.ComponentType<{ className?: string }>
}

const languages: Language[] = [
  { code: 'en', name: 'English', flag: FlagUK },
  { code: 'sr', name: 'Srpski', flag: FlagSerbia },
  { code: 'bs', name: 'Bosanski', flag: FlagBosnia },
  { code: 'hr', name: 'Hrvatski', flag: FlagCroatia },
  { code: 'mk', name: 'Македонски', flag: FlagMacedonia },
]

export default function LanguageSwitcher() {
  const { i18n } = useTranslation()
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode)
    setIsOpen(false)
  }

  const FlagComponent = currentLanguage.flag

  return (
    <div className="relative">
      <div className="relative">
        {/* Dropdown Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-200 hover:border-indigo-300 min-w-[180px]"
          aria-label="Select language"
        >
          <FlagComponent className="w-8 h-6 rounded shadow-sm" />
          <span className="text-sm font-medium text-gray-700 flex-1 text-left">
            {currentLanguage.name}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
            <div className="absolute right-0 top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden z-20">
              {languages.map((lang) => {
                const LangFlag = lang.flag
                return (
                  <button
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                      i18n.language === lang.code
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <LangFlag className="w-8 h-6 rounded shadow-sm" />
                    <span className="text-sm font-medium">{lang.name}</span>
                    {i18n.language === lang.code && (
                      <svg
                        className="w-4 h-4 ml-auto text-indigo-600"
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

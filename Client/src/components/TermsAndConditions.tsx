import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from './Header'

function AccordionItem({
  title,
  children,
  isOpen,
  onToggle
}: {
  title: string
  children: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}) {
  return (
    <div className="border border-gray-200 rounded-lg mb-3 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center p-4 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function TermsAndConditions() {
  const { t } = useTranslation()
  const location = useLocation()
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Header />

      <div className="flex items-center justify-center min-h-screen px-4 pt-20 pb-16">
        <div className="w-full max-w-3xl">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 md:p-12">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-2">
                    {t('legal.terms.title')}
                  </h1>
                  <p className="text-gray-600">
                    {t('legal.terms.lastUpdated')}: {new Date().toLocaleDateString()}
                  </p>
                </div>
                <Link
                  to="/signup"
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
                  aria-label="Close"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Accordions */}
            <div className="space-y-3">
              <AccordionItem
                title={t('legal.terms.section1.title')}
                isOpen={openIndex === 0}
                onToggle={() => toggleAccordion(0)}
              >
                <p className="text-gray-700">
                  {t('legal.terms.section1.content')}
                </p>
              </AccordionItem>

              <AccordionItem
                title={t('legal.terms.section2.title')}
                isOpen={openIndex === 1}
                onToggle={() => toggleAccordion(1)}
              >
                <p className="text-gray-700 mb-4">
                  {t('legal.terms.section2.intro')}
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>{t('legal.terms.section2.item1')}</li>
                  <li>{t('legal.terms.section2.item2')}</li>
                  <li>{t('legal.terms.section2.item3')}</li>
                  <li>{t('legal.terms.section2.item4')}</li>
                </ul>
              </AccordionItem>

              <AccordionItem
                title={t('legal.terms.section3.title')}
                isOpen={openIndex === 2}
                onToggle={() => toggleAccordion(2)}
              >
                <p className="text-gray-700">
                  {t('legal.terms.section3.content')}
                </p>
              </AccordionItem>

              <AccordionItem
                title={t('legal.terms.section4.title')}
                isOpen={openIndex === 3}
                onToggle={() => toggleAccordion(3)}
              >
                <p className="text-gray-700">
                  {t('legal.terms.section4.content')}
                </p>
              </AccordionItem>

              <AccordionItem
                title={t('legal.terms.section5.title')}
                isOpen={openIndex === 4}
                onToggle={() => toggleAccordion(4)}
              >
                <p className="text-gray-700">
                  {t('legal.terms.section5.content')}
                </p>
              </AccordionItem>

              <AccordionItem
                title={t('legal.terms.section6.title')}
                isOpen={openIndex === 5}
                onToggle={() => toggleAccordion(5)}
              >
                <p className="text-gray-700">
                  {t('legal.terms.section6.content')}
                </p>
              </AccordionItem>

              <AccordionItem
                title={t('legal.terms.section7.title')}
                isOpen={openIndex === 6}
                onToggle={() => toggleAccordion(6)}
              >
                <p className="text-gray-700">
                  {t('legal.terms.section7.content')}
                </p>
              </AccordionItem>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <p className="text-gray-600 text-center">
                {t('legal.terms.questions')}{' '}
                <Link
                  to="/contact"
                  state={{ from: location.pathname }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  {t('contact.title')}
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

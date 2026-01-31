'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Locale, locales } from '@/lib/types'
import { languages } from '@/lib/i18n'
import { ChevronDown, Globe } from 'lucide-react'
import clsx from 'clsx'

interface LanguageSwitcherProps {
  currentLocale: Locale
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentLanguage = languages[currentLocale]

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {currentLanguage.flag} {currentLanguage.nativeName}
        </span>
        <ChevronDown
          className={clsx(
            'w-4 h-4 text-gray-500 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {locales.map((locale) => {
              const lang = languages[locale]
              const isActive = locale === currentLocale

              return (
                <Link
                  key={locale}
                  href={`/${locale}`}
                  onClick={() => setIsOpen(false)}
                  className={clsx(
                    'flex items-center space-x-3 px-4 py-2 text-sm transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span>{lang.nativeName}</span>
                  {isActive && (
                    <span className="ml-auto text-primary-600">✓</span>
                  )}
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

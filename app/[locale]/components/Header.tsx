'use client'

import Link from 'next/link'
import { Locale } from '@/lib/types'
import { t } from '@/lib/i18n'
import LanguageSwitcher from './LanguageSwitcher'
import { Newspaper } from 'lucide-react'

interface HeaderProps {
  locale: Locale
}

export default function Header({ locale }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Site Name */}
          <Link
            href={`/${locale}`}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
              <Newspaper className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              {t(locale, 'siteName')}
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              href={`/${locale}`}
              className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
            >
              {t(locale, 'home')}
            </Link>

            {/* Language Switcher */}
            <LanguageSwitcher currentLocale={locale} />
          </nav>
        </div>
      </div>
    </header>
  )
}

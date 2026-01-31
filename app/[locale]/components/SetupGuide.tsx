'use client'

import { Settings, ExternalLink } from 'lucide-react'
import { Locale } from '@/lib/types'
import { t } from '@/lib/i18n'

interface SetupGuideProps {
  missingVars: string[]
  locale: Locale
}

export default function SetupGuide({ missingVars, locale }: SetupGuideProps) {
  const envVarExamples: Record<string, string> = {
    'NEXT_PUBLIC_DRUPAL_BASE_URL': 'https://your-site.decoupled.website',
    'DRUPAL_CLIENT_ID': 'your-client-id',
    'DRUPAL_CLIENT_SECRET': 'your-client-secret',
    'DRUPAL_REVALIDATE_SECRET': 'your-revalidate-secret'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-primary-600" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent mb-2">
            {t(locale, 'setupRequired')}
          </h1>
          <p className="text-gray-600">
            {t(locale, 'setupDescription')}
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
            <h2 className="font-semibold text-primary-900 mb-2">
              Quick Setup
            </h2>
            <p className="text-primary-800 text-sm">
              Run <code className="bg-primary-100 px-2 py-1 rounded">npm run setup</code> to configure your Drupal backend automatically.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">
              Missing Environment Variables:
            </h3>
            <div className="space-y-3">
              {missingVars.map((varName) => (
                <div key={varName} className="border border-gray-200 rounded-lg p-4">
                  <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                    {varName}
                  </code>
                  <p className="text-sm text-gray-600 mt-2">
                    Example: <code className="bg-gray-50 px-1 rounded text-xs">
                      {envVarExamples[varName]}
                    </code>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Manual Setup Steps:
            </h3>
            <ol className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">1</span>
                Create a Decoupled.io space at dashboard.decoupled.io
              </li>
              <li className="flex items-start">
                <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">2</span>
                Copy the OAuth credentials from your space settings
              </li>
              <li className="flex items-start">
                <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">3</span>
                Create a .env.local file with your credentials
              </li>
              <li className="flex items-start">
                <span className="bg-primary-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs mr-3 mt-0.5">4</span>
                Run <code className="bg-gray-200 px-1 rounded">npm run setup-content</code> to import sample content
              </li>
            </ol>
          </div>

          <div className="flex gap-4">
            <a
              href="https://dashboard.decoupled.io"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-primary-600 text-white px-4 py-3 rounded-lg font-medium text-center hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
            >
              Open Dashboard
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              Check Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

import { headers } from 'next/headers'
import { getServerApolloClient } from '@/lib/apollo-client'
import { GET_NEWS_BY_LANGUAGE } from '@/lib/queries'
import { NewsArticleData, DrupalNewsArticle, Locale, locales } from '@/lib/types'
import { t, languages } from '@/lib/i18n'
import { checkConfiguration } from '@/lib/config-check'
import Header from './components/Header'
import NewsCard from './components/NewsCard'
import SetupGuide from './components/SetupGuide'

export const revalidate = 3600 // Revalidate every hour

interface PageProps {
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: PageProps) {
  const { locale } = await params
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en'

  return {
    title: t(validLocale, 'latestNews'),
    description: t(validLocale, 'siteDescription'),
  }
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en'

  // Check configuration
  const config = checkConfiguration()
  if (!config.isConfigured) {
    return <SetupGuide missingVars={config.missingVars} locale={validLocale} />
  }

  // Fetch news articles
  const requestHeaders = await headers()
  const client = getServerApolloClient(requestHeaders)

  let articles: DrupalNewsArticle[] = []
  let error: string | null = null

  try {
    const { data } = await client.query<NewsArticleData>({
      query: GET_NEWS_BY_LANGUAGE,
      variables: { first: 20 },
    })

    // Filter articles by language
    const languageName = languages[validLocale].nativeName
    articles = (data?.nodeNewsArticles?.nodes || []).filter((article) => {
      if (!article.language || article.language.length === 0) return false
      return article.language.some(
        (lang) => lang.name === languageName || lang.code === validLocale
      )
    })
  } catch (e) {
    console.error('Error fetching news:', e)
    error = e instanceof Error ? e.message : 'Failed to fetch news'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header locale={validLocale} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t(validLocale, 'latestNews')}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t(validLocale, 'siteDescription')}
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center mb-8">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* News Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <NewsCard key={article.id} article={article} locale={validLocale} />
            ))}
          </div>
        ) : (
          !error && (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg">{t(validLocale, 'noArticles')}</p>
              <p className="text-gray-400 mt-2">
                Run <code className="bg-gray-100 px-2 py-1 rounded">npm run setup-content</code> to import sample content.
              </p>
            </div>
          )
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-500 text-sm">
            {t(validLocale, 'siteName')} - Powered by Drupal & Next.js
          </p>
        </div>
      </footer>
    </div>
  )
}

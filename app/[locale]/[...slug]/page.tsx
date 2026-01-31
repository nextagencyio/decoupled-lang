import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getServerApolloClient } from '@/lib/apollo-client'
import { GET_NEWS_BY_PATH } from '@/lib/queries'
import { Locale, locales } from '@/lib/types'
import { t, formatDate } from '@/lib/i18n'
import { checkConfiguration } from '@/lib/config-check'
import Header from '../components/Header'
import SetupGuide from '../components/SetupGuide'
import { Calendar, ArrowLeft } from 'lucide-react'

export const revalidate = 3600

interface PageProps {
  params: Promise<{ locale: string; slug: string[] }>
}

export async function generateMetadata({ params }: PageProps) {
  const { locale, slug } = await params
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en'
  const path = `/${locale}/${slug.join('/')}`

  // Fetch article for metadata
  const config = checkConfiguration()
  if (!config.isConfigured) {
    return { title: 'Setup Required' }
  }

  try {
    const requestHeaders = await headers()
    const client = getServerApolloClient(requestHeaders)
    const { data } = await client.query({
      query: GET_NEWS_BY_PATH,
      variables: { path },
    })

    const article = data?.route?.entity
    if (article) {
      return {
        title: article.title,
        description: article.summary?.processed?.replace(/<[^>]*>/g, '').slice(0, 160),
      }
    }
  } catch {
    // Fallback metadata
  }

  return {
    title: t(validLocale, 'latestNews'),
  }
}

export default async function ArticlePage({ params }: PageProps) {
  const { locale, slug } = await params
  const validLocale = locales.includes(locale as Locale) ? (locale as Locale) : 'en'
  const path = `/${locale}/${slug.join('/')}`

  // Check configuration
  const config = checkConfiguration()
  if (!config.isConfigured) {
    return <SetupGuide missingVars={config.missingVars} locale={validLocale} />
  }

  // Fetch article by path
  const requestHeaders = await headers()
  const client = getServerApolloClient(requestHeaders)

  let article = null
  try {
    const { data } = await client.query({
      query: GET_NEWS_BY_PATH,
      variables: { path },
    })
    article = data?.route?.entity
  } catch (e) {
    console.error('Error fetching article:', e)
  }

  if (!article) {
    notFound()
  }

  // Image URL with HTTPS
  const imageUrl = article.image?.url?.replace(/^http:/, 'https:')

  return (
    <div className="min-h-screen bg-gray-50">
      <Header locale={validLocale} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back link */}
        <Link
          href={`/${validLocale}`}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t(validLocale, 'backToNews')}
        </Link>

        <article className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Hero Image */}
          {imageUrl && (
            <div className="relative aspect-video">
              <Image
                src={imageUrl}
                alt={article.image?.alt || article.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 100vw, 896px"
              />
            </div>
          )}

          <div className="p-8 md:p-12">
            {/* Date */}
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Calendar className="w-4 h-4 mr-2" />
              <time dateTime={new Date(article.created.timestamp * 1000).toISOString()}>
                {formatDate(article.created.timestamp, validLocale)}
              </time>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              {article.title}
            </h1>

            {/* Summary */}
            {article.summary?.processed && (
              <div
                className="text-xl text-gray-600 mb-8 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: article.summary.processed }}
              />
            )}

            {/* Body */}
            {article.body?.processed && (
              <div
                className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary-600"
                dangerouslySetInnerHTML={{ __html: article.body.processed }}
              />
            )}
          </div>
        </article>

        {/* Back to news */}
        <div className="mt-8 text-center">
          <Link
            href={`/${validLocale}`}
            className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t(validLocale, 'backToNews')}
          </Link>
        </div>
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

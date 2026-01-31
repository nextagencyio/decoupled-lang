import Image from 'next/image'
import Link from 'next/link'
import { DrupalNewsArticle, Locale } from '@/lib/types'
import { t, formatDate } from '@/lib/i18n'
import { Calendar } from 'lucide-react'

interface NewsCardProps {
  article: DrupalNewsArticle
  locale: Locale
}

export default function NewsCard({ article, locale }: NewsCardProps) {
  const imageUrl = article.image?.variations?.[0]?.url || article.image?.url
  const summary = article.summary?.processed || ''
  // Strip HTML tags for display
  const cleanSummary = summary.replace(/<[^>]*>/g, '')

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      {/* Image */}
      {imageUrl && (
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={imageUrl}
            alt={article.image?.alt || article.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {/* Date */}
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar className="w-4 h-4 mr-2" />
          <time dateTime={new Date(article.created.timestamp * 1000).toISOString()}>
            {formatDate(article.created.timestamp, locale)}
          </time>
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
          <Link href={article.path} className="hover:underline">
            {article.title}
          </Link>
        </h2>

        {/* Summary */}
        {cleanSummary && (
          <p className="text-gray-600 line-clamp-3 mb-4">
            {cleanSummary}
          </p>
        )}

        {/* Read More Link */}
        <Link
          href={article.path}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-sm"
        >
          {t(locale, 'readMore')}
          <svg
            className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Link>
      </div>
    </article>
  )
}

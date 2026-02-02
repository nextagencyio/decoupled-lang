/**
 * Demo Mode Module
 *
 * This file contains ALL demo/mock mode functionality.
 * To remove demo mode from a real project:
 * 1. Delete this file (lib/demo-mode.ts)
 * 2. Delete the data/mock/ directory
 * 3. Delete app/[locale]/components/DemoModeBanner.tsx
 * 4. Remove DemoModeBanner from app/layout.tsx
 * 5. Remove demo mode checks from app/[locale]/page.tsx
 */

// Import mock data for serverless compatibility
import articlesData from '@/data/mock/articles.json'

import { DrupalNewsArticle, Locale } from './types'

/**
 * Check if demo mode is enabled via environment variable
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

/**
 * Get mock articles for a specific language
 */
export function getMockArticles(locale: Locale): DrupalNewsArticle[] {
  const articles = articlesData.articles as DrupalNewsArticle[]
  return articles.filter(article => {
    const lang = article.language?.[0]
    return lang?.code === locale || lang?.name === getLanguageName(locale)
  })
}

/**
 * Get mock article by path
 */
export function getMockArticleByPath(path: string): DrupalNewsArticle | null {
  const articles = articlesData.articles as DrupalNewsArticle[]
  return articles.find(a => a.path === path) || null
}

function getLanguageName(locale: Locale): string {
  const names: Record<Locale, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
  }
  return names[locale] || 'English'
}

/**
 * Handle a GraphQL query with mock data
 */
export function handleMockQuery(body: string, locale: Locale): any {
  try {
    const { query, variables } = JSON.parse(body)

    // Handle route queries for individual articles
    if (variables?.path) {
      const article = getMockArticleByPath(variables.path)
      if (article) {
        return {
          data: {
            route: {
              __typename: 'RouteInternal',
              entity: article
            }
          }
        }
      }
    }

    // Handle article listing queries
    if (query.includes('GetNewsArticles') || query.includes('nodeNewsArticles')) {
      return {
        data: {
          nodeNewsArticles: {
            __typename: 'NodeNewsArticleConnection',
            nodes: getMockArticles(locale)
          }
        }
      }
    }

    return { data: {} }
  } catch (error) {
    console.error('Mock query error:', error)
    return { data: {}, errors: [{ message: 'Mock data error' }] }
  }
}

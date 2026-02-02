export interface DrupalNode {
  id: string
  title: string
  path: string
  langcode?: {
    id: string
  }
  created: {
    timestamp: number
  }
  changed?: {
    timestamp: number
  }
}

export interface Translation {
  path: string
  langcode: {
    id: string
  }
}

export interface LanguageTerm {
  id: string
  name: string
  code: string
}

export interface DrupalNewsArticle extends DrupalNode {
  summary?: {
    processed: string
  }
  body?: {
    processed: string
  }
  image?: {
    url: string
    alt?: string
    width?: number
    height?: number
    variations?: Array<{
      name: string
      url: string
      width: number
      height: number
    }>
  }
  language?: LanguageTerm[]
  translations?: Translation[]
}

export interface NewsArticleData {
  nodeNewsArticles: {
    nodes: DrupalNewsArticle[]
  }
}

// Supported locales
export type Locale = 'en' | 'es' | 'fr'

export const locales: Locale[] = ['en', 'es', 'fr']
export const defaultLocale: Locale = 'en'

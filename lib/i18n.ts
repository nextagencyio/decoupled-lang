import { Locale } from './types'

// Language metadata
export const languages = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
} as const

// UI translations for static text
export const translations = {
  en: {
    siteName: 'Decoupled News',
    siteDescription: 'Multilingual news powered by Drupal and Next.js',
    latestNews: 'Latest News',
    readMore: 'Read more',
    publishedOn: 'Published on',
    noArticles: 'No articles found',
    setupRequired: 'Setup Required',
    setupDescription: 'Run the setup script to configure your Drupal backend and import sample content.',
    language: 'Language',
    home: 'Home',
    backToNews: 'Back to News',
  },
  es: {
    siteName: 'Noticias Decoupled',
    siteDescription: 'Noticias multilingües con Drupal y Next.js',
    latestNews: 'Últimas Noticias',
    readMore: 'Leer más',
    publishedOn: 'Publicado el',
    noArticles: 'No se encontraron artículos',
    setupRequired: 'Configuración Requerida',
    setupDescription: 'Ejecuta el script de configuración para configurar tu backend Drupal e importar contenido de ejemplo.',
    language: 'Idioma',
    home: 'Inicio',
    backToNews: 'Volver a Noticias',
  },
  fr: {
    siteName: 'Actualités Decoupled',
    siteDescription: 'Actualités multilingues avec Drupal et Next.js',
    latestNews: 'Dernières Actualités',
    readMore: 'Lire la suite',
    publishedOn: 'Publié le',
    noArticles: 'Aucun article trouvé',
    setupRequired: 'Configuration Requise',
    setupDescription: 'Exécutez le script de configuration pour configurer votre backend Drupal et importer du contenu exemple.',
    language: 'Langue',
    home: 'Accueil',
    backToNews: 'Retour aux Actualités',
  },
} as const

export type TranslationKey = keyof typeof translations.en

// Get translation for a specific locale
export function t(locale: Locale, key: TranslationKey): string {
  return translations[locale][key] || translations.en[key]
}

// Format date for locale
export function formatDate(timestamp: number, locale: Locale): string {
  const date = new Date(timestamp * 1000)
  const localeMap = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
  }
  return date.toLocaleDateString(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Get language code from Drupal term name
export function getLocaleFromLanguageName(name: string): Locale {
  const mapping: Record<string, Locale> = {
    'English': 'en',
    'Español': 'es',
    'Spanish': 'es',
    'Français': 'fr',
    'French': 'fr',
  }
  return mapping[name] || 'en'
}

# Claude Code - Decoupled Lang Development Guide

This guide provides instructions for developing and extending the Decoupled Lang multilingual starter.

## Quick Reference

- **Languages**: English (en), Spanish (es), French (fr)
- **Default Locale**: `en`
- **Content Type**: `news_article` with `language` taxonomy
- **Routing**: Next.js App Router with `[locale]` segment

## Architecture Overview

### Multilingual Approach

This starter uses a **content-based translation approach** rather than Drupal's native translation system:

1. **Language Taxonomy**: A vocabulary with terms for each language (English, Español, Français)
2. **Content Filtering**: Each article has a `language` field linking to the taxonomy
3. **Frontend Routing**: Next.js `[locale]` segment determines which language to display
4. **Client-Side Filtering**: GraphQL fetches all articles, filtered by language on the frontend

### Why This Approach?

- Simpler to implement with GraphQL Compose
- No changes required to Drupal's translation modules
- Content editors create separate articles per language
- Flexible for different content per locale (not just translations)

## Key Files

### Localization

| File | Purpose |
|------|---------|
| `lib/i18n.ts` | UI translations, date formatting, locale utilities |
| `lib/types.ts` | Locale type definitions, language constants |
| `app/[locale]/page.tsx` | Language-filtered news homepage |
| `app/[locale]/components/LanguageSwitcher.tsx` | Language toggle dropdown |

### Content

| File | Purpose |
|------|---------|
| `data/lang-content.json` | Content model + sample articles in 3 languages |
| `lib/queries.ts` | GraphQL queries for news articles |

## Adding UI Translations

Edit `lib/i18n.ts` to add new translation strings:

```typescript
export const translations = {
  en: {
    siteName: 'Decoupled News',
    latestNews: 'Latest News',
    // Add new keys here
    myNewString: 'My new string',
  },
  es: {
    siteName: 'Noticias Decoupled',
    latestNews: 'Últimas Noticias',
    myNewString: 'Mi nueva cadena',
  },
  fr: {
    siteName: 'Actualités Decoupled',
    latestNews: 'Dernières Actualités',
    myNewString: 'Ma nouvelle chaîne',
  },
}
```

Then use in components:

```typescript
import { t } from '@/lib/i18n'
import { Locale } from '@/lib/types'

function MyComponent({ locale }: { locale: Locale }) {
  return <p>{t(locale, 'myNewString')}</p>
}
```

## Adding a New Language

### 1. Update Types

```typescript
// lib/types.ts
export type Locale = 'en' | 'es' | 'fr' | 'de' // Add new locale
export const locales: Locale[] = ['en', 'es', 'fr', 'de']
```

### 2. Add Language Metadata

```typescript
// lib/i18n.ts
export const languages = {
  en: { name: 'English', nativeName: 'English', flag: '🇺🇸' },
  es: { name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  fr: { name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  de: { name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' }, // New
}
```

### 3. Add Translations

```typescript
// lib/i18n.ts
export const translations = {
  // ... existing
  de: {
    siteName: 'Entkoppelte Nachrichten',
    siteDescription: 'Mehrsprachige Nachrichten mit Drupal und Next.js',
    latestNews: 'Neueste Nachrichten',
    readMore: 'Weiterlesen',
    publishedOn: 'Veröffentlicht am',
    noArticles: 'Keine Artikel gefunden',
    setupRequired: 'Einrichtung erforderlich',
    setupDescription: 'Führen Sie das Setup-Skript aus...',
    language: 'Sprache',
    home: 'Startseite',
  },
}
```

### 4. Add Date Locale

```typescript
// lib/i18n.ts
export function formatDate(timestamp: number, locale: Locale): string {
  const localeMap = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE', // New
  }
  // ...
}
```

### 5. Add Content

Update `data/lang-content.json`:

```json
{
  "id": "lang-de",
  "type": "taxonomy_term.language",
  "values": {
    "name": "Deutsch",
    "code": "de"
  }
}
```

Then create German articles following the same pattern as existing content.

### 6. Re-import Content

```bash
npm run setup-content
```

## GraphQL Queries

### Fetching News Articles

The current query fetches all articles:

```graphql
query GetNewsByLanguage($first: Int = 10) {
  nodeNewsArticles(first: $first, sortKey: CREATED_AT) {
    nodes {
      id
      title
      path
      # ... fields
      language {
        ... on TermLanguage {
          id
          name
          code
        }
      }
    }
  }
}
```

Filtering happens on the frontend in `app/[locale]/page.tsx`.

### Adding Server-Side Filtering

If you want to filter on the server (requires GraphQL schema support):

```typescript
// Hypothetical - requires Drupal module changes
const GET_NEWS_BY_LANGCODE = gql`
  query GetNewsByLangcode($langcode: String!, $first: Int = 10) {
    nodeNewsArticles(
      first: $first,
      sortKey: CREATED_AT,
      filter: { language: { code: { eq: $langcode } } }
    ) {
      nodes {
        # ... fields
      }
    }
  }
`
```

## Content Import Format

### Language Taxonomy Term

```json
{
  "id": "lang-en",
  "type": "taxonomy_term.language",
  "values": {
    "name": "English",
    "code": "en"
  }
}
```

### News Article

```json
{
  "id": "news-example-en",
  "type": "node.news_article",
  "path": "/en/news/article-slug",
  "values": {
    "title": "Article Title",
    "language": ["lang-en"],
    "summary": "<p>Brief summary text</p>",
    "body": "<p>Full article content...</p>",
    "image": {
      "uri": "https://example.com/image.jpg",
      "alt": "Image description",
      "title": "Image title"
    }
  }
}
```

### URL Path Conventions

Use locale-prefixed paths for consistency:
- English: `/en/news/article-slug`
- Spanish: `/es/noticias/articulo-slug`
- French: `/fr/actualites/article-slug`

## Component Patterns

### Locale-Aware Component

```typescript
import { Locale } from '@/lib/types'
import { t } from '@/lib/i18n'

interface Props {
  locale: Locale
}

export default function MyComponent({ locale }: Props) {
  return (
    <div>
      <h1>{t(locale, 'latestNews')}</h1>
    </div>
  )
}
```

### Client Component with Locale

```typescript
'use client'

import { Locale } from '@/lib/types'

interface Props {
  locale: Locale
}

export default function InteractiveComponent({ locale }: Props) {
  // locale passed as prop from server component
  return <button>{/* ... */}</button>
}
```

## Testing Locales

### Development URLs

- http://localhost:3000/en - English
- http://localhost:3000/es - Spanish
- http://localhost:3000/fr - French

### Verify Language Switching

1. Visit any locale URL
2. Use the language switcher dropdown
3. Verify URL changes and content updates
4. Check that articles filter correctly

## Common Issues

### Articles Not Showing

1. Check that articles have the `language` field set
2. Verify the language term name matches (`English`, `Español`, `Français`)
3. Run `npm run setup-content` to re-import

### 404 on Locale Routes

1. Ensure locale is in `lib/types.ts` `locales` array
2. Check `app/[locale]/layout.tsx` validates the locale
3. Verify `next.config.js` redirect from `/` to `/en`

### Translations Missing

1. Add the key to ALL locales in `lib/i18n.ts`
2. TypeScript will error if a key is missing from any locale
3. Use the `t()` function with correct key name

## Deployment Checklist

- [ ] All environment variables set
- [ ] Content imported with all languages
- [ ] Test each locale URL works
- [ ] Verify language switcher functions
- [ ] Check images load correctly
- [ ] Test ISR revalidation

## Resources

- [Next.js Internationalization](https://nextjs.org/docs/app/building-your-application/routing/internationalization)
- [Decoupled.io Documentation](https://dashboard.decoupled.io)
- [GraphQL Compose for Drupal](https://www.drupal.org/project/graphql_compose)

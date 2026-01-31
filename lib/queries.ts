import { gql } from '@apollo/client'

// Get news articles with translations
export const GET_NEWS_BY_LANGUAGE = gql`
  query GetNewsByLanguage($first: Int = 10, $langcode: String) {
    nodeNewsArticles(first: $first, sortKey: CREATED_AT, langcode: $langcode) {
      nodes {
        id
        title
        path
        langcode {
          id
        }
        created {
          timestamp
        }
        changed {
          timestamp
        }
        ... on NodeNewsArticle {
          summary {
            processed
          }
          body {
            processed
          }
          image {
            url
            alt
            width
            height
            variations(styles: [LARGE, MEDIUM, THUMBNAIL]) {
              name
              url
              width
              height
            }
          }
        }
      }
    }
  }
`

// Get a single news article by path with translations
export const GET_NEWS_BY_PATH = gql`
  query GetNewsByPath($path: String!) {
    route(path: $path) {
      ... on RouteInternal {
        entity {
          ... on NodeNewsArticle {
            id
            title
            path
            langcode {
              id
            }
            created {
              timestamp
            }
            changed {
              timestamp
            }
            summary {
              processed
            }
            body {
              processed
            }
            image {
              url
              alt
              width
              height
              variations(styles: [LARGE, MEDIUM, THUMBNAIL]) {
                name
                url
                width
                height
              }
            }
            translations {
              path
              langcode {
                id
              }
            }
          }
        }
      }
    }
  }
`

import { gql } from '@apollo/client'

// Get news articles - filtered by URL path on the frontend
export const GET_NEWS_BY_LANGUAGE = gql`
  query GetNewsByLanguage($first: Int = 10) {
    nodeNewsArticles(first: $first, sortKey: CREATED_AT) {
      nodes {
        id
        title
        path
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

// Get a single news article by path
export const GET_NEWS_BY_PATH = gql`
  query GetNewsByPath($path: String!) {
    route(path: $path) {
      ... on RouteInternal {
        entity {
          ... on NodeNewsArticle {
            id
            title
            path
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
    }
  }
`

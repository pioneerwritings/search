import algoliasearch from 'algoliasearch'

const appID = process.env.ALGOLIA_APP_ID!
const adminkey = process.env.ALGOLIA_ADMIN_KEY!
const searchkey = process.env.ALGOLIA_SEARCH_KEY!

export const algoliaAdmin = (
  algoliasearch(appID, adminkey)
  .initIndex('articles')
)
export const client = (
  algoliasearch(appID, searchkey)
)
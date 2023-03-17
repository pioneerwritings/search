
export const isServer = typeof document === 'undefined'

export const isProduction = (
  // APP_ENV is enabled only for the staging env
  process.env.NODE_ENV === 'production' && process.env.APP_ENV === undefined
)

export const BASE_OG_IMAGE_URL = 'https://opengraph.pioneerwritings.com'

export const ogImagePath = `${BASE_OG_IMAGE_URL}/og-article.jpg`
export const ogSeriesImg = `${BASE_OG_IMAGE_URL}/og-series.jpg`

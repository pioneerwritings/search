export const isProduction = (
  // APP_ENV is enabled only for the staging env
  process.env.NODE_ENV === 'production' && process.env.APP_ENV === undefined
)

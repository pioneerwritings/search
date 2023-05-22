import { CustomWindow } from '~/types'
import { isServer } from '~/config'

declare const window: CustomWindow
const env = !isServer ? window.env : process.env

export const fetchData = async <T>(type: string, query?: string) => {
  const url = `${env.STRAPI_API_URL}/${type}`

  const res = await fetch(query ? `${url}?${query}` : url, {
    headers: {
      'cache-control':
        's-max-age=2592000, stale-while-revalidate=86400, stale-if-error=604800'
    }
  })

  return (await res.json()) as T
}

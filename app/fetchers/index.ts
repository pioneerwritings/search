import { CustomWindow } from '~/types'

declare const window: CustomWindow
const env = typeof document !== 'undefined' ? window.env : process.env

export const fetchData = async <T>(type: string, query?: string) => {
  const url = `${env.STRAPI_API_URL}/${type}`
  const res = await fetch(query ? `${url}?${query}` : url)

  return await res.json() as T
}
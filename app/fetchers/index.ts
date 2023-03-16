import { CustomWindow } from '~/types'
import { isServer } from '~/config'
import { useEnv } from '~/hooks'

export const fetchData = async <T>(type: string, query?: string) => {
  const { STRAPI_API_URL } = useEnv()
  
  const url = `${STRAPI_API_URL}/${type}`
  const res = await fetch(query ? `${url}?${query}` : url)

  return await res.json() as T
}
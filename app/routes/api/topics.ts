import { type LoaderFunction } from '@remix-run/node'
import { type CMSTopicResponse } from '~/types'
import { fetchData } from '~/fetchers'

export const loader: LoaderFunction = async () => {
  const res = await fetchData<CMSTopicResponse>('topics')

  return {
    topics: res.data
  }
}
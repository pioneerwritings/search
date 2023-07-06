import { type LoaderFunction } from '@remix-run/node'
import { type CMSArticleResponse } from '~/types'
import { fetchData } from '~/fetchers'
import { normalizeArticle } from '~/utils'

import qs from 'qs'

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams
  const topic = params.get('topic')

  const q = qs.stringify(
    {
      filters: { topic: { name: { $eq: topic } } }
    },
    { encodeValuesOnly: true }
  )

  const res = await fetchData<CMSArticleResponse>('articles', q)

  return {
    results: res?.data?.map(normalizeArticle)
  }
}

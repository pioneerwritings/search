import { type LoaderFunction, json } from '@remix-run/node'
import { type CMSArticleResponse } from '~/types'
import { fetchData } from '~/fetchers'
import { normalizeArticle } from '~/utils'

import qs from 'qs'

export const config = {
  runtime: 'edge'
}

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

  return json(
    {
      results: res.data.map(normalizeArticle)
    },
    {
      headers: {
        'content-type': 'application/json',
        'cache-control':
          's-max-age=2592000, stale-while-revalidate=86400, stale-if-error=604800'
      }
    }
  )
}

import { defer, type LoaderArgs } from '@remix-run/node'
import { useLoaderData, useFetcher, Await } from '@remix-run/react'
import { Card, TopicsCarousel, Show } from '~/components'
import { useRecoilState } from 'recoil'
import { isSeries, normalizeArticle } from '~/utils'
import { useScrollBottom, useGoogleAnalytics } from '~/hooks'
import { useState, useEffect, Suspense } from 'react'
import { fetchData } from '~/fetchers'
import { styles } from '~/styles/home'
import { footerState } from '~/state'

import {
  type Article,
  type CMSTopicResponse,
  type CMSArticleResponse
} from '~/types'

import Spinner from 'react-spinner-material'
import qs from 'qs'

const LIMIT = 15

export const loader = async ({ request }: LoaderArgs) => {
  const params = new URL(request.url).searchParams

  const q = qs.stringify(
    {
      pagination: {
        start: params.get('pagination[start]') ?? 0,
        limit: params.get('pagination[limit]') ?? LIMIT
      },
      sort: ['id:desc']
    },
    { encodeValuesOnly: true }
  )

  const res = await fetchData<CMSArticleResponse>('articles', q)

  return defer({
    total: res.meta?.pagination?.total,
    topics: fetchData<CMSTopicResponse>('topics'),
    articles: res.data.map(normalizeArticle)
  })
}

type FetcherResponse = {
  articles?: Article[]
  results?: Article[]
}

export default function Index() {
  const initialData = useLoaderData<typeof loader>()

  const [articles, setArticles] = useState<Article[]>(initialData.articles)
  const [results, setResults] = useState<Article[]>()
  const [topic, setTopic] = useState<string>()
  const [start, setStart] = useState<number>(LIMIT)
  const [_, setFooterState] = useRecoilState(footerState)

  const { data, load, state } = useFetcher<FetcherResponse>()
  const { bottom } = useScrollBottom()
  const { GA4 } = useGoogleAnalytics()

  const canScroll = articles.length !== initialData.total
  const articleList: Article[] = topic && results ? results : articles

  useEffect(() => {
    setFooterState({
      active: !canScroll || !!topic,
      bottom: (!canScroll && bottom) || (!!topic && bottom)
    })
  }, [articles, bottom, canScroll, topic])

  useEffect(() => {
    if (topic) {
      load(`/api/results?topic=${topic}`)
    }
  }, [topic])

  useEffect(() => {
    if (bottom && !topic) {
      const qs = new URLSearchParams([
        ['pagination[start]', String(start)],
        ['pagination[limit]', String(LIMIT)]
      ])
      load(`/?index&${qs}`)
    }
  }, [bottom])

  useEffect(() => {
    if (!data) return

    if (data.results) {
      setResults(data.results)
    }
    if (data.articles) {
      setStart(start + LIMIT)
      setArticles([...articles, ...data.articles])
    }
  }, [data])

  const handleTopicChange = (topic: string) => {
    setTopic(topic)
    GA4?.gtag('event', 'topic_select', { topic })
  }

  return (
    <div className={styles.page}>
      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={initialData.topics}>
          {({ data }) => {
            const topics = data.map((t) => t.attributes.name)

            return (
              <TopicsCarousel
                data={topics}
                onClick={handleTopicChange}
                activeItem={topic ?? ''}
              />
            )
          }}
        </Await>
      </Suspense>

      <div
        className={styles.gridContainer}
        role='feed'
        aria-label='Latest articles'
        aria-busy={state === 'loading'}>
        <div className={styles.grid}>
          {articleList?.map((article) => {
            const { id, title } = article
            const series = isSeries(title)

            return (
              <Card
                {...article}
                type='article'
                heading={title}
                key={id}
                seriesLabel={series ? 'Series' : ''}
              />
            )
          })}
        </div>
      </div>

      <Show when={state === 'loading'}>
        <Spinner
          visible
          color='#7570FA'
          stroke={2}
          radius={30}
          className='mx-auto mt-6'
        />
      </Show>
    </div>
  )
}

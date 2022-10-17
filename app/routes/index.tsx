import { LoaderFunction } from '@remix-run/node'
import { useLoaderData, useFetcher } from '@remix-run/react'
import { Card, TopicsCarousel, Show } from '~/components'
import { useRecoilState } from 'recoil'
import { isSeries, normalizeArticle } from '~/utils'
import { useScrollBottom } from '~/hooks'
import { useState, useEffect } from 'react'
import { fetchData } from '~/fetchers'
import { styles } from '~/styles/home'
import { footerState } from '~/state'

import {
  type Article,
  type CMSTopicResponse,
  type CMSArticleResponse,
  type CMSTopic,
  type Series
} from '~/types'

import Spinner from 'react-spinner-material'
import qs from 'qs'

const LIMIT = 15

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams

  const q = qs.stringify({
    pagination: {
      start: params.get('pagination[start]') ?? 0,
      limit: params.get('pagination[limit]') ?? LIMIT
    }, sort: ['id:desc'] }, { encodeValuesOnly: true
  })

  const res = await fetchData<CMSArticleResponse>('articles', q)
  const res2 = await fetchData<CMSTopicResponse>('topics')

  return {
    total: res.meta?.pagination?.total,
    topics: res2.data.map(topic => topic.attributes.name),
    articles: res.data.map(
      normalizeArticle
    )
  }
}

type FetcherResponse = {
  articles?: Article[]
  topics?: CMSTopic[]
  series?: Series[]
  results?: Article[]
}

type LoaderData = {
  topics: string[]
  articles: Article[],
  total: number
}

export default function Index() {
  const initialData = useLoaderData<LoaderData>()
  
  const [ articles, setArticles ] = useState<Article[]>(initialData.articles)
  const [ results, setResults ] = useState<Article[]>()
  const [ topic, setTopic ] = useState<string>()
  const [ start, setStart ] = useState<number>(LIMIT)
  const [ _, setFooterState ] = useRecoilState(footerState)

  const { data, load, state } = useFetcher<FetcherResponse>()
  const { bottom } = useScrollBottom()
  const { topics } = initialData

  const canScroll = (articles.length !== initialData.total)

  const articleList: Article[] = (
    topic && results ? results : articles
  )

  useEffect(() => {
    setFooterState({
      active: !canScroll || !!topic,
      bottom: (!canScroll && bottom) || !!topic && bottom
    })
  }, [articles, bottom, canScroll, topic])

  useEffect(() => {
    if(topic){
      load(`/api/results?topic=${topic}`)
    }
  }, [topic])

  useEffect(() => {    
    if(canScroll && bottom && !topic){
      const qs = new URLSearchParams([
        ['pagination[start]', String(start)],
        ['pagination[limit]', String(LIMIT)]
      ])
      load(`/?index&${qs}`)
    }
  }, [bottom])

  useEffect(() => {
    if(data !== undefined){
      if(data.results){
        setResults(data.results)
      }
      if(data.articles){
        setStart(start + LIMIT)
        setArticles([ ...articles, ...data.articles ])
      }
    }
  }, [data])

  const handleTopicChange = (topic: string) => {
    setTopic(topic)
    
    // if(isProduction){
    //   GA4?.gtag('event', 'topic_select', {
    //     topic: topic.value
    //   })
    // }
  }

  return (
    <div className={styles.page}>
      <TopicsCarousel
        data={topics}
        title='Topics'
        onClick={handleTopicChange}
        activeItem={topic ?? ''}
      />

      <div className={styles.gridContainer}
        role='feed'
        aria-label='Latest articles'
        aria-busy={state === 'loading'}>

        <div className={styles.grid}>

          {
            articleList?.map((article) => {
              const { id, title } = article
              const series = isSeries(title)

              return (
                <Card
                  {...article}
                  type='articles'
                  heading={title}
                  key={id}
                  seriesLabel={series ? 'Series' : ''}
                />
              )
            })
          }
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

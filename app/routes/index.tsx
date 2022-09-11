import { LoaderFunction } from '@remix-run/node'
import { useLoaderData, useFetcher } from '@remix-run/react'
import { Card, Show, Dropdown, ScrollTop } from '~/components'
import { isSeries, normalizeArticle } from '~/utils'
import { useScrollBottom } from '~/hooks'
import { useState, useEffect } from 'react'
import { fetchData } from '~/fetchers'
import { styles } from '~/styles/home'

import {
  type Article,
  type CMSArticleResponse,
  type CMSTopic,
  Series, DropdownItem
} from '~/types'

import Spinner from 'react-spinner-material'
import qs from 'qs'

type SearchCategory = 'articles' | 'series' | 'topics'
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

  return {
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

export default function Index() {
  const initialData = useLoaderData<{ articles: Article[]}>()
  const { data, load, state } = useFetcher<FetcherResponse>()

  const [ category, setCategory ] = useState<SearchCategory>('articles')
  const [ articles, setArticles ] = useState<Article[]>(initialData.articles)
  const [ results, setResults ] = useState<Article[]>()
  const [ series, setSeries ] = useState<Series[]>()
  const [ topics, setTopics ] = useState<string[]>([])
  const [ topic, setTopic ] = useState<DropdownItem>()
  const [ start, setStart ] = useState<number>(LIMIT)

  const { bottom } = useScrollBottom()  

  useEffect(() => load('/api/topics'), [])

  useEffect(() => {
    if(topic){
      load(`/api/results?topic=${topic.value}`)
    }
  }, [topic])

  useEffect(() => {
    if(category === 'series' && !series){
      load('/api/series')
    }
  }, [category])

  useEffect(() => {    
    if(category === 'articles' && bottom){
      const qs = new URLSearchParams([
        ['pagination[start]', String(start)],
        ['pagination[limit]', String(LIMIT)]
      ])
      load(`/?index&${qs}`)
    }
  }, [bottom])

  useEffect(() => {
    if(data !== undefined){
      if(data.topics){
        setTopics(data.topics.map(({ attributes }) => {
          return attributes.name
        }))
      }
      if(data.results){
        setResults(data.results)
      }
      if(data.series){
        setSeries(data.series)
      }
      if(data.articles){
        setStart(start + LIMIT)
        setArticles([ ...articles, ...data.articles ])
      }
    }
  }, [data])

  const handleTabSelect = (tab: SearchCategory) => {
    setCategory(tab)
  }

  const handleTopicChange = (topic: DropdownItem) => {
    setTopic(topic)
    
    // if(isProduction){
    //   GA4?.gtag('event', 'topic_select', {
    //     topic: topic.value
    //   })
    // }
  }

  const articleList = (): Article[] | null => {
    if(category === 'topics' && results){
      return results
    }
    if(category === 'articles') {
      return articles
    }
    return null
  }

  return (
    <div className={styles.page}>
      <div
        className={styles.tabs}
        role='tablist'
        aria-label='Select a category'>
          {
            ['Articles', 'Series', 'Topics'].map((tab) => {
              const c = tab.toLowerCase() as SearchCategory, id = `${c}-tab`

              return (
                <button
                  key={id} className={styles.tab}
                  role='tab'
                  aria-labelledby={id}
                  aria-selected={c === category}
                  onClick={() => handleTabSelect(c)}
                  tabIndex={0}>
                  <span id={id}>{tab}</span>
                </button>
              )
            })
          }
      </div>

      <Show when={category === 'topics'}>
        <Dropdown
          className='mx-auto max-w-[368px] mb-8'
          selected={topic}
          onChange={handleTopicChange}
          placeholder='Select topic'
          ariaLabel='Topics'
          list={topics.map((topic, i) => ({ id: i, value: topic }) )}
        />
      </Show>

      <Show when={
        state === 'loading' && category === 'series' ||
        state === 'loading' && category === 'topics'
      }>
        <Spinner
          visible
          color='#7570FA'
          stroke={2}
          radius={30}
          className='mx-auto my-6'
        />
      </Show>

      <div className={styles.gridContainer}
        role='feed'
        aria-label='Latest articles'>

        <div className={styles.grid}
          aria-busy={state === 'loading'}
          aria-label='Article feed'
          role='grid'>

          <Show when={category === 'articles' || category == 'topics'}>
            {
              articleList()?.map((article) => {
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
          </Show>

          <Show when={category === 'series'}>
            {
              series?.map(series => {
                const { id, articles, name, description, ...s } = series

                return (
                  <Card
                    {...s}
                    type='series'
                    seriesLabel={`${articles.length} Parts`}
                    id={id}
                    key={id}
                    heading={name}
                    excerpt={description}
                  />
                )
              })
            }
          </Show>
        </div>
      </div>

      <Show when={state === 'loading' && category === 'articles'}>
        <Spinner
          visible
          color='#7570FA'
          stroke={2}
          radius={30}
          className='mx-auto mt-6'
        />
      </Show>

      <ScrollTop />
    </div>
  )
}

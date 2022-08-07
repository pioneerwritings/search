import { LoaderFunction, json } from '@remix-run/node'
import { useLoaderData, useFetcher } from '@remix-run/react'
import { Card, CardLinks, Show } from '~/components'
import { isSeries } from '~/utils'
import { useScrollBottom } from '~/hooks'
import { useState, useEffect } from 'react'
import { ArticleDocument, Series } from '~/types'

import styles from '~/styles/routes/home/home.css'
import qs from 'qs'

type SearchCategory = 'articles' | 'series' | 'topics'
const LIMIT = 15

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams
  const url = process.env.STRAPI_API_URL as string
  const cat = params.get('category')

  const query = qs.stringify({
    pagination: {
      start: params.get('pagination[start]') ?? 0,
      limit: params.get('pagination[limit]') ?? LIMIT
    },sort: ['id:desc'] }, { encodeValuesOnly: true
  })

  const articles = await fetch(`${url}/articles?${query}`)

  if(cat && cat === 'series'){
    const series = await fetch(`${url}/series`)
    return json({ series: await series.json() })
  }
  if(cat && cat === 'topics'){
    const topics = await fetch(`${url}/topics`)
    return json({ topics: await topics.json() })
  }
  return json({
    articles: await articles.json()
  })
}

export const links = () => [
  ...CardLinks(), { rel: 'stylesheet', href: styles }
]

export default function Index() {
  const [ category, setCategory ] = useState<SearchCategory>('articles')
  const [ articles, setArticles ] = useState<ArticleDocument[]>(useLoaderData().articles.data)
  const [ series, setSeries ] = useState<Series[]>()
  const [ topics, setTopics ] = useState<string[]>()
  const [ start, setStart ] = useState<number>(LIMIT)

  const { bottom } = useScrollBottom()
  const { data, load, state } = useFetcher()

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
    if(data){
      if(category === 'articles'){
        setStart(start + LIMIT)
        setArticles(prev => [...prev, ...data.articles.data ])
      }
      if(category === 'series'){
        setSeries(data.series.data)
      }
      if(category === 'topics'){
        setTopics(data.topics.data)
      }
    }
  }, [data])

  useEffect(() => {
    if(category === 'series' && !series){
      return load(`/?index&category=series`)
    }
    if(category === 'topics' && !topics){
      return load(`/?index&category=topics`)
    }
  }, [category])

  const handleTabSelect = (tab: SearchCategory) => {
    setCategory(tab)
  }

  return (
    <div className='home'>
      <div
        className='tabs'
        role='tablist'
        aria-label='Select a category'>
          {
            ['Articles', 'Series', 'Topics'].map((tab) => {
              const c = tab.toLowerCase() as SearchCategory, id = `${c}-tab`

              return (
                <button
                  key={id}
                  className='tab'
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

      <Show when={state === 'loading'}>
        <div className='loading'>
          <small>Loading data...</small>
        </div>
      </Show>

      <div role='feed' aria-label='Latest articles'>
        <div role='grid'>
          <Show when={category === 'articles'}>
            {
              articles?.map((article: any) => {
                const { id, attributes } = article
                const { author, topic } = attributes
                
                const series = isSeries(attributes.title)

                return (
                  <Card
                    key={id}
                    id={id}
                    title={attributes.title}
                    excerpt={attributes.excerpt}
                    author={author.data.attributes.name}
                    topic={topic.data.attributes.name}
                    seriesLabel={series ? 'Series' : ''}
                  />
                )
              })
            }
          </Show>

          <Show when={category === 'series'}>
            {
              series?.map((series: any) => {
                const { id, attributes } = series
                const { author, topic, articles } = attributes

                return (
                  <Card
                    key={id}
                    id={id}
                    title={attributes.name}
                    excerpt={attributes.description}
                    author={author.data.attributes.name}
                    topic={topic.data.attributes.name}
                    seriesLabel={`${articles.data.length} Parts`}
                  />
                )
              })
            }
          </Show>
        </div>
      </div>
    </div>
  )
}

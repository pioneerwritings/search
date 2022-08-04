import { LoaderFunction, json } from '@remix-run/node'
import { useLoaderData, useFetcher } from '@remix-run/react'
import { Card, CardLinks, Show } from '~/components'
import { isSeries } from '~/utils'
import { useScrollBottom } from '~/hooks'
import { useState, useEffect } from 'react'
import { ArticleDocument } from '~/types'

import styles from '~/styles/routes/app/app.css'
import qs from 'qs'

type SearchCategory = 'articles' | 'series' | 'topic'

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams
  const url = process.env.STRAPI_API_URL as string
  const init = !params.get('pagination[start]')

  const query = qs.stringify({
    pagination: {
      start: params.get('pagination[start]') ?? 0,
      limit: params.get('pagination[limit]') ?? 15
    },sort: ['id:desc'] }, { encodeValuesOnly: true
  })

  const res1 = await fetch(`${url}/articles?${query}`)

  if(init){
    // const res2 = await fetch(`${url}/series`)
    // const res3 = await fetch(`${url}/topics`)

    return json({
      articles: await res1.json(),
      // series: await res2.json(),
      // topics: await res3.json()
    })
  }
  return json<ArticleDocument[]>(
    await res1.json()
  )
}

export const links = () => [
  ...CardLinks(),
  { rel: 'stylesheet', href: styles }
]

const LIMIT = 15

export default function Index() {
  // const { series, topics } = useLoaderData()
  const [ category, setCategory ] = useState<SearchCategory>('articles')
  const [ articles, setArticles ] = useState<ArticleDocument[]>(useLoaderData().articles.data)
  const [ start, setStart ] = useState<number>(LIMIT)
  const { bottom } = useScrollBottom()
  const { data, load } = useFetcher()

  useEffect(() => {    
    if(bottom){
      const qs = new URLSearchParams([
        ['pagination[start]', String(start)],
        ['pagination[limit]', String(LIMIT)]
      ])
      load(`/?index&${qs}`)
    }
  }, [bottom])

  useEffect(() => {
    if(data){
      setStart(start + LIMIT)
      setArticles(prev => [...prev, ...data.data ])
    }
  }, [data])

  const handleTabSelect = (tab: SearchCategory) => {
    setCategory(tab)
  }

  return (
    <div className='app'>
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

      <div role='feed' aria-label='Latest articles'>
        <div role='grid'>
          <Show when={category === 'articles'}>
            {
              articles.map((article: any) => {
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
            {/* {
              series.data.map((series: any) => {
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
            } */}
          </Show>
        </div>
      </div>
    </div>
  )
}

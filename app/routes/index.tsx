import { LoaderFunction, json } from '@remix-run/node'
import { useLoaderData, useFetcher } from '@remix-run/react'
import { Card, Show, Dropdown } from '~/components'
import { isSeries } from '~/utils'
import { useScrollBottom } from '~/hooks'
import { useState, useEffect } from 'react'
import { ArticleDocument, Series, DropdownItem } from '~/types'
import { styles } from '~/styles/home'

import Spinner from 'react-spinner-material'
import qs from 'qs'

type SearchCategory = 'articles' | 'series' | 'topics'
const LIMIT = 15

export const loader: LoaderFunction = async ({ request }) => {
  const params = new URL(request.url).searchParams
  const topic = params.get('topic')
  const series = params.get('series')
  const url = process.env.STRAPI_API_URL as string
  const initial = !params.get('pagination[start]')

  const query = qs.stringify({
    pagination: {
      start: params.get('pagination[start]') ?? 0,
      limit: params.get('pagination[limit]') ?? LIMIT
    }, sort: ['id:desc'] }, { encodeValuesOnly: true
  })

  const articles = (
    await (await fetch(`${url}/articles?${query}`)).json()
  )

  if(topic){
    const q = qs.stringify({
      filters: { topic: { name: { $eq: topic } } }
    }, { encodeValuesOnly: true })
    
    return json({
      results: await(await fetch(`${url}/articles?${q}`)).json()
    })
  }
  if(series){
    const series = await fetch(`${url}/series`)
    return json({ series: await series.json() })
  }
  if(initial){
    return json({
      articles, topics: await(await fetch(`${url}/topics`)).json()
    })
  }
  return json({ articles })
}

export default function Index() {
  const initialData = useLoaderData()

  const [ category, setCategory ] = useState<SearchCategory>('articles')
  const [ articles, setArticles ] = useState<ArticleDocument[]>(initialData.articles.data)
  const [ results, setResults ] = useState<ArticleDocument[]>([])
  const [ series, setSeries ] = useState<Series[]>([])
  const [ topics ] = useState<string[]>(initialData.topics.data)
  const [ topic, setTopic ] = useState<DropdownItem>()
  const [ start, setStart ] = useState<number>(LIMIT)

  const { bottom } = useScrollBottom()
  const { data, load, state } = useFetcher()

  useEffect(() => {
    load(`/?index&topic=${topic?.value}`)
  }, [topic])

  useEffect(() => {
    if(category === 'series' && !series.length){
      load('/?index&series=true')
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
    if(data){
      if('results' in data){
        setResults(data.results.data)
      }
      if('series' in data){
        setSeries(data.series.data)
      }
      if('articles' in data){
        setStart(start + LIMIT)
        setArticles(prev => [...prev, ...data.articles.data ])
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

  const articleList = (): ArticleDocument[] | undefined => {
    if(category === 'articles'){
      return articles
    }
    if(category === 'topics'){
      return results
    }
  }

  return (
    <div className='py-12 px-6'>
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
          list={
            topics?.map((topic: any, i) => ({
              id: i,
              value: topic.attributes.name
            })
          )}
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
              articleList()?.map((article: any) => {
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

      <Show when={state === 'loading' && category === 'articles'}>
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

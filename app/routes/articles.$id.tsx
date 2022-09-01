import { LoaderFunction, json } from '@remix-run/node'
import { useLoaderData, useLocation } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { Show, ScrollTop } from '~/components'
import { isSeries } from '~/utils'
import { styles } from '~/styles/routes/article/article'

import markStyles from '~/styles/routes/article/mark.css'
import Highlight from 'mark.js'

export const loader: LoaderFunction = async ({ params }) => { 
  const id  = params.id as string
  const url = process.env.STRAPI_API_URL as string
  const res = await fetch(`${url}/articles/${id}`)

  const article = await res.json()
  const title: string = article.data.attributes.title
  
  if(!isSeries(title)){
    return json({ article })
  }

  const name   = title.split('—').filter(str => !Number(str)).join('—').trim()
  const res2   = await fetch(`${url}/series?filters[name][$eq]=${name.trim()}`)
  const series = await res2.json()

  if(!series.data.length){
    return json({ article })
  }
  const num = series.data[0].attributes.articles.data.findIndex((a: any) => a.attributes.title === title) + 1
  const len = series?.data[0].attributes.articles.data.length

  const prevArticle = (): string | null => {
    if(num > 1){
      const index = num - 2
      return series.data[0].attributes.articles.data[index].id
    }
    return null
  }

  const nextArticle = (): string | null => {
    if(num < len){
      return series.data[0].attributes.articles.data[num].id
    }
    return null
  }

  return json({
    article,
    
    series: {
      prev: prevArticle(),
      next: nextArticle()
    }
  })
}

export const links = () => [
  { rel: 'stylesheet', href: markStyles }
]

export default function ArticlePage(){
  const { article, series } = useLoaderData()
  const { state } = useLocation()

  const { data: { attributes } } = article
  const { title, subtitle, author, body, periodical } = attributes

  const periodicalName = periodical.data.attributes.name
  const authorName = author.data.attributes.name
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if(bodyRef.current && state?.query){
      const query = state.query

      new Highlight(bodyRef.current).mark(
        query, {
        diacritics: true,
        ignorePunctuation: [`'`, `"`],

        accuracy: {
          value: 'exactly',
          limiters: [',', '.', '?', '!', ';', ':', '-', '—']
        },
        filter: (node, term, totalCounter, counter) => {
          return (
            query.split(' ').includes(term) && 
            counter > 35 ? false : true
          )
        }
      })
    }
  }, [state])

  return (
    <article className={styles.article}>
      <main className={styles.main} role='main'>
        <h1 className={styles.h1}>{title}</h1>
        <p className={styles.periodical}>{periodicalName}</p>
        <address className={styles.author}>By {authorName}</address>

        <Show when={!!subtitle}>
          <small className={styles.subtitle}>
            {subtitle}
          </small>
        </Show>

        <div className='body' ref={bodyRef}>
          {
            body
            .split('\n')
            .filter((p: string) => p !== '')
            .map((p: string, i: number) => {
              return (<p className={styles.p} key={i}>{p}</p>)
            })
          }
        </div>

        <ScrollTop />
      </main>
    </article>
  )
}
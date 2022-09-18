import { LoaderFunction, json } from '@remix-run/node'
import { useLoaderData, useNavigate, useLocation } from '@remix-run/react'
import { useEffect, useRef } from 'react'
import { Show } from '~/components'
import { isSeries, normalizeArticle, normalizeSeries } from '~/utils'
import { styles } from '~/styles/routes/article/article'
import { CMSSingleArticleResponse, Article, CMSSeriesResponse } from '~/types'
import { useScrollBottom } from '~/hooks'
import { fetchData } from '~/fetchers'
import { useRecoilState } from 'recoil'
import { footerState as FooterState } from '~/state'

import markStyles from '~/styles/routes/article/mark.css'
import Highlight from 'mark.js'

interface LoaderResponse {
  article: Article
  series?: {
    name: string
    part: string
    prev: string | null
    next: string | null
  }
}

interface LocationState {
  query?: string
}

export const loader: LoaderFunction = async ({ params }) => { 
  const res = await fetchData<CMSSingleArticleResponse>(
    `articles/${params.id}`
  )

  const article = normalizeArticle(res.data)
  const title = article?.title
  const part = isSeries(title) as string
  
  if(!isSeries(title)){
    return json({ article })
  }

  const name   = title.split('—').filter(str => !Number(str)).join('—').trim()
  const res2   = (await fetchData<CMSSeriesResponse>('series', `filters[name][$eq]=${name.trim()}`)).data
  const series = normalizeSeries(res2[0])

  if(!series){
    return json({ article })
  }
  const num = series.articles.findIndex((a) => a.title === title) + 1
  const len = series.articles.length

  const prevArticle = (): string | null => {
    if(num > 1){
      const index = num - 2
      return series.articles[index].id
    }
    return null
  }

  const nextArticle = (): string | null => {
    if(num < len){
      return series.articles[num].id
    }
    return null
  }

  return json<LoaderResponse>({
    article, series: {
      name,
      part,
      prev: prevArticle(),
      next: nextArticle()
    }
  })
}

export const links = () => [
  { rel: 'stylesheet', href: markStyles }
]

export default function ArticlePage(){
  const { article, series } = useLoaderData<LoaderResponse>()
  const { state } = useLocation<LocationState>()
  const [ _, setFooterState] = useRecoilState(FooterState)
  const { bottom } = useScrollBottom()
  const { title, subtitle, author, body, periodical } = article

  const navigate = useNavigate()
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setFooterState({
      active: true,
      bottom
    })
  }, [bottom])

  useEffect(() => {
    if(bodyRef.current && state?.query){
      const { query } = state

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

  const handlePrevClick = () => {
    if(series?.prev){
      navigate(`/articles/${series.prev}`)
    }
  }

  const handleNextClick = () => {
    if(series?.next){
      navigate(`/articles/${series.next}`)
    }
  }

  return (
    <article className={styles.article}>
      <main className={styles.main} role='main'>
        <Show when={!!series}>
          <span className={styles.badge}>
            {`Part ${series?.part}`}
          </span>
        </Show>

        <h1 className={styles.h1}>{series?.name || title}</h1>
        <p className={styles.periodical}>{periodical}</p>
        <address className={styles.author}>By {author}</address>

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

        <Show when={!!series}>
          <section className={styles.seriesPagerButtons}>
            <button
              onClick={handlePrevClick}
              className={styles.seriesPagerButton}
              aria-label='Go to the previous article in the series'
              disabled={!series?.prev}
              aria-disabled={!series?.prev}>
              <img
                className='mr-4'
                width={24}
                height={12}
                src='/images/left-arrow.svg'
                aria-hidden
                alt=''
              />
              Prev Article
            </button>

            <button
              onClick={handleNextClick}
              className={styles.seriesPagerButton}
              aria-label='Go to the next article in the series'
              disabled={!series?.next}
              aria-disabled={!series?.next}>
              Next Article

              <img
                className='ml-4'
                width={24}
                height={12}
                src='/images/right-arrow.svg'
                aria-hidden
                alt=''
              />
            </button>
          </section>
        </Show>
        
        <div className={styles.studyPrayShareContainer}>
          <h2 className={styles.studyPrayShareH2}>
            Study. Pray. <span className='text-indigo'>Share.</span>
          </h2>

          <div className={styles.studyPrayShareButtons}>
            <button
              type='button'
              aria-label='Copy this article link to share'
              className={`mx-4 ${styles.studyPrayShareButton}`}>
              <img src='/images/link-icon.svg' />
            </button>

            <button
              type='button'
              aria-label='Share this article on Facebook'
              className={styles.studyPrayShareButton}>
              <img src='/images/fb-icon.svg' />
            </button>
          </div>
        </div>
      </main>
    </article>
  )
}

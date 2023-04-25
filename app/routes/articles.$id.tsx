import { json, V2_MetaFunction, LoaderArgs } from '@remix-run/node'
import { useLoaderData, useNavigate, useLocation } from '@remix-run/react'
import { useEffect, useRef, useState } from 'react'
import { Show } from '~/components'
import { normalizeArticle, normalizeSeries } from '~/utils'
import { styles } from '~/styles/routes/article/article'
import type {
  CMSSingleArticleResponse,
  Article,
  CMSSingleSeriesResponse
} from '~/types'
import { useScrollBottom } from '~/hooks'
import { fetchData } from '~/fetchers'
import { useRecoilState } from 'recoil'
import { footerState as FooterState } from '~/state'
import { ogImagePath } from '~/config'

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

export const loader = async ({ params }: LoaderArgs) => {
  const response = await fetchData<CMSSingleArticleResponse>(
    `articles/${params.id}`
  )

  const article = normalizeArticle(response.data)
  const title = article?.title
  const series = article?.series

  if (!series) {
    return json({ article })
  }

  const { id, name } = series
  const res = (await fetchData<CMSSingleSeriesResponse>(`series/${id}`)).data

  const { articles } = normalizeSeries(res)

  const num = articles.findIndex((a) => a.title === title) + 1
  const len = articles.length

  const prevArticle = (): string | null => {
    if (num > 1) {
      const index = num - 2
      return articles[index].id
    }
    return null
  }

  const nextArticle = (): string | null => {
    if (num < len) {
      return articles[num].id
    }
    return null
  }

  return json<LoaderResponse>({
    article,
    series: {
      name,
      part: String(num),
      prev: prevArticle(),
      next: nextArticle()
    }
  })
}

export const links = () => [{ rel: 'stylesheet', href: markStyles }]

export const meta: V2_MetaFunction = ({ data }) => {
  const title = data.article.title.trim()
  const excerpt = data.article.excerpt.trim()

  return [
    { title },
    { charSet: 'utf-8' },
    {
      name: 'og:title',
      content: title
    },
    {
      name: 'og:description',
      content: excerpt
    },
    {
      name: 'og:type',
      content: 'article'
    },
    {
      name: 'description',
      content: excerpt
    },
    {
      name: 'viewport',
      content: 'width=device-width,initial-scale=1,user-scalable=yes'
    },
    {
      property: 'og:image',
      content: ogImagePath
    }
  ]
}

export default function ArticlePage() {
  const [copied, setCopied] = useState(false)
  const { article, series } = useLoaderData<LoaderResponse>()
  const { state } = useLocation<LocationState>()
  const [_, setFooterState] = useRecoilState(FooterState)
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
    setTimeout(() => setCopied(false), 7000)
  }, [copied])

  useEffect(() => {
    if (bodyRef.current && state?.query) {
      const { query } = state

      new Highlight(bodyRef.current).mark(query, {
        diacritics: true,
        ignorePunctuation: [`'`, `"`],

        accuracy: {
          value: 'exactly',
          limiters: [',', '.', '?', '!', ';', ':', '-', '—']
        },
        filter: (node, term, totalCounter, counter) => {
          return query.split(' ').includes(term) && counter > 35 ? false : true
        }
      })
    }
  }, [state])

  const handlePrevClick = () => {
    if (series?.prev) {
      navigate(`/articles/${series.prev}`)
    }
  }

  const handleNextClick = () => {
    if (series?.next) {
      navigate(`/articles/${series.next}`)
    }
  }

  const copyTextToClipboard = async () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href

      if ('clipboard' in navigator) {
        setCopied(true)
        return await navigator.clipboard.writeText(url)
      }
      return document.execCommand('copy', true, url)
    }
  }

  return (
    <article className={styles.article}>
      <main className={styles.main} role='main'>
        <Show when={!!series}>
          <span className={styles.badge}>{`Part ${series?.part}`}</span>
        </Show>

        <h1 className={styles.h1}>{series?.name || title}</h1>
        <p className={styles.periodical}>{periodical}</p>
        <address className={styles.author}>By {author}</address>

        <Show when={!!subtitle}>
          <small className={styles.subtitle}>{subtitle}</small>
        </Show>

        <div className='body' ref={bodyRef}>
          {body
            .split('\n')
            .filter((p: string) => p !== '')
            .map((p: string, i: number) => {
              return (
                <p className={styles.p} key={i}>
                  {p}
                </p>
              )
            })}
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
              className={`mx-4 ${styles.studyPrayShareButton}`}
              onClick={copyTextToClipboard}>
              <img src='/images/link-icon.svg' />

              <span className='ml-3'>{copied ? 'Copied!' : 'Copy Link'}</span>
            </button>
          </div>
        </div>
      </main>
    </article>
  )
}

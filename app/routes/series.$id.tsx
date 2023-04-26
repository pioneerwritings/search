import { LoaderFunction, MetaFunction } from '@remix-run/node'
import { fetchData } from '~/fetchers'
import { CMSSingleSeriesResponse, Series } from '~/types'
import { useLoaderData } from '@remix-run/react'
import { normalizeSeries } from '~/utils'
import { Card } from '~/components'
import { styles } from '~/styles/routes/series'
import { useEffect } from 'react'
import { footerState } from '~/state'
import { useRecoilState } from 'recoil'
import { ogSeriesImg } from '~/config'

export const loader: LoaderFunction = async ({ params }) => {
  const series = await fetchData<CMSSingleSeriesResponse>(`series/${params.id}`)
  return normalizeSeries(series.data)
}

export const meta: MetaFunction = ({ data }) => {
  const title = data.name.trim()
  const excerpt = data.description.trim()

  return {
    charset: 'utf-8',
    title,
    description: excerpt,
    'og:title': title,
    'og:description': excerpt,
    'og:image': ogSeriesImg,
    'og:type': 'website'
  }
}

export default function SeriesPage() {
  const { name, description, articles, author, topic } = useLoaderData<Series>()
  const [_, setFooterState] = useRecoilState(footerState)

  useEffect(() => {
    setFooterState({
      active: true,
      bottom: true
    })
  }, [])

  return (
    <div className={styles.page}>
      <span className={styles.series}>Series</span>

      <h1 className={styles.h1}>{name}</h1>

      <span className={styles.author}>By {author}</span>

      <p className={styles.description}>{description}</p>

      <div className={styles.gridContainer}>
        <div className={styles.grid} role='grid'>
          {articles.map((s, i) => {
            return (
              <Card
                {...s}
                type='article'
                seriesLabel={`Part ${i + 1}`}
                id={s.id}
                key={s.id}
                heading={name}
                excerpt={s.excerpt}
                author={author}
                topic={topic}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}

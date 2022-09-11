import { LoaderFunction } from '@remix-run/node'
import { fetchData } from '~/fetchers'
import { CMSSingleSeriesResponse, Series } from '~/types'
import { useLoaderData } from '@remix-run/react'
import { normalizeSeries } from '~/utils'
import { Card, ScrollTop } from '~/components'
import { styles } from '~/styles/routes/series'

export const loader: LoaderFunction = async ({ params }) => {
  const series = (await fetchData<CMSSingleSeriesResponse>(`series/${params.id}`))
  return normalizeSeries(series.data)
}

export default function SeriesPage(){
  const { name, description, articles, author, topic } = useLoaderData<Series>()

  return (
    <div className={styles.page}>
      <span className={styles.series}>
        Series
      </span>

      <h1 className={styles.h1}>
        {name}
      </h1>

      <span className={styles.author}>
        By {author}
      </span>

      <p className={styles.description}>
        {description}
      </p>

      <div className={styles.gridContainer}>
        <div className={styles.grid} role='grid'>
          {
            articles.map((s, i) => {
              return (
                <Card
                  {...s}
                  type='articles'
                  seriesLabel={`Part ${i + 1}`}
                  id={s.id}
                  key={s.id}
                  heading={name}
                  excerpt={s.excerpt}
                  author={author}
                  topic={topic}
                />
              )
            })
          }
        </div>
      </div>

      <ScrollTop />
    </div>
  )
}
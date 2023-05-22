import { defer, type LoaderArgs, type V2_MetaFunction } from '@remix-run/node'

import { fetchData } from '~/fetchers'
import { normalizeSeries } from '~/utils'
import { CMSSeries, CMSSeriesResponse } from '~/types'
import { Await, useLoaderData } from '@remix-run/react'
import { Card } from '~/components'
import { ogSeriesImg } from '~/config'
import { Suspense } from 'react'

export const loader = async ({}: LoaderArgs) => {
  return defer({
    seriesList: fetchData<CMSSeriesResponse>('series')
  })
}

export const meta: V2_MetaFunction = () => {
  const title = 'Series — Pioneer Writings'
  const description =
    'Series allows for a more productive reading experience by grouping all articles that belong to a series together in one place.'

  return [
    { title },
    { name: 'description', content: description },
    { name: 'og:title', content: title },
    { name: 'og:description', content: description },
    { name: 'og:image', content: ogSeriesImg }
  ]
}

export default function SeriesPage() {
  const { seriesList } = useLoaderData<typeof loader>()

  return (
    <main className='w-full min-h-screen pt-16 pb-36 px-8 antialiased'>
      <h1 className='leading-tight text-center font-heldane-bold text-3xl md:text-[2.5rem] antialiased'>
        Stay Focused With Series.
      </h1>

      <p className='max-w-lg text-center antialiased font-light mx-auto mt-3 mb-10'>
        Series allows for a more productive reading experience by grouping all
        articles that belong to a series together in one place.
      </p>

      <Suspense fallback={<p>Loading...</p>}>
        <Await resolve={seriesList}>
          {({ data }) => {
            const normalizedSeries = data.map((cmsSeries: unknown) => {
              return normalizeSeries(cmsSeries as CMSSeries)
            })
            return (
              <div
                className='m-auto md:max-w-3xl lg:max-w-3xl xl:max-w-6xl'
                role='feed'
                aria-label='All the series'>
                <div className='grid gap-6 w-full h-full grid-cols-[repeat(auto-fill,_minmax(320px,_1fr))] justify-items-center'>
                  {normalizedSeries.map((series) => {
                    const { id, name, description, ...attrs } = series

                    return (
                      <Card
                        {...attrs}
                        id={id}
                        excerpt={description}
                        title=''
                        periodical=''
                        type='series'
                        heading={name}
                        key={id}
                        seriesLabel='Series'
                      />
                    )
                  })}
                </div>
              </div>
            )
          }}
        </Await>
      </Suspense>
    </main>
  )
}

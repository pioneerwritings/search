import { json, LoaderArgs, MetaFunction } from "@remix-run/node"
import { fetchData } from '~/fetchers'
import { normalizeSeries } from '~/utils'
import { CMSSeriesResponse } from '~/types'
import { useLoaderData } from "@remix-run/react"
import { Card } from "~/components"
import { ogSeriesImg } from "~/config"

export const loader = async ({}: LoaderArgs) => {
  const { data } = await fetchData<CMSSeriesResponse>('series')
  
  return json({
    seriesList: data.map(normalizeSeries)
  })
}

export const meta: MetaFunction = ({ data }) => {
  const title       = 'Series — Pioneer Writings'
  const description = 'Series allows for a more productive reading experience by grouping all articles that belong to a series together in one place.'

  return {
    charset: "utf-8",
    title,
    description,
    'og:title': title,
    'og:description': description,
    'og:image': ogSeriesImg,
    'og:type': 'website'
  }
}

export default function SeriesPage(){
  const { seriesList } = useLoaderData<typeof loader>()

  return (
    <main className='w-full min-h-screen pt-16 pb-36 px-8 antialiased'>
      <h1 className='leading-tight text-center font-heldane-bold text-3xl md:text-[2.5rem] antialiased'>
        Stay Focused With Series.
      </h1>

      <p className='max-w-lg text-center antialiased font-light mx-auto mt-3 mb-10'>
        Series allows for a more productive reading experience by grouping all articles
        that belong to a series together in one place.
      </p>

      <div className='m-auto md:max-w-3xl lg:max-w-3xl xl:max-w-6xl' role='feed' aria-label='All the series'>
        <div className='grid gap-6 w-full h-full grid-cols-[repeat(auto-fill,_minmax(320px,_1fr))] justify-items-center'>
          {
            seriesList.map((series) => {
              const { id, name, description, ...attrs } = series

              return (
                <Card
                  {...attrs}
                  id={id}
                  excerpt={description}
                  type='series'
                  heading={name}
                  key={id}
                  seriesLabel='Series'
                />
              )
            })
          }
        </div>
      </div>
    </main>
  )
}
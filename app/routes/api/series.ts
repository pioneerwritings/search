import { LoaderFunction } from '@remix-run/node'
import { fetchData } from '~/fetchers'
import { CMSSeriesResponse } from '~/types'
import { normalizeSeries } from '~/utils'

export const loader: LoaderFunction = async () => {
  const res = await fetchData<CMSSeriesResponse>('series')

  return {
    series: res.data.map(normalizeSeries)
  }
}
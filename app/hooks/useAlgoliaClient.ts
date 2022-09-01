import { useState, useEffect } from 'react'
import { CustomWindow } from '~/types'

import search from 'algoliasearch/lite'
declare const window: CustomWindow

export const useAlgoliaClient = () => {
  const [client, setClient] = useState<any>()

  useEffect(() => {
    setClient(search(
      window.env.ALGOLIA_APP_ID,
      window.env.ALGOLIA_SEARCH_KEY
    ))
  }, [])

  return client
}
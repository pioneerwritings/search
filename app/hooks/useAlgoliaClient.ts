import { useState, useEffect } from 'react'
import { useEnv } from '~/hooks'

import search from 'algoliasearch/lite'

export const useAlgoliaClient = () => {
  const [client, setClient] = useState<any>()

  useEffect(() => {
    const { ALGOLIA_APP_ID, ALGOLIA_SEARCH_KEY } = useEnv()
    
    setClient(search(
      ALGOLIA_APP_ID!,
      ALGOLIA_SEARCH_KEY!
    ))
  }, [])

  return client
}
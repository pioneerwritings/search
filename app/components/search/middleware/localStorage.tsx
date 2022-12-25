import { useEffect } from 'react'
import { useInstantSearch } from 'react-instantsearch-hooks-web'
import { useRecentSearches$ } from '~/hooks'

const storageKey = '__recents__'

interface StateProps {
  configure: {
    [key: string]: any
  }
  uiState: {
    [key: string]: {
      query: string
    }
  }
}

const setStorage = (state: string[]): Promise<string[]> => {
  return new Promise(resolve => {
    localStorage.setItem(
      storageKey, JSON.stringify(state)
    )
    const storage = JSON.parse(
      localStorage.getItem(storageKey) as string
    )
    resolve(storage)
  })
}

const LocalStorage = () => {
  return {
    async onStateChange({ uiState: { articles: { query } } }: StateProps){
      const stored  = localStorage.getItem(storageKey)
      const recents: string[] = stored ? JSON.parse(stored) : []

      if(!!query && !recents.includes(query)){
        //add query to top of stack
        recents.unshift(query)

        if(recents.length === 5){
          //max 4 recents at a time
          recents.pop()
        }
        useRecentSearches$.next(
          await setStorage(recents)
        )
      }
    }
  }
}

export const LocalStorageMiddleware = () => {
  const { use } = useInstantSearch()

  useEffect(() => {
    return use(LocalStorage)
  })
  return null
}
import { Fragment, MouseEvent, useEffect, useState } from 'react'
import { useInstantSearch, useHits, useSearchBox } from 'react-instantsearch-hooks-web'
import { Hit } from './hit'
import { Show } from '~/components'
import { useRecentSearches$ } from '~/hooks'

export const Results = () => {
  const { indexUiState: { query } } = useInstantSearch()
  const { refine } = useSearchBox()
  const { hits } = useHits()
  
  const [recents, setRecents] = useState<string[]>(useRecentSearches$.getValue())

  useEffect(() => {
    const stream = useRecentSearches$.subscribe(setRecents)
    return () => stream.unsubscribe()
  }, [])

  const deleteQuery = (query: string): void => {
    const stored: string[] = JSON.parse(localStorage.getItem('__recents__')!)
    const update = stored.filter(q => q !== query)

    update.length === 0 ? 
    localStorage.removeItem('__recents__') : 
    localStorage.setItem('__recents__', JSON.stringify(update))
    useRecentSearches$.next(update)
  }

  const handleRecentClick = (query: string) => refine(query)

  const handleQueryDelete = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    deleteQuery(e.currentTarget.previousSibling?.textContent as string)
  }
  
  return (
    <Fragment>
      <Show when={!!query && hits.length === 0}>
        <div className='w-full h-20 flex items-center justify-center'>
          <p className='text-center text-gray-500'>
            No results matched your query.
          </p>
        </div>
      </Show>
      
      <Show when={!!query && hits.length >= 1}>
        {
          hits.map((hit) => {
            return (
              <Hit
                query={query}
                hit={hit}
                key={hit.objectID}
              />
            )
          })
        }
      </Show>

      <Show when={!query}>
        {
          recents.length === 0 ?
          <div className='w-full h-24 flex items-center justify-center'>
            <p className='text-gray-500'>No recent searches.</p>
          </div>
          : 
          <ul>
            {
              recents.map((query, i) => {
                return (
                  <li
                    tabIndex={0}
                    onClick={() => handleRecentClick(query)}
                    key={`query-${i}`}
                    className='w-full h-20 flex items-center justify-between px-6 cursor-pointer border-b border-b-gray-200 hover:bg-gray-50 last:rounded-b-xl last:border-b-0'>
                      <div className='flex items-center'>
                        <img src='/images/recent.svg' aria-hidden className='mr-4' />
                        {query}
                      </div>

                      <button onClick={handleQueryDelete} aria-label='Click to delete this query' className='w-6 h-6 mr-[.18rem] flex items-center justify-center rounded-full border border-gray-300 cursor-pointer'>
                        <img src='/images/x-black.svg' aria-hidden />
                      </button>
                  </li>
                )
              })
            }
          </ul>
        }
      </Show>
    </Fragment>
  )
}
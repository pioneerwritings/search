import { useEffect, useRef, useState, useMemo, createElement, Fragment } from 'react'
import { type AutocompleteOptions, autocomplete, getAlgoliaResults } from '@algolia/autocomplete-js'
import { createLocalStorageRecentSearchesPlugin } from '@algolia/autocomplete-plugin-recent-searches'
import { useSearchBox } from 'react-instantsearch-hooks-web'
import { type BaseItem } from '@algolia/autocomplete-core'
import { createRoot, Root } from 'react-dom/client'
import { useNavigate } from '@remix-run/react'
import { useAlgoliaClient } from '~/hooks'
import { Results } from './results'
import { Hit } from './hit'

interface AutoCompleteProps extends Partial<AutocompleteOptions<BaseItem>> {
  className?: string
  active: boolean
  onClose(): void
}

interface UIState {
  query?: string
}

export const AutoComplete = ({ active, onClose, className, ...props }: AutoCompleteProps) => {
  const { query, refine: setQuery } = useSearchBox()
  const [ uiState, setUiState ] = useState<UIState>({ query })
  
  const navigate = useNavigate()
  const container = useRef<HTMLDialogElement>(null)
  const rootRef = useRef<HTMLElement | null>(null)
  const panelRootRef = useRef<Root | null>(null)
  const client = useAlgoliaClient()

  const plugins = useMemo(() => {
    const recentSearches = createLocalStorageRecentSearchesPlugin({
      key: 'instantsearch'
    })
    return [ recentSearches ]
  }, [])

  useEffect(() => {
    if(uiState.query) setQuery(uiState.query)
  }, [uiState])

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if(e.key === 'Enter'){
        e.preventDefault()
        e.stopPropagation()
      }
    })
  }, [])

  useEffect(() => {
    if(!container.current){
      return
    }

    const instance = autocomplete({
      ...props,
      plugins,
      placeholder: 'Search all articles',
      container: container.current,
      initialState: { query },
      onReset: () => setQuery(''),

      onSubmit: ({ state }) => {
        setUiState({ query: state.query })
      },
      onStateChange: ({ prevState, state }) => {
        if(!state.isOpen){
          onClose()
          document.querySelector('body')?.classList.remove('aa-Detached')
        }
        if(prevState.query !== state.query){
          setUiState({ query: state.query })
        }
      },
      getSources: ({ query }) => {
        if(!query){
          return []
        }
        const baseQuery = {
          query, params: {
            snippetEllipsisText: '...',
            advancedSyntax: true,
            hitsPerPage: 50,
            restrictHighlightAndSnippetArrays: true
          }
        }
        return [
          {
            sourceId: 'series',
            getItems(){              
              return getAlgoliaResults({
                searchClient: client,
                queries: [{
                  indexName: 'series',
                  ...baseQuery, params: {
                    ...baseQuery.params,
                    attributesToSnippet: ['description:20']
                  }
                }]
              })
            },
            templates: {
              item(params){
                return (
                  <Hit {...params}
                    snippetAttribute='description'
                  />
                )
              }
            }
          },
          {
            sourceId: 'articles',
            onSelect(params) {
              const { item } = params as any

              if('_snippetResult' in item){
                navigate(`/articles/${item.objectID}`, {
                  state: {
                    query,
                    snippet: item._snippetResult.body,
                    highlight: item._highlightResult.body
                  }
                })
              }
            },

            getItems(){
              return getAlgoliaResults({
                searchClient: client,
                queries: [{
                  indexName: 'articles',
                  ...baseQuery, params: {
                    ...baseQuery.params,
                    attributesToSnippet: ['body:20']
                  }
                }]
              })
            },
            templates: {
              item(params){
                return (
                  <Hit {...params}
                    snippetAttribute='body'
                  />
                )
              }
            }
          }
        ]
      },
      render({ elements }, root){
        const { recentSearchesPlugin, articles, series } = elements

        if(!panelRootRef?.current || rootRef.current !== root) {
          rootRef.current = root
          panelRootRef.current?.unmount()
          panelRootRef.current = createRoot(root)
        }
        
        const r = panelRootRef.current

        if(articles || series){
          r.render(
            <Results
              tabs={[ 'articles', 'series' ]}
              data={{ articles, series }}
            />
          )
        }
        
        if(!query && !articles && !series && recentSearchesPlugin){
          r.render(
            <output className='pl-10'>{recentSearchesPlugin}</output>
          )
        }
        if(!query && !articles && !series && !recentSearchesPlugin) {
          r.render(
            <div className='flex items-center justify-center h-36'>
              <p className='font-inter text-ash/80'>No recent searches</p>
            </div>
          )
        }
      },
      renderer: {
        createElement,
        Fragment,
        render: () => {}
      }
    })

    instance.setIsOpen(!!active)

    return () => instance.destroy()
  }, [plugins, active])

  return (
    <dialog
      className={className}
      ref={container}
    />
  )
}

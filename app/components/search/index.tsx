import { searchState } from '~/state'
import { useRecoilState } from 'recoil'
import { useRef, useEffect } from 'react'
import { LinksFunction } from '@remix-run/node'
import { Configure, InstantSearch, SearchBox } from 'react-instantsearch-hooks-web'
import { useHotkeys } from 'react-hotkeys-hook'
import { useAlgoliaClient } from '~/hooks'
import { Results } from './results'
import { LocalStorageMiddleware } from './middleware'

import styles from '~/styles/components/search.css'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@algolia/autocomplete-theme-classic'},
  { rel: 'stylesheet', href: styles }
]

export const Search = () => {
  const [state, setState] = useRecoilState(searchState)
  const client = useAlgoliaClient()
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if(formRef.current){
      const input = formRef.current.elements[0] as HTMLInputElement
      input.focus()
    }
  }, [state.active])

  const handleClose = () => {
    setState({ ...state, active: false })
  }

  useHotkeys('cmd+k', (e) => {
    e.preventDefault()
    setState({ ...state, active: true })
  })

  useHotkeys('esc', () => {
    handleClose()
  })

  const SubmitButton = () => {
    return (
      <img src='/images/search.svg' className='w-5' />
    )
  }

  if(client){
    return (
      <div className='fixed w-screen h-screen z-50 left-0 backdrop-blur-md bg-ash/30 cursor-pointer' style={{ display: state.active ? 'block' : 'none'}} onClick={handleClose}>
        <div className='bg-white rounded-xl mx-4 max-w-xl md:max-w-2xl sm:mx-auto my-8 flex flex-col' onClick={(e) => e.stopPropagation()}>
          <InstantSearch indexName='articles' searchClient={client}>
            <Configure
              snippetEllipsisText='...'
              attributesToHighlight={['description']}
              hitsPerPage={50}
              advancedSyntax
              restrictHighlightAndSnippetArrays

            />

            <LocalStorageMiddleware />
            
            <div className='w-full flex items-center justify-between px-6 border-b border-b-gray'>
              <SearchBox
                submitIconComponent={SubmitButton}
                searchAsYouType={false}
                placeholder='Search all articles'
                autoFocus
                inputMode='search'
                formRef={formRef}
                classNames={{
                  root: 'w-full',
                  input: 'w-full h-14 focus:outline-0 appearance-none flex pl-4 pr-2 md:px-4',
                  form: 'flex items-center flex-row-reverse w-full relative',
                  reset: 'invisible sm:visible absolute right-6 hover:bg-gray-100',
                  submit: ''
                }}
              />

              <button
                aria-label='Click to close the search modal'
                className='rounded-md text-[8px] font-bold border border-gray-300 p-1'
                onClick={handleClose}>
                ESC
              </button>
            </div>

            <output className='overflow-auto max-h-96 rounded-b-xl'>
              <Results />
            </output>
          </InstantSearch>
        </div>
      </div>
    )
  }
  return null
}
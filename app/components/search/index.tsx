import { searchState } from '~/state'
import { useRecoilState } from 'recoil'
import { AutoComplete } from './autoComplete'
import { LinksFunction } from '@remix-run/node'
import { InstantSearch } from 'react-instantsearch-hooks-web'
import { useHotkeys } from 'react-hotkeys-hook'
import { useAlgoliaClient } from '~/hooks'

import styles from '~/styles/components/search.css'
import classNames from 'classnames'

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@algolia/autocomplete-theme-classic'},
  { rel: 'stylesheet', href: styles }
]

export const Search = () => {
  const [state, setState] = useRecoilState(searchState)
  const client = useAlgoliaClient()

  useHotkeys('cmd+k', (e) => {
    e.preventDefault()
    setState({ ...state, active: true })
  })

  const classes = classNames(
    'search-modal',
    `block
     max-w-xl
     bg-white
     rounded-xl
    `
  )
  const handleClose = () => {
    setState({ ...state, active: false })
  }

  if(client){
    return (
      <div className={classes}>
        <InstantSearch indexName='articles' searchClient={client}>
          <AutoComplete
            openOnFocus
            detachedMediaQuery='(min-width: 100px)'
            active={state.active}
            onClose={handleClose}
            classNames={{
              detachedOverlay: 'backdrop-blur',
              panel: 'p-6',
              item: 'aria-selected:hover:bg-[#FAFAFB] p-0',
              detachedFormContainer: 'border-b border-b-slate-100'
            }}
          />
        </InstantSearch>
      </div>
    )
  }
  return null
}
import type { AutocompleteComponents } from '@algolia/autocomplete-js'
import type { BaseItem } from '@algolia/autocomplete-core'

interface Props {
  item: BaseItem
  components: AutocompleteComponents
  snippetAttribute: string
}

export const Hit = ({ item, components, snippetAttribute }: Props) => {
  if('_snippetResult' in item){
    const headerAttr = (snippetAttribute === 'body' ? 'title': 'name')

    return (
      <div className='h-24 flex'>
        <div className='flex flex-col justify-center'>
          <header className='flex items-center'>
            <small className='uppercase text-[10px] first: m-0 font-bold mr-2 text-black'>
              {item[headerAttr] as string}
            </small>
          </header>
  
          <p className='mt-0 leading-normal pr-4'>
            <components.Snippet hit={item} attribute={snippetAttribute} />
          </p>
        </div>
  
        <img
          src='/images/right-carrot.svg'
          className='w-2 mr-1'
          aria-hidden
        />
      </div>
    )
  }
  return null
}
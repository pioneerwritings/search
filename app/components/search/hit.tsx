import { Snippet } from 'react-instantsearch-hooks-web'
import { Show } from '~/components'
import { searchState } from '~/state'
import { Link } from '@remix-run/react'
import { useRecoilState } from 'recoil'

interface Props {
  query?: string
  hit?: any
}

export const Hit = ({ hit, query }: Props) => {
  const [_, setState] = useRecoilState(searchState)
  
  const handleClick = () => {
    setState(s => ({ ...s, active: false }))
  }

  return (
    <Show when={query !== ''}>
      <Link to={`/articles/${hit.objectID}`} onClick={handleClick} state={{ query }}>
        <div className='h-24 flex py-2 cursor-pointer  w-full relative items-center border-b border-b-gray-200 hover:bg-gray-50 px-6 justify-between'>
          <div className='flex flex-col justify-center'>
            <header className='flex items-center'>
              <small className='uppercase text-[10px] first: m-0 font-bold mr-2 text-black'>
                {hit.title}
              </small>
            </header>
    
            <p className='mt-0 leading-normal max-w-xl text-gray-600'>
              <Snippet
                hit={hit}
                attribute='body'
                classNames={{
                  highlighted: 'text-indigo font-bold bg-cornflower/25 rounded-md'
                }}
              />
            </p>
          </div>
    
          <img
            src='/images/right-carrot.svg'
            className='w-2 mr-1 ml-2'
            aria-hidden
          />
        </div>
      </Link>
    </Show>
  )
}
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
    setState((s) => ({ ...s, active: false }))
  }

  return (
    <Show when={query !== ''}>
      <Link
        to={`/article/${hit.objectID}`}
        onClick={handleClick}
        state={{ query }}>
        <div className='w-full flex py-4 px-6 cursor-pointer relative items-center hover:bg-gray-50 justify-between border-b border-b-gray-200'>
          <div className='flex flex-col justify-center'>
            <header className='flex items-center'>
              <small className='max-w-[270px] uppercase text-[10px] first: m-0 font-bold mr-2 text-black truncate'>
                {hit.title}
              </small>
            </header>

            <p className='mt-0 leading-normal max-w-xl text-gray-600'>
              <Snippet
                hit={hit}
                attribute='body'
                classNames={{
                  highlighted:
                    'text-indigo font-bold bg-cornflower/25 rounded-md'
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

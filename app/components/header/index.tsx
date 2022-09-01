import { Link } from '@remix-run/react'
import { useRecoilState } from 'recoil'
import { searchState as SearchState } from '~/state'

export const Header = () => {
  const [, setSearchState] = useRecoilState(SearchState)

  const handleSearchClick = () => {
    setSearchState(s => ({ ...s, active: true }))
  }

  return (
    <header className='flex justify-between px-8 pt-6'>
      <Link to='/' className='logo'>
        <img className='w-24' src='/images/logo.svg' alt='Go to the home page' />
      </Link>

      <button
        type='button'
        role='button'
        aria-label='Search'
        onClick={handleSearchClick}>
        <img src='/images/search.svg' alt='' aria-hidden='true' />
      </button> 
    </header>
  )
}
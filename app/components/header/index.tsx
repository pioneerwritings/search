import { Link } from '@remix-run/react'
import styles from '~/styles/components/header/header.css'

export const HeaderLinks = () => [
  { rel: 'stylesheet', href: styles }
]

export const Header = () => {
  return (
    <header className='header'>
      <Link to='/' className='logo'>
        <img src='/images/logo.svg' alt='Go to the home page' />
      </Link>

      <Link to='/search' className='search-icon'>
        <img src='/images/search.svg' alt='Go to the search page' /> 
      </Link>
    </header>
  )
}
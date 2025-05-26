import { Link, useLocation } from '@remix-run/react'
import { useRecoilState } from 'recoil'
import { searchState as SearchState, navState as NavState } from '~/state'
import { styles } from '~/styles/components/header'

import classNames from 'classnames'

export const Header = () => {
  const [state, setSearchState] = useRecoilState(SearchState)
  const [_, setNavState] = useRecoilState(NavState)

  const { pathname } = useLocation()

  const handleSearchClick = () => {
    // setSearchState({ ...state, active: true })
  }

  const handleHamburgerClick = () => {
    setNavState((prev) => {
      return { active: !prev.active }
    })
  }

  const activeClass = (path: string) => {
    if (path === pathname) {
      return styles.activeRoute
    }
  }

  return (
    <header className={styles.header}>
      <Link to='/' className={styles.logo}>
        <img
          className='w-24'
          src='/images/logo.svg'
          alt='Go to the home page'
        />
      </Link>

      <button
        type='button'
        role='button'
        className={styles.hamburger}
        aria-label='Open the navigation menu'
        onClick={handleHamburgerClick}>
        <img src='/images/hamburger.svg' aria-hidden />
      </button>

      <Link to='/' className={styles.logomark}>
        <img src='/images/logomark.svg' alt='Go to the home page' />
      </Link>

      <nav className={styles.nav}>
        {['Explore', 'Series'].map((r) => {
          const route = r === 'Explore' ? '/' : `/${r.toLowerCase()}`

          const classes = classNames(
            'mr-6 text-[#939393] hover:text-black',
            activeClass(route)
          )
          return (
            <Link to={route} className={classes} key={r}>
              {r}
            </Link>
          )
        })}
      </nav>

      <button
        className={styles.search}
        type='button'
        role='button'
        aria-label='Search'
        onClick={handleSearchClick}>
        <img src='/images/search.svg' alt='' aria-hidden='true' />
      </button>
    </header>
  )
}

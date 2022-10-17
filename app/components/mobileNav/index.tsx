import { useRecoilState } from 'recoil'
import { navState } from '~/state'
import { Link, useLocation } from '@remix-run/react'
import { styles } from '~/styles/components/mobileNav'

import classNames from 'classnames'

export const MobileNav = () => {
  const [ state, setNavState ] = useRecoilState(navState)
  const { pathname } = useLocation()

  const handleNavClose = () => {
    setNavState({ active: false })
  }

  const classes = classNames(
    styles.nav, {
      'left-0' : state.active,
      '-left-96': !state.active
    }
  )

  return (
    <nav className={classes}>
      <button
        onClick={handleNavClose}
        arial-label='Close the navigation panel'
        className={styles.close}>
        <img src='/images/mobile-x.svg' aria-hidden />
      </button>

      <ul className='p-0'>
        {
          ['Explore', 'Contact', 'Donate', 'Series'].map((link) => {
            const route = link === 'Explore' ? '/' : `/${link.toLowerCase()}`
            const active = (route === pathname)

            const linkClasses = classNames(
              styles.link, {
                [styles.activeLink]: active
              }
            )

            return (
              <li
                className={linkClasses}
                key={link}>
                <Link
                  to={route}
                  onClick={handleNavClose}>
                  {link}
                </Link>
              </li>
            )
          })
        }
      </ul>
    </nav>
  )
}
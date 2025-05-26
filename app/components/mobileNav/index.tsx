import { useRecoilState } from 'recoil'
import { navState } from '~/state'
import { Link, useLocation } from '@remix-run/react'
import { styles } from '~/styles/components/mobileNav'

import classNames from 'classnames'
import { Show } from '../show'

export const MobileNav = () => {
  const [state, setNavState] = useRecoilState(navState)
  const { pathname } = useLocation()

  const handleNavClose = () => {
    setNavState({ active: false })
  }

  const classes = classNames(styles.nav, {
    'left-0': state.active,
    '-left-[777px]': !state.active
  })

  return (
    <Show when={!!state.active}>
      <div
        className='backdrop-blur-md fixed left-0 top-0 w-full h-screen z-10 bg-ash/30 md:hidden'
        onClick={handleNavClose}>
        <nav className={classes}>
          <button
            onClick={handleNavClose}
            arial-label='Close the navigation panel'
            className={styles.close}>
            <img src='/images/mobile-x.svg' aria-hidden />
          </button>

          <ul className='p-0 mt-14'>
            {['Explore', 'Series'].map((link) => {
              const route = link === 'Explore' ? '/' : `/${link.toLowerCase()}`
              const active = route === pathname

              const linkClasses = classNames(styles.link, {
                [styles.activeLink]: active
              })

              return (
                <li className={linkClasses} key={link}>
                  <Link to={route} onClick={handleNavClose} className='w-full'>
                    {link}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </Show>
  )
}

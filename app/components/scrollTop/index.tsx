import { styles } from '~/styles/components/scrollTop'
import { useEffect, useState } from 'react'

import classNames from 'classnames'

interface Props {
  fixed?: boolean
}

export const ScrollTop = ({ fixed }: Props) => {
  const [ visible, setVisible ] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY
      setVisible(scrollPos >= 250)
    }

    window.addEventListener(
      'scroll',
      handleScroll
    )

    return () => {
      removeEventListener(
        'scroll',
        handleScroll
      )
    }
  }, [])

  const handleClick = () => {
    if(typeof document !== 'undefined'){
      window.scroll(0,0)
    }
  }

  const classes = classNames(styles, {
    fixed,
    'bottom-8': fixed,
    'scale-100': visible,
    'scale-0': !visible
  })

  return (
    <button
      className={classes}
      aria-label='Scroll back to the top'
      onClick={handleClick}>
      <img src='/images/top-arrow.svg' alt='' aria-hidden />
    </button>
  )
}
import { styles } from '~/styles/components/scrollTop'
import { useEffect, useState } from 'react'
import classNames from 'classnames'

export const ScrollTop = () => {
  const [ visible, setVisible ] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY
      setVisible(scrollPos >= 200)
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
    'w-12 h-12': visible,
    'w-0 h-0': !visible
  })

  return (
    <button
      className={classes}
      aria-label='Scroll back to the top'
      onClick={handleClick}>
      <img src='/images/top-arrow.svg' alt='' />
    </button>
  )
}
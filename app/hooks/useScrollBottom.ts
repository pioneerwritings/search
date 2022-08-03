import { useEffect, useState } from 'react'

export const useScrollBottom = () => {
  const [ bottom, setBottom ] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const { scrollY, innerHeight } = window
      const { body: { offsetHeight } } = document
      const isBottom = scrollY + innerHeight >= offsetHeight - 100

      setBottom(isBottom)
    }
    window.addEventListener(
      'scroll', handleScroll
    )
    return () => window.removeEventListener(
      'scroll', handleScroll
    )
  }, [])

  return { bottom }
}
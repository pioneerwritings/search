import { styles } from '~/styles/components/topicsCarousel'
import { KeyboardEvent, useRef } from 'react'

import classNames from 'classnames'

interface Props {
  title?: string
  data: string[]
  activeItem: string
  onClick(item: string | undefined): void
}

export const TopicsCarousel = ({ data, title, activeItem, onClick }: Props) => {
  const ref = useRef<HTMLUListElement>(null)

  const handleKeyPress = (event: KeyboardEvent) => {
    const { key, currentTarget: { textContent } } = event

    if(key === ' '){
      event.preventDefault()
      onClick(textContent!)
    }
    if(key === 'Enter'){  
      onClick(textContent!)
    }
  }

  const handlePagerClick = (direction: 'right' | 'left') => {
    if(ref.current){
      if(ref.current.scrollWidth - ref.current.offsetWidth - ref.current.scrollLeft > 0){
        ref.current.scrollLeft = (
          direction === 'left' ? 
          ref.current.scrollLeft -= 150 : 
          ref.current.scrollLeft += 150
        )
      }
    }
  }

  return (
    <div className={styles.carousel}>
      <button onClick={() => handlePagerClick('left')} type='button' className='mr-4 shrink-0 rounded-full border flex items-center justify-center w-12 h-12'>
        <img src='/images/left-arrow.svg' />
      </button>

      <ul className={styles.topics} role='list' ref={ref}>
        {
          ['All', ...data].map((item, i) => {
            const isActive = (item === activeItem) || (i === 0 && activeItem === '')

            const classnames = classNames(styles.topic, {
              [styles.activeState]: isActive,
              [styles.inactiveState]: !isActive
            })
            const handleClick = () => {
              onClick(i === 0 ? undefined : item)
            }

            return (
              <li
                role='listitem'
                onClick={handleClick}
                onKeyDown={handleKeyPress}
                key={item}
                className={classnames}
                tabIndex={0}>
                {item}
              </li>
            )
          })
        }
      </ul>

      <button onClick={() => handlePagerClick('right')} type='button' className='ml-4 shrink-0 rounded-full border flex items-center justify-center w-12 h-12'>
        <img src='/images/right-arrow.svg' />
      </button>
    </div>
  )
}
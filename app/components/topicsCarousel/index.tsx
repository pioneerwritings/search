import { styles } from '~/styles/components/topicsCarousel'
import { KeyboardEvent } from 'react'

import classNames from 'classnames'

interface Props {
  title?: string
  data: string[]
  activeItem: string
  onClick(item: string | undefined): void
}


export const TopicsCarousel = ({ data, title, activeItem, onClick }: Props) => {

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

  return (
    <div className={styles.carousel}>
      <ul className={styles.topics} role='list'>
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
    </div>
  )
}
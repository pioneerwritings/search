import { Show } from '../show'
import { styles } from '~/styles/components/topicsCarousel'

import classNames from 'classnames'

interface Props {
  title?: string
  data: string[]
  activeItem: string
  onClick(item: string | undefined): void
}


export const TopicsCarousel = ({ data, title, activeItem, onClick }: Props) => {
  return (
    <div className={styles.carousel}>
      <Show when={!!title}>
        <span className={styles.title}>{title}</span>
      </Show>

      <div className={styles.container}>
        <div className={styles.topics}>
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
                <div
                  onClick={handleClick}
                  key={item}
                  className={classnames}>
                  {item}
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
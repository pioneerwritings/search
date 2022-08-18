import { KeyboardEvent } from 'react'
import { truncateText } from '~/utils'
import { Show } from '~/components'
import { Link, useNavigate } from '@remix-run/react'
import { styles } from '~/styles/components/card'

interface CardProps {
  id: string
  title: string
  author: string
  excerpt: string
  topic: string
  seriesLabel?: string
}

export const Card = ({
  id,
  title,
  author,
  excerpt,
  topic,
  seriesLabel 
}: CardProps) => {
  const navigate = useNavigate()
  const isSeries = !!seriesLabel

  const handleKeypress = (e: KeyboardEvent<HTMLDivElement>) => {
    const { attributes } = e.currentTarget
    const id = attributes.getNamedItem('data-id')?.value
    navigate(`/articles/${id}`)
  }

  return (
    <Link to={`/articles/${id}`} className='max-w-[368px]'>
      <article
        className={styles.card}
        onKeyPress={handleKeypress}
        data-id={id}
        data-is-series={isSeries ? true : false}
        aria-label={title}
        aria-describedby={id}
        tabIndex={0}>
        <header className={styles.header}>
          <small className={styles.author}>
            {author}
          </small>
    
          <Show when={isSeries}>
            <small className={styles.series}>
              {seriesLabel}
            </small>
          </Show>
        </header>

        <h2 className={styles.h2}>{title}</h2>
        <p className={styles.p} id={id}>{truncateText(excerpt, 70)}</p>

        <small className={styles.topic}>
          {topic}
        </small>
      </article>
    </Link>
  )
} 
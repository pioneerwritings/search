import { Show } from '~/components'
import { Link, useNavigate } from '@remix-run/react'
import { styles } from '~/styles/components/card'
import { Article } from '~/types'
import { truncateText } from '~/utils'

type CardProps = Pick<Article, 'id' | 'author' | 'topic'> & {
  heading: string
  excerpt: string
  type: 'articles' | 'series'
  seriesLabel?: string  
}

export function Card<T extends CardProps>(props: T) {
  const { id, type, author, topic, excerpt, heading, seriesLabel } = props

  const navigate = useNavigate()
  const link = `/${type}/${id}`

  const handleKeypress = () => navigate(link)

  return (
    <Link to={link} className='max-w-[368px] w-full' tabIndex={-1}>
      <article
        className={styles.card}
        onKeyPress={handleKeypress}
        aria-label={heading}
        aria-describedby={id}
        tabIndex={0}>

        <header className={styles.header}>
          <small className={styles.author}>
            {author}
          </small>
    
          <Show when={!!seriesLabel}>
            <small className={styles.series}>
              {seriesLabel}
            </small>
          </Show>
        </header>

        <h2 className={styles.h2}>{heading}</h2>

        <p id={id} className='sr-only'>
          {excerpt}—Click to read this article
        </p>

        <p className={styles.p}>
          {truncateText(excerpt, 70)}
        </p>

        <small className={styles.topic}>
          {topic}
        </small>
      </article>
    </Link>
  )
}
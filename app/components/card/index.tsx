import { Show } from '~/components'
import { Link, useNavigate } from '@remix-run/react'
import { styles } from '~/styles/components/card'
import { Article } from '~/types'
import { truncateText } from '~/utils'
import { useGoogleAnalytics } from '~/hooks'

type CardProps = Pick<Article, 'id' | 'author' | 'topic' | 'periodical'> & {
  heading: string
  excerpt: string
  type: 'article' | 'series'
  seriesLabel?: string
}

export function Card<T extends CardProps>(props: T) {
  const { GA4 } = useGoogleAnalytics()
  const { id, type, author, topic, excerpt, heading, periodical, seriesLabel } =
    props

  const navigate = useNavigate()
  const link = `/${type}/${id}`

  const handleKeypress = () => navigate(link)

  const handleClick = () => {
    GA4?.gtag('event', 'card_click', {
      title: heading,
      author,
      topic,
      periodical,
      isSeries: !!seriesLabel
    })
  }

  return (
    <Link to={link} className='max-w-[368px] w-full' tabIndex={-1}>
      <article
        className={styles.card}
        onKeyPress={handleKeypress}
        onClick={handleClick}
        aria-label={heading}
        aria-describedby={id}
        tabIndex={0}>
        <header className={styles.header}>
          <small className={styles.author}>{author}</small>

          <Show when={!!seriesLabel}>
            <small className={styles.series}>{seriesLabel}</small>
          </Show>
        </header>

        <h2 className={styles.h2}>{heading}</h2>

        <p id={id} className='sr-only'>
          {excerpt}—Click to read this article
        </p>

        <p className={styles.p}>{truncateText(excerpt, 70)}</p>

        <small className={styles.topic}>{topic}</small>
      </article>
    </Link>
  )
}

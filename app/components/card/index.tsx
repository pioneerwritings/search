import { Show } from '~/components'
import { Link, useNavigate } from '@remix-run/react'
import { styles } from '~/styles/components/card'
import { Article } from '~/types'
import { truncateText } from '~/utils'
import { useGoogleAnalytics } from '~/hooks'
import { MouseEvent } from 'react'

type CardProps = Pick<Article, 'id' | 'author' | 'topics' | 'periodical'> & {
  heading: string
  excerpt: string
  type: 'article' | 'series'
  seriesLabel?: string
  handleTopicSelect: (topic: string) => void
}

export function Card<T extends CardProps>(props: T) {
  const { GA4 } = useGoogleAnalytics()
  const {
    id,
    type,
    author,
    topics = [],
    excerpt,
    heading,
    periodical,
    seriesLabel,
    handleTopicSelect
  } = props

  const navigate = useNavigate()
  const link = `/${type}/${id}`

  const handleKeypress = () => navigate(link)

  const handleClick = () => {
    GA4?.gtag('event', 'card_click', {
      title: heading,
      author,
      periodical,
      isSeries: !!seriesLabel
    })
  }

  const Topics = () => {
    // prevents topics from getting re-ordered
    // when the card re-renders.
    const sorted = topics.sort()

    return (
      <div className='flex items-center overflow-x-auto scrollbar-thin padding-0 scroll-smooth'>
        {sorted.map((topic) => {
          return (
            <small
              key={topic}
              className={styles.topic}
              onClick={(event: MouseEvent<HTMLElement>) => {
                event.preventDefault()
                event.stopPropagation()
                handleTopicSelect(topic)
              }}>
              {topic}
            </small>
          )
        })}
      </div>
    )
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

        <Topics />
      </article>
    </Link>
  )
}

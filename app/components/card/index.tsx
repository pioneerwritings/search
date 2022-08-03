import { truncateText } from '~/utils'
import { Show } from '~/components'
import { KeyboardEvent } from 'react'
import { Link, useNavigate } from '@remix-run/react'

import styles from '../../../build/components/card/card.css'

interface CardProps {
  id: string
  title: string
  author: string
  excerpt: string
  topic: string
  seriesLabel?: string
}

export const CardLinks = () => [
  { rel: 'stylesheet', href: styles }
]

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
    <Link to={`/articles/${id}`}>
      <article
        className='card'
        onKeyPress={handleKeypress}
        data-id={id}
        data-is-series={isSeries ? true : false}
        aria-label={title}
        aria-describedby={id}
        tabIndex={0}>
        <header>
          <small className='author'>
            {author}
          </small>
    
          <Show when={isSeries}>
            <span className='series-label'>
              {seriesLabel}
            </span>
          </Show>
        </header>

        <h2>{title}</h2>
        <p id={id}>{truncateText(excerpt, 70)}</p>

        <small className='topic'>
          {topic}
        </small>
      </article>
    </Link>
  )
} 
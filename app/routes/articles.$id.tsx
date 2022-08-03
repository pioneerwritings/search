import type { LoaderFunction, LinksFunction } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Show } from '~/components'
import styles from '../../build/scss/routes/article.css'

export const loader: LoaderFunction = async ({ params }) => {
  const id = params.id as string
  const url = process.env.STRAPI_API_URL as string
  return await fetch(`${url}/articles/${id}`)
}

export const links: LinksFunction = () => [
  { rel: 'stylesheet', href: styles },
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  { rel: 'preconnect', href: 'https://fonts.gstatic.com' },
  { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;700&display=swap' }
]

export default function ArticlePage(){
  const { data: { attributes } } = useLoaderData()
  const { title, subtitle, author, body, periodical } = attributes

  const periodicalName = periodical.data.attributes.name
  const authorName = author.data.attributes.name

  return (
    <article className='article'>
      <main role='main'>
        <h1 className='title'>{title}</h1>
        <p className='featured'>{periodicalName}</p>
        <address className='author'>By {authorName}</address>

        <Show when={!!subtitle}>
          <small>{subtitle}</small>
        </Show>

        <section className='body'>
          {
            body
            .split('\n')
            .filter((p: string) => p !== '')
            .map((p: string, i: number) => <p key={i}>{p}</p>)
          }
        </section>
      </main>
    </article>
  )
}
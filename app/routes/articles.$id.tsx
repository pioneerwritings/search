import { LoaderFunction, LinksFunction, json } from '@remix-run/node'
import { useLoaderData } from '@remix-run/react'
import { Show } from '~/components'
import { isSeries } from '~/utils'

export const loader: LoaderFunction = async ({ params }) => { 
  const id  = params.id as string
  const url = process.env.STRAPI_API_URL as string
  const res = await fetch(`${url}/articles/${id}`)

  const article = await res.json()
  const title: string = article.data.attributes.title
  
  if(!isSeries(title)){
    return json({ article })
  }

  const name   = title.split('—').filter(str => !Number(str)).join('—').trim()
  const res2   = await fetch(`${url}/series?filters[name][$eq]=${name.trim()}`)
  const series = await res2.json()

  if(!series.data.length){
    return json({ article })
  }
  const num = series.data[0].attributes.articles.data.findIndex((a: any) => a.attributes.title === title) + 1
  const len = series?.data[0].attributes.articles.data.length

  const prevArticle = (): string | null => {
    if(num > 1){
      const index = num - 2
      return series.data[0].attributes.articles.data[index].id
    }
    return null
  }

  const nextArticle = (): string | null => {
    if(num < len){
      return series.data[0].attributes.articles.data[num].id
    }
    return null
  }

  return json({
    article,
    
    series: {
      prev: prevArticle(),
      next: nextArticle()
    }
  })
}

export default function ArticlePage(){
  const { article, series } = useLoaderData()
  const { data: { attributes } } = article
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
          <small className='subtitle'>
            {subtitle}
          </small>
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
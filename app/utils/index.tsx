import { CMSSeries, CMSArticle, Article, Series  } from "~/types"

export const truncateText = (text: string, limit: number): string => {
  if(text?.length > limit){
    return text.trim().substring(0, limit) + '...'
  }
  return text?.trim()
}

export const isSeries = (str: string): boolean | string => {
  const title = str.trim(), regex = /—.*[0-9]/g

  if(!regex.test(title)){
    return false
  }
  const arr = str.split('—')
  return arr[arr.length - 1]
}


export const normalizeArticle = (response: CMSArticle): Article => {
  const { id, attributes } = response
  const { title, subtitle, body, slug, excerpt } = attributes

  const author = attributes.author.data.attributes.name
  const topic  = attributes.topic.data.attributes.name
  const periodical = attributes.periodical.data.attributes.name
  
  return {
    ...(subtitle ? { subtitle }: {}),
    id,
    title,
    excerpt,
    slug,
    body,
    author,
    topic,
    periodical
  }
}

export const normalizeSeries = (series: CMSSeries): Series => {
  const { id, attributes } = series
  const { name, description } = attributes

  const author = attributes.author.data.attributes.name
  const topic = attributes.topic.data.attributes.name

  const articles: Series['articles'] = attributes.articles.data.map(({ id, attributes }) => {
    const { title, excerpt } = attributes
    return { id, title, excerpt }
  })

  return {
    id,
    name,
    description,
    author,
    topic,
    articles
  }
}
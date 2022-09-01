
export interface CustomWindow extends Window {
  env: { [k: string]: string }
}

export interface ArticleDocument {
  id: string
  slug: string
  title: string
  author: string
  topic: string
  periodical: string
  subtitle?: string
  excerpt: string
  body: string
}

export interface Series {
  id: string
  name: string
  author: string
  topic: string
  description: string
  articles: ArticleDocument[]
}

export interface DropdownItem {
  id: number
  value: string
}
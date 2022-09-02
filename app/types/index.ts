
export interface CustomWindow extends Window {
  env: { [k: string]: string }
}

export interface DropdownItem {
  id: number
  value: string
}

interface BaseDocument {
  id: string
}

interface CMSAttributeMeta {
  createdAt: string
  updatedAt: string
  publishedAt: string
}

interface CMSRelation {
  data: {
    id: string
    attributes: CMSAttributeMeta & { name: string }
  }
}

interface CMSArticleAttributes {
  title: string
  subtitle?: string
  slug: string
  excerpt: string
  body: string
}

interface CMSSeriesAttributes {
  name: string
  description: string
}

export interface CMSSeries extends BaseDocument {
  attributes: CMSSeriesAttributes & CMSAttributeMeta & {
    author: CMSRelation
    topic: CMSRelation
    articles: { data: CMSArticle[] }
  }
}

export interface CMSArticle extends BaseDocument {
  attributes: CMSArticleAttributes & CMSAttributeMeta & {
    author: CMSRelation
    topic: CMSRelation
    periodical: CMSRelation
  }
}

export interface CMSTopic {
  id: number
  attributes: CMSAttributeMeta & {
    name: string
  }
}

export interface CMSResponse<T> {
  data: T[],
  meta?: {
    pagination?: {
      start: number
      limit: number
      total: number
    }
  }
}

export type CMSTopicResponse = CMSResponse<CMSTopic>
export type CMSArticleResponse = CMSResponse<CMSArticle>
export type CMSSeriesResponse = CMSResponse<CMSSeries>

export interface Article extends BaseDocument, CMSArticleAttributes {
  author: string
  topic: string
  periodical: string
}

export type ArticleCard = BaseDocument & Pick<Article, 'title' | 'author' | 'topic' | 'excerpt'>

export interface Series extends BaseDocument, CMSSeriesAttributes {
  author: string
  topic: string
  articles: Pick<CMSArticleAttributes, 'title' | 'excerpt'>[]
}
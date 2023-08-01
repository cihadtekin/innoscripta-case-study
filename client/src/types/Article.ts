export interface Article {
  id: number,
  publication_date: string,
  title: string,
  description: string,
  content: string,
  link: string,
  image: string,
  source: Source,
  categories: Category[],
  authors: Author[],
}

export interface ArticleFilters {
  keyword?: string,
  start?: Date,
  end?: Date,
  categories?: number[],
  authors?: number[],
  sources?: number[],
}

export interface ArticleMeta {
  id: number,
  name: string
}

export interface Author extends ArticleMeta {}
export interface Category extends ArticleMeta {}
export interface Source extends ArticleMeta { url: string }

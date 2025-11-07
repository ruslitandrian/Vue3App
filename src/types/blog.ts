export interface Author {
  id: number
  name: string
  email?: string
}

export interface Blog {
  id: number
  title: string
  slug?: string
  content: string
  excerpt?: string
  featured_image?: string
  author?: Author
  author_id?: number
  is_active?: boolean
  order?: number
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  views?: number
  published_at?: string | null
  created_at?: string
  updated_at?: string
  deleted_at?: string | null
}

export interface BlogCreatePayload {
  title: string
  content: string
  author_id: number
  slug?: string
  excerpt?: string
  featured_image?: string
  is_active?: boolean
  order?: number
  meta_title?: string
  meta_description?: string
  meta_keywords?: string
  published_at?: string
}

export type BlogUpdatePayload = Partial<BlogCreatePayload>

export interface BlogSearchParams {
  search?: string
  is_active?: 0 | 1
  sort_by?: 'id' | 'title' | 'created_at' | 'updated_at' | 'order' | 'published_at' | 'views'
  sort_order?: 'asc' | 'desc'
  order_by?: 'order'
  order_direction?: 'asc' | 'desc'
  per_page?: number
  page?: number
}

export interface PaginatedResponse<T> {
  items: T[]
  currentPage: number
  lastPage: number
  perPage: number
  total: number
  nextPageUrl?: string | null
  prevPageUrl?: string | null
}


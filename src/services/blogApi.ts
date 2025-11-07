import type {
  Blog,
  BlogCreatePayload,
  BlogUpdatePayload,
  BlogSearchParams,
  PaginatedResponse
} from '../types/blog'

// Use relative path to work with Vite dev proxy and avoid browser CORS issues
const API_BASE_URL = ''

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers
    }
  })

  if (!response.ok) {
    // Read text for better error location (e.g., when receiving an HTML error page)
    const errorText = await response.text().catch(() => '')
    const snippet = errorText ? ` | body: ${errorText.substring(0,200)}` : ''
    throw new Error(`API Error: ${response.status} ${response.statusText}${snippet}`)
  }

  // Handle 204/empty response body
  if (response.status === 204 || response.status === 205) {
    return undefined as unknown as T
  }

  const contentType = response.headers.get('content-type') || ''
  const text = await response.text()
  if (!text) {
    return undefined as unknown as T
  }

  // Only parse if content is JSON or text appears to be JSON
  if (contentType.includes('application/json') || text.trim().startsWith('{') || text.trim().startsWith('[')) {
    return JSON.parse(text) as T
  }

  // Non-JSON response, throw error with context
  throw new Error(`Expected JSON response but received: ${text.substring(0,200)}`)
}

export const blogApi = {
  // Get blog posts list (supports search/sort/pagination)
  async getBlogs(params?: BlogSearchParams): Promise<PaginatedResponse<Blog>> {
    const queryParams = new URLSearchParams()
    if (params?.search) {
      queryParams.append('search', params.search)
    }
    if (params?.is_active !== undefined) queryParams.append('is_active', String(params.is_active))
    if (params?.sort_by) queryParams.append('sort_by', params.sort_by)
    if (params?.sort_order) queryParams.append('sort_order', params.sort_order!)
    if (params?.order_by) queryParams.append('order_by', params.order_by)
    if (params?.order_direction) queryParams.append('order_direction', params.order_direction)
    if (params?.per_page) queryParams.append('per_page', String(params.per_page))
    if (params?.page) queryParams.append('page', String(params.page))

    const queryString = queryParams.toString()
    const endpoint = `/api/blogs${queryString ? `?${queryString}` : ''}`
    const raw = await fetchApi<unknown>(endpoint)
    return unwrapPaginatedResponse<Blog>(raw)
  },

  // Create a new blog post
  async createBlog(payload: BlogCreatePayload): Promise<Blog> {
    const raw = await fetchApi<unknown>('/api/blogs', {
      method: 'POST',
      body: JSON.stringify(payload)
    })
    return unwrapEntityResponse<Blog>(raw)
  },

  // Update a blog post
  async updateBlog(id: number, payload: BlogUpdatePayload): Promise<Blog> {
    const raw = await fetchApi<unknown>(`/api/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    })
    return unwrapEntityResponse<Blog>(raw)
  },

  // Delete a blog post (soft delete)
  async deleteBlog(id: number): Promise<void> {
    await fetchApi(`/api/blogs/${id}`, {
      method: 'DELETE'
    })
  },

  // Set blog post as active
  async setActive(id: number): Promise<Blog> {
    const raw = await fetchApi<unknown>(`/api/blogs/${id}/set-active`, {
      method: 'POST'
    })
    return unwrapEntityResponse<Blog>(raw)
  },

  // Set blog post as inactive
  async setInactive(id: number): Promise<Blog> {
    const raw = await fetchApi<unknown>(`/api/blogs/${id}/set-inactive`, {
      method: 'POST'
    })
    return unwrapEntityResponse<Blog>(raw)
  },

  // Update blog post order
  async updateOrder(id: number, order: number): Promise<Blog> {
    const raw = await fetchApi<unknown>(`/api/blogs/${id}/order`, {
      method: 'PUT',
      body: JSON.stringify({ order })
    })
    return unwrapEntityResponse<Blog>(raw)
  },

  // Bulk update blog post orders
  async bulkUpdateOrder(orders: { id: number; order: number }[]): Promise<Blog[]> {
    const raw = await fetchApi<unknown>('/api/blogs/bulk-update-order', {
      method: 'POST',
      body: JSON.stringify({ orders })
    })
    return unwrapArrayResponse<Blog>(raw)
  }
}

// Backend response wrapper compatibility:
// { success: true, data: { data: [...], ...pagination }, message: '...' }
// or { success: true, data: { ...entity }, message }
function unwrapArrayResponse<T>(raw: unknown): T[] {
  const r = raw as any
  if (Array.isArray(r)) return r as T[]
  if (r && typeof r === 'object') {
    if (Array.isArray(r.data)) return r.data as T[]
    if (r.data && Array.isArray(r.data.data)) return r.data.data as T[]
  }
  return []
}

function unwrapEntityResponse<T>(raw: unknown): T {
  const r = raw as any
  if (r && typeof r === 'object') {
    if (r.data && !Array.isArray(r.data)) return r.data as T
  }
  return r as T
}

function unwrapPaginatedResponse<T>(raw: unknown): PaginatedResponse<T> {
  const r = raw as any
  if (r && typeof r === 'object' && r.data && typeof r.data === 'object') {
    const d = r.data
    const items: T[] = Array.isArray(d.data) ? (d.data as T[]) : []
    return {
      items,
      currentPage: Number(d.current_page ?? 1),
      lastPage: Number(d.last_page ?? 1),
      perPage: Number(d.per_page ?? (items?.length ?? 0)),
      total: Number(d.total ?? (items?.length ?? 0)),
      nextPageUrl: d.next_page_url ?? null,
      prevPageUrl: d.prev_page_url ?? null
    }
  }
  return {
    items: unwrapArrayResponse<T>(raw),
    currentPage: 1,
    lastPage: 1,
    perPage: 0,
    total: 0,
    nextPageUrl: null,
    prevPageUrl: null
  }
}


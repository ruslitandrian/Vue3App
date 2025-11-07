<template>
  <div class="blogs-container">
    <div class="blogs-header">
      <h1>Articles</h1>
      <div class="header-actions">
        <div class="search-container">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search articles..."
            class="search-input"
            @input="handleSearch"
          />
        </div>
        <button class="btn-add-new" @click="openAddModal">+ Add New</button>
      </div>
    </div>

    <div class="sort-container">
      <label for="sort-by">Sort by:</label>
      <select id="sort-by" v-model="sortBy" class="sort-select" @change="loadBlogs">
        <option value="">None</option>
        <option value="id">ID</option>
        <option value="title">Title</option>
        <option value="order">Order</option>
      </select>
      <label for="sort-order">Order:</label>
      <select id="sort-order" v-model="sortOrder" class="sort-select" @change="loadBlogs">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="blogs.length === 0" class="empty-state">No articles found</div>
    <div v-else class="blogs-grid">
      <div v-for="(blog, idx) in blogs" :key="blog.id ?? `fallback-${idx}`" class="blog-card">
        <div class="blog-image">
          <img :src="getImageSrc(blog.featured_image)" :alt="blog.title" />
        </div>
        <div class="blog-content">
          <h3 class="blog-title">{{ blog.title }}</h3>
          <p class="blog-preview">{{ blog.excerpt || truncateContent(blog.content) }}</p>
        </div>
        <div class="blog-actions">
          <button
            class="btn-action btn-active"
            :class="{ 'btn-inactive': !blog.is_active }"
            @click="toggleActive(blog)"
          >
            {{ blog.is_active ? 'Active' : 'Inactive' }}
          </button>
          <button class="btn-action btn-edit" @click="openEditModal(blog)">Edit</button>
          <button class="btn-action btn-delete" @click="handleDelete(blog)">Delete</button>
        </div>

    <div class="pagination" v-if="!loading && blogs.length > 0 && lastPage > 1">
      <button class="btn-pager" :disabled="currentPage === 1" @click="goPrev">Previous</button>
      <span class="pager-info">Page {{ currentPage }} / {{ lastPage }} · Total {{ total }}</span>
      <button class="btn-pager" :disabled="currentPage === lastPage" @click="goNext">Next</button>
    </div>
      </div>
    </div>

    <!-- Add/Edit Article Modal -->
    <AddEditArticleModal
      v-if="showModal"
      :blog="selectedBlog"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Blog, BlogCreatePayload, BlogSearchParams } from '../types/blog'
import { blogApi } from '../services/blogApi'
import AddEditArticleModal from '../components/AddEditArticleModal.vue'

const blogs = ref<Blog[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const showModal = ref(false)
const selectedBlog = ref<Blog | null>(null)
const searchQuery = ref('')
const sortBy = ref<BlogSearchParams['sort_by'] | ''>('')
const sortOrder = ref<'asc' | 'desc'>('asc')
const orderBy = ref<BlogSearchParams['order_by'] | ''>('')
const orderDirection = ref<'asc' | 'desc'>('asc')
const currentPage = ref(1)
const lastPage = ref(1)
const total = ref(0)
const perPage = ref(5)

let searchTimeout: ReturnType<typeof setTimeout> | null = null

const loadBlogs = async () => {
  loading.value = true
  error.value = null
  try {
    const params: BlogSearchParams = { page: currentPage.value, per_page: perPage.value }
    if (searchQuery.value.trim()) {
      params.search = searchQuery.value.trim()
    }
    if (sortBy.value) {
      params.sort_by = sortBy.value
      params.sort_order = sortOrder.value
    }
    if (orderBy.value) {
      params.order_by = 'order'
      params.order_direction = orderDirection.value
    }
    const resp = await blogApi.getBlogs(params)
    blogs.value = resp.items
    currentPage.value = resp.currentPage
    lastPage.value = resp.lastPage
    perPage.value = resp.perPage
    total.value = resp.total
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load blogs'
    console.error('Error loading blogs:', err)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  if (searchTimeout) {
    clearTimeout(searchTimeout)
  }
  searchTimeout = setTimeout(() => {
    loadBlogs()
  }, 300)
}

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8,<!DOCTYPE svg><svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'><rect fill='%23e0e0e0' width='100%25' height='100%25'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='20'>No Image</text></svg>"

const getImageSrc = (image?: string | null) => {
  if (typeof image === 'string' && image.trim().length > 0) {
    return image
  }
  return PLACEHOLDER_IMG
}

const truncateContent = (content: string | null | undefined, maxLength = 150) => {
  const text = typeof content === 'string' ? content : ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

const openAddModal = () => {
  selectedBlog.value = null
  showModal.value = true
}

const openEditModal = (blog: Blog) => {
  selectedBlog.value = blog
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  selectedBlog.value = null
}

const handleSave = async (payload: BlogCreatePayload) => {
  try {
    if (selectedBlog.value) {
      // Update existing blog
      await blogApi.updateBlog(selectedBlog.value.id, payload)
    } else {
      // Create new blog
      await blogApi.createBlog(payload)
    }
    closeModal()
    await loadBlogs()
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to save blog')
    console.error('Error saving blog:', err)
  }
}

const hasValidId = (b: Partial<Blog>) => typeof b.id === 'number' && !Number.isNaN(b.id)

const handleDelete = async (blog: Blog) => {
  if (!hasValidId(blog)) {
    alert('This article has no valid id and cannot be deleted.')
    return
  }
  if (!confirm(`Are you sure you want to delete "${blog.title}"?`)) {
    return
  }

  try {
    await blogApi.deleteBlog(blog.id)
    await loadBlogs()
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to delete blog')
    console.error('Error deleting blog:', err)
  }
}

const toggleActive = async (blog: Blog) => {
  if (!hasValidId(blog)) {
    alert('This article has no valid id and cannot change status.')
    return
  }
  try {
    if (blog.is_active) {
      await blogApi.setInactive(blog.id)
    } else {
      await blogApi.setActive(blog.id)
    }
    await loadBlogs()
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to update blog status')
    console.error('Error toggling blog status:', err)
  }
}

onMounted(() => {
  loadBlogs()
})

const goPrev = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    loadBlogs()
  }
}

const goNext = () => {
  if (currentPage.value < lastPage.value) {
    currentPage.value++
    loadBlogs()
  }
}
</script>

<style scoped>
.blogs-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: #f5f5f5;
  min-height: 100vh;
}

.blogs-header {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.blogs-header h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #333;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-container {
  position: relative;
}

.search-input {
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  width: 250px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #42b883;
}

.btn-add-new {
  background-color: #42b883;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-add-new:hover {
  background-color: #369870;
}

.sort-container {
  background: white;
  border-radius: 8px;
  padding: 16px 24px;
  margin-bottom: 20px;
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.sort-container label {
  font-weight: 500;
  color: #333;
}

.sort-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: border-color 0.2s;
}

.sort-select:focus {
  outline: none;
  border-color: #42b883;
}

.loading,
.error,
.empty-state {
  text-align: center;
  padding: 40px;
  background: white;
  border-radius: 8px;
  color: #666;
}

.error {
  color: #d32f2f;
}

.blogs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.blog-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.blog-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.blog-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
  background: #f0f0f0;
}

.blog-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.blog-content {
  padding: 16px;
  flex: 1;
}

.blog-title {
  margin: 0 0 12px 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  line-height: 1.4;
}

.blog-preview {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.6;
}

.blog-actions {
  padding: 16px;
  display: flex;
  gap: 8px;
  border-top: 1px solid #f0f0f0;
  flex-wrap: wrap;
}

.btn-action {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  min-width: 80px;
}

.btn-active {
  background-color: #42b883;
  color: white;
}

.btn-active:hover {
  background-color: #369870;
}

.btn-active.btn-inactive {
  background-color: #ccc;
  color: #666;
}

.btn-active.btn-inactive:hover {
  background-color: #bbb;
}

.btn-edit {
  background-color: #2196f3;
  color: white;
}

.btn-edit:hover {
  background-color: #1976d2;
}

.btn-delete {
  background-color: #f44336;
  color: white;
}

.btn-delete:hover {
  background-color: #d32f2f;
}

.pagination {
  margin-top: 16px;
  background: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.btn-pager {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 6px;
  cursor: pointer;
}

.btn-pager:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pager-info {
  color: #666;
}

@media (max-width: 768px) {
  .blogs-header {
    flex-direction: column;
    align-items: stretch;
  }

  .header-actions {
    flex-direction: column;
  }

  .search-input {
    width: 100%;
  }

  .blogs-grid {
    grid-template-columns: 1fr;
  }
}
</style>


<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEdit ? 'Edit Article' : 'Add Article' }}</h2>
        <button class="close-btn" @click="handleClose">×</button>
      </div>

      <div class="modal-body">
        <div class="form-group">
          <label for="title">Title</label>
          <input id="title" v-model="formData.title" type="text" placeholder="Enter article title" class="form-input" />
        </div>

        <div class="form-group">
          <label for="content">Content</label>
          <textarea id="content" v-model="formData.content" placeholder="Enter article content" class="form-textarea" rows="6"></textarea>
        </div>

        <div class="form-group">
          <label for="excerpt">Excerpt</label>
          <input id="excerpt" v-model="formData.excerpt" type="text" placeholder="Short summary" class="form-input" />
        </div>

        <div class="form-group">
          <label for="featured_image">Featured Image</label>
          <input id="featured_image" v-model="formData.featured_image" type="text" placeholder="Enter image URL" class="form-input" />
        </div>

        <div class="form-group">
          <label for="author_id">Author ID</label>
          <input id="author_id" v-model.number="formData.author_id" type="number" min="1" placeholder="Enter author id" class="form-input" />
        </div>

        <div class="form-group">
          <label for="is_active">Active</label>
          <input id="is_active" type="checkbox" v-model="formData.is_active" />
        </div>

        <div class="form-group">
          <label for="order">Order</label>
          <input id="order" v-model.number="formData.order" type="number" min="0" class="form-input" />
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-cancel" @click="handleClose">Cancel</button>
        <button class="btn btn-save" @click="handleSave">Save</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { Blog, BlogCreatePayload } from '../types/blog'

interface Props {
  blog?: Blog | null
}

interface Emits {
  (e: 'close'): void
  (e: 'save', payload: BlogCreatePayload): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isEdit = ref(!!props.blog)

const formData = ref<BlogCreatePayload>({
  title: '',
  content: '',
  author_id: 1,
  excerpt: '',
  featured_image: '',
  is_active: true,
  order: 0
})

// Populate form data when the blog prop changes
watch(
  () => props.blog,
  (blog) => {
    if (blog) {
      formData.value = {
        title: blog.title || '',
        content: blog.content || '',
        author_id: blog.author?.id || blog.author_id || 1,
        excerpt: blog.excerpt || '',
        featured_image: blog.featured_image || '',
        is_active: blog.is_active ?? true,
        order: blog.order ?? 0
      }
      isEdit.value = true
    } else {
      formData.value = {
        title: '',
        content: '',
        author_id: 1,
        excerpt: '',
        featured_image: '',
        is_active: true,
        order: 0
      }
      isEdit.value = false
    }
  },
  { immediate: true }
)

const handleClose = () => {
  emit('close')
}

const handleSave = () => {
  if (!formData.value.title.trim() || !formData.value.content.trim() || !formData.value.author_id) {
    alert('Please fill in all required fields')
    return
  }

  emit('save', { ...formData.value })
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 32px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  transition: color 0.2s;
}

.close-btn:hover {
  color: #000;
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #42b883;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

.btn {
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background: white;
  color: #333;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background: #f5f5f5;
}

.btn-save {
  background-color: #42b883;
  color: white;
}

.btn-save:hover {
  background-color: #369870;
}
</style>


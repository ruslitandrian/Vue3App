<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <h2>Product Detail</h2>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      
      <div class="modal-body">
        <div class="product-image">
          <img :src="product.image" :alt="product.name" />
        </div>
        
        <div class="product-actions">
          <button class="seen-in-btn" @click="handleSeenIn">Seen In</button>
        </div>
        
        <div class="product-description">
          <p>{{ product.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProductWithScenes } from '../types/product'

interface Props {
  product: ProductWithScenes
}

interface Emits {
  (e: 'close'): void
  (e: 'show-seen-in'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClose = () => {
  emit('close')
}

const handleSeenIn = () => {
  emit('show-seen-in')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
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
}

.close-btn:hover {
  color: #000;
}

.modal-body {
  padding: 20px;
}

.product-image {
  width: 100%;
  margin-bottom: 20px;
}

.product-image img {
  width: 100%;
  height: 500px;
  object-fit: cover;
  border-radius: 8px;
}

.product-actions {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.seen-in-btn {
  background-color: #000;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.seen-in-btn:hover {
  background-color: #333;
}

.product-description {
  margin-top: 20px;
}

.product-description p {
  margin: 0;
  line-height: 1.6;
  color: #333;
}
</style>


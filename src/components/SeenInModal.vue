<template>
  <div class="modal-overlay" @click.self="handleClose">
    <div class="modal-content">
      <div class="modal-header">
        <button class="back-btn" @click="handleClose">←</button>
        <h2>Product - Seen In</h2>
        <button class="close-btn" @click="handleClose">×</button>
      </div>
      
      <div class="modal-body">
        <!-- Featured Product -->
        <div class="featured-product">
          <img :src="product.image" :alt="product.name" />
        </div>

        <!-- Scenes -->
        <div v-for="scene in product.scenes" :key="scene.id" class="scene-section">
          <div class="scene-background">
            <img :src="scene.backgroundImage" :alt="`Scene ${scene.id}`" />
          </div>
          
          <div class="associated-products">
            <div 
              v-for="associatedProduct in scene.associatedProducts" 
              :key="associatedProduct.id"
              class="associated-product-card"
            >
              <img :src="associatedProduct.image" :alt="associatedProduct.name" />
            </div>
          </div>
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
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClose = () => {
  emit('close')
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
  z-index: 1001;
}

.modal-content {
  background: white;
  border-radius: 12px;
  max-width: 800px;
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
  position: relative;
}

.modal-header h2 {
  margin: 0;
  font-size: 24px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.back-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-btn:hover {
  color: #000;
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

.featured-product {
  width: 100px;
  margin-bottom: 30px;
}

.featured-product img {
  width: 100%;
  height: 150px;
  object-fit: cover;
  border-radius: 8px;
}

.scene-section {
  margin-bottom: 40px;
}

.scene-background {
  width: 100%;
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
}

.scene-background img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}

.associated-products {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.associated-product-card {
  border-radius: 8px;
  overflow: hidden;
}

.associated-product-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
}
</style>


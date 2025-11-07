<template>
  <section class="product-gallery">
    <!-- Scenic Image -->
    <div class="hero-image">
      <img 
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=600&fit=crop&auto=format" 
        alt="Mountain landscape"
      />
    </div>

    <!-- Product Images -->
    <div class="product-grid">
      <div 
        v-for="product in products" 
        :key="product.id"
        class="product-card"
        @click="openProductDetail(product)"
      >
        <img :src="product.image" :alt="product.name" />
      </div>
    </div>

    <!-- Product Detail Modal -->
    <ProductDetailModal
      v-if="selectedProduct"
      :product="selectedProduct"
      @close="closeProductDetail"
      @show-seen-in="showSeenIn"
    />

    <!-- Seen In Modal -->
    <SeenInModal
      v-if="showSeenInModal && selectedProduct"
      :product="selectedProduct"
      @close="closeSeenIn"
    />
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { ProductWithScenes } from '../types/product'
import ProductDetailModal from '../components/ProductDetailModal.vue'
import SeenInModal from '../components/SeenInModal.vue'
import { productsData } from '../data/products'

const products = productsData
const selectedProduct = ref<ProductWithScenes | null>(null)
const showSeenInModal = ref(false)

const openProductDetail = (product: ProductWithScenes) => {
  selectedProduct.value = product
}

const closeProductDetail = () => {
  selectedProduct.value = null
  showSeenInModal.value = false
}

const showSeenIn = () => {
  showSeenInModal.value = true
}

const closeSeenIn = () => {
  showSeenInModal.value = false
}
</script>

<style scoped>
.product-gallery {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.hero-image {
  width: 100%;
  margin-bottom: 30px;
  border-radius: 8px;
  overflow: hidden;
}

.hero-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.product-card {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.product-card img {
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
}
</style>

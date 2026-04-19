<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProducts } from '../composables/useProducts'
import ProductCard from '../components/products/ProductCard.vue'
import HeroBanner from '../components/products/banner.vue'

// TopSection import removed!

const { sortedProducts, fetchProducts, fetchCategories } = useProducts()
const isPageLoading = ref(true)

onMounted(async () => {
  isPageLoading.value = true
  try {
    await fetchCategories()
    await fetchProducts()
  } finally {
    isPageLoading.value = false
  }
})
</script>

<template>
  <main class="flex-1 relative min-w-0 flex flex-col transition-all duration-300">

    <HeroBanner />
    
    <div v-if="isPageLoading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="text-slate-500 mt-4">Loading products...</p>
    </div>
    
    <div v-else>
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">All Products</h2>
        <p class="text-sm text-slate-500">{{ sortedProducts.length }} items</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <ProductCard 
          v-for="product in sortedProducts" 
          :key="product.id" 
          :product="product"
          @click="$router.push(`/product/${product.id}`)" 
        />
        </div>
    </div>

  </main>
</template>
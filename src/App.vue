<script setup lang="ts">
import { onMounted } from 'vue'
import { useProducts } from './composables/useProducts'

import Sidebar from './components/layout/SideBar.vue'
import SearchBar from './components/ui/SearchBar.vue'
import HeroBanner from './components/products/banner.vue'
import ProductCard from './components/products/ProductCard.vue'

const { products, selectedCategory, fetchCategories, fetchProducts } = useProducts()

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<template>
  <div class="flex min-h-screen bg-slate-50 font-sans text-slate-900">
    
    <Sidebar />

    <main class="flex-1 p-8">
      
      <div class="max-w-2xl mx-auto mb-10">
        <SearchBar />
      </div>

      <HeroBanner />

      <div class="flex items-center justify-between mb-8">
        <div>
          <h3 class="text-2xl font-bold text-slate-900">{{ selectedCategory ? 'Category: ' + selectedCategory : 'All Products' }}</h3>
          <p class="text-slate-500">Showing {{ products.length }} items</p>
        </div>
      </div>

      <ul class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <ProductCard 
          v-for="product in products" 
          :key="product.id" 
          :product="product"
        />
      </ul>

    </main>
  </div>
</template>
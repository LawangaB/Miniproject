<script setup lang="ts">
import { onMounted } from 'vue'
import { useProducts } from './composables/useProducts'
import { useTheme } from './composables/useTheme'
import { useSidebar } from './composables/useSidebar'

import Sidebar from './components/layout/SideBar.vue'
import SearchBar from './components/ui/SearchBar.vue'
import HeroBanner from './components/products/banner.vue'
import ProductCard from './components/products/ProductCard.vue'
import ThemeToggle from './components/ui/ThemeToggle.vue'

// Notice we are importing sortedProducts here now!
const { products, sortedProducts, selectedCategory, displayLimit, fetchCategories, fetchProducts } = useProducts()
const { isSidebarOpen, toggleSidebar } = useSidebar()

// Initialize the theme state (checks localStorage on load)
useTheme() 

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<template>
    <div class="flex min-h-screen bg-slate-50 font-sans text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">    
    <Sidebar />

    <main class="flex-1 px-4 lg:px-8 py-8 relative min-w-0 transition-all duration-300">
      
      <div class="absolute top-8 left-4 lg:left-8 z-50">
        <button 
          @click="toggleSidebar" 
          class="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm"
          aria-label="Toggle Sidebar"
        >
          <svg v-if="!isSidebarOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>

          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        </button>
      </div>
      
      <div class="absolute top-8 right-8 z-50">
        <ThemeToggle />
      </div>

      <div class="max-w-2xl mx-auto mb-16 mt-2">
        <SearchBar />
      </div>

      <HeroBanner />

      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {{ selectedCategory ? 'Category: ' + selectedCategory : 'All Products' }}
          </h3>
          <p class="text-slate-500 dark:text-slate-400">Showing {{ products.length }} items</p>
        </div>

        <div class="flex items-center gap-3">
          <label for="limit" class="text-sm font-bold text-slate-500 dark:text-slate-400">Show:</label>
          <select 
            id="limit" 
            v-model="displayLimit" 
            class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none cursor-pointer shadow-sm transition-colors"
          >
            <option :value="10">10 items</option>
            <option :value="20">20 items</option>
            <option :value="30">30 items</option>
            <option :value="50">50 items</option>
            <option :value="0">All items</option>
          </select>
        </div>
      </div>

      <ul class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <ProductCard 
          v-for="product in sortedProducts" 
          :key="product.id" 
          :product="product"
        />
      </ul>

    </main>
  </div>
</template>
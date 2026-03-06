<script setup lang="ts">
import { useProducts } from '../../composables/useProducts'

const { selectedCategory } = useProducts()
</script>

<template>
  <section class="mb-12 relative overflow-hidden rounded-3xl bg-indigo-600 dark:bg-indigo-900 text-white p-8 md:p-12 shadow-lg shadow-indigo-200 dark:shadow-none transition-colors duration-300">
    
    <div class="relative z-10 max-w-lg">
      <span class="inline-block px-3 py-1 rounded-full bg-indigo-500 dark:bg-indigo-800 text-indigo-100 dark:text-indigo-200 text-xs font-bold uppercase tracking-wider mb-4 transition-colors">
        Limited Offer
      </span>
      
      <h2 class="text-4xl md:text-5xl font-black mb-4 leading-tight">Featured Collection 2026</h2>
      
      <p class="text-indigo-100 dark:text-indigo-200 text-lg mb-8 transition-colors">
        Discover our hand-picked selection of premium goods at unbeatable prices.
      </p>
      
      <button 
        @click="selectedCategory = 'laptops'" 
        class="px-8 py-3 bg-white dark:bg-indigo-50 text-indigo-600 dark:text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 dark:hover:bg-white transition-colors shadow-lg"
      >
        Shop Now
      </button>
    </div>
    
    <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500 dark:bg-indigo-800 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 transition-colors"></div>
    
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 dark:bg-indigo-700 rounded-full blur-3xl opacity-20 -mr-32 -mb-32 transition-colors"></div>
    
  </section>
</template>
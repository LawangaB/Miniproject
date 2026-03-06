<script setup lang="ts">
import { useProducts } from '../../composables/useProducts'

const { selectedCategory } = useProducts()
</script>

<template>
  <section class="mb-12 relative overflow-hidden rounded-3xl bg-indigo-600 text-white p-8 md:p-12 shadow-lg shadow-indigo-200">
    <div class="relative z-10 max-w-lg">
      <span class="inline-block px-3 py-1 rounded-full bg-indigo-500 text-indigo-100 text-xs font-bold uppercase tracking-wider mb-4">Limited Offer</span>
      <h2 class="text-4xl md:text-5xl font-black mb-4 leading-tight">Featured Collection 2026</h2>
      <p class="text-indigo-100 text-lg mb-8">Discover our hand-picked selection of premium goods at unbeatable prices.</p>
      <button @click="selectedCategory = 'laptops'" class="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">Shop Now</button>
    </div>
    
    <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-20 -mr-32 -mb-32"></div>
  </section>
</template>
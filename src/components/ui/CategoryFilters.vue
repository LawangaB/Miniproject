<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { useProducts } from '../../composables/useProducts'

const { categories, selectedCategory } = useProducts()
const router = useRouter()
const route = useRoute()

const categoryColors = [
  'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50',
  'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-900/50',
  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50',
  'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50',
  'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50',
  'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 hover:bg-pink-200 dark:hover:bg-pink-900/50',
  'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-900/50',
  'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-200 dark:hover:bg-cyan-900/50',
]

const getColorForIndex = (index: number) => {
  return categoryColors[index % categoryColors.length]
}

// NEW: Handle category selection + navigation
const handleCategoryClick = (slug: string) => {
  selectedCategory.value = slug
  
  // If user is currently looking at a product, send them home to see the filtered list
  if (route.name === 'product-detail') {
    router.push('/')
  }
}
</script>

<template>
  <div v-if="categories.length > 0" class="w-full">
    <p class="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-1">
      Quick Filters
    </p>

    <div class="flex flex-nowrap items-center gap-3 overflow-x-auto py-2 no-scrollbar scroll-smooth">
      <button 
        @click="handleCategoryClick('')"
        :class="[
          !selectedCategory 
            ? 'bg-indigo-600 dark:bg-indigo-500 text-white scale-105 shadow-md' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
          'px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 shadow-sm cursor-pointer'
        ]"
      >
        All
      </button>
      
      <button 
        v-for="(cat, index) in categories" 
        :key="cat.slug"
        @click="handleCategoryClick(cat.slug)"
        :class="[
          selectedCategory === cat.slug
            ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 scale-105'
            : getColorForIndex(index),
          'px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 shadow-sm cursor-pointer border border-transparent'
        ]"
      >
        {{ cat.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
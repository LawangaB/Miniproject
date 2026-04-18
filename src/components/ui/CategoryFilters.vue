<script setup lang="ts">
import { computed } from 'vue'
import { useProducts } from '../../composables/useProducts'

const { categories, selectedCategory } = useProducts()

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
</script>

<template>
  <div v-if="categories.length > 0" class="mb-8 px-4 lg:px-8">
    <p class="text-xs uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-3">Quick Filters</p>
    <div class="flex flex-wrap gap-2 md:flex-nowrap md:overflow-x-auto md:pb-2 mt-4">
      <button 
        @click="selectedCategory = ''"
        :class="[
          !selectedCategory 
            ? 'bg-indigo-600 dark:bg-indigo-500 text-white' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700',
          'px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 shadow-sm'
        ]"
      >
        All
      </button>
      
      <button 
        v-for="(cat, index) in categories" 
        :key="cat.slug"
        @click="selectedCategory = cat.slug"
        :class="[
          selectedCategory === cat.slug
            ? 'ring-2 ring-indigo-500 bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300'
            : getColorForIndex(index),
          'px-4 py-2 rounded-full text-sm font-semibold transition-all whitespace-nowrap flex-shrink-0 shadow-sm cursor-pointer border border-transparent'
        ]"
      >
        {{ cat.name }}
      </button>
    </div>
  </div>
</template>

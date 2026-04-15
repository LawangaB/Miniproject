<script setup lang="ts">
import { useProducts } from '../../composables/useProducts'

const { searchQuery } = useProducts()
</script>

<template>
  <div class="relative group pb-4"> <!-- Added pb-4 for bottom spacing -->
    <input 
      v-model="searchQuery"
      type="text" 
      placeholder="Search for amazing products..." 
      class="w-full pl-12 pr-4 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 dark:focus:border-indigo-500 transition-all outline-none text-slate-700 dark:text-slate-200 dark:placeholder-slate-400 shadow-sm text-lg"
    />
    <span class="absolute left-4 top-4.5 text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 dark:group-focus-within:text-indigo-400 transition-colors">
      <!-- SVG icon -->
    </span>
  </div>
</template>
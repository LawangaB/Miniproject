<script setup lang="ts">
import { useProducts } from '../../composables/useProducts'

const { searchQuery } = useProducts()
</script>

<template>
  <div class="relative group">
    <input 
      v-model="searchQuery"
      type="text" 
      placeholder="Search for amazing products..." 
      class="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 shadow-sm text-lg"
    />
    <span class="absolute left-4 top-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
    </span>
  </div>
</template>
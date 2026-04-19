<script setup lang="ts">
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { useProducts } from '../../composables/useProducts'

const router = useRouter()
const { searchQuery } = useProducts()

// Navigation logic
const handleSearchNavigation = () => {
  if (router.currentRoute.value.path !== '/') {
    router.push('/')
  }
}

// OPTIONAL: This makes the search feel "live"
// If they start typing on a product page, it flips them back to the home grid
watch(searchQuery, (newQuery) => {
  if (newQuery && router.currentRoute.value.path !== '/') {
    handleSearchNavigation()
  }
})
</script>

<template>
  <div class="flex justify-center w-full">
    <div class="relative w-full max-w-md">
      
      <input 
        type="text" 
        v-model="searchQuery"
        @keyup.enter="handleSearchNavigation" 
        placeholder="Search for amazing products..." 
        class="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
      />
      
      <svg 
        @click="handleSearchNavigation" 
        class="absolute left-3 top-2.5 h-5 w-5 text-slate-400 cursor-pointer hover:text-indigo-500 transition-colors"
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      
    </div>
  </div>
</template>
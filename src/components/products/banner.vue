<script setup lang="ts">
import { useProducts } from '../../composables/useProducts'

const { selectedCategory } = useProducts()

// Function to fetch categories and pick a random one
const shopRandomCategory = async () => {
  try {
    // Fetch all categories from the API
    const response = await fetch('https://dummyjson.com/products/categories')
    const categories = await response.json()
    
    // Select a random category from the array
    if (categories && categories.length > 0) {
      const randomIndex = Math.floor(Math.random() * categories.length)
      const randomCategory = categories[randomIndex]
      
      // Update the selectedCategory with the random category's slug
      // Based on the API response, each category has a "slug" property
      selectedCategory.value = randomCategory.slug
      
      // Optional: Show a toast or console log for debugging
      console.log(`Selected random category: ${randomCategory.name} (${randomCategory.slug})`)
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error)
    // Optional: Fallback to a default category if API fails
    selectedCategory.value = 'beauty'
  }
}
</script>

<template>
  <section class="group mb-12 relative overflow-hidden rounded-3xl bg-indigo-600 dark:bg-indigo-900 text-white p-8 md:p-12 shadow-lg shadow-indigo-200 dark:shadow-none transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-300 dark:hover:shadow-indigo-950/30">
    
    <div class="relative z-10 max-w-lg">
      <span class="inline-block px-3 py-1 rounded-full bg-indigo-500 dark:bg-indigo-800 text-indigo-100 dark:text-indigo-200 text-xs font-bold uppercase tracking-wider mb-4 transition-all duration-300 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-700 group-hover:scale-105">
        Limited Offer
      </span>
      
      <h2 class="text-4xl md:text-5xl font-black mb-4 leading-tight transition-all duration-300 group-hover:translate-x-3 group-hover:scale-105 origin-left">
        Featured Collection 2026
      </h2>
      
      <p class="text-indigo-100 dark:text-indigo-200 text-lg mb-8 transition-all duration-300 group-hover:translate-x-3 delay-75">
        Discover our hand-picked selection of premium goods at unbeatable prices.
      </p>
      
      <button 
        @click="shopRandomCategory" 
        class="px-8 py-3 bg-white dark:bg-indigo-50 text-indigo-600 dark:text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 dark:hover:bg-white hover:scale-105 hover:shadow-xl transition-all duration-300 group-hover:translate-y-[-2px]"
      >
        Shop Now
      </button>
    </div>
    
    <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500 dark:bg-indigo-800 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 transition-all duration-700 group-hover:scale-150 group-hover:opacity-70 group-hover:translate-x-10"></div>
    
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 dark:bg-indigo-700 rounded-full blur-3xl opacity-20 -mr-32 -mb-32 transition-all duration-700 group-hover:scale-125 group-hover:opacity-40 group-hover:-translate-x-10"></div>
    
  </section>
</template>
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useProducts } from '../composables/useProducts'
import ProductCard from '../components/products/ProductCard.vue'
import HeroBanner from '../components/products/banner.vue'

const { sortedProducts, fetchProducts, fetchCategories } = useProducts()
const isPageLoading = ref(true)

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(12)
const itemsPerPageOptions = [12, 24, 48, 96]

// Computed paginated products - access .value here
const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return sortedProducts.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(sortedProducts.value.length / itemsPerPage.value))

// Methods
const changePage = (page: number) => {
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const changeItemsPerPage = (value: number) => {
  itemsPerPage.value = value
  currentPage.value = 1 // Reset to first page
}

onMounted(async () => {
  isPageLoading.value = true
  try {
    await fetchCategories()
    await fetchProducts()
  } finally {
    isPageLoading.value = false
  }
})
</script>

<template>
  <main class="flex-1 relative min-w-0 flex flex-col transition-all duration-300">

    <HeroBanner />
    
    <div v-if="isPageLoading" class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      <p class="text-slate-500 mt-4">Loading products...</p>
    </div>
    
 <div v-else class="px-4 md:px-6 lg:px-8">
      
      <div class="flex items-center justify-between mb-6 flex-wrap gap-4 mt-24">
        <h2 class="text-2xl font-bold text-slate-900 dark:text-white">All Products</h2>
        
        <div class="flex items-center gap-3">
          <label class="text-sm text-slate-600 dark:text-slate-400">Show:</label>
          <select 
            v-model="itemsPerPage"
            @change="changeItemsPerPage(itemsPerPage)"
            class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
              {{ option }} items
            </option>
          </select>
        </div>
      </div>

      <!-- Added padding-top here -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
        <ProductCard 
          v-for="product in paginatedProducts" 
          :key="product.id" 
          :product="product"
          @click="$router.push(`/product/${product.id}`)" 
        />
      </div>

      <!-- Pagination controls with more top margin -->
      <div v-if="totalPages > 1" class="flex justify-center items-center gap-2 mt-16 pb-8 flex-wrap">
        <button 
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>
        
        <div class="flex gap-1">
          <button 
            v-for="page in totalPages"
            :key="page"
            @click="changePage(page)"
            :class="[
              'px-3 py-1.5 rounded-lg transition-all',
              currentPage === page 
                ? 'bg-indigo-600 text-white' 
                : 'border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
            ]"
          >
            {{ page }}
          </button>
        </div>
        
        <button 
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Next
        </button>
      </div>
    </div>

  </main>
</template>
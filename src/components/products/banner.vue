<script setup lang="ts">
import { useProducts } from '../../composables/useProducts'
import { computed, onMounted, ref } from 'vue'

const { selectedCategory, products } = useProducts()
const currentProductIndex = ref(0)

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

// Get products sorted by highest discount
const mostDiscountedProducts = computed(() => {
  return products.value
    .filter(p => p.discountPercentage > 0)
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 5)
})

// Auto-rotate products
onMounted(() => {
  setInterval(() => {
    if (mostDiscountedProducts.value.length > 0) {
      currentProductIndex.value = (currentProductIndex.value + 1) % mostDiscountedProducts.value.length
    }
  }, 4000)
})

const currentProduct = computed(() => {
  if (mostDiscountedProducts.value.length === 0) return null
  return mostDiscountedProducts.value[currentProductIndex.value]
})
</script>

<template>
  <section class="group mb-12 relative overflow-hidden rounded-3xl bg-indigo-600 dark:bg-indigo-900 text-white p-8 md:p-12 shadow-lg shadow-indigo-200 dark:shadow-none transition-all duration-500 hover:shadow-2xl hover:shadow-indigo-300 dark:hover:shadow-indigo-950/30">
    
    <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      <!-- Text Content -->
      <div class="max-w-lg">
        <span class="inline-block px-3 py-1 rounded-full bg-indigo-500 dark:bg-indigo-800 text-indigo-100 dark:text-indigo-200 text-xs font-bold uppercase tracking-wider mb-4 transition-all duration-300 group-hover:bg-indigo-400 dark:group-hover:bg-indigo-700 group-hover:scale-105 animate-pulse">
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

      <!-- Animated Product Carousel -->
      <div v-if="currentProduct" class="relative h-64 md:h-80 flex items-center justify-center">
        <!-- Background rotating circles -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="absolute w-56 h-56 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
          <div class="absolute w-64 h-64 bg-white/5 rounded-full blur-3xl animate-spin" style="animation-duration: 20s;"></div>
        </div>

        <!-- Product Image with Slide Animation -->
        <transition name="slide-fade" mode="out-in">
          <div :key="currentProductIndex" class="relative z-10 text-center">
            <div class="relative mb-4">
              <img 
                :src="currentProduct.thumbnail" 
                :alt="currentProduct.title"
                class="h-64 w-64 object-contain drop-shadow-2xl animate-bounce mx-auto"
                style="animation-duration: 2s;"
              />
              
              <!-- Discount Badge -->
              <div class="absolute -top-3 -right-3 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg animate-pulse">
                -{{ currentProduct.discountPercentage }}%
              </div>

              <!-- Rating Badge -->
              <div class="absolute -bottom-0 -left-2 bg-amber-400 text-slate-900 px-3 py-1 rounded-full font-bold text-xs shadow-lg flex items-center gap-1">
                ⭐ {{ currentProduct.rating.toFixed(1) }}
              </div>
            </div>

            <!-- Product Name -->
            <h3 class="text-xl font-bold text-white line-clamp-2 mb-3">{{ currentProduct.title }}</h3>

            <!-- Pricing Section -->
            <div class="flex items-center justify-center gap-3 mb-2">
              <span class="text-3xl font-black text-green-300">
                ${{ (currentProduct.price - (currentProduct.price * currentProduct.discountPercentage / 100)).toFixed(2) }}
              </span>
              <span class="text-lg text-white/60 line-through">
                ${{ currentProduct.price.toFixed(2) }}
              </span>
            </div>

            <!-- Savings Amount -->
            <div class="text-sm font-semibold text-green-200">
              Save ${{ (currentProduct.price * currentProduct.discountPercentage / 100).toFixed(2) }}
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Carousel Indicators - Positioned at Banner Bottom -->
    <div v-if="currentProduct" class="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
      <button 
        v-for="(product, index) in mostDiscountedProducts"
        :key="product.id"
        @click="currentProductIndex = index"
        :class="[
          index === currentProductIndex 
            ? 'bg-white w-8' 
            : 'bg-white/50 w-2 hover:bg-white/75',
          'h-2 rounded-full transition-all duration-300 cursor-pointer'
        ]"
      ></button>
    </div>
    
    <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500 dark:bg-indigo-800 rounded-full blur-3xl opacity-50 -mr-20 -mt-20 transition-all duration-700 group-hover:scale-150 group-hover:opacity-70 group-hover:translate-x-10"></div>
    
    <div class="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 dark:bg-indigo-700 rounded-full blur-3xl opacity-20 -mr-32 -mb-32 transition-all duration-700 group-hover:scale-125 group-hover:opacity-40 group-hover:-translate-x-10"></div>
    
  </section>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s ease;
}

.slide-fade-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}
</style>
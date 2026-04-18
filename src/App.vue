<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProducts } from './composables/useProducts'
import { useTheme } from './composables/useTheme'
import { useSidebar } from './composables/useSidebar'
import { useCart } from './composables/usecart'
import type { Product } from './types'

import Sidebar from './components/layout/SideBar.vue'
import TopSection from './components/layout/TopSection.vue'
import ProductCard from './components/products/ProductCard.vue'
import ProductModal from './components/products/ProductModal.vue'
import CheckoutModal from './components/products/CheckoutModal.vue'

const { products, sortedProducts, selectedCategory, displayLimit, fetchCategories, fetchProducts } = useProducts()
const { isSidebarOpen, toggleSidebar } = useSidebar()
const { cart, addToCart } = useCart()

useTheme() 

onMounted(() => {
  fetchCategories()
  fetchProducts()
})

// MODAL STATE AND LOGIC
const isProductModalOpen = ref(false)
const selectedModalProduct = ref<Product | null>(null)
const isCheckoutModalOpen = ref(false)

const openProductDetails = (product: Product) => {
  console.log("Card clicked! Opening:", product.title) 
  selectedModalProduct.value = product
  isProductModalOpen.value = true
}

const handleAddToCart = (product: Product) => {
  console.log('App: Add to cart clicked:', product.title)
  addToCart(product)
  console.log('App: Cart items after adding:', cart.value)
}

const handleCartUpdated = () => {
  console.log('App: Cart updated event received')
  console.log('App: Current cart state:', cart.value)
}
</script>

<template>
  <div class="flex min-h-screen max-w-[100vw] bg-slate-50 font-sans text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300">
    
    <Sidebar class="z-50 relative" @checkout-clicked="isCheckoutModalOpen = true" />

    <main class="flex-1 relative min-w-0 flex flex-col transition-all duration-300">
      
      <TopSection/>

      <div class="px-4 lg:px-8 pt-6 pb-12">
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {{ selectedCategory ? 'Category: ' + selectedCategory : 'All Products' }}
            </h3>
            <p class="text-slate-500 dark:text-slate-400">Showing {{ sortedProducts.length }} items</p>
          </div>

          <div class="flex items-center gap-3">
            <label for="limit" class="text-sm font-bold text-slate-500 dark:text-slate-400">Show:</label>
            <select 
              id="limit" 
              v-model="displayLimit" 
              class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2 outline-none cursor-pointer shadow-sm transition-colors"
            >
              <option :value="10">10 items</option>
              <option :value="20">20 items</option>
              <option :value="30">30 items</option>
              <option :value="50">50 items</option>
              <option :value="0">All items</option>
            </select>
          </div>
        </div>

        <ul :class="['grid gap-6', isSidebarOpen ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5']">
          <ProductCard 
            v-for="product in sortedProducts" 
            :key="product.id" 
            :product="product"
            @open-details="openProductDetails(product)"
          />
        </ul>

      </div>
    </main>

    <ProductModal 
      :product="selectedModalProduct"
      :is-open="isProductModalOpen"
      @close="isProductModalOpen = false"
      @cart-updated="handleCartUpdated"
    />

    <CheckoutModal 
      :is-open="isCheckoutModalOpen"
      @close="isCheckoutModalOpen = false"
    />
  </div>
</template>
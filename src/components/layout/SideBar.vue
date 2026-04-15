<script setup lang="ts">
import { useProducts } from '../../composables/useProducts'
import { useCart } from '../../composables/usecart' 
import { useSidebar } from '../../composables/useSidebar'

const { categories, selectedCategory, sortOrder } = useProducts()
const { cart, cartCount, cartTotal, removeFromCart } = useCart()
const { isSidebarOpen, toggleSidebar } = useSidebar()
</script>

<template>
  <aside 
    :class="[
      isSidebarOpen ? 'w-60 border-r border-slate-200 dark:border-slate-800' : 'w-0 border-none',
      'flex-shrink-0 bg-white dark:bg-slate-900 hidden md:flex flex-col sticky top-0 h-screen transition-all duration-300 ease-in-out z-40 overflow-hidden'
    ]"
  >
    <div class="w-60 flex flex-col h-full">
      
      <div class="p-6 border-b border-slate-100 dark:border-slate-800 shrink-0 flex items-center justify-between gap-3">
        <h2 class="text-xl font-bold dark:text-slate-100">Store</h2>
        <button @click="toggleSidebar" class="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors shadow-sm">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
        
        <p class="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest mb-2 px-4">Categories</p>
        
        <button @click="selectedCategory = ''" :class="[!selectedCategory ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400']" class="w-full text-left px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
          All Products
        </button>
        
        <button v-for="cat in categories" :key="cat.slug" @click="selectedCategory = cat.slug" :class="[selectedCategory === cat.slug ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400']" class="w-full text-left px-4 py-2 rounded-xl text-sm font-medium capitalize hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          {{ cat.name }}
        </button>

        <div class="pt-6 pb-2">
          <p class="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-widest px-4">Sort By Price</p>
        </div>

        <button @click="sortOrder = 'default'" :class="[sortOrder === 'default' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400']" class="w-full text-left px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
          Default
        </button>

        <button @click="sortOrder = 'asc'" :class="[sortOrder === 'asc' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400']" class="w-full text-left px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-between items-center cursor-pointer">
          Low to High <span>↑</span>
        </button>

        <button @click="sortOrder = 'desc'" :class="[sortOrder === 'desc' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300' : 'text-slate-600 dark:text-slate-400']" class="w-full text-left px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex justify-between items-center cursor-pointer">
          High to Low <span>↓</span>
        </button>
        
      </nav>

      <div class="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 transition-colors duration-300 shrink-0">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold dark:text-slate-100">Your Cart</h3>
          <span class="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">{{ cartCount }}</span>
        </div>
        
        <div class="max-h-64 overflow-y-auto space-y-3 mb-4 custom-scrollbar">
          <div v-for="item in cart" :key="item.id" class="flex items-center gap-3 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors">
            <img :src="item.thumbnail" class="w-10 h-10 rounded object-cover bg-slate-100 dark:bg-slate-700" />
            <div class="flex-1 min-w-0">
              <p class="text-xs font-bold truncate dark:text-slate-200">{{ item.title }}</p>
              <p class="text-[10px] text-slate-500 dark:text-slate-400">{{ item.quantity }} x ${{ item.price }}</p>
            </div>
            <button @click="removeFromCart(item.id)" class="text-slate-300 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <p v-if="cart.length === 0" class="text-center text-xs text-slate-400 dark:text-slate-500 py-4">Cart is empty</p>
        </div>
        
        <div class="border-t border-slate-200 dark:border-slate-800 pt-3 flex justify-between items-center">
          <span class="text-xs font-bold text-slate-500 dark:text-slate-400">Total</span>
          <span class="text-lg font-black text-indigo-600 dark:text-indigo-400">${{ cartTotal.toFixed(2) }}</span>
        </div>
        
        <button :disabled="cart.length === 0" class="w-full mt-3 py-2 bg-indigo-600 dark:bg-indigo-500 text-white text-sm font-bold rounded-xl disabled:opacity-50 hover:bg-indigo-700 dark:hover:bg-indigo-400 transition-colors cursor-pointer">
          Checkout
        </button>
      </div>
      
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
:global(.dark) .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
</style>
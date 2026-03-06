<script setup lang="ts">
import { useProducts } from '../../composables/useProducts'
import { useCart } from '../../composables/usecart'

const { categories, selectedCategory } = useProducts()
const { cart, cartCount, cartTotal, removeFromCart } = useCart()
</script>

<template>
  <aside class="w-72 bg-white border-r border-slate-200 hidden md:flex flex-col sticky top-0 h-screen">
    <div class="p-6 border-b border-slate-100">
      <h2 class="text-xl font-bold">Store</h2>
    </div>

    <nav class="flex-1 overflow-y-auto p-4 space-y-1">
      <p class="text-[10px] uppercase font-black text-slate-400 tracking-widest mb-2 px-4">Categories</p>
      <button @click="selectedCategory = ''" :class="[!selectedCategory ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600']" class="w-full text-left px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">All Products</button>
      <button v-for="cat in categories" :key="cat.slug" @click="selectedCategory = cat.slug" :class="[selectedCategory === cat.slug ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600']" class="w-full text-left px-4 py-2 rounded-xl text-sm font-medium capitalize hover:bg-slate-50 transition-colors">{{ cat.name }}</button>
    </nav>

    <div class="p-4 bg-slate-50 border-t border-slate-200">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold">Your Cart</h3>
        <span class="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full">{{ cartCount }}</span>
      </div>
      <div class="max-h-64 overflow-y-auto space-y-3 mb-4 custom-scrollbar">
        <div v-for="item in cart" :key="item.id" class="flex items-center gap-3 bg-white p-2 rounded-lg border border-slate-200">
          <img :src="item.thumbnail" class="w-10 h-10 rounded object-cover bg-slate-100" />
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold truncate">{{ item.title }}</p>
            <p class="text-[10px] text-slate-500">{{ item.quantity }} x ${{ item.price }}</p>
          </div>
          <button @click="removeFromCart(item.id)" class="text-slate-300 hover:text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <p v-if="cart.length === 0" class="text-center text-xs text-slate-400 py-4">Cart is empty</p>
      </div>
      <div class="border-t border-slate-200 pt-3 flex justify-between items-center">
        <span class="text-xs font-bold text-slate-500">Total</span>
        <span class="text-lg font-black text-indigo-600">${{ cartTotal.toFixed(2) }}</span>
      </div>
      <button :disabled="cart.length === 0" class="w-full mt-3 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition-colors">Checkout</button>
    </div>
  </aside>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
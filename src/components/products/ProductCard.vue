<script setup lang="ts">
import type { Product } from '../../types'
import { useCart } from '../../composables/usecart'

defineProps<{ product: Product }>()
const { addToCart } = useCart()
</script>

<template>
  <li class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col group">
    <div class="relative h-48 bg-slate-50 flex items-center justify-center p-4">
      <img :src="product.thumbnail" class="h-full object-contain group-hover:scale-110 transition-transform duration-500" />
      <div class="absolute top-3 left-3">
        <span class="px-2 py-1 bg-white/80 backdrop-blur rounded-md text-[10px] font-bold text-slate-500 uppercase tracking-tight shadow-sm">{{ product.category }}</span>
      </div>
    </div>
    <div class="p-5 flex flex-col flex-1">
      <div class="flex items-center gap-1 text-amber-500 text-xs font-bold mb-1">
        ★ {{ product.rating }}
      </div>
      <h2 class="font-bold text-slate-900 line-clamp-1 mb-2">{{ product.title }}</h2>
      <div class="mt-auto flex items-center justify-between pt-4">
        <span class="text-xl font-black text-indigo-600">${{ product.price }}</span>
        <button 
          @click="addToCart(product)"
          class="p-2 bg-slate-900 text-white rounded-lg hover:bg-indigo-600 transition-all active:scale-95 shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
  </li>
</template>
<script setup lang="ts">
import type { Product } from '../../types'
import { useCart } from '../../composables/usecart'
import { computed } from 'vue'

const props = defineProps<{ product: Product }>()

// 1. Add defineEmits so the card can tell the parent when it's clicked
defineEmits(['open-details'])

const { addToCart } = useCart()

// Computed properties for highlighting
const isHighlyRated = computed(() => props.product.rating >= 4.5)
const isLimitedStock = computed(() => props.product.stock <= 10)
const isHighDiscount = computed(() => props.product.discountPercentage >= 15)

const getDiscountedPrice = computed(() => {
  const { price, discountPercentage } = props.product
  return (price - (price * discountPercentage / 100)).toFixed(2)
})

const getSavingsAmount = computed(() => {
  const { price, discountPercentage } = props.product
  return (price * discountPercentage / 100).toFixed(2)
})
</script>

<template>
  <li 
    @click="$emit('open-details')"
    class="cursor-pointer bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl dark:hover:shadow-slate-900/50 transition-all flex flex-col group duration-300 relative"
  >
    
    <div class="absolute top-3 right-3 z-10 flex flex-col gap-2">
      <div 
        v-if="isHighlyRated" 
        class="px-2 py-1 bg-amber-500 text-white rounded-md text-[10px] font-bold uppercase tracking-tight shadow-lg flex items-center gap-1 animate-pulse"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        ★ {{ product.rating.toFixed(1) }} ★
      </div>
      
      <div 
        v-if="isLimitedStock" 
        class="px-2 py-1 bg-red-500 text-white rounded-md text-[10px] font-bold uppercase tracking-tight shadow-lg flex items-center gap-1 animate-pulse"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        Only {{ product.stock }} left!
      </div>
      
      <div 
        v-if="isHighDiscount" 
        class="px-2 py-1 bg-green-500 text-white rounded-md text-[10px] font-bold uppercase tracking-tight shadow-lg flex items-center gap-1 animate-bounce"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
        </svg>
        -{{ product.discountPercentage }}% OFF
      </div>
    </div>
    
    <div class="relative h-48 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center p-4 transition-colors">
      <img :src="product.thumbnail" :alt="product.title" class="h-full object-contain group-hover:scale-110 transition-transform duration-500" />
      <div class="absolute top-3 left-3">
        <span class="px-2 py-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-md text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-tight shadow-sm transition-colors">
          {{ product.category }}
        </span>
      </div>
    </div>
    
    <div class="p-5 flex flex-col flex-1">
      <div class="flex items-center justify-between mb-1">
        <div class="flex items-center gap-1 text-amber-500 text-xs font-bold">
          ★ {{ product.rating.toFixed(1) }}
        </div>
        
        <div v-if="isLimitedStock" class="text-[10px] font-bold text-red-500 animate-pulse">
          🔥 HOT DEAL
        </div>
        <div v-else-if="product.stock <= 20" class="text-[10px] font-bold text-orange-500">
          ⚡ Low Stock
        </div>
      </div>
      
      <h2 class="font-bold text-slate-900 dark:text-slate-100 line-clamp-1 mb-2 transition-colors">
        {{ product.title }}
      </h2>
      
      <div class="flex items-center gap-2 mb-1">
        <span 
          v-if="isHighDiscount"
          class="text-sm text-slate-400 line-through"
        >
          ${{ product.price }}
        </span>
        <span class="text-xl font-black" :class="isHighDiscount ? 'text-green-600 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'">
          ${{ isHighDiscount ? getDiscountedPrice : product.price }}
        </span>
      </div>
      
      <div v-if="isHighDiscount" class="text-xs text-green-600 dark:text-green-400 mb-2 font-semibold">
        Save ${{ getSavingsAmount }}
      </div>
      
      <div class="text-xs text-slate-500 dark:text-slate-400 mb-3">
        {{ product.reviews.length }} reviews
      </div>
      
      <div class="mt-auto flex items-center justify-between pt-4">
        <div v-if="isLimitedStock" class="text-xs text-red-500 font-bold">
          ⚠️ Almost gone!
        </div>
        <div v-else-if="product.stock <= 20" class="text-xs text-orange-500">
          Only {{ product.stock }} left
        </div>
        <div v-else class="text-xs text-green-500">
          ✓ In Stock
        </div>
        
        <button 
          @click.stop="addToCart(product)"
          class="p-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-all active:scale-95 shadow-md"
          :class="{ 
            'bg-red-600 hover:bg-red-700': isLimitedStock, 
            'bg-green-600 hover:bg-green-700': isHighDiscount && !isLimitedStock 
          }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </div>
    </div>
    
    <div 
      v-if="isHighlyRated" 
      class="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    ></div>
    
    <div 
      v-if="isHighDiscount" 
      class="absolute top-0 left-0 w-16 h-16 overflow-hidden pointer-events-none"
    >
      <div class="absolute transform -rotate-45 bg-green-500 text-white text-[10px] font-bold py-1 w-24 text-center shadow-lg" style="top: 12px; left: -24px;">
        SALE!
      </div>
    </div>
  </li>
</template>
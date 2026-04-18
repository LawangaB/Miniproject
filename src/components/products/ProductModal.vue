<script setup lang="ts">
import { toRef, computed, ref } from 'vue'
import type { Product } from '../../types'
import { useCart } from '../../composables/usecart'

const props = withDefaults(defineProps<{
  product: Product | null
  isOpen: boolean
}>(), {
  product: null,
  isOpen: false,
})

const product = toRef(props, 'product')
const isOpen = toRef(props, 'isOpen')
const { cart, cartCount, addToCart: addToCartComposable } = useCart()

const addedToCart = ref(false)

const averageRating = computed(() => {
  if (!product.value || product.value.reviews.length === 0) return 0
  return Number(
    (
      product.value.reviews.reduce((sum, review) => sum + review.rating, 0) /
      product.value.reviews.length
    ).toFixed(1)
  )
})

const originalPrice = computed(() => {
  if (!product.value || product.value.discountPercentage <= 0) return null
  return (product.value.price / (1 - product.value.discountPercentage / 100)).toFixed(2)
})

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'cart-updated'): void
}>()

const handleAddToCart = () => {
  if (product.value) {
    console.log('Modal: Adding to cart', product.value.title)
    addToCartComposable(product.value)
    console.log('Modal: Cart after adding:', cart.value)
    addedToCart.value = true
    emit('cart-updated')
    setTimeout(() => {
      addedToCart.value = false
    }, 2000)
  }
}
</script>

<template>
  <div 
    v-if="isOpen && product" 
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-opacity"
    @click.self="$emit('close')" 
  >
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fade-in-up">
      
      <div class="absolute top-4 right-4 z-20 flex items-center gap-3">
        <div class="bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {{ cartCount }}
        </div>
        <button 
          @click="$emit('close')" 
          class="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="flex-1 overflow-y-auto custom-scrollbar flex flex-col md:flex-row">
        
        <div class="md:w-1/2 bg-slate-100 dark:bg-slate-800 p-8 flex items-center justify-center min-h-[300px]">
          <img 
            :src="product.images[0] || product.thumbnail" 
            :alt="product.title" 
            class="max-w-full max-h-96 object-contain drop-shadow-xl hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div class="md:w-1/2 p-6 sm:p-8 flex flex-col">
          
          <div class="flex justify-between items-start mb-2">
            <span class="text-xs font-black uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {{ product.brand || product.category }}
            </span>
            <span v-if="product.stock > 0" class="px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold rounded-full uppercase">
              {{ product.availabilityStatus }}
            </span>
          </div>

          <h2 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
            {{ product.title }}
          </h2>

          <div class="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div class="flex items-center gap-1 text-amber-500 text-sm font-bold">
              ★ {{ product.rating }}
            </div>
            <span class="text-xs text-slate-400 dark:text-slate-500">SKU: {{ product.sku }}</span>
          </div>

          <div class="mb-6">
            <div class="flex items-baseline gap-3">
              <span class="text-4xl font-black text-slate-900 dark:text-white">${{ product.price }}</span>
              <span v-if="product.discountPercentage > 0" class="text-sm font-semibold text-rose-500 line-through">
                ${{ (product.price / (1 - product.discountPercentage / 100)).toFixed(2) }}
              </span>
            </div>
            <p v-if="product.discountPercentage > 0" class="text-xs text-rose-500 font-medium mt-1">
              You save {{ product.discountPercentage }}%
            </p>
          </div>

          <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
            {{ product.description }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-sm">
            <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">Details</p>
              <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Category:</span> {{ product.category }}</p>
              <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Brand:</span> {{ product.brand }}</p>
              <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">SKU:</span> {{ product.sku }}</p>
              <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Weight:</span> {{ product.weight }} g</p>
              <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Min order:</span> {{ product.minimumOrderQuantity }}</p>
            </div>

            <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">Shipping & Returns</p>
              <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Shipping:</span> {{ product.shippingInformation }}</p>
              <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Warranty:</span> {{ product.warrantyInformation }}</p>
              <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Returns:</span> {{ product.returnPolicy }}</p>
              <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Availability:</span> {{ product.availabilityStatus }}</p>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <p class="text-[10px] font-bold text-slate-400 uppercase mb-2">Dimensions</p>
              <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Width:</span> {{ product.dimensions.width }} cm</p>
              <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Height:</span> {{ product.dimensions.height }} cm</p>
              <p class="text-slate-700 dark:text-slate-300"><span class="font-semibold">Depth:</span> {{ product.dimensions.depth }} cm</p>
            </div>
            
          </div>

          <div class="mb-6">
            <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">Tags</p>
            <div class="flex flex-wrap gap-2">
              <span v-for="tag in product.tags" :key="tag" class="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-200 text-[11px] font-semibold uppercase tracking-wide">
                {{ tag }}
              </span>
            </div>
          </div>

          <div class="mb-6">
            <div class="flex items-center gap-3 mb-3">
              <div class="text-amber-500 text-sm font-bold">★ {{ averageRating }}</div>
              <span class="text-xs text-slate-500 dark:text-slate-400">({{ product.reviews.length }} reviews)</span>
            </div>
            <div class="space-y-3">
              <article v-for="review in product.reviews" :key="review.date + review.reviewerEmail" class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div class="flex justify-between items-center mb-2 text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  <span>{{ review.reviewerName }}</span>
                  <span>{{ new Date(review.date).toLocaleDateString() }}</span>
                </div>
                <p class="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Rating: {{ review.rating }}/5</p>
                <p class="text-slate-600 dark:text-slate-300 text-sm">{{ review.comment }}</p>
              </article>
            </div>
          </div>

          <div class="mt-auto space-y-2">
            <button 
              @click="handleAddToCart" 
              :class="['w-full py-4 font-bold rounded-xl shadow-lg transition-all hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2', addedToCart ? 'bg-green-600 hover:bg-green-700 shadow-green-600/30' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30']"
              class="text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" :class="['h-5 w-5', addedToCart ? 'animate-bounce' : '']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path v-if="addedToCart" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {{ addedToCart ? '✓ Added to Cart!' : `Add to Cart - $${product.price}` }}
            </button>
            <p v-if="addedToCart" class="text-center text-sm text-green-600 font-medium">
              Item added! Cart count: {{ cartCount }}
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optional soft entrance animation */
@keyframes fadeInUp {
  from { opacity: 0; transform: translate3d(0, 20px, 0) scale(0.95); }
  to { opacity: 1; transform: translate3d(0, 0, 0) scale(1); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes scaleUp {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

button:active {
  animation: scaleUp 0.2s ease-out;
}
</style>
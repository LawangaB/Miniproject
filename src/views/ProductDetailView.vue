<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useCart } from '../composables/usecart'
import ProductCard from '../components/products/ProductCard.vue'

const route = useRoute()
const { addToCart } = useCart()
const selectedImage = ref<string>('')

const product = ref<any>(null)
const similarProducts = ref<any[]>([])
const loading = ref(true)
const error = ref(false)

const fetchProductData = async () => {
  loading.value = true
  error.value = false
  const id = route.params.id
  try {
    // 1. Fetch Main Product
    const res = await fetch(`https://dummyjson.com/products/${id}`)
    
    if (!res.ok) {
      error.value = true
      loading.value = false
      return
    }
    
    const data = await res.json()
    product.value = data
    selectedImage.value = data.thumbnail

    // 2. Fetch Similar Products (same category)
    const categoryRes = await fetch(`https://dummyjson.com/products/category/${data.category}`)
    const categoryData = await categoryRes.json()
    
    // Filter out the current product and limit to 4
    similarProducts.value = categoryData.products
      .filter((p: any) => p.id !== data.id)
      .slice(0, 4)
      
  } catch (err) {
    console.error("Error fetching product details:", err)
    error.value = true
  } finally {
    loading.value = false
  }
}

// Watch for route changes (e.g., clicking a similar product)
watch(() => route.params.id, (newId) => {
  if (newId) {
    // 1. Fetch the new data
    fetchProductData()
    
    // 2. Force the main container to scroll up
    // If you used the h-screen layout we discussed earlier:
    const mainContainer = document.querySelector('main')
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
})

onMounted(fetchProductData)
</script>

<template>
  <div class="p-6 lg:p-10 bg-white dark:bg-slate-900 min-h-screen">
    <button @click="$router.push('/')" class="flex items-center gap-2 mb-8 text-slate-500 hover:text-indigo-600 font-bold transition-colors cursor-pointer">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
      </svg>
      Back to Products
    </button>

    <div v-if="loading" class="flex flex-col items-center justify-center py-20">...</div>
    <div v-else-if="error" class="text-center py-20">...</div>

    <div v-else-if="product">
      <div class="grid lg:grid-cols-2 gap-12 animate-fade-in mb-16">
        <div class="flex flex-col gap-4">
  <div class="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden h-[400px] lg:h-[500px]">
    <transition name="slide-fade" mode="out-in">
      <img 
        :key="selectedImage"
        :src="selectedImage" 
        :alt="product.title" 
        class="max-h-full max-w-full object-contain z-10 drop-shadow-2xl" 
      />
    </transition>
    
    <div class="absolute top-4 right-4 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest z-20"
         :class="product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">
      {{ product.availabilityStatus }}
    </div>
  </div>

  <div class="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
    <button 
      v-for="(img, index) in product.images" 
      :key="index"
      @click="selectedImage = img"
      class="w-20 h-20 flex-shrink-0 rounded-xl border-2 transition-all duration-200 overflow-hidden bg-slate-50 dark:bg-slate-800"
      :class="selectedImage === img ? 'border-indigo-600 ring-2 ring-indigo-600/20' : 'border-transparent hover:border-slate-300'"
    >
      <img :src="img" class="w-full h-full object-cover" />
    </button>
  </div>
</div>

        <div>
          <span class="text-indigo-600 font-black uppercase text-xs tracking-widest">{{ product.brand }}</span>
          <h1 class="text-4xl font-bold text-slate-900 dark:text-white mt-2 mb-4">{{ product.title }}</h1>
          
          <div class="flex items-center gap-4 mb-6">
            <p class="text-3xl font-black text-indigo-600">${{ product.price }}</p>
            <span class="bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">-{{ product.discountPercentage }}%</span>
          </div>

          <p class="text-slate-600 dark:text-slate-400 leading-relaxed mb-8">{{ product.description }}</p>
          
          <div class="grid grid-cols-2 gap-4 mb-8">
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Warranty</p>
              <p class="text-sm font-semibold dark:text-slate-200">{{ product.warrantyInformation }}</p>
            </div>
            <div class="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <p class="text-[10px] text-slate-400 uppercase font-bold mb-1">Shipping</p>
              <p class="text-sm font-semibold dark:text-slate-200">{{ product.shippingInformation }}</p>
            </div>
          </div>

          <button @click="addToCart(product)" class="w-full px-12 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 transition-all cursor-pointer shadow-xl shadow-indigo-600/20">
            Add to Shopping Bag
          </button>
        </div>
      </div>

      <div class="mt-16 bg-slate-50 dark:bg-slate-800/30 rounded-3xl p-8">
        <h3 class="text-xl font-bold mb-6 dark:text-white">Product Specifications</h3>
        <div class="grid md:grid-cols-3 gap-8">
          <div>
            <h4 class="text-xs font-black text-slate-400 uppercase mb-3">Dimensions & Weight</h4>
            <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Weight: <span class="font-bold text-slate-900 dark:text-slate-200">{{ product.weight }}Kg</span></li>
              <li>Width: {{ product.dimensions?.width }}cm</li>
              <li>Height: {{ product.dimensions?.height }}cm</li>
              <li>Depth: {{ product.dimensions?.depth }}cm</li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-black text-slate-400 uppercase mb-3">Logistic Info</h4>
            <ul class="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>SKU: {{ product.sku }}</li>
              <li>Policy: {{ product.returnPolicy }}</li>
              <li>Min Order: {{ product.minimumOrderQuantity }} units</li>
            </ul>
          </div>
          <div>
            <h4 class="text-xs font-black text-slate-400 uppercase mb-3">Rating Snapshot</h4>
            <div class="flex items-center gap-2">
              <span class="text-4xl font-black text-slate-900 dark:text-white">{{ product.rating }}</span>
              <div class="text-amber-400 text-xl">★★★★★</div>
            </div>
            <p class="text-xs text-slate-400 mt-1">Based on global reviews</p>
          </div>
        </div>
      </div>

      <div class="mt-16">
        <h3 class="text-2xl font-bold mb-8 dark:text-white">Customer Reviews</h3>
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="(review, index) in product.reviews" :key="index" 
               class="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm">
            <div class="flex justify-between items-start mb-4">
              <div>
                <p class="font-bold dark:text-white">{{ review.reviewerName }}</p>
                <p class="text-[10px] text-slate-400">{{ new Date(review.date).toLocaleDateString() }}</p>
              </div>
              <div class="flex text-amber-400 text-xs">
                <span v-for="star in 5" :key="star">
                  {{ star <= review.rating ? '★' : '☆' }}
                </span>
              </div>
            </div>
            <p class="text-slate-600 dark:text-slate-400 text-sm italic">"{{ review.comment }}"</p>
          </div>
        </div>
      </div>

      <div v-if="similarProducts.length > 0" class="mt-20 border-t border-slate-100 dark:border-slate-800 pt-16">
        <div class="flex items-center justify-between mb-8">
          <div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white">You Might Also Like</h3>
            <p class="text-slate-500 text-sm mt-1">Explore more items in {{ product.category }}</p>
          </div>
          <button @click="$router.push('/')" class="text-indigo-600 font-bold text-sm hover:underline cursor-pointer">
            View All
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard 
            v-for="item in similarProducts" 
            :key="item.id" 
            :product="item"
            class="scale-95 hover:scale-100 transition-transform cursor-pointer" 
            @click="$router.push(`/product/${item.id}`)"
          />
        </div>
        </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>
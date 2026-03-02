<script setup lang="ts">
import { ref , onMounted} from 'vue'

interface Product {
    id: number
    title: string
    description: string
    price: number
    [key: string]: any
}

const products = ref<Product[]>([])

const fetchProducts = async () => {
    try{
        const response = await fetch('https://dummyjson.com/products')
        console.log(response)
        const data = await response.json()
        console.log(data)
        products.value = data.products
        console.log(products.value)
    } catch (error) {
        console.error('Error fetching products:', error)
    }finally {
        console.log('Fetch products attempt completed.')
    }
    
}
onMounted(() => {
    fetchProducts()
})
</script>

<template>
  <div class="min-h-screen bg-slate-50 p-8 font-sans">
    
    <header class="mb-8">
      <h1 class="text-3xl font-bold text-slate-900">Featured Products</h1>
      <p class="text-slate-500 mt-1">Browse our latest arrivals</p>
    </header>

    <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
      
      <li 
        v-for="product in products" 
        :key="product.id"
        class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
      >
        <div class="relative h-56 bg-slate-100 flex items-center justify-center p-4 overflow-hidden">
          <img 
            :src="product.thumbnail" 
            :alt="product.title" 
            class="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500"
          />
          <span class="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-slate-700 shadow-sm uppercase tracking-wider">
            {{ product.category }}
          </span>
        </div>

        <div class="p-5 flex flex-col flex-1">
          
          <div class="flex justify-between items-start gap-2 mb-2">
            <h2 class="text-lg font-bold text-slate-900 leading-tight line-clamp-1" :title="product.title">
              {{ product.title }}
            </h2>
            <div class="flex items-center gap-1 text-amber-500 text-sm font-bold shrink-0">
              ★ {{ product.rating }}
            </div>
          </div>

          <p class="text-slate-500 text-sm line-clamp-2 mb-4 flex-1">
            {{ product.description }}
          </p>

          <div class="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
            <span class="text-2xl font-black text-indigo-600">
              ${{ product.price }}
            </span>
            <button class="px-4 py-2 bg-slate-900 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors duration-200 cursor-pointer">
              Add to Cart
            </button>
          </div>

        </div>
      </li>

    </ul>
  </div>
</template>
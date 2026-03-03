<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'

interface Product {
  id: number
  title: string
  description: string
  price: number
  thumbnail: string
  category: string
  rating: number
}

interface Category {
  slug: string
  name: string
  url: string
}

interface CartItem extends Product {
  quantity: number
}

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const selectedCategory = ref<string>('')
const searchQuery = ref<string>('')
const isLoading = ref(false)
const cart = ref<CartItem[]>([])
const selectedProduct = ref<any>(null)

const openProductDetails = (product: any) => {
  selectedProduct.value = product
  // Prevent scrolling on the main page while modal is open
  document.body.style.overflow = 'hidden'
}

const closeProductDetails = () => {
  selectedProduct.value = null
  document.body.style.overflow = 'auto'
}


/* ---------------- FETCH CATEGORIES ---------------- */
const fetchCategories = async () => {
  try {
    const response = await fetch('https://dummyjson.com/products/categories')
    const data = await response.json()
    categories.value = data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

/* ---------------- CART LOGIC ---------------- */
const addToCart = (product: Product) => {
  const existingItem = cart.value.find(item => item.id === product.id)
  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.value.push({ ...product, quantity: 1 })
  }
}

const cartTotal = computed(() => {
  return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
})

const cartCount = computed(() => {
  return cart.value.reduce((sum, item) => sum + item.quantity, 0)
})

const removeFromCart = (id: number) => {
  cart.value = cart.value.filter(item => item.id !== id)
}


/* ---------------- FETCH PRODUCTS (UNIVERSAL) ---------------- */
const fetchProducts = async () => {
  isLoading.value = true
  try {
    let url = ''

    // 1. If there is a search query, use the search endpoint
    if (searchQuery.value.trim() !== '') {
      url = `https://dummyjson.com/products/search?q=${encodeURIComponent(searchQuery.value)}`
    } 
    // 2. Otherwise, check if a category is selected
    else if (selectedCategory.value) {
      url = `https://dummyjson.com/products/category/${selectedCategory.value}`
    } 
    // 3. Default to all products
    else {
      url = 'https://dummyjson.com/products'
    }

    const response = await fetch(url)
    const data = await response.json()
    products.value = data.products
  } catch (error) {
    console.error('Error fetching products:', error)
  } finally {
    isLoading.value = false
  }
}

/* ---------------- WATCHERS ---------------- */

// Reset search when category changes to avoid conflicting filters
watch(selectedCategory, () => {
  searchQuery.value = '' 
  fetchProducts()
})

// Watch search query with a basic debounce (wait 300ms after user stops typing)
let timeout: ReturnType<typeof setTimeout>
watch(searchQuery, (newVal) => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    // Only search if we aren't just reacting to the reset in the watcher above
    fetchProducts()
  }, 300)
})

/* ---------------- COMPUTED PROPERTIES ---------------- */
const filteredProducts = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesSearch
  })
})

onMounted(() => {
  fetchCategories()
  fetchProducts()
})
</script>

<template>
  <div class="flex min-h-screen bg-slate-50 font-sans text-slate-900">
    
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

    <main class="flex-1 p-8">
      
      <div class="max-w-2xl mx-auto mb-10">
        <div class="relative group">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Search for amazing products..." 
            class="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none text-slate-700 shadow-sm text-lg"
          />
          <span class="absolute left-4 top-4.5 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
        </div>
      </div>

      <section class="mb-12 relative overflow-hidden rounded-3xl bg-indigo-600 text-white p-8 md:p-12 shadow-lg shadow-indigo-200">
        <div class="relative z-10 max-w-lg">
          <span class="inline-block px-3 py-1 rounded-full bg-indigo-500 text-indigo-100 text-xs font-bold uppercase tracking-wider mb-4">Limited Offer</span>
          <h2 class="text-4xl md:text-5xl font-black mb-4 leading-tight">Featured Collection 2026</h2>
          <p class="text-indigo-100 text-lg mb-8">Discover our hand-picked selection of premium goods at unbeatable prices.</p>
          <button @click="selectedCategory = 'laptops'" class="px-8 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">Shop Now</button>
        </div>
        
        <div class="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-50 -mr-20 -mt-20"></div>
        <div class="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full blur-3xl opacity-20 -mr-32 -mb-32"></div>
      </section>

      <div class="flex items-center justify-between mb-8">
        <div>
          <h3 class="text-2xl font-bold text-slate-900">{{ selectedCategory ? 'Category: ' + selectedCategory : 'All Products' }}</h3>
          <p class="text-slate-500">Showing {{ products.length }} items</p>
        </div>
      </div>

      <ul class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
        <li v-for="product in products" :key="product.id" class="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all flex flex-col group">
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
      </ul>
    </main>
  </div>
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
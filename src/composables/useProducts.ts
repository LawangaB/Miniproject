// src/composables/useProducts.ts
import { ref, watch, computed } from 'vue'
import type { Product, Category } from '../types'

// --- GLOBAL STATE ---
const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const selectedCategory = ref<string>('')
const searchQuery = ref<string>('')
const displayLimit = ref<number>(30)
const isLoading = ref(false)
const selectedProduct = ref<any>(null)
const sortOrder = ref<'default' | 'asc' | 'desc'>('default')

export function useProducts() {
  
  // --- FUNCTIONS ---
  const fetchCategories = async () => {
    try {
      const response = await fetch('https://dummyjson.com/products/categories')
      categories.value = await response.json()
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const fetchProducts = async () => {
    isLoading.value = true
    try {
      let baseUrl = 'https://dummyjson.com/products'
      
      if (searchQuery.value.trim() !== '') {
        baseUrl = 'https://dummyjson.com/products/search'
      } else if (selectedCategory.value) {
        baseUrl = `https://dummyjson.com/products/category/${selectedCategory.value}`
      }

      const url = new URL(baseUrl)

      if (searchQuery.value.trim() !== '') {
        url.searchParams.append('q', searchQuery.value)
      }
      
      url.searchParams.append('limit', displayLimit.value.toString())

      const response = await fetch(url.toString())
      const data = await response.json()
      products.value = data.products
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      isLoading.value = false
    }
  }

  const openProductDetails = (product: any) => {
    selectedProduct.value = product
    document.body.style.overflow = 'hidden'
  }

  const closeProductDetails = () => {
    selectedProduct.value = null
    document.body.style.overflow = 'auto'
  }

  // --- COMPUTED PROPERTIES ---
  const sortedProducts = computed(() => {
    const items = [...products.value] 
    
    if (sortOrder.value === 'asc') {
      return items.sort((a, b) => a.price - b.price)
    } else if (sortOrder.value === 'desc') {
      return items.sort((a, b) => b.price - a.price)
    }
    
    return items
  })

  // --- WATCHERS ---
  watch(selectedCategory, () => {
    searchQuery.value = '' 
    fetchProducts()
  })

  watch(displayLimit, () => {
    fetchProducts()
  })

  let timeout: ReturnType<typeof setTimeout>
  watch(searchQuery, () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fetchProducts()
    }, 300)
  })

  // --- EXPORTS ---
  return {
    products,
    categories,
    selectedCategory,
    searchQuery,
    displayLimit,
    isLoading,
    selectedProduct,
    sortOrder,
    sortedProducts,
    fetchCategories,
    fetchProducts,
    openProductDetails,
    closeProductDetails
  }
}
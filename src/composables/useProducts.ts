// src/composables/useProducts.ts
import { ref, watch, computed } from 'vue'
import type { Product, Category } from '../types'

const products = ref<Product[]>([])
const categories = ref<Category[]>([])
const selectedCategory = ref<string>('')
const searchQuery = ref<string>('')
const isLoading = ref(false)
const selectedProduct = ref<any>(null)

export function useProducts() {
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
      let url = ''
      if (searchQuery.value.trim() !== '') {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(searchQuery.value)}`
      } else if (selectedCategory.value) {
        url = `https://dummyjson.com/products/category/${selectedCategory.value}`
      } else {
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

  const openProductDetails = (product: any) => {
    selectedProduct.value = product
    document.body.style.overflow = 'hidden'
  }

  const closeProductDetails = () => {
    selectedProduct.value = null
    document.body.style.overflow = 'auto'
  }

  // Reset search when category changes
  watch(selectedCategory, () => {
    searchQuery.value = '' 
    fetchProducts()
  })

  // Basic debounce for search query
  let timeout: ReturnType<typeof setTimeout>
  watch(searchQuery, () => {
    clearTimeout(timeout)
    timeout = setTimeout(() => {
      fetchProducts()
    }, 300)
  })

  return {
    products,
    categories,
    selectedCategory,
    searchQuery,
    isLoading,
    selectedProduct,
    fetchCategories,
    fetchProducts,
    openProductDetails,
    closeProductDetails
  }
}
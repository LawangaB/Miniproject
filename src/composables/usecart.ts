// src/composables/useCart.ts
import { ref, computed } from 'vue'
import type { Product, CartItem } from '../types'

const cart = ref<CartItem[]>([])

export function useCart() {
  const addToCart = (product: Product) => {
    const existingItem = cart.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      cart.value.push({ ...product, quantity: 1 })
    }
  }

  const removeFromCart = (id: number) => {
    cart.value = cart.value.filter(item => item.id !== id)
  }

  const cartTotal = computed(() => {
    return cart.value.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  })

  const cartCount = computed(() => {
    return cart.value.reduce((sum, item) => sum + item.quantity, 0)
  })

  return { cart, addToCart, removeFromCart, cartTotal, cartCount }
}
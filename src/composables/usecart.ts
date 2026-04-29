// src/composables/useCart.ts
import { ref, computed, watch } from 'vue'
import type { Product, CartItem } from '../types'

// 1. Define the Order Type (You can move this to types.ts later if you want)
export interface Order {
  orderId: string
  date: string
  items: CartItem[]
  total: number
  status: string
  shipping: any
}

// 2. Check browser memory on load
const savedCart = localStorage.getItem('ecommerce_cart')
const savedOrders = localStorage.getItem('ecommerce_orders')

// 3. Initialize state with saved data (or empty arrays if first time)
const cart = ref<CartItem[]>(savedCart ? JSON.parse(savedCart) : [])
const processingOrders = ref<Order[]>(savedOrders ? JSON.parse(savedOrders) : [])
import { useToast } from './useToast'

// 4. Auto-Save Watchers (Deep true ensures it saves when quantities change inside the array)
watch(cart, (newCart) => {
  localStorage.setItem('ecommerce_cart', JSON.stringify(newCart))
}, { deep: true })

watch(processingOrders, (newOrders) => {
  localStorage.setItem('ecommerce_orders', JSON.stringify(newOrders))
}, { deep: true })

export function useCart() {
  const { addToast } = useToast()

  
  const addToCart = (product: Product) => {
    const existingItem = cart.value.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity++
    } else {
      cart.value.push({ ...product, quantity: 1 })
    }
    addToast(`${product.title} added to cart!`, 'success')
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
  const updateQuantity = (productId: number, delta: number) => {
    const item = cart.value.find(i => i.id === productId)
    
    if (item) {
      item.quantity += delta
      
      // If the user decreases quantity to 0 (or below), remove the item completely
      if (item.quantity <= 0) {
        cart.value = cart.value.filter(i => i.id !== productId)
      }
    }
    if (delta === -1) {
      addToast('Item quantity decreased', 'info')
    } else if (delta === 1) {
      addToast('Item quantity increased', 'info')
    }
}

  // 5. The Checkout Function
  const placeOrder = (shippingDetails: any = {}) => {
    if (cart.value.length === 0) return false

    // Create the order snapshot
    const newOrder: Order = {
      orderId: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      date: new Date().toISOString(),
      items: [...cart.value], // Deep copy the cart items
      total: cartTotal.value,
      status: 'Processing',
      shipping: shippingDetails
    }

    // Add to orders list and clear cart
    processingOrders.value.unshift(newOrder)
    cart.value = []

    return newOrder.orderId
  }

  return { 
    cart, 
    processingOrders, 
    addToCart, 
    removeFromCart, 
    cartTotal, 
    updateQuantity,
    cartCount,
    placeOrder 
  }
}
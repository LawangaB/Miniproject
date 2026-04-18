<script setup lang="ts">
import { toRef, ref } from 'vue'
import { useCart } from '../../composables/usecart'

const props = withDefaults(defineProps<{
  isOpen: boolean
}>(), {
  isOpen: false,
})

const isOpen = toRef(props, 'isOpen')
const { cart, cartTotal } = useCart()

const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  zipCode: '',
  cardNumber: '',
})

const isSubmitting = ref(false)
const orderPlaced = ref(false)

const emit = defineEmits<{
  (event: 'close'): void
}>()

const handleSubmit = async () => {
  if (!formData.value.firstName || !formData.value.email || !formData.value.address || !formData.value.cardNumber) {
    alert('Please fill in all required fields')
    return
  }

  isSubmitting.value = true
  
  // Simulate order processing
  setTimeout(() => {
    orderPlaced.value = true
    isSubmitting.value = false
    
    // Show success message for 2 seconds then close
    setTimeout(() => {
      orderPlaced.value = false
      emit('close')
      resetForm()
    }, 2000)
  }, 1500)
}

const resetForm = () => {
  formData.value = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    cardNumber: '',
  }
}
</script>

<template>
  <div 
    v-if="isOpen"
    class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-opacity"
    @click.self="$emit('close')" 
  >
    <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fade-in-up">
      
      <!-- Header -->
      <div class="absolute top-4 right-4 z-20">
        <button 
          @click="$emit('close')" 
          class="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full text-slate-500 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div class="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Checkout</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Complete your purchase</p>
      </div>

      <!-- Success Message -->
      <div 
        v-if="orderPlaced"
        class="flex items-center justify-center h-96 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
      >
        <div class="text-center">
          <div class="mb-4 flex justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-600 dark:text-green-400 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">Order Placed!</h3>
          <p class="text-slate-600 dark:text-slate-300">Thank you for your purchase</p>
        </div>
      </div>

      <!-- Form Content -->
      <div v-else class="flex-1 overflow-y-auto custom-scrollbar">
        <div class="p-6 sm:p-8 space-y-6">
          
          <!-- Order Summary -->
          <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <h3 class="font-bold text-slate-900 dark:text-white mb-3">Order Summary</h3>
            <div class="space-y-2 max-h-32 overflow-y-auto">
              <div v-for="item in cart" :key="item.id" class="flex justify-between text-sm">
                <span class="text-slate-600 dark:text-slate-400">{{ item.title }} x {{ item.quantity }}</span>
                <span class="font-semibold text-slate-900 dark:text-white">${{ (item.price * item.quantity).toFixed(2) }}</span>
              </div>
            </div>
            <div class="border-t border-slate-200 dark:border-slate-700 mt-3 pt-3 flex justify-between font-bold">
              <span class="text-slate-900 dark:text-white">Total:</span>
              <span class="text-lg text-indigo-600 dark:text-indigo-400">${{ cartTotal.toFixed(2) }}</span>
            </div>
          </div>

          <!-- Shipping Information -->
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white mb-3">Shipping Information</h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                <input 
                  v-model="formData.firstName"
                  type="text" 
                  class="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                <input 
                  v-model="formData.lastName"
                  type="text" 
                  class="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                <input 
                  v-model="formData.email"
                  type="email" 
                  class="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                <input 
                  v-model="formData.phone"
                  type="tel" 
                  class="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="+1 (555) 000-0000"
                />
              </div>
            </div>

            <div class="mt-4">
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Address *</label>
              <input 
                v-model="formData.address"
                type="text" 
                class="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                placeholder="123 Main Street"
              />
            </div>

            <div class="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">City</label>
                <input 
                  v-model="formData.city"
                  type="text" 
                  class="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="New York"
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">ZIP Code</label>
                <input 
                  v-model="formData.zipCode"
                  type="text" 
                  class="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>

          <!-- Payment Information -->
          <div>
            <h3 class="font-bold text-slate-900 dark:text-white mb-3">Payment Information</h3>
            <div>
              <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Card Number *</label>
              <input 
                v-model="formData.cardNumber"
                type="text" 
                class="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors"
                placeholder="1234 5678 9012 3456"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-6 sm:p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
        <button 
          @click="$emit('close')" 
          :disabled="isSubmitting"
          class="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-semibold disabled:opacity-50 cursor-pointer"
        >
          Cancel
        </button>
        <button 
          @click="handleSubmit"
          :disabled="isSubmitting || cart.length === 0"
          class="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
        >
          <svg v-if="isSubmitting" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {{ isSubmitting ? 'Processing...' : 'Place Order' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
</style>

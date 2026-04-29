<script setup lang="ts">
import { toRef, ref, watchEffect, watch } from 'vue' // 1. Added 'watch'
import { useRouter } from 'vue-router'
import { useCart } from '../../composables/usecart'
import { useAuth } from '../../composables/useAuth'

const props = withDefaults(defineProps<{
  isOpen: boolean
}>(), {
  isOpen: false,
})

const emit = defineEmits<{
  (event: 'close'): void
}>()

const router = useRouter()
const { user, isLoggedIn } = useAuth()
const { cart, cartTotal, placeOrder, updateQuantity } = useCart() 
const isOpen = toRef(props, 'isOpen')

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

// Auto-fill when logged in
watchEffect(() => {
  if (isLoggedIn.value && user.value) {
    const names = user.value.name ? user.value.name.split(' ') : ['', '']
    formData.value.firstName = names[0] || ''
    formData.value.lastName = names.slice(1).join(' ') || ''
    formData.value.email = user.value.email || ''
  }
})

// 2. NEW: Security wipe on logout
watch(isLoggedIn, (newVal) => {
  if (!newVal) {
    resetForm()
  }
})

const isSubmitting = ref(false)
const orderPlaced = ref(false)

const handleSubmit = async () => {
  if (!formData.value.firstName || !formData.value.email || !formData.value.address || !formData.value.cardNumber) {
    alert('Please fill in all required fields')
    return
  }

  isSubmitting.value = true
  
  setTimeout(() => {
    const orderId = placeOrder({ ...formData.value })
    
    if (orderId) {
      orderPlaced.value = true
      isSubmitting.value = false
      
      setTimeout(() => {
        orderPlaced.value = false
        emit('close')
        resetForm()
        router.push('/orders')
      }, 2000)
    }
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
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <div 
          class="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800"
          @click.stop
        >
          <!-- Header -->
          <div class="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-slate-900 dark:text-white">Checkout</h2>
            <button @click="$emit('close')" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Success State -->
          <div v-if="orderPlaced" class="flex-1 flex flex-col items-center justify-center p-12 text-center">
            <div class="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 class="text-2xl font-bold text-slate-900 dark:text-white mb-2">Order Placed!</h3>
            <p class="text-slate-500">Redirecting to your orders...</p>
          </div>

          <div v-else class="flex-1 overflow-y-auto custom-scrollbar">
  <div class="p-6 sm:p-8 space-y-6">
    
    <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
      <h3 class="font-bold text-slate-900 dark:text-white mb-3">Order Summary</h3>
      
      <div class="space-y-1 max-h-48 overflow-y-auto custom-scrollbar pr-2">
        <div 
          v-for="item in cart" 
          :key="item.id" 
          class="flex items-center justify-between gap-3 py-3 border-b border-slate-200/50 dark:border-slate-700/50 last:border-0"
        >
          <div class="flex-1 min-w-0">
            <p class="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {{ item.title }}
            </p>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              ${{ item.price.toFixed(2) }} each
            </p>
          </div>

          <div class="flex items-center gap-2 bg-white dark:bg-slate-900 rounded-lg p-1 border border-slate-200 dark:border-slate-700 shadow-sm">
            <button 
              type="button"
              @click="updateQuantity(item.id, -1)" 
              class="w-6 h-6 flex items-center justify-center rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-red-500 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
              </svg>
            </button>
            
            <span class="text-xs font-bold w-4 text-center text-slate-900 dark:text-white">
              {{ item.quantity }}
            </span>
            
            <button 
              type="button"
              @click="updateQuantity(item.id, 1)" 
              class="w-6 h-6 flex items-center justify-center rounded bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div class="text-right shrink-0 min-w-[70px]">
            <span class="text-sm font-bold text-indigo-600 dark:text-indigo-400">
              ${{ (item.price * item.quantity).toFixed(2) }}
            </span>
          </div>
        </div>
      </div>

      <div class="border-t border-slate-200 dark:border-slate-700 mt-3 pt-3 flex justify-between font-bold">
        <span class="text-slate-900 dark:text-white">Total:</span>
        <span class="text-lg text-indigo-600 dark:text-indigo-400">${{ cartTotal.toFixed(2) }}</span>
      </div>
    </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">First Name *</label>
                  <input v-model="formData.firstName" type="text" class="input-field" placeholder="John" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Last Name *</label>
                  <input v-model="formData.lastName" type="text" class="input-field" placeholder="Doe" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email *</label>
                  <input v-model="formData.email" type="email" class="input-field" placeholder="john@example.com" />
                </div>
                <div>
                  <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                  <input v-model="formData.phone" type="tel" class="input-field" placeholder="+94 712345678" />
                </div>
              </div>

              <div class="mb-4">
                <label class="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Address *</label>
                <input v-model="formData.address" type="text" class="input-field" placeholder="123 Main Street" />
              </div>

              <div class="grid grid-cols-2 gap-6">
                <input v-model="formData.city" type="text" class="input-field" placeholder="City" />
                <input v-model="formData.zipCode" type="text" class="input-field" placeholder="ZIP Code" />
              </div>

              <div>
                <h3 class="font-bold text-slate-900 dark:text-white mb-3">Payment</h3>
                <input v-model="formData.cardNumber" type="text" class="input-field" placeholder="Card Number (1234 ...)" />
              </div>
            </div>
          </div>

          <div class="p-6 sm:p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-3">
            <button @click="$emit('close')" :disabled="isSubmitting" class="flex-1 btn-secondary">Cancel</button>
            <button @click="handleSubmit" :disabled="isSubmitting || cart.length === 0" class="flex-1 btn-primary">
              <svg v-if="isSubmitting" class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {{ isSubmitting ? 'Processing...' : 'Place Order' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
@reference "../../assets/main.css";

/* Added Teleport Modal Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.input-field {
  @apply w-full px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-colors;
}
.btn-primary {
  @apply px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-semibold disabled:opacity-50 flex items-center justify-center gap-2;
}
.btn-secondary {
  @apply px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-semibold disabled:opacity-50;
}
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #475569; }
</style>
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
const { cart, cartTotal, placeOrder } = useCart() 
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
      <div 
        v-if="isOpen"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        @click.self="$emit('close')" 
      >
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative animate-fade-in-up">
          
          <div class="absolute top-4 right-4 z-20">
            <button 
              @click="$emit('close')" 
              class="p-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur rounded-full text-slate-500 hover:text-red-500 transition-colors cursor-pointer shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
            <h2 class="text-3xl font-bold text-slate-900 dark:text-white">Checkout</h2>
            <div v-if="isLoggedIn" class="mt-2 inline-flex items-center gap-2 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-md">
              <span class="relative flex h-2 w-2">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              Authenticated: {{ user?.name }}
            </div>
          </div>

          <div v-if="orderPlaced" class="flex items-center justify-center h-96 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20">
            <div class="text-center">
              <div class="mb-4 flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-green-600 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-green-600 mb-2">Order Placed!</h3>
              <p class="text-slate-600 dark:text-slate-300">Thank you for your purchase</p>
            </div>
          </div>

          <div v-else class="flex-1 overflow-y-auto custom-scrollbar">
            <div class="p-6 sm:p-8 space-y-6">
              
              <div class="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <h3 class="font-bold text-slate-900 dark:text-white mb-3">Order Summary</h3>
                <div class="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
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
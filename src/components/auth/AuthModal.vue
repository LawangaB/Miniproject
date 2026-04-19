<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'

// Props and Emits for visibility control
defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

const { login } = useAuth()
const username = ref() // 'DefaulUsername - emilys'
const password = ref() // 'DefaultPassword - emilyspass'
const error = ref('')
const loading = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true
  const result = await login(username.value, password.value)
  loading.value = false
  
  if (result.success) {
    emit('close') // Close modal on success
  } else {
    error.value = result.error || 'Login failed'
  }
}
</script>

<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="$emit('close')"></div>
        
        <div class="relative w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl z-10 border border-slate-200 dark:border-slate-800">
          <h2 class="text-2xl font-bold mb-6 dark:text-white">Sign In</h2>
          
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Username</label>
              <input v-model="username" placeholder="Enter your username" type="text" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Password</label>
              <input v-model="password" placeholder="Enter your password" type="password" class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            
            <p v-if="error" class="text-red-500 text-sm font-medium">{{ error }}</p>

            <button 
              type="submit" 
              :disabled="loading"
              class="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {{ loading ? 'Signing in...' : 'Login' }}
            </button>
          </form>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
/* Optional: Adds a smooth fade when opening/closing */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>
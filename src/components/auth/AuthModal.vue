<script setup lang="ts">
import { ref, watch } from 'vue' // 1. Import watch
import { useAuth } from '../../composables/useAuth'

const props = defineProps<{ isOpen: boolean }>()
const emit = defineEmits(['close'])

const { login } = useAuth()

// 2. Ensure these are completely empty by default (no hardcoded test data)
const username = ref('') 
const password = ref('')
const error = ref('')
const loading = ref(false)
const showPassword = ref(false)

// 3. THE FIX: Wipe the form memory every time the modal closes
watch(() => props.isOpen, (isNowOpen) => {
  if (!isNowOpen) {
    // Modal just closed, clear everything!
    username.value = ''
    password.value = ''
    error.value = ''
    showPassword.value = false
  }
})

const handleLogin = async () => {
  if (!username.value || !password.value) {
    error.value = 'Please enter both username and password'
    return
  }

  error.value = ''
  loading.value = true
  
  const result = await login(username.value, password.value)
  loading.value = false
  
  if (result.success) {
    emit('close') 
  } else {
    password.value = ''
    error.value = result.error || 'Login failed'
  }
}
</script>

<template>
  <Teleport to="body">
    <transition name="modal-fade">
      <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" @click="$emit('close')"></div>
        
        <div class="relative w-full max-w-md bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-2xl z-10 border border-slate-200 dark:border-slate-800 animate-fade-in-up">
          <h2 class="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Sign In</h2>
          
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Username</label>
              <input 
                v-model="username" 
                placeholder="Enter your username" 
                type="text" 
                class="w-full p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
              />
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-400 uppercase mb-1">Password</label>
              <div class="relative">
                <input 
                  v-model="password" 
                  :type="showPassword ? 'text' : 'password'" 
                  placeholder="Enter your password" 
                  class="w-full p-3 pr-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500 transition-all" 
                />
                
                <button 
                  type="button" 
                  @click="showPassword = !showPassword"
                  class="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-indigo-500 transition-colors"
                  tabindex="-1"
                >
                  <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
              </div>
            </div>

            <transition name="modal-fade">
              <p v-if="error" class="text-red-500 text-sm font-bold bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-100 dark:border-red-900/30">
                {{ error }}
              </p>
            </transition>

            <button 
              type="submit" 
              :disabled="loading"
              class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-indigo-500/25 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <svg v-if="loading" class="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>
          </form>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: all 0.3s ease;
}
.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}
</style>
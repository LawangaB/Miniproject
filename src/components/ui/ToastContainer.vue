<script setup lang="ts">
import { useToast } from '../../composables/useToast'

// Access the global reactive state
const { toasts } = useToast()
</script>

<template>
  <Teleport to="body">
    <div 
      class="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none"
    >
      <TransitionGroup name="toast-list">
        <div 
          v-for="toast in toasts" 
          :key="toast.id"
          class="pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl min-w-[280px] max-w-sm border backdrop-blur-md"
          :class="[
            toast.type === 'success' 
              ? 'bg-emerald-500/90 border-emerald-400 text-white' 
              : toast.type === 'error' 
              ? 'bg-rose-500/90 border-rose-400 text-white' 
              : 'bg-slate-800/90 border-slate-700 text-white'
          ]"
        >
          <div class="shrink-0">
            <svg v-if="toast.type === 'success'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else-if="toast.type === 'error'" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <p class="text-sm font-bold tracking-wide">
            {{ toast.message }}
          </p>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
/* Vue TransitionGroup animations */
.toast-list-enter-active,
.toast-list-leave-active {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-list-enter-from {
  opacity: 0;
  transform: translateX(100px) scale(0.5);
}

.toast-list-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Ensure items move smoothly when one is removed */
.toast-list-move {
  transition: transform 0.4s ease;
}
</style>
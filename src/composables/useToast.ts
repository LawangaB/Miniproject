import { ref } from 'vue'

export interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

const toasts = ref<Toast[]>([])

export function useToast() {
  const addToast = (message: string, type: Toast['type'] = 'success') => {
    const id = Date.now()
    toasts.value.push({ id, message, type })
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
      toasts.value = toasts.value.filter(t => t.id !== id)
    }, 3000)
  }

  return { toasts, addToast }
}
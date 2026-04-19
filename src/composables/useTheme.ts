// src/composables/useTheme.ts
import { ref, onMounted, watch } from 'vue'

// Global state
const isDark = ref(false)

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  // Watch for changes and update the HTML tag and LocalStorage
  watch(isDark, (val) => {
    if (val) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  })

  // On initial load, check if they visited before or what their system prefers
  onMounted(() => {
    const savedTheme = localStorage.getItem('theme')
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      isDark.value = true
      document.documentElement.classList.add('dark')
    }
  })

  return { isDark, toggleTheme }
}
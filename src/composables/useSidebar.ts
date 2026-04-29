import { ref } from 'vue'

// 1. Check the screen width when the app first loads.
// Tailwind's 'lg' breakpoint is 1024 pixels.
// We check if 'window' exists just in case you ever add Server-Side Rendering (SSR) later.
const isDesktop = typeof window !== 'undefined' ? window.innerWidth >= 1024 : false

// 2. Set the initial state based on the device
const isSidebarOpen = ref(isDesktop)

export function useSidebar() {
  const toggleSidebar = () => {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  return { isSidebarOpen, toggleSidebar }
}
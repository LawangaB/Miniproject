<script setup lang="ts">
import { ref, watch } from 'vue' // Cleaned up duplicate imports
import { useRoute } from 'vue-router'
import { useTheme } from './composables/useTheme'
import { useSidebar } from './composables/useSidebar'
import ScrollToTop from './components/ui/ScrollToTop.vue'
import Sidebar from './components/layout/SideBar.vue'
import CheckoutModal from './components/products/CheckoutModal.vue'
import TopSection from './components/layout/TopSection.vue'

// 1. Initialize Route and Sidebar
const route = useRoute()
const { isSidebarOpen } = useSidebar()
const isCheckoutModalOpen = ref(false)

// 2. Create the Template Ref for the main container
const mainContent = ref<HTMLElement | null>(null)

// 3. Watch for route changes to reset scroll position
watch(() => route.path, () => {
  if (mainContent.value) {
    // We target the mainContent ref because it is the actual scrolling element
    mainContent.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

// 4. Initialize Theme
useTheme() 
</script>

<template>
  <div 
    class="flex h-screen overflow-hidden w-full bg-slate-50 font-sans text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-all duration-300 ease-in-out"
    :class="isSidebarOpen ? 'pl-60' : 'pl-0'"
  >
    
    <Sidebar @checkout-clicked="isCheckoutModalOpen = true" />

    <main 
      ref="mainContent"
      class="flex-1 h-full overflow-y-auto relative flex flex-col custom-scrollbar"
    >
      
      <div class="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
        <TopSection />
      </div>

      <div class="flex-1">
        <router-view />
      </div>

    </main>

    <CheckoutModal 
      :is-open="isCheckoutModalOpen" 
      @close="isCheckoutModalOpen = false" 
    />
    
    <ScrollToTop />
  </div>
</template>
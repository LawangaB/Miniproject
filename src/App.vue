<script setup lang="ts">
import { ref, watch } from 'vue' 
import { useRoute } from 'vue-router'
import { useTheme } from './composables/useTheme'
import { useSidebar } from './composables/useSidebar'
import ScrollToTop from './components/ui/ScrollToTop.vue'
import Sidebar from './components/layout/SideBar.vue'
import CheckoutModal from './components/products/CheckoutModal.vue'
import TopSection from './components/layout/TopSection.vue'
import ToastContainer from './components/ui/ToastContainer.vue' 

const route = useRoute()
const { isSidebarOpen, toggleSidebar } = useSidebar() 
const isCheckoutModalOpen = ref(false)
const mainContent = ref<HTMLElement | null>(null)

// Reset scroll to top on route change
watch(() => route.path, () => {
  if (mainContent.value) {
    mainContent.value.scrollTo({ top: 0, behavior: 'smooth' })
  }
})

// Initialize theme (Light/Dark mode logic)
useTheme() 
</script>

<template>
  <div 
    class="flex h-screen overflow-hidden w-full bg-slate-50 font-sans text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-[padding] duration-300 ease-in-out transform-gpu"
    :class="isSidebarOpen ? 'lg:pl-60' : 'pl-0'"
  >
    
    <transition name="fade">
      <div 
        v-if="isSidebarOpen" 
        @click="toggleSidebar" 
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
      ></div>
    </transition>

    <Sidebar @checkout-clicked="isCheckoutModalOpen = true" />

    <main 
      ref="mainContent"
      class="flex-1 h-full overflow-y-auto relative flex flex-col custom-scrollbar"
    >
      <div class="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
        <TopSection @checkout-clicked="isCheckoutModalOpen = true" />
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

    <ToastContainer />
    
  </div>
</template>

<style scoped>
/* Standard Fade Animation for Mobile Overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Ensure no transitions mess with the layout on the main tag */
main {
  backface-visibility: hidden;
  will-change: scroll-position;
}
</style>
<script setup lang="ts">
import SearchBar from '../ui/SearchBar.vue'
import ThemeToggle from '../ui/ThemeToggle.vue'
import CategoryFilters from '../ui/CategoryFilters.vue'
import HeroBanner from '../products/banner.vue'

// 1. Import the sidebar composable directly!
import { useSidebar } from '../../composables/useSidebar'

// 2. Grab the state and the toggle function
const { isSidebarOpen, toggleSidebar } = useSidebar()

// Notice we completely removed defineProps and defineEmits!
</script>

<template>
  <div class="w-full">
    
    <header 
      class="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm transition-all duration-300"
    >
      <div class="px-4 lg:px-8 py-4">
        
        <div class="flex items-center justify-between gap-4">
          
          <div class="shrink-0 transition-all duration-300 ease-in-out">
            <button 
              @click="toggleSidebar" 
              class="p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              <svg v-if="!isSidebarOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            </button>
          </div>

          <div class="flex-1 max-w-2xl">
            <SearchBar />
          </div>

          <div class="shrink-0">
            <div class="bg-white/90 dark:bg-slate-800/90 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-1">
              <ThemeToggle />
            </div>
          </div>
          
        </div>

        <div class="mt-4 w-full overflow-hidden">
          <CategoryFilters />
        </div>
        
      </div>
    </header>

    <div class="px-4 lg:px-8 pt-6 pb-8">
      <HeroBanner />
    </div>

  </div>
</template>
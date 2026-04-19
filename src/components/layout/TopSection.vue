<script setup lang="ts">
// 1. Added 'computed' to the import list
import { ref, computed } from 'vue' 

import SearchBar from '../ui/SearchBar.vue'
import ThemeToggle from '../ui/ThemeToggle.vue'
import CategoryFilters from '../ui/CategoryFilters.vue'
//import HeroBanner from '../products/banner.vue'
import AuthModal from '../auth/AuthModal.vue'

import { useSidebar } from '../../composables/useSidebar'
import { useAuth } from '../../composables/useAuth'
import { useCart } from '../../composables/usecart'

import { useRouter } from 'vue-router'
import { useProducts } from '../../composables/useProducts'

const { isSidebarOpen, toggleSidebar } = useSidebar()
const { user, isLoggedIn, logout } = useAuth()
const { cart } = useCart()
const router = useRouter()
const { searchQuery, fetchProducts } = useProducts()

// This variable depends on the 'computed' import above
const totalItems = computed(() => cart.value.reduce((sum, item) => sum + item.quantity, 0))

const isAuthModalOpen = ref(false)

const executeSearch = async () => {
  // 1. Fetch the filtered data (if your API requires it)
  // await fetchProducts(searchQuery.value) 

  // 2. Redirect to the Home Page to see the results
  if (router.currentRoute.value.path !== '/') {
    router.push('/')
  }
}

const handleSearch = () => {
  // If the user isn't on the home page, send them there
  if (router.currentRoute.value.path !== '/') {
    router.push('/')
  }
}
</script>

<template>
  <div class="w-full">
    <header class="w-full px-4 pt-4 pb-1 lg:px-8 bg-transparent">
      <div class="px-4 lg:px-8 pt-1 pb-0">
        <div class="flex items-center justify-between gap-4">
          
          <div class="shrink-0">
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

          <div class="flex items-center gap-3">
            <div class="relative mr-2">
              <button class="p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <span 
                  v-if="totalItems > 0"
                  class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-900"
                >
                  {{ totalItems }}
                </span>
              </button>
            </div>

            <div v-if="isLoggedIn && user" class="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 pr-3 rounded-full border border-slate-200 dark:border-slate-700">
              <img :src="user?.image" class="w-8 h-8 rounded-full shadow-sm" alt="User Avatar" />
              <button @click="logout" class="text-xs font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer">
                Logout
              </button>
            </div>
            
            <button 
              v-else 
              @click="isAuthModalOpen = true"
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              Login
            </button>

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

    <AuthModal 
      :is-open="isAuthModalOpen" 
      @close="isAuthModalOpen = false" 
    />

    <div class="px-4 lg:px-8 pt-6 pb-0">
    </div>
  </div>
</template>
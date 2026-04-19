<script setup lang="ts">
import { useCart } from '../composables/usecart'

// Bring in the global list of orders
const { processingOrders } = useCart()
</script>

<template>
  <div class="max-w-4xl mx-auto p-6 lg:p-10 min-h-screen">
    
    <router-link 
      to="/" 
      class="inline-flex items-center gap-2 mb-8 text-sm font-bold text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transform transition-transform group-hover:-translate-x-1" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
      </svg>
      Continue Shopping
    </router-link>

    <h1 class="text-3xl font-black text-slate-900 dark:text-white mb-8">Your Orders</h1>

    <div v-if="processingOrders.length === 0" class="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
      <p class="text-slate-500">You have no active orders.</p>
      <button @click="$router.push('/')" class="mt-4 text-indigo-600 font-bold hover:underline">Start Shopping</button>
    </div>

    <div v-else class="space-y-6">
      <div 
        v-for="order in processingOrders" 
        :key="order.orderId"
        class="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700"
      >
        <div class="flex justify-between items-center border-b border-slate-100 dark:border-slate-700 pb-4 mb-4">
          <div>
            <p class="text-sm text-slate-500">Order ID: <span class="font-bold text-slate-900 dark:text-white">{{ order.orderId }}</span></p>
            <p class="text-xs text-slate-400 mt-1">{{ new Date(order.date).toLocaleDateString() }}</p>
          </div>
          
          <div class="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-black uppercase tracking-wider flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            {{ order.status }}
          </div>
        </div>

        <div class="space-y-3">
          <div v-for="item in order.items" :key="item.id" class="flex items-center gap-4">
            <img :src="item.thumbnail" class="w-12 h-12 rounded-lg object-cover bg-slate-50" />
            <div class="flex-1">
              <p class="text-sm font-bold dark:text-white">{{ item.title }}</p>
              <p class="text-xs text-slate-500">Qty: {{ item.quantity }}</p>
            </div>
            <p class="text-sm font-bold dark:text-white">${{ (item.price * item.quantity).toFixed(2) }}</p>
          </div>
        </div>

        <div class="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
          <p class="text-slate-500 font-medium">Total Paid</p>
          <p class="text-xl font-black text-indigo-600">${{ order.total.toFixed(2) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
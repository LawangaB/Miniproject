// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'
import OrdersView from '../views/OrdersView.vue' // 1. Import your new Orders View

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/product/:id',
      name: 'product-detail',
      component: ProductDetailView,
      props: true
    },
    // 2. Add the route for the checkout success page
    {
      path: '/orders',
      name: 'orders',
      component: OrdersView
    }
  ]
})

export default router
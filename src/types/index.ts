import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProductDetailView from '../views/ProductDetailView.vue'

// --- ROUTER CONFIGURATION ---
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
    }
  ],
  // FIXED: This must be INSIDE the createRouter object
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
}) // This closing brace was missing

export default router

// --- INTERFACES ---
export interface Review {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface Dimensions {
  width: number
  height: number
  depth: number
}

export interface Meta {
  createdAt: string
  updatedAt: string
  barcode: string
  qrCode: string
}

export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand: string
  sku: string
  weight: number
  dimensions: Dimensions
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: Review[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: Meta
  images: string[]
  thumbnail: string
}

export interface Category {
  slug: string
  name: string
  url: string
}

export interface CartItem extends Product {
  quantity: number
}
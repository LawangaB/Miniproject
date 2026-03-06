// src/types/index.ts
export interface Product {
  id: number
  title: string
  description: string
  price: number
  thumbnail: string
  category: string
  rating: number
}

export interface Category {
  slug: string
  name: string
  url: string
}

export interface CartItem extends Product {
  quantity: number
}
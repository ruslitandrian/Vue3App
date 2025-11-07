export interface Product {
  id: string
  name: string
  image: string
  description: string
}

export interface Scene {
  id: string
  backgroundImage: string
  associatedProducts: Product[]
}

export interface ProductWithScenes extends Product {
  scenes: Scene[]
}


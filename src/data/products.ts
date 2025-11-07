import type { ProductWithScenes } from '../types/product'

export const productsData: ProductWithScenes[] = [
  {
    id: '1',
    name: 'Patterned Maxi Dress',
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&auto=format',
    description: 'Beautiful flowing maxi dress with vibrant abstract pattern. Perfect for summer occasions.',
    scenes: [
      {
        id: 'scene1',
        backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
        associatedProducts: [
          {
            id: '1',
            name: 'Patterned Maxi Dress',
            image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=300&fit=crop&auto=format',
            description: 'Beautiful flowing maxi dress'
          },
          {
            id: '4',
            name: 'Black Long Dress',
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=300&fit=crop&auto=format',
            description: 'Elegant black long dress'
          },
          {
            id: '5',
            name: 'Black Short Dress',
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=300&fit=crop&auto=format',
            description: 'Stylish black short dress'
          }
        ]
      },
      {
        id: 'scene2',
        backgroundImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&auto=format',
        associatedProducts: [
          {
            id: '2',
            name: 'Brown Shoulder Bag',
            image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200&h=300&fit=crop&auto=format',
            description: 'Stylish brown crescent bag'
          },
          {
            id: '1',
            name: 'Patterned Maxi Dress',
            image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=300&fit=crop&auto=format',
            description: 'Beautiful flowing maxi dress'
          },
          {
            id: '6',
            name: 'Leather Handbag',
            image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=300&fit=crop&auto=format',
            description: 'Elegant leather handbag'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Brown Shoulder Bag',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=600&fit=crop&auto=format',
    description: 'Stylish brown crescent-shaped shoulder bag with single strap. Perfect for everyday use.',
    scenes: [
      {
        id: 'scene3',
        backgroundImage: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop&auto=format',
        associatedProducts: [
          {
            id: '2',
            name: 'Brown Shoulder Bag',
            image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200&h=300&fit=crop&auto=format',
            description: 'Stylish brown crescent bag'
          },
          {
            id: '1',
            name: 'Patterned Maxi Dress',
            image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=300&fit=crop&auto=format',
            description: 'Beautiful flowing maxi dress'
          },
          {
            id: '7',
            name: 'White Casual Dress',
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=300&fit=crop&auto=format',
            description: 'Casual white dress'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'White Midi Dress',
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&auto=format',
    description: 'Elegant sleeveless white midi dress with textured pattern. Perfect for formal occasions.',
    scenes: [
      {
        id: 'scene4',
        backgroundImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&auto=format',
        associatedProducts: [
          {
            id: '3',
            name: 'White Midi Dress',
            image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=200&h=300&fit=crop&auto=format',
            description: 'Elegant white midi dress'
          },
          {
            id: '8',
            name: 'Elegant Handbag',
            image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=200&h=300&fit=crop&auto=format',
            description: 'Elegant handbag'
          },
          {
            id: '9',
            name: 'Patterned Dress',
            image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=200&h=300&fit=crop&auto=format',
            description: 'Patterned dress'
          }
        ]
      }
    ]
  }
]


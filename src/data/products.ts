import { Product } from '@/types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Premium NPK Fertilizer',
    description: 'Balanced 20-20-20 formula for all crops. Promotes healthy growth and high yields.',
    price: 1250,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    category: 'Fertilizers',
    stock: 150,
    unit: '50kg bag'
  },
  {
    id: '2',
    name: 'Organic Compost',
    description: 'Rich organic matter to improve soil structure and fertility naturally.',
    price: 450,
    image: 'https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&h=300&fit=crop',
    category: 'Fertilizers',
    stock: 200,
    unit: '25kg bag'
  },
  {
    id: '3',
    name: 'Hybrid Wheat Seeds',
    description: 'High-yield variety with disease resistance. Suitable for all regions.',
    price: 2800,
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=300&fit=crop',
    category: 'Seeds',
    stock: 80,
    unit: '10kg pack'
  },
  {
    id: '4',
    name: 'Rice Seeds (Basmati)',
    description: 'Premium aromatic basmati rice seeds for optimal production.',
    price: 3500,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop',
    category: 'Seeds',
    stock: 60,
    unit: '10kg pack'
  },
  {
    id: '5',
    name: 'Drip Irrigation Kit',
    description: 'Complete kit for 1 acre. Water-efficient irrigation solution.',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=400&h=300&fit=crop',
    category: 'Equipment',
    stock: 25,
    unit: 'kit'
  },
  {
    id: '6',
    name: 'Hand Sprayer (16L)',
    description: 'Durable manual sprayer for pesticide and fertilizer application.',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop',
    category: 'Equipment',
    stock: 45,
    unit: 'piece'
  },
  {
    id: '7',
    name: 'Neem Oil Pesticide',
    description: 'Organic pest control solution safe for all crops.',
    price: 650,
    image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?w=400&h=300&fit=crop',
    category: 'Pesticides',
    stock: 120,
    unit: '1L bottle'
  },
  {
    id: '8',
    name: 'Soil Testing Kit',
    description: 'Test NPK, pH and moisture levels. Easy to use at home.',
    price: 2200,
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=300&fit=crop',
    category: 'Equipment',
    stock: 35,
    unit: 'kit'
  }
];

export const categories = ['All', 'Seeds', 'Fertilizers', 'Pesticides', 'Equipment'];

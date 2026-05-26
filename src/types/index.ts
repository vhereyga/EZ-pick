export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'food' | 'drink' | 'dessert';
  image_url: string;
  badge: string | null;
  rating: number;
  review_count: number;
  in_stock: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

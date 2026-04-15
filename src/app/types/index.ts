export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'mates' | 'bombillas' | 'yerba' | 'accesorios';
}

export interface CartItem extends Product {
  quantity: number;
}

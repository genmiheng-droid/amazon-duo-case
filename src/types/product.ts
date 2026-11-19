export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'rating-desc'
  | 'newest';

export type DepartmentOption =
  | 'All Departments'
  | 'Mobile Phone Cases'
  | 'Basic Cases'
  | 'Flip & Wallet Cases'
  | 'Heavy Duty Cases'
  | 'Bumper Cases';

export interface ColorVariant {
  name: string;
  hex: string;
  image?: string;
}

export interface Product {
  id: string;
  asin: string;
  brand: string;
  title: string;
  department: DepartmentOption;
  image: string;
  price: number;
  listPrice?: number;
  rating: number;
  reviewCount: number;
  boughtLastMonth: string;
  isPrime: boolean;
  freeShippingEligible: boolean;
  deliveryDate: string;
  fastestDelivery?: string;
  badge?: 'Overall Pick' | 'Best Seller' | 'Limited time deal';
  voucherDiscountPercent?: number;
  models: string[];
  features: string[];
  colors: ColorVariant[];
  specs: string[];
  isSponsored?: boolean;
  releaseOrder: number;
}

export interface CartItem {
  product: Product;
  selectedColor: ColorVariant;
  selectedModel: string;
  quantity: number;
}

export interface FilterState {
  query: string;
  department: DepartmentOption;
  primeOnly: boolean;
  freeShippingOnly: boolean;
  minRating: number | null;
  selectedBrands: string[];
  priceRange: [number | null, number | null];
  selectedModels: string[];
  selectedFeatures: string[];
  selectedColor: string | null;
}

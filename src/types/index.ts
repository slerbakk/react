// Product types based on the API documentation
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  image:
    | {
        url: string;
        alt: string;
      }
    | string; // API sometimes returns string, sometimes object
  rating: number;
  tags: string[];
  reviews?: Review[];
}

export interface Review {
  id: string;
  username: string;
  rating: number;
  description: string;
}

// API Response types
export interface ProductsApiResponse {
  data: Product[];
  meta: {
    isFirstPage: boolean;
    isLastPage: boolean;
    currentPage: number;
    previousPage: number | null;
    nextPage: number | null;
    pageCount: number;
    totalCount: number;
  };
}

export interface ProductApiResponse {
  data: Product;
}

// Cart types
export interface CartItem extends Product {
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

// Toast types
export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  duration: number;
}

// Form types
export interface ContactFormData {
  fullName: string;
  subject: string;
  email: string;
  message: string;
}

export interface FormErrors {
  [key: string]: string;
}

// Component prop types
export interface ProductCardProps {
  product: Product;
}

export interface SearchBarProps {
  products: Product[];
}

export interface SortFilterProps {
  onSortChange: (sortOption: string) => void;
  currentSort: string;
}

export interface HeaderProps {
  products?: Product[];
}

// Sort options
export type SortOption =
  | "default"
  | "price-low-high"
  | "price-high-low"
  | "name-a-z"
  | "name-z-a"
  | "rating-high-low";

export type BookCategory =
  | "Fiction"
  | "Non-Fiction"
  | "Business & Economics"
  | "Technology & Code"
  | "Design & Architecture"
  | "Philosophy & Ideas"
  | "Biography & History"
  | "Self Development";

export interface BookImage {
  id: string;
  book_id: string;
  url: string;
  display_order: number;
  created_at?: string;
}

export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  price: number;
  mrp?: number | null;
  cover_url: string;
  pages?: number | null;
  language: string;
  isbn?: string | null;
  category: BookCategory | string;
  kindle_url?: string | null;
  weight_grams?: number | null;
  ships_in_days: number;
  published: boolean;
  featured: boolean;
  created_at?: string;
  updated_at?: string;
  images?: BookImage[];
}

export interface CartItem {
  book: Book;
  quantity: number;
}

export type OrderStatus =
  | "paid"
  | "printing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface OrderItem {
  id?: string;
  order_id?: string;
  book_id: string;
  title: string;
  author: string;
  cover_url: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: ShippingAddress;
  status: OrderStatus;
  subtotal: number;
  shipping_fee: number;
  total_amount: number;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  tracking_number?: string | null;
  speed_post_url?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface StoreSettings {
  shipping_fee: number;
  free_shipping_threshold: number | null;
  contact_email: string;
  contact_phone: string;
  announcement_banner?: string | null;
  announcement_enabled?: boolean;
}

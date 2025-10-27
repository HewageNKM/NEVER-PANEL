import { firestore } from "firebase-admin";
import Timestamp = firestore.Timestamp;

// You can inject this from env or Firebase config params if needed
export const BATCH_LIMIT = 450;

export interface Order {
  orderId: string;
  paymentId: string;
  items: OrderItem[];
  fee: number;
  userId?: string;
  shippingFee: number;
  status: string;
  paymentMethodId: string;
  paymentStatus: string;
  discount: number;
  paymentMethod: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export enum PaymentStatus {
  Pending = "Pending",
  Paid = "Paid",
  Failed = "Failed",
  Refunded = "Refunded",
}

export interface OrderItem {
  itemId: string;
  variantId: string;
  name: string;
  variantName: string;
  size: string;
  quantity: number;
  price: number;
}

export interface Variant {
  variantId: string;
  variantName: string;
  images: string[];
  sizes: Size[];
}

export interface Item {
  itemId: string;
  type: string;
  brand: string;
  thumbnail: string;
  variants: Variant[];
  manufacturer: string;
  name: string;
  sellingPrice: number;
  discount: number;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

export interface Size {
  size: string;
  stock: number;
}

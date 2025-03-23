// Constants and Configurations
import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;
import * as functions from "firebase-functions";

export const ADMIN_PHONE = functions.config().admin.mobile;
export const ADMIN_EMAIL = functions.config().admin.email;
export const TEXT_API_KEY = functions.config().textitbiz.key;
export const BATCH_LIMIT = 450;

export interface Order {
    orderId: string,
    paymentId: string,
    items: OrderItem[],
    fee: number,
    shippingFee: number,
    paymentStatus: string,
    discount: number,
    paymentMethod: string,
    customer: Customer,
    tracking: Tracking | null,
    createdAt: Timestamp,
    updatedAt: Timestamp,
}

export enum orderStatus {
    CANCELLED = "Cancelled",
    SHIPPED = "Shipped",
}
export interface Tracking {
    id:string
    trackingNumber: string;
    status: string;

    trackingCompany: string;
    trackingUrl: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
// Enums for better type safety
export enum PaymentMethod {
    IPG = "PAYHERE",
    COD = "COD",
}

export enum PaymentStatus {
    Pending = "Pending",
    Paid = "Paid",
    Failed = "Failed",
}

// Interfaces (Consider moving to separate files if they grow)
export interface OrderItem {
    itemId: string;
    variantId: string;
    name: string;
    variantName: string;
    size: string;
    quantity: number;
    price: number;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
    createdAt: FirebaseFirestore.Timestamp;
    updatedAt: FirebaseFirestore.Timestamp;
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

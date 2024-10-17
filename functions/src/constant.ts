// Constants and Configurations
import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;

export const TEXTIT_API_URL = "https://api.textit.biz/";
export const TEXTIT_AUTH = "Basic 20e5gkd160cdecea7dtd26cfadh8421";
export const ADMIN_PHONE = "94705208999";
export const ADMIN_EMAIL = "neverbe.info@gmail.com";
export const BATCH_LIMIT = 450;

export interface Order {
    orderId: string,
    paymentId: string,
    items: OrderItem[],
    paymentStatus: string,
    paymentMethod: string,
    customer: Customer,
    shippingCost: number,
    tracking: Tracking | null,
    createdAt: Timestamp,
    updatedAt: Timestamp,
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
    PayHere = "PayHere",
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

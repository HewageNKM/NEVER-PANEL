import {orderStatus} from "@/constant";
import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;
export interface Profile {
    id: string,
    username: string,
    email: string,
    imageUrl: string,
}
export interface Item {
    itemId: string,
    type: string,
    brand: string,
    thumbnail: {
        file: File | string,
        url: string,
    },
    variants: Variant[],
    manufacturer: string,
    name: string,
    buyingPrice: number,
    sellingPrice: number,
    discount: number,
    createdAt: Timestamp | null,
    updatedAt: Timestamp | null,
}

export interface Size {
    size: string,
    stock: number,
}

export interface Variant {
    variantId: string,
    variantName: string,
    images: string[],
    sizes: Size[],
}

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

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
}

export interface OrderItem {
    itemId: string,
    variantId: string,
    name: string,
    variantName: string,
    size: string,
    quantity: number,
    price: number,
}

export interface Tracking {
    trackingNumber: string;
    status: orderStatus;

    trackingCompany: string;
    trackingUrl: string;
    updatedAt: Timestamp;
}
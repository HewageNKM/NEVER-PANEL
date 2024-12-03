import {orderStatus} from "@/constant";
import {firestore} from "firebase-admin";
import Timestamp = firestore.Timestamp;
export interface Item {
    itemId: string,
    type: string,
    brand: string,
    thumbnail: Img,
    variants: Variant[],
    manufacturer: string,
    name: string,
    buyingPrice: number,
    sellingPrice: number,
    discount: number,
    listing: "Active" | "Inactive",
    status: "Active" | "Inactive",

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
    images: Img[],
    sizes: Size[],
}

export interface Img{
    url: string,
    file: string,
}

export interface Order {
    orderId: string,
    paymentId: string,
    items: OrderItem[],
    paymentStatus: string,
    paymentMethod: string,
    customer: Customer,
    shippingCost: number,
    from:string,

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
    discount: number,
}

export interface Tracking {
    trackingNumber: string;
    status: orderStatus;

    trackingCompany: string;
    trackingUrl: string;
    updatedAt: Timestamp;
}

export interface Error {
    id: string;
    message: string;
    severity: "error" | "warning" | "info" | "success";
}
import admin, {credential} from 'firebase-admin';
import {Item, Order} from "@/interfaces";
import {NextResponse} from "next/server";
import {paymentMethods, paymentStatus} from "@/constant";

if (!admin.apps.length) {
    admin.initializeApp({
        credential: credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
}

const adminFirestore = admin.firestore();
const adminAuth = admin.auth();

export const getOrders = async (pageNumber: number = 1, size: number = 20) => {
    const offset = (pageNumber - 1) * size;

    const ordersSnapshot = await adminFirestore.collection('orders')
        .orderBy('createdAt', 'desc' as any)
        .limit(size)
        .offset(offset)
        .get();

    let orders: Order[] = [];
    ordersSnapshot.forEach(doc => {
        const order = doc.data() as Order;
        // Check if PaymentStatus is not 'Pending' or PaymentMethod is not 'PayHere'
        if (!(order.paymentStatus === paymentStatus.PENDING && order.paymentMethod === paymentMethods.PAYHERE)) {
            orders.push(order);
        }
    });

    return orders;

};
export const getOrder = async (orderId: string) => {
    const orderDoc = await adminFirestore.collection('orders').doc(orderId).get();
    if(!orderDoc.exists){
        return null;
    }
    return {
        ...orderDoc.data(),
    } as Order;
}
export const getItemById = async (itemId: string) => {
    const itemDoc = await adminFirestore.collection('inventory').doc(itemId).get();
    if(!itemDoc.exists){
        return null;
    }
    return {
        ...itemDoc.data(),
        createdAt: itemDoc.data()?.createdAt.toDate().toLocaleString(),
        updatedAt: itemDoc.data()?.updatedAt.toDate().toLocaleString(),
    } as Item;
}
export const updateOrder = async (order: Order) => {
    return await adminFirestore.collection('orders').doc(order.orderId).set({
        ...order,
        tracking:{
            ...order.tracking,
            updatedAt: admin.firestore.Timestamp.now(),
        },
        updatedAt: admin.firestore.Timestamp.now(),
        createdAt: admin.firestore.Timestamp.fromDate(new Date(order.createdAt._seconds * 1000 + order.createdAt._nanoseconds / 1000000)),
    }, {merge: true});
}

export const verifyIdToken = async (req: any) => {
    const authHeader = req.headers.get("authorization");

    const token = authHeader?.startsWith('Bearer ')
        ? authHeader.split(' ')[1]
        : null;

    if (!token) {
        return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    }

    return await adminAuth.verifyIdToken(token);
}
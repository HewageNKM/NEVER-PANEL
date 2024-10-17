import admin, {credential} from 'firebase-admin';
import {Order} from "@/interfaces";

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

export const adminFirestore = admin.firestore();
export const adminAuth = admin.auth();

export const getOrders = async (pageNumber: number = 1, size: number = 20) => {
    const offset = (pageNumber - 1) * size;

    const ordersSnapshot = await adminFirestore.collection('orders')
        .orderBy('createdAt') // Replace with the field you want to order by
        .limit(size)
        .offset(offset)
        .get();

    let orders:Order[] = []
    ordersSnapshot.forEach(doc => {
        orders.push(doc.data() as Order);
    });

    return orders;
};

export const verifyIdToken = async (token: string) => {
    console.log(token);
    return await adminAuth.verifyIdToken(token);
}
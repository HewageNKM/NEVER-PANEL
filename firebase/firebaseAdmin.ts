import admin, {credential} from 'firebase-admin';
import {Order} from "@/interfaces";
import {NextResponse} from "next/server";

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
const remoteConfig = admin.remoteConfig();

export const getOrders = async (pageNumber: number = 1, size: number = 20) => {
    const offset = (pageNumber - 1) * size;

    const ordersSnapshot = await adminFirestore.collection('orders')
        .orderBy('createdAt', 'desc' as any)
        .limit(size)
        .offset(offset)
        .get();

    let orders: Order[] = []
    ordersSnapshot.forEach(doc => {
        orders.push(doc.data() as Order);
    });

    return orders;
};
export const updateOrder = async (order: Order) => {
    return await adminFirestore.collection('orders').doc(order.orderId).set({
        ...order
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

export const getConfigByKey = async (key: string) => {
    const config = await remoteConfig.getTemplate();
    return config.parameters[key].defaultValue;

}
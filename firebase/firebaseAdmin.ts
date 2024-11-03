import admin, {credential} from 'firebase-admin';
import {Item, Order} from "@/interfaces";
import {NextResponse} from "next/server";
import {paymentMethods, paymentStatus} from "@/constant";
import {uuidv4} from "@firebase/util";

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: credential.cert({
            projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
    });
}

// Firebase services instances
const adminFirestore = admin.firestore();
const adminAuth = admin.auth();
const adminStorageBucket = admin.storage().bucket(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);

// Get paginated orders, excluding 'Pending' orders with 'PayHere' as payment method
export const getOrders = async (pageNumber: number = 1, size: number = 20) => {
    try {
        const offset = (pageNumber - 1) * size;

        // Fetch orders with pagination and sorting by createdAt
        const ordersSnapshot = await adminFirestore.collection('orders')
            .orderBy('createdAt', 'desc' as any)
            .limit(size)
            .offset(offset)
            .get();

        let orders: Order[] = [];
        ordersSnapshot.forEach(doc => {
            const order = doc.data() as Order;
            if (!(order.paymentStatus === paymentStatus.PENDING && order.paymentMethod === paymentMethods.PAYHERE)) {
                orders.push(order);
            }
        });

        console.log(`Fetched ${orders.length} orders on page ${pageNumber}`);
        return orders;

    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Get paginated inventory items
export const getInventoryItems = async (pageNumber: number = 1, size: number = 20) => {
    try {
        const offset = (pageNumber - 1) * size;

        // Fetch inventory items with pagination
        const inventorySnapshot = await adminFirestore.collection('inventory')
            .orderBy('createdAt', 'desc' as any)
            .limit(size)
            .offset(offset)
            .get();

        let items: Item[] = [];
        inventorySnapshot.forEach(doc => {
            items.push({
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate().toLocaleString(),
                updatedAt: doc.data().updatedAt.toDate().toLocaleString(),
            } as Item);
        });

        console.log(`Fetched ${items.length} inventory items on page ${pageNumber}`);
        return items;

    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Fetch a single order by ID
export const getOrder = async (orderId: string) => {
    try {
        const orderDoc = await adminFirestore.collection('orders').doc(orderId).get();
        if (!orderDoc.exists) {
            console.warn(`Order with ID ${orderId} not found`);
            return null;
        }
        return orderDoc.data() as Order;

    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Fetch a single inventory item by ID
export const getItemById = async (itemId: string) => {
    try {
        const itemDoc = await adminFirestore.collection('inventory').doc(itemId).get();
        if (!itemDoc.exists) {
            console.warn(`Item with ID ${itemId} not found`);
            return null;
        }

        const itemData = itemDoc.data();
        return {
            ...itemData,
            createdAt: itemData?.createdAt.toDate(),
            updatedAt: itemData?.updatedAt.toDate(),
        } as Item;

    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Update an order, updating timestamps and nested tracking info
export const updateOrder = async (order: Order) => {
    const updatedOrder: Order = {
        customer: order.customer,
        items: order.items,
        orderId: order.orderId,
        paymentId: order.paymentId,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        shippingCost: order.shippingCost,
        tracking: {
            ...order.tracking,
            updatedAt: admin.firestore.Timestamp.now(),
        },
        updatedAt: admin.firestore.Timestamp.now(),
    }

    try {
        await adminFirestore.collection('orders').doc(order.orderId).set({
            ...updatedOrder,
        }, {merge: true});

        console.log(`Order with ID ${order.orderId} updated successfully`);
    } catch (error: any) {
        console.error(`Error updating order with ID ${order.orderId}:`, error);
        throw new Error(error.message);
    }
};

// Save an item to the inventory
export const saveToInventory = async (item: Item) => {
    try {
        await adminFirestore.collection("inventory").doc(item.itemId).set({
            ...item,
            updatedAt: admin.firestore.Timestamp.now(),
            createdAt: admin.firestore.Timestamp.now(),
        }, {merge: true});

        console.log(`Item with ID ${item.itemId} saved to inventory`);
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Update an existing item in the inventory
export const updateItem = async (item: Item) => {
    try {
        await adminFirestore.collection("inventory").doc(item.itemId).set({
            manufacturer: item.manufacturer,
            name: item.name,
            sellingPrice: item.sellingPrice,
            buyingPrice: item.buyingPrice,
            itemId: item.itemId,
            brand: item.brand,
            thumbnail: item.thumbnail,
            type: item.type,
            discount: item.discount,
            variants: item.variants,
            updatedAt: admin.firestore.Timestamp.now(),
        }, {merge: true});

        console.log(`Item with ID ${item.itemId} updated in inventory`);
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Verify Firebase ID token from request headers
export const verifyIdToken = async (req: any) => {
    try {
        const authHeader = req.headers.get("authorization");
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

        if (!token) {
            console.warn("Authorization token missing");
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }

        return await adminAuth.verifyIdToken(token);

    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Upload a file to Firebase Storage
export const uploadFile = async (file: File, path: string) => {
    try {
        const customFileName = `${file.name}`;
        const filePath = `${path}/${customFileName}`;
        const fileRef = adminStorageBucket.file(filePath);
        const buffer = await file.arrayBuffer();

        await fileRef.save(Buffer.from(buffer), {
            metadata: {
                contentType: file.type,
                firebaseStorageDownloadTokens: uuidv4(),
            },
        });

        await fileRef.makePublic();

        console.log(`File uploaded successfully to ${filePath}`);
        return {
            file: customFileName,
            url: `https://storage.googleapis.com/${adminStorageBucket.name}/${fileRef.name}`,
        };

    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Delete a file from Firebase Storage
export const deleteFiles = async (path: string) => {
    try {
        await adminStorageBucket.file(path).delete();
        console.log(`File at ${path} deleted successfully`);
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

export const deleteItemById = async (itemId: string) => {
    try {
        // Delete all files in the directory and subdirectories
        const [files] = await adminStorageBucket.getFiles({prefix: `inventory/${itemId}/`});

        const deletePromises = files.map(file => file.delete());
        await Promise.all(deletePromises);

        // Delete Firestore document
        await adminFirestore.collection('inventory').doc(itemId).delete();
        console.log(`Item with ID ${itemId} and associated files deleted successfully`);
    } catch (error: any) {
        console.error(`Error deleting item with ID ${itemId}:`, error);
        throw new Error(error.message);
    }
};
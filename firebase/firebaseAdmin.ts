import admin, {credential} from 'firebase-admin';
import {Item, Order, SalesReport} from "@/interfaces";
import {NextResponse} from "next/server";
import {paymentMethods, paymentStatus} from "@/constant";
import {uuidv4} from "@firebase/util";
import {Timestamp} from "firebase-admin/firestore";

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
            .where('paymentStatus', 'not-in', [paymentStatus.PENDING, paymentStatus.FAILED])
            .orderBy('createdAt', 'desc' as any)
            .limit(size)
            .offset(offset)
            .get();

        const orders: Order[] = [];
        ordersSnapshot.forEach(doc => {
            let order: Order = doc.data() as Order;
            order = {
                ...order,
                createdAt: order.createdAt.toDate().toLocaleString(),
                updatedAt: order.updatedAt.toDate().toLocaleString
            }
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
            createdAt: itemData?.createdAt.toDate().toLocaleString(),
            updatedAt: itemData?.updatedAt.toDate().toLocaleString(),
        } as Item;

    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

// Update an order, updating timestamps and nested tracking info
export const updateOrder = async (order: Order) => {
    const updatedOrder: Order = {
        from: order.from,
        customer: order.customer,
        items: order.items,
        orderId: order.orderId,
        paymentId: order.paymentId,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        shippingCost: order.shippingCost,
        updatedAt: admin.firestore.Timestamp.now(),
        tracking: order.tracking ? {
            trackingCompany: order.tracking.trackingCompany,
            trackingNumber: order.tracking.trackingNumber,
            trackingUrl: order.tracking.trackingUrl,
            status: order.tracking.status,
            updatedAt: admin.firestore.Timestamp.now(),
        } : null,
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
            status: item.status,
            thumbnail: item.thumbnail,
            type: item.type,
            discount: item.discount,
            variants: item.variants,
            listing: item.listing,
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
        if (error.code === 404) {
            console.log(`File at ${path} does not exist. Skipping deletion.`);
            return;
        }
        console.error(error);
        throw new Error(error.message);
    }
};

export const deleteItemById = async (itemId: string) => {
    console.log(`[START] Deleting item with ID: ${itemId}`);
    try {
        // Step 1: Log the start of file deletion
        console.log(`[INFO] Retrieving files from storage for item ID: ${itemId}`);
        const [files] = await adminStorageBucket.getFiles({prefix: `inventory/${itemId}/`});

        if (files.length === 0) {
            console.log(`[INFO] No files found for item ID: ${itemId}`);
        } else {
            console.log(`[INFO] Found ${files.length} files for item ID: ${itemId}. Starting deletion.`);
        }

        // Step 2: Log each file being deleted
        const deletePromises = files.map(async (file) => {
            console.log(`[INFO] Deleting file: ${file.name}`);
            await file.delete();
        });

        await Promise.all(deletePromises);
        console.log(`[SUCCESS] All files for item ID: ${itemId} deleted successfully`);

        // Step 3: Log Firestore document deletion
        console.log(`[INFO] Deleting Firestore document for item ID: ${itemId}`);
        await adminFirestore.collection('inventory').doc(itemId).delete();
        console.log(`[SUCCESS] Firestore document for item ID: ${itemId} deleted successfully`);

        console.log(`[END] Successfully deleted item with ID: ${itemId} and associated files`);
    } catch (error: any) {
        console.error(`[ERROR] Error deleting item with ID ${itemId}:`, error);
        throw new Error(error.message);
    }
};

export const getSaleReport = async (fromDate: string, toDate: string) => {
    try {
        console.log(`Fetching sales data from ${fromDate} to ${toDate}`);

        const startTimestamp = admin.firestore.Timestamp.fromDate(new Date(fromDate));
        const endTimestamp = admin.firestore.Timestamp.fromDate(new Date(toDate));

        const ordersQuery = admin.firestore()
            .collection('orders')
            .where('createdAt', '>=', startTimestamp)
            .where('createdAt', '<=', endTimestamp)
            .where('paymentStatus', '==', 'Paid');

        const querySnapshot = await ordersQuery.get();
        if (querySnapshot.empty) {
            console.log('No orders found');
            return [];
        }
        console.log(`Fetched ${querySnapshot.size} orders`);

        const salesData: SalesReport['data'] = [];

        for (const orderDoc of querySnapshot.docs) {
            const order = orderDoc.data() as Order;

            for (const orderItem of order.items) {
                const itemRef = admin.firestore().collection('inventory').doc(orderItem.itemId.toLowerCase());
                const itemDoc = await itemRef.get();

                let item: Item | null = null;
                if (itemDoc.exists) {
                    item = itemDoc.data() as Item;
                }

                const itemType = item?.type || 'Unknown';
                const itemName = item?.name || '[deleted]';
                const manufacturer = item?.manufacturer || '[deleted]';
                const brand = item?.brand || '[deleted]';
                const buyingPrice = item?.buyingPrice || 0;

                // Find or create the type entry
                let typeEntry = salesData.find(entry => entry.type.toLowerCase() === itemType.toLowerCase());
                if (!typeEntry) {
                    typeEntry = {type: itemType, data: []};
                    salesData.push(typeEntry);
                }

                // Find or create the item entry
                let itemEntry = typeEntry.data.find(entry => entry.itemId.toLowerCase() === (item?.itemId || orderItem.itemId).toLowerCase());
                if (!itemEntry) {
                    itemEntry = {
                        itemId: item?.itemId || orderItem.itemId,
                        manufacturer,
                        brand,
                        itemName,
                        data: []
                    };
                    typeEntry.data.push(itemEntry);
                }

                // Find or create the variant entry
                let variantEntry = itemEntry.data.find(entry => entry.variantId.toLowerCase() === orderItem.variantId.toLowerCase());
                if (!variantEntry) {
                    const variant = item?.variants?.find(v => v.variantId.toLowerCase() === orderItem.variantId.toLowerCase());
                    variantEntry = {
                        variantId: orderItem.variantId,
                        variantName: variant?.variantName || '[deleted]',
                        data: []
                    };
                    itemEntry.data.push(variantEntry);
                }

                // Add size details with unique sold price
                const sizeEntry = variantEntry.data.find(
                    entry => entry.size === orderItem.size && entry.soldPrice === orderItem.price
                );
                if (sizeEntry) {
                    sizeEntry.quantity += orderItem.quantity;
                } else {
                    variantEntry.data.push({
                        size: orderItem.size,
                        quantity: orderItem.quantity,
                        soldPrice: orderItem.price,
                        boughtPrice: buyingPrice
                    });
                }
            }
        }

        console.log(salesData);
        return {type: 'sales', data: salesData};
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};

export const getOverview = async () => {
    try {
        // Get the current month start and end timestamps
        console.log('Fetching monthly earnings');
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const startTimestamp = Timestamp.fromDate(startOfMonth);
        const endTimestamp = Timestamp.fromDate(endOfMonth);

        let todayOrdersQuery = adminFirestore.collection('orders').where('createdAt', '>=', startTimestamp).where('createdAt', '<=', endTimestamp).where('paymentStatus', '==', 'Paid')

        const querySnapshot = await todayOrdersQuery.get();

        let earnings = 0;
        let buyingCost = 0;
        let count = 0;

        for (const docSnap of querySnapshot.docs) {
            const data = docSnap.data() as Order;

            if (Array.isArray(data.items)) {
                for (const item of data.items) {
                    earnings += item.price || 0;

                    // Fetch buying price from inventory
                    if (item.itemId) {
                        const inventoryDocRef = adminFirestore.collection("inventory").doc(item.itemId);
                        const inventoryDoc = await inventoryDocRef.get();

                        if (inventoryDoc.exists) {
                            const inventoryData = inventoryDoc.data() as Item;
                            buyingCost += (inventoryData.buyingPrice || 0) * (item.quantity || 1);
                        }
                    }
                }
                count += 1;
            }
        }

        const profit = earnings - buyingCost;
        console.log(`Fetched ${count} orders with total earnings: ${earnings}, buying cost: ${buyingCost}, profit: ${profit}`);
        return {
            totalOrders: count,
            totalEarnings: earnings.toFixed(2),
            totalBuyingCost: buyingCost.toFixed(2),
            totalProfit: profit.toFixed(2),
        };
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
};

export const getUserById = async (userId: string) => {
    try {
        const user = await adminFirestore.collection('users').doc(userId).get();
        if (!user.exists) {
            console.warn(`User with ID ${userId} not found`);
            return null;
        }
        return user.data();
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
}
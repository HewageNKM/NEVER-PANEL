import admin, {credential} from 'firebase-admin';
import {
    CashFlowReport,
    Expense,
    ExpensesReport,
    Item,
    Order,
    PaymentMethod,
    SalesReport,
    StocksReport
} from "@/interfaces";
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
            .limit(size)
            .offset(offset)
            .orderBy('createdAt', 'desc')
            .get();

        const orders: Order[] = [];
        ordersSnapshot.forEach(doc => {
            let order: Order = doc.data() as Order;
            order = {
                ...order,
                customer: order.customer ? {
                    ...order.customer,
                    createdAt: order.customer.createdAt.toDate().toLocaleString(),
                    updatedAt: order.customer.updatedAt.toDate().toLocaleString(),
                } : null,
                createdAt: order?.createdAt?.toDate().toLocaleString(),
                updatedAt: order?.updatedAt?.toDate().toLocaleString(),
                tracking: order?.tracking ? {
                    ...order.tracking,
                    updatedAt: order.tracking.updatedAt.toDate().toLocaleString(),
                } : null,
            }
            orders.push(order);
        });

        console.log(`Fetched ${orders.length} orders on page ${pageNumber}`);
        return orders;

    } catch (error: any) {
        console.error(error);
        throw error
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
        throw error
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
        return {
            ...orderDoc.data(),
            customer: orderDoc.data()?.customer ? {
                ...orderDoc.data()?.customer,
                createdAt: orderDoc.data()?.customer.createdAt.toDate().toLocaleString(),
                updatedAt: orderDoc.data()?.customer.updatedAt.toDate().toLocaleString(),
            } : null,
            tracking: orderDoc.data()?.tracking ? {
                ...orderDoc.data()?.tracking,
                updatedAt: orderDoc.data()?.tracking.updatedAt.toDate().toLocaleString(),
            } : null,
            createdAt: orderDoc.data()?.createdAt.toDate().toLocaleString(),
            updatedAt: orderDoc.data()?.updatedAt.toDate().toLocaleString(),
        } as Order;

    } catch (error: any) {
        console.error(error);
        throw error
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
        throw error;
    }
};

// Update an order, updating timestamps and nested tracking info
export const updateOrder = async (order: Order) => {
    const updatedOrder: Order = {
        ...order,
        customer: order?.customer ? {
            ...order.customer,
            createdAt: admin.firestore.Timestamp.fromDate(new Date(order.customer.createdAt)),
            updatedAt: admin.firestore.Timestamp.fromDate(new Date(order.customer.updatedAt)),
        } : null,
        tracking: order?.tracking ? {
            ...order.tracking,
            updatedAt: admin.firestore.Timestamp.fromDate(new Date(order.tracking.updatedAt)),
        } : null,
        createdAt: admin.firestore.Timestamp.fromDate(new Date(order.createdAt)),
        updatedAt: admin.firestore.Timestamp.fromDate(new Date(order.updatedAt)),
    }
    try {
        await adminFirestore.collection('orders').doc(order.orderId).set({
            ...updatedOrder,
        }, {merge: true});

        console.log(`Order with ID ${order.orderId} updated successfully`);
    } catch (error: any) {
        console.error(error);
        throw error
    }
};

// Save an item to the inventory
export const saveToInventory = async (item: Item) => {
    try {
        await adminFirestore.collection("inventory").doc(item.itemId).set({
            ...item,
            updatedAt: admin.firestore.Timestamp.fromDate(new Date(item.createdAt)),
            createdAt: admin.firestore.Timestamp.fromDate(new Date(item.updatedAt)),
        }, {merge: true});

        console.log(`Item with ID ${item.itemId} saved to inventory`);
    } catch (error: any) {
        console.error(error);
        throw error
    }
};

// Update an existing item in the inventory
export const updateItem = async (item: Item) => {
    try {
        await adminFirestore.collection("inventory").doc(item.itemId).set({
            manufacturer: item.manufacturer,
            name: item.name,
            genders: item.genders,
            description: item.description,
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
            updatedAt: admin.firestore.Timestamp.fromDate(new Date(item.updatedAt)),
        }, {merge: true});

        console.log(`Item with ID ${item.itemId} updated in inventory`);
    } catch (error: any) {
        console.error(error);
        throw error
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
        throw error
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
        throw error;
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
        console.error(error);
        throw error
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
        const itemRefs: FirebaseFirestore.DocumentReference[] = [];

        // Collect item references from orders
        for (const orderDoc of querySnapshot.docs) {
            const order = orderDoc.data() as Order;
            for (const orderItem of order.items) {
                const itemRef = admin.firestore().collection('inventory').doc(orderItem.itemId.toLowerCase());
                if (!itemRefs.some(ref => ref.id === itemRef.id)) {
                    itemRefs.push(itemRef); // Add only unique item references
                }
            }
        }

        // Fetch item documents in parallel
        const itemDocs = await Promise.all(itemRefs.map(ref => ref.get()));
        const itemsMap = new Map<string, Item>(); // Map to store items by itemId

        // Store item data for faster lookup
        itemDocs.forEach(doc => {
            if (doc.exists) {
                itemsMap.set(doc.id.toLowerCase(), doc.data() as Item);
            }
        });
        let totalDiscount = 0
        let totalOrders = 0
        // Process orders with cached item data
        for (const orderDoc of querySnapshot.docs) {
            const order = orderDoc.data() as Order;
            totalDiscount += order?.discount || 0
            totalOrders += 1
            for (const orderItem of order.items) {
                const item = itemsMap.get(orderItem.itemId.toLowerCase()) || null;

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
        console.log(`Fetched sales data for ${salesData.length} types`);
        return {data: salesData, totalDiscount: totalDiscount, totalOrders: totalOrders};
    } catch (error: any) {
        console.error(error);
        throw error;
    }
};

export const getMonthlyOverview = async (from: string, to: string) => {
    try {
        console.log('Fetching monthly earnings');

        const startOfMonth = new Date(from);
        const endOfMonth = new Date(to);

        const startTimestamp = Timestamp.fromDate(startOfMonth);
        const endTimestamp = Timestamp.fromDate(endOfMonth);
        return getOverview(startTimestamp, endTimestamp);
    } catch (e) {
        console.error(e);
        throw e;
    }
};
export const getOverview = async (start: Timestamp, end: Timestamp) => {
    try {
        const todayOrdersQuery = adminFirestore
            .collection('orders')
            .where('createdAt', '>=', start)
            .where('createdAt', '<=', end)
            .where('paymentStatus', '==', 'Paid');

        const querySnapshot = await todayOrdersQuery.get();

        let earnings = 0;
        let buyingCost = 0;
        let count = 0;
        let totalExpense = 0

        // Collect all unique itemIds from the orders
        const itemIds: string[] = [];

        querySnapshot.docs.forEach((docSnap) => {
            const data = docSnap.data() as Order;
            if (Array.isArray(data.items)) {
                data.items.forEach((item) => {
                    if (item.itemId && !itemIds.includes(item.itemId)) {
                        itemIds.push(item.itemId); // Collect unique itemIds
                    }
                });
            }
            count += 1;
        });

        // Fetch all inventory documents in parallel
        const inventoryDocs = await Promise.all(
            itemIds.map((itemId) => adminFirestore.collection('inventory').doc(itemId).get())
        );

        const inventoryDataMap = new Map<string, Item>(); // Map to store inventory data by itemId

        // Cache inventory data in the map for quick lookup
        inventoryDocs.forEach((doc) => {
            if (doc.exists) {
                inventoryDataMap.set(doc.id, doc.data() as Item);
            }
        });
        let discount = 0;
        // Calculate earnings and buying cost using cached inventory data
        querySnapshot.docs.forEach((docSnap) => {
            const data = docSnap.data() as Order;
            if (Array.isArray(data.items)) {
                data.items.forEach((item) => {
                    earnings += (item.price || 0) * item.quantity;
                    // Lookup inventory data in the cache
                    const inventoryData = inventoryDataMap.get(item.itemId);
                    if (inventoryData) {
                        buyingCost += (inventoryData.buyingPrice || 0) * (item.quantity || 1);
                    }
                });
                discount += (data.discount || 0)
            }
        });

        const profit = earnings - buyingCost - discount;
        console.log(`Fetched ${count} orders with total earnings: ${earnings}, buying cost: ${buyingCost}, profit: ${profit}, discount: ${discount}`);
        const expenses = await getExpensesReport(start.toDate().toLocaleString(), end.toDate().toLocaleString());
        expenses.forEach((expense) => {
            expense.data.forEach((data) => {
                totalExpense += data.amount
            })
        })
        return {
            totalOrders: count,
            totalEarnings: earnings.toFixed(2),
            totalBuyingCost: buyingCost.toFixed(2),
            totalProfit: profit.toFixed(2),
            totalDiscount: discount.toFixed(2),
            totalExpense: totalExpense
        };
    } catch (e) {
        console.error(e);
        throw e
    }
}
export const getDailyOverview = async () => {
    try {
        console.log('Fetching daily earnings');

        // Get the current month start and end timestamps
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        startOfDay.setHours(0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        endOfDay.setHours(23, 59, 59);

        const startTimestamp = Timestamp.fromDate(startOfDay);
        const endTimestamp = Timestamp.fromDate(endOfDay);

        return getOverview(startTimestamp, endTimestamp);
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
}
export const getOrdersByDate = async (date: string) => {
    try {
        console.log(`Fetching orders on ${date}`);
        const startDate = new Date(date);
        startDate.setHours(0, 0);
        const endDate = new Date(date);
        endDate.setHours(23, 59);

        const startTimestamp = Timestamp.fromDate(startDate);
        const endTimestamp = Timestamp.fromDate(endDate);

        const ordersQuery = adminFirestore.collection('orders')
            .where('createdAt', '>=', startTimestamp)
            .where('createdAt', '<=', endTimestamp)
            .orderBy('createdAt', 'desc');

        const querySnapshot = await ordersQuery.get();
        if (querySnapshot.empty) {
            console.log('No orders found');
            return [];
        }

        const orders: Order[] = [];
        querySnapshot.forEach(doc => {
            orders.push({
                ...doc.data(),
                createdAt: doc.data().createdAt.toDate().toLocaleString(),
                updatedAt: doc.data().updatedAt.toDate().toLocaleString(),
                customer: doc.data().customer ? {
                    ...doc.data().customer,
                    createdAt: doc.data().customer.createdAt.toDate().toLocaleString(),
                    updatedAt: doc.data().customer.updatedAt.toDate().toLocaleString(),
                } : null,
                tracking: doc.data().tracking ? {
                    ...doc.data().tracking,
                    updatedAt: doc.data().tracking.updatedAt.toDate().toLocaleString(),
                } : null
            } as Order);
        });

        console.log(`Fetched ${orders.length} orders on ${date}`);
        return orders;
    } catch (e) {
        console.error(e);
        throw e
    }
}
export const getStockReport = async (): Promise<StocksReport[]> => {
    try {
        console.log('Fetching stock report');
        const inventoryCollection = adminFirestore.collection('inventory').where('status', '==', 'Active');
        const snapshot = await inventoryCollection.get();

        if (snapshot.empty) {
            console.log('No inventory data found');
            return [];
        }

        const stockReport: StocksReport[] = [];

        snapshot.forEach(doc => {
            const itemData = doc.data() as Item;

            const itemReport = {
                itemId: itemData.itemId,
                manufacturer: itemData.manufacturer,
                brand: itemData.brand,
                itemName: itemData.name,
                data: itemData.variants.map(variant => ({
                    variantId: variant.variantId,
                    variantName: variant.variantName,
                    stock: variant.sizes.map(size => ({
                        size: size.size,
                        stock: size.stock,
                    })),
                })),
            };

            const typeIndex = stockReport.findIndex(
                report => report.type === itemData.type.toLowerCase()
            );

            if (typeIndex > -1) {
                stockReport[typeIndex].data.push(itemReport);
            } else {
                stockReport.push({
                    type: itemData.type.toLowerCase() as 'shoes' | 'sandals' | 'accessories',
                    data: [itemReport],
                });
            }
        });

        return stockReport;
    } catch (e) {
        console.error(e);
        throw e
    }
}

export const getCashReport = async (from: string, to: string): Promise<CashFlowReport[]> => {
    try {
        const startOfMonth = new Date(from);
        const endOfMonth = new Date(to);
        console.log(`Fetching cash report from ${startOfMonth} to ${endOfMonth}`);
        const startTimestamp = Timestamp.fromDate(startOfMonth);
        const endTimestamp = Timestamp.fromDate(endOfMonth);

        const orders = adminFirestore
            .collection('orders')
            .where('createdAt', '>=', startTimestamp)
            .where('createdAt', '<=', endTimestamp)
            .where('paymentStatus', '==', 'Paid');
        let paymentMethods = await adminFirestore.collection("paymentMethods").get()


        const querySnapshot = await orders.get();
        if (querySnapshot.empty) {
            console.log('No orders found');
            return [];
        }
        console.log(`Fetched ${querySnapshot.size} orders`);

        const paymentSummary: { [method: string]: { total: number, fee: number } } = {};

        querySnapshot.forEach((doc) => {
            const order = doc.data() as Order;
            const {paymentMethod, items} = order;

            const itemTotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
            const discountAmount = order?.discount | 0;
            const orderTotal = itemTotal - discountAmount;

            let normalizedMethod: CashFlowReport["method"] = "unknown";
            let fee = 0
            for (const method of paymentMethods.docs) {
                if (method.data().name.toLowerCase() === paymentMethod.toLowerCase()) {
                    normalizedMethod = method.data().name.toLowerCase();
                    fee = Number.parseFloat(method.data().fee)
                    break;
                }
            }

            if (!paymentSummary[normalizedMethod]) {
                paymentSummary[normalizedMethod] = {total: 0, fee: 0};
            }

            paymentSummary[normalizedMethod].fee = fee;
            paymentSummary[normalizedMethod].total += orderTotal - (fee * orderTotal / 100);
        });

        const map = Object.keys(paymentSummary).map((method) => ({
            method: method as CashFlowReport["method"],
            fee: paymentSummary[method].fee,
            total: paymentSummary[method].total,
        }));
        let totalExpense = 0
        const expensesReport = await getExpensesReport(from, to);
        expensesReport.forEach((expense) => {
            expense.data.forEach((data) => {
                totalExpense += data.amount
            })
        })
        console.log(map)
        return {
            report: map,
            totalExpense: totalExpense
        }
    } catch (e) {
        console.error(e);
        throw new Error(e.message);
    }
};

export const addNewExpense = async (expense: Expense) => {
    try {
        console.log('Adding new expense:', expense.id);
        const result = await adminFirestore.collection('expenses').doc(expense.id).set({
            ...expense,
            createdAt: admin.firestore.Timestamp.fromDate(new Date(expense.createdAt)),
        });
        console.log(`Expense added successfully: ${result.writeTime}`);
        return result.writeTime;
    } catch (e) {
        console.error(e)
        throw e
    }
}

export const getAllExpenses = async (page: number, size: number) => {
    try {
        console.log('Fetching all expenses');
        const offset = (page - 1) * size;
        const expenses = await adminFirestore.collection('expenses')
            .limit(size)
            .offset(offset)
            .orderBy('createdAt', 'desc')
            .get();
        const expenseList: Expense[] = [];
        if (expenses.empty) {
            console.log('No expenses found');
            return expenseList;
        }

        expenses.forEach(doc => {
            const data = doc.data() as Expense;
            expenseList.push({
                ...data,
                createdAt: data.createdAt.toDate().toLocaleString(),
            });
        });
        console.log(`Fetched ${expenseList.length} expenses`);
        return expenseList;
    } catch (e) {
        console.error(e)
        throw e
    }
}

export const getAllExpensesByDate = async (from: string, to: string) => {
    try {
        const fromTimestamp = admin.firestore.Timestamp.fromDate(new Date(from));
        const toTimestamp = admin.firestore.Timestamp.fromDate(new Date(to));
        console.log(`Fetching expenses from ${from} to ${to}`);
        const expenses = await adminFirestore.collection('expenses').where('createdAt', '>=', fromTimestamp).where('createdAt', '<=', toTimestamp)
            .orderBy('createdAt', 'desc')
            .get();
        const expenseList: Expense[] = [];
        if (expenses.empty) {
            console.log('No expenses found');
            return expenseList;
        }

        expenses.forEach(doc => {
            const data = doc.data() as Expense;
            expenseList.push({
                ...data,
                createdAt: data.createdAt.toDate().toLocaleString(),
            });
        });
        console.log(`Fetched ${expenseList.length} expenses`);
        return expenseList;
    } catch (e) {
        console.error(e)
        throw e
    }
}

export const deleteExpenseById = async (id: string) => {
    try {
        console.log(`Deleting expense with ID: ${id}`);
        const result = await adminFirestore.collection('expenses').doc(id).delete();
        console.log(`Expense deleted successfully: ${result.writeTime}`);
        return result.writeTime;
    } catch (e) {
        console.error(e)
        throw e
    }
}

export const getExpensesReport = async (from: string, to: string) => {
    try {
        const fromTimestamp = admin.firestore.Timestamp.fromDate(new Date(from));
        const toTimestamp = admin.firestore.Timestamp.fromDate(new Date(to));

        console.log(`Fetching expenses from ${from} to ${to}`);

        const expensesQuery = adminFirestore.collection('expenses')
            .where('createdAt', '>=', fromTimestamp)
            .where('createdAt', '<=', toTimestamp)
            .orderBy('createdAt', 'desc');

        const expensesSnapshot = await expensesQuery.get();

        if (expensesSnapshot.empty) {
            console.log('No expenses found');
            return [];
        }

        console.log(`Fetched ${expensesSnapshot.size} expenses`);
        const report: Record<string, Record<string, number>> = {};

        expensesSnapshot.forEach((doc) => {
            const expense = doc.data();

            console.log(`Processing expense document:`, expense);

            // Ensure the required fields exist
            const expenseType = expense.type || "unknown"; // Default to "unknown" if not provided
            const expenseFor = expense.for || "other"; // Default to "other" if not provided
            const expenseAmount = expense.amount || 0; // Default to 0 if not provided

            if (!report[expenseType]) {
                report[expenseType] = {};
            }

            report[expenseType][expenseFor] =
                (report[expenseType][expenseFor] || 0) + expenseAmount;
        });

        const formatReport = (data: Record<string, number>): ExpensesReport["data"] => {
            return Object.entries(data).map(([forField, totalAmount]) => ({
                for: forField,
                amount: totalAmount,
            }));
        };

        const result = Object.entries(report).map(([type, data]) => ({
            type,
            data: formatReport(data),
        }));

        console.log("Report Generated");
        return result;
    } catch (e) {
        console.error("Error fetching expenses report:", e);
        throw e;
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
        throw error
    }
}

export const authorizeRequest = async (req: any) => {
    try {
        const authHeader = req.headers.get("authorization");
        const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        console.log("Token:", token);

        if (token != "undefined") {
            const decodedIdToken = await adminAuth.verifyIdToken(token);
            const user = await getUserById(decodedIdToken.uid);
            if (!user) {
                console.warn("User not found!");
                console.warn("Authorization Failed!");
                return false;
            } else {
                if (user.role === 'ADMIN') {
                    console.log("Authorization Success!");
                    return true;
                } else {
                    console.warn("Authorization Failed!");
                    return false;
                }
            }
        } else {
            console.warn("Authorization Failed!");
            return false;
        }
    } catch (e) {
        console.error(e);
        throw e;
    }
}

export const getAllPaymentMethods = async () => {
    try {
        const paymentMethods = await adminFirestore.collection('paymentMethods').get();
        const methods: PaymentMethod[] = [];
        paymentMethods.forEach(doc => {
            methods.push({
                ...doc.data(),
                createdAt: doc.data()?.createdAt?.toDate()?.toLocaleString(),
                updatedAt: doc.data()?.updatedAt?.toDate()?.toLocaleString(),
            } as PaymentMethod);
        });
        return methods;
    } catch (e) {
        throw e;
    }
}

export const addNewPaymentMethod = async (PaymentMethod: PaymentMethod) => {
    try {
        console.log('Creating new payment method:', PaymentMethod.paymentId);
        const writeResultPromise = await adminFirestore.collection('paymentMethods').doc(PaymentMethod.paymentId).set({
            ...PaymentMethod,
            createdAt: admin.firestore.Timestamp.fromDate(new Date(PaymentMethod.createdAt)),
            updatedAt: admin.firestore.Timestamp.fromDate(new Date(PaymentMethod.updatedAt)),
        });
        console.log(`Payment method created successfully: ${PaymentMethod.paymentId}`);
        return writeResultPromise;
    } catch (e) {
        throw e;
    }
}

export const updatePaymentMethod = async (paymentMethod: PaymentMethod) => {
    try {
        console.log('Updating payment method:', paymentMethod.paymentId);
        let writeResultPromise = await adminFirestore.collection('paymentMethods').doc(paymentMethod.paymentId).set({
            ...paymentMethod,
            createdAt: admin.firestore.Timestamp.fromDate(new Date(paymentMethod.createdAt)),
            updatedAt: admin.firestore.Timestamp.fromDate(new Date(paymentMethod.updatedAt)),
        }, {merge: true});
        console.log(`Payment method updated successfully: ${paymentMethod.paymentId}`);
        return writeResultPromise;
    } catch (e) {
        throw e
    }
}
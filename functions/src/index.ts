import * as functions from "firebase-functions/v1";  // Updated import for v6
import * as admin from "firebase-admin";
import { adminNotifySMS, getOrderStatusSMS, orderStatusUpdateSMS } from "./templates";
import { BATCH_LIMIT, Item, Order, orderStatus, PaymentMethod, PaymentStatus } from "./constant";
import { sendEmail, sendSMS } from "./notifications";
import { calculateTotal, commitBatch, sendAdminEmail, sendAdminSMS } from "./util";

admin.initializeApp();
export const db = admin.firestore();

// Cloud Functions

/**
 * Scheduled function to clean up failed orders and restock inventory.
 */
export const scheduledOrdersCleanup = functions.pubsub
    .schedule("every 30 minutes")
    .onRun(async () => {
        try {
            const orderCollection = db.collection("orders");
            const inventoryCollection = db.collection("inventory");

            const halfHourAgo = admin.firestore.Timestamp
                .fromDate(new Date(Date.now() - 30 * 60 * 1000));

            // Fetch failed and pending PayHere orders
            const payhereFailedOrders = await orderCollection
                .where("paymentMethod", "==", PaymentMethod.PayHere)
                .where("createdAt", "<=", halfHourAgo)
                .where("paymentStatus", "in", [PaymentStatus.Failed, PaymentStatus.Pending])
                .get();

            // Fetch failed COD orders
            const codFailedOrders = await orderCollection
                .where("paymentMethod", "==", PaymentMethod.COD)
                .where("createdAt", "<=", halfHourAgo)
                .where("paymentStatus", "==", PaymentStatus.Failed)
                .get();

            const allFailedOrders = [...payhereFailedOrders.docs, ...codFailedOrders.docs];

            if (allFailedOrders.length === 0) {
                console.log("No failed orders to restock.");
                return null;
            }

            console.log(`Found ${allFailedOrders.length} failed orders to restock and delete.`);

            let batch = db.batch();
            let opCounts = 0;

            for (const orderDoc of allFailedOrders) {
                const orderData = orderDoc.data() as Order;

                for (const orderItem of orderData.items) {
                    const inventoryDocRef = inventoryCollection.doc(orderItem.itemId);
                    const inventoryDoc = await inventoryDocRef.get();

                    if (inventoryDoc.exists) {
                        const inventoryData = inventoryDoc.data() as Item;

                        const variant = inventoryData.variants.find(
                            (v) => v.variantId === orderItem.variantId
                        );

                        if (variant) {
                            const size = variant.sizes.find((s) => s.size === orderItem.size);
                            if (size) {
                                size.stock += orderItem.quantity;
                                batch.set(inventoryDocRef, inventoryData);
                                opCounts++;

                                if (opCounts >= BATCH_LIMIT) {
                                    batch = await commitBatch(batch, opCounts);
                                    opCounts = 0;
                                }
                            } else {
                                console.warn(`Size not found for itemId: ${orderItem.itemId}, variantId: ${orderItem.variantId}, size: ${orderItem.size}`);
                            }
                        } else {
                            console.warn(`Variant not found for itemId: ${orderItem.itemId}, variantId: ${orderItem.variantId}`);
                        }
                    } else {
                        console.warn(`Inventory document not found for itemId: ${orderItem.itemId}`);
                    }
                }

                // Delete the order after restocking
                batch.delete(orderDoc.ref);
                opCounts++;

                if (opCounts >= BATCH_LIMIT) {
                    batch = await commitBatch(batch, opCounts);
                    opCounts = 0;
                }
            }

            // Commit any remaining operations
            if (opCounts > 0) {
                await batch.commit();
                console.log(`Committed the final batch of ${opCounts} operations.`);
            }

            console.log("Scheduled Firestore cleanup and deletion completed successfully.");
            return null;
        } catch (error) {
            console.error("Error during scheduledOrdersCleanup:", error);
            return null;
        }
    });

/**
 * Triggered function to handle order payment state changes.
 */
export const onPaymentStatusUpdates = functions.firestore
    .document("orders/{orderId}")
    .onWrite(async (change, context) => {
        const orderId = context.params.orderId;
        const orderData = change.after.exists ? (change.after.data() as Order) : null;
        const previousOrderData = change.before.exists ? (change.before.data() as Order) : null;

        if (!orderData) return null;

        const { paymentMethod, paymentStatus, items, customer, shippingCost } = orderData;
        const customerEmail = customer.email.trim();
        const total = calculateTotal(items, shippingCost);

        const templateData = { name: customer.name,
            orderId,
            items,
            shippingCost,
            total,
            paymentMethod,
            isRefunded: paymentStatus === PaymentStatus.Refunded,
            isConfirmed: paymentMethod === PaymentMethod.PayHere && paymentStatus === PaymentStatus.Paid || paymentMethod === PaymentMethod.COD && paymentStatus === PaymentStatus.Pending,
        };

        if (paymentMethod === PaymentMethod.Card || paymentMethod === PaymentMethod.Cash) {
            console.log(`No notifications sent for Card or Cash payment method for order ${orderId}`);
            return null;
        }

        try {
            const sendNotifications = async (additionalTemplateData?: any) => {
                await Promise.all([
                    sendEmail(customerEmail, "orderUpdate", { ...templateData, ...additionalTemplateData }),
                    sendSMS(customer.phone, getOrderStatusSMS(customer.name, orderId, total, paymentMethod, paymentStatus)),
                ]);
            };

            // Handle different payment statuses
            if (!previousOrderData && paymentMethod === PaymentMethod.COD && paymentStatus === PaymentStatus.Pending) {
                await sendNotifications();
                await sendAdminSMS(adminNotifySMS(orderId, paymentMethod, total));
                await sendAdminEmail("adminOrderNotify", templateData);
                console.log(`Order confirmation sent for COD order ${orderId}`);
            }

            if (previousOrderData) {
                if (paymentStatus === previousOrderData.paymentStatus) {
                    console.log(`No change in payment status for order ${orderId}. No notification sent.`);
                    return null;
                }

                if (paymentMethod === PaymentMethod.COD && previousOrderData.paymentStatus === PaymentStatus.Pending && paymentStatus === PaymentStatus.Failed) {
                    await sendNotifications();
                    console.log(`Order failed notification sent for COD order ${orderId}`);
                }

                if (paymentMethod === PaymentMethod.COD && previousOrderData.paymentStatus === PaymentStatus.Pending && paymentStatus === PaymentStatus.Paid) {
                    await sendNotifications();
                    console.log(`Payment confirmation SMS sent for COD order ${orderId}`);
                }

                if (paymentMethod === PaymentMethod.PayHere) {
                    if (previousOrderData.paymentStatus === PaymentStatus.Pending && paymentStatus === PaymentStatus.Paid) {
                        await sendNotifications();
                        await sendAdminSMS(adminNotifySMS(orderId, paymentMethod, total));
                        await sendAdminEmail("adminOrderNotify", templateData);
                        console.log(`Order confirmation sent for PayHere order ${orderId}`);
                    } else if (previousOrderData.paymentStatus === PaymentStatus.Pending && paymentStatus === PaymentStatus.Failed) {
                        await sendNotifications();
                        console.log(`Order failed notification sent for PayHere order ${orderId}`);
                    }
                }

                if (paymentStatus === PaymentStatus.Refunded) {
                    await Promise.all([
                        sendEmail(customerEmail, "orderUpdate", templateData),
                        sendSMS(customer.phone, getOrderStatusSMS(customer.name, orderId, total, paymentMethod, paymentStatus)),
                    ]);
                    console.log(`Order refund notification sent for order ${orderId}`);
                }
            }
        } catch (error) {
            console.error(`Error processing order ${orderId}:`, error);
        }

        return null;
    });

/**
 * Tracking Updates
 */
export const onTrackingUpdates = functions.firestore
    .document("orders/{orderId}")
    .onUpdate(async (change, context) => {
        const orderId = context.params.orderId;
        const newOrderData = change.after.data() as Order;
        const previousOrderData = change.before.data() as Order;

        const newTracking = newOrderData.tracking;
        const previousTracking = previousOrderData.tracking;

        if (!newTracking || !newTracking.status) {
            console.log(`No tracking data found for order ${orderId}.`);
            return null;
        }

        if (!previousTracking || newTracking.status !== previousTracking.status) {
            const customerEmail = newOrderData.customer.email.trim();
            const customerPhone = newOrderData.customer.phone.trim();

            const templateData = {
                name: newOrderData.customer.name,
                orderId,
                address:newOrderData.customer.address,
                status: newTracking.status,
                trackingNumber: newTracking.trackingNumber,
                trackingUrl: newTracking.trackingUrl,
                isShipped: newOrderData.tracking?.status === orderStatus.SHIPPED,
                isDelivered: newOrderData.tracking?.status === orderStatus.DELIVERED,
                isCancelled: newOrderData.tracking?.status === orderStatus.CANCELLED,
            };

            try {
                const sendNotifications = async (status: string) => {
                    await Promise.all([
                        sendEmail(customerEmail, "trackingUpdate", templateData),
                        sendSMS(
                            customerPhone,
                            orderStatusUpdateSMS(
                                newOrderData.customer.name,
                                orderId,
                                status,
                                newTracking.trackingNumber,
                                newTracking.trackingUrl
                            )
                        )
                    ]);
                    console.log(`Notifications sent for order ${orderId} with status ${status}.`);
                };

                switch (newTracking.status) {
                    case orderStatus.SHIPPED:
                    case orderStatus.DELIVERED:
                    case orderStatus.CANCELLED:
                        await sendNotifications(newTracking.status);
                        break;
                    default:
                        console.log(`No matching status for notifications in order ${orderId}`);
                        break;
                }
            } catch (error) {
                console.error(`Error processing tracking update for order ${orderId}:`, error);
            }
        }

        return null;
    });

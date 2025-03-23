import * as functions from "firebase-functions/v1"; // Updated import for v6
import * as admin from "firebase-admin";
import {adminNotifySMS, getOrderStatusSMS, orderTrackingUpdateSMS} from "./templates";
import {BATCH_LIMIT, Item, Order, orderStatus, PaymentMethod, PaymentStatus} from "./constant";
import {sendEmail, sendSMS} from "./notifications";
import {calculateTotal, commitBatch, sendAdminEmail, sendAdminSMS} from "./util";

admin.initializeApp();
export const db = admin.firestore();

// Cloud Functions

/**
 * Scheduled function to clean up failed orders and restock inventory.
 */
export const scheduledOrdersCleanup = functions.pubsub
    .schedule("every 1 hours")
    .onRun(async () => {
        try {
            console.log("Starting scheduled Firestore cleanup and deletion.");
            const orderCollection = db.collection("orders");
            const inventoryCollection = db.collection("inventory");

            const timeFrame = admin.firestore.Timestamp
                .fromDate(new Date(Date.now() - 60 * 60 * 1000));

            // Fetch failed and pending PayHere orders
            const payhereFailedOrders = await orderCollection
                .where("paymentMethod", "==", PaymentMethod.IPG)
                .where("createdAt", "<=", timeFrame)
                .where("paymentStatus", "in", [PaymentStatus.Failed, PaymentStatus.Pending])
                .get();

            // Fetch failed COD orders
            const codFailedOrders = await orderCollection
                .where("paymentMethod", "==", PaymentMethod.COD)
                .where("createdAt", "<=", timeFrame)
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
        console.log("Payment status update detected.");
        const orderId = context.params.orderId;
        const orderData = change.after.exists ? (change.after.data() as Order) : null;
        const previousOrderData = change.before.exists ? (change.before.data() as Order) : null;

        if (!orderData) return null;

        const {paymentMethod, paymentStatus, items, customer, discount} = orderData;
        const paymentMethodLower = paymentMethod.toLowerCase();
        const paymentStatusLower = paymentStatus.toLowerCase();

        // Skip if paymentMethod is not IPG or COD
        if (paymentMethodLower !== PaymentMethod.IPG.toLowerCase() && paymentMethodLower !== PaymentMethod.COD.toLowerCase()) {
            console.log(`Order ${orderId} is not IPG or COD, skipping...`);
            return null;
        }

        // Calculate total and address
        const subTotal = calculateTotal(items);
        const total = subTotal + (orderData?.fee || 0) + (orderData?.shippingFee || 0) - (orderData?.discount || 0);
        const address = customer.address + " " + customer.city + " " + (customer?.zip || "") + " " + (customer?.phone || "");
        const templateData = {
            name: customer.name,
            address: address,
            orderId: orderId.toUpperCase(),
            items,
            total,
            fee:orderData.fee,
            shippingFee:orderData.shippingFee,
            paymentMethod,
            subTotal,
            discount,
        };

        try {
            // Function to send notifications
            const sendNotifications = async (additionalTemplateData?: any) => {
                await Promise.all([
                    sendEmail(customer.email.trim().toLowerCase(), "orderConfirmed", {...templateData, ...additionalTemplateData}),
                    sendSMS(
                        customer.phone,
                        getOrderStatusSMS(customer.name, orderId, paymentMethod, paymentStatus)
                    ),
                ]);
            };

            if (previousOrderData) {
                const previousPaymentStatusLower = previousOrderData.paymentStatus.toLowerCase();

                // Check if payment status has changed
                if (paymentStatusLower === previousPaymentStatusLower) {
                    console.log(`No change in payment status for order ${orderId}. No notification sent.`);
                    return null;
                }

                if (
                    paymentStatusLower === PaymentStatus.Paid.toLowerCase() &&
                    previousPaymentStatusLower === PaymentStatus.Pending.toLowerCase() &&
                    paymentMethodLower === PaymentMethod.IPG.toLowerCase()
                ) {
                    await sendNotifications();
                    await sendAdminSMS(adminNotifySMS(orderId));
                    await sendAdminEmail("adminOrderNotify", templateData);
                    console.log(`Order confirmation sent for PayHere order ${orderId}`);
                }
            } else {
                // Process new COD orders with Pending status
                if (paymentMethodLower === PaymentMethod.COD.toLowerCase() && paymentStatusLower === PaymentStatus.Pending.toLowerCase()) {
                    await sendNotifications();
                    await sendAdminSMS(adminNotifySMS(orderId));
                    await sendAdminEmail("adminOrderNotify", templateData);
                    console.log(`Notification sent for new COD pending order ${orderId}`);
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

        // If there is no new tracking data or no status, exit early
        if (!newTracking || !newTracking.status) {
            console.log(`No tracking data found for order ${orderId}.`);
            return null;
        }

        const newTrackingStatus = newTracking.status.toLowerCase();
        const previousTrackingStatus = previousTracking?.status?.toLowerCase();

        // Exit if the tracking status remains unchanged
        if (previousTracking && newTrackingStatus === previousTrackingStatus) {
            console.log(`Tracking status for order ${orderId} remains unchanged (${newTrackingStatus}).`);
            return null;
        }

        const customerPhone = newOrderData.customer.phone.trim();

        try {
            // Function to send SMS notifications
            const sendNotifications = async (status: string) => {
                await Promise.all([
                    sendSMS(
                        customerPhone,
                        orderTrackingUpdateSMS(
                            newOrderData.customer.name,
                            orderId,
                            status,
                            newTracking.trackingNumber,
                            newTracking.trackingUrl
                        )
                    ),
                ]);
                console.log(`Notifications sent for order ${orderId} with status ${status}.`);
            };

            // Handle specific statuses
            switch (newTrackingStatus) {
                case orderStatus.SHIPPED.toLowerCase():
                case orderStatus.CANCELLED.toLowerCase():
                    await sendNotifications(newTracking.status);
                    break;
                default:
                    console.log(`No matching status for notifications in order ${orderId}`);
                    break;
            }
        } catch (error) {
            console.error(`Error processing tracking update for order ${orderId}:`, error);
        }

        return null;
    });


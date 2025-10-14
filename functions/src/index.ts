import * as functions from "firebase-functions/v1"; // Updated import for v6
import * as admin from "firebase-admin";
import {
  adminNotifySMS,
  getOrderStatusSMS,
} from "./templates";
import {
  BATCH_LIMIT,
  Item,
  Order,
  PaymentMethod,
  PaymentStatus,
} from "./constant";
import { sendEmail, sendSMS } from "./notifications";
import {
  calculateTotal,
  commitBatch,
  sendAdminEmail,
  sendAdminSMS,
} from "./util";

admin.initializeApp();
export const db = admin.firestore();

// Cloud Functions

/**
 * Scheduled function to clean up failed orders and restock inventory.
 */
export const scheduledOrdersCleanup = functions.pubsub
  .schedule("every 24 hours")
  .onRun(async () => {
    try {
      console.log("Starting scheduled Firestore cleanup and deletion.");
      const orderCollection = db.collection("orders");
      const inventoryCollection = db.collection("inventory");

      const timeFrame = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() - 4 * 60 * 60 * 1000)
      );

      // Fetch failed orders
      const failedOrders = await orderCollection
        .where("createdAt", "<=", timeFrame)
        .where("paymentStatus", "==", PaymentStatus.Failed)
        .get();

      const allFailedOrders = [...failedOrders.docs];

      if (allFailedOrders.length === 0) {
        console.log("No failed orders to restock.");
        return null;
      }

      console.log(
        `Found ${allFailedOrders.length} failed orders to restock and delete.`
      );

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
                console.warn(
                  `Size not found for itemId: ${orderItem.itemId}, variantId: ${orderItem.variantId}, size: ${orderItem.size}`
                );
              }
            } else {
              console.warn(
                `Variant not found for itemId: ${orderItem.itemId}, variantId: ${orderItem.variantId}`
              );
            }
          } else {
            console.warn(
              `Inventory document not found for itemId: ${orderItem.itemId}`
            );
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

      console.log(
        "Scheduled Firestore cleanup and deletion completed successfully."
      );
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
    const orderData = change.after.exists
      ? (change.after.data() as Order)
      : null;
    const previousOrderData = change.before.exists
      ? (change.before.data() as Order)
      : null;

    if (!orderData) return null;

    const { paymentMethod, paymentStatus, items, customer, discount } =
      orderData;
    const paymentMethodLower = paymentMethod.toLowerCase();
    const paymentStatusLower = paymentStatus.toLowerCase();

    // ✅ include KOKO in allowed methods
    const allowedMethods = [
      PaymentMethod.IPG.toLowerCase(),
      PaymentMethod.COD.toLowerCase(),
      PaymentMethod.KOKO.toLowerCase(),
    ];

    if (!allowedMethods.includes(paymentMethodLower)) {
      console.log(`Order ${orderId} is not IPG, COD, or KOKO. Skipping...`);
      return null;
    }

    // Calculate totals and address
    const subTotal = calculateTotal(items);
    const total =
      subTotal +
      (orderData?.fee || 0) +
      (orderData?.shippingFee || 0) -
      (orderData?.discount || 0);

    const address = `${customer.address} ${customer.city} ${
      customer?.zip || ""
    } ${customer?.phone || ""}`;

    const templateData = {
      name: customer.name,
      address,
      orderId: orderId.toUpperCase(),
      items,
      total,
      fee: orderData.fee,
      shippingFee: orderData.shippingFee,
      paymentMethod,
      subTotal,
      discount,
    };

    try {
      const sendNotifications = async (additionalTemplateData?: any) => {
        await Promise.all([
          sendEmail(customer.email.trim().toLowerCase(), "orderConfirmed", {
            ...templateData,
            ...additionalTemplateData,
          }),
          sendSMS(
            customer.phone,
            getOrderStatusSMS(
              customer.name,
              orderId,
              paymentMethod,
              paymentStatus
            )
          ),
        ]);
      };

      if (previousOrderData) {
        const previousPaymentStatusLower =
          previousOrderData.paymentStatus.toLowerCase();

        if (paymentStatusLower === previousPaymentStatusLower) {
          console.log(`No change in payment status for order ${orderId}.`);
          return null;
        }

        // ✅ handle both IPG (PayHere) and KOKO when changing from Pending → Paid
        if (
          paymentStatusLower === PaymentStatus.Paid.toLowerCase() &&
          previousPaymentStatusLower === PaymentStatus.Pending.toLowerCase() &&
          (paymentMethodLower === PaymentMethod.IPG.toLowerCase() ||
            paymentMethodLower === PaymentMethod.KOKO.toLowerCase())
        ) {
          await sendNotifications();
          await sendAdminSMS(adminNotifySMS(orderId));
          await sendAdminEmail("adminOrderNotify", templateData);
          console.log(
            `✅ Order confirmation sent for ${paymentMethod} order ${orderId}`
          );
        }
      } else {
        // COD new order notification (unchanged)
        if (
          paymentMethodLower === PaymentMethod.COD.toLowerCase() &&
          paymentStatusLower === PaymentStatus.Pending.toLowerCase()
        ) {
          await sendNotifications();
          await sendAdminSMS(adminNotifySMS(orderId));
          await sendAdminEmail("adminOrderNotify", templateData);
          console.log(`Notification sent for new COD pending order ${orderId}`);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing order ${orderId}:`, error);
    }

    return null;
  });
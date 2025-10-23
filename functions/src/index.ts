import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { BATCH_LIMIT, Item, Order, PaymentStatus } from "./constant";
import { calculateTotal, commitBatch } from "./util";

admin.initializeApp();
const db = admin.firestore();

export const scheduledOrdersCleanup = onSchedule(
  {
    schedule: "every 24 hours",
    timeZone: "Asia/Colombo",
    region: "asia-south1",
    memory: "512MiB",
    timeoutSeconds: 540,
  },
  async (event) => {
    try {
      console.log("🧹 Starting scheduled Firestore cleanup job...");

      const orderCollection = db.collection("orders");
      const inventoryCollection = db.collection("inventory");
      const cleanupLogCollection = db.collection("cleanup_logs");

      const timeFrame = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() - 4 * 60 * 60 * 1000)
      );

      const failedOrdersSnap = await orderCollection
        .where("createdAt", "<=", timeFrame)
        .where("paymentStatus", "==", PaymentStatus.Failed)
        .get();

      if (failedOrdersSnap.empty) {
        console.log("✅ No failed orders to clean up.");
        return; // <-- fine; returns void
      }

      console.log(
        `⚠️ Found ${failedOrdersSnap.size} failed orders to process.`
      );

      let batch = db.batch();
      let opCount = 0;
      const logs: any[] = [];

      for (const orderDoc of failedOrdersSnap.docs) {
        const orderData = orderDoc.data() as Order;

        for (const orderItem of orderData.items) {
          const inventoryDocRef = inventoryCollection.doc(orderItem.itemId);
          const inventorySnap = await inventoryDocRef.get();

          if (!inventorySnap.exists) {
            console.warn(
              `❗ Inventory doc not found for itemId: ${orderItem.itemId}`
            );
            continue;
          }

          const inventoryData = inventorySnap.data() as Item;
          const variant = inventoryData.variants.find(
            (v) => v.variantId === orderItem.variantId
          );

          if (!variant) {
            console.warn(
              `❗ Variant not found for itemId: ${orderItem.itemId}, variantId: ${orderItem.variantId}`
            );
            continue;
          }

          const size = variant.sizes.find((s) => s.size === orderItem.size);
          if (!size) {
            console.warn(
              `❗ Size not found for itemId: ${orderItem.itemId}, variantId: ${orderItem.variantId}, size: ${orderItem.size}`
            );
            continue;
          }

          // ✅ Restock item
          size.stock += orderItem.quantity;
          batch.set(inventoryDocRef, inventoryData);
          opCount++;

          if (opCount >= BATCH_LIMIT) {
            batch = await commitBatch(batch, opCount);
            opCount = 0;
          }
        }

        const total =
          calculateTotal(orderData.items) +
          (orderData?.shippingFee || 0) +
          (orderData?.fee || 0) -
          (orderData?.discount || 0);

        // ✅ Log cleaned order
        logs.push({
          orderId: orderDoc.id,
          paymentMethod: orderData.paymentMethod,
          paymentMethodId: orderData.paymentMethodId,
          userId: orderData.userId ?? null,
          total: total ?? 0,
          reason: "Payment failed for more than 4 hours",
          items: orderData.items,
          createdAt: orderData.createdAt,
          deletedAt: admin.firestore.Timestamp.now(),
        });

        // Delete order
        batch.delete(orderDoc.ref);
        opCount++;

        if (opCount >= BATCH_LIMIT) {
          batch = await commitBatch(batch, opCount);
          opCount = 0;
        }
      }

      if (opCount > 0) {
        await batch.commit();
        console.log(`💾 Committed final batch of ${opCount} operations.`);
      }

      if (logs.length > 0) {
        const logBatch = db.batch();
        for (const log of logs) {
          const logRef = cleanupLogCollection.doc();
          logBatch.set(logRef, log);
        }
        await logBatch.commit();
        console.log(`🗂️ Logged ${logs.length} cleaned orders to cleanup_logs.`);
      }

      console.log("✅ Firestore cleanup and deletion completed successfully.");
    } catch (error) {
      console.error("❌ Error during scheduledOrdersCleanup:", error);
    }
  }
);

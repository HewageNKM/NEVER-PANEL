import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { BATCH_LIMIT, Item, Order, PaymentStatus } from "./constant";
import { calculateTotal, commitBatch, generateDocumentHash } from "./util";

admin.initializeApp();
const db = admin.firestore();
const FieldValue = admin.firestore.FieldValue;

export const scheduledOrdersCleanup = onSchedule(
  {
    schedule: "every 24 hours",
    timeZone: "Asia/Colombo",
    region: "asia-south1",
    memory: "512MiB",
    timeoutSeconds: 540,
  },
  async () => {
    try {
      console.log("🧹 Starting scheduled Firestore cleanup job...");

      const orderCollection = db.collection("orders");
      const inventoryCollection = db.collection("inventory");
      const cleanupLogCollection = db.collection("cleanup_logs");
      const hashLedgerCollection = db.collection("hash_ledger");

      const timeFrame = admin.firestore.Timestamp.fromDate(
        new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
      );

      const ordersSnap = await orderCollection
        .where("createdAt", "<=", timeFrame)
        .where("paymentStatus", "in", [
          PaymentStatus.Failed,
          PaymentStatus.Refunded,
        ])
        .where("restocked", "in", [false, null])
        .get();

      if (ordersSnap.empty) {
        console.log("✅ No failed or refunded orders to clean up.");
        return;
      }

      console.log(`⚠️ Found ${ordersSnap.size} orders to process.`);

      let batch = db.batch();
      let opCount = 0;
      const logs: any[] = [];

      for (const orderDoc of ordersSnap.docs) {
        const orderData = orderDoc.data() as Order;
        const orderId = orderDoc.id;
        const hashId = `hash${orderId}`;
        const hashDocRef = hashLedgerCollection.doc(hashId);

        const total =
          calculateTotal(orderData.items) +
          (orderData?.shippingFee || 0) +
          (orderData?.fee || 0) -
          (orderData?.discount || 0);

        // 🧮 Restock items
        for (const orderItem of orderData.items) {
          const inventoryDocRef = inventoryCollection.doc(orderItem.itemId);
          const inventorySnap = await inventoryDocRef.get();
          if (!inventorySnap.exists) {
            console.warn(`❗ Missing inventory item: ${orderItem.itemId}`);
            continue;
          }

          const inventoryData = inventorySnap.data() as Item;
          const variant = inventoryData.variants.find(
            (v) => v.variantId === orderItem.variantId
          );
          if (!variant) continue;
          const size = variant.sizes.find((s) => s.size === orderItem.size);
          if (!size) continue;

          size.stock += orderItem.quantity;
          batch.set(inventoryDocRef, inventoryData, { merge: true });
          opCount++;

          if (opCount >= BATCH_LIMIT) {
            batch = await commitBatch(batch, opCount);
            opCount = 0;
          }
        }

        // 🧾 Log cleanup
        logs.push({
          context: "order_cleanup",
          entityType: "order",
          refId: orderId,
          userId: orderData.userId ?? null,
          total: total ?? 0,
          reason:
            orderData.paymentStatus === PaymentStatus.Refunded
              ? "Refunded order restocked"
              : "Payment failed for more than 4 hours",
          action: "restock",
          paymentStatus: orderData.paymentStatus,
          metadata: {
            items: orderData.items ?? [],
            createdAt: orderData.createdAt ?? null,
            paymentMethod: orderData.paymentMethod ?? null,
          },
          deletedAt: admin.firestore.Timestamp.now(),
          timestamp: admin.firestore.Timestamp.now(),
        });

        // 🧾 Handle order and hash logic
        if (orderData.paymentStatus === PaymentStatus.Failed) {
          // ❌ Delete failed order + its hash
          batch.delete(orderDoc.ref);
          batch.delete(hashDocRef);
        } else if (orderData.paymentStatus === PaymentStatus.Refunded) {
          // ♻️ Update refunded order
          const orderUpdate = {
            restocked: true,
            restockedAt: admin.firestore.Timestamp.now(),
            cleanupProcessed: true,
          };
          batch.update(orderDoc.ref, orderUpdate);

          // 🧩 Generate new hash from updated data
          const updatedOrderData = { ...orderData, ...orderUpdate };
          const hash = generateDocumentHash(updatedOrderData);

          // 🔁 Update or create hash ledger entry
          batch.set(
            hashDocRef,
            {
              id: hashDocRef.id,
              hashValue: hash,
              sourceCollection: "orders",
              sourceDocId: orderId,
              paymentStatus: orderData.paymentStatus,
              updatedAt: FieldValue.serverTimestamp(),
              createdAt: FieldValue.serverTimestamp(),
              cleanupFlag: true,
            },
            { merge: true }
          );
        }

        opCount++;
        if (opCount >= BATCH_LIMIT) {
          batch = await commitBatch(batch, opCount);
          opCount = 0;
        }
      }

      // Final commit
      if (opCount > 0) {
        await batch.commit();
        console.log(`💾 Committed final batch of ${opCount} operations.`);
      }

      // Log entries
      if (logs.length > 0) {
        const logBatch = db.batch();
        for (const log of logs) {
          logBatch.set(cleanupLogCollection.doc(), log);
        }
        await logBatch.commit();
        console.log(`🗂️ Logged ${logs.length} cleanup entries.`);
      }

      console.log("✅ Firestore cleanup and restock completed successfully.");
    } catch (error) {
      console.error("❌ Error during scheduledOrdersCleanup:", error);
    }
  }
);

import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import { BATCH_LIMIT, Item, Order, PaymentStatus } from "./constant";
import { calculateTotal, commitBatch, generateDocumentHash } from "./util";
import { onDocumentCreated, onDocumentUpdated } from "firebase-functions/v2/firestore";

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

        logs.push({
          context: "order_cleanup",
          entityType: "order",
          refId: orderDoc.id,
          userId: orderData.userId ?? null,
          total: total ?? 0,
          reason: "Payment failed for more than 4 hours",
          metadata: {
            paymentMethod: orderData.paymentMethod ?? null,
            paymentMethodId: orderData.paymentMethodId ?? null,
            items: orderData.items ?? [],
            createdAt: orderData.createdAt ?? null,
          },
          deletedAt: admin.firestore.Timestamp.now(),
          timestamp: admin.firestore.Timestamp.now(),
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

/**
 * Triggered when a new document is created in 'orders'.
 * Creates a corresponding entry in the 'hash_ledger'.
 */
export const createOrderHashOnCreate = onDocumentCreated("orders/{docId}", async (event) => {
  const { docId } = event.params;
  const docData = event?.data?.data();
  
  if (!docData) {
    console.error(`No data found for created document orders/${docId}.`);
    return;
  }

  try {
    // 1. Generate the hash using the global helper
    const hashValue = generateDocumentHash(docData);
    
    // 2. Use the standard naming convention: {collection}_{docId}
    const ledgerId = `hash_${docId}`;
    
    // 3. Save to the ledger
    await db.collection('hash_ledger').doc(ledgerId).set({
      id: ledgerId,
      hashValue: hashValue,
      sourceCollection: 'orders',
      sourceDocId: docId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    
    console.log(`Hash ledger created for: ${ledgerId}`);
  } catch (error) {
    console.error(`Failed to create hash for orders/${docId}:`, error);
  }
});

/**
 * Triggered when a document is updated in 'orders'.
 * Updates the corresponding entry in the 'hash_ledger'.
 */
export const updateOrderHashOnUpdate = onDocumentUpdated("orders/{docId}", async (event) => {
  const { docId } = event.params;
  const docData = event?.data?.after.data(); // Get the new, updated data
  
  if (!docData) {
    console.error(`No data found for updated document orders/${docId}.`);
    return;
  }

  try {
    // 1. Generate the new hash using the global helper
    const newHashValue = generateDocumentHash(docData);
    
    // 2. Get the ledger ID
    const ledgerId = `hash_${docId}`;
    const ledgerRef = db.collection('hash_ledger').doc(ledgerId);

    // 3. Update the hash value and timestamp
    await ledgerRef.update({
      hashValue: newHashValue,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Hash ledger updated for: ${ledgerId}`);
  } catch (error) {
    console.error(`Failed to update hash for orders/${docId}:`, error);
  }
});
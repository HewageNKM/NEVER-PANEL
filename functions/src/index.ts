import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";
import * as crypto from "crypto";
import * as stringify from "json-stable-stringify";

admin.initializeApp();

const db = admin.firestore();

// ==========================
// 🔧 Constants & Interfaces
// ==========================
const BATCH_LIMIT = 450;

interface Size {
  size: string;
  stock: number;
}

interface Variant {
  variantId: string;
  variantName: string;
  images: string[];
  sizes: Size[];
}

interface OrderItem {
  itemId: string;
  variantId: string;
  name: string;
  variantName: string;
  size: string;
  quantity: number;
  price: number;
}

interface Item {
  itemId: string;
  type: string;
  brand: string;
  thumbnail: string;
  variants: Variant[];
  manufacturer: string;
  name: string;
  sellingPrice: number;
  discount: number;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

interface Order {
  orderId: string;
  paymentId: string;
  items: OrderItem[];
  fee: number;
  userId?: string;
  shippingFee: number;
  status: string;
  paymentMethodId: string;
  paymentStatus: string;
  discount: number;
  restocked?: boolean;
  restockedAt?: FirebaseFirestore.Timestamp;
  cleanupProcessed?: boolean;
  paymentMethod: string;
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}

enum PaymentStatus {
  Pending = "Pending",
  Paid = "Paid",
  Failed = "Failed",
  Refunded = "Refunded",
}

// ==========================
// 🧮 Utility Functions
// ==========================
const calculateTotal = (items: OrderItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

const commitBatch = async (
  batch: FirebaseFirestore.WriteBatch,
  opCount: number
): Promise<FirebaseFirestore.WriteBatch> => {
  if (opCount >= BATCH_LIMIT) {
    await batch.commit();
    console.log(`Committed a batch of ${opCount} operations.`);
    return admin.firestore().batch();
  }
  return batch;
};

const generateDocumentHash = (docData: any) => {
  const dataToHash = { ...docData };
  const canonicalString = stringify(dataToHash)
  const hash = crypto
    .createHash("sha256")
    //@ts-ignore
    .update(canonicalString)
    .digest("hex");
  return hash;
};

// ==========================
// 🕒 Scheduled Function
// ==========================
// ==========================
// 🕒 Scheduled Function (Completed)
// ==========================
export const SheduleOrdersCleanup = onSchedule(
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
        new Date(Date.now() - 4 * 60 * 60 * 1000)
      );

      const ordersSnap = await orderCollection
        .where("createdAt", "<=", timeFrame)
        .where("paymentStatus", "in", [
          PaymentStatus.Failed,
          PaymentStatus.Refunded,
        ])
        .get();

      if (ordersSnap.empty) {
        console.log("✅ No failed or refunded orders to clean up.");
        return;
      }

      const targetOrders = ordersSnap.docs.filter((doc) => {
        const data = doc.data() as Order;
        return !data?.restocked;
      });

      if (!targetOrders.length) {
        console.log("✅ All orders are already restocked.");
        return;
      }

      console.log(`⚠️ Found ${targetOrders.length} orders to process.`);

      let batch = db.batch();
      let opCount = 0;
      const logs: any[] = [];

      for (const orderDoc of targetOrders) {
        const orderData = orderDoc.data() as Order;
        const orderId = orderDoc.id;
        const hashId = `hash_${orderId}`;
        const hashDocRef = hashLedgerCollection.doc(hashId);

        const total =
          calculateTotal(orderData.items) +
          (orderData?.shippingFee || 0) +
          (orderData?.fee || 0) -
          (orderData?.discount || 0);

        // 🔄 Restock inventory items
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

        // 🔖 Prepare cleanup log
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

        // 🔄 Update or delete orders based on paymentStatus
        if (orderData.paymentStatus === PaymentStatus.Failed) {
          batch.delete(orderDoc.ref);
          batch.delete(hashDocRef);
        } else if (orderData.paymentStatus === PaymentStatus.Refunded) {
          const orderUpdate = {
            restocked: true,
            restockedAt: admin.firestore.Timestamp.now(),
            cleanupProcessed: true,
          };
          batch.update(orderDoc.ref, orderUpdate);

          // Update hash ledger
          const updatedOrderData = await orderCollection.doc(orderId).get();
          if (updatedOrderData.exists) {
            const data = updatedOrderData.data();
            const hash = generateDocumentHash(data);
            batch.set(
              hashDocRef,
              {
                id: hashDocRef.id,
                hashValue: hash,
                sourceCollection: "orders",
                sourceDocId: orderId,
                paymentStatus: orderData.paymentStatus,
                updatedAt: admin.firestore.Timestamp.now(),
                createdAt: admin.firestore.Timestamp.now(),
                cleanupFlag: true,
              },
              { merge: true }
            );
          }
        }

        opCount++;
        if (opCount >= BATCH_LIMIT) {
          batch = await commitBatch(batch, opCount);
          opCount = 0;
        }
      }

      // Commit any remaining batch operations
      if (opCount > 0) {
        await batch.commit();
        console.log(`💾 Committed final batch of ${opCount} operations.`);
      }

      // 🔖 Commit logs
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

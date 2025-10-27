import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Order } from "@/model";
import {
  updateOrAddOrderHash,
  validateDocumentIntegrity,
} from "./IntegrityService";
import { Timestamp } from "firebase-admin/firestore";

const ORDERS_COLLECTION = "orders";

/**
 * Helper to safely convert Firestore Timestamps or strings to a locale string.
 * Prevents crashes if the field is null, undefined, or not a date.
 */
function toSafeLocaleString(val: any): string | null {
  if (!val) {
    return null;
  }
  // Check if it's a Firestore Timestamp
  if (typeof (val as Timestamp)?.toDate === "function") {
    return (val as Timestamp).toDate().toLocaleString();
  }
  // Check if it's a string or number that can be parsed
  try {
    const date = new Date(val);
    // Check if the date is valid before converting
    if (!isNaN(date.getTime())) {
      return date.toLocaleString();
    }
    return String(val); // Return original value if not a valid date
  } catch (e) {
    return String(val); // Fallback
  }
}

export const getOrders = async (pageNumber: number = 1, size: number = 20) => {
  try {
    const offset = (pageNumber - 1) * size;
    const ordersSnapshot = await adminFirestore
      .collection(ORDERS_COLLECTION)
      .orderBy("createdAt", "desc") // OrderBy must come before limit/offset
      .limit(size)
      .offset(offset)
      .get();

    const orders: Order[] = [];

    // 1. Replaced forEach with a for...of loop to handle async/await
    for (const doc of ordersSnapshot.docs) {
      const orderData = doc.data() as Order;

      // 2. Passed 'adminFirestore' as the first argument
      const integrity = await validateDocumentIntegrity(
        adminFirestore,
        ORDERS_COLLECTION,
        doc.id
      );

      const order: Order = {
        ...orderData,
        orderId: doc.id, // 3. Set orderId to the document ID
        integrity: integrity, // 4. Added the integrity check result
        customer: orderData.customer
          ? {
              ...orderData.customer,
              // 5. Use safe date conversion
              createdAt: toSafeLocaleString(orderData.customer.createdAt),
              updatedAt: toSafeLocaleString(orderData.customer.updatedAt),
            }
          : null,
        createdAt: toSafeLocaleString(orderData.createdAt),
        updatedAt: toSafeLocaleString(orderData.updatedAt),
        tracking: undefined,
      };
      orders.push(order);
    }

    console.log(`Fetched ${orders.length} orders on page ${pageNumber}`);
    return orders;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export const getOrder = async (orderId: string): Promise<Order | null> => {
  try {
    // 1. Changed query to a direct doc.get() for efficiency and consistency
    const doc = await adminFirestore
      .collection(ORDERS_COLLECTION)
      .doc(orderId)
      .get();

    if (!doc.exists) {
      console.warn(`Order with ID ${orderId} not found`);
      return null;
    }

    const data = doc.data() as Order;

    // 2. Passed 'adminFirestore' and used the doc.id for the check
    const integrity = await validateDocumentIntegrity(
      adminFirestore,
      ORDERS_COLLECTION,
      doc.id
    );

    return {
      ...data,
      orderId: doc.id, // 3. Ensure orderId is the doc ID
      integrity: integrity, // 4. Add integrity result
      customer: data.customer
        ? {
            ...data.customer,
            updatedAt: data.customer.updatedAt
              ? toSafeLocaleString(data.customer.updatedAt)
              : null,
          }
        : null,
      createdAt: toSafeLocaleString(data.createdAt),
      updatedAt: toSafeLocaleString(data.updatedAt),
    } as Order;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const updateOrder = async (order: Order, orderId: string) => {
  try {
    await adminFirestore
      .collection(ORDERS_COLLECTION)
      .doc(orderId)
      .set(
        {
          paymentStatus: order.paymentStatus,
          status: order.status,
          updatedAt: new Date(),
          ...(order.customer && {
            customer: {
              ...order.customer,
              updatedAt: new Date(),
            },
          }),
        },
        { merge: true }
      );
    const updatedOrder = await getOrder(orderId);
    if (!updatedOrder) return;
    await updateOrAddOrderHash(order);
    console.log(`Order with ID ${order.orderId} updated successfully`);
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

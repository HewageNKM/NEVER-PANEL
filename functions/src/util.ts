import * as admin from "firebase-admin";
import { BATCH_LIMIT, OrderItem } from "./constant";

/**
 * Calculates the total price of order items.
 */
export const calculateTotal = (items: OrderItem[]): number => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

/**
 * Commits Firestore batches in chunks.
 */
export const commitBatch = async (
  batch: FirebaseFirestore.WriteBatch,
  opCount: number
): Promise<FirebaseFirestore.WriteBatch> => {
  if (opCount >= BATCH_LIMIT) {
    await batch.commit();
    console.log(`Committed a batch of ${opCount} operations.`);
    return admin.firestore().batch(); // Start a new batch
  }
  return batch;
};

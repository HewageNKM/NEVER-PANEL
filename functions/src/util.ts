import * as admin from "firebase-admin";
import { BATCH_LIMIT, OrderItem } from "./constant";
import * as crypto from "crypto";
import * as stringify from "json-stable-stringify";

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

export const  generateDocumentHash = (docData:any) => {
  // 1. Create a copy of the data
  const dataToHash = { ...docData };

  // 3. Create the canonical string (keys are sorted alphabetically)
  const canonicalString = stringify(dataToHash) || '';


  // 4. Generate the hash
  const hash = crypto.createHash('sha256')
                     .update(canonicalString)
                     .digest('hex');

  return hash;
}

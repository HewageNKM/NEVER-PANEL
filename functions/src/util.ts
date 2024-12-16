import * as admin from "firebase-admin";

/*
 * Sends an email to the admin.
 */
import {sendEmail, sendSMS} from "./notifications";
import {ADMIN_EMAIL, ADMIN_PHONE, BATCH_LIMIT, OrderItem} from "./constant";

export const sendAdminEmail = (
  templateName: string, templateData: object
) => {
  return sendEmail(ADMIN_EMAIL, templateName, templateData);
};

/*
 * Sends an SMS to the admin.
 */
export const sendAdminSMS = (text: string) => {
  return sendSMS(ADMIN_PHONE, text);
};

/*
 * Calculates the total price of order items.
 */
export const calculateTotal = (
  items: OrderItem[]
): number => {
  return items.reduce((total, item) =>
      total + item.price * item.quantity, 0);
};

/*
 * Commits Firestore batches in chunks.
 */
export const commitBatch = async (
  batch: FirebaseFirestore.WriteBatch, opCount: number
) => {
  if (opCount >= BATCH_LIMIT) {
    await batch.commit();
    console.log(`Committed a batch of ${opCount} operations.`);
    return admin.firestore().batch(); // Start a new batch
  }
  return batch;
};

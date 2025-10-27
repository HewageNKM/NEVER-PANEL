import { adminFirestore } from "@/firebase/firebaseAdmin";
import crypto from "crypto";
import stringify from "json-stable-stringify";

const generateDocumentHash = (docData:any) => {
  // 1. Create a copy of the data
  const dataToHash = { ...docData };

  // 3. Create the canonical string (keys are sorted alphabetically)
  const canonicalString = stringify(dataToHash);

  // 4. Generate the hash
  const hash = crypto
    .createHash("sha256")
    .update(canonicalString)
    .digest("hex");

  return hash;
}

export const validateDocumentIntegrity = async (collectionName:string, docId:string) => {
  try {
    // 1. Get the document's current data
    const docRef = adminFirestore.collection(collectionName).doc(docId);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.warn(`Document ${collectionName}/${docId} not found.`);
      return false;
    }
    const docData = doc.data();

    // 2. Determine the ledger ID and get the stored hash
    const ledgerId = `hash_${docId}`;
    const hashRef = adminFirestore.collection("hash_ledger").doc(ledgerId);
    const hashDoc = await hashRef.get();

    if (!hashDoc.exists) {
      console.warn(`Hash ledger not found for ${collectionName}/${docId}.`);
      return false
    }
    const storedHash = hashDoc?.data()?.hashValue;

    // 3. Generate a new hash from the current data
    const currentHash = generateDocumentHash(docData);

    // 4. Compare
    if (currentHash === storedHash) {
      const message = `✅ Integrity check PASSED for ${collectionName}/${docId}.`;
      console.log(message);
      return true;
    } else {
      const message = `🚨 TAMPERING DETECTED for ${collectionName}/${docId}`;
      console.warn(message);
      console.log("Stored Hash:", storedHash);
      console.log("New Hash: ", currentHash);
      return false;
    }
  } catch (error) {
    console.error(
      `Error during validation for ${collectionName}/${docId}:`,
      error
    );
    throw error;
  }
};

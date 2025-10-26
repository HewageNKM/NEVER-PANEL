import { adminFirestore, adminStorageBucket } from "@/firebase/firebaseAdmin";
import { Product } from "@/model/Product";
import { ProductVariant } from "@/model/ProductVariant";
import { nanoid } from "nanoid";

// --- NEW IMPORTS for retext-keywords ---
import { retext } from "retext";
import retextPos from "retext-pos";
import retextKeywords from "retext-keywords";
import { toString } from "nlcst-to-string";
// --- END NEW IMPORTS ---

// --- REMOVED wink-nlp and model imports ---

// --- NEW: Create the retext processor ---
// We create this once and reuse it for efficiency.
const retextProcessor = retext()
  .use(retextPos) // Add Part-of-Speech tagging
  .use(retextKeywords, {
    maximum: 15, // Extract the top 15 keywords and phrases
  });
// --- END NEW PROCESSOR ---

const PRODUCTS_COLLECTION = "products";
const BUCKET = adminStorageBucket;

// ... (uploadThumbnail function remains unchanged) ...
const uploadThumbnail = async (
  file: File,
  id: string
): Promise<Product["thumbnail"]> => {
  const filePath = `products/${id}/thumbnail/${file.name}`;
  const fileRef = BUCKET.file(filePath);
  const buffer = Buffer.from(await file.arrayBuffer());

  await fileRef.save(buffer, {
    metadata: {
      contentType: file.type,
    },
  });

  await fileRef.makePublic();
  const url = `https://storage.googleapis.com/${BUCKET.name}/${filePath}`;

  return {
    url: url,
    file: filePath,
    order: 0,
  };
};

// --- REMOVED STOPWORDS constant ---

// --- REMOVED generateHybridTags function ---

/**
 * NEW: Helper function to extract keywords using retext
 */
const extractKeywords = async (text: string): Promise<string[]> => {
  if (!text || text.trim() === "") return [];

  try {
    const file = await retextProcessor.process(text);

    // Extract single keywords (e.g., "laptop")
    const keywords =
      file.data.keywords?.map((kw) => toString(kw.matches[0].node)) || [];

    // Extract key-phrases (e.g., "natural language processing")
    const keyphrases =
      file.data.keyphrases?.map((ph) => toString(ph.matches[0].nodes)) || [];

    // Combine, lowercase, and deduplicate
    const allTags = [...keywords, ...keyphrases].map((tag) => tag.toLowerCase());
    return Array.from(new Set(allTags));
  } catch (e) {
    console.error("Retext processing error:", e);
    return []; // Return empty on error
  }
};

/**
 * UPDATED: generateTags is now async and uses retext
 */
export const generateTags = async (
  product: Partial<Product>
): Promise<string[]> => {
  const tagsSet = new Set<string>();

  const texts: string[] = [];
  if (product.name) texts.push(product.name);
  if (product.description) texts.push(product.description);
  if (product.variants) {
    product.variants.forEach((v) => {
      if (v.variantName) texts.push(v.variantName);
    });
  }

  // Add brand and category directly
  if (product.category) tagsSet.add(product.category.toLowerCase());
  if (product.brand) tagsSet.add(product.brand.toLowerCase());

  // Process all text fields at once for better context
  const combinedText = texts.join(" ");
  const nlpTags = await extractKeywords(combinedText); // AWAIT new function
  nlpTags.forEach((tag) => tagsSet.add(tag));

  return [...tagsSet];
};

/**
 * Adds a new product to Firestore, now including generated keywords.
 * UPDATED to await generateTags
 */
export const addProducts = async (product: Partial<Product>, file: File) => {
  try {
    const id = `p-${nanoid(8)}`;

    // 1. Upload thumbnail
    const thumbnail = await uploadThumbnail(file, id);

    // 2. Generate keywords (now async)
    const keywords = await generateTags(product); // AWAIT

    const newProductDocument: Product = {
      ...(product as Product), // Cast after filling required fields
      id: id,
      productId: id,
      thumbnail: thumbnail,
      tags: keywords,
      isDeleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await adminFirestore
      .collection(PRODUCTS_COLLECTION)
      .doc(id)
      .set(newProductDocument);

    console.log(`Product added with ID: ${id}`);

    return true;
  } catch (err) {
    console.error("Error adding product:", err);
    return false;
  }
};

/**
 * UPDATED to await generateTags
 */
export const updateProduct = async (
  id: string,
  product: Partial<Product>,
  file?: File | null
) => {
  try {
    const keywords = await generateTags(product); // AWAIT
    let thumbnail = product.thumbnail; // Keep old thumbnail by default

    if (file) {
      // Note: getProductById now also filters variants, which is fine
      const oldProduct = await getProductById(id);
      const oldPath = oldProduct?.thumbnail?.file; // Use .file for the storage path
      if (oldPath) {
        try {
          await BUCKET.file(oldPath).delete();
        } catch (delError) {
          console.warn(`Failed to delete old thumbnail: ${oldPath}`, delError);
        }
      }
      thumbnail = await uploadThumbnail(file, id);
    }

    const updatedProductDocument = {
      name: product.name,
      category: product.category,
      brand: product.brand,
      description: product.description,
      buyingPrice: product.buyingPrice,
      sellingPrice: product.sellingPrice,
      marketPrice: product.marketPrice,
      discount: product.discount,
      listing: product.listing,
      weight: product.weight,
      variants: product.variants,
      status: product.status,
      thumbnail: thumbnail,
      tags: keywords,
      updatedAt: new Date(),
    };

    await adminFirestore
      .collection(PRODUCTS_COLLECTION)
      .doc(id)
      .set(updatedProductDocument, { merge: true }); // Use set with merge

    console.log(`Product updated with ID: ${id}`);
    return true;
  } catch (error) {
    console.log("Error updating product:", error); // Added log message
    return false;
  }
};

/**
 * UPDATED to await generateTags and fixed search bug
 */
export const getProducts = async (
  pageNumber: number = 1,
  size: number = 20,
  search?: string,
  brand?: string,
  category?: string,
  status?: boolean,
  listing?: boolean
): Promise<{ dataList: Omit<Product, "isDeleted">[]; rowCount: number }> => {
  try {
    let query: FirebaseFirestore.Query = adminFirestore
      .collection(PRODUCTS_COLLECTION)
      .where("isDeleted", "==", false);

    let countQuery: FirebaseFirestore.Query = adminFirestore
      .collection(PRODUCTS_COLLECTION)
      .where("isDeleted", "==", false);

    if (search) {
      // --- FIX: Pass an object to generateTags, not just a string ---
      // and AWAIT the result
      const searchKeywords = await generateTags({
        name: search,
        description: search,
      });

      if (searchKeywords.length > 0) {
        query = query.where("tags", "array-contains-any", searchKeywords);
        countQuery = countQuery.where(
          "tags",
          "array-contains-any",
          searchKeywords
        );
      } else {
        // If search generates no keywords, return no results.
        // We can force this by querying for a dummy tag.
        query = query.where("tags", "array-contains", `__no_match__${nanoid()}`);
        countQuery = countQuery.where("tags", "array-contains", `__no_match__${nanoid()}`);
      }

    } else {
      if (brand) {
        query = query.where("brand", "==", brand);
        countQuery = countQuery.where("brand", "==", brand);
      }
      if (category) {
        query = query.where("category", "==", category);
        countQuery = countQuery.where("category", "==", category);
      }
      if (typeof status === "boolean") {
        query = query.where("status", "==", status);
        countQuery = countQuery.where("status", "==", status);
      }
      if (typeof listing === "boolean") {
        query = query.where("listing", "==", listing);
        countQuery = countQuery.where("listing", "==", listing);
      }
    }

    // Get total count
    const totalSnapshot = await countQuery.get();
    const rowCount = totalSnapshot.size;

    // Apply pagination
    const offset = (pageNumber - 1) * size;
    // Add ordering for consistent pagination
    const productsSnapshot = await query
      .offset(offset)
      .limit(size)
      .get();

    // ... (rest of getProducts function is unchanged) ...
    const products = productsSnapshot.docs.map((doc) => {
      const data = doc.data() as any;
      const { isDeleted, variants, ...productData } = data; 

      const activeVariants = (variants || []).filter(
        (variant: ProductVariant & { isDeleted?: boolean }) => {
          return variant.isDeleted !== true; 
        }
      );

      return {
        ...productData, 
        productId: doc.id,
        variants: activeVariants,
        createdAt: data.createdAt?.toDate
          ? data.createdAt.toDate().toISOString()
          : new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate
          ? data.updatedAt.toDate().toISOString()
          : new Date().toISOString(),
      } as Omit<Product, "isDeleted">;
    });

    return { dataList: products, rowCount: rowCount };
  } catch (error) {
    console.error("Get Products Error:", error);
    throw error;
  }
};

// ... (getProductById function remains unchanged) ...
export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = adminFirestore.collection(PRODUCTS_COLLECTION).doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists || docSnap.data()?.isDeleted) {
      return null;
    }

    const data = docSnap.data() as any; 

    const activeVariants = (data.variants || []).filter(
      (variant: ProductVariant & { isDeleted?: boolean }) => {
        return variant.isDeleted !== true;
      }
    );

    const product: Product = {
      ...data,
      productId: docSnap.id,
      variants: activeVariants, 
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate
        ? data.updatedAt.toDate().toISOString()
        : new Date().toISOString(),
    };

    return product;
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    throw error;
  }
};


// ... (getProductDropdown function remains unchanged) ...
export const getProductDropdown = async () => {
  try {
    const snapshot = await adminFirestore
      .collection(PRODUCTS_COLLECTION)
      .where("isDeleted", "==", false)
      .where("status", "==", true)
      .get();

    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      label: doc.data().name,
    }));
    return products;
  } catch (error) {
    console.error("Get Product Dropdown Error:", error);
    throw error;
  }
};
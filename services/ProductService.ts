import { adminFirestore, adminStorageBucket } from "@/firebase/firebaseAdmin"; // <-- Import adminStorage
import { Product } from "@/model/Product";
import { ProductVariant } from "@/model/ProductVariant";
import { nanoid } from "nanoid";
import natural from "natural";

const { PorterStemmer, NGrams } = natural;
const PRODUCTS_COLLECTION = "products";
const BUCKET = adminStorageBucket; // Get your default bucket

/**
 * Helper function to upload a file to Firebase Storage
 */

// ... (your other imports and BUCKET definition)

const uploadThumbnail = async (
  file: File,
  id: string
): Promise<Product["thumbnail"]> => {
  const filePath = `products/${id}/thumbnail/${file.name}`;
  const fileRef = BUCKET.file(filePath);

  // Convert File to Buffer
  const buffer = Buffer.from(await file.arrayBuffer());

  // 1. Save the file
  await fileRef.save(buffer, {
    metadata: {
      contentType: file.type,
    },
    // Optionally, you can set predefinedAcl to publicRead here
    // public: true, // This is another way to do it on save
  });

  // 2. Make the file public
  await fileRef.makePublic();

  // 3. Construct the public URL directly
  // This URL format is standard for public files in GCS/Firebase Storage
  const url = `https://storage.googleapis.com/${BUCKET.name}/${filePath}`;

  return {
    url: url,
    file: filePath, // Store the storage path, not the original name
    order: 0,
  };
};

// ... generateKeywords and generateTags functions (no changes) ...
export const generateKeywords = (text: string): string[] => {
  if (!text) return [];
  const tokens = PorterStemmer.tokenizeAndStem(text);
  const unigrams = tokens;
  const bigrams = NGrams.ngrams(tokens, 2).map((ngram: string[]) =>
    ngram.join(" ")
  );
  return [...unigrams, ...bigrams];
};

export const generateTags = (product: Partial<Product>): string[] => {
  const tagsSet = new Set<string>();
  if (product.name) {
    generateKeywords(product.name).forEach((tag) => tagsSet.add(tag));
  }
  if (product.description) {
    generateKeywords(product.description).forEach((tag) => tagsSet.add(tag));
  }
  if (product.variants) {
    product.variants.forEach((variant) => {
      if (variant.variantName) {
        generateKeywords(variant.variantName).forEach((tag) =>
          tagsSet.add(tag)
        );
      }
    });
  }
  if (product.category) {
    tagsSet.add(product.category.toLowerCase());
  }
  if (product.brand) {
    tagsSet.add(product.brand.toLowerCase());
  }
  if (product.tags) {
    product.tags.forEach((tag) => tagsSet.add(tag.toLowerCase()));
  }
  return [...tagsSet];
};

/**
 * Adds a new product to Firestore, now including generated keywords.
 */
export const addProducts = async (product: Partial<Product>, file: File) => {
  try {
    const id = `p-${nanoid(8)}`;

    // 1. Upload thumbnail
    const thumbnail = await uploadThumbnail(file, id);

    // 2. Generate keywords
    const keywords = generateTags(product);

    const newProductDocument: Product = {
      ...(product as Product), // Cast after filling required fields
      id: id,
      productId: id, // Assuming itemId is the same as the doc ID
      thumbnail: thumbnail, // Add the uploaded image URL
      tags: keywords, // Note: your model says tags, your old code saved keywords here
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

export const updateProduct = async (
  id: string,
  product: Partial<Product>,
  file?: File | null
) => {
  try {
    const keywords = generateTags(product);
    let thumbnail = product.thumbnail; // Keep old thumbnail by default

    if (file) {
      const oldPath = (await getProductById(id))?.thumbnail.url;
      if (oldPath) {
        BUCKET.file(oldPath).delete();
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
      thumbnail: thumbnail, // Set new or existing thumbnail
      tags: keywords,
      updatedAt: new Date(),
    };

    // Use 'merge: true' to avoid overwriting fields not in 'product'
    await adminFirestore
      .collection(PRODUCTS_COLLECTION)
      .doc(id)
      .set(updatedProductDocument, { merge: true }); // Use set with merge

    console.log(`Product updated with ID: ${id}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

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
      .where("isDeleted", "==", false); // Filter deleted products

    let countQuery: FirebaseFirestore.Query = adminFirestore
      .collection(PRODUCTS_COLLECTION)
      .where("isDeleted", "==", false);

    // --- Simplified Logic: Search OR Filter ---
    if (search) {
      const searchKeywords = generateKeywords(search);
      query = query.where("tags", "array-contains-any", searchKeywords);
      countQuery = countQuery.where(
        "tags",
        "array-contains-any",
        searchKeywords
      );
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
      // No orderBy to avoid needing indexes
    }
    // --- End ---

    // Get total count
    const totalSnapshot = await countQuery.get();
    const rowCount = totalSnapshot.size;

    // Apply pagination
    const offset = (pageNumber - 1) * size;
    const productsSnapshot = await query.offset(offset).limit(size).get();

    // Map documents, excluding deleted variants and the top-level 'isDeleted' field
    const products = productsSnapshot.docs.map((doc) => {
      const data = doc.data() as any;
      const { isDeleted, variants, ...productData } = data; // Destructure fields

      // --- Filter Variants ---
      const activeVariants = (variants || []).filter(
        (variant: ProductVariant & { isDeleted?: boolean }) => {
          return variant.isDeleted !== true; // Keep if not explicitly deleted
        }
      );
      // --- End Filter ---

      return {
        ...productData, // Spread the rest of the product data
        productId: doc.id,
        variants: activeVariants, // Use the filtered variants array
        // Convert Timestamps
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

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = adminFirestore.collection(PRODUCTS_COLLECTION).doc(id);
    const docSnap = await docRef.get();

    // Check if product exists and is not marked as deleted at the top level
    if (!docSnap.exists || docSnap.data()?.isDeleted) {
      return null;
    }

    const data = docSnap.data() as any; // Cast to 'any' for easier manipulation initially

    // Filter the variants array
    const activeVariants = (data.variants || []).filter(
      (variant: ProductVariant & { isDeleted?: boolean }) => {
        // Keep variant if isDeleted is explicitly false or if the field doesn't exist
        return variant.isDeleted !== true;
      }
    );

    // Construct the final product object with filtered variants
    const product: Product = {
      ...data,
      productId: docSnap.id,
      variants: activeVariants, // Use the filtered array
      // Convert Timestamps to ISO strings, handle potential missing timestamps
      createdAt: data.createdAt?.toDate
        ? data.createdAt.toDate().toISOString()
        : new Date().toISOString(), // Or handle as null/undefined if preferred
      updatedAt: data.updatedAt?.toDate
        ? data.updatedAt.toDate().toISOString()
        : new Date().toISOString(), // Or handle as null/undefined if preferred
    };

    return product;
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    throw error;
  }
};

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

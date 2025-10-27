// app/api/v2/master/products/route.ts

import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/firebase/firebaseAdmin";
import { getProducts, addProducts } from "@/services/ProductService"; // Import your service
import { Product } from "@/model/Product";

/**
 * Helper to parse FormData into a Product object
 */
const parseProductFromFormData = async (
  formData: FormData
): Promise<Partial<Product>> => {
  const product: Partial<Product> = {};

  // Handle all string/number fields
  for (const [key, value] of formData.entries()) {
    if (key === "thumbnail") continue; // Skip file
    if (key === "variants" || key === "tags") {
      // Parse JSON fields
      product[key as "variants" | "tags"] = JSON.parse(value as string);
    } else if (key === "status" || key === "listing") {
      // Parse string booleans
      product[key as "status" | "listing"] = value === "true";
    } else if (
      ["buyingPrice", "sellingPrice", "marketPrice", "discount"].includes(key)
    ) {
      // Parse numbers
      product[key as "buyingPrice"] = parseFloat(value as string) || 0;
    } else {
      // Assign simple strings
      (product as any)[key] = value as string;
    }
  }
  return product;
};

/**
 * GET: Fetch a paginated list of products
 */
export const GET = async (req: NextRequest) => {
  try {
    const user = await authorizeRequest(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const size = parseInt(searchParams.get("size") || "10");
    const search = searchParams.get("search") || undefined;
    const brand = searchParams.get("brand") || undefined;
    const category = searchParams.get("category") || undefined;

    // Helper to parse booleans from string "true" or "false"
    const parseBoolean = (val?: string) =>
      val === "true" ? true : val === "false" ? false : undefined;

    const status = parseBoolean(searchParams.get("status") || undefined);
    const listing = parseBoolean(searchParams.get("listing") || undefined);

    const result = await getProducts(
      page,
      size,
      search,
      brand,
      category,
      status,
      listing
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("GET /api/v2/master/products Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};

/**
 * POST: Create a new product
 */
export const POST = async (req: NextRequest) => {
  try {
    const user = await authorizeRequest(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("thumbnail") as File | null;

    if (!file) {
      return NextResponse.json(
        { message: "Thumbnail file is required" },
        { status: 400 }
      );
    }

    const productData = await parseProductFromFormData(formData);
    const success = await addProducts(productData, file);

    if (!success) {
      throw new Error("Failed to add product");
    }

    return NextResponse.json(
      { message: "Product created successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("POST /api/v2/master/products Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
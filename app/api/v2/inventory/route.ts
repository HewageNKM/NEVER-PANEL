import { authorizeRequest } from "@/firebase/firebaseAdmin";
import { getInventory, addInventory } from "@/services/InventoryService"; // Use InventoryService
import { NextRequest, NextResponse } from "next/server";

// GET Handler: Fetch list of inventory items
export const GET = async (req: NextRequest) => {
  try {
    const user = await authorizeRequest(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = req.nextUrl;
    const page = parseInt(searchParams.get("page") || "1");
    const size = parseInt(searchParams.get("size") || "10");
    
    // --- Read all filters ---
    const productId = searchParams.get("productId") || undefined;
    const variantId = searchParams.get("variantId") || undefined;
    const variantSize = searchParams.get("variantSize") || undefined; // 'size' from URL
    const stockId = searchParams.get("stockId") || undefined;

    const result = await getInventory(
      page,
      size,
      productId,
      variantId,
      variantSize,
      stockId
    );

    return NextResponse.json(result);
  } catch (error: any) {
    console.error("GET /api/v2/inventory Error:", error);
    // Pass the specific error message (e.g., "index required") to the client
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};

// POST Handler: Create a new inventory item (or update quantity if exists)
export const POST = async (req: NextRequest) => {
  try {
    const user = await authorizeRequest(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    // Basic Validation
    // **FIXED: Changed 'itemId' to 'productId' to match service/frontend**
    if (!data.productId || !data.variantId || !data.size || !data.stockId) {
      return NextResponse.json(
        { message: "Product, Variant, Size, and Stock Location are required" },
        { status: 400 }
      );
    }
     if (data.quantity === undefined || typeof data.quantity !== 'number' || data.quantity < 0 || !Number.isInteger(data.quantity)) {
        return NextResponse.json(
            { message: "Quantity is required and must be a non-negative integer" },
            { status: 400 }
        );
     }

    // Prepare data for the service
    const inventoryData = {
        productId: data.productId, // **FIXED**
        variantId: data.variantId,
        size: data.size,
        stockId: data.stockId,
        quantity: data.quantity,
    };

    const newInventoryItem = await addInventory(inventoryData);
    // addInventory returns the created/updated item
    return NextResponse.json(newInventoryItem, { status: 201 });

  } catch (error: any) {
    console.error("POST /api/v2/inventory Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};
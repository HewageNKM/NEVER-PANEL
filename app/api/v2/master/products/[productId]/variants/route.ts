import { authorizeRequest } from "@/firebase/firebaseAdmin";
import { ProductVariant } from "@/model/ProductVariant";
import { addVariant } from "@/services/VariantService";
import { NextRequest, NextResponse } from "next/server";

// Helper to parse FormData for variants (similar to product parse)
const parseVariantFormData = (
  formData: FormData
): { variantData: Partial<ProductVariant>; newImageFiles: File[] } => {
  const variantData: Partial<ProductVariant> = {};
  const newImageFiles: File[] = formData.getAll("newImages") as File[];

  // Helper to safely parse JSON arrays
  const parseJsonArray = (value: string): any[] => {
    try {
      if (value && typeof value === "string" && value.length > 0) {
        return JSON.parse(value);
      }
    } catch (e) {
      console.error("Failed to parse JSON", value, e);
    }
    return []; // Default to empty array on error or empty string
  };

  for (const [key, value] of formData.entries()) {
    if (key === "newImages") continue; // Skip files

    switch (key) {
      case "sizes":
      case "images": // Existing images sent as JSON string
        (variantData as any)[key] = parseJsonArray(value as string);
        break;
      case "status":
        (variantData as any)[key] = value === "true";
        break;
      default:
        (variantData as any)[key] = value as string;
    }
  }
  return { variantData, newImageFiles };
};

export const POST = async (
  req: NextRequest,
  { params }: { params: { productId: string } }
) => {
  try {
    const user = await authorizeRequest(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { productId } = params;
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    const formData = await req.formData();
    const { variantData, newImageFiles } = parseVariantFormData(formData);

    // Basic validation
    if (!variantData.variantName) {
      return NextResponse.json(
        { message: "Variant name is required" },
        { status: 400 }
      );
    }

    // Call the service to add the variant
    const savedVariant = await addVariant(
      productId,
      variantData,
      newImageFiles
    );

    return NextResponse.json(savedVariant, { status: 201 }); // Return the saved variant
  } catch (error: any) {
    console.error("POST Variant Error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
};

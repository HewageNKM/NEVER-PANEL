import { NextRequest, NextResponse } from "next/server";
import { authorizeRequest } from "@/firebase/firebaseAdmin";
import { getCategoryById, updateCategory, softDeleteCategory } from "@/services/CategoryService";

export const GET = async (req: NextRequest, { params }: { params: { categoryId: string } }) => {
  try {
    const user = await authorizeRequest(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const category = await getCategoryById(params.categoryId);
    if (!category) return NextResponse.json({ message: "Category not found" }, { status: 404 });

    return NextResponse.json(category);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Failed to fetch category" }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest, { params }: { params: { categoryId: string } }) => {
  try {
    const user = await authorizeRequest(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    if(!data.name || !data.status) return NextResponse.json({ message: "Name and Status are required" }, { status: 400 })
    const res = await updateCategory(params.categoryId, data);
    return NextResponse.json(res);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Failed to update category" }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest, { params }: { params: { categoryId: string } }) => {
  try {
    const user = await authorizeRequest(req);
    if (!user) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const res = await softDeleteCategory(params.categoryId);
    return NextResponse.json(res);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ message: "Failed to delete category" }, { status: 500 });
  }
};

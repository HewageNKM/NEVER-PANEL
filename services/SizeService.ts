import { adminFirestore } from "@/firebase/firebaseAdmin";
import { Size } from "@/model/Size";

const COLLECTION = "sizes";

// 🔹 Get Sizes (pagination, optional search by name & status)
export const getSizes = async ({
  page = 1,
  size = 10,
  search = "",
  status,
}: {
  page?: number;
  size?: number;
  search?: string;
  status?: "active" | "inactive" | null;
}) => {
  try {
    let query: FirebaseFirestore.Query = adminFirestore
      .collection(COLLECTION)
      .where("isDeleted", "==", false)
      .orderBy("name");

    if (status === "active") query = query.where("status", "==", "active");
    if (status === "inactive") query = query.where("status", "==", "inactive");

    if (search.trim()) {
      const s = search.trim();
      query = query
        .where("name", ">=", s)
        .where("name", "<=", s + "\uf8ff");
    }

    const offset = (page - 1) * size;
    const snapshot = await query.offset(offset).limit(size).get();

    const dataList: Size[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Size),
    }));

    // Total count
    const totalSnapshot = await query.get();

    return { dataList, rowCount: totalSnapshot.size };
  } catch (error) {
    console.error("Get Sizes Error:", error);
    return { dataList: [], rowCount: 0 };
  }
};

// 🔹 Create Size
export const createSize = async (data: Size) => {
  const docRef = await adminFirestore.collection(COLLECTION).add({
    ...data,
    nameLower: data.name.toLowerCase(),
    isDeleted: false,
  });
  return { id: docRef.id, ...data };
};

// 🔹 Update Size
export const updateSize = async (id: string, data: Partial<Size>) => {
  if (data.name) data.name = data.name.toLowerCase();
  await adminFirestore.collection(COLLECTION).doc(id).update(data);
  return { id, ...data };
};

// 🔹 Delete Size (soft delete)
export const deleteSize = async (id: string) => {
  await adminFirestore.collection(COLLECTION).doc(id).update({ isDeleted: true });
  return { id };
};

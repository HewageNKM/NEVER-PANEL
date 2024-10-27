import {saveToInventory, updateItem, verifyIdToken} from "@/firebase/firebaseAdmin";
import {NextResponse} from "next/server";

export const PUT = async (req: Request) => {
    try {
        // Verify the ID token
        await verifyIdToken(req);
        let body = await req.json();
        await updateItem(body);
        return NextResponse.json({ message: 'Item saved successfully' },{status: 200});
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ message: 'Error fetching orders', error: error.message }, { status: 500 });
    }
};
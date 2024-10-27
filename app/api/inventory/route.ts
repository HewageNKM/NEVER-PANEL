import {saveToInventory, verifyIdToken} from "@/firebase/firebaseAdmin";
import {NextResponse} from "next/server";

export const POST = async (req: Request) => {
    try {
        // Verify the ID token
        await verifyIdToken(req);
        let body = await req.json();
        await  saveToInventory(body);
        return NextResponse.json({message: 'item saved successfully'}, {status: 200});
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({message: 'Error saving item', error: error.message}, {status: 500});
    }
};
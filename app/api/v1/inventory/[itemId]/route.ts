import {authorizeRequest, deleteItemById, getItemById, updateItem} from "@/firebase/firebaseAdmin";
import {NextResponse} from "next/server";

export const PUT = async (req: Request) => {
    try {
        // Verify the ID token
        const response = await authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }

        const body = await req.json();
        console.log(body)
        await updateItem(body);
        return NextResponse.json({message: 'Item saved successfully'}, {status: 200});
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({message: error.message}, {status: 500});
    }
};

export const DELETE = async (req: Request) => {
    try {
        // Verify the ID token
        const response = authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }
        const itemId = new URL(req.url).pathname.split("/").pop();
        await deleteItemById(itemId || "None")
        return NextResponse.json({message: 'Item deleted successfully'}, {status: 200});
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({message: error.message}, {status: 500});
    }
};

export const GET = async (req: Request) => {
    try {
        // Verify the ID token
        const response = authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }
        const itemId = new URL(req.url).pathname.split("/").pop();
        const item = await getItemById(itemId || "None");
        return NextResponse.json(item);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({message: error.message}, {status: 500});
    }
};
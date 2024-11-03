import {getInventoryItems, saveToInventory, verifyIdToken} from "@/firebase/firebaseAdmin";
import {NextResponse} from "next/server";
import {authorizeRequest} from "@/lib/middleware";

export const POST = async (req: Request) => {
    try {
        // Verify the ID token
        const response = authorizeRequest(req);
        if (!response) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        await  saveToInventory(body);
        return NextResponse.json({message: 'item saved successfully'}, {status: 200});
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({message: 'Error saving item', error: error.message}, {status: 500});
    }
};

export const GET = async (req: Request) => {
    try {
        // Verify the ID token
        const response = authorizeRequest(req);
        if (!response) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(req.url);
        const page = Number.parseInt(<string>url.searchParams.get('page'));
        const size = Number.parseInt(<string>url.searchParams.get('size'));

        const items = await getInventoryItems(page, size);

        return NextResponse.json(items);
    }catch (error:any){
        console.error(error);
        return NextResponse.json({message: 'Error getting items', error: error.message}, {status: 500});
    }
}
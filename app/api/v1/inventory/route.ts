import {getInventoryItems, saveToInventory, verifyIdToken} from "@/firebase/firebaseAdmin";
import {NextResponse} from "next/server";

export const POST = async (req: Request) => {
    try {
        // Verify the ID token
        const res = await verifyIdToken(req);
        if (res.status == 401) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401})
        }
        const uid = new URL(req.url).searchParams.get("uid");
        if(!uid){
            return NextResponse.json("UID Not Provided", {status:401})
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
        const res = await verifyIdToken(req);
        if (res.status == 401) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401})
        }
        const uid = new URL(req.url).searchParams.get("uid");
        if(!uid){
            return NextResponse.json("UID Not Provided", {status:401})
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
import {updateItem, verifyIdToken} from "@/firebase/firebaseAdmin";
import {NextResponse} from "next/server";

export const PUT = async (req: Request) => {
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
        await updateItem(body);
        return NextResponse.json({message: 'Item saved successfully'}, {status: 200});
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({message:error.message}, {status: 500});
    }
};
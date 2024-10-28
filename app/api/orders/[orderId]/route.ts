import {getOrder, updateOrder, verifyIdToken} from "@/firebase/firebaseAdmin";
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
        await updateOrder(body);

        return NextResponse.json({message: 'Order updated successfully'});
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({message:error.message}, {status: 500});
    }
};
export const GET = async (req: Request) => {
    try {

        const res = await verifyIdToken(req);
        if (res.status == 401) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401})
        }
        const uid = new URL(req.url).searchParams.get("uid");

        if(!uid){
            return NextResponse.json("UID Not Provided", {status:401})
        }

        const url = new URL(req.url);
        const orderId = url.pathname.split('/')[3];

        const order = await getOrder(orderId);

        if (!order) {
            return NextResponse.json({message: 'Order not found'}, {status: 404});
        }

        return NextResponse.json(order);
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({message:error.message}, {status: 500});
    }
}
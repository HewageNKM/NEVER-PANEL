import {authorizeRequest, getOrder, updateOrder} from "@/firebase/firebaseAdmin";
import {NextResponse} from "next/server";

export const PUT = async (req: Request) => {
    try {
        // Verify the ID token
        const response = authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }

        const body = await req.json();
        await updateOrder(body);

        return NextResponse.json({message: 'Order updated successfully'});
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({message: error.message}, {status: 500});
    }
};
export const GET = async (req: Request) => {
    try {

        const response = authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
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
        return NextResponse.json({message: error.message}, {status: 500});
    }
}
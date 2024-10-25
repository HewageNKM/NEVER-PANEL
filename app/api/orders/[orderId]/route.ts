import {getOrder, updateOrder, verifyIdToken} from "@/firebase/firebaseAdmin";
import {NextResponse} from "next/server";

export const PUT = async (req: Request) => {
    try {
        // Verify the ID token
        await verifyIdToken(req);

        const body = await req.json();
        const result = await updateOrder(body);
        console.log(result);

        // Return a response with the
        if (!result) {
            return NextResponse.json({message: 'Error updating order'}, {status: 500});
        }

        return NextResponse.json({message: 'Order updated successfully'});
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({message: 'Error fetching orders', error: error.message}, {status: 500});
    }
};
export const GET = async (req: Request) => {
    try {
        // Verify the ID token
        await verifyIdToken(req);
        // Get the URL and parse the query parameters
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
        return NextResponse.json({message: 'Error fetching orders', error: error.message}, {status: 500});
    }
}
import {NextResponse} from "next/server";
import {authorizeRequest, getOrdersByDate} from "@/firebase/firebaseAdmin";

export const GET = async (req: Request) => {
    try {
        // Verify the ID token
        const response = await authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }
        const url = new URL(req.url);
        const date = url.searchParams.get('date') as string;
        const orders = await getOrdersByDate(date);
        // Return a response with the orders
        return NextResponse.json(orders);
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({message: 'Error fetching orders', error: error.message}, {status: 500});
    }
};
export const dynamic = 'force-dynamic';

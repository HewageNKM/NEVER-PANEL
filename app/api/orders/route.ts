import { NextResponse } from "next/server";
import {getOrders, verifyIdToken} from "@/firebase/firebaseAdmin";

export const GET = async (req: Request) => {
    try {
        // Verify the ID token
        await verifyIdToken(req);

        // Get the URL and parse the query parameters
        const url = new URL(req.url);
        const pageNumber = parseInt(url.searchParams.get('pageNumber') as string) || 1;
        const size = parseInt(url.searchParams.get('size') as string) || 20;

        console.log(pageNumber, size);
        const orders = await getOrders(pageNumber, size);
        console.log(orders);
        // Return a response with the orders
        return NextResponse.json(orders);
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({ message: 'Error fetching orders', error: error.message }, { status: 500 });
    }
};

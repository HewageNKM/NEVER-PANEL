import {authorizeRequest} from "@/lib/middleware";
import {NextResponse} from "next/server";
import {getTodayOrders} from "@/firebase/firebaseAdmin";

export const GET = async (req: Request) => {
    try {
        const response = authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }
        const orders = await getTodayOrders();
        return NextResponse.json(orders);
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({message: error.message}, {status: 500});
    }
}
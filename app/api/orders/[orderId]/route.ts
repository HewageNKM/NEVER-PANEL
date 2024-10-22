import {updateOrder, verifyIdToken} from "@/firebase/firebaseAdmin";
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
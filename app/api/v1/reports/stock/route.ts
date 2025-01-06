import {NextResponse} from "next/server";
import {authorizeRequest, getStockReport} from "@/firebase/firebaseAdmin";

export const GET = async (req: Request) => {
    try {
        // Verify the ID token
        const response = authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }
        const data = await getStockReport();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({message: 'Error fetching stock report', error: error.message}, {status: 500});
    }
};
export const dynamic = 'force-dynamic';

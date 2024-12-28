import {NextResponse} from "next/server";
import {getMonthlyOverview} from "@/firebase/firebaseAdmin";
import {authorizeRequest} from "@/lib/middleware";

export const GET = async (req: Request) => {
    try {
        // Verify the ID token
        const response = authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }
        const overview = await getMonthlyOverview();
        return NextResponse.json(overview);
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({message: 'Error fetching orders', error: error.message}, {status: 500});
    }
};
export const dynamic = 'force-dynamic';

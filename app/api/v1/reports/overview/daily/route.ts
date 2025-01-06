import {NextResponse} from "next/server";
import {authorizeRequest, getDailyOverview} from "@/firebase/firebaseAdmin";

export const GET = async (req: Request) => {
    try {
        // Verify the ID token
        const response = await authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }
        const overview = await getDailyOverview();
        return NextResponse.json(overview);
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({message: 'Error fetching daily overview', error: error.message}, {status: 500});
    }
};
export const dynamic = 'force-dynamic';

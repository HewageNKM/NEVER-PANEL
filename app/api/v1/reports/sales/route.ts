import {NextResponse} from "next/server";
import {authorizeRequest, getSaleReport} from "@/firebase/firebaseAdmin";

export const GET = async (req: Request) => {
    try {
        // Verify the ID token
        const response = await authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }
        let url = new URL(req.url);
        const fromDate = url.searchParams.get('fromDate') as string
        const toDate = url.searchParams.get('toDate') as string
        const data = await getSaleReport(fromDate, toDate);
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({message: 'Error fetching sale report', error: error.message}, {status: 500});
    }
};
export const dynamic = 'force-dynamic';

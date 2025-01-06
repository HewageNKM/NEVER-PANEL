import {NextResponse} from "next/server";
import {authorizeRequest, getExpensesReport} from "@/firebase/firebaseAdmin";

export const GET = async (req: Request) => {
    try {
        // Verify the ID token
        const response = await authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }
        let url = new URL(req.url);
        const fromDate = url.searchParams.get('from') as string
        const toDate = url.searchParams.get('to') as string
        const report = await getExpensesReport(fromDate, toDate);
        return NextResponse.json(report);
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({message: 'Error fetching expenses report', error: error.message}, {status: 500});
    }
};
export const dynamic = 'force-dynamic';

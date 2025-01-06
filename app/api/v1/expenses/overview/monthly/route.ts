import {authorizeRequest} from "@/lib/middleware";
import {NextResponse} from "next/server";
import {getExpensesOverview} from "@/firebase/firebaseAdmin";

export const GET = async (req: Request) => {
    try {
        // Verify the ID token
        const response = authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }
        const  url = new  URL(req.url);
        const from = <string>url.searchParams.get('from')
        const to = <string>url.searchParams.get('to')

        let allExpenses = await getExpensesOverview(from, to);
        return NextResponse.json(allExpenses);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({message: 'Error getting expenses overview', error: error.message}, {status: 500});
    }
}
import {authorizeRequest} from "@/lib/middleware";
import {NextResponse} from "next/server";
import {deleteExpenseById} from "@/firebase/firebaseAdmin";

export const DELETE = async (req: Request) => {
    try {
        // Verify the ID token
        const response = authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }

        const url = new URL(req.url);
        const expenseId = url.pathname.split('/').pop();
        await deleteExpenseById(expenseId);
        return NextResponse.json({message: 'expense deleted successfully'}, {status: 200});
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({message: 'Error deleting expenses', error: error.message}, {status: 500});
    }
}
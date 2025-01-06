import {NextResponse} from "next/server";
import {authorizeRequest, getUserById} from "@/firebase/firebaseAdmin";

export const GET = async (req: Request) => {
    try {
        const response = await authorizeRequest(req);

        if (!response) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const url = new URL(req.url);
        const uid = url.pathname.split('/').pop();
        const user = await getUserById(uid || "None");

        if (!user) {
            return NextResponse.json({message: 'User not found'}, {status: 404});
        }

        return NextResponse.json(user, {status: 200});
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({message: error.message}, {status: 500});
    }
}
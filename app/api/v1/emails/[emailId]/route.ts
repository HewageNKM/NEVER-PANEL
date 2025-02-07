import {authorizeRequest, deleteEmail} from "@/firebase/firebaseAdmin";
import {NextResponse} from "next/server";

export const DELETE = async (req: Request) => {
    try {
        const response = await authorizeRequest(req);

        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }

        const url = new URL(req.url);
        const emailId = url.pathname.split('/').pop();
        const timestamp = await deleteEmail(emailId || "None");
        return NextResponse.json({message: `Email deleted at ${timestamp}`}, {status: 200});
    } catch (e) {
        console.error(e);
        return NextResponse.json({message: e.message}, {status: 500});
    }
}
import {NextResponse} from "next/server";
import {authorizeRequest, getAllPaymentMethods} from "@/firebase/firebaseAdmin";
import {createPaymentMethod} from "@/actions/paymentMethodAction";

export const GET = async (req: Request) => {
    try {
        // Verify the ID token
        const response = await authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }
        const allPaymentMethods = await getAllPaymentMethods();
        return NextResponse.json(allPaymentMethods);
    } catch (error: any) {
        console.error(error);
        // Return a response with error message
        return NextResponse.json({message: 'Error fetching payment-methods', error: error.message}, {status: 500});
    }
};

export const POST = async (req: Request) => {
    try {
        // Verify the ID token
        const response = await authorizeRequest(req);
        if (!response) {
            return NextResponse.json({message: 'Unauthorized'}, {status: 401});
        }

        const body = await req.json();
        // Save payment method to database
        await createPaymentMethod(body);
        return NextResponse.json({message: 'Payment method saved successfully'}, {status: 200});
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({message: 'Error saving payment method', error: error.message}, {status: 500});
    }
}
export const dynamic = 'force-dynamic';

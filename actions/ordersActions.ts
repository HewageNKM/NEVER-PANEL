import {auth} from "@/firebase/firebaseClient";
import axios from "axios";

export const fetchOrders = async (page: number, size: number) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        console.log(`Token: ${token}`);
        const response = await axios({
            method: 'GET',
            url: `/api/v1/orders?size=${size}&page=${page}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}
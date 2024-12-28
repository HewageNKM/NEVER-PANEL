import {auth} from "@/firebase/firebaseClient";
import axios from "axios";
import {Order} from "@/interfaces";

export const fetchOrders = async (page: number, size: number) => {
    try {
        const token = await auth.currentUser?.getIdToken();
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

export const updateAOrder = async (order: Order) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const response = await axios({
            method: 'PUT',
            url: `/api/v1/orders/${order.orderId}`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(order)
        });
    } catch (e) {
        throw e;
    }
}
export const getReport = async (from:string,to:string) => {
    try {
        const token = auth.currentUser?.getIdToken();
        return await axios({
            method: 'GET',
            url: `/api/v1/reports/sales?fromDate=${from}&toDate=${to}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    }catch (e){
        throw e;
    }
}
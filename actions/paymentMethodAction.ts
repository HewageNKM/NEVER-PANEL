import {auth, getToken} from "@/firebase/firebaseClient";
import axios from "axios";
import {PaymentMethod} from "@/interfaces";

export const getAllPaymentMethod = async () => {
    try {
        const token = await getToken()
        let response = await axios({
            method: 'GET',
            url: '/api/v1/payment-methods',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}

export const createPaymentMethod = async (paymentMethod: PaymentMethod) => {
    try {
        const token = await getToken()
        let response = await axios({
            method: 'POST',
            url: '/api/v1/payment-methods',
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(paymentMethod)
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}

export const updatePaymentMethod = async (paymentMethod: PaymentMethod) => {
    try {
        const token = await getToken()
        return axios({
            method: 'PUT',
            url: `/api/v1/payment-methods/${paymentMethod.paymentId.toLowerCase()}`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(paymentMethod)
        });
    }catch (e) {
        throw e;
    }
}
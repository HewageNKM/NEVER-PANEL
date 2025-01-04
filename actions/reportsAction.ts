import {auth} from "@/firebase/firebaseClient";
import axios from "axios";

export const getMonthlyOverview = async (from: string, to: string) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const res = await axios(
            {
                method: 'GET',
                url: '/api/v1/reports/overview/monthly?from=' + from + '&to=' + to,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (e) {
        throw e;
    }
}
export const getDailyOverview = async () => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const res = await axios(
            {
                method: 'GET',
                url: '/api/v1/reports/overview/daily',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (e) {
        throw e;
    }
}
export const getStocksReport = async () => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const res = await axios(
            {
                method: 'GET',
                url: '/api/v1/reports/stock',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    } catch (e) {
        throw e;
    }
}

export const getCashReport = (from: string, to: string) => {
    try {
        const token = auth.currentUser?.getIdToken();
        return axios(
            {
                method: 'GET',
                url: '/api/v1/reports/cash?fromDate=' + from + '&toDate=' + to,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
    } catch (e) {
        throw e;
    }
}
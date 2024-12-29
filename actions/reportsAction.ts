import {auth} from "@/firebase/firebaseClient";
import axios from "axios";

export const getMonthlyOverview = async () => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const res = await axios(
            {
                method: 'GET',
                url: '/api/v1/reports/overview/monthly',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        return res.data;
    }catch (e){
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
    }catch (e){
        throw e;
    }
}
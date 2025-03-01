import {getToken} from "@/firebase/firebaseClient";
import axios from "axios";

export const addBannerAction = async (data: FormData) => {
    try {
        const token = await getToken()
        const response = await axios({
            method: 'POST',
            url: `/api/v1/setting/banners`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data"
            },
            data: data
        });

        return response.data;
    }catch (e) {
        throw new Error(
            e.response ? e.response.data.message : e.message
        )
    }
}

export const getBannersAction = async () => {
    try {
        const token = await getToken()
        const response = await axios({
            method: 'GET',
            url: `/api/v1/setting/banners`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    }catch (e) {
        throw new Error(
            e.response ? e.response.data.message : e.message
        )
    }
}

export const deleteBannerAction = async (id: string) => {
    try {
        const token = await getToken()
        const response = await axios({
            method: 'DELETE',
            url: `/api/v1/setting/banners/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    }catch (e) {
        throw new Error(
            e.response ? e.response.data.message : e.message
        )
    }
}
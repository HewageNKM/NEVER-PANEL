import axios from "axios";
import {getToken} from "@/firebase/firebaseClient";
import {User} from "@/model";

export const getUsersAction = async (page: number, size: number) => {
    try {
        const token = await getToken();
        const response = await axios({
            url: `/api/v1/users?page=${page}&size=${size}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (e) {
        throw new Error(
            e.response ? e.response.data.message : e.message
        )
    }
}
export const addNewUserAction = async (data: User) => {
    try {
        const token = await getToken();
        const response = await axios({
            url: `/api/v1/users`,
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(data)
        });
        return response.data;
    } catch (e) {
        throw new Error(
            e.response ? e.response.data.message : e.message
        )
    }
}

export const deleteUserByIdAction = async (id: string) => {
    try {
        const token = await getToken();
        axios({
            url: `/api/v1/users/${id}`,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (e) {
        throw new Error(
            e.response ? e.response.data.message : e.message
        )
    }
}

export const updateUserByIdAction = async (data: User) => {
    try {
        const token = await getToken();
        axios({
            url: `/api/v1/users/${data.userId}`,
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: JSON.stringify(data)
        })
    } catch (e) {
        throw new Error(
            e.response ? e.response.data.message : e.message
        )
    }
}
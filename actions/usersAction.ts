import axios from "axios";
import {getToken} from "@/firebase/firebaseClient";
import {User} from "@/interfaces";

export const getUsers = async (page: number, size: number) => {
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
    } catch (error: any) {
        throw error;
    }
}
export const addNewUser = async (data: User) => {
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
    } catch (error: any) {
        throw error;
    }
}

export const deleteUserById = async (id: string) => {
    try {
        const token = await getToken();
        axios({
            url: `/api/v1/users/${id}`,
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error: any) {
        throw error;
    }
}

export const updateUserById = async (data: User) => {
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
    } catch (error: any) {
        throw error;
    }
}
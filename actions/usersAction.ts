import axios from "axios";
import {getToken} from "@/firebase/firebaseClient";
import {User} from "@/interfaces";

export const getAllUsers = async (page:number,size:number) => {
    try {
        const token = await getToken();
        axios({
            url: `/api/v1/users?page=${page}&size=${size}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
    } catch (error: any) {
        throw error;
    }
}

export const getUserById = async (id: string) => {
    try {
        const token = await getToken();
        axios({
            url: `/api/v1/users/${id}`,
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
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
            url: `/api/v1/users/${data.}`,
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
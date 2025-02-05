"use client"
import axios from "axios";
import {getToken} from "@/firebase/firebaseClient";
import {Item} from "@/interfaces";

export const fetchInventory = async (size: number, page: number) => {
    try {
        const token = await getToken()
        const response = await axios({
            method: 'GET',
            url: `/api/v1/inventory?size=${size}&page=${page}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (e) {
        throw new Error(e.response.data.message)
    }
}
export const fetchAItem = async (itemId: string) => {
    try {
        const token = await getToken()
        const response = await axios({
            method: 'GET',
            url: `/api/v1/inventory/${itemId}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (e) {
        throw new Error(e.response.data.message)
    }
}
export const updateAItem = async (item: Item) => {
    try {
        const token = await getToken()
        const response = await axios({
            method: 'PUT',
            url: `/api/v1/inventory/${item.itemId}`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(item)
        })
    } catch (e) {
        throw new Error(e.response.data.message)
    }
}

export const addAItem = async (item: Item) => {
    try {
        const token = await getToken()
        const response = await axios({
            method: 'POST',
            url: `/api/v1/inventory`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(item)
        })
    } catch (e) {
        throw new Error(e.response.data.message)
    }
}
export const uploadAFile = async (file: File, path: string) => {
    try {
        const token = await getToken()
        const formData = new FormData();
        formData.append('file', file);
        formData.append('path', path);

        const response = await axios({
            method: 'POST',
            url: `/api/v1/storage`,
            headers: {
                Authorization: `Bearer ${token}`
            },
            data: formData
        });

        return response.data;
    } catch (e) {
        throw new Error(e.response.data.message)
    }
}
export const deleteAItem = async (itemId: string) => {
    try {
        const token = await getToken()
        const response = await axios({
            method: 'DELETE',
            url: `/api/v1/inventory/${itemId}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (e) {
        throw new Error(e.response.data.message)
    }
}
export const deleteAFile = async (path: string) => {
    try {
        const token = await getToken()
        const response = await axios({
            method: 'DELETE',
            url: `/api/v1/storage?path=${path}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (e) {
        throw new Error(e.response.data.message)
    }
}

export const getPopularItems = async (size: number) => {
    try {
        const token = await getToken()
        const response = await axios({
            method: 'GET',
            url: `/api/v1/inventory/popular?size=${size}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        return response.data;
    } catch (e) {
        throw new Error(e.response.data.message)
    }
}
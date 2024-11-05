"use client"
import axios from "axios";
import {auth} from "@/firebase/firebaseClient";

export const fetchInventory = async (size:number,page:number) => {
    const token = await auth.currentUser?.getIdToken();
    const uid = auth.currentUser?.uid;

    const response = await axios({
        method: 'GET',
        url: `/api/v1/inventory?size=${size}&page=${page}&uid=${uid}`,
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    return response.data;
}
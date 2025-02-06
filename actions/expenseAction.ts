import axios from "axios";
import {getToken} from "@/firebase/firebaseClient";
import {Expense} from "@/interfaces";

export const addNewExpense = async (expense: Expense) => {
    try {
        const token = await getToken()
        const response = await axios({
            method: 'POST',
            url: `/api/v1/expenses`,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify(expense)
        });
        return response.data;
    } catch (e) {
        throw new Error(
            e.response ? e.response.data.message : e.message
        )
    }
}

export const getAllExpenses = async (page: number, size: number) => {
    try {
        const token = await getToken()
        const response = await axios({
            method: 'GET',
            url: `/api/v1/expenses?page=${page}&size=${size}`,
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
export const getAllExpensesByDate = async (from: string, to: string) => {
    try {
        const token = await getToken()
        const response = await axios({
            method: 'GET',
            url: `/api/v1/expenses?from=${from}&to=${to}`,
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
export const deleteExpenseById = async (id: string) => {
    try {
        const token = await getToken()
        const response = await axios({
            method: 'DELETE',
            url: `/api/v1/expenses/${id}`,
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
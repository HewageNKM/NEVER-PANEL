import {Expense} from "@/app/dashboard/expenses/components/Header";
import axios from "axios";
import {auth} from "@/firebase/firebaseClient";

export const addNewExpense = async (expense: Expense) => {
    try {
        const token = await auth.currentUser?.getIdToken();
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
        throw e
    }
}

export const getAllExpenses = async (page: number, size: number) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const response = await axios({
            method: 'GET',
            url: `/api/v1/expenses?page=${page}&size=${size}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}
export const getAllExpensesByDate = async (from: string, to: string) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const response = await axios({
            method: 'GET',
            url: `/api/v1/expenses?from=${from}&to=${to}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}
export const deleteExpenseById = async (id: string) => {
    try {
        const token = await auth.currentUser?.getIdToken();
        const response = await axios({
            method: 'DELETE',
            url: `/api/v1/expenses/${id}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return response.data;
    } catch (e) {
        throw e;
    }
}
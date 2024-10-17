import {Order} from "@/interfaces";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {getToken} from "@/firebase/firebaseClient";

interface OrderSlice {
    orders: Order[]
}

const initialState: OrderSlice = {
    orders: []
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrders: (state, action: PayloadAction<Order[]>) => {
            state.orders = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchOrders.fulfilled, (state, action) => {
            state.orders = action.payload;
        });
    }
})

export const fetchOrders = createAsyncThunk('order/fetchOrders', async ({pageNumber, size}: {
    pageNumber: number,
    size: number
}, thunkAPI) => {
    try {
        const token = await getToken();
        const response = await axios({
            method: 'GET',
            url: `/api/orders`,
            params: {
                pageNumber,
                size
            },
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        return thunkAPI.rejectWithValue({message: 'Error fetching orders', error});
    }
});
export const {setOrders} = orderSlice.actions;
export default orderSlice.reducer;
import {Order} from "@/interfaces";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import axios from "axios";
import {getToken} from "@/firebase/firebaseClient";
import {orderStatus} from "@/constant";

interface OrderSlice {
    orders: Order[]
    selectedSort: orderStatus,
    page: number,
    size: number
}

const initialState: OrderSlice = {
    selectedSort: "",
    orders: [],
    page: 1,
    size: 20
}

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrders: (state, action: PayloadAction<Order[]>) => {
            state.orders = action.payload;
        },
        setSelectedSort: (state, action: PayloadAction<orderStatus>) => {
            console.log(action.payload);
            state.selectedSort = action.payload;
        },
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setSize: (state, action: PayloadAction<number>) => {
            state.size = action.payload;
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchOrders.fulfilled, (state, action) => {
            state.orders = action.payload;

        }).addCase(sortOrders.fulfilled, (state, action) => {
            const originals: Order[] = action.payload;
            if (state.selectedSort === orderStatus.PROCESSING) {
                console.log('Processing');
                state.orders = originals.filter(order => order.tracking === undefined);
            } else if (state.selectedSort === orderStatus.SHIPPED) {
                state.orders = originals.filter(order => order.tracking?.status === orderStatus.SHIPPED);
            } else if (state.selectedSort === orderStatus.DELIVERED) {
                state.orders = originals.filter(order => order.tracking?.status === orderStatus.DELIVERED);
            } else if (state.selectedSort === orderStatus.CANCELLED) {
                state.orders = originals.filter(order => order.tracking?.status === orderStatus.CANCELLED);
            } else if (state.selectedSort === orderStatus.RETURNED) {
                state.orders = originals.filter(order => order.tracking?.status === orderStatus.RETURNED);
            } else {
                state.orders = originals
            }
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
export const sortOrders = createAsyncThunk('order/sortOrders', async ({page,size}:{page:number,size:number}, thunkAPI) => {
    try {
        const token = await getToken();
        const response = await axios({
            method: 'GET',
            url: `/api/orders`,
            params: {
                pageNumber:page,
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
export const {setOrders, setSelectedSort,setPage,setSize} = orderSlice.actions;
export default orderSlice.reducer;